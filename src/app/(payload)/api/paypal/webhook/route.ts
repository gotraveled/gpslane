import { getPayloadClient } from '../../../../../lib/storefront'

const PAYPAL_API = process.env.PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'

async function verifyWebhook(body: string, headers: Headers): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID
  if (!webhookId) return true // verification skipped when webhook id not configured
  try {
    const id = process.env.PAYPAL_CLIENT_ID
    const secret = process.env.PAYPAL_CLIENT_SECRET
    const tokenRes = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    })
    const tokenData: any = await tokenRes.json()
    const verifyRes = await fetch(`${PAYPAL_API}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenData.access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transmission_id: headers.get('paypal-transmission-id'),
        transmission_time: headers.get('paypal-transmission-time'),
        cert_url: headers.get('paypal-cert-url'),
        auth_algo: headers.get('paypal-auth-algo'),
        transmission_sig: headers.get('paypal-transmission-sig'),
        webhook_id: webhookId,
        webhook_event: JSON.parse(body),
      }),
    })
    const result: any = await verifyRes.json()
    return result?.verification_status === 'SUCCESS'
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  const raw = await req.text()
  if (!(await verifyWebhook(raw, req.headers))) {
    return new Response('unverified', { status: 401 })
  }

  let event: any
  try {
    event = JSON.parse(raw)
  } catch {
    return new Response('bad json', { status: 400 })
  }

  const type: string = event?.event_type ?? ''
  if (type === 'PAYMENT.CAPTURE.COMPLETED' || type === 'CHECKOUT.ORDER.APPROVED') {
    const capture = event?.resource ?? {}
    const orderId = capture?.supplementary_data?.related_ids?.order_id ?? capture?.id
    try {
      const payload = await getPayloadClient()
      const found = await payload.find({
        collection: 'orders',
        where: { or: [{ paypalOrderId: { equals: orderId } }, { paypalCaptureId: { equals: capture?.id } }] },
        limit: 1,
        depth: 0,
      })
      const order: any = found.docs[0]
      if (order && order.status === 'pending') {
        // If PayPal says capture completed but we never captured via redirect,
        // mark paid directly (customer may have closed the tab).
        const captureId = type === 'PAYMENT.CAPTURE.COMPLETED' ? capture?.id : order.paypalCaptureId
        await payload.update({
          collection: 'orders',
          id: order.id,
          overrideAccess: true,
          data: { status: 'paid', paidAt: new Date().toISOString(), paypalCaptureId: captureId ?? order.paypalCaptureId },
        })
      }
    } catch {
      return new Response('processing error', { status: 500 })
    }
  }

  return new Response('ok', { status: 200 })
}

const PAYPAL_API = process.env.PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'

let cachedToken: { token: string; expiresAt: number } | null = null

async function accessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) return cachedToken.token
  const id = process.env.PAYPAL_CLIENT_ID
  const secret = process.env.PAYPAL_CLIENT_SECRET
  if (!id || !secret) throw new Error('PayPal credentials not configured')
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  if (!res.ok) throw new Error(`PayPal auth failed: ${res.status}`)
  const data: any = await res.json()
  cachedToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 }
  return cachedToken.token
}

export async function paypalCreateOrder(params: {
  amountUsd: number
  description: string
  returnUrl: string
  cancelUrl: string
}): Promise<{ id: string; approveUrl: string }> {
  const token = await accessToken()
  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          description: params.description.slice(0, 127),
          amount: { currency_code: 'USD', value: params.amountUsd.toFixed(2) },
        },
      ],
      application_context: {
        return_url: params.returnUrl,
        cancel_url: params.cancelUrl,
        user_action: 'PAY_NOW',
        brand_name: 'GPSLane',
      },
    }),
  })
  if (!res.ok) throw new Error(`PayPal create order failed: ${res.status} ${await res.text()}`)
  const data: any = await res.json()
  const approve = (data.links ?? []).find((l: any) => l.rel === 'approve')?.href
  if (!approve) throw new Error('PayPal order missing approval link')
  return { id: data.id, approveUrl: approve }
}

export async function paypalCaptureOrder(orderId: string): Promise<{ captureId: string; status: string }> {
  const token = await accessToken()
  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: '{}',
  })
  if (!res.ok) throw new Error(`PayPal capture failed: ${res.status} ${await res.text()}`)
  const data: any = await res.json()
  const capture = data.purchase_units?.[0]?.payments?.captures?.[0]
  return { captureId: capture?.id ?? '', status: data.status ?? capture?.status ?? 'UNKNOWN' }
}

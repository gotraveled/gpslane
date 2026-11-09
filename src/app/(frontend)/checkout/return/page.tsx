import Link from 'next/link'
import { getPayloadClient } from '../../../../lib/storefront'
import { paypalCaptureOrder } from '../../../../lib/paypal'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Order Confirmation | GPSLane', robots: { index: false } }

export default async function CheckoutReturnPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order: orderId } = await searchParams
  let result: { ok: boolean; orderNumber?: string; message?: string } = { ok: false, message: 'Missing order reference.' }

  if (orderId) {
    try {
      const payload = await getPayloadClient()
      const found = await payload.find({ collection: 'orders', where: { id: { equals: orderId } }, limit: 1, depth: 0 })
      const order: any = found.docs[0]
      if (order?.paypalOrderId && order.status === 'pending') {
        const cap = await paypalCaptureOrder(order.paypalOrderId)
        if (cap.status === 'COMPLETED') {
          await payload.update({
            collection: 'orders', id: order.id, overrideAccess: true,
            data: { status: 'paid', paidAt: new Date().toISOString(), paypalCaptureId: cap.captureId },
          })
          result = { ok: true, orderNumber: order.orderNumber }
        } else {
          result = { ok: false, orderNumber: order.orderNumber, message: `Payment status: ${cap.status}` }
        }
      } else if (order?.status === 'paid') {
        result = { ok: true, orderNumber: order.orderNumber }
      } else {
        result = { ok: false, message: 'Order not found or already processed.' }
      }
    } catch (e: any) {
      result = { ok: false, message: 'We could not confirm your payment. If you were charged, contact info@gpslane.com with your PayPal receipt.' }
    }
  }

  return (
    <div className="container prose" style={{ padding: '3rem 1.25rem', maxWidth: 720 }}>
      {result.ok ? (
        <>
          <h1>✅ Order Confirmed</h1>
          <p className="lede">Thank you — your payment was successful.</p>
          <div className="notice">
            <strong>Order number:</strong> {result.orderNumber}<br />
            A confirmation email is on its way to your inbox. Our team will process and ship your order
            within 2–5 business days and send tracking details by email.
          </div>
          <p><Link href="/shop" className="btn btn-primary">Continue Shopping</Link></p>
        </>
      ) : (
        <>
          <h1>Payment Not Completed</h1>
          <p className="lede">{result.message}</p>
          <p>No charge was made unless PayPal shows a completed payment. You can try again or contact us.</p>
          <p>
            <Link href="/shop" className="btn btn-ghost">Back to Shop</Link>{' '}
            <a href="mailto:info@gpslane.com" className="btn btn-primary">Contact Support</a>
          </p>
        </>
      )}
    </div>
  )
}

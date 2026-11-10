import Link from 'next/link'
import { getPayloadClient } from '../../../../lib/storefront'
import { paypalCaptureOrder } from '../../../../lib/paypal'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Order Confirmation | GPS Lane', robots: { index: false } }

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
          try {
            const rows = (order.items ?? []).map((i: any) =>
              `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${i.name}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">$${((i.unitPriceCents * i.quantity) / 100).toFixed(2)}</td></tr>`,
            ).join('')
            await payload.sendEmail({
              to: order.customerEmail,
              subject: `GPS Lane order confirmed — ${order.orderNumber}`,
              text: `Hi ${order.customerName}, your GPS Lane order ${order.orderNumber} is confirmed. Total: $${(order.totalCents / 100).toFixed(2)}.`,
              html: `
                <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#222">
                  <div style="background:#227000;padding:20px 24px;border-radius:12px 12px 0 0">
                    <h1 style="color:#fff;margin:0;font-size:22px">Order Confirmed ✓</h1>
                  </div>
                  <div style="border:1px solid #e5e9f0;border-top:none;border-radius:0 0 12px 12px;padding:24px">
                    <p>Hi ${order.customerName},</p>
                    <p>Thank you for your purchase! Your order <strong>${order.orderNumber}</strong> is confirmed and being prepared for shipment.</p>
                    <table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0">
                      <thead><tr style="color:#6b7280;font-size:12px;text-transform:uppercase"><th style="text-align:left;padding-bottom:8px;border-bottom:1px solid #ddd">Item</th><th style="padding-bottom:8px;border-bottom:1px solid #ddd">Qty</th><th style="text-align:right;padding-bottom:8px;border-bottom:1px solid #ddd">Price</th></tr></thead>
                      <tbody>${rows}</tbody>
                      <tfoot><tr><td colspan="2" style="padding-top:12px;font-weight:700">Total paid</td><td style="padding-top:12px;text-align:right;font-weight:700">$${(order.totalCents / 100).toFixed(2)} ${String(order.currency).toUpperCase()}</td></tr></tfoot>
                    </table>
                    <p>We will process and ship within <strong>2–5 business days</strong> and send tracking details to this email.</p>
                    <p style="color:#6b7280;font-size:13px;margin-top:24px">Questions? Call <a href="tel:+18449667866" style="color:#227000">+1 (844) 966-7866</a> or email <a href="mailto:info@gpslane.com" style="color:#227000">info@gpslane.com</a>.</p>
                    <p style="color:#6b7280;font-size:13px">— The GPS Lane Team</p>
                  </div>
                </div>`,
            })
          } catch { /* email optional */ }
          result = { ok: true, orderNumber: order.orderNumber }
        } else {
          result = { ok: false, orderNumber: order.orderNumber, message: `Payment status: ${cap.status}` }
        }
      } else if (order?.status === 'paid') {
        result = { ok: true, orderNumber: order.orderNumber }
      } else {
        result = { ok: false, message: 'Order not found or already processed.' }
      }
    } catch {
      result = { ok: false, message: 'We could not confirm your payment. If you were charged, contact info@gpslane.com with your PayPal receipt.' }
    }
  }

  return (
    <div className="container" style={{ padding: '0.5rem 1.25rem 2.5rem' }}>
      <div style={{ margin: '0 auto', textAlign: 'center' }}>
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
    </div>
  )
}

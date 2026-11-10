import type { Payload } from 'payload'

/**
 * Finds orders still 'pending' (payment started, never completed) older than
 * `olderThanHours`, sends one reminder email, and flags them so we never
 * email twice.
 */
export async function sendAbandonedCartReminders({
  payload,
  olderThanHours = 2,
  siteUrl = 'https://gpslane.com',
}: {
  payload: Payload
  olderThanHours?: number
  siteUrl?: string
}) {
  const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000).toISOString()
  const stale = await payload.find({
    collection: 'orders',
    where: {
      and: [
        { status: { equals: 'pending' } },
        { createdAt: { less_than: cutoff } },
        { or: [{ reminderSent: { equals: false } }, { reminderSent: { exists: false } }] },
      ],
    },
    limit: 50,
    depth: 0,
    overrideAccess: true,
  })

  let sent = 0
  for (const order of stale.docs as any[]) {
    try {
      const items = (order.items ?? [])
        .map((i: any) => `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${i.name}</td><td style="text-align:center;padding:8px 0;border-bottom:1px solid #eee">${i.quantity}</td></tr>`)
        .join('')
      await payload.sendEmail({
        to: order.customerEmail,
        subject: `You left something behind — GPS Lane order ${order.orderNumber}`,
        text: `Hi ${order.customerName}, your GPS Lane order ${order.orderNumber} is still waiting. Complete checkout here: ${siteUrl}/cart`,
        html: `
          <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#222">
            <div style="background:#227000;padding:20px 24px;border-radius:12px 12px 0 0">
              <h1 style="color:#fff;margin:0;font-size:20px">Still thinking it over?</h1>
            </div>
            <div style="border:1px solid #e5e9f0;border-top:none;border-radius:0 0 12px 12px;padding:24px">
              <p>Hi ${order.customerName},</p>
              <p>You started checkout for order <strong>${order.orderNumber}</strong> but didn't finish — your items are still reserved at today's price:</p>
              <table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0">${items}</table>
              <p style="text-align:center;margin:24px 0">
                <a href="${siteUrl}/cart" style="background:#227000;color:#fff;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:700">Complete My Order</a>
              </p>
              <p style="color:#6b7280;font-size:13px">Changed your mind? No problem — just ignore this email. Questions? Call <a href="tel:+18449667866" style="color:#227000">+1 (844) 966-7866</a>.</p>
            </div>
          </div>`,
      })
      await payload.update({
        collection: 'orders', id: order.id, overrideAccess: true,
        data: { reminderSent: true },
      })
      sent++
    } catch { /* skip and retry next run */ }
  }
  return { scanned: stale.docs.length, sent }
}

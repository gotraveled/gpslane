'use server'

import { getPayloadClient, priceFor, availabilityFor } from '../../../lib/storefront'
import { paypalCreateOrder } from '../../../lib/paypal'

export type PlaceOrderItem = { productSlug: string; variantId: number; qty: number }
export type PlaceOrderState = { ok: boolean; message: string; redirect?: string; paypalOrderId?: string; orderId?: number }

export async function placeOrder(input: {
  items: PlaceOrderItem[]
  country: 'US' | 'CA'
  customer: {
    fullName: string; email: string; phone: string
    addressLine1: string; addressLine2?: string; city: string; state?: string; postalCode: string
  }
  createAccount?: { password: string }
}): Promise<PlaceOrderState> {
  const { customer } = input
  const str = (v?: string) => (v ?? '').trim()

  if (!input.items?.length) return { ok: false, message: 'Your cart is empty.' }
  if (!str(customer.fullName)) return { ok: false, message: 'Please enter your name.' }
  if (!/^\S+@\S+\.\S+$/.test(str(customer.email))) return { ok: false, message: 'Please enter a valid email address.' }
  if (!str(customer.phone)) return { ok: false, message: 'Please enter your phone number.' }
  if (!str(customer.addressLine1) || !str(customer.city) || !str(customer.postalCode)) {
    return { ok: false, message: 'Please complete your shipping address.' }
  }
  if (input.createAccount && (input.createAccount.password ?? '').length < 8) {
    return { ok: false, message: 'Account password must be at least 8 characters.' }
  }

  try {
    const payload = await getPayloadClient()

    // Validate + price every item server-side (never trust client prices)
    const country = input.country === 'CA' ? 'CA' : 'US'
    const currency: 'usd' | 'cad' = country === 'CA' ? 'cad' : 'usd'
    const orderItems: any[] = []
    let subtotalCents = 0
    let shippingCents = 0
    const descriptions: string[] = []

    for (const item of input.items.slice(0, 20)) {
      const qty = Math.min(Math.max(1, Math.floor(item.qty || 1)), 10)
      const found = await payload.find({ collection: 'products', where: { slug: { equals: item.productSlug }, status: { equals: 'published' } }, limit: 1, depth: 0 })
      const product: any = found.docs[0]
      if (!product) return { ok: false, message: `Product unavailable: ${item.productSlug}` }
      const variants = await payload.find({ collection: 'product-variants', where: { and: [{ product: { equals: product.id } }, { status: { equals: 'active' } }] }, limit: 20, depth: 0 })
      const variant: any = variants.docs.find((v: any) => v.id === item.variantId)
      if (!variant) return { ok: false, message: `Option unavailable for ${product.name}.` }
      const avail = availabilityFor(variant, country)
      if (!avail?.available) return { ok: false, message: `${product.name} is not available for your region.` }
      const unit = Math.round((priceFor(variant, currency) ?? priceFor(variant, 'usd') ?? 0) * 100)
      if (unit <= 0) return { ok: false, message: `Pricing not configured for ${product.name}.` }
      const ship = avail.shippingCostCents ?? 0
      subtotalCents += unit * qty
      shippingCents += ship * qty
      descriptions.push(`${product.name}${variant.name ? ` (${variant.name})` : ''} x${qty}`)
      orderItems.push({
        product: product.id, variant: variant.id,
        name: `${product.name}${variant.name ? ` — ${variant.name}` : ''}`,
        sku: variant.sku ?? undefined, quantity: qty,
        unitPriceCents: unit, currency,
      })
    }

    const totalCents = subtotalCents + shippingCents
    const orderNumber = `GPS-${Date.now().toString(36).toUpperCase()}`
    const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gpslane.com'

    // Optional account creation
    if (input.createAccount) {
      const email = str(customer.email).toLowerCase()
      const existing = await payload.find({ collection: 'customers', where: { email: { equals: email } }, limit: 1, depth: 0 })
      if (existing.totalDocs === 0) {
        await payload.create({
          collection: 'customers',
          data: { email, password: input.createAccount.password, name: str(customer.fullName), phone: str(customer.phone) },
        })
      }
    }

    const order: any = await payload.create({
      collection: 'orders',
      overrideAccess: true,
      data: {
        orderNumber,
        customerName: str(customer.fullName),
        customerEmail: str(customer.email).toLowerCase(),
        customerPhone: str(customer.phone),
        items: orderItems,
        shippingAddress: {
          line1: str(customer.addressLine1), line2: str(customer.addressLine2) || undefined,
          city: str(customer.city), state: str(customer.state), postalCode: str(customer.postalCode), country: country === 'CA' ? 'Canada' : 'United States',
        },
        subtotalCents, shippingCents, totalCents,
        currency,
        status: 'pending',
      },
    })

    const pp = await paypalCreateOrder({
      amount: totalCents / 100,
      currencyCode: currency.toUpperCase(),
      description: `GPSLane order ${orderNumber} — ${descriptions[0]}${descriptions.length > 1 ? ` +${descriptions.length - 1} more` : ''}`.slice(0, 127),
      returnUrl: `${site}/checkout/return?order=${order.id}`,
      cancelUrl: `${site}/checkout/cancel`,
    })

    await payload.update({ collection: 'orders', id: order.id, overrideAccess: true, data: { paypalOrderId: pp.id } })
    return { ok: true, message: '', redirect: pp.approveUrl, paypalOrderId: pp.id, orderId: order.id }
  } catch (e: any) {
    return { ok: false, message: e?.message?.includes('PayPal') ? 'Payment provider error — please try again or call +1 (844) 966-7866.' : 'Something went wrong. Please try again.' }
  }
}

export async function paypalClientId(): Promise<string> {
  return process.env.PAYPAL_CLIENT_ID ?? ''
}

export type CaptureState = { ok: boolean; message: string; orderNumber?: string }

/** Capture an approved PayPal order and mark the DB order paid (used by inline checkout). */
export async function captureOrder({ orderId }: { orderId: number }): Promise<CaptureState> {
  try {
    const payload = await getPayloadClient()
    const found = await payload.find({ collection: 'orders', where: { id: { equals: orderId } }, limit: 1, depth: 0 })
    const order: any = found.docs[0]
    if (!order?.paypalOrderId) return { ok: false, message: 'Order not found.' }
    if (order.status === 'paid') return { ok: true, message: '', orderNumber: order.orderNumber }

    const { paypalCaptureOrder } = await import('../../../lib/paypal')
    const cap = await paypalCaptureOrder(order.paypalOrderId)
    if (cap.status !== 'COMPLETED') return { ok: false, message: `Payment status: ${cap.status}` }

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
        subject: `GPSLane order confirmed — ${order.orderNumber}`,
        text: `Hi ${order.customerName}, your GPSLane order ${order.orderNumber} is confirmed. Total: $${(order.totalCents / 100).toFixed(2)}.`,
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
              <p style="color:#6b7280;font-size:13px">— The GPSLane Team</p>
            </div>
          </div>`,
      })
    } catch { /* email optional */ }
    return { ok: true, message: '', orderNumber: order.orderNumber }
  } catch {
    return { ok: false, message: 'We could not confirm your payment. If you were charged, contact info@gpslane.com.' }
  }
}

'use server'

import { getPayloadClient, priceFor, availabilityFor } from '../../../lib/storefront'
import { paypalCreateOrder } from '../../../lib/paypal'

export type PlaceOrderItem = { productSlug: string; variantId: number; qty: number }
export type PlaceOrderState = { ok: boolean; message: string; redirect?: string }

export async function placeOrder(input: {
  items: PlaceOrderItem[]
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
      const avail = availabilityFor(variant, 'US')
      if (!avail?.available) return { ok: false, message: `${product.name} is not available for your region.` }
      const unit = Math.round((priceFor(variant, 'usd') ?? 0) * 100)
      if (unit <= 0) return { ok: false, message: `Pricing not configured for ${product.name}.` }
      const ship = avail.shippingCostCents ?? 0
      subtotalCents += unit * qty
      shippingCents += ship * qty
      descriptions.push(`${product.name}${variant.name ? ` (${variant.name})` : ''} x${qty}`)
      orderItems.push({
        product: product.id, variant: variant.id,
        name: `${product.name}${variant.name ? ` — ${variant.name}` : ''}`,
        sku: variant.sku ?? undefined, quantity: qty,
        unitPriceCents: unit, currency: 'usd',
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
          city: str(customer.city), state: str(customer.state), postalCode: str(customer.postalCode), country: 'US',
        },
        subtotalCents, shippingCents, totalCents,
        currency: 'usd',
        status: 'pending',
      },
    })

    const pp = await paypalCreateOrder({
      amountUsd: totalCents / 100,
      description: `GPSLane order ${orderNumber} — ${descriptions[0]}${descriptions.length > 1 ? ` +${descriptions.length - 1} more` : ''}`.slice(0, 127),
      returnUrl: `${site}/checkout/return?order=${order.id}`,
      cancelUrl: `${site}/checkout/cancel`,
    })

    await payload.update({ collection: 'orders', id: order.id, overrideAccess: true, data: { paypalOrderId: pp.id } })
    return { ok: true, message: '', redirect: pp.approveUrl }
  } catch (e: any) {
    return { ok: false, message: e?.message?.includes('PayPal') ? 'Payment provider error — please try again or call +1 (844) 966-7866.' : 'Something went wrong. Please try again.' }
  }
}

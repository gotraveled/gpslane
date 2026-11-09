'use server'

import { getPayloadClient, priceFor, availabilityFor } from '../../../lib/storefront'
import { paypalCreateOrder } from '../../../lib/paypal'

export type CheckoutState = { ok: boolean; message: string; redirect?: string }

export async function startCheckout(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const str = (k: string) => String(formData.get(k) ?? '').trim()
  const slug = str('productSlug')
  const variantId = Number(str('variantId'))
  const country = str('country') === 'ca' ? 'CA' : 'US'

  if (!str('fullName')) return { ok: false, message: 'Please enter your name.' }
  if (!str('email') || !/^\S+@\S+\.\S+$/.test(str('email'))) return { ok: false, message: 'Please enter a valid email address.' }
  if (!str('phone')) return { ok: false, message: 'Please enter your phone number.' }
  if (!str('addressLine1') || !str('city') || !str('postalCode')) {
    return { ok: false, message: 'Please complete your shipping address.' }
  }
  if (!slug || !variantId) return { ok: false, message: 'Missing product information.' }

  try {
    const payload = await getPayloadClient()
    const found = await payload.find({ collection: 'products', where: { slug: { equals: slug }, status: { equals: 'published' } }, limit: 1, depth: 0 })
    const product: any = found.docs[0]
    if (!product) return { ok: false, message: 'Product not found.' }

    const variants = await payload.find({ collection: 'product-variants', where: { and: [{ product: { equals: product.id } }, { status: { equals: 'active' } }] }, limit: 20, depth: 0 })
    const variant: any = variants.docs.find((v: any) => v.id === variantId)
    if (!variant) return { ok: false, message: 'This option is not available.' }

    const availability = availabilityFor(variant, country === 'CA' ? 'CA' : 'US')
    if (!availability?.available) return { ok: false, message: 'This item is not available in your region.' }

    const unitCents = Math.round((priceFor(variant, 'usd') ?? 0) * 100)
    const shippingCents = availability.shippingCostCents ?? 0
    if (unitCents <= 0) return { ok: false, message: 'Pricing is not configured for this item yet.' }
    const totalCents = unitCents + shippingCents

    const orderNumber = `GPS-${Date.now().toString(36).toUpperCase()}`
    const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gpslane.com'
    const order: any = await payload.create({
      collection: 'orders',
      overrideAccess: true,
      data: {
        orderNumber,
        customerName: str('fullName'),
        customerEmail: str('email'),
        customerPhone: str('phone'),
        items: [{
          product: product.id,
          variant: variant.id,
          name: `${product.name}${variant.name ? ` — ${variant.name}` : ''}`,
          sku: variant.sku ?? undefined,
          quantity: 1,
          unitPriceCents: unitCents,
          currency: 'usd',
        }],
        shippingAddress: {
          line1: str('addressLine1'), line2: str('addressLine2') || undefined,
          city: str('city'), state: str('state'), postalCode: str('postalCode'), country,
        },
        subtotalCents: unitCents,
        shippingCents,
        totalCents,
        currency: 'usd',
        status: 'pending',
      },
    })

    const pp = await paypalCreateOrder({
      amountUsd: totalCents / 100,
      description: `${product.name} — GPSLane order ${orderNumber}`,
      returnUrl: `${site}/checkout/return?order=${order.id}`,
      cancelUrl: `${site}/checkout/cancel`,
    })

    await payload.update({ collection: 'orders', id: order.id, overrideAccess: true, data: { paypalOrderId: pp.id } })
    return { ok: true, message: '', redirect: pp.approveUrl }
  } catch (e: any) {
    return { ok: false, message: e?.message?.includes('PayPal') ? 'Payment provider error — please try again or call +1 (844) 966-7866.' : 'Something went wrong. Please try again.' }
  }
}

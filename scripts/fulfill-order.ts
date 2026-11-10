/**
 * Forward a PAID order to its supplier for fulfilment.
 * Usage: npx tsx scripts/fulfill-order.ts <orderNumber>
 *        npx tsx scripts/fulfill-order.ts <orderNumber> --dry
 *
 * Resolves each order item -> variant -> supplier-products mapping,
 * then calls the supplier order API (CJ createOrderV2 supported).
 * EPROLO items are reported for manual placement until their order
 * flow is validated with a real test order.
 */
import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
import { getPayload } from 'payload'

const B = 'https://developers.cjdropshipping.com/api2.0/v1'
const DRY = process.argv.includes('--dry')
const orderNumber = process.argv.find((a) => /^GPS-/.test(a) || /^\d+$/.test(a))

let token: string | null = null
async function cj(path: string, body?: any) {
  if (!token) {
    const r = await fetch(`${B}/authentication/getAccessToken`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: process.env.CJDROPSHIPPING_API_KEY }),
    })
    token = (await r.json())?.data?.accessToken
  }
  const res = await fetch(`${B}${path}`, {
    method: 'POST',
    headers: { 'CJ-Access-Token': token!, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json() as Promise<any>
}

async function main() {
  if (!orderNumber) { console.error('usage: npx tsx scripts/fulfill-order.ts <orderNumber|orderId> [--dry]'); process.exit(1) }
  const { default: cfg } = await import('../src/payload.config')
  const payload = await getPayload({ config: cfg })

  const found = await payload.find({
    collection: 'orders',
    where: { or: [{ orderNumber: { equals: orderNumber } }, { id: { equals: Number(orderNumber) || -1 } }] },
    limit: 1, depth: 0, overrideAccess: true,
  })
  const order: any = found.docs[0]
  if (!order) { console.error('order not found:', orderNumber); process.exit(1) }
  if (order.status !== 'paid') { console.error(`order ${order.orderNumber} is '${order.status}' — only forward PAID orders`); process.exit(1) }
  if (order.supplierOrderId) { console.error('already forwarded:', order.supplierOrderId); process.exit(1) }

  // resolve supplier mappings per item
  const cjItems: { vid: string; quantity: number; logisticName?: string }[] = []
  const manualItems: string[] = []
  for (const item of order.items ?? []) {
    const sp = await payload.find({
      collection: 'supplier-products',
      where: { variant: { equals: item.variant } },
      limit: 1, depth: 2, overrideAccess: true,
    })
    const mapping: any = sp.docs[0]
    if (!mapping?.supplierVariantId) { manualItems.push(`${item.name} (no supplier vid)`); continue }
    const supplierSlug = typeof mapping.supplier === 'object' ? mapping.supplier?.slug : null
    if (supplierSlug === 'eprolo') { manualItems.push(`${item.name} (EPROLO — manual)`); continue }
    // pick logistic name from variant availability for destination country
    const variant = typeof item.variant === 'object' ? item.variant : null
    const destCountry = order.shippingAddress?.country === 'Canada' ? 'CA' : 'US'
    const avail = (variant?.availability ?? []).find((a: any) => a.country === destCountry)
    cjItems.push({ vid: String(mapping.supplierVariantId), quantity: item.quantity ?? 1, logisticName: avail?.serviceName })
  }

  console.log(`Order ${order.orderNumber} — ${cjItems.length} CJ item(s), ${manualItems.length} manual`)
  manualItems.forEach((m) => console.log('  manual:', m))

  if (!cjItems.length) { console.log('nothing to forward to CJ'); process.exit(0) }

  const dest = order.shippingAddress?.country === 'Canada' ? 'CA' : 'US'
  const body = {
    orderNumber: order.orderNumber,
    shippingCountryCode: dest,
    shippingCustomerName: order.customerName,
    shippingPhone: order.customerPhone ?? '',
    shippingAddress: [order.shippingAddress?.line1, order.shippingAddress?.line2].filter(Boolean).join(' '),
    shippingCity: order.shippingAddress?.city ?? '',
    shippingProvince: order.shippingAddress?.state ?? '',
    shippingPostCode: order.shippingAddress?.postalCode ?? '',
    shippingCountry: dest === 'CA' ? 'Canada' : 'United States',
    email: order.customerEmail,
    logisticName: cjItems[0].logisticName ?? undefined,
    products: cjItems.map((i) => ({ vid: i.vid, quantity: i.quantity })),
    remark: `GPSLane storefront order ${order.orderNumber}`,
  }

  if (DRY) {
    console.log('DRY RUN — would POST /shopping/order/createOrderV2:')
    console.log(JSON.stringify(body, null, 2))
    process.exit(0)
  }

  const res = await cj('/shopping/order/createOrderV2', body)
  console.log('CJ response:', JSON.stringify(res).slice(0, 500))
  const cjOrderId = res?.data?.orderId ?? res?.data?.orderNum
  if (!res?.result || !cjOrderId) { console.error('CJ order creation failed — do NOT retry blindly, check response above'); process.exit(1) }

  await payload.update({
    collection: 'orders', id: order.id, overrideAccess: true,
    data: { supplierOrderId: String(cjOrderId), status: 'processing' } as any,
  })
  console.log(`forwarded -> CJ order ${cjOrderId}, local order set to 'processing'`)
  process.exit(0)
}
main().catch((e) => { console.error('FATAL', e); process.exit(1) })

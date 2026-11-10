/**
 * Sync supplier inventory → variant availability.
 * Sets availability[].available=false when the supplier reports 0 stock.
 * Run manually or on a schedule (e.g. Vercel Cron / nightly task).
 */
import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
import { getPayload } from 'payload'
import { eproloGet } from '../src/lib/suppliers/eprolo'

const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0/v1'

async function cjToken() {
  const r = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: process.env.CJDROPSHIPPING_API_KEY }),
  })
  const j: any = await r.json()
  return j?.data?.accessToken ?? j?.accessToken
}

async function main() {
  const { default: cfg } = await import('../src/payload.config')
  const payload = await getPayload({ config: cfg })
  const products = await payload.find({ collection: 'products', limit: 100, depth: 0, where: { status: { equals: 'published' } } })
  const token = await cjToken().catch(() => null)
  let updated = 0

  for (const p of products.docs as any[]) {
    let stock: number | null = null
    try {
      if (p.cjProductId && token) {
        const r = await fetch(`${CJ_BASE}/product/stock/queryByPid?pid=${p.cjProductId}`, { headers: { 'CJ-Access-Token': token } })
        const j: any = await r.json()
        const inv = j?.data?.[0]?.inventories ?? j?.data?.inventories ?? []
        stock = Array.isArray(inv) ? inv.reduce((n: number, i: any) => n + (i.inventoryNum ?? i.totalInventoryNum ?? 0), 0) : null
      } else if (p.eproloProductId) {
        const d: any = await eproloGet('getproduct.html', { id: p.eproloProductId, product_id: `gpslane-${p.eproloProductId}` })
        const pd = d?.data ?? d
        stock = (pd?.variantlist ?? []).reduce((n: number, v: any) => n + (v.inventory_quantity ?? v.inventory ?? 0), 0) || null
      }
    } catch (e: any) {
      console.log(p.slug, 'fetch fail:', e.message?.slice(0, 50))
      continue
    }
    if (stock == null) { console.log(p.slug, 'no stock data'); continue }
    const inStock = stock > 0
    if (!inStock) {
      const variants = await payload.find({ collection: 'product-variants', where: { product: { equals: p.id } }, limit: 20, depth: 0 })
      for (const v of variants.docs as any[]) {
        const av = (v.availability ?? []).map((a: any) => ({ ...a, available: false }))
        await payload.update({ collection: 'product-variants', id: v.id, data: { availability: av } as any })
        updated++
      }
    }
    console.log(p.slug, 'stock:', stock, inStock ? 'OK' : 'OOS -> availability disabled')
  }
  console.log('done —', updated, 'variants disabled')
  process.exit(0)
}
main().catch((e) => { console.error('FATAL', e); process.exit(1) })

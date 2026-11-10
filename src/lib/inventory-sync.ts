import type { Payload } from 'payload'
import { eproloGet } from './suppliers/eprolo'

const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0/v1'

async function cjToken(): Promise<string | null> {
  try {
    const r = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: process.env.CJDROPSHIPPING_API_KEY }),
    })
    const j: any = await r.json()
    return j?.data?.accessToken ?? j?.accessToken ?? null
  } catch {
    return null
  }
}

/**
 * Pull live stock from suppliers and disable variant availability when OOS.
 * Safe to run on a schedule — only mutates availability, never prices.
 */
export async function syncInventory({ payload }: { payload: Payload }) {
  const products = await payload.find({
    collection: 'products', limit: 100, depth: 0,
    where: { status: { equals: 'published' } },
  })
  const token = await cjToken()
  const results = { checked: 0, oos: 0, skipped: 0 }

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
    } catch {
      results.skipped++
      continue
    }

    if (stock == null) { results.skipped++; continue }
    results.checked++
    if (stock <= 0) {
      const variants = await payload.find({ collection: 'product-variants', where: { product: { equals: p.id } }, limit: 20, depth: 0 })
      for (const v of variants.docs as any[]) {
        if (!(v.availability ?? []).every((a: any) => a.available === false)) {
          const av = (v.availability ?? []).map((a: any) => ({ ...a, available: false }))
          await payload.update({ collection: 'product-variants', id: v.id, data: { availability: av } as any })
          results.oos++
        }
      }
    }
  }
  return results
}

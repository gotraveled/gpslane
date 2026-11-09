/** Find products with US/CA warehouse inventory via listV2 countryCode filter + per-pid inventory check. */
import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const BASE = 'https://developers.cjdropshipping.com/api2.0/v1'
const OUT = path.resolve('data/cj')
mkdirSync(OUT, { recursive: true })
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
let token: string | null = null

async function api(method: 'GET' | 'POST', p: string, opts: { query?: any; body?: any } = {}) {
  if (!token) {
    const r = await fetch(`${BASE}/authentication/getAccessToken`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: process.env.CJDROPSHIPPING_API_KEY }),
    })
    token = (await r.json()).data.accessToken
  }
  const qs = opts.query ? '?' + Object.entries(opts.query).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&') : ''
  const res = await fetch(`${BASE}${p}${qs}`, {
    method,
    headers: { 'CJ-Access-Token': token!, ...(opts.body ? { 'Content-Type': 'application/json' } : {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  })
  await sleep(1100)
  return (await res.json().catch(() => null))?.data
}

const KEYWORDS = ['gps', 'gps navigation', 'carplay screen', 'motorcycle carplay', 'gps mount', 'car phone holder', 'navigation']
const seen = new Map<string, { pid: string; name: string; price?: any; inv: number }>()

for (const cc of ['US', 'CA']) {
  for (const kw of KEYWORDS) {
    try {
      const d: any = await api('GET', '/product/listV2', { query: { keyWord: kw, countryCode: cc, page: 1, size: 20 } })
      const products: any[] = (d?.content ?? []).flatMap((c: any) => c.productList ?? [c]).filter((p: any) => p?.id)
      console.log(`${cc} "${kw}" → ${products.length} (total ${d?.totalRecords})`)
      for (const p of products) {
        const pid = String(p.id)
        const e = seen.get(pid) ?? { pid, name: p.nameEn ?? '', price: p.sellPrice, inv: 0 }
        e.inv += Number(p.warehouseInventoryNum ?? p.totalVerifiedInventory ?? 0) || 0
        seen.set(pid, e)
      }
      writeFileSync(path.join(OUT, `search-${cc}-${kw.replace(/\s+/g, '-')}.json`), JSON.stringify(d, null, 2))
    } catch (e: any) {
      console.log(`${cc} "${kw}" FAILED ${e.message}`)
    }
  }
}
console.log(`UNIQUE NA-INVENTORY PRODUCTS: ${seen.size}`)
writeFileSync(path.join(OUT, 'na-candidates.json'), JSON.stringify([...seen.values()], null, 2))


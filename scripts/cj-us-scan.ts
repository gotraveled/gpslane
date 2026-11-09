/** US-warehouse-focused CJ scan: paginate GPS keywords with countryCode=US. */
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

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const KEYWORDS = [
  'portable gps', 'gps case', 'gps cable', 'gps antenna', 'gps mount', 'gps holder',
  'gps charger', 'motorcycle gps', 'carplay screen', 'motorcycle carplay', 'car stereo',
  'gps navigator accessories', 'gps screen protector', 'truck gps', 'rv gps',
]

const found = new Map<string, { pid: string; name: string; price?: any; inv: number; keywords: string[] }>()

for (const kw of KEYWORDS) {
  for (let page = 1; page <= 5; page++) {
    try {
      const d: any = await api('GET', '/product/listV2', { query: { keyWord: kw, countryCode: 'US', page, size: 20 } })
      const products: any[] = (d?.content ?? []).flatMap((c: any) => c.productList ?? [c]).filter((p: any) => p?.id)
      if (!products.length) break
      for (const p of products) {
        const pid = String(p.id)
        const e = found.get(pid) ?? { pid, name: p.nameEn ?? '', price: p.sellPrice, inv: 0, keywords: [] as string[] }
        e.inv += Number(p.warehouseInventoryNum ?? p.totalVerifiedInventory ?? 0) || 0
        if (!e.keywords.includes(kw)) e.keywords.push(kw)
        found.set(pid, e)
      }
      console.log(`US "${kw}" p${page} → ${products.length} (total ${d?.totalRecords})`)
      if (page * 20 >= (d?.totalRecords ?? 0)) break
    } catch (e: any) {
      console.log(`US "${kw}" p${page} FAILED ${e.message}`)
      break
    }
  }
}
console.log(`UNIQUE US-INVENTORY PRODUCTS: ${found.size}`)
writeFileSync(path.join(OUT, 'us-candidates.json'), JSON.stringify([...found.values()], null, 2))



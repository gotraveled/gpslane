/** CJ detail for Phase-11 candidates — correct product/query field mapping. */
import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
import { writeFileSync } from 'node:fs'
import path from 'node:path'

const BASE = 'https://developers.cjdropshipping.com/api2.0/v1'
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

const PIDS = [
  'AC9C5BEA-950C-4992-B9BF-654D6F0A2EA1',
  '1368761182843965440',
  '1775119195689193472',
  '1939569012321931265',
]

async function main() {
  const out: any[] = []
  for (const pid of PIDS) {
    const rec: any = { pid }
    try {
      const p: any = await api('GET', '/product/query', { query: { pid } })
      rec.name = p.productNameEn
      rec.nameCn = p.productName
      rec.sellPrice = p.sellPrice
      rec.listed = p.listedNum
      rec.sku = p.productSku
      rec.category = p.categoryName ?? p.entryNameEn
      rec.images = (p.productImageSet ?? []).slice(0, 12)
      rec.weight = p.productWeight
      rec.packWeight = p.packingWeight
      rec.descriptionText = String(p.description ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 1500)
      rec.variants = (p.variants ?? []).map((v: any) => ({
        vid: v.vid, name: v.variantNameEn ?? v.variantKey, sku: v.variantSku,
        price: v.variantSellPrice, weight: v.variantWeight, image: v.variantImage,
      }))
      // inventory
      try {
        const inv: any = await api('GET', '/product/variant/getInventoryByPid', { query: { pid } })
        rec.inventory = inv
      } catch { /* optional */ }
    } catch (e: any) { rec.error = e.message }

    const vid = rec.variants?.[0]?.vid
    if (vid) {
      for (const cc of ['US', 'CA']) {
        try {
          const f: any = await api('POST', '/logistic/freightCalculate', {
            body: { startCountryCode: 'CN', endCountryCode: cc, products: [{ vid: String(vid), quantity: 1 }] },
          })
          const list = f?.logisticPriceList ?? f?.resultList ?? f ?? []
          const arr = Array.isArray(list) ? list : [list]
          const usps = arr.filter((x: any) => /usps/i.test(x.logisticName ?? x.logisticsName ?? ''))
          const pick = usps[0] ?? arr[0]
          rec[`ship${cc}`] = pick ? { service: pick.logisticName ?? pick.logisticsName, price: pick.logisticPrice ?? pick.freight, aging: pick.logisticAging ?? pick.aging } : null
          rec[`ship${cc}All`] = arr.slice(0, 8).map((x: any) => `${x.logisticName ?? x.logisticsName}: $${x.logisticPrice ?? x.freight} ${x.logisticAging ?? x.aging}`)
        } catch (e: any) { rec[`ship${cc}Err`] = e.message }
      }
    }
    out.push(rec)
    console.log('DONE', pid, '|', String(rec.name).slice(0, 55), '| vars', rec.variants?.length, '| imgs', rec.images?.length, '| US', JSON.stringify(rec.shipUS ?? null).slice(0, 110))
  }
  writeFileSync(path.resolve('data/cj/phase11-candidates.json'), JSON.stringify(out, null, 2))
  console.log('saved', out.length)
}
main().catch((e) => { console.error('FATAL', e); process.exit(1) })

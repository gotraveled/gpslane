/**
 * NA-warehouse detail pass: for each US-inventory candidate, fetch product detail,
 * variants, per-country inventory (getInventoryByPid) and freight quotes
 * (US->US, US->CA, CN->US) for the first variant.
 * Read-only. Output → data/cj/na-details.json (gitignored).
 */
import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
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
  const j: any = await res.json().catch(() => null)
  if (j && j.code !== undefined && ![200, 0].includes(j.code)) throw new Error(`${p} code=${j.code} ${j.message}`)
  return j?.data
}

const EXCLUDE_RE = /tracker|locator|anti-?theft|pet\s|beidou|fuel\s*cut|cut.?off|hidden\s*camera|dash\s*cam(?!.*navigat)|welding|privacy screen|movie screen|projector screen|inflatable/i
const NAV_RE = /gps|navigat|carplay|android|satnav|head.?up|hud/i

async function main() {
  const candidates: any[] = JSON.parse(readFileSync(path.join(OUT, 'us-candidates.json'), 'utf8'))
  const eligible = candidates.filter((c) => !EXCLUDE_RE.test(c.name))
  const nav = eligible.filter((c) => NAV_RE.test(c.name))
  const rest = eligible.filter((c) => !NAV_RE.test(c.name))
  console.log(`candidates=${candidates.length} eligible=${eligible.length} nav-ish=${nav.length}`)
  const list = [...nav, ...rest].slice(0, Number(process.env.LIMIT ?? 35))

  const results: any[] = []
  for (const c of list) {
    try {
      const detail: any = await api('POST', '/product/productDetail/query', { body: { id: c.pid } })
      const variants: any[] = await api('GET', '/product/variant/query', { query: { pid: c.pid } }) ?? []
      const inv: any = await api('GET', '/product/stock/getInventoryByPid', { query: { pid: c.pid } })
      const v0 = Array.isArray(variants) ? variants[0] : null
      const vid = v0?.vid
      let freight: any = null
      if (vid) {
        freight = {
          usUs: await api('POST', '/logistic/freightCalculate', { body: { startCountryCode: 'US', endCountryCode: 'US', products: [{ quantity: 1, vid }] } }).catch(() => null),
          usCa: await api('POST', '/logistic/freightCalculate', { body: { startCountryCode: 'US', endCountryCode: 'CA', products: [{ quantity: 1, vid }] } }).catch(() => null),
          cnUs: await api('POST', '/logistic/freightCalculate', { body: { startCountryCode: 'CN', endCountryCode: 'US', products: [{ quantity: 1, vid }] } }).catch(() => null),
          cnCa: await api('POST', '/logistic/freightCalculate', { body: { startCountryCode: 'CN', endCountryCode: 'CA', products: [{ quantity: 1, vid }] } }).catch(() => null),
        }
      }
      results.push({
        pid: c.pid, cjName: c.name, listPrice: c.price, usListInv: c.inv, keywords: c.keywords,
        detailName: detail?.nameen, description: (detail?.descriptionen ?? '').toString().slice(0, 1500),
        images: (detail?.newImgList ?? detail?.img ?? detail?.bigimg ?? []).slice?.(0, 6),
        orderCount: detail?.orderCount, qualityDisputeRate: detail?.qualityDisputeRate,
        customization: detail?.customization, qualificationList: detail?.qualificationList,
        weight: detail?.weight, packing: detail?.packing,
        variantCount: variants.length,
        firstVariant: v0 ? { vid, sku: v0.variantSku, price: v0.variantSellPrice, name: v0.variantNameEn, weight: v0.variantWeight, dims: v0.variantStandard } : null,
        inventory: inv,
        freight,
      })
      console.log(`OK ${c.pid} "${(detail?.nameen ?? c.name).slice(0, 60)}" vars=${variants.length}`)
    } catch (e: any) {
      console.log(`FAIL ${c.pid} ${e.message}`)
    }
  }
  writeFileSync(path.join(OUT, 'na-details.json'), JSON.stringify(results, null, 2))
  console.log(`DONE ${results.length} → data/cj/na-details.json`)
}
main().catch((e) => { console.error('FATAL', e); process.exit(1) })


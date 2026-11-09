/**
 * Targeted detail pass for GPSLane-relevant pids (US-warehouse + CN-fallback GPS devices).
 * For each: detail, variants, per-country inventory, freight US->US / US->CA / CN->US / CN->CA.
 * Output → data/cj/na-shortlist-raw.json
 */
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
  const j: any = await res.json().catch(() => null)
  if (j && j.code !== undefined && ![200, 0].includes(j.code)) throw new Error(`${p} code=${j.code} ${j.message}`)
  return j?.data
}

// US-warehouse vehicle/nav-relevant candidates (from us-candidates.json review)
const US_PIDS = [
  '1428891025237217280', // Car HUD HD Head-up Display (US=66)
  '1939569012321931265', // Car Stereo Autoradio 7-inch Touch Screen (US=400)
  '1681189962663862272', // Metal Car Charger 100W USB/C (US=56)
  '1953028967254958082', // Motorcycle Carrier hitch (US=3464)
  '1953077329429495809', // Motorcycle Wheel Chock (US=90)
  '1917146169614041090', // Motorcycle scissor jack (US=854)
  '2045337196703039489', // ATV/motorcycle dolly (US=20)
  '1821454936031776768', // Car vacuum cleaner (US=234)
  '1851850527215603712', // 12V air heater car/RV (US=1404)
  '1953135920534757378', // RV extension cord 30A (US=449)
  '1955097636363993090', // Bike V-brake pads (US=213)
  '1971116010725896194', // LED DRL daytime lights (US=460)
  '1909883128103481345', // Car engine repair stand (US=156)
  'B07BA231-93FD-4A87-B941-38E84EF47060', // Reflective stickers (US=72)
  '1386170811295076352', // Car seat-back storage bag (US=4)
  '41CAB303-4E96-4FE9-AE77-7762F0CC0E1C', // Car cup holder (US=24)
  '2407200305291611900', // Car microfiber towel (US=27)
  '1956654039511355394', // Pet car seat belt (US=?)
  'C4F25112-41EE-4C8C-9F7C-9B9F235B8CD9', // Car heating cushion (US=10)
  '1947152309840289794', // Pet dog seat belt car (US=11)
]

// CN-warehouse GPS devices (Phase 4 shortlist, fallback only)
const CN_PIDS = [
  '1621030460279238656', // motorcycle CarPlay screen
  '1605840112464703488', // portable car smart screen
  '1762433618531590144', // 10.26" head unit
  '1640899139242307584', // CarPlay MP5 player
  '1381795220596854784', // GPS cycling computer
  'ED5E3732-5C75-4D6D-A5F6-F6D84C6157CC', // GPS magnetic positioner
]

const best = (freight: any) => {
  if (!Array.isArray(freight)) return null
  const ok = freight.filter((f: any) => typeof f?.logisticPrice === 'number' && !f.error)
  if (!ok.length) return null
  ok.sort((a: any, b: any) => a.logisticPrice - b.logisticPrice)
  return { price: ok[0].totalPostageFee ?? ok[0].logisticPrice, aging: ok[0].logisticAging, name: ok[0].logisticName, count: ok.length }
}

const countryStock = (inv: any) => {
  const out: Record<string, number> = {}
  for (const vi of inv?.variantInventories ?? []) {
    for (const i of vi.inventory ?? []) out[i.countryCode] = (out[i.countryCode] ?? 0) + (i.totalInventory ?? 0)
  }
  return out
}

async function processPid(pid: string, origin: 'US' | 'CN') {
  const detail: any = await api('POST', '/product/productDetail/query', { body: { id: pid } })
  const variants: any[] = (await api('GET', '/product/variant/query', { query: { pid } })) ?? []
  const inv: any = await api('GET', '/product/stock/getInventoryByPid', { query: { pid } })
  const v0 = Array.isArray(variants) ? variants[0] : null
  const vid = v0?.vid
  const freight: any = {}
  if (vid) {
    for (const [k, sc, ec] of [['usUs', 'US', 'US'], ['usCa', 'US', 'CA'], ['cnUs', 'CN', 'US'], ['cnCa', 'CN', 'CA']] as const) {
      freight[k] = await api('POST', '/logistic/freightCalculate', { body: { startCountryCode: sc, endCountryCode: ec, products: [{ quantity: 1, vid }] } }).catch(() => null)
    }
  }
  return {
    pid, origin,
    name: detail?.nameen, description: (detail?.descriptionen ?? '').toString().slice(0, 1200),
    images: (detail?.newImgList ?? detail?.img ?? detail?.bigimg ?? []).slice?.(0, 6),
    orderCount: detail?.orderCount, disputeRate: detail?.qualityDisputeRate,
    customization: detail?.customization, qualifications: detail?.qualificationList,
    weight: detail?.weight, variantCount: variants.length,
    variant: v0 ? { vid, sku: v0.variantSku, price: v0.variantSellPrice, name: v0.variantNameEn, weight: v0.variantWeight, dims: v0.variantStandard } : null,
    stockByCountry: countryStock(inv),
    freightBest: Object.fromEntries(Object.entries(freight).map(([k, v]) => [k, best(v)])),
    freightRaw: freight,
  }
}

async function main() {
  const results: any[] = []
  for (const pid of US_PIDS) {
    try { results.push(await processPid(pid, 'US')); console.log('US OK', pid) }
    catch (e: any) { console.log('US FAIL', pid, e.message) }
  }
  for (const pid of CN_PIDS) {
    try { results.push(await processPid(pid, 'CN')); console.log('CN OK', pid) }
    catch (e: any) { console.log('CN FAIL', pid, e.message) }
  }
  writeFileSync(path.join(OUT, 'na-shortlist-raw.json'), JSON.stringify(results, null, 2))
  console.log(`DONE ${results.length}`)
}
main().catch((e) => { console.error('FATAL', e); process.exit(1) })



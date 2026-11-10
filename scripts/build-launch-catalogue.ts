/**
 * Build GPSLane launch catalogue from CJ API.
 * Selects GPS navigation products + accessories, prefers USPS shipping,
 * computes 35% margin prices (USD) + planning CAD prices.
 * Output: data/cj/launch-catalogue.json (gitignored — contains costs).
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

const PAYPAL_RATE = 0.0349, PAYPAL_FIXED = 0.49, RESERVE = 0.05, PLATFORM = 0.5, USD_CAD = 1.38
const priceAt35 = (landed: number) => landed / 0.65
const _round99 = (floor: number) => Math.ceil(floor * 100) / 100 - 0.01 >= floor ? Math.ceil(floor * 100) / 100 - 0.01 : Math.ceil(floor) - 0.01
// simpler correct rule: smallest x.99 >= floor
const sellPrice = (floor: number) => {
  const candidate = Math.ceil(floor) - 0.01
  return candidate >= floor ? candidate : candidate + 1
}
const contribution = (price: number, landed: number) => {
  const paypal = price * PAYPAL_RATE + PAYPAL_FIXED
  const reserve = price * RESERVE
  return Math.round((price - landed - paypal - reserve - PLATFORM) * 100) / 100
}

// Curated GPSLane catalogue — GPS navigation devices + accessories.
// Excluded: trackers/jammers/films/off-category vehicle gear.
const CATALOGUE: { pid: string; title: string; slug: string; category: string; blurb: string }[] = [
  { pid: '1621030460279238656', title: 'GPSLane Motorcycle Navigation Display', slug: 'motorcycle-navigation-display', category: 'motorcycle-gps', blurb: 'Motorcycle navigation display with front and rear screens, 1080P recording, CarPlay/Android connectivity.' },
  { pid: '1605840112464703488', title: 'GPSLane Portable Car Navigation Display', slug: 'portable-car-navigation-display', category: 'portable-gps', blurb: 'Portable in-car smart display with wireless phone projection for navigation apps.' },
  { pid: '1762433618531590144', title: 'GPSLane 10.6-inch Car Navigation System', slug: 'car-navigation-system-10-6', category: 'automotive-gps', blurb: 'Full-touch 10.6-inch all-in-one car navigation head unit.' },
  { pid: '1640899139242307584', title: 'GPSLane CarPlay Navigation Player', slug: 'carplay-navigation-player', category: 'automotive-gps', blurb: 'CarPlay-compatible navigation media player for dashboard installation.' },
  { pid: '1381795220596854784', title: 'GPSLane GPS Cycling Computer', slug: 'gps-cycling-computer', category: 'portable-gps', blurb: 'GPS cycling computer for route tracking and ride metrics.' },
  { pid: '1368761182843965440', title: 'GPSLane Navigation Installation Frame', slug: 'navigation-installation-frame', category: 'accessories', blurb: '9-inch/10-inch installation frame host for car navigation units.' },
  { pid: '1372740742929321984', title: 'GPSLane Vehicle Navigation Mount', slug: 'vehicle-navigation-mount', category: 'mounts-holders', blurb: 'Universal vehicle mount for GPS navigation devices and phones (multiple colors + air-outlet variants).' },
  { pid: '1553294377827708928', title: 'GPSLane Dashboard Navigation Holder', slug: 'dashboard-navigation-holder', category: 'mounts-holders', blurb: 'Dashboard-mounted holder for GPS navigation devices.' },
  { pid: '1734143220638035968', title: 'GPSLane Vent Navigation Holder', slug: 'vent-navigation-holder', category: 'mounts-holders', blurb: 'Air-vent clip holder for navigation devices.' },
  { pid: '65C385B4-6A37-466C-9ACD-FD7890C41F4D', title: 'GPSLane Folding Suction Navigation Mount', slug: 'folding-suction-navigation-mount', category: 'mounts-holders', blurb: 'Foldable dashboard suction mount for navigation devices.' },
  { pid: '1564542997939892224', title: 'GPSLane Magnetic Navigation Mount', slug: 'magnetic-navigation-mount', category: 'mounts-holders', blurb: 'Rotating magnetic mount for navigation devices.' },
  { pid: '2409070656521627500', title: 'GPSLane Motorcycle GPS Power Adapter', slug: 'motorcycle-gps-power-adapter', category: 'power-cables', blurb: 'USB power adapter connecting motorcycle SAE supply to GPS devices.' },
  { pid: '1681189962663862272', title: 'GPSLane Vehicle Navigation Power Cable', slug: 'vehicle-navigation-power-cable', category: 'power-cables', blurb: '100W fast-charge car power cable with USB-C for navigation devices.' },
  { pid: '1428891025237217280', title: 'GPSLane Head-Up Display', slug: 'head-up-display', category: 'automotive-gps', blurb: 'HUD head-up display projecting speed and navigation data.' },
  { pid: '1763160474423664640', title: 'GPSLane Wireless CarPlay Adapter', slug: 'wireless-carplay-adapter', category: 'accessories', blurb: 'Wired-to-wireless CarPlay/Android Auto adapter for navigation.' },
]

function pickUsps(freight: any[], _dest: string) {
  if (!Array.isArray(freight)) return null
  const ok = freight.filter((f: any) => typeof f?.logisticPrice === 'number' && !f.error)
  // prefer USPS-named service with 4-11 day aging
  const usps = ok.filter((f: any) => /usps/i.test(f.logisticName ?? '') && /^(\d{1,2})-/.test(String(f.logisticAging ?? '')) && parseInt(String(f.logisticAging).split('-')[0]) <= 11)
  const pool = usps.length ? usps : ok.filter((f: any) => /^(\d{1,2})-/.test(String(f.logisticAging ?? '')) && parseInt(String(f.logisticAging).split('-')[0]) <= 11)
  if (!pool.length) return null
  pool.sort((a: any, b: any) => a.logisticPrice - b.logisticPrice)
  const f = pool[0]
  return { service: f.logisticName, priceUsd: f.logisticPrice ?? f.totalPostageFee, aging: f.logisticAging, carrier: /usps/i.test(f.logisticName ?? '') ? 'USPS' : 'other' }
}

const stockByCountry = (inv: any) => {
  const out: Record<string, number> = {}
  for (const vi of inv?.variantInventories ?? []) for (const i of vi.inventory ?? []) out[i.countryCode] = (out[i.countryCode] ?? 0) + (i.totalInventory ?? 0)
  return out
}

async function main() {
  const products: any[] = []
  for (const c of CATALOGUE) {
    try {
      const variants: any[] = (await api('GET', '/product/variant/query', { query: { pid: c.pid } })) ?? []
      const inv: any = await api('GET', '/product/stock/getInventoryByPid', { query: { pid: c.pid } })
      const stock = stockByCountry(inv)
      const v0 = Array.isArray(variants) ? variants[0] : null
      const vid = v0?.vid
      const cost = parseFloat(String(v0?.variantSellPrice ?? '0')) || 0

      // freight: US->US if US stock else CN->US; CA: US->CA if US stock else CN->CA
      let shipUs: any = null, shipCa: any = null
      if (vid) {
        const routes: [string, string, string][] = stock.US > 0
          ? [['usUs', 'US', 'US'], ['usCa', 'US', 'CA']]
          : [['cnUs', 'CN', 'US'], ['cnCa', 'CN', 'CA']]
        for (const [key, sc, ec] of routes) {
          const f = await api('POST', '/logistic/freightCalculate', { body: { startCountryCode: sc, endCountryCode: ec, products: [{ quantity: 1, vid }] } }).catch(() => null)
          const picked = pickUsps(f, ec)
          if (key.endsWith('Us')) shipUs = picked; else shipCa = picked
        }
      }
      const landedUsd = cost + (shipUs?.priceUsd ?? 0)
      const landedCad = (cost + (shipCa?.priceUsd ?? shipUs?.priceUsd ?? 0)) * USD_CAD
      const floorUsd = priceAt35(landedUsd)
      const floorCad = priceAt35(landedCad)
      const sellUsd = Math.round(sellPrice(floorUsd) * 100) / 100
      const sellCad = Math.round(sellPrice(floorCad) * 100) / 100

      products.push({
        ...c,
        supplierProductId: c.pid,
        supplierVariantId: vid,
        supplierSku: v0?.variantSku,
        variantName: v0?.variantNameEn,
        warehouseStock: stock,
        warehouseCountry: stock.US > 0 ? 'US' : stock.CA > 0 ? 'CA' : 'CN',
        unitCostUsd: cost,
        shippingUs: shipUs,
        shippingCa: shipCa,
        landedCostUsd: Math.round(landedUsd * 100) / 100,
        landedCostCad: Math.round(landedCad * 100) / 100,
        priceUsd: sellUsd,
        priceCad: sellCad,
        marginFloorUsd: Math.round(floorUsd * 100) / 100,
        estimatedContributionUsd: contribution(sellUsd, landedUsd),
        brandingStatus: 'branding_unverified',
        reviewStatus: 'pending_review',
        status: 'draft',
      })
      console.log(`OK ${c.slug} | cost $${cost} | shipUS ${shipUs ? `$${shipUs.priceUsd} ${shipUs.aging} ${shipUs.carrier}` : '-'} | sell $${sellUsd} | contrib $${contribution(sellUsd, landedUsd)}`)
    } catch (e: any) {
      console.log(`FAIL ${c.slug}: ${e.message}`)
    }
  }
  writeFileSync(path.join(OUT, 'launch-catalogue.json'), JSON.stringify(products, null, 2))
  console.log(`DONE ${products.length} products → data/cj/launch-catalogue.json`)
}
main().catch((e) => { console.error('FATAL', e); process.exit(1) })

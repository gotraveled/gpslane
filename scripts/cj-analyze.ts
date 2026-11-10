/**
 * Analyze CJ discovery results → shortlist with US/CA margins.
 * Reads data/cj/discovery-summary.json. Writes data/cj/shortlist.json (gitignored).
 * Margin model per PRODUCT_SELECTION_SCORECARD.md.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const DIR = path.resolve('data/cj')
const summary = JSON.parse(readFileSync(path.join(DIR, 'discovery-summary.json'), 'utf8'))

const PAYPAL_FEE_RATE = 0.0349 // ~3.49% + fixed; approx
const PAYPAL_FEE_FIXED = 0.49
const REFUND_RESERVE_RATE = 0.05
const PLATFORM_COST = 0.5 // infra allocation per order, USD
const _CAD_USD = 0.73 // approx for CAD price estimation only — final CAD pricing is explicit, not FX-derived

// Category guess from name/keywords
function categorize(name: string, _keywords: string[]): string {
  const n = name.toLowerCase()
  if (/cushion|seat\s*cover|cover\b|mirror|pump|reflector|handle|clutch|brake|protector|film|tempered|lens/.test(n)) return 'cases-carrying'
  if (/mount|holder|bracket|cradle|suction|vent/.test(n)) return 'mounts-holders'
  if (/cable|charger|adapter|sae|usb|power\s*bank/.test(n)) return 'power-cables'
  if (/antenna/.test(n)) return 'antennas'
  if (/motorcycle|bike|scooter/.test(n)) return 'motorcycle-gps'
  if (/truck|rv\b|camper|semi/.test(n)) return 'truck-rv-gps'
  if (/screen|player|mp5|carplay|android|hud|head.?up|projector|display|cyclng|cycling/.test(n)) return 'automotive-gps'
  if (/gps|navigat|satnav/.test(n)) return 'portable-gps'
  return 'accessories'
}

function bestFreight(freight: any): { price: number; aging: string; name: string } | null {
  if (!Array.isArray(freight)) return null
  const ok = freight.filter((f: any) => f && typeof f.logisticPrice === 'number' && !f.error)
  if (!ok.length) return null
  ok.sort((a: any, b: any) => a.logisticPrice - b.logisticPrice)
  return { price: ok[0].totalPostageFee ?? ok[0].logisticPrice, aging: ok[0].logisticAging, name: ok[0].logisticName }
}

function stockTotal(stock: any): { cj: number; factory: number; total: number } {
  if (!stock) return { cj: 0, factory: 0, total: 0 }
  const obj = Array.isArray(stock) ? stock[0] : stock
  const rows = obj?.stock ?? obj?.data?.stock ?? []
  if (Array.isArray(rows)) {
    const cj = rows.reduce((s: number, r: any) => s + (r.inventory ?? 0), 0)
    const factory = rows.reduce((s: number, r: any) => s + (r.factoryInventory ?? 0), 0)
    return { cj, factory, total: cj + factory }
  }
  const cj = obj?.cjInventoryNum ?? obj?.totalInventoryNum ?? obj?.storageNum ?? 0
  const factory = obj?.factoryInventoryNum ?? 0
  return { cj, factory, total: cj + factory }
}

const rows: any[] = []
for (const d of summary.details ?? []) {
  const v = d.variants?.[0]
  if (!v) continue
  const costUsd = typeof v.price === 'number' ? v.price : parseFloat(String(v.price ?? '0')) || 0
  const shipUs = bestFreight(v.freightUs)
  const shipCa = bestFreight(v.freightCa)
  const stockInfo = stockTotal(v.stock)
  const stock = stockInfo.total
  const landedUsd = costUsd + (shipUs?.price ?? 0)
  // suggested retail: accessories 3x landed, devices 2.2x landed — rough heuristic for screening only
  const cat = categorize(d.name ?? '', d.keywords ?? [])
  const mult = cat.includes('gps') || cat === 'portable-gps' || cat === 'automotive-gps' || cat === 'motorcycle-gps' || cat === 'truck-rv-gps' ? 2.4 : 3.0
  const retailUsd = Math.round(landedUsd * mult * 100) / 100
  const fees = retailUsd * PAYPAL_FEE_RATE + PAYPAL_FEE_FIXED + PLATFORM_COST
  const marginUsd = retailUsd - landedUsd - fees - retailUsd * REFUND_RESERVE_RATE
  const marginPct = retailUsd > 0 ? (marginUsd / retailUsd) * 100 : 0

  rows.push({
    pid: d.pid,
    name: d.name,
    category: cat,
    keywords: d.keywords,
    variantCount: d.variantCount,
    costUsd,
    shipUs: shipUs ? { price: shipUs.price, aging: shipUs.aging, name: shipUs.name } : null,
    shipCa: shipCa ? { price: shipCa.price, aging: shipCa.aging, name: shipCa.name } : null,
    stock,
    stockCj: stockInfo.cj,
    stockFactory: stockInfo.factory,
    weightG: v.weightG,
    orderCount: d.orderCount,
    disputeRate: d.qualityDisputeRate,
    landedUsd: Math.round(landedUsd * 100) / 100,
    suggestedRetailUsd: retailUsd,
    estMarginUsd: Math.round(marginUsd * 100) / 100,
    estMarginPct: Math.round(marginPct * 1) / 1,
    hasUsShipping: !!shipUs,
    hasCaShipping: !!shipCa,
  })
}

rows.sort((a, b) => b.estMarginPct - a.estMarginPct)
writeFileSync(path.join(DIR, 'shortlist.json'), JSON.stringify(rows, null, 2))

console.log('pid | name | cat | cost | shipUS | shipCA | stock | retail~ | margin% | orders')
for (const r of rows) {
  console.log(
    `${r.pid} | ${(r.name ?? '').slice(0, 55)} | ${r.category} | $${r.costUsd} | ${r.shipUs ? '$' + r.shipUs.price : '-'} | ${r.shipCa ? '$' + r.shipCa.price : '-'} | ${r.stock} | $${r.suggestedRetailUsd} | ${r.estMarginPct}% | ${r.orderCount ?? '?'}`,
  )
}

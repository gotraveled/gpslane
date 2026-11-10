/**
 * NA margin analysis: 35%/40% gross-margin pricing, PayPal fees, refund reserve.
 * Reads data/cj/na-shortlist-raw.json → data/cj/na-analysis.json + console table.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const DIR = path.resolve('data/cj')
const rows: any[] = JSON.parse(readFileSync(path.join(DIR, 'na-shortlist-raw.json'), 'utf8'))

const PAYPAL_RATE = 0.0349
const PAYPAL_FIXED_USD = 0.49
const _PAYPAL_FIXED_CAD = 0.49 // approx; confirm with PayPal CA fee schedule
const REFUND_RESERVE = 0.05
const PLATFORM_COST = 0.5
const USD_CAD = 1.38 // planning rate for CAD price display only — final CAD pricing explicit

function priceAtMargin(landed: number, margin: number) {
  return landed / (1 - margin)
}
function roundAttractive(p: number) {
  // round to nearest .99/.95 style endings, never below floor
  const r = Math.ceil(p * 20) / 20 // nickel grid
  return Math.floor(r * 100) / 100 - 0.01 >= p ? Math.floor(r * 100) / 100 - 0.01 : r
}
function contribution(price: number, landed: number, fixed: number) {
  const paypal = price * PAYPAL_RATE + fixed
  const reserve = price * REFUND_RESERVE
  return { paypal: Math.round(paypal * 100) / 100, reserve: Math.round(reserve * 100) / 100, profit: Math.round((price - landed - paypal - reserve - PLATFORM_COST) * 100) / 100, marginPct: Math.round(((price - landed) / price) * 1000) / 10 }
}

const out: any[] = []
for (const r of rows) {
  const cost = typeof r.variant?.price === 'number' ? r.variant.price : parseFloat(String(r.variant?.price ?? '0')) || 0
  const usStock = (r.stockByCountry?.US ?? 0) > 0
  const caStock = (r.stockByCountry?.CA ?? 0) > 0
  const cnStock = (r.stockByCountry?.CN ?? 0) > 0

  // choose cheapest reliable route per destination, prefer domestic/verified stock
  const usShip = usStock ? r.freightBest?.usUs : r.freightBest?.cnUs
  const caShip = caStock ? r.freightBest?.usCa : usStock ? r.freightBest?.usCa : r.freightBest?.cnCa
  const usLanded = cost + (usShip?.price ?? 0)
  const caLanded = cost + (caShip?.price ?? 0)

  const p35us = priceAtMargin(usLanded, 0.35)
  const p40us = priceAtMargin(usLanded, 0.40)
  const p35ca = priceAtMargin(caLanded * USD_CAD, 0.35)
  const p40ca = priceAtMargin(caLanded * USD_CAD, 0.40)
  const sell35us = Math.max(roundAttractive(p35us), p35us) // ensure >= floor
  const contrib = contribution(sell35us, usLanded, PAYPAL_FIXED_USD)

  out.push({
    pid: r.pid, origin: r.origin, name: r.name, stock: r.stockByCountry,
    hasUsStock: usStock, hasCaStock: caStock, hasCnStock: cnStock,
    costUsd: cost,
    shipUs: usShip ? { price: usShip.price, aging: usShip.aging, name: usShip.name, methods: usShip.count } : null,
    shipCa: caShip ? { price: caShip.price, aging: caShip.aging, name: caShip.name, methods: caShip.count } : null,
    landedUsd: Math.round(usLanded * 100) / 100,
    landedCad: Math.round(caLanded * USD_CAD * 100) / 100,
    price35Usd: Math.round(p35us * 100) / 100,
    price40Usd: Math.round(p40us * 100) / 100,
    price35Cad: Math.round(p35ca * 100) / 100,
    price40Cad: Math.round(p40ca * 100) / 100,
    sellPrice35Usd: Math.round(sell35us * 100) / 100,
    contribAt35: contrib,
    orderCount: r.orderCount, disputeRate: r.disputeRate,
    customization: r.customization,
    weightG: r.variant?.weight,
    variantCount: r.variantCount,
  })
}

writeFileSync(path.join(DIR, 'na-analysis.json'), JSON.stringify(out, null, 2))
console.log('pid | stock(US/CA/CN) | cost | shipUS | shipCA | landedUS | p35US | p40US | contrib35 | orders')
for (const r of out) {
  const st = `${r.stock?.US ?? 0}/${r.stock?.CA ?? 0}/${r.stock?.CN ?? 0}`
  console.log(`${r.pid} | ${st} | $${r.costUsd} | ${r.shipUs ? '$' + r.shipUs.price + ' ' + r.shipUs.aging : '-'} | ${r.shipCa ? '$' + r.shipCa.price + ' ' + r.shipCa.aging : '-'} | $${r.landedUsd} | $${r.price35Usd} | $${r.price40Usd} | $${r.contribAt35.profit} (${r.contribAt35.marginPct}%) | ${r.orderCount ?? '?'}`)
}

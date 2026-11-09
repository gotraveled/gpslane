/** Shipping quotes US+CA for shortlisted EPROLO products → data/eprolo/shipping.json */
import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { eproloGet } from '../src/lib/suppliers/eprolo'

const OUT = path.resolve('data/eprolo')
mkdirSync(OUT, { recursive: true })
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const IDS = [
  '30816802', '30605296', '30212551', '29572817', '27777277', '26727255', '20204559',
  '26713049', '1600184', '1599978',
  '29719368', '29971751', '10719202', '11666825', '10607586', '1718270',
]

function pickBest(costList: any[]) {
  if (!Array.isArray(costList) || !costList.length) return null
  const ok = costList.filter((c) => typeof c?.cost === 'number' && c.ship_method && !/battery|partial zip/i.test(c.ship_method ?? ''))
  if (!ok.length) return null
  // prefer shortest reliable window among cheapest quartile — sort by cost then take min shiptime-max
  ok.sort((a, b) => a.cost - b.cost)
  const cheapest = ok[0]
  const fast = ok.filter((c) => c.cost <= cheapest.cost * 1.5)
  fast.sort((a, b) => parseInt(String(b.shiptime).match(/\d+/)?.[0] ?? '99') - parseInt(String(a.shiptime).match(/\d+/)?.[0] ?? '99'))
  const pick = fast[0] ?? cheapest
  return { method: pick.ship_method, costUsd: pick.cost, shipTime: pick.shiptime, carrier: pick.ship_method }
}

async function main() {
  const cands: any[] = JSON.parse(readFileSync(path.join(OUT, 'gps-candidates.json'), 'utf8'))
  const out: any[] = []
  for (const id of IDS) {
    const c = cands.find((x) => String(x.id) === id)
    const v = c?.variants?.[0]
    if (!v) { console.log('SKIP', id, 'no variant'); continue }
    const rec: any = { id, title: c.title, variantId: v.id, variantTitle: v.title, costUsd: parseFloat(v.cost), inventory: v.inventory, weightG: v.weight, sku: v.sku, imagefirst: c.imagefirst, isship: c.isship }
    for (const cc of ['US', 'CA']) {
      try {
        const r: any = await eproloGet('get_product_shiping_fees.html', { productid: id, variantId: v.id, countrycode: cc })
        const vl = r?.data?.variantlist?.[0] ?? r?.variantlist?.[0]
        const costList = vl?.logistics_cost_list?.[0]?.cost_list ?? vl?.logistics_cost_list?.cost_list ?? []
        rec[`ship${cc}`] = pickBest(costList)
        rec[`ship${cc}All`] = (costList ?? []).slice(0, 8).map((x: any) => `${x.ship_method} $${x.cost} ${x.shiptime}`)
      } catch (e: any) { rec[`ship${cc}`] = { error: e.message } }
      await sleep(300)
    }
    const landedUs = rec.costUsd + (rec.shipUS?.costUsd ?? 0)
    const landedCa = rec.costUsd + (rec.shipCA?.costUsd ?? 0)
    rec.landedUsd = Math.round(landedUs * 100) / 100
    rec.price35Usd = Math.round((landedUs / 0.65) * 100) / 100
    rec.price40Usd = Math.round((landedUs / 0.60) * 100) / 100
    rec.landedCad = Math.round(landedCa * 1.38 * 100) / 100
    rec.price35Cad = Math.round((landedCa * 1.38 / 0.65) * 100) / 100
    out.push(rec)
    console.log(`OK ${id} | cost $${rec.costUsd} | US ${rec.shipUS ? `$${rec.shipUS.costUsd} ${rec.shipUS.shipTime}` : '-'} | CA ${rec.shipCA ? `$${rec.shipCA.costUsd} ${rec.shipCA.shipTime}` : '-'} | sell35 $${rec.price35Usd}`)
  }
  writeFileSync(path.join(OUT, 'shipping.json'), JSON.stringify(out, null, 2))
  console.log('DONE', out.length)
}
main().catch((e) => { console.error('FATAL', e); process.exit(1) })

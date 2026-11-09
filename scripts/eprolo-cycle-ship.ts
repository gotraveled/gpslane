import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
import { readFileSync, writeFileSync } from 'node:fs'
import { eproloGet } from '../src/lib/suppliers/eprolo'
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const cands = JSON.parse(readFileSync('data/eprolo/sports-candidates.json', 'utf8'))
const IDS = ['19547950', '19547949', '19547945', '19547915']
const out: any[] = []
for (const id of IDS) {
  const c = cands.find((x: any) => String(x.id) === id)
  if (!c) { console.log('MISS', id); continue }
  const rec: any = { id, title: c.title, variants: c.variants }
  const v = c.variants?.[0]
  for (const cc of ['US', 'CA']) {
    try {
      const r: any = await eproloGet('get_product_shiping_fees.html', { productid: id, variantId: v.id, countrycode: cc })
      const vl = r?.data?.variantlist?.[0] ?? r?.variantlist?.[0]
      const cl = vl?.logistics_cost_list?.[0]?.cost_list ?? vl?.logistics_cost_list?.cost_list ?? []
      const ok = cl.filter((x: any) => typeof x?.cost === 'number' && x.ship_method && !/battery|partial/i.test(x.ship_method ?? ''))
      ok.sort((a: any, b: any) => a.cost - b.cost)
      const pick = ok[0]
      rec['ship' + cc] = pick ? { method: pick.ship_method, costUsd: pick.cost, shipTime: pick.shiptime } : null
      rec['ship' + cc + 'All'] = (cl ?? []).slice(0, 6).map((x: any) => `${x.ship_method} $${x.cost} ${x.shiptime}`)
    } catch (e: any) { rec['ship' + cc] = { error: e.message } }
    await sleep(300)
  }
  out.push(rec)
  console.log('DONE', id, '|', c.title.slice(0, 55), '| US', JSON.stringify(rec.shipUS).slice(0, 100))
}
writeFileSync('data/eprolo/cycle-shipping.json', JSON.stringify(out, null, 2))

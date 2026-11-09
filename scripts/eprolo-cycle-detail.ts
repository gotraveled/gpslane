import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
import { writeFileSync } from 'node:fs'
import crypto from 'node:crypto'

const KEY = process.env.EPROLO_OPEN_API_KEY!
const SECRET = process.env.EPROLO_OPEN_API_SECRET!
async function get(params: Record<string, string>) {
  const ts = Date.now().toString()
  const sign = crypto.createHash('md5').update(KEY + ts + SECRET).digest('hex')
  const qs = new URLSearchParams({ sign, timestamp: ts, ...params })
  const r = await fetch('https://openapi.eprolo.com/getproduct.html?' + qs, { headers: { apiKey: KEY } })
  const j: any = await r.json()
  if (j.code !== 0 && j.code !== '0') throw new Error(JSON.stringify(j).slice(0, 200))
  return j.data
}
const IDS = ['19547950', '19547949', '19547945', '19547915']
const out: any[] = []
for (const id of IDS) {
  try {
    const d: any = await get({ id })
    const p = d?.product ?? d
    out.push({
      id, title: p.title, handle: p.handle,
      variants: (p.variantlist ?? []).map((v: any) => ({ id: v.id, sku: v.sku, cost: v.cost, price: v.price, inventory: v.inventory_quantity, option: v.option1 ?? v.title })),
      images: (p.imagelist ?? []).slice(0, 12).map((i: any) => i.src ?? i),
      logistics: (p.logistics_cost_list ?? []).slice(0, 20),
      body: String(p.body_html ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 1200),
    })
    console.log('DONE', id, '|', String(p.title).slice(0, 60), '| vars', (p.variantlist ?? []).length)
  } catch (e: any) { console.log('FAIL', id, e.message.slice(0, 100)) }
}
writeFileSync('data/eprolo/cycle-computer-details.json', JSON.stringify(out, null, 2))

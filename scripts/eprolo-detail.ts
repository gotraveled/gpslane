/** Fetch EPROLO product detail for shortlisted candidates → data/eprolo/details.json */
import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { eproloGet } from '../src/lib/suppliers/eprolo'

const OUT = path.resolve('data/eprolo')
mkdirSync(OUT, { recursive: true })
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// shortlisted from gps-candidates.json review — devices + best accessories only
const IDS = [
  '30816802', '30605296', '30212551', '29572817', '27777277', '26727255', '20204559',
  '26713049', '1600184', '1599978',
  '29719368', '29971751', '10719202', '11666825', '10607586', '1718270',
]

async function main() {
  const cands: any[] = JSON.parse(readFileSync(path.join(OUT, 'gps-candidates.json'), 'utf8'))
  const out: any[] = []
  for (const id of IDS) {
    const c = cands.find((x) => String(x.id) === id)
    try {
      const d: any = await eproloGet('getproduct.html', { id, product_id: `gpslane-${id}` })
      const pd = d?.data ?? d
      out.push({
        id, title: c?.title, eproloTitle: pd?.title ?? pd?.name,
        status: pd?.status, wareTypeId: pd?.wareTypeId, wareTypeTwoId: pd?.wareTypeTwoId,
        imagefirst: pd?.imagefirst ?? c?.imagefirst, isship: pd?.isship ?? c?.isship,
        bodyHtmlLen: String(pd?.body_html ?? '').length,
        bodyText: String(pd?.body_html ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 800),
        variants: (pd?.variantlist ?? c?.variants ?? []).map((v: any) => ({
          id: v.id, title: v.title ?? v.option1, cost: v.cost, inventory: v.inventory_quantity ?? v.inventory,
          weight: v.weight, sku: v.sku, imagesid: v.imagesid,
        })),
        logistics: pd?.logistics_cost_list ?? c?.logistics,
      })
      console.log('OK', id, '|', String(c?.title).slice(0, 60), '| vars', out.at(-1)!.variants.length)
    } catch (e: any) { console.log('FAIL', id, e.message) }
    await sleep(300)
  }
  writeFileSync(path.join(OUT, 'details.json'), JSON.stringify(out, null, 2))
  console.log('DONE', out.length)
}
main().catch((e) => { console.error('FATAL', e); process.exit(1) })

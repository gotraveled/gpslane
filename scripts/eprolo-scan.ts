/**
 * Scan EPROLO catalog (Consumer Electronic, Phones, Cars & Motorcycles)
 * for GPS navigation products. Writes data/eprolo/gps-candidates.json.
 */
import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { eproloGet } from '../src/lib/suppliers/eprolo'

const OUT = path.resolve('data/eprolo')
mkdirSync(OUT, { recursive: true })
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const CATEGORIES = [
  { wareTypeId: '13', label: 'Consumer Electronic' },
  { wareTypeId: '9', label: 'Phones & Accessories' },
  { wareTypeId: '10', label: 'Cars & Motorcycles' },
]
const MAX_PAGES = 150 // 150 * 200 = 30k products per category cap

const GPS_RE = /gps|navigat|gps\s|satellite|head\s*unit|carplay|android auto|hud\b|cyclcomputer|cycling computer|obd.*gps|gps.*tracker(?!.*(dog|pet|car|vehicle|hidden|magnetic))/i
const EXCLUDE_RE = /tracker(?!.*navigat)|locator|jammer|signal.*(block|jammer|interfer)|watch\b|smartwatch|fitness|band\b|camera(?!.*gps)|drone|pet|dog|cat\b|key\s*fob|alarm\s*system(?!.*gps)|dash\s*cam(?!.*gps)|obd2?(?!.*gps)|bluetooth(?!.*gps)|phone(?!.*gps)|holder(?!.*gps)|mount(?!.*gps)|cable(?!.*gps)|charger(?!.*gps)|antenna(?!.*gps)|case(?!.*gps)|film|tempered|screen\s*protector/i

function isCandidate(title: string) {
  if (!GPS_RE.test(title)) return false
  // trackers explicitly excluded even if title mentions gps
  if (/tracker|locator|jammer|interfer/i.test(title)) return false
  return true
}

async function main() {
  const found = new Map<string, any>()
  for (const cat of CATEGORIES) {
    for (let page = 1; page <= MAX_PAGES; page++) {
      let data: any
      try {
        data = await eproloGet('eprolo_product_list.html', { page_index: page, wareTypeId: cat.wareTypeId, page_size: 200 })
      } catch (e: any) {
        console.log(`${cat.label} p${page} ERR ${e.message}`); break
      }
      const arr: any[] = Array.isArray(data) ? data : (data?.list ?? [])
      if (!arr.length) { console.log(`${cat.label}: end at page ${page}`); break }
      let hits = 0
      for (const p of arr) {
        const title = String(p.title ?? '')
        if (isCandidate(title)) {
          hits++
          if (!found.has(String(p.id))) {
            found.set(String(p.id), {
              id: p.id, title, wareTypeId: p.wareTypeId, wareTypeTwoId: p.wareTypeTwoId,
              imagefirst: p.imagefirst, isship: p.isship, status: p.status,
              variantCount: Array.isArray(p.variantlist) ? p.variantlist.length : 0,
              variants: (p.variantlist ?? []).slice(0, 5).map((v: any) => ({ id: v.id, title: v.title, cost: v.cost, inventory: v.inventory_quantity, weight: v.weight, sku: v.sku })),
              logistics: p.logistics_cost_list,
              category: cat.label,
            })
          }
        }
      }
      if (page % 10 === 0 || hits) console.log(`${cat.label} p${page}: ${arr.length} items, ${hits} hits, total ${found.size}`)
      await sleep(250)
    }
  }
  writeFileSync(path.join(OUT, 'gps-candidates.json'), JSON.stringify([...found.values()], null, 2))
  console.log(`DONE ${found.size} candidates → data/eprolo/gps-candidates.json`)
}
main().catch((e) => { console.error('FATAL', e); process.exit(1) })

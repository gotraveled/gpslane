/** Probe EPROLO catalog: auth check, category list, product search attempts. */
import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
import { eproloGet } from '../src/lib/suppliers/eprolo'

async function main() {
  // 1. auth + shape check
  const page1: any = await eproloGet('eprolo_product_list.html', { page: 1 })
  console.log('page1 keys:', Object.keys(page1 ?? {}))
  const list = page1?.list ?? page1?.data?.list ?? page1
  console.log('count:', Array.isArray(list) ? list.length : 'n/a', '| total:', page1?.total ?? page1?.count ?? '?')
  const sample = Array.isArray(list) ? list[0] : null
  if (sample) console.log('sample:', JSON.stringify({ id: sample.id, title: sample.title, warelabelid: sample.warelabelid, imagefirst: sample.imagefirst, isship: sample.isship }).slice(0, 300))

  // 2. try keyword/search params
  for (const [param, val] of [['keyword', 'gps'], ['title', 'gps'], ['search', 'gps'], ['name', 'gps'], ['warelabelid', '']] as const) {
    try {
      const r: any = await eproloGet('eprolo_product_list.html', { page: 1, [param]: val })
      const l = r?.list ?? r?.data?.list ?? r
      const titles = Array.isArray(l) ? l.slice(0, 3).map((x: any) => x.title) : l
      console.log(`param ${param}=${val} =>`, JSON.stringify(titles).slice(0, 200))
    } catch (e: any) { console.log(`param ${param} => ERR ${e.message}`) }
  }

  // 3. categories
  try {
    const cats: any = await eproloGet('product_type.html')
    const arr = cats?.list ?? cats
    console.log('categories:', Array.isArray(arr) ? arr.length : JSON.stringify(cats).slice(0, 200))
    if (Array.isArray(arr)) for (const c of arr.filter((c: any) => /electronic|computer|phone|digital|auto/i.test(c.name ?? ''))) console.log('  cat:', c.id, c.name)
  } catch (e: any) { console.log('cats ERR', e.message) }
}
main().catch((e) => { console.error('FATAL', e); process.exit(1) })

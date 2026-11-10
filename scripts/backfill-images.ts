import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
import { writeFileSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'
import { getPayload } from 'payload'

const require2 = createRequire(import.meta.url)
const EP = require2('../data/eprolo/launch-catalogue.json')
const EP_IMPORT = require2('../data/eprolo/imported-products.json')
const arr = (d: any) => (Array.isArray(d) ? d : d.products ?? [])
const epBySlug = new Map<string, any>(arr(EP).map((x: any) => [x.slug, x]))
const epImportById = new Map<string, any>(arr(EP_IMPORT).map((x: any) => [String(x.id), x]))

async function download(url: string, fp: string): Promise<boolean> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(25000), headers: { 'User-Agent': 'Mozilla/5.0' } })
    if (!res.ok) return false
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 3000) return false
    writeFileSync(fp, buf)
    return true
  } catch { return false }
}

async function main() {
  const { default: configPromise } = await import('../src/payload.config')
  const payload = await getPayload({ config: configPromise })
  const products = await payload.find({ collection: 'products', limit: 100, depth: 0, where: { status: { equals: 'published' } } })
  const tmp = mkdtempSync(path.join(tmpdir(), 'gpslane-img2-'))

  for (const p of products.docs as any[]) {
    if ((p.images ?? []).length > 0) continue
    const ep = epBySlug.get(p.slug)
    if (!ep) { console.log('no ep source', p.slug); continue }
    const urls: string[] = []
    const imp = epImportById.get(String(ep.supplierProductId))
    for (const im of imp?.imagelist ?? []) if (im.src) urls.push(im.src)
    if (ep.imagefirst) urls.unshift(ep.imagefirst)
    const mediaIds: any[] = []
    for (let i = 0; i < Math.min(urls.length, 5); i++) {
      const fp = path.join(tmp, `${p.slug}-${i}.jpg`)
      if (await download(urls[i], fp)) {
        try {
          const doc: any = await payload.create({ collection: 'media', data: { alt: `${p.name} — photo ${i + 1}` }, filePath: fp })
          mediaIds.push(doc.id)
        } catch (e: any) { console.log('  upload fail', e.message?.slice(0, 60)) }
      }
    }
    console.log(p.slug, '->', mediaIds.length, 'images')
    if (mediaIds.length) {
      await payload.update({ collection: 'products', id: p.id, data: { images: mediaIds } as any })
    }
  }
  process.exit(0)
}
main().catch((e) => { console.error('FATAL', e); process.exit(1) })

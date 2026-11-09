/**
 * Re-upload existing media files through Payload so they land in Vercel Blob.
 * For each media doc: create a new doc from the local file, remap references
 * on products, then delete the old doc.
 */
import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
import path from 'node:path'
import { existsSync } from 'node:fs'
import { getPayload } from 'payload'

async function main() {
  const { default: configPromise } = await import('../src/payload.config')
  const payload = await getPayload({ config: configPromise })
  const media = await payload.find({ collection: 'media', limit: 200, depth: 0 })
  console.log('media docs:', media.totalDocs)

  const idMap = new Map<any, any>()
  for (const m of media.docs as any[]) {
    const filename = m.filename
    const candidates = [
      path.resolve('media', filename),
      ...(m.sizes ? Object.values(m.sizes).map((s: any) => path.resolve('media', s.filename ?? '')) : []),
    ]
    const filePath = candidates.find((p) => p && existsSync(p))
    if (!filePath) { console.log('NO FILE', filename); continue }
    try {
      const doc = await payload.create({
        collection: 'media',
        data: { alt: m.alt ?? filename },
        filePath,
      })
      idMap.set(m.id, doc.id)
      console.log('UPLOADED', filename, '->', doc.id)
    } catch (e: any) {
      console.log('FAIL', filename, e.message?.slice(0, 100))
    }
  }

  // remap product image refs
  const products = await payload.find({ collection: 'products', limit: 100, depth: 0 })
  for (const p of products.docs as any[]) {
    const imgs = p.images ?? []
    if (!imgs.length) continue
    const mapped = imgs.map((id: any) => idMap.get(id) ?? id).filter(Boolean)
    if (mapped.some((v: any, i: number) => v !== imgs[i])) {
      await payload.update({ collection: 'products', id: p.id, data: { images: mapped } as any })
      console.log('remapped product', p.slug)
    }
  }

  // delete old docs
  for (const oldId of idMap.keys()) {
    try { await payload.delete({ collection: 'media', id: oldId }); console.log('deleted old', oldId) }
    catch (e: any) { console.log('delete fail', oldId, e.message?.slice(0, 60)) }
  }
  process.exit(0)
}
main().catch((e) => { console.error('FATAL', e); process.exit(1) })

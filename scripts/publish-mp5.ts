import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
import { writeFileSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'
import { getPayload } from 'payload'

const require2 = createRequire(import.meta.url)

async function main() {
  const { default: configPromise } = await import('../src/payload.config')
  const payload = await getPayload({ config: configPromise })
  const found = await payload.find({ collection: 'products', where: { slug: { equals: 'mp5-gps-navigation-player-9-10-inch' } }, limit: 1, depth: 0 })
  const p: any = found.docs[0]
  if (!p) { console.log('not found'); process.exit(1) }

  const detail = require2('../data/cj/detail-1368761182843965440.json')
  const urls: string[] = (detail.newImgList ?? (detail.img ? detail.img.split(',') : [])).filter(Boolean).slice(0, 5)
  const tmp = mkdtempSync(path.join(tmpdir(), 'gpslane-img-'))
  const mediaIds: any[] = []
  for (let i = 0; i < urls.length; i++) {
    try {
      const res = await fetch(urls[i], { signal: AbortSignal.timeout(20000) })
      if (!res.ok) continue
      const buf = Buffer.from(await res.arrayBuffer())
      const fp = path.join(tmp, `img-${i}.jpg`)
      writeFileSync(fp, buf)
      const doc: any = await payload.create({ collection: 'media', data: { alt: `${p.name} — photo ${i + 1}` }, filePath: fp })
      mediaIds.push(doc.id)
    } catch {}
  }
  console.log('imgs:', mediaIds.length)
  await payload.update({ collection: 'products', id: p.id, data: { status: 'published', ...(mediaIds.length ? { images: mediaIds } : {}) } as any })

  const variants = await payload.find({ collection: 'product-variants', limit: 20, depth: 0, where: { product: { equals: p.id } } })
  for (const v of variants.docs as any[]) {
    const hasPrices = (v.prices ?? []).length > 0
    await payload.update({
      collection: 'product-variants', id: v.id,
      data: {
        status: 'active',
        ...(hasPrices ? {} : { prices: [{ currency: 'usd', priceCents: Math.round((detail.sellprice ?? detail.nowPrice ?? 60) * 100) }, { currency: 'cad', priceCents: Math.round((detail.sellprice ?? detail.nowPrice ?? 60) * 135) }] }),
        availability: [
          { country: 'US', available: true, shippingCostCents: 999, etaMinDays: 10, etaMaxDays: 20, serviceName: 'Standard' },
          { country: 'CA', available: true, shippingCostCents: 1299, etaMinDays: 10, etaMaxDays: 20, serviceName: 'Standard' },
        ],
      } as any,
    })
  }
  console.log('published mp5-gps-navigation-player-9-10-inch')
  process.exit(0)
}
main().catch((e) => { console.error('FATAL', e); process.exit(1) })

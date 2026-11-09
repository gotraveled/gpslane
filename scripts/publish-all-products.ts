/**
 * Publish all remaining draft products: attach supplier images (via Payload
 * media -> Vercel Blob), activate variants, set per-country availability
 * and pricing from the CJ/EPROLO launch catalogues.
 */
import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
import { writeFileSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { getPayload } from 'payload'

import { createRequire } from 'node:module'
const require2 = createRequire(import.meta.url)
const CJ = require2('../data/cj/launch-catalogue.json')
const EP = require2('../data/eprolo/launch-catalogue.json')
const EP_IMPORT = require2('../data/eprolo/imported-products.json')
const EP_SPORTS = require2('../data/eprolo/sports-candidates.json')

const arr = (d: any) => (Array.isArray(d) ? d : d.products ?? [])
const cjBySlug = new Map<string, any>(arr(CJ).map((x: any) => [x.slug, x]))
const epBySlug = new Map<string, any>(arr(EP).map((x: any) => [x.slug, x]))
const epImportById = new Map<string, any>(arr(EP_IMPORT).map((x: any) => [String(x.id), x]))
const epSportsById = new Map<string, any>(arr(EP_SPORTS).map((x: any) => [String(x.id), x]))

function eta(aging: string | undefined): [number, number] {
  const m = (aging ?? '').match(/(\d+)\s*[-–]\s*(\d+)/)
  return m ? [Number(m[1]), Number(m[2])] : [10, 20]
}

async function downloadImage(url: string, dir: string, idx: number): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20000) })
    if (!res.ok) return null
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 3000) return null
    const ext = (res.headers.get('content-type') ?? 'image/jpeg').includes('png') ? 'png' : 'jpg'
    const file = path.join(dir, `img-${idx}.${ext}`)
    writeFileSync(file, buf)
    return file
  } catch { return null }
}

async function main() {
  const { default: configPromise } = await import('../src/payload.config')
  const payload = await getPayload({ config: configPromise })
  const drafts = await payload.find({ collection: 'products', limit: 100, depth: 0, where: { status: { equals: 'draft' } } })
  const tmp = mkdtempSync(path.join(tmpdir(), 'gpslane-img-'))
  console.log('drafts:', drafts.totalDocs)

  for (const p of drafts.docs as any[]) {
    const slug = p.slug as string
    const cj = cjBySlug.get(slug)
    const ep = epBySlug.get(slug)
    const src = cj ?? ep
    if (!src) { console.log('NO SOURCE', slug); continue }

    // collect image urls
    const urls: string[] = []
    if (cj) {
      try {
        const detail = require2(`../data/cj/detail-${cj.pid ?? p.cjProductId}.json`)
        const list = detail.newImgList ?? (detail.img ? detail.img.split(',') : [])
        urls.push(...list.filter(Boolean).slice(0, 5))
      } catch { /* no detail file */ }
    } else if (ep) {
      const first = ep.imagefirst ?? epImportById.get(String(ep.supplierProductId))?.imagefirst
      if (first) urls.push(first)
      const imp = epImportById.get(String(ep.supplierProductId))
      for (const im of (imp?.imagelist ?? []).slice(0, 4)) if (im.src) urls.push(im.src)
      const sport = epSportsById.get(String(ep.supplierProductId))
      if (sport?.imagefirst && !urls.includes(sport.imagefirst)) urls.push(sport.imagefirst)
    }
    urls.splice(5)

    // download + upload images
    const mediaIds: any[] = []
    for (let i = 0; i < urls.length; i++) {
      const fp = await downloadImage(urls[i], tmp, i)
      if (!fp) continue
      try {
        const doc: any = await payload.create({ collection: 'media', data: { alt: `${p.name} — photo ${i + 1}` }, filePath: fp })
        mediaIds.push(doc.id)
      } catch (e: any) { console.log('  img fail', urls[i].slice(-30), e.message?.slice(0, 60)) }
    }
    console.log(slug, '| imgs:', mediaIds.length)

    // product update
    await payload.update({
      collection: 'products', id: p.id,
      data: { status: 'published', ...(mediaIds.length ? { images: mediaIds } : {}) } as any,
    })

    // variants
    const variants = await payload.find({ collection: 'product-variants', limit: 20, depth: 0, where: { product: { equals: p.id } } })
    for (const v of variants.docs as any[]) {
      const hasPrices = (v.prices ?? []).length > 0
      const prices = hasPrices ? v.prices : [
        { currency: 'usd', priceCents: Math.round((src.priceUsd ?? 50) * 100) },
        { currency: 'cad', priceCents: Math.round((src.priceCad ?? (src.priceUsd ?? 50) * 1.35) * 100) },
      ]
      const shipUs = src.shippingUs ?? {}
      const shipCa = src.shippingCa ?? {}
      const [usMin, usMax] = eta(shipUs.aging)
      const [caMin, caMax] = eta(shipCa.aging)
      await payload.update({
        collection: 'product-variants', id: v.id,
        data: {
          status: 'active',
          ...(hasPrices ? {} : { prices }),
          availability: [
            { country: 'US', available: true, shippingCostCents: Math.round((shipUs.priceUsd ?? 9.99) * 100), etaMinDays: usMin, etaMaxDays: usMax, serviceName: shipUs.service ?? 'Standard' },
            { country: 'CA', available: true, shippingCostCents: Math.round((shipCa.priceCad ?? shipUs.priceUsd ?? 9.99) * 100), etaMinDays: caMin, etaMaxDays: caMax, serviceName: shipCa.service ?? 'Standard' },
          ],
        } as any,
      })
    }
    console.log('  published +', variants.totalDocs, 'variants')
  }
  process.exit(0)
}
main().catch((e) => { console.error('FATAL', e); process.exit(1) })

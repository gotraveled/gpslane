/**
 * Phase 11 storefront setup:
 * 1. Upsert 4 canonical storefront categories.
 * 2. Remap all products to categories by launchVerification.gpsClassification.
 * 3. Publish the 6 verified passive accessories (approved_for_review, no radio,
 *    fccISEDStatus=not_applicable) with US+CA availability + active variants.
 * 4. Download supplier images into Payload media and attach to published products.
 */
import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'

const CATS = [
  { slug: 'gps-navigators', name: 'GPS Navigators', sortOrder: 1, description: 'Standalone GPS navigation devices for cars, trucks and outdoor use — maps on the device, no smartphone required.' },
  { slug: 'navigation-displays', name: 'Navigation Displays', sortOrder: 2, description: 'Portable CarPlay, Android Auto and MP5 navigation screens and head units.' },
  { slug: 'gps-cycling-computers', name: 'GPS Cycling Computers', sortOrder: 3, description: 'Handlebar GPS cycling computers with speed, cadence and ride tracking.' },
  { slug: 'gps-accessories', name: 'GPS Accessories', sortOrder: 4, description: 'Mounts, holders, power adapters, chargers and head-up displays for GPS navigators.' },
]

const CLASS_TO_CAT: Record<string, string> = {
  standalone_gps_navigator: 'gps-navigators',
  navigation_display: 'navigation-displays',
  gps_cycling_computer: 'gps-cycling-computers',
  gps_accessory: 'gps-accessories',
  other: 'gps-accessories',
}

const PUBLISH = [
  'vehicle-navigation-mount', 'dashboard-navigation-holder', 'vent-navigation-holder',
  'folding-suction-navigation-mount', 'magnetic-navigation-mount', 'motorcycle-gps-power-adapter',
]

const cjCatalogue = JSON.parse(readFileSync('data/cj/launch-catalogue.json', 'utf8'))
const cjDetails = JSON.parse(readFileSync('data/cj/validation-details.json', 'utf8'))
const imgBySlug = new Map(cjDetails.map((d: any) => [d.slug, d.images ?? []]))
const shipBySlug = new Map(cjCatalogue.map((p: any) => [p.slug, p]))

const parseAging = (a?: string) => {
  const [x, y] = String(a ?? '').split('-').map(Number)
  return { min: x || 0, max: y || x || 0 }
}

async function main() {
  const { default: configPromise } = await import('../src/payload.config')
  const payload = await getPayload({ config: configPromise })

  // 1. categories
  const catIds = new Map<string, any>()
  for (const c of CATS) {
    let cat = (await payload.find({ collection: 'categories', where: { slug: { equals: c.slug } }, limit: 1 })).docs[0]
    const data = { name: c.name, slug: c.slug, description: c.description, sortOrder: c.sortOrder, isActive: true }
    cat = cat ? await payload.update({ collection: 'categories', id: cat.id, data }) : await payload.create({ collection: 'categories', data })
    catIds.set(c.slug, cat)
    console.log('CAT', c.slug, cat.id)
  }

  // 2. remap all products
  const all = await payload.find({ collection: 'products', limit: 100, depth: 0 })
  for (const p of all.docs as any[]) {
    const cls = p.launchVerification?.gpsClassification ?? 'gps_accessory'
    const slug = CLASS_TO_CAT[cls] ?? 'gps-accessories'
    const cat = catIds.get(slug)
    if (!cat) continue
    const cur = (p.categories ?? []).map((c: any) => (typeof c === 'object' ? c.id : c))
    if (cur.length === 1 && cur[0] === cat.id) continue
    await payload.update({ collection: 'products', id: p.id, data: { categories: [cat.id], primaryCategory: cat.id } as any })
  }
  console.log('remapped', all.totalDocs)

  // 3+4. publish + images
  const tmp = path.resolve('data/tmp-images')
  mkdirSync(tmp, { recursive: true })
  for (const slug of PUBLISH) {
    const f = await payload.find({ collection: 'products', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
    const product: any = f.docs[0]
    if (!product) { console.log('MISS', slug); continue }
    const src: any = shipBySlug.get(slug)

    // variant: activate + availability
    const variants = await payload.find({ collection: 'product-variants', where: { product: { equals: product.id } }, limit: 5, depth: 0 })
    for (const v of variants.docs as any[]) {
      const availability = []
      for (const [cc, s] of [['US', src?.shippingUs], ['CA', src?.shippingCa]] as any) {
        if (!s) continue
        const { min, max } = parseAging(s.aging)
        availability.push({ country: cc, available: true, shippingCostCents: Math.round(s.priceUsd * 100), etaMinDays: min, etaMaxDays: max, serviceName: s.service })
      }
      await payload.update({ collection: 'product-variants', id: v.id, data: { status: 'active', availability } as any })
    }

    // images → media
    const urls: string[] = ((imgBySlug.get(slug) ?? []) as string[]).slice(0, 6)
    const mediaIds: any[] = []
    for (let i = 0; i < urls.length; i++) {
      try {
        const u = urls[i]
        const ext = path.extname(new URL(u).pathname) || '.jpg'
        const file = path.join(tmp, `${slug}-${i}${ext}`)
        const buf = Buffer.from(await (await fetch(u)).arrayBuffer())
        writeFileSync(file, buf)
        const media = await payload.create({
          collection: 'media',
          data: { alt: `${product.name} — image ${i + 1}` },
          filePath: file,
        })
        mediaIds.push(media.id)
      } catch (e: any) { console.log('  img fail', slug, i, e.message?.slice(0, 60)) }
    }

    await payload.update({ collection: 'products', id: product.id, data: { status: 'published', images: mediaIds } as any })
    console.log('PUBLISHED', slug, 'images', mediaIds.length)
  }
  process.exit(0)
}
main().catch((e) => { console.error('FATAL', e); process.exit(1) })

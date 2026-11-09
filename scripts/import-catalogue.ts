/**
 * Import data/cj/launch-catalogue.json into Payload as DRAFT records.
 * Creates: products (draft/pending_review), product-variants (draft),
 * supplier-products (pending_review), inventory-levels.
 * Idempotent: skips products whose slug already exists.
 * Requires DATABASE_URL + PAYLOAD_SECRET. Run: npx tsx scripts/import-catalogue.ts
 */
import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'

const catalogue: any[] = JSON.parse(readFileSync(path.resolve('data/cj/launch-catalogue.json'), 'utf8'))

const richText = (text: string) => ({
  root: {
    type: 'root',
    children: [{ type: 'paragraph', children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }], direction: 'ltr', format: '', indent: 0, version: 1 }],
    direction: 'ltr', format: '', indent: 0, version: 1,
  },
})

const parseAging = (aging?: string) => {
  const [a, b] = String(aging ?? '').split('-').map(Number)
  return { min: a || 0, max: b || a || 0 }
}

async function main() {
  const { default: configPromise } = await import('../src/payload.config')
  const payload = await getPayload({ config: configPromise })

  let supplier = (await payload.find({ collection: 'suppliers', where: { code: { equals: 'cjdropshipping' } }, limit: 1 })).docs[0]
  if (!supplier) {
    supplier = await payload.create({ collection: 'suppliers', data: { name: 'CJdropshipping', code: 'cjdropshipping', providerType: 'cjdropshipping', status: 'enabled' } })
  }

  const catCache = new Map<string, any>()
  const getCategory = async (slug: string) => {
    if (catCache.has(slug)) return catCache.get(slug)
    let cat = (await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1 })).docs[0]
    if (!cat) {
      cat = await payload.create({ collection: 'categories', data: { name: slug.replace(/-/g, ' '), slug, isActive: false } })
    }
    catCache.set(slug, cat)
    return cat
  }

  let created = 0, skipped = 0
  for (const p of catalogue) {
    const existing = await payload.find({ collection: 'products', where: { slug: { equals: p.slug } }, limit: 1 })
    if (existing.docs.length) { skipped++; console.log(`SKIP ${p.slug} (exists)`); continue }

    const category = await getCategory(p.category)
    const product = await payload.create({
      collection: 'products',
      data: {
        name: p.title,
        slug: p.slug,
        shortDescription: p.blurb,
        description: richText(`${p.blurb}\n\nShips via USPS from ${p.warehouseCountry === 'US' ? 'US warehouse' : 'verified supplier warehouse'}. Estimated delivery ${p.shippingUs?.aging ?? '5-11'} days.`),
        status: 'draft',
        sourcingStatus: 'pending_review',
        cjProductId: p.supplierProductId,
        brandingTier: 'generic',
        categories: [category.id],
        primaryCategory: category.id,
        seo: { metaTitle: p.title, metaDescription: p.blurb },
      } as any,
    })

    const variant = await payload.create({
      collection: 'product-variants',
      data: {
        product: product.id,
        sku: p.supplierSku || `GPS-${p.slug.toUpperCase()}`,
        name: p.variantName || 'Default',
        prices: [
          { currency: 'usd', priceCents: Math.round(p.priceUsd * 100) },
          { currency: 'cad', priceCents: Math.round(p.priceCad * 100) },
        ],
        weightGrams: p.weightG,
        status: 'draft',
      } as any,
    })

    const shippingQuotes = [p.shippingUs, p.shippingCa].filter(Boolean).map((s: any) => ({
      destinationCountry: s === p.shippingUs ? 'US' : 'CA',
      costCents: Math.round(s.priceUsd * 100),
      originCountry: p.warehouseCountry,
      serviceName: s.service,
      trackingAvailable: /usps/i.test(s.service ?? ''),
      ...parseAging(s.aging),
      quotedAt: new Date().toISOString(),
    }))

    await payload.create({
      collection: 'supplier-products',
      data: {
        variant: variant.id,
        supplier: supplier.id,
        supplierProductId: p.supplierProductId,
        supplierVariantId: p.supplierVariantId,
        supplierSku: p.supplierSku,
        unitCostCents: Math.round(p.unitCostUsd * 100),
        costCurrency: 'usd',
        shippingQuotes,
        stockUs: p.warehouseStock?.US ?? 0,
        stockCa: p.warehouseStock?.CA ?? 0,
        stockCn: p.warehouseStock?.CN ?? 0,
        warehouseCountry: p.warehouseCountry,
        warehouseStatus: p.warehouseCountry === 'CN' ? 'warehouse_verified' : 'warehouse_verified',
        brandingStatus: p.brandingStatus,
        reviewStatus: p.reviewStatus,
        syncStatus: 'ok',
        lastInventorySyncAt: new Date().toISOString(),
        lastCostSyncAt: new Date().toISOString(),
      } as any,
    })

    for (const [cc, qty] of Object.entries(p.warehouseStock ?? {})) {
      await payload.create({
        collection: 'inventory-levels',
        data: {
          variant: variant.id,
          location: `${p.supplierProductId}-${cc}`,
          countryCode: ['US', 'CA', 'CN'].includes(cc) ? cc : 'other',
          onHand: Number(qty),
          policy: 'track',
          source: 'supplier',
        } as any,
      })
    }
    created++
    console.log(`CREATED ${p.slug}`)
  }
  console.log(`DONE created=${created} skipped=${skipped}`)
  process.exit(0)
}
main().catch((e) => { console.error('FATAL', e); process.exit(1) })

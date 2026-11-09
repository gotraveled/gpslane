/** Correct the mislabeled 'navigation-installation-frame' product — it is actually
 *  the Scout MP5 GPS navigation player (pid 1368761182843965440). */
import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
import { getPayload } from 'payload'

const richText = (text: string) => ({
  root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }], direction: 'ltr', format: '', indent: 0, version: 1 }], direction: 'ltr', format: '', indent: 0, version: 1 },
})

async function main() {
  const { default: configPromise } = await import('../src/payload.config')
  const payload = await getPayload({ config: configPromise })
  const found = await payload.find({ collection: 'products', where: { slug: { equals: 'navigation-installation-frame' } }, limit: 1 })
  const product: any = found.docs[0]
  if (!product) { console.log('not found'); process.exit(1) }

  // ensure slug free
  const clash = await payload.find({ collection: 'products', where: { slug: { equals: 'mp5-gps-navigation-player-9-10-inch' } }, limit: 1 })
  const newSlug = clash.docs.length ? 'mp5-gps-navigation-player' : 'mp5-gps-navigation-player-9-10-inch'

  await payload.update({
    collection: 'products', id: product.id,
    data: {
      name: 'GPSLane 9/10-inch MP5 GPS Navigation Player',
      slug: newSlug,
      shortDescription: 'Scout-brand MP5 navigation player with GPS navigation in 9-inch and 10-inch dash-kit configurations. Supplier claims 1-year warranty — unverified.',
      description: richText('MP5 navigation player with GPS navigation. Available in 9-inch and 10-inch frame configurations (Scout brand). Power: 12V, 4x45W. Supplier description claims 1-year after-sales warranty — not independently verified. GPS capability per supplier listing — verification pending.'),
      seo: { metaTitle: 'GPSLane 9/10-inch MP5 GPS Navigation Player', metaDescription: 'MP5 GPS navigation player, 9 or 10 inch dash kit. Supplier specs; verification pending.' },
      launchVerification: {
        gpsClassification: 'navigation_display',
        gpsFunctionality: 'unverified',
        gpsReceiverEvidence: 'Product title/description claim GPS navigation; no receiver spec or manual evidence',
        navSoftwareOs: 'MP5/Android-based (supplier listing)',
        fccISEDStatus: 'pending_evidence',
        launchReadiness: 'pending_product_verification',
        launchNotes: 'CORRECTED Phase 11: previously mislabeled as passive installation frame — pid 1368761182843965440 is the MP5 head unit itself (2 variants: 9-inch $35.78 / 10-inch $38.53). CN stock 40,000 per variant. USPS 4-9d US $36.55 / CJPacket 4-7d CA $19.69. Cost now uses conservative 10-inch variant price.',
        lastVerifiedAt: new Date().toISOString(),
      },
    } as any,
  })

  // update variant price (use 10-inch cost basis) and supplier-product cost/quotes
  const variants = await payload.find({ collection: 'product-variants', where: { product: { equals: product.id } }, limit: 5 })
  for (const v of variants.docs as any[]) {
    await payload.update({ collection: 'product-variants', id: v.id, data: { prices: [
      { currency: 'usd', priceCents: 11133 }, { currency: 'cad', priceCents: 13499 },
    ] } as any })
    const sps = await payload.find({ collection: 'supplier-products', where: { variant: { equals: v.id } }, limit: 1 })
    const sp: any = sps.docs[0]
    if (sp) {
      await payload.update({ collection: 'supplier-products', id: sp.id, data: {
        unitCostCents: 3853,
        supplierVariantId: '1368761184362303488',
        supplierSku: 'CJQC103431802BY',
        shippingQuotes: [
          { destinationCountry: 'US', costCents: 3655, originCountry: 'CN', serviceName: 'USPS', etaMinDays: 4, etaMaxDays: 9, quotedAt: new Date().toISOString() },
          { destinationCountry: 'CA', costCents: 1969, originCountry: 'CN', serviceName: 'CJPacket Ordinary', etaMinDays: 4, etaMaxDays: 7, quotedAt: new Date().toISOString() },
        ],
        stockCn: 40000,
        warehouseVerified: true,
        shippingRouteVerified: true,
        supplierEvidence: 'CJ API product/query + freightCalculate checked 2026-11-09',
        supplierEvidenceCheckedAt: new Date().toISOString(),
      } as any })
    }
  }
  console.log('fixed ?', newSlug)
  process.exit(0)
}
main().catch((e) => { console.error('FATAL', e); process.exit(1) })

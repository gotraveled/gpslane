import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { availabilityFor, getProductBySlug, getPublishedProducts, getVariantsForProduct, mediaUrl, priceFor } from '../../../../lib/storefront'
import ProductCard from '../../../../components/ProductCard'
import VariantPicker from '../../../../components/VariantPicker'
import WishlistButton from '../../../../components/WishlistButton'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product' }
  const cat = Array.isArray(product.primaryCategory) ? product.primaryCategory[0] : product.primaryCategory
  const ogImage = (product.images ?? []).map((m: any) => mediaUrl(m)).find(Boolean)
  const description =
    product.seo?.metaDescription ??
    product.shortDescription ??
    `${product.name}${cat?.name ? ` — ${cat.name}` : ''} at GPSLane. Ships to the USA and Canada with clear pricing.`
  return {
    title: product.seo?.metaTitle ?? `${product.name} | GPSLane`,
    description,
    keywords: `${product.name}, ${cat?.name ?? 'GPS'}, buy GPS USA Canada, GPSLane`,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: { title: product.name, description, type: 'website', images: ogImage ? [ogImage] : undefined },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()
  const variants = await getVariantsForProduct(product.id)
  const all = await getPublishedProducts()
  const relatedBase = all.filter((p) => p.id !== product.id).slice(0, 3)
  const related = await Promise.all(
    relatedBase.map(async (p) => ({ product: p, variant: (await getVariantsForProduct(p.id))[0] })),
  )
  const images = (product.images ?? []).map((m: any) => mediaUrl(m)).filter(Boolean) as string[]
  const primary = images[0] ?? null
  const cat = Array.isArray(product.primaryCategory) ? product.primaryCategory[0] : product.primaryCategory

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription ?? undefined,
    image: images,
    sku: variants[0]?.sku,
    brand: { '@type': 'Brand', name: 'GPSLane' },
    offers: variants.flatMap((v: any) =>
      (v.prices ?? [])
        .filter((p: any) => p.currency === 'usd')
        .map((p: any) => ({
          '@type': 'Offer',
          price: p.priceCents / 100,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `/product/${product.slug}`,
        })),
    ),
  }

  return (
    <div className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="breadcrumbs">
        <Link href="/">Home</Link> / <Link href="/shop">Shop</Link>
        {cat?.name ? <> / <Link href={`/shop/${cat.slug}`}>{cat.name}</Link></> : null} / {product.name}
      </nav>

      <div className="pdp">
        <div>
          {primary ? (
            <>
              <div className="gallery-main"><img src={primary} alt={product.name} /></div>
              {images.length > 1 ? (
                <div className="gallery-thumbs">
                  {images.slice(1).map((u) => (
                    <img key={u} src={u} alt={`${product.name} view`} loading="lazy" />
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <div className="gallery-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>Product image coming soon</div>
          )}
        </div>

        <div className="pdp-info">
          {cat?.name ? <span className="card-cat">{cat.name}</span> : null}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <h1 style={{ flex: 1 }}>{product.name}</h1>
            <WishlistButton className="wish-btn wish-btn-inline" item={{ productId: product.id, slug: product.slug, name: product.name, imageUrl: primary, priceUsd: priceFor(variants[0], 'usd') }} />
          </div>
          {product.shortDescription ? <p className="muted">{product.shortDescription}</p> : null}

          <VariantPicker
            productId={product.id}
            productSlug={product.slug}
            productName={product.name}
            imageUrl={primary}
            variants={variants.map((v: any) => ({
              id: v.id,
              name: v.name,
              sku: v.sku,
              priceUsd: priceFor(v, 'usd'),
              priceCad: priceFor(v, 'cad'),
              shipUs: (() => { const a = availabilityFor(v, 'US'); return a ? { cost: (a.shippingCostCents ?? 0) / 100, min: a.etaMinDays, max: a.etaMaxDays } : null })(),
              shipCa: (() => { const a = availabilityFor(v, 'CA'); return a ? { cost: (a.shippingCostCents ?? 0) / 100, min: a.etaMinDays, max: a.etaMaxDays } : null })(),
            }))}
          />

          {(() => {
            const dv = variants[0]
            const usA = dv ? availabilityFor(dv, 'US') : null
            const caA = dv ? availabilityFor(dv, 'CA') : null
            return (
              <div className="pdp-specs">
                <div className="pdp-spec"><div className="k">Brand</div><div className="v">GPSLane</div></div>
                {dv?.sku ? <div className="pdp-spec"><div className="k">SKU</div><div className="v">{dv.sku}</div></div> : null}
                {cat?.name ? <div className="pdp-spec"><div className="k">Category</div><div className="v">{cat.name}</div></div> : null}
                <div className="pdp-spec"><div className="k">Shipping USA</div><div className="v">{usA ? `${usA.etaMinDays}–${usA.etaMaxDays} days` : '—'}</div></div>
                <div className="pdp-spec"><div className="k">Shipping Canada</div><div className="v">{caA ? `${caA.etaMinDays}–${caA.etaMaxDays} days` : '—'}</div></div>
                <div className="pdp-spec"><div className="k">Payment</div><div className="v">PayPal Secure</div></div>
                <div className="pdp-spec"><div className="k">Returns</div><div className="v">7-day window</div></div>
              </div>
            )
          })()}

          {product.description ? (
            <div className="description-body" style={{ marginTop: '1.5rem' }}>
              <RichText data={product.description} />
            </div>
          ) : null}

          <h3 style={{ marginTop: '1.75rem' }}>Shipping &amp; Returns</h3>
          <p className="muted" style={{ fontSize: '0.92rem' }}>
            Ships from our fulfilment partners to the USA and Canada. See our{' '}
            <Link href="/shipping-and-returns">shipping &amp; returns policy</Link>.
          </p>
        </div>
      </div>

      {related.length ? (
        <section>
          <h2>You may also like</h2>
          <div className="grid grid-3">
            {related.map(({ product: p, variant }) => <ProductCard key={p.id} product={p} variant={variant} />)}
          </div>
        </section>
      ) : null}
    </div>
  )
}

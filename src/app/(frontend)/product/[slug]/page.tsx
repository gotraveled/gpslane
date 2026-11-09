import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { availabilityFor, getProductBySlug, getPublishedProducts, getVariantsForProduct, mediaUrl, priceFor } from '../../../../lib/storefront'
import ProductCard from '../../../../components/ProductCard'

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
  const related = all.filter((p) => p.id !== product.id).slice(0, 3)
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
          <h1>{product.name}</h1>
          {product.shortDescription ? <p className="muted">{product.shortDescription}</p> : null}

          {variants.map((v: any, i: number) => {
            const usd = priceFor(v, 'usd')
            const cad = priceFor(v, 'cad')
            const us = availabilityFor(v, 'US')
            const ca = availabilityFor(v, 'CA')
            return (
              <div key={v.id} style={{ margin: '1rem 0' }}>
                {variants.length > 1 ? <p style={{ margin: '0 0 0.4rem', fontWeight: 600 }}>{v.name}</p> : null}
                <p className="price">{usd != null ? `$${usd.toFixed(2)} USD` : 'Price on request'}</p>
                <div className="avail">
                  {us ? <span>🇺🇸 USA — ${((us.shippingCostCents ?? 0) / 100).toFixed(2)} shipping · {us.etaMinDays}–{us.etaMaxDays} days</span> : <span>Not available in USA</span>}
                  {ca ? <span>🇨🇦 Canada — ${((ca.shippingCostCents ?? 0) / 100).toFixed(2)} shipping · {ca.etaMinDays}–{ca.etaMaxDays} days</span> : <span>Not available in Canada</span>}
                </div>
                {cad != null ? <p className="muted" style={{ fontSize: '0.85rem' }}>Also ${cad.toFixed(2)} CAD</p> : null}
              </div>
            )
          })}

          <div className="notice">
            Online checkout is launching soon. To order, <Link href="/contact">contact us</Link> with the product name.
          </div>

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
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      ) : null}
    </div>
  )
}

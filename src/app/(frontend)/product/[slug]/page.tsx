import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { availabilityFor, getPayloadClient, getProductBySlug, getPublishedProducts, getVariantsForProduct, mediaUrl, priceFor } from '../../../../lib/storefront'
import ReviewForm from './ReviewSection'
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
  const payload = await getPayloadClient()
  const reviews = await payload.find({
    collection: 'reviews',
    where: { and: [{ product: { equals: product.id } }, { status: { equals: 'approved' } }] },
    limit: 20, depth: 0, sort: '-createdAt',
  }).catch(() => ({ docs: [] as any[] }))
  const avgRating = reviews.docs.length
    ? reviews.docs.reduce((n: number, r: any) => n + (r.rating ?? 0), 0) / reviews.docs.length
    : 0
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
          url: `https://gpslane.com/product/${product.slug}`,
          itemCondition: 'https://schema.org/NewCondition',
          seller: { '@type': 'Organization', name: 'GPSLane' },
        })),
    ),
    ...(reviews.docs.length ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating.toFixed(1),
        reviewCount: reviews.docs.length,
      },
    } : {}),
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
              <div className="gallery-main" style={{ position: 'relative' }}><Image src={primary} alt={product.name} fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: 'cover' }} priority /></div>
              {images.length > 1 ? (
                <div className="gallery-thumbs">
                  {images.slice(1).map((u) => (
                    <div key={u} style={{ position: 'relative', width: 76, height: 76, borderRadius: 10, overflow: 'hidden', border: '2px solid var(--border)' }}><Image src={u} alt={`${product.name} view`} fill sizes="76px" style={{ objectFit: 'cover' }} /></div>
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

          <h3 style={{ marginTop: '1.75rem' }}>Frequently Asked Questions</h3>
          <div className="pdp-faq">
            {[
              ['How long does shipping take?', `USA: ${availabilityFor(variants[0], 'US') ? `${availabilityFor(variants[0], 'US').etaMinDays}–${availabilityFor(variants[0], 'US').etaMaxDays} business days` : '10–20 business days'}. Canada: ${availabilityFor(variants[0], 'CA') ? `${availabilityFor(variants[0], 'CA').etaMinDays}–${availabilityFor(variants[0], 'CA').etaMaxDays} business days` : '10–20 business days'}. Tracking is included on every order.`],
              ['What is your return policy?', 'Eligible items can be returned within 7 days of delivery if they arrive defective, damaged, or not as described. See our full returns policy for details.'],
              ['Is checkout secure?', 'Yes — all payments are processed by PayPal. We never see or store your card details.'],
              ['Do you ship outside USA/Canada?', 'Not currently — we focus exclusively on North American customers with verified USA & Canada stock.'],
            ].map(([q, a]) => (
              <details key={q} className="faq-item">
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section style={{ marginTop: '2.5rem' }}>
        <h2>Customer Reviews</h2>
        {reviews.docs.length ? (
          <>
            <p style={{ fontSize: '1.05rem', margin: '0 0 1rem' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}</span>{' '}
              <strong>{avgRating.toFixed(1)}</strong> <span className="muted">based on {reviews.docs.length} review{reviews.docs.length === 1 ? '' : 's'}</span>
            </p>
            <div className="grid grid-2" style={{ marginBottom: '1.5rem' }}>
              {(reviews.docs as any[]).map((r) => (
                <div key={r.id} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ color: 'var(--primary)', marginBottom: '0.35rem' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                  <strong>{r.title}</strong>
                  <p className="muted" style={{ fontSize: '0.9rem', margin: '0.4rem 0' }}>{r.body}</p>
                  <span className="muted" style={{ fontSize: '0.8rem' }}>— {r.authorName}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="muted">No reviews yet — be the first to share your experience.</p>
        )}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginTop: 0 }}>Write a Review</h3>
          <ReviewForm productId={product.id} />
        </div>
      </section>

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

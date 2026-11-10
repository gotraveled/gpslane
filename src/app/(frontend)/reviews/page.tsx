import Link from 'next/link'
import { getPayloadClient, mediaUrl } from '../../../lib/storefront'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Customer Reviews | GPS Lane',
  description: 'Real reviews from GPS Lane customers — GPS devices, navigation screens and map update service across the USA & Canada.',
}

export default async function ReviewsPage() {
  const payload = await getPayloadClient()
  const reviews = await payload.find({
    collection: 'reviews',
    where: { status: { equals: 'approved' } },
    limit: 60,
    depth: 1,
    sort: '-createdAt',
  }).catch(() => ({ docs: [] as any[] }))

  const avg = reviews.docs.length
    ? reviews.docs.reduce((n: number, r: any) => n + (r.rating ?? 0), 0) / reviews.docs.length
    : 0

  return (
    <div className="container" style={{ padding: '0.5rem 1.25rem 2.5rem' }}>
      <div className="page-head">
        <h1>Customer Reviews</h1>
        {reviews.docs.length ? (
          <p className="lede">
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{'★'.repeat(Math.round(avg))}{'☆'.repeat(5 - Math.round(avg))}</span>{' '}
            <strong>{avg.toFixed(1)}</strong> average across {reviews.docs.length} review{reviews.docs.length === 1 ? '' : 's'}
          </p>
        ) : (
          <p className="lede">Real feedback from GPS Lane customers.</p>
        )}
      </div>

      {reviews.docs.length ? (
        <div className="grid grid-2">
          {(reviews.docs as any[]).map((r) => {
            const product = typeof r.product === 'object' ? r.product : null
            const img = product && Array.isArray(product.images) && product.images.length ? mediaUrl(product.images[0]) : null
            return (
              <div className="card" key={r.id} style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt="" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                ) : null}
                <div>
                  <div style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                  <strong>{r.title}</strong>
                  <p className="muted" style={{ fontSize: '0.9rem', margin: '0.4rem 0' }}>{r.body}</p>
                  <span className="muted" style={{ fontSize: '0.8rem' }}>
                    — {r.authorName}
                    {product ? <> · <Link href={`/product/${product.slug}`}>{product.name}</Link></> : null}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="notice" style={{ textAlign: 'center' }}>
          <p>No reviews published yet — reviews appear here after moderation.</p>
          <p><Link href="/shop" className="btn btn-primary">Browse GPS Devices</Link></p>
        </div>
      )}
    </div>
  )
}

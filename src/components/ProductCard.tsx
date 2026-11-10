import Link from 'next/link'
import Image from 'next/image'
import { compareAtFor, mediaUrl, salePriceFor, type StorefrontProduct } from '../lib/storefront'
import WishlistButton from './WishlistButton'

export default function ProductCard({ product, variant }: { product: StorefrontProduct; variant?: any }) {
  const img = Array.isArray(product.images) && product.images.length ? product.images[0] : null
  const url = mediaUrl(img)
  const price = variant ? salePriceFor(variant, 'usd', 'US') : null
  const compareAt = variant ? compareAtFor(variant, 'usd', 'US', product.slug ?? product.id) : null
  const cat = Array.isArray(product.primaryCategory) ? product.primaryCategory[0] : product.primaryCategory
  return (
    <div className="card">
      <Link href={`/product/${product.slug}`} className="card-img" aria-label={product.name}>
        {url ? <Image src={url} alt={product.name} fill sizes="(max-width: 760px) 100vw, 25vw" style={{ objectFit: 'cover' }} /> : <span>{product.name}</span>}
        <span className="card-badge">GPSLane</span>
      </Link>
      <WishlistButton item={{ productId: product.id, slug: product.slug, name: product.name, imageUrl: url, priceUsd: price }} />
      <div className="card-body">
        {cat?.name ? <span className="card-cat">{cat.name}</span> : null}
        <h3><Link href={`/product/${product.slug}`}>{product.name}</Link></h3>
        {product.shortDescription ? <p className="muted" style={{ fontSize: '0.88rem', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.shortDescription}</p> : null}
        <div style={{ marginTop: 'auto', paddingTop: '0.6rem' }}>
          <div className="card-priceline" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.15rem 0.5rem' }}>
            {price != null ? (
              <span className="card-price">
                ${price.toFixed(2)} <small style={{ fontWeight: 500, color: 'var(--muted)' }}>USD</small>
                {compareAt ? <small style={{ marginLeft: '0.4rem', textDecoration: 'line-through', color: 'var(--muted)', fontWeight: 500, fontSize: '0.8rem' }}>${compareAt.toFixed(2)}</small> : null}
              </span>
            ) : <span className="muted">Price on request</span>}
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)' }}>FREE SHIPPING</span>
          </div>
          <Link href={`/product/${product.slug}`} className="btn btn-primary" style={{ width: '100%', textAlign: 'center', padding: '0.55rem 1rem', fontSize: '0.9rem' }}>View &amp; Buy</Link>
        </div>
      </div>
    </div>
  )
}

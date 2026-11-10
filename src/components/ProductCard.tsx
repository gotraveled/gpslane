import Link from 'next/link'
import Image from 'next/image'
import { mediaUrl, priceFor, type StorefrontProduct } from '../lib/storefront'
import WishlistButton from './WishlistButton'

export default function ProductCard({ product, variant }: { product: StorefrontProduct; variant?: any }) {
  const img = Array.isArray(product.images) && product.images.length ? product.images[0] : null
  const url = mediaUrl(img)
  const price = variant ? priceFor(variant, 'usd') : null
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.6rem' }}>
            {price != null ? <span className="card-price">${price.toFixed(2)} <small style={{ fontWeight: 500, color: 'var(--muted)' }}>USD</small></span> : <span className="muted">Price on request</span>}
            <span className="muted" style={{ fontSize: '0.75rem' }}>Ships USA + CA</span>
          </div>
          <Link href={`/product/${product.slug}`} className="btn btn-primary" style={{ width: '100%', textAlign: 'center', padding: '0.55rem 1rem', fontSize: '0.9rem' }}>View &amp; Buy</Link>
        </div>
      </div>
    </div>
  )
}

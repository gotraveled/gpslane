import Link from 'next/link'
import { mediaUrl, priceFor, type StorefrontProduct } from '../lib/storefront'

export default function ProductCard({ product, variant }: { product: StorefrontProduct; variant?: any }) {
  const img = Array.isArray(product.images) && product.images.length ? product.images[0] : null
  const url = mediaUrl(img)
  const price = variant ? priceFor(variant, 'usd') : null
  const cat = Array.isArray(product.primaryCategory) ? product.primaryCategory[0] : product.primaryCategory
  return (
    <div className="card">
      <Link href={`/product/${product.slug}`} className="card-img" aria-label={product.name}>
        {url ? <img src={url} alt={product.name} loading="lazy" /> : <span>{product.name}</span>}
      </Link>
      <div className="card-body">
        {cat?.name ? <span className="card-cat">{cat.name}</span> : null}
        <h3><Link href={`/product/${product.slug}`}>{product.name}</Link></h3>
        {product.shortDescription ? <p className="muted" style={{ fontSize: '0.9rem', margin: 0 }}>{product.shortDescription}</p> : null}
        <div style={{ marginTop: 'auto', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {price != null ? <span className="card-price">${price.toFixed(2)}</span> : <span className="muted">—</span>}
          <Link href={`/product/${product.slug}`} className="btn btn-ghost" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>View</Link>
        </div>
      </div>
    </div>
  )
}

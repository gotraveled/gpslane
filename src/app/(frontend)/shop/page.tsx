import Link from 'next/link'
import { getActiveCategories, getPublishedProducts, getVariantsForProduct } from '../../../lib/storefront'
import ProductCard from '../../../components/ProductCard'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Shop GPS Devices | GPS Navigation USA & Canada',
  description: 'Shop affordable GPS navigation devices, CarPlay displays, cycling computers and accessories at GPSLane — shipped to the USA and Canada with clear pricing and tracking.',
  keywords: 'buy GPS device, GPS navigation system, CarPlay GPS display, GPS cycling computer, GPS accessories USA Canada',
}

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getPublishedProducts(), getActiveCategories()])
  const withVariants = await Promise.all(
    products.map(async (p) => ({ product: p, variant: (await getVariantsForProduct(p.id))[0] })),
  )
  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      <div className="page-head">
        <h1>Shop GPS Devices</h1>
        <p className="lede">Affordable, dependable GPS navigation devices, displays, cycling computers and accessories — shipped to the USA and Canada.</p>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        {categories.map((c: any) => (
          <Link key={c.id} href={`/shop/${c.slug}`} className="card cat-tile" style={{ textDecoration: 'none' }}>
            <h3 style={{ color: 'var(--text)' }}>{c.name}</h3>
            <span className="btn btn-ghost" style={{ pointerEvents: 'none', fontSize: '0.85rem', padding: '0.4rem 1rem' }}>Browse →</span>
          </Link>
        ))}
      </div>

      {withVariants.length ? (
        <div className="grid grid-3">
          {withVariants.map(({ product, variant }) => (
            <ProductCard key={product.id} product={product} variant={variant} />
          ))}
        </div>
      ) : (
        <div className="empty-state"><p>Our catalogue is being finalized — check back soon.</p></div>
      )}
    </div>
  )
}

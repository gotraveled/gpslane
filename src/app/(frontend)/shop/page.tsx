import { getPublishedProducts, getVariantsForProduct } from '../../../lib/storefront'
import ProductCard from '../../../components/ProductCard'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Shop All GPS Products' }

export default async function ShopPage() {
  const products = await getPublishedProducts()
  const withVariants = await Promise.all(
    products.map(async (p) => ({ product: p, variant: (await getVariantsForProduct(p.id))[0] })),
  )
  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      <div className="page-head">
        <h1>All Products</h1>
        <p className="muted">GPS navigation devices, displays, cycling computers and accessories for USA and Canada.</p>
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

import { getPublishedProducts, getVariantsForProduct } from '../../../lib/storefront'
import ProductCard from '../../../components/ProductCard'
import CartClient from './CartClient'

export const metadata = {
  title: 'Shopping Cart | GPSLane',
  robots: { index: false },
}

export default async function CartPage() {
  const products = await getPublishedProducts().catch(() => [] as any[])
  const withVariants = await Promise.all(
    products.slice(0, 4).map(async (p) => ({ product: p, variant: (await getVariantsForProduct(p.id))[0] })),
  )
  return (
    <>
      <CartClient />
      {withVariants.length ? (
        <section className="container" style={{ padding: '0 1.25rem 3rem' }}>
          <h2>You May Also Like</h2>
          <div className="grid grid-4">
            {withVariants.map(({ product, variant }) => (
              <ProductCard key={product.id} product={product} variant={variant} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  )
}

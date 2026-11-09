import Link from 'next/link'
import { getActiveCategories, getPublishedProducts, getVariantsForProduct } from '../../lib/storefront'
import ProductCard from '../../components/ProductCard'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [products, categories] = await Promise.all([getPublishedProducts(), getActiveCategories()])
  const withVariants = await Promise.all(
    products.map(async (p) => ({ product: p, variant: (await getVariantsForProduct(p.id))[0] })),
  )

  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="eyebrow">USA &amp; Canada</p>
          <h1>Stay on the Right Lane with GPSLane</h1>
          <p className="lead">
            GPS navigation devices, cycling computers and accessories — plus professional map-update
            assistance — for drivers and riders who refuse to get lost.
          </p>
          <div className="hero-ctas">
            <Link href="/shop" className="btn btn-primary">Shop GPS Devices</Link>
            <Link href="/map-updates" className="btn btn-ghost">Get Map Updates</Link>
          </div>
          <div className="hero-badges">
            <div><strong>USA + Canada</strong>Shipping</div>
            <div><strong>Verified</strong>Product Data</div>
            <div><strong>Map Update</strong>Assistance</div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="grid grid-2">
            {categories.map((c) => (
              <Link key={c.id} href={`/shop/${c.slug}`} className="card cat-tile" style={{ textDecoration: 'none' }}>
                <h3 style={{ color: 'var(--text)' }}>{c.name}</h3>
                <p>{c.description}</p>
                <span className="btn btn-ghost" style={{ pointerEvents: 'none' }}>Browse →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-alt">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="grid grid-3">
            {withVariants.slice(0, 6).map(({ product, variant }) => (
              <ProductCard key={product.id} product={product} variant={variant} />
            ))}
          </div>
          <p style={{ marginTop: '1.5rem' }}><Link href="/shop">View all products →</Link></p>
        </div>
      </section>

      <section>
        <div className="container two-col">
          <div>
            <h2>GPS Map Update Assistance</h2>
            <p className="muted">
              Outdated maps? We help you identify your device, confirm map compatibility and guide
              you through manufacturer-supported update options for USA and Canadian regions.
            </p>
            <Link href="/map-updates" className="btn btn-primary">Learn More</Link>
          </div>
          <div>
            <h2>Why GPSLane</h2>
            <ul className="muted" style={{ paddingLeft: '1.2rem' }}>
              <li>Honest product information — no invented specs or fake reviews</li>
              <li>Clear USA and Canada shipping estimates before you buy</li>
              <li>Real support for GPS device and map-update questions</li>
              <li>Secure checkout powered by PayPal (launching soon)</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}

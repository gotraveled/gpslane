import Link from 'next/link'
import { getActiveCategories, getPublishedProducts, getVariantsForProduct } from '../../lib/storefront'
import ProductCard from '../../components/ProductCard'

export const dynamic = 'force-dynamic'

const WHY = [
  'Professional GPS Map Updates',
  'One-Time Fee – No Subscriptions',
  'Secure PayPal Payments',
  'Friendly Customer Service',
  'USA & Canada Coverage',
  'Honest Product Information',
]

const SERVICES = [
  {
    icon: '🗺️',
    title: 'GPS Map Update Service',
    desc: 'Tired of outdated routes or missing roads? Our expert map update service keeps your GPS current with the latest USA & Canada maps.',
    points: ['Step-by-step guidance until successful installation', 'One-time fee — no subscriptions or hidden costs', 'Works for most standard GPS devices'],
    cta: 'Request Map Update',
    href: '/gps-maps-updates',
  },
  {
    icon: '📡',
    title: 'GPSLane GPS Devices',
    desc: 'Looking for an affordable, quality GPS unit? GPSLane devices are designed for clear visibility, reliable performance, and easy navigation.',
    points: ['USA & Canada map coverage', 'Turn-by-turn guidance and voice directions', 'Secure PayPal checkout'],
    cta: 'Shop GPS Devices',
    href: '/shop',
  },
]

export default async function HomePage() {
  const [products, categories] = await Promise.all([getPublishedProducts(), getActiveCategories()])
  const withVariants = await Promise.all(
    products.map(async (p) => ({ product: p, variant: (await getVariantsForProduct(p.id))[0] })),
  )

  return (
    <>
      {/* Hero */}
      <section className="hero hero-bg" style={{ ['--hero-img' as any]: 'url(/api/media/file/img-90.jpg)' }}>
        <div className="container">
          <p className="eyebrow">USA &amp; Canada</p>
          <h1>Stay on the <span className="accent">Right Lane</span> with GPSLane</h1>
          <p className="lead">
            Your trusted GPS brand for reliable navigation and map updates across the USA &amp;
            Canada. Whether you need to update your existing GPS maps or buy a new navigation unit,
            GPSLane ensures every route is up-to-date, every trip is smooth, and every customer is
            supported by real people — not bots.
          </p>
          <div className="hero-ctas">
            <Link href="/gps-maps-updates" className="btn btn-primary">Update My GPS Maps</Link>
            <Link href="/shop" className="btn btn-ghost">Shop GPS Devices</Link>
          </div>
          <div className="hero-badges">
            <div><strong>One-Time Fee</strong>Map Updates</div>
            <div><strong>USA + Canada</strong>Coverage</div>
            <div><strong>PayPal</strong>Secure Payments</div>
            <div><strong>Real Support</strong>By Phone &amp; Email</div>
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section style={{ paddingTop: '2.5rem' }}>
        <div className="container">
          <div className="trust-strip">
            {WHY.map((w) => (
              <div className="trust-item" key={w}>
                <div className="ico">✅</div>
                <strong>{w}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-alt">
        <div className="container">
          <div className="page-head"><h2>Our Services</h2><p className="lede">Reliable GPS map updates and devices for USA &amp; Canada drivers.</p></div>
          <div className="services-row">
            {SERVICES.map((s) => (
              <div className="card" key={s.title} style={{ padding: '1.8rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                <h3>{s.title}</h3>
                <p className="muted">{s.desc}</p>
                <ul className="check-list muted" style={{ paddingLeft: '1.2rem', marginBottom: '1rem' }}>
                  {s.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
                <Link href={s.href} className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: 'auto' }}>{s.cta}</Link>
              </div>
            ))}
            <div className="service-visual" style={{ backgroundImage: 'url(/api/media/file/img-86.jpg)' }}>
              <div className="overlay">
                <strong style={{ fontSize: '1.05rem' }}>Premium Navigation, Ready to Ship</strong>
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.88rem', opacity: 0.9 }}>Every GPSLane device is tested, verified and shipped with tracking to the USA &amp; Canada.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section>
        <div className="container">
          <div className="page-head">
            <h2>Shop For Latest GPS</h2>
            <p className="lede">Affordable, dependable GPS navigation devices shipped to the USA and Canada.</p>
          </div>
          <div className="grid products-4up">
            {withVariants.slice(0, 8).map(({ product, variant }) => (
              <ProductCard key={product.id} product={product} variant={variant} />
            ))}
          </div>
          <p style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Link href="/shop" className="btn btn-primary" style={{ padding: '0.75rem 2.2rem' }}>View All Products →</Link>
          </p>
        </div>
      </section>

      {/* How map update works */}
      <section className="section-alt">
        <div className="container">
          <div className="page-head"><h2>How Our Map Update Service Works</h2></div>
          <div className="steps" style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="step"><h3>Fill Out the Map Update Form</h3><p className="muted">Share your GPS model and contact info — takes under a minute.</p></div>
            <div className="step"><h3>Get a Technician Call</h3><p className="muted">We confirm compatibility and explain the process and one-time price.</p></div>
            <div className="step"><h3>Pay Securely via PayPal</h3><p className="muted">Payment only happens after confirmation — never before.</p></div>
            <div className="step"><h3>We Guide You</h3><p className="muted">Our expert helps you install the new USA &amp; Canada maps remotely or via phone.</p></div>
          </div>
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/gps-maps-updates" className="btn btn-primary">Request Map Update</Link>
          </p>
        </div>
      </section>

      {/* Trust & transparency */}
      <section>
        <div className="container two-col">
          <div className="prose">
            <h2>🔒 Trust &amp; Transparency</h2>
            <p className="muted">
              GPSLane operates independently and is not affiliated with any other GPS brand or
              manufacturer. We provide authentic services exclusively under the GPSLane name.
            </p>
            <ul className="check-list muted">
              <li>Secure Payments — all payments handled via PayPal</li>
              <li>SSL Encryption — your data stays protected</li>
              <li>Verified Technicians — every update handled by trained professionals</li>
              <li>No Brand Confusion — independent, not affiliated with Garmin, TomTom or other OEMs</li>
            </ul>
          </div>
          <div className="prose">
            <h2>🧭 When to Update Your GPS Maps</h2>
            <ul className="check-list muted">
              <li>Your GPS misses new routes or exits</li>
              <li>Some roads no longer exist in your directions</li>
              <li>Travel times or distances seem incorrect</li>
              <li>You can&apos;t find new landmarks or points of interest</li>
            </ul>
            <p className="muted">
              Prefer to do it yourself? Read our free{' '}
              <Link href="/how-to-update-gps-maps-diy-guide">How to Update Maps (DIY Guide)</Link>.
            </p>
            <div className="notice">
              <strong>Get in Touch:</strong> 📞 <a href="tel:+18449667866" className="tel-link">+1 (844) 966-7866</a> · 📧 info@gpslane.com · Mon–Sat 9 AM – 7 PM PT
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

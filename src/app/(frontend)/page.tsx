import Link from 'next/link'
import { getActiveCategories, getPayloadClient, getPublishedProducts, getVariantsForProduct } from '../../lib/storefront'
import ProductCard from '../../components/ProductCard'
import NewsletterForm from '../../components/NewsletterForm'

export const revalidate = 3600

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
    title: 'GPS Lane GPS Devices',
    desc: 'Looking for an affordable, quality GPS unit? GPS Lane devices are designed for clear visibility, reliable performance, and easy navigation.',
    points: ['USA & Canada map coverage', 'Turn-by-turn guidance and voice directions', 'Secure PayPal checkout'],
    cta: 'Shop GPS Devices',
    href: '/shop',
  },
]

export default async function HomePage() {
  const [products] = await Promise.all([getPublishedProducts(), getActiveCategories()])
  const withVariants = await Promise.all(
    products.map(async (p) => ({ product: p, variant: (await getVariantsForProduct(p.id))[0] })),
  )
  const payload = await getPayloadClient()
  const testimonials = await payload
    .find({ collection: 'reviews', where: { status: { equals: 'approved' } }, limit: 3, depth: 0, sort: '-rating' })
    .then((r) => r.docs)
    .catch(() => [] as any[])

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gpslane.com'
  const jsonLd = [
    {
      '@context': 'https://schema.org', '@type': 'Organization',
      name: 'GPS Lane', url: site, logo: `${site}/logo-gpslane.png`,
      telephone: '+1-844-966-7866', email: 'info@gpslane.com',
      address: { '@type': 'PostalAddress', streetAddress: '4500 Margalo Avenue', addressLocality: 'Bakersfield', addressRegion: 'CA', postalCode: '93313', addressCountry: 'US' },
    },
    {
      '@context': 'https://schema.org', '@type': 'WebSite',
      name: 'GPS Lane', url: site,
      potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: `${site}/shop?q={search_term_string}` }, 'query-input': 'required name=search_term_string' },
    },
  ]
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Hero */}
      <section className="hero hero-bg" style={{ ['--hero-img' as any]: 'url(/api/media/file/img-90.jpg)' }}>
        <div className="container">
          <p className="eyebrow">USA &amp; Canada</p>
          <h1>Stay on the <span className="accent">Right Lane</span> with GPS Lane</h1>
          <p className="lead">
            Your trusted GPS brand for reliable navigation and map updates across the USA &amp;
            Canada. Whether you need to update your existing GPS maps or buy a new navigation unit,
            GPS Lane ensures every route is up-to-date, every trip is smooth, and every customer is
            supported by real people — not bots.
          </p>
          <div className="hero-ctas">
            <Link href="/gps-maps-updates" className="btn btn-primary">Update My GPS Maps</Link>
            <Link href="/shop" className="btn btn-ghost">Shop GPS Devices</Link>
          </div>
        </div>
        <a href="#why-gpslane" className="hero-scroll" aria-label="Scroll to content">⌄</a>
      </section>

      {/* Why choose */}
      <section id="why-gpslane" style={{ paddingTop: '2.5rem' }}>
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

      {/* Stats bar */}
      <section>
        <div className="container">
          <div className="stats-bar">
            <div className="stat"><strong>1,000+</strong><span>GPS map updates completed</span></div>
            <div className="stat"><strong>USA + CA</strong><span>Shipping coverage</span></div>
            <div className="stat"><strong>Mon–Sat</strong><span>Support 9 AM – 7 PM PT</span></div>
            <div className="stat"><strong>$99.99</strong><span>One-time map update fee</span></div>
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
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.88rem', opacity: 0.9 }}>Every GPS Lane device is tested, verified and shipped with tracking to the USA &amp; Canada.</p>
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

      {/* Testimonials */}
      {testimonials.length ? (
        <section className="section-alt">
          <div className="container">
            <div className="page-head">
              <h2>What Our Customers Say</h2>
              <p className="lede">Real reviews from GPS Lane buyers across the USA &amp; Canada.</p>
            </div>
            <div className="grid grid-3">
              {(testimonials as any[]).map((r) => (
                <div className="card" key={r.id} style={{ padding: '1.5rem' }}>
                  <div style={{ color: 'var(--primary)', marginBottom: '0.4rem' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                  <strong>{r.title}</strong>
                  <p className="muted" style={{ fontSize: '0.9rem', margin: '0.5rem 0' }}>{r.body}</p>
                  <span className="muted" style={{ fontSize: '0.82rem' }}>— {r.authorName}</span>
                </div>
              ))}
            </div>
            <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <Link href="/reviews" className="btn btn-ghost">Read All Reviews →</Link>
            </p>
          </div>
        </section>
      ) : null}

      {/* How map update works */}
      <section className="section-alt">
        <div className="container">
          <div className="page-head"><h2>How Our Map Update Service Works</h2></div>
          <div className="steps">
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

      {/* Latest guides */}
      <section>
        <div className="container">
          <div className="page-head">
            <h2>From Our Guides</h2>
            <p className="lede">Free resources to help you choose, use and update your GPS.</p>
          </div>
          <div className="grid grid-4">
            {[
              { href: '/guides/best-gps-for-truck-drivers', icon: '🚚', title: 'Best GPS Features for Truck Drivers', desc: 'What truckers actually need — truck routing, weight limits, rest stops and screen size.' },
              { href: '/guides/gps-vs-smartphone-navigation', icon: '📱', title: 'GPS vs Smartphone Navigation', desc: 'When a dedicated GPS beats your phone — offline maps, battery life and signal drops.' },
              { href: '/how-to-update-gps-maps-diy-guide', icon: '🗺️', title: 'How to Update GPS Maps Yourself', desc: 'A step-by-step DIY guide to updating maps on your own device — plus when to call a pro.' },
              { href: '/guides/gps-map-update-not-working', icon: '🔧', title: 'Map Update Not Working?', desc: 'Common fixes when a GPS map update fails — storage, connection and compatibility issues.' },
            ].map((g) => (
              <Link href={g.href} className="card" key={g.href} style={{ padding: '1.5rem', textDecoration: 'none' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{g.icon}</div>
                <h3 style={{ marginTop: 0 }}>{g.title}</h3>
                <p className="muted" style={{ fontSize: '0.9rem' }}>{g.desc}</p>
                <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>Read guide →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-alt">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Stay Updated With GPS Lane</h2>
          <p className="lede" style={{ margin: '0.4rem auto 1.25rem' }}>GPS tips, map-update reminders and subscriber-only deals. No spam — unsubscribe anytime.</p>
          <NewsletterForm />
        </div>
      </section>

      {/* Trust & transparency */}
      <section>
        <div className="container two-col">
          <div className="prose">
            <h2>🔒 Trust &amp; Transparency</h2>
            <p className="muted">
              GPS Lane operates independently and is not affiliated with any other GPS brand or
              manufacturer. We provide authentic services exclusively under the GPS Lane name.
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

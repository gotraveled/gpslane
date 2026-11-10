import Link from 'next/link'

export const metadata = {
  title: 'About GPS Lane | GPS Navigation Brand USA & Canada',
  description: 'Learn about GPS Lane — an independent GPS navigation brand based in Bakersfield, California, providing affordable GPS devices, professional map updates and trusted support for USA and Canada drivers.',
  keywords: 'GPS Lane, GPS navigation, GPS devices USA Canada, map update service, about GPS Lane',
}

export default function AboutPage() {
  return (
    <div className="container" style={{ padding: '0.5rem 1.25rem 2.5rem' }}>
      <div className="page-head">
        <h1>About Us</h1>
        <p className="lede">GPS Lane brings clear, reliable navigation to USA and Canada drivers.</p>
      </div>

      <h2>About GPS Lane – Your Partner in Reliable Navigation</h2>
      <p>
        At <strong>GPS Lane</strong>, we believe navigation should be simple, accurate, and worry-free.
        We help drivers across the <strong>United States and Canada</strong> stay on the right lane —
        with <strong>up-to-date GPS devices</strong>, <strong>map updates</strong>, and{' '}
        <strong>trusted support</strong> every step of the way.
      </p>
      <p>
        Our focus is on <strong>quality</strong>, <strong>transparency</strong>, and{' '}
        <strong>customer satisfaction</strong> — because every journey deserves the right direction.
      </p>

      <div className="service-visual" style={{ backgroundImage: 'url(/api/media/file/img-90.jpg)', margin: '1.5rem 0' }}>
        <div className="overlay">
          <strong style={{ fontSize: '1.05rem' }}>Real People. Real Support. Real Navigation.</strong>
          <p style={{ margin: '0.3rem 0 0', fontSize: '0.88rem', opacity: 0.9 }}>Bakersfield, California — serving drivers across the USA &amp; Canada.</p>
        </div>
      </div>

      <h2>Who We Are?</h2>
      <p>
        GPS Lane is an independent GPS navigation brand owned and operated by a registered company
        based in <strong>Bakersfield, California, USA</strong>. We serve customers in the <strong>USA and
        Canada</strong> by providing:
      </p>
      <ul className="check-list muted">
        <li>Affordable <strong>GPS navigation devices</strong></li>
        <li>Professional <strong>map update services</strong></li>
        <li>Friendly, real-time customer support via phone, email, and chat</li>
      </ul>
      <p className="muted">
        Our business model is simple — we source quality GPS units from verified suppliers and
        provide full customer service under the <strong>GPS Lane</strong> brand.
      </p>

      <h2>Our Mission</h2>
      <div className="notice">
        “To help every driver navigate safely and confidently through reliable technology,
        accurate maps, and honest service.”
      </div>
      <p className="muted">
        We&apos;re here to make GPS ownership effortless — no complicated updates, no hidden fees,
        no confusing subscriptions. Just a one-time service, friendly support, and clear communication.
      </p>

      <h2>Our Vision</h2>
      <p className="muted">
        GPS Lane aims to become a <strong>global name in navigation technology</strong>, known for
        affordability, integrity, and innovation. We&apos;re building a world where every driver —
        whether in a city or countryside — can travel with confidence using up-to-date GPS guidance.
      </p>

      <h2>What We Do</h2>
      <h3>🗺️ 1. GPS Map Update Services</h3>
      <p className="muted">
        Outdated maps can cause delays and missed turns. GPS Lane provides a professional{' '}
        <strong>map update service</strong> for <strong>$99.99 (one-time)</strong> that includes:
      </p>
      <ul className="check-list muted">
        <li>Updated USA &amp; Canada maps</li>
        <li>Live technician assistance</li>
        <li>Safe and verified installation process</li>
        <li>No recurring or hidden fees</li>
      </ul>
      <p className="muted">
        Customers simply fill out a short form, and our technician contacts them directly for guided
        installation service. <Link href="/gps-maps-updates">Learn more →</Link>
      </p>

      <h3>📡 2. GPS Devices</h3>
      <p className="muted">
        GPS Lane offers <strong>navigation devices</strong> for car owners, truck drivers, and
        delivery services. Each unit is tested, easy to use, and comes with free shipping guidance,
        secure PayPal payment, and reliable after-sales service.{' '}
        <Link href="/shop">Browse devices →</Link>
      </p>

      <h2>Our Customers</h2>
      <p className="muted">
        We proudly serve customers across the <strong>United States and Canada</strong> — from
        families and delivery drivers to professional fleets. Whether you need a new GPS device or
        help updating your old one, GPS Lane ensures a smooth, supported experience from start to finish.
      </p>

      <h2>Core Values</h2>
      <ul className="check-list muted">
        <li><strong>Transparency:</strong> We clearly explain our pricing, process, and policies — no hidden terms.</li>
        <li><strong>Trust:</strong> Customers can reach us directly by phone, email, or chat anytime.</li>
        <li><strong>Security:</strong> Payments are processed safely through PayPal and SSL encryption.</li>
        <li><strong>Customer Focus:</strong> Every order, every update, every question — answered by real humans.</li>
        <li><strong>Quality:</strong> Only verified suppliers and latest navigation data used for our products.</li>
      </ul>

      <h2>Our Commitment to Security</h2>
      <p className="muted">
        We know trust matters when shopping online. That&apos;s why GPS Lane ensures all transactions
        are <strong>secured with SSL encryption</strong>, payments are handled safely through{' '}
        <strong>PayPal</strong>, and your personal data is never sold. See our{' '}
        <Link href="/privacy-policy">Privacy Policy</Link> for details.
      </p>

      <h2>Shipping Transparency</h2>
      <p className="muted">
        All GPS units are shipped from our verified international suppliers and delivered to
        customers in the <strong>USA and Canada</strong>. Processing takes 2–5 business days and
        delivery typically 10–20 business days, with tracking provided for every order.
        See our <Link href="/shipping-and-returns">Shipping &amp; Returns Policy</Link> for details.
      </p>

      <h2>GPS Lane Promise</h2>
      <div className="notice">
        At GPS Lane, honesty drives everything we do. From transparent pricing to dependable
        delivery, our goal is to give you complete peace of mind when choosing us for your
        navigation needs. We may be a small brand, but our focus on service and customer
        satisfaction makes us big in reliability.
        <br /><br />
        “GPS Lane — helping you navigate every journey, one map at a time.”
      </div>

      <p style={{ marginTop: '2rem' }}>
        <Link href="/contact" className="btn btn-primary">Contact Us</Link>{' '}
        <Link href="/gps-maps-updates" className="btn btn-ghost">GPS Map Updates</Link>
      </p>
    </div>
  )
}

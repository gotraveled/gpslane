import MapUpdateRequestForm from './request/RequestForm'

import Link from 'next/link'

export const metadata = {
  title: 'GPS Map Updates for USA & Canada',
  description: 'Professional GPS map update service for USA & Canada — latest map data, technician-guided installation, one-time $99.99 fee, no subscriptions.',
}


export default function MapUpdatesPage() {
  return (
    <>
      {/* Hero + request form — mirrors legacy /gps-maps-updates */}
      <section style={{ padding: '3rem 0 2rem' }}>
        <div className="container">
          <div className="page-head" style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
            <h1>GPS Map Updates for USA &amp; Canada</h1>
            <p className="lede" style={{ margin: '0 auto' }}>
              Keep your navigation system current with expert-guided map updates.
              Fill the details below to start the map updates process.
            </p>
          </div>
          <div className="card" style={{ maxWidth: 560, margin: '1.5rem auto', padding: '1.8rem' }} id="request-form">
            <h3 style={{ marginTop: 0 }}>Get Started With Your Map Updates Today</h3>
            <MapUpdateRequestForm compact />
          </div>
        </div>
      </section>

      <section className="section-alt" style={{ paddingTop: '2.5rem' }}>
        <div className="container prose">
          <h2>Professional GPS Map Update Service for USA &amp; Canada</h2>
          <p>
            <strong>Never get lost on outdated maps again.</strong> GPSLane offers a professional
            GPS Map Update Service to help you refresh your navigation system with the latest
            USA &amp; Canada map data. Our experts guide you step-by-step to ensure your device
            gets updated safely and accurately.
          </p>
          <p className="muted">
            Whether you drive for work or travel across the country, our service ensures your GPS
            is always ready to lead you on the right path.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="page-head"><h2>What Our Map Update Service Includes</h2></div>
          <div className="grid grid-3">
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3>🗺️ Latest Map Data</h3>
              <p className="muted">Up-to-date coverage of highways, roads, and points of interest across the United States and Canada.</p>
            </div>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3>🛠️ Technician-Guided Update</h3>
              <p className="muted">Our trained team assists you through phone or email — from start to finish — ensuring a smooth update process.</p>
            </div>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3>✅ Compatibility Check</h3>
              <p className="muted">We verify your GPS model before starting. If it&apos;s not compatible, you won&apos;t be charged.</p>
            </div>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3>💵 One-Time Payment</h3>
              <p className="muted">No subscriptions or recurring charges — just a <strong>$99.99 USD one-time service fee</strong> for the complete update.</p>
            </div>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3>🔒 Secure &amp; Private</h3>
              <p className="muted">Payments handled via PayPal. SSL encryption. Your data is never sold or shared for advertising.</p>
            </div>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3>📞 Real Humans</h3>
              <p className="muted">24/7 customer service until your update is successful — call (888) 400-3290 or email info@gpslane.com.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-alt">
        <div className="container">
          <div className="page-head"><h2>How It Works</h2></div>
          <div className="steps" style={{ maxWidth: 820, margin: '0 auto' }}>
            <div className="step"><h3>Step 1: Fill Out the Map Update Form</h3><p className="muted">Provide your name, contact details, and GPS model information. We use this to verify compatibility before contacting you.</p></div>
            <div className="step"><h3>Step 2: Technician Contact</h3><p className="muted">One of our experts calls or emails you to confirm your GPS details and explain the update process in simple terms.</p></div>
            <div className="step"><h3>Step 3: One-Time Secure Payment</h3><p className="muted">Once compatibility is confirmed, you receive a PayPal invoice for <strong>$99.99 USD</strong>. All payments are handled securely through PayPal.</p></div>
            <div className="step"><h3>Step 4: Guided Update</h3><p className="muted">Our technician helps you install the latest map files safely via phone or remote assistance — until your update is successfully completed.</p></div>
          </div>
        </div>
      </section>

      <section>
        <div className="container two-col">
          <div className="prose">
            <h2>Who Can Use This Service</h2>
            <p>Our GPS Map Update Service is ideal for:</p>
            <ul className="check-list muted">
              <li>Drivers with older or unbranded GPS units</li>
              <li>Navigation systems missing new routes or POIs</li>
              <li>Customers looking for professional help updating their devices</li>
            </ul>
            <p className="muted">We service most standard GPS units used across the USA and Canada.</p>

            <h2>When to Update Your GPS Maps</h2>
            <ul className="check-list muted">
              <li>Your GPS misses new routes or exits</li>
              <li>Some roads no longer exist in your directions</li>
              <li>Travel times or distances seem incorrect</li>
              <li>You can&apos;t find new landmarks or points of interest</li>
            </ul>
            <p className="muted">Regular updates ensure you&apos;re always on the right path — literally.</p>
          </div>
          <div>
            <div className="card" style={{ padding: '1.8rem', marginBottom: '1.2rem' }}>
              <h3 style={{ marginTop: 0 }}>💵 Transparent Pricing</h3>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', margin: '0.25rem 0' }}>$99.99 <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--muted)' }}>USD one-time</span></p>
              <ul className="check-list muted" style={{ paddingLeft: '1.2rem' }}>
                <li>Technician-guided update</li>
                <li>USA &amp; Canada map data</li>
                <li>Service until completion</li>
              </ul>
              <p className="muted" style={{ fontSize: '0.9rem' }}>No hidden fees. No subscriptions. Just one transparent service price.</p>
            </div>
            <div className="notice">
              <strong>Gpslane Promise:</strong> every customer receives transparent communication,
              one-on-one assistance, and expert support — until your GPS is updated and ready to go.
              <br /><br />
              <strong>Important Note:</strong> GPSLane is an independent GPS navigation service
              provider — not affiliated with Garmin, TomTom, or any other OEM brand. We provide
              assistance and guidance for map updates, not resale of proprietary software.
              Prefer DIY? See our <Link href="/how-to-update-gps-maps-diy-guide">How to Update Maps (DIY Guide)</Link>.
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

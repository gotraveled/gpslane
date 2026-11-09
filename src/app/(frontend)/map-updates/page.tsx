export const metadata = { title: 'GPS Map Updates' }

export default function MapUpdatesPage() {
  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      <div className="page-head">
        <h1>GPS Map Update Service</h1>
        <p className="lede">
          Tired of outdated routes or missing roads? Our expert map update service keeps your GPS
          current with the latest USA &amp; Canada maps — one-time fee, no subscriptions.
        </p>
      </div>

      <div className="two-col" style={{ marginTop: '1.5rem' }}>
        <div className="prose">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step"><h3>Fill Out the Map Update Form</h3><p className="muted">Share your GPS model and phone number — takes under a minute.</p></div>
            <div className="step"><h3>Get a Technician Call</h3><p className="muted">We confirm your device is compatible and explain the process and price.</p></div>
            <div className="step"><h3>Pay Securely via PayPal</h3><p className="muted">Payment only happens after compatibility is confirmed — never before.</p></div>
            <div className="step"><h3>We Guide You</h3><p className="muted">Our technician helps you install the new USA &amp; Canada maps remotely or by phone until it works.</p></div>
          </div>
        </div>
        <div>
          <div className="card" style={{ padding: '1.6rem' }}>
            <h3 style={{ marginTop: 0 }}>What&apos;s Included</h3>
            <ul className="check-list muted" style={{ paddingLeft: '1.2rem' }}>
              <li>Latest USA &amp; Canada map data for your device</li>
              <li>Step-by-step guidance until successful installation</li>
              <li>One-time fee — no subscriptions or hidden costs</li>
              <li>Works with most standard GPS navigation devices</li>
              <li>Secure PayPal payment — only after confirmation</li>
            </ul>
            <a href="/map-updates/request" className="btn btn-primary" style={{ marginTop: '0.5rem', display: 'inline-block' }}>
              Request Map Update
            </a>
          </div>
          <div className="notice" style={{ marginTop: '1rem' }}>
            Prefer to do it yourself? Read our free{' '}
            <a href="/how-to-update-gps-maps-diy-guide">DIY GPS map-update guide</a>.
          </div>
        </div>
      </div>
    </div>
  )
}

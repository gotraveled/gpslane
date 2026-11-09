export const metadata = { title: 'GPS Map Update Assistance' }

export default function MapUpdatesPage() {
  return (
    <div className="container prose" style={{ padding: '2.5rem 1.25rem' }}>
      <h1>GPS Map Update Assistance</h1>
      <p>
        Road networks change constantly. If your GPS navigator, cycling computer or CarPlay
        navigation keeps routing you wrong, outdated maps are usually the cause. GPSLane helps you
        get the right maps for your device — safely and without guesswork.
      </p>

      <h2>How it works</h2>
      <div className="steps">
        <div className="step"><h3>1. Tell us about your device</h3><p className="muted">Manufacturer, model, screen size and current map version — take about two minutes via our request form.</p></div>
        <div className="step"><h3>2. We check eligibility</h3><p className="muted">We identify the correct map region (USA / Canada / combined), version and supported update method for your exact device.</p></div>
        <div className="step"><h3>3. You get a clear answer</h3><p className="muted">Either manufacturer-supported update instructions, an official map purchase link, or an honest &quot;this device can&rsquo;t be updated&quot; — plus a fixed quote where assistance is needed.</p></div>
      </div>

      <h2>What we can help with</h2>
      <ul>
        <li>Identifying your device&rsquo;s map provider and current version</li>
        <li>Confirming USA vs Canada vs North America map regions</li>
        <li>Manufacturer-website map downloads and SD-card updates</li>
        <li>Activation-code and license questions</li>
        <li>Deciding whether a device is worth updating or time to replace</li>
      </ul>

      <h2>What we won&rsquo;t do</h2>
      <ul>
        <li>We don&rsquo;t flash unofficial or pirated map files onto devices</li>
        <li>We don&rsquo;t claim updates for devices the manufacturer no longer supports</li>
        <li>We don&rsquo;t guarantee coverage for every model — eligibility is confirmed per device</li>
      </ul>

      <p style={{ marginTop: '2rem' }}>
        <a href="/map-updates/request" className="btn btn-primary">Start a map-update request</a>{' '}
        <a href="/map-updates/eligibility" className="btn btn-ghost">Check eligibility first</a>
      </p>
      <p className="muted" style={{ fontSize: '0.9rem' }}>
        Prefer to do it yourself? Read our <a href="/how-to-update-gps-maps-diy-guide">DIY GPS map-update guide</a>.
      </p>
    </div>
  )
}

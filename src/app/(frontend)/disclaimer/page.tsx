export const metadata = { title: 'Disclaimer' }

export default function DisclaimerPage() {
  return (
    <div className="container prose" style={{ padding: '2.5rem 1.25rem' }}>
      <h1>Disclaimer</h1>
      <p className="muted">Last updated: November 2026</p>
      <h2>General</h2>
      <p className="muted">
        GPSLane operates independently and is not affiliated with, endorsed by, or sponsored by any
        GPS device manufacturer or map provider. Product names and brands referenced on this site
        belong to their respective owners and are used only to identify compatible products and
        services.
      </p>
      <h2>Product information</h2>
      <p className="muted">
        Product specifications are based on supplier-provided information. Where a specification
        could not be independently verified, the listing states this explicitly. Compatibility
        statements are guidance — always confirm your device model before purchasing.
      </p>
      <h2>Map-update service</h2>
      <p className="muted">
        Map-update assistance depends on device eligibility, which is confirmed per device before
        any payment. GPSLane does not guarantee that every device or map region can be updated, and
        is not responsible for manufacturer map licensing terms.
      </p>
      <h2>Delivery estimates</h2>
      <p className="muted">
        Shipping and delivery estimates are provided by fulfilment partners and are estimates, not
        guarantees. Carrier delays, customs and weather events may affect delivery times.
      </p>
    </div>
  )
}

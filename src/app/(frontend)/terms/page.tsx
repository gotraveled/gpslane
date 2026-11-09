export const metadata = { title: 'Terms & Conditions' }

export default function TermsPage() {
  return (
    <div className="container prose" style={{ padding: '2.5rem 1.25rem' }}>
      <h1>Terms &amp; Conditions</h1>
      <p className="muted">Last updated: November 2026</p>
      <h2>Products</h2>
      <p className="muted">
        Product descriptions reflect supplier-provided information. Where a specification could not be
        independently verified, the listing says so. Compatibility statements are guidance, not
        guarantees — please confirm your device model before purchasing.
      </p>
      <h2>Pricing &amp; availability</h2>
      <p className="muted">
        Prices are listed in USD and CAD where available. Shipping costs and delivery estimates are
        shown per destination before purchase and are estimates, not guarantees. We may decline or
        cancel orders where stock or freight quotes change materially before dispatch; you would be
        fully refunded in that case.
      </p>
      <h2>Map-update service</h2>
      <p className="muted">
        Map-update assistance is subject to device eligibility review. We assist with
        manufacturer-supported update methods; we do not guarantee that every device or map region
        can be updated. Fees are quoted after eligibility review.
      </p>
      <h2>Acceptable use</h2>
      <p className="muted">
        Do not use GPSLane products for unlawful surveillance or tracking of persons without
        consent. You are responsible for complying with local laws regarding navigation devices,
        dashcams and vehicle electronics.
      </p>
      <h2>Liability</h2>
      <p className="muted">
        To the maximum extent permitted by law, GPSLane&rsquo;s liability is limited to the amount you
        paid for the product or service giving rise to the claim.
      </p>
    </div>
  )
}

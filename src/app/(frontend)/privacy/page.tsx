export const metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <div className="container prose" style={{ padding: '2.5rem 1.25rem' }}>
      <h1>Privacy Policy</h1>
      <p className="muted">Last updated: November 2026</p>
      <h2>What we collect</h2>
      <ul>
        <li><strong>Order information:</strong> name, email, shipping address and phone number needed to fulfil orders.</li>
        <li><strong>Device information:</strong> for map-update requests — device manufacturer, model, region and map version you choose to share.</li>
        <li><strong>Technical data:</strong> standard server logs (IP address, browser type) used for security and diagnostics.</li>
      </ul>
      <h2>What we never do</h2>
      <ul>
        <li>We do not sell your personal information.</li>
        <li>We do not share supplier costs, internal notes or staff-only product data publicly.</li>
        <li>We do not store full payment card details — payments are handled by PayPal.</li>
      </ul>
      <h2>Sharing</h2>
      <p className="muted">
        We share only what fulfilment requires: shipping details go to our supplier/fulfilment partners;
        payment data goes to PayPal. Map-update device details are used solely to assess and deliver
        your update assistance.
      </p>
      <h2>Your choices</h2>
      <p className="muted">
        You may request deletion of your data by emailing support@gpslane.com, except where we must
        retain records for tax, warranty or legal obligations.
      </p>
    </div>
  )
}

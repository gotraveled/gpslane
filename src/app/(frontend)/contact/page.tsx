export const metadata = { title: 'Contact GPSLane' }

export default function ContactPage() {
  return (
    <div className="container prose" style={{ padding: '2.5rem 1.25rem' }}>
      <h1>Contact Us</h1>
      <p>
        Questions about a product, an order, shipping to the USA or Canada, or GPS map updates —
        we read every message.
      </p>
      <h2>Before you write</h2>
      <ul>
        <li><strong>Map update help:</strong> use our <a href="/map-updates/request">map-update request form</a> so we can identify your device properly.</li>
        <li><strong>Orders:</strong> online checkout is launching soon. To pre-order or ask about availability, include the product name from its page.</li>
        <li><strong>Compatibility:</strong> tell us your device manufacturer, model and screen size where relevant.</li>
      </ul>
      <div className="form-note">
        <strong>Email:</strong> support@gpslane.com<br />
        <strong>Regions served:</strong> United States and Canada
      </div>
      <p className="muted" style={{ fontSize: '0.9rem' }}>
        We aim to respond within 1–2 business days. Please do not send payment details or passwords by email.
      </p>
    </div>
  )
}

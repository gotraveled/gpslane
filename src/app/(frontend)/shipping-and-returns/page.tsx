import ReturnRequestForm from './ReturnRequestForm'

export const metadata = {
  title: 'Shipping & Returns Policy | GPSLane',
  description: 'GPSLane shipping and returns policy — order processing, USA & Canada delivery times, tracking, customs, refunds, cancellations and return process for GPS devices and map update services.',
  keywords: 'GPSLane shipping policy, GPS device returns, GPS refund policy, USA Canada shipping',
}

const SECTIONS: [string, string[]][] = [
  ['🕓 Order Processing', [
    'Once you place an order through our website, our team immediately begins the fulfillment process.',
    'Processing Time: 2–5 business days. We verify your order, confirm payment via PayPal, and forward your order to our shipping partner.',
    'You\u2019ll receive an order confirmation email within 24 hours and a tracking link once your package ships.',
    'If you do not receive tracking details within 7 business days, contact info@gpslane.com or call +1 (844) 966-7866.',
  ]],
  ['🌎 Shipping Destinations', [
    'GPSLane proudly serves customers across the United States and Canada. We currently do not ship outside these two regions — contact us before ordering if you are located elsewhere.',
  ]],
  ['🚚 Delivery Timeframes', [
    'All GPS devices are shipped directly from our verified international suppliers.',
    'Typical delivery times: 10–20 business days for both the USA and Canada (after processing).',
    'Shipping time may vary depending on your location, local customs, and courier schedules. GPSLane is not responsible for delays caused by postal carriers, customs clearance, or uncontrollable circumstances.',
  ]],
  ['📦 Tracking Your Order', [
    'Every shipment comes with an official tracking number. After dispatch you\u2019ll receive a confirmation email containing the courier name, tracking link, and estimated delivery date.',
  ]],
  ['💵 Shipping Cost', [
    'The shipping cost for each product and destination is shown on the product page before you buy — USA and Canada are priced separately. If an expedited option becomes available it will be displayed at checkout.',
  ]],
  ['🧾 Customs, Duties & Taxes', [
    'For customers in the USA and Canada, most shipments are duty-free. In rare cases, import duties or taxes may apply depending on your region\u2019s laws — these are the responsibility of the buyer. GPSLane will assist with documentation if needed.',
  ]],
  ['🔁 Return Policy', [
    'Eligible for return within 7 calendar days of delivery if: you received the wrong item, the product arrived defective or damaged, or it does not match the website description.',
    'Not eligible: physically damaged-by-customer items, completed map update services, or items returned after 7 days.',
    'Return process: contact info@gpslane.com with your order ID and issue details → we review and issue a Return Authorization if approved → once received and inspected we notify you → approved refunds process within 5–10 business days to your original payment method.',
    'Ensure returned items are unused, in original packaging, and include all accessories.',
  ]],
  ['💰 Refund Policy', [
    'Approved refunds are processed back to your PayPal account or credit card within 5–10 business days.',
    'If your product is delayed beyond 30 business days, contact us for a replacement or full refund.',
  ]],
  ['🚫 Cancellations', [
    'Orders can be cancelled within 24 hours of purchase if the order has not yet shipped. Once dispatched, cancellations cannot be processed — you can still request a return after delivery.',
  ]],
]

export default function ShippingReturnsPage() {
  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      <div className="page-head">
        <h1>Shipping &amp; Returns Policy</h1>
        <p className="muted">Last updated: November 2026</p>
        <p className="lede">
          At GPSLane, we believe in complete transparency. This page explains how we handle order
          processing, shipping timelines, tracking, and return requests for our products and services.
        </p>
      </div>
      {SECTIONS.map(([h, paras]) => (
        <div key={h}>
          <h2>{h}</h2>
          {paras.map((p, i) => <p key={i} className="muted">{p}</p>)}
        </div>
      ))}
      <h2>🔁 Request a Return</h2>
      <div className="card" style={{ padding: '1.5rem' }}>
        <ReturnRequestForm />
      </div>
      <div className="notice">
        <strong>📞 How to Contact for Returns or Delivery Issues:</strong> Email{' '}
        <a href="mailto:info@gpslane.com">info@gpslane.com</a> · Phone <strong><a href="tel:+18449667866" className="tel-link">+1 (844) 966-7866</a></strong> ·
        Online contact form on GPSLane.com. Please include your order number and checkout email for faster resolution.
      </div>
      <div className="notice">
        <strong>🕊️ Transparency Commitment:</strong> GPSLane believes in honesty and fairness with
        every transaction. We will always communicate openly regarding order status, delivery updates,
        and return requests. Thank you for trusting GPSLane — your reliable partner for GPS devices
        and map update services.
      </div>
    </div>
  )
}

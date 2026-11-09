export const metadata = { title: 'FAQ' }

const FAQS = [
  ['What does GPSLane sell?', 'GPS navigation devices, navigation displays (CarPlay/Android Auto screens), GPS cycling computers, and accessories like mounts, holders, power adapters and head-up displays — for the USA and Canada.'],
  ['Are the GPS devices standalone navigators?', 'Some are, some aren\'t — and we label them honestly. Standalone GPS navigators navigate without a phone. CarPlay/Android Auto displays need a compatible smartphone. Each product page states which type it is; where GPS capability is unverified we say so explicitly.'],
  ['Do you ship to both the USA and Canada?', 'Yes. Shipping cost and delivery estimates are shown per country on each product page. If a product can\'t be reliably shipped to one country, it shows as unavailable there.'],
  ['How long does shipping take?', 'It depends on the quoted service — economy lines can take 1–3 weeks, express services are faster. The estimated range is displayed before you buy; it is an estimate, not a guarantee.'],
  ['Is online checkout available?', 'Checkout is launching soon. Until then, contact us with the product name to place an order.'],
  ['Do you offer GPS map updates?', 'Yes — map-update assistance is a core GPSLane service. Submit a device request and we confirm eligibility and options before any payment. See /map-updates.'],
  ['Are products GPSLane-manufactured?', 'No. GPSLane is a retailer. Products are sourced from verified suppliers; third-party brands (where present) are named on the product page. We never claim to manufacture or certify products we resell.'],
  ['What if a product arrives damaged?', 'Contact us within 7 days with photos. Damaged or incorrect items are replaced or refunded per our returns policy.'],
]

export default function FaqPage() {
  return (
    <div className="container prose" style={{ padding: '2.5rem 1.25rem' }}>
      <h1>Frequently Asked Questions</h1>
      {FAQS.map(([q, a]) => (
        <div className="faq-item" key={q}>
          <h3>{q}</h3>
          <p className="muted">{a}</p>
        </div>
      ))}
    </div>
  )
}

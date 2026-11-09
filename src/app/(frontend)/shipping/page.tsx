export const metadata = { title: 'Shipping Policy' }

const FAQS = [
  ['Do you ship to the USA and Canada?', 'Yes — we treat the USA and Canada as separate destinations. Each product page shows country-specific shipping cost and estimated delivery before you buy. If a product cannot be reliably shipped to one country, it is marked unavailable there.'],
  ['How are shipping costs calculated?', 'Shipping is charged per order based on the destination country and the product\'s quoted freight. The exact cost appears on the product page and at checkout.'],
  ['What are the delivery estimates?', 'Estimates come from our fulfilment partners\' freight quotes and are ranges, not guarantees. Economy services typically take longer than express services — the estimate shown is the honest range for the quoted service.'],
  ['Where do orders ship from?', 'Orders are fulfilled by our supplier partners. Dispatch location varies by product and is confirmed at order time — we do not claim US or Canadian warehouse fulfilment unless it is verified for that product.'],
  ['Do you offer tracking?', 'Where the quoted shipping service supports tracking, a tracking reference is provided once the order ships.'],
  ['What if my order is delayed?', 'If a shipment misses its estimated window, contact us with your order number — we will check status with the fulfilment partner and advise on options.'],
]

export default function ShippingPage() {
  return (
    <div className="container prose" style={{ padding: '2.5rem 1.25rem' }}>
      <h1>Shipping Policy</h1>
      <p className="muted">Last updated: November 2026</p>
      {FAQS.map(([q, a]) => (
        <div className="faq-item" key={q}>
          <h3>{q}</h3>
          <p className="muted">{a}</p>
        </div>
      ))}
    </div>
  )
}

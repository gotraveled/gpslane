export const metadata = { title: 'Returns & Refund Policy' }

const SECTIONS = [
  ['Eligibility', 'You may request a return within 30 days of delivery for products that arrive defective, damaged, or materially different from the listing. Map-update assistance services are evaluated case by case.'],
  ['How to start a return', 'Contact support@gpslane.com with your order number and a description (photos help for damaged items). We will confirm eligibility and provide return instructions.'],
  ['Refunds', 'Approved refunds are issued to the original payment method via PayPal once the returned item is received and inspected, or immediately for confirmed defects where return shipment is impractical.'],
  ['Non-returnable items', 'Items that show signs of use beyond inspection, missing accessories, or damage caused after delivery may not be eligible. Software/map downloads and completed assistance services are generally non-refundable once delivered.'],
  ['Damaged or wrong items', 'If you receive a damaged or incorrect item, tell us within 7 days of delivery with photos — we will make it right.'],
]

export default function ReturnsPage() {
  return (
    <div className="container prose" style={{ padding: '2.5rem 1.25rem' }}>
      <h1>Returns &amp; Refund Policy</h1>
      <p className="muted">Last updated: November 2026</p>
      {SECTIONS.map(([h, p]) => (
        <div key={h}>
          <h2>{h}</h2>
          <p className="muted">{p}</p>
        </div>
      ))}
    </div>
  )
}

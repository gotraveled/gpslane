export const metadata = {
  title: 'GPSLane FAQs | GPS Map Updates & Devices Help',
  description: 'Answers to common GPSLane questions — GPS map update service cost ($99.99 one-time), device compatibility, shipping to USA & Canada, PayPal payments, returns and refunds.',
  keywords: 'GPSLane FAQ, GPS map update cost, GPS device compatibility, GPS shipping USA Canada',
}

const FAQS: [string, string][] = [
  ['Q1: What is GPSLane?', 'GPSLane is an independent GPS navigation brand that provides affordable GPS devices and map update services to customers across the USA and Canada. We specialize in helping drivers keep their navigation systems up to date with the latest routes, highways, and points of interest.'],
  ['Q2: Do you sell Garmin, TomTom, or other branded GPS devices?', 'No. GPSLane operates as an independent GPS brand and is not affiliated with Garmin, TomTom, or any other third-party manufacturer. All products sold on GPSLane.com are GPSLane-branded or unbranded GPS units sourced from verified suppliers.'],
  ['Q3: What is the GPS Map Update Service?', 'Our Map Update Service is a one-time support service that helps customers update their existing GPS device maps for USA and Canada. Fill out the Map Update Request Form, our technician calls to verify your GPS model and compatibility, you pay a one-time fee of $99.99 USD via PayPal once confirmed, and our team assists you step-by-step in installing the latest map data. There are no recurring or subscription fees.'],
  ['Q4: How much does the Map Update Service cost?', 'The cost for a professional map update is $99.99 USD (one-time charge). This includes assistance, map file setup guidance, and service until your device is successfully updated.'],
  ['Q5: How do I know if my GPS device is compatible?', 'Before charging any fees, our technician confirms your device\u2019s compatibility over the phone or email. If your model cannot be updated, you will not be charged. We support most standard automotive GPS units, as well as several unbranded or older navigation models.'],
  ['Q6: How long does shipping take for GPS devices?', 'Shipping times and costs are shown per product and destination (USA and Canada are priced separately). You\u2019ll receive a tracking number once your order ships. See our Shipping & Returns Policy for details.'],
  ['Q7: Where do you ship from?', 'All GPSLane products are fulfilled through verified international suppliers. Orders are shipped directly from our fulfillment partners, and we handle all customer service and after-sales service through our GPSLane team.'],
  ['Q8: How can I track my order?', 'Once your order has shipped, you\u2019ll receive a confirmation email with your tracking number and courier link. You can track your shipment online anytime. If you haven\u2019t received tracking info within 7 business days, contact us at info@gpslane.com.'],
  ['Q9: What payment methods do you accept?', 'We accept secure online payments via PayPal, which supports all major credit and debit cards. GPSLane does not store your card information — all payments are encrypted and processed securely by PayPal.'],
  ['Q10: Is it safe to shop on GPSLane.com?', 'Yes! Our website uses SSL encryption (HTTPS) to secure all data and transactions. We process payments only through trusted providers like PayPal to ensure your personal information is protected.'],
  ['Q11: What if my GPS update fails or I face technical issues?', 'If any issue occurs during the update process, our technician will assist you until the update is successful. In rare cases where your device is incompatible, we\u2019ll guide you on alternative solutions before charging any fees. Our goal is 100% customer satisfaction.'],
  ['Q12: What is your return and refund policy?', 'We accept returns for defective or incorrect products within 7 days of delivery. Refunds are processed within 5–10 business days after inspection. Map update services are non-refundable once completed, since they involve phone & digital service. Please review our full Shipping & Returns Policy for more details.'],
  ['Q13: Can I cancel an order after payment?', 'Yes — you can cancel an order within 24 hours of purchase if it has not yet shipped. Once your order is dispatched, cancellations cannot be processed. Contact info@gpslane.com as soon as possible if you wish to cancel.'],
  ['Q14: What if I receive a defective product?', 'If your GPS device arrives defective, damaged, or different from the description, please notify us immediately. We\u2019ll arrange for a replacement or refund as per our return policy. All defective product claims must be reported within 7 days of delivery.'],
  ['Q15: Do you offer lifetime map updates or free updates?', 'No — GPSLane does not offer lifetime or free map updates. We charge a one-time $99.99 fee for professional map update assistance, ensuring full compliance with software licensing and advertising policies.'],
  ['Q16: What customer service options are available?', 'GPSLane provides multiple service channels: Email info@gpslane.com · Toll-Free (USA & Canada) +1 (844) 966-7866 · Live Chat on GPSLane.com. Service hours are Monday to Saturday, 9 AM – 7 PM PT. We aim to respond to all inquiries within 24 hours.'],
  ['Q17: What personal data does GPSLane collect?', 'We collect only the data necessary to process your orders and provide customer service — such as your name, email, address, and GPS model. All data is handled in accordance with our Privacy Policy. We never sell or share your data with third parties for advertising.'],
  ['Q18: How can I contact GPSLane?', 'Toll-Free (USA & Canada): +1 (844) 966-7866 · Email: info@gpslane.com · Address: C201–202, Phase 8B, Bakersfield, California, USA · Live Chat: Available on our website. We\u2019re always happy to help!'],
]

export default function FaqPage() {
  return (
    <div className="container prose" style={{ padding: '2.5rem 1.25rem' }}>
      <div className="page-head">
        <h1>Frequently Asked Questions (FAQs)</h1>
        <p className="lede">
          Welcome to the GPSLane Help Center! We&apos;ve compiled answers to the most common
          questions about our GPS devices, map update services, orders, and assistance.
        </p>
        <p className="muted">If you don&apos;t find your answer here, contact us at <a href="mailto:info@gpslane.com">info@gpslane.com</a> or call <strong>+1 (844) 966-7866</strong>.</p>
      </div>
      {FAQS.map(([q, a]) => (
        <div className="faq-item" key={q}>
          <h3>{q}</h3>
          <p className="muted">{a}</p>
        </div>
      ))}
      <div className="notice" style={{ marginTop: '2rem' }}>
        <strong>🕊️ Our Promise:</strong> at GPSLane, we believe in clear communication, no hidden
        terms, and honest service. Whether you need help updating maps or tracking an order,
        we&apos;re here to keep you moving in the right direction — safely and confidently.
      </div>
    </div>
  )
}

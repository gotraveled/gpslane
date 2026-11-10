export const metadata = {
  title: 'Terms & Conditions | GPSLane',
  description: 'GPSLane terms and conditions — products, payments via PayPal, shipping, returns, map update service policy, intellectual property and governing law.',
  keywords: 'GPSLane terms, GPS purchase terms, GPSLane policies',
}

const SECTIONS: [string, string[]][] = [
  ['1. About GPSLane', [
    'GPSLane ("we", "our", "us") is an independent GPS navigation brand based in Bakersfield, California, USA, offering GPS devices and map update services for customers in the United States and Canada.',
    'Company Address: 4500 Margalo Avenue, Bakersfield, California 93313 · Email: info@gpslane.com · Phone: +1 (844) 966-7866',
  ]],
  ['2. Use of This Website', [
    'By using GPSLane.com, you agree to use the website lawfully and responsibly. You agree not to engage in fraudulent, harmful, or unlawful activities; attempt to access restricted areas or interfere with website security; or copy, modify, or distribute any content without written permission.',
    'We reserve the right to terminate access or cancel orders for misuse or policy violations.',
  ]],
  ['3. Products & Services', [
    'GPSLane sells GPSLane-branded or unbranded GPS devices, sourced from verified international suppliers, and professional GPS Map Update Services — a one-time $99.99 fee that assists customers in updating navigation data.',
    'We do not claim affiliation with Garmin, TomTom, or any other GPS manufacturer. All devices are tested and configured for compatibility within the USA & Canada region.',
  ]],
  ['4. Pricing & Payments', [
    'All prices on GPSLane.com are listed in USD. Accepted payments: PayPal (credit/debit card via PayPal gateway).',
    'Payment must be completed at checkout for product orders. For map update services, payment is collected after our technician confirms compatibility via phone or email.',
    'We do not charge recurring fees, subscriptions, or hidden costs. All transactions are encrypted through PayPal\u2019s secure checkout system.',
  ]],
  ['5. Shipping & Fulfillment', [
    'GPSLane ships orders to the USA and Canada only. Processing time: 2–5 business days. Shipping time: 10–20 business days. Tracking provided once shipped. Shipping cost is shown per product and destination before purchase.',
    'All GPS products are shipped from verified international suppliers, and all customer service is managed by GPSLane directly. Please refer to our Shipping & Returns Policy for more details.',
  ]],
  ['6. Returns, Refunds & Cancellations', [
    'Eligible for return within 7 days of delivery if the product is defective, incorrect, or not as described. Refunds are issued to the original payment method (PayPal) within 5–10 business days of approval. Orders can be cancelled within 24 hours if not yet shipped.',
    'Map update services are non-refundable once completed, as they involve digital service. For all refund or return requests, contact info@gpslane.com.',
  ]],
  ['7. Map Update Service Policy', [
    'GPSLane provides professional map update assistance for a one-time fee of $99.99 USD. Our technician guides customers via phone or email to ensure successful installation of the latest navigation data for USA & Canada.',
    'This service does not include resale or distribution of copyrighted software from third-party GPS manufacturers. GPSLane only provides installation service and guidance.',
  ]],
  ['8. Intellectual Property Rights', [
    'All content on GPSLane.com, including text, images, graphics, videos, and website design, is owned by or licensed to GPSLane. You may not reproduce, republish, or distribute any content without written permission. The GPSLane name and logo are trademarks of our company.',
  ]],
  ['9. Privacy & Data Protection', [
    'Your privacy is important to us. All personal information collected during your visit or purchase is handled in accordance with our Privacy Policy. GPSLane does not sell or share personal data with third parties except for order processing (PayPal, shipping partners). Our website uses SSL encryption and secure hosting.',
  ]],
  ['10. Limitation of Liability', [
    'GPSLane is not liable for any indirect, incidental, or consequential damages resulting from delays in shipping or customs clearance, technical errors or map data inaccuracies, or misuse of GPS devices or services. While we strive for accuracy, GPS navigation systems rely on third-party data providers, and small discrepancies may occur.',
    'By purchasing from GPSLane.com, you acknowledge that we provide assistance and products "as available," without any implied warranties.',
  ]],
  ['11. Governing Law', [
    'These Terms & Conditions are governed by and interpreted in accordance with the laws of the State of California, USA. Any disputes arising from these terms will fall under the exclusive jurisdiction of the courts in Bakersfield, California, USA. However, GPSLane remains committed to resolving all customer issues through fair communication before any formal proceedings.',
  ]],
  ['12. Contact Information', [
    'Email: info@gpslane.com · Toll-Free (USA & Canada): +1 (844) 966-7866 · Address: 4500 Margalo Avenue, Bakersfield, California 93313',
  ]],
  ['13. Updates to These Terms', [
    'GPSLane reserves the right to modify or update these Terms & Conditions at any time without prior notice. Changes take effect immediately upon posting to this page. We encourage you to review this page periodically.',
  ]],
]

export default function TermsPage() {
  return (
    <div className="container" style={{ padding: '0.5rem 1.25rem 2.5rem' }}>
      <div className="page-head">
        <h1>Terms &amp; Conditions</h1>
        <p className="muted">Effective Date: November 2025</p>
        <p className="muted">
          Welcome to <strong>GPSLane.com</strong>. By accessing or purchasing from this website,
          you agree to the following terms and conditions. Please read them carefully before
          placing an order or using any of our services. If you do not agree with any of these
          terms, please refrain from using our website.
        </p>
      </div>
      {SECTIONS.map(([h, paras]) => (
        <div key={h}>
          <h2>{h}</h2>
          {paras.map((p, i) => <p key={i} className="muted">{p}</p>)}
        </div>
      ))}
    </div>
  )
}

export const metadata = {
  title: 'Privacy Policy | GPSLane',
  description: 'GPSLane privacy policy — what data we collect, how we use it, PayPal payments, cookies, data retention and your privacy rights for GPS orders and map update requests.',
  keywords: 'GPSLane privacy policy, GPS data protection, GPSLane cookies',
}

const SECTIONS: [string, string[]][] = [
  ['1. Who We Are', [
    'GPSLane is an independent GPS navigation brand providing GPS devices and map update services to customers in the United States and Canada.',
    'Registered address: 4500 Margalo Avenue, Bakersfield, California 93313. Contact: info@gpslane.com · +1 (844) 966-7866',
  ]],
  ['2. Information We Collect', [
    'Personal Information: full name, email address, phone number, shipping and billing address, GPS model or device details (when requesting map updates).',
    'Transactional Data: order ID and purchase history, payment method (PayPal confirmation details only — we never store card data).',
    'Technical Information: IP address, browser type, operating system, pages visited, time spent on site, referral sources, device type.',
    'This data helps us fulfill orders, improve our services, and ensure your experience is safe and efficient.',
  ]],
  ['3. How We Use Your Information', [
    'We use your personal and technical data only for lawful business purposes: processing orders and service requests, sending order confirmations and tracking details, providing map update support or customer assistance, responding to inquiries or complaints, managing refunds and returns, improving website functionality, and ensuring secure transactions and fraud prevention.',
    'We do not sell, rent, or trade your personal data to any third party.',
  ]],
  ['4. Payments & Security', [
    'All payments on GPSLane.com are processed through PayPal, a secure and trusted payment gateway. GPSLane does not store any debit or credit card information.',
    'Our website uses SSL encryption (HTTPS) to ensure that any data you share with us remains private and protected from unauthorized access.',
  ]],
  ['5. Data Sharing', [
    'We may share limited data only with trusted third parties that help us operate our business: shipping carriers (order delivery and tracking), payment processors such as PayPal (secure transaction handling), and technical service providers (website hosting and analytics).',
    'Each partner is required to comply with data protection regulations. GPSLane does not share data with advertising networks or unrelated marketing companies.',
  ]],
  ['6. Data Retention', [
    'We retain customer information only as long as necessary to fulfill orders, provide after-sales support, or meet legal and accounting requirements. Typically: order records up to 2 years, support communications up to 1 year, inactive user data deleted after 24 months.',
    'You can request deletion of your data anytime by contacting info@gpslane.com.',
  ]],
  ['7. Cookies & Analytics', [
    'GPSLane.com uses cookies to enhance your browsing experience and analyze site performance — keeping items in your cart, remembering preferences, and analyzing visitor interaction.',
    'You can disable cookies through your browser settings, though some site features may not function properly without them. We may use trusted analytics tools for anonymous usage data — never for personal identification.',
  ]],
  ['8. Email Communication', [
    'When you make a purchase or submit a contact form, you may receive transactional or support emails from GPSLane. We only send marketing emails if you explicitly opt in, and you can unsubscribe anytime. We never send spam or share your email with external mailing lists.',
  ]],
  ['9. Your Rights', [
    'Depending on your region (U.S., Canada, or EU), you may have the right to access, correct, delete ("Right to be Forgotten"), restrict, or object to processing of your personal data, and to withdraw consent.',
    'To exercise these rights, email info@gpslane.com with the subject "Privacy Request." We will respond within 10 business days.',
  ]],
  ['10. Protecting Your Information', [
    'We take appropriate technical and organizational measures to safeguard your personal data: SSL encryption, regular security scans, secure hosting infrastructure, and limited internal access to sensitive data. No online system is 100% immune from risks.',
  ]],
  ['11. International Data Transfer', [
    'As GPSLane operates from the United States and serves customers in the U.S. and Canada, your information may be processed internationally. We ensure all cross-border data transfers comply with applicable privacy regulations and are handled securely.',
  ]],
  ['11a. California Residents — CCPA Rights', [
    'If you are a California resident, the California Consumer Privacy Act (CCPA) gives you the right to: know what personal information we collect and how it is used; request a copy of the personal information we hold about you; request deletion of your personal information (subject to order-record retention obligations); and opt out of the sale of personal information.',
    'GPSLane does not sell personal information — we never have and we do not share data with advertisers. To exercise any CCPA right, email info@gpslane.com with the subject "CCPA Request" or call +1 (844) 966-7866. We will verify your identity and respond within 45 days.',
  ]],
  ['12. Changes to This Policy', [
    'GPSLane reserves the right to update or revise this Privacy Policy periodically. If significant changes occur, we will update the effective date and notify users by email or a banner notice on our website.',
  ]],
]

export default function PrivacyPage() {
  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      <div className="page-head">
        <h1>Privacy Policy</h1>
        <p className="muted">Effective Date: November 2025</p>
        <p className="muted">
          At <strong>GPSLane.com</strong>, your privacy is our top priority. We respect your
          personal information and are committed to protecting it responsibly, transparently, and
          in accordance with global data protection standards. By using our website, you agree to
          the terms described below.
        </p>
      </div>
      {SECTIONS.map(([h, paras]) => (
        <div key={h}>
          <h2>{h}</h2>
          {paras.map((p, i) => <p key={i} className="muted">{p}</p>)}
        </div>
      ))}
      <div className="notice">
        <strong>📞 Contact Us:</strong> Email <a href="mailto:info@gpslane.com">info@gpslane.com</a> ·
        Toll-Free (USA &amp; Canada) <strong>+1 (844) 966-7866</strong> · Mailing Address: C201-202,
        Phase 8B, Bakersfield, California 93313
      </div>
    </div>
  )
}

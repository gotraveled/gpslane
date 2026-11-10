export const metadata = {
  title: 'Payment Security | GPSLane',
  description: 'How GPSLane keeps your payment safe — PayPal-only checkout, SSL encryption, buyer protection, and no stored card data.',
}

const CARDS = [
  { icon: '🔒', title: 'SSL Encrypted', desc: 'Every page on gpslane.com is served over HTTPS with TLS encryption. Your data travels securely from your browser to our servers.' },
  { icon: '🅿️', title: 'PayPal-Only Checkout', desc: 'All payments are processed by PayPal — one of the most trusted payment platforms in the world. We accept PayPal balance and all major cards through PayPal\'s secure checkout.' },
  { icon: '🛡️', title: 'PayPal Buyer Protection', desc: 'Eligible purchases are covered by PayPal Buyer Protection — if your item doesn\'t arrive or isn\'t as described, you can open a dispute and request a refund.' },
  { icon: '💳', title: 'We Never See Your Card', desc: 'GPSLane never sees, stores, or processes your card number. Card details are entered on PayPal\'s secure interface and never touch our systems.' },
]

export default function PaymentSecurityPage() {
  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      <div className="page-head">
        <h1>Payment Security</h1>
        <p className="lede">Shopping safely on gpslane.com — how your payment and data stay protected.</p>
      </div>

      <div className="grid grid-2">
        {CARDS.map((c) => (
          <div className="card" key={c.title} style={{ padding: '1.6rem' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>{c.icon}</div>
            <h2 style={{ marginTop: 0 }}>{c.title}</h2>
            <p className="muted" style={{ fontSize: '0.92rem', margin: 0 }}>{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="notice" style={{ marginTop: '2rem' }}>
        <strong>Spot something suspicious?</strong> If you receive an unexpected charge or a
        message claiming to be from GPSLane asking for card details, it is not from us — we only
        ever process payments through PayPal. Contact us at info@gpslane.com or +1 (844) 966-7866.
      </div>
    </div>
  )
}

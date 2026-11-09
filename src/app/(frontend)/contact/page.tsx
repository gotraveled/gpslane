import ContactForm from './ContactForm'

export const metadata = {
  title: 'Contact GPSLane | GPS Support USA & Canada',
  description: 'Contact GPSLane for GPS map updates, orders and support. Call <a href="tel:+18449667866" className="tel-link">+1 (844) 966-7866</a>, email info@gpslane.com — serving the USA and Canada, Mon–Sat 9 AM – 7 PM PT.',
  keywords: 'contact GPSLane, GPS customer support, map update help, GPSLane phone number',
}

export default function ContactPage() {
  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem', maxWidth: 960 }}>
      <div className="page-head">
        <h1>Contact Us</h1>
        <p className="lede">We are available to help with GPS map updates, orders, or general inquiries.</p>
      </div>

      <div className="grid grid-2">
        <div>
          <div className="card" style={{ padding: '1.6rem', marginBottom: '1.2rem' }}>
            <h3 style={{ marginTop: 0 }}>📞 Get in Touch</h3>
            <p style={{ marginBottom: '0.4rem' }}><strong>Toll-Free (USA &amp; Canada):</strong> <a href="tel:+18449667866" className="tel-link">+1 (844) 966-7866</a></p>
            <p style={{ marginBottom: '0.4rem' }}><strong>📧 Email:</strong> <a href="mailto:info@gpslane.com">info@gpslane.com</a></p>
            <p className="muted" style={{ marginBottom: '0.4rem', fontSize: '0.9rem' }}>💬 Chat support coming soon — email or call us anytime.</p>
          </div>
          <div className="card" style={{ padding: '1.6rem', marginBottom: '1.2rem' }}>
            <h3 style={{ marginTop: 0 }}>📍 Mailing Address</h3>
            <p className="muted" style={{ marginBottom: 0 }}>4500 Margalo Avenue, Bakersfield, California 93313</p>
          </div>
          <div className="card" style={{ padding: '1.6rem' }}>
            <h3 style={{ marginTop: 0 }}>🕐 Working Hours</h3>
            <p className="muted" style={{ marginBottom: 0 }}>Mon–Sat: 9 AM – 7 PM PT<br />Sunday: Closed</p>
          </div>
        </div>
        <div>
          <div className="card" style={{ padding: '1.6rem' }}>
            <h3 style={{ marginTop: 0 }}>Send Us a Message</h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}

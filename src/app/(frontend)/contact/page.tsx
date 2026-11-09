export const metadata = { title: 'Contact Us' }

export default function ContactPage() {
  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem', maxWidth: 860 }}>
      <div className="page-head">
        <h1>Get in Touch</h1>
        <p className="lede">Questions or need help? Reach out anytime — real people, not bots.</p>
      </div>

      <div className="grid grid-2">
        <div className="prose">
          <h2>Contact Details</h2>
          <div className="card" style={{ padding: '1.4rem 1.6rem' }}>
            <p style={{ marginBottom: '0.4rem' }}><strong>📞 Phone (Toll-Free):</strong> (888) 400-3290</p>
            <p style={{ marginBottom: '0.4rem' }}><strong>📧 Email:</strong> <a href="mailto:info@gpslane.com">info@gpslane.com</a></p>
            <p className="muted" style={{ marginBottom: 0, fontSize: '0.9rem' }}>
              Serving customers across the USA and Canada.
            </p>
          </div>
          <h2 style={{ marginTop: '1.6rem' }}>Before you write</h2>
          <ul className="muted">
            <li><strong>Map update help:</strong> use our <a href="/map-updates/request">map-update request form</a> so a technician can call you back.</li>
            <li><strong>Orders:</strong> online checkout is launching soon — include the product name from its page.</li>
            <li><strong>Compatibility:</strong> tell us your device manufacturer, model and screen size where relevant.</li>
          </ul>
        </div>
        <div>
          <div className="card" style={{ padding: '1.6rem' }}>
            <h3 style={{ marginTop: 0 }}>Send Us a Message</h3>
            <form className="form-grid" action="mailto:info@gpslane.com" method="post" encType="text/plain">
              <div><label htmlFor="cf-name">Your Name</label><input id="cf-name" name="name" required /></div>
              <div><label htmlFor="cf-email">Email Address *</label><input id="cf-email" name="email" type="email" required /></div>
              <div><label htmlFor="cf-msg">Message *</label><textarea id="cf-msg" name="message" rows={5} required /></div>
              <div><button type="submit" className="btn btn-primary">Send Message</button></div>
              <p className="muted" style={{ fontSize: '0.82rem', margin: 0 }}>This opens your email client addressed to info@gpslane.com.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata = { title: 'Contact Us' }

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
            <p style={{ marginBottom: '0.4rem' }}><strong>Toll-Free (USA &amp; Canada):</strong> (888) 400-3290</p>
            <p style={{ marginBottom: '0.4rem' }}><strong>📧 Email:</strong> <a href="mailto:info@gpslane.com">info@gpslane.com</a></p>
            <p className="muted" style={{ marginBottom: '0.4rem', fontSize: '0.9rem' }}>💬 Live Chat: Available on GPSLane.com</p>
          </div>
          <div className="card" style={{ padding: '1.6rem', marginBottom: '1.2rem' }}>
            <h3 style={{ marginTop: 0 }}>📍 Mailing Address</h3>
            <p className="muted" style={{ marginBottom: 0 }}>C201-202, Phase 8B, Mohali, Punjab 140203, India</p>
          </div>
          <div className="card" style={{ padding: '1.6rem' }}>
            <h3 style={{ marginTop: 0 }}>🕐 Working Hours</h3>
            <p className="muted" style={{ marginBottom: 0 }}>Mon–Sat: 9 AM – 7 PM IST<br />Sunday: Closed</p>
          </div>
        </div>
        <div>
          <div className="card" style={{ padding: '1.6rem' }}>
            <h3 style={{ marginTop: 0 }}>Send Us a Message</h3>
            <form className="form-grid" action="mailto:info@gpslane.com" method="post" encType="text/plain">
              <div className="grid grid-2" style={{ gap: '1rem' }}>
                <div><label htmlFor="cf-name">Name</label><input id="cf-name" name="name" /></div>
                <div><label htmlFor="cf-last">Last name</label><input id="cf-last" name="lastname" /></div>
              </div>
              <div><label htmlFor="cf-email">Your Email *</label><input id="cf-email" name="email" type="email" required /></div>
              <div><label htmlFor="cf-msg">Message *</label><textarea id="cf-msg" name="message" rows={5} required /></div>
              <div><button type="submit" className="btn btn-primary">Submit</button></div>
              <p className="muted" style={{ fontSize: '0.82rem', margin: 0 }}>This opens your email client addressed to info@gpslane.com.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

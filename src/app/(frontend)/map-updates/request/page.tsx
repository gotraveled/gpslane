import MapUpdateRequestForm from './RequestForm'

export const metadata = {
  title: 'Request a GPS Map Update | GPSLane',
  description: 'Request a professional GPS map update — tell us your name, GPS device model and phone number. A GPSLane technician calls to confirm compatibility before any payment.',
  keywords: 'request GPS map update, schedule GPS map update, GPS map update form',
}

export default function MapUpdateRequestPage() {
  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      <div className="page-head">
        <h1>Request a GPS Map Update</h1>
        <p className="lede">
          Enter your name, GPS device and phone number. A GPSLane technician will call you to
          confirm compatibility — payment is only taken after your update is confirmed.
        </p>
      </div>
      <div style={{ margin: '0 auto' }}>
        <MapUpdateRequestForm />
        <p className="muted" style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
          Prefer to talk first? Call us toll-free at <strong><a href="tel:+18449667866" className="tel-link">+1 (844) 966-7866</a></strong> or email{' '}
          <a href="mailto:info@gpslane.com">info@gpslane.com</a>.
        </p>
      </div>
    </div>
  )
}

import MapUpdateRequestForm from './RequestForm'

export const metadata = { title: 'Request a Map Update' }

export default function MapUpdateRequestPage() {
  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem', maxWidth: 720 }}>
      <div className="page-head">
        <h1>Request a GPS Map Update</h1>
        <p className="lede">
          Enter your name, GPS device and phone number. A GPSLane technician will call you to
          confirm compatibility — payment is only taken after your update is confirmed.
        </p>
      </div>
      <MapUpdateRequestForm />
      <p className="muted" style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
        Prefer to talk first? Call us toll-free at <strong>(888) 400-3290</strong> or email{' '}
        <a href="mailto:info@gpslane.com">info@gpslane.com</a>.
      </p>
    </div>
  )
}

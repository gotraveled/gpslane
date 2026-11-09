import MapUpdateRequestForm from './RequestForm'

export const metadata = { title: 'Request a Map Update' }

export default function MapUpdateRequestPage() {
  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem', maxWidth: 860 }}>
      <h1>Request a Map Update</h1>
      <p className="muted">
        Tell us about your device and we will check which map update options apply. No payment is
        taken at this stage — we quote after confirming eligibility.
      </p>
      <MapUpdateRequestForm />
    </div>
  )
}

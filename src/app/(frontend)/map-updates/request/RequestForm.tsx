'use client'

import { useActionState } from 'react'
import { submitMapUpdateRequest, type RequestState } from './actions'

const initial: RequestState = { ok: false, message: '' }

export default function MapUpdateRequestForm() {
  const [state, formAction, pending] = useActionState(submitMapUpdateRequest, initial)
  return (
    <form action={formAction} className="form-grid">
      <div>
        <label htmlFor="fullName">Your Name *</label>
        <input id="fullName" name="fullName" placeholder="e.g. John Smith" required />
      </div>
      <div>
        <label htmlFor="deviceModel">GPS Device Name or Model *</label>
        <input id="deviceModel" name="deviceModel" placeholder="e.g. TomTom GO 5200, Garmin DriveSmart, Magellan RoadMate" required />
      </div>
      <div>
        <label htmlFor="phone">Phone Number *</label>
        <input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" required />
      </div>
      <div>
        <label htmlFor="country">Country</label>
        <select id="country" name="country" defaultValue="us">
          <option value="us">United States</option>
          <option value="ca">Canada</option>
        </select>
      </div>
      <div>
        <label htmlFor="email">Email (optional)</label>
        <input id="email" name="email" type="email" placeholder="you@example.com" />
      </div>
      {state.message ? (
        <div className="notice">{state.message}{state.requestNumber ? ` (${state.requestNumber})` : ''}</div>
      ) : null}
      <div>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? 'Submitting…' : 'Request Map Update'}
        </button>
      </div>
      <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>
        🔒 Your details are only used to contact you about your map update. See our{' '}
        <a href="/privacy-policy">Privacy Policy</a>.
      </p>
    </form>
  )
}

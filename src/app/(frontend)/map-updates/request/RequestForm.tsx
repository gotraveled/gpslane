'use client'

import { useActionState } from 'react'
import { submitMapUpdateRequest, type RequestState } from './actions'

const initial: RequestState = { ok: false, message: '' }

export default function MapUpdateRequestForm() {
  const [state, formAction, pending] = useActionState(submitMapUpdateRequest, initial)
  return (
    <form action={formAction} className="form-grid">
      <div className="grid grid-2" style={{ gap: '1rem' }}>
        <div><label htmlFor="fullName">Full name *</label><input id="fullName" name="fullName" required /></div>
        <div><label htmlFor="email">Email *</label><input id="email" name="email" type="email" required /></div>
        <div><label htmlFor="phone">Phone *</label><input id="phone" name="phone" type="tel" required /></div>
        <div>
          <label htmlFor="country">Country *</label>
          <select id="country" name="country" required defaultValue="us">
            <option value="us">United States</option>
            <option value="ca">Canada</option>
          </select>
        </div>
        <div><label htmlFor="deviceManufacturer">Device manufacturer *</label><input id="deviceManufacturer" name="deviceManufacturer" placeholder="e.g. TomTom, Garmin, Magellan" required /></div>
        <div><label htmlFor="deviceModel">Device model</label><input id="deviceModel" name="deviceModel" placeholder="e.g. GO 5200" /></div>
        <div><label htmlFor="deviceSerial">Serial number (optional)</label><input id="deviceSerial" name="deviceSerial" /></div>
        <div><label htmlFor="screenSizeIn">Screen size (inches)</label><input id="screenSizeIn" name="screenSizeIn" type="number" step="0.1" min="0" /></div>
        <div>
          <label htmlFor="deviceAgeBand">Device age</label>
          <select id="deviceAgeBand" name="deviceAgeBand" defaultValue="unknown">
            <option value="unknown">Not sure</option>
            <option value="under_2y">Under 2 years</option>
            <option value="2_5y">2–5 years</option>
            <option value="5_10y">5–10 years</option>
            <option value="over_10y">Over 10 years</option>
          </select>
        </div>
        <div>
          <label htmlFor="mapSource">How were maps installed?</label>
          <select id="mapSource" name="mapSource" defaultValue="unknown">
            <option value="unknown">Not sure</option>
            <option value="manufacturer_site">Manufacturer website</option>
            <option value="sd_card">SD card</option>
            <option value="preinstalled">Came preinstalled</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div><label htmlFor="mapVersion">Current map version (optional)</label><input id="mapVersion" name="mapVersion" placeholder="e.g. 2024.1 or 'don't know'" /></div>
      </div>
      <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text)' }}>
        <input type="checkbox" name="hasWifi" style={{ width: 'auto' }} /> Device has Wi-Fi
      </label>
      <div><label htmlFor="notes">Anything else we should know?</label><textarea id="notes" name="notes" rows={3} /></div>
      {state.message ? (
        <div className={state.ok ? 'notice' : 'notice'} style={state.ok ? {} : { borderColor: '#f87171' }}>
          {state.message}{state.requestNumber ? ` (${state.requestNumber})` : ''}
        </div>
      ) : null}
      <div><button type="submit" className="btn btn-primary" disabled={pending}>{pending ? 'Submitting…' : 'Submit Request'}</button></div>
    </form>
  )
}

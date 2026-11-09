'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { submitMapUpdateRequest, type RequestState } from './actions'

const initial: RequestState = { ok: false, message: '' }

type Props = {
  compact?: boolean
  minimal?: boolean
  submitLabel?: string
}

export default function MapUpdateRequestForm({ compact = false, minimal = false, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(submitMapUpdateRequest, initial)
  const label = submitLabel ?? (minimal ? 'Schedule Map Update' : 'Request Map Update')
  return (
    <form action={formAction} className="form-grid">
      <div className={minimal ? 'grid grid-2' : 'grid grid-2'} style={{ gap: '1rem' }}>
        <div>
          <label htmlFor="fullName">Name *</label>
          <input id="fullName" name="fullName" placeholder="Your full name" required />
        </div>
        {!minimal ? (
          <div>
            <label htmlFor="email">Your Email *</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>
        ) : null}
        <div>
          <label htmlFor="deviceModel">GPS Name or Model Number</label>
          <input id="deviceModel" name="deviceModel" placeholder="e.g. TomTom GO 5200, Garmin DriveSmart" />
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
      </div>
      {state.message ? (
        <div className="notice">{state.message}{state.requestNumber ? ` (${state.requestNumber})` : ''}</div>
      ) : null}
      <div>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? 'Submitting…' : label}
        </button>
      </div>
      {!compact ? (
        <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>
          🔒 Your details are only used to contact you about your map update. See our{' '}
          <Link href="/privacy-policy">Privacy Policy</Link>.
        </p>
      ) : null}
    </form>
  )
}

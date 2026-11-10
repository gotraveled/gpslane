'use client'

import { useActionState } from 'react'
import { subscribeNewsletter, type SubscribeState } from '../app/(frontend)/actions'

const initial: SubscribeState = { ok: false, message: '' }

export default function NewsletterForm() {
  const [state, formAction, pending] = useActionState(subscribeNewsletter, initial)
  return (
    <form action={formAction} style={{ display: 'flex', gap: '0.6rem', maxWidth: 520, margin: '0 auto' }}>
      <label htmlFor="nl-email" className="sr-only">Email address</label>
      <input
        id="nl-email"
        name="email"
        type="email"
        required
        placeholder="Your email address"
        style={{ flex: 1, minWidth: 0 }}
      />
      <button type="submit" className="btn btn-primary" disabled={pending || state.ok}>
        {state.ok ? 'Subscribed ✓' : pending ? 'Subscribing…' : 'Subscribe'}
      </button>
      {state.message && !state.ok ? <div className="notice" style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}>{state.message}</div> : null}
      {state.ok ? <p className="muted" style={{ margin: 0, alignSelf: 'center', fontSize: '0.85rem' }}>{state.message}</p> : null}
    </form>
  )
}

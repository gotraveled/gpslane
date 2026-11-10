'use client'

import { useActionState } from 'react'
import { notifyBackInStock, type SubscribeState } from '../app/(frontend)/actions'

const initial: SubscribeState = { ok: false, message: '' }

export default function BackInStock({ productName, variantName }: { productName: string; variantName?: string }) {
  const [state, formAction, pending] = useActionState(notifyBackInStock, initial)
  return (
    <div className="card" style={{ padding: '1.25rem', marginTop: '1rem', borderLeft: '3px solid var(--primary)' }}>
      <strong>Out of stock in your region</strong>
      <p className="muted" style={{ fontSize: '0.9rem', margin: '0.35rem 0 0.75rem' }}>
        Leave your email and we&apos;ll let you know as soon as this item is back.
      </p>
      {state.ok ? (
        <p style={{ color: 'var(--primary)', fontWeight: 600, margin: 0 }}>{state.message}</p>
      ) : (
        <form action={formAction} style={{ display: 'flex', gap: '0.6rem' }}>
          <input type="hidden" name="product" value={productName} />
          {variantName ? <input type="hidden" name="variant" value={variantName} /> : null}
          <label htmlFor="bis-email" className="sr-only">Email address</label>
          <input id="bis-email" name="email" type="email" required placeholder="Your email" style={{ flex: 1, minWidth: 0 }} />
          <button type="submit" className="btn btn-primary" disabled={pending} style={{ padding: '0.6rem 1.1rem' }}>
            {pending ? 'Saving…' : 'Notify Me'}
          </button>
        </form>
      )}
      {state.message && !state.ok ? <div className="notice" style={{ marginTop: '0.6rem' }}>{state.message}</div> : null}
    </div>
  )
}

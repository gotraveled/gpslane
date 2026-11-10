'use client'

import { useActionState } from 'react'
import { submitReview, type ReviewState } from './actions'

const initial: ReviewState = { ok: false, message: '' }

export default function ReviewForm({ productId }: { productId: number | string }) {
  const [state, formAction, pending] = useActionState(async (_prev: ReviewState, fd: FormData) => {
    fd.set('productId', String(productId))
    return submitReview(initial, fd)
  }, initial)

  if (state.ok) {
    return <div className="notice"><strong>Thanks for your review!</strong> It will appear once our team approves it (usually within 24h).</div>
  }

  return (
    <form action={formAction} className="form-grid">
      <div className="grid grid-2" style={{ gap: '1rem' }}>
        <div><label htmlFor="rv-name">Name *</label><input id="rv-name" name="authorName" required /></div>
        <div><label htmlFor="rv-rating">Rating *</label>
          <select id="rv-rating" name="rating" required defaultValue="5">
            <option value="5">★★★★★ (5)</option>
            <option value="4">★★★★ (4)</option>
            <option value="3">★★★ (3)</option>
            <option value="2">★★ (2)</option>
            <option value="1">★ (1)</option>
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1' }}><label htmlFor="rv-title">Review Title *</label><input id="rv-title" name="title" required placeholder="e.g. Great GPS for my commute" /></div>
        <div style={{ gridColumn: '1 / -1' }}><label htmlFor="rv-body">Your Review *</label><textarea id="rv-body" name="body" rows={3} required placeholder="What did you like? Anything buyers should know?" /></div>
      </div>
      {state.message ? <div className="notice">{state.message}</div> : null}
      <div><button type="submit" className="btn btn-ghost" disabled={pending}>{pending ? 'Submitting…' : 'Submit Review'}</button></div>
    </form>
  )
}

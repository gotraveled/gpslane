'use client'

import { useActionState } from 'react'
import { submitContactMessage, type ContactState } from '../contact/actions'

const initial: ContactState = { ok: false, message: '' }

export default function ReturnRequestForm() {
  const [state, formAction, pending] = useActionState(async (_prev: ContactState, fd: FormData) => {
    const orderNo = String(fd.get('orderNumber') ?? '').trim()
    const reason = String(fd.get('reason') ?? '').trim()
    const msg = `RETURN REQUEST\nOrder #: ${orderNo || 'N/A'}\nReason: ${reason}\n\n${String(fd.get('details') ?? '').trim()}`
    const data = new FormData()
    data.set('name', String(fd.get('name') ?? ''))
    data.set('email', String(fd.get('email') ?? ''))
    data.set('subject', `Return request — ${orderNo || 'no order number'}`)
    data.set('message', msg)
    return submitContactMessage(initial, data)
  }, initial)

  if (state.ok) {
    return <div className="notice"><strong>Return request received.</strong> Our team will review and reply within 1–2 business days with next steps.</div>
  }

  return (
    <form action={formAction} className="form-grid">
      <div className="grid grid-2" style={{ gap: '1rem' }}>
        <div><label htmlFor="rr-name">Full Name *</label><input id="rr-name" name="name" required /></div>
        <div><label htmlFor="rr-email">Email *</label><input id="rr-email" name="email" type="email" required /></div>
        <div><label htmlFor="rr-order">Order Number (e.g. GPS-XXXXXX)</label><input id="rr-order" name="orderNumber" /></div>
        <div>
          <label htmlFor="rr-reason">Reason *</label>
          <select id="rr-reason" name="reason" required defaultValue="">
            <option value="" disabled>Select a reason…</option>
            <option value="Wrong item received">Wrong item received</option>
            <option value="Defective or damaged on arrival">Defective or damaged on arrival</option>
            <option value="Does not match description">Does not match description</option>
            <option value="Delivery never arrived">Delivery never arrived</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1' }}><label htmlFor="rr-details">Details / Issue Description *</label><textarea id="rr-details" name="details" rows={3} required /></div>
      </div>
      {state.message ? <div className="notice">{state.message}</div> : null}
      <div><button type="submit" className="btn btn-primary" disabled={pending}>{pending ? 'Submitting…' : 'Submit Return Request'}</button></div>
    </form>
  )
}

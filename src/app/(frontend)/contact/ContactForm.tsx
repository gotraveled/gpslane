'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { submitContactMessage, type ContactState } from './actions'

const initial: ContactState = { ok: false, message: '' }

export default function ContactForm() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(submitContactMessage, initial)
  useEffect(() => { if (state.ok) router.push('/thank-you?form=contact') }, [state.ok, router])
  return (
    <form action={formAction} className="form-grid">
      <div className="grid grid-2" style={{ gap: '1rem' }}>
        <div><label htmlFor="cf-name">Name</label><input id="cf-name" name="name" /></div>
        <div><label htmlFor="cf-last">Last name</label><input id="cf-last" name="lastname" /></div>
      </div>
      <div><label htmlFor="cf-email">Your Email *</label><input id="cf-email" name="email" type="email" required /></div>
      <div><label htmlFor="cf-subject">Subject</label><input id="cf-subject" name="subject" placeholder="e.g. Order question, map update help" /></div>
      <div><label htmlFor="cf-msg">Message *</label><textarea id="cf-msg" name="message" rows={5} required /></div>
      {state.message ? <div className="notice">{state.message}</div> : null}
      <div><button type="submit" className="btn btn-primary" disabled={pending}>{pending ? 'Sending…' : 'Submit'}</button></div>
    </form>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AccountAuth({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setError('')
    try {
      const url = mode === 'login' ? '/api/customers/login' : '/api/customers'
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'login' ? { email: form.email, password: form.password } : { email: form.email, password: form.password, name: form.name }),
      })
      if (!res.ok) {
        const data: any = await res.json().catch(() => ({}))
        setError(data?.errors?.[0]?.message ?? data?.message ?? 'Something went wrong. Please try again.')
        return
      }
      router.push('/account')
      router.refresh()
    } catch {
      setError('Network error — please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="form-grid card" style={{ padding: '1.5rem', maxWidth: 720, margin: '0 auto' }}>
      {mode === 'register' ? (
        <div><label htmlFor={`acc-name-${mode}`}>Full Name</label><input id={`acc-name-${mode}`} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
      ) : null}
      <div><label htmlFor={`acc-email-${mode}`}>Email *</label><input id={`acc-email-${mode}`} type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} /></div>
      <div><label htmlFor={`acc-pass-${mode}`}>Password *{mode === 'register' ? ' (min 8 characters)' : ''}</label><input id={`acc-pass-${mode}`} type="password" required minLength={mode === 'register' ? 8 : 1} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></div>
      {error ? <div className="notice">{error}</div> : null}
      <div><button type="submit" className="btn btn-primary" disabled={pending}>{pending ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}</button></div>
    </form>
  )
}

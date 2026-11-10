'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCart } from '../../../components/CartProvider'
import { cartTotal } from '../../../lib/cart'
import { placeOrder, type PlaceOrderState } from './actions'

export default function CheckoutPage() {
  const { items, refresh } = useCart()
  const router = useRouter()
  const [state, setState] = useState<PlaceOrderState>({ ok: false, message: '' })
  const [pending, setPending] = useState(false)
  const [createAccount, setCreateAccount] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', password: '' })

  const total = cartTotal(items)

  useEffect(() => {
    if (items.length === 0 && !state.ok) router.replace('/cart')
  }, [items.length, state.ok, router])

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    const res = await placeOrder({
      items: items.map((i) => ({ productSlug: i.productSlug, variantId: i.variantId, qty: i.qty })),
      customer: {
        fullName: form.fullName, email: form.email, phone: form.phone,
        addressLine1: form.addressLine1, addressLine2: form.addressLine2,
        city: form.city, state: form.state, postalCode: form.postalCode,
      },
      createAccount: createAccount ? { password: form.password } : undefined,
    })
    setPending(false)
    if (res.ok && res.redirect) {
      setState(res)
      window.location.href = res.redirect
    } else {
      setState(res)
      refresh()
    }
  }

  if (items.length === 0 && !state.ok) return null

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      <div className="page-head" style={{ textAlign: 'left' }}>
        <h1>Secure Checkout</h1>
        <p className="lede">Complete your order — payment is handled securely by PayPal.</p>
      </div>

      <div className="checkout-steps">
        <div className="checkout-step active">1 · Shipping</div>
        <div className="checkout-step">2 · Payment (PayPal)</div>
        <div className="checkout-step">3 · Confirmation</div>
      </div>

      <form onSubmit={onSubmit}>
        <div className="grid grid-2" style={{ alignItems: 'start', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginTop: 0 }}>Contact Information</h3>
              <div className="grid grid-2" style={{ gap: '1rem' }}>
                <div><label htmlFor="co-name">Full Name *</label><input id="co-name" value={form.fullName} onChange={set('fullName')} required /></div>
                <div><label htmlFor="co-email">Email *</label><input id="co-email" type="email" value={form.email} onChange={set('email')} required /></div>
                <div><label htmlFor="co-phone">Phone *</label><input id="co-phone" type="tel" value={form.phone} onChange={set('phone')} required /></div>
              </div>
              <label style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginTop: '1rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={createAccount} onChange={(e) => setCreateAccount(e.target.checked)} />
                <span>Create an account to track orders and check out faster next time</span>
              </label>
              {createAccount ? (
                <div style={{ marginTop: '0.75rem' }}>
                  <label htmlFor="co-pass">Password (min 8 characters) *</label>
                  <input id="co-pass" type="password" minLength={8} value={form.password} onChange={set('password')} required={createAccount} autoComplete="new-password" />
                </div>
              ) : null}
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginTop: 0 }}>Shipping Address</h3>
              <div className="grid grid-2" style={{ gap: '1rem' }}>
                <div style={{ gridColumn: '1 / -1' }}><label htmlFor="co-addr">Street Address *</label><input id="co-addr" value={form.addressLine1} onChange={set('addressLine1')} required /></div>
                <div style={{ gridColumn: '1 / -1' }}><label htmlFor="co-addr2">Apt / Suite</label><input id="co-addr2" value={form.addressLine2} onChange={set('addressLine2')} /></div>
                <div><label htmlFor="co-city">City *</label><input id="co-city" value={form.city} onChange={set('city')} required /></div>
                <div><label htmlFor="co-state">State / Province</label><input id="co-state" value={form.state} onChange={set('state')} /></div>
                <div><label htmlFor="co-zip">ZIP / Postal Code *</label><input id="co-zip" value={form.postalCode} onChange={set('postalCode')} required /></div>
              </div>
              <p className="muted" style={{ fontSize: '0.82rem', marginTop: '0.75rem' }}>We ship to the USA and Canada. Tracking is included on every order.</p>
            </div>

            {state.message ? <div className="notice">{state.message}</div> : null}
          </div>

          <aside className="checkout-summary" style={{ position: 'sticky', top: '5rem' }}>
            <h3 style={{ marginTop: 0 }}>Order Summary</h3>
            {items.map((i) => (
              <div className="row" key={i.variantId} style={{ alignItems: 'flex-start' }}>
                <span style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  {i.imageUrl ? <img src={i.imageUrl} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8 }} /> : null}
                  <span>{i.productName}{i.variantName ? ` — ${i.variantName}` : ''}<br /><small className="muted">Qty {i.qty}</small></span>
                </span>
                <span>${((i.priceUsd + i.shippingUsd) * i.qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="row total"><span>Total</span><span>${total.toFixed(2)} USD</span></div>
            <button type="submit" className="btn btn-primary" disabled={pending} style={{ width: '100%', padding: '0.85rem', marginTop: '1rem' }}>
              {pending ? 'Processing…' : `Continue to PayPal — $${total.toFixed(2)}`}
            </button>
            <div className="trust-row" style={{ marginTop: '1rem' }}>
              <span>SSL Encrypted</span>
              <span>PayPal Buyer Protection</span>
              <span>7-Day Returns</span>
              <span>Tracking Included</span>
            </div>
            <p className="muted" style={{ fontSize: '0.8rem', margin: '0.75rem 0 0' }}>
              Already have an account? <Link href="/account">Sign in</Link> for faster checkout.
            </p>
          </aside>
        </div>
      </form>
    </div>
  )
}

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useCart } from '../../../components/CartProvider'
import { cartTotal } from '../../../lib/cart'
import { captureOrder, paypalClientId, placeOrder, type PlaceOrderState } from './actions'

export default function CheckoutPage() {
  const { items, clear } = useCart()
  const router = useRouter()
  const [state, setState] = useState<PlaceOrderState>({ ok: false, message: '' })
  const [paid, setPaid] = useState<string | null>(null)
  const [createAccount, setCreateAccount] = useState(false)
  const [country, setCountry] = useState<'US' | 'CA'>('US')
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', password: '' })
  const ppDiv = useRef<HTMLDivElement>(null)
  const dbOrderId = useRef<number | null>(null)
  const latest = useRef({ items, form, country, createAccount })
  useEffect(() => {
    latest.current = { items, form, country, createAccount }
  })

  const total = cartTotal(items, country)
  const curLabel = country === 'CA' ? 'CAD' : 'USD'

  useEffect(() => {
    if (items.length === 0 && !paid) router.replace('/cart')
  }, [items.length, paid, router])

  // Load PayPal SDK + render inline buttons (currency-aware)
  useEffect(() => {
    if (paid) return
    let cancelled = false
    const render = async () => {
      const clientId = await paypalClientId()
      const cur = latest.current.country === 'CA' ? 'CAD' : 'USD'
      await new Promise<void>((resolve) => {
        delete (window as any).paypal
        document.querySelectorAll('script[data-pp-sdk]').forEach((s) => s.remove())
        const s = document.createElement('script')
        s.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${cur}&components=buttons`
        s.dataset.ppSdk = '1'
        s.onload = () => resolve()
        s.onerror = () => resolve()
        document.body.appendChild(s)
      })
      if (cancelled || !ppDiv.current) return
      const w = window as any
      if (!w.paypal?.Buttons) return
      ppDiv.current.innerHTML = ''
      w.paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'pill', height: 45 },
        createOrder: async () => {
          const { items: its, form: f, country: c, createAccount: ca } = latest.current
          const res = await placeOrder({
            items: its.map((i) => ({ productSlug: i.productSlug, variantId: i.variantId, qty: i.qty })),
            country: c,
            customer: {
              fullName: f.fullName, email: f.email, phone: f.phone,
              addressLine1: f.addressLine1, addressLine2: f.addressLine2,
              city: f.city, state: f.state, postalCode: f.postalCode,
            },
            createAccount: ca ? { password: f.password } : undefined,
          })
          if (!res.ok || !res.paypalOrderId) { setState(res); throw new Error(res.message || 'order failed') }
          dbOrderId.current = res.orderId ?? null
          return res.paypalOrderId
        },
        onApprove: async () => {
          if (!dbOrderId.current) return
          const r = await captureOrder({ orderId: dbOrderId.current })
          if (r.ok && r.orderNumber) { clear(); setPaid(r.orderNumber) }
          else setState({ ok: false, message: r.message })
        },
        onError: () => {},
      }).render(ppDiv.current)
    }
    render()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, paid])

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))

  if (paid) {
    return (
      <div className="container" style={{ padding: '2.5rem 1.25rem', textAlign: 'center' }}>
        <h1>✅ Order Confirmed</h1>
        <p className="lede">Thank you — your payment was successful.</p>
        <div className="notice">
          <strong>Order number:</strong> {paid}<br />
          A confirmation email is on its way. We ship within 2–5 business days with tracking.
        </div>
        <p><Link href="/shop" className="btn btn-primary">Continue Shopping</Link></p>
      </div>
    )
  }

  if (items.length === 0) return null

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

      <div>
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
                <div>
                  <label htmlFor="co-country">Country *</label>
                  <select id="co-country" value={country} onChange={(e) => setCountry(e.target.value as 'US' | 'CA')}>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                  </select>
                </div>
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
                  {i.imageUrl ? <Image src={i.imageUrl} alt="" width={44} height={44} style={{ objectFit: 'cover', borderRadius: 8 }} /> : null}
                  <span>{i.productName}{i.variantName ? ` — ${i.variantName}` : ''}<br /><small className="muted">Qty {i.qty}</small></span>
                </span>
                <span>${(((country === 'CA' ? i.priceCad ?? i.priceUsd : i.priceUsd)) * i.qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="row"><span>Shipping</span><span style={{ color: 'var(--primary)', fontWeight: 700 }}>FREE</span></div>
            <div className="row total"><span>Total</span><span>${total.toFixed(2)} {curLabel}</span></div>
            <div ref={ppDiv} style={{ marginTop: '1rem' }} />
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
      </div>
    </div>
  )
}

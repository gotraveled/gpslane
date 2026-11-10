'use client'

import { useActionState, useEffect } from 'react'
import { startCheckout, type CheckoutState } from '../../checkout/actions'

const initial: CheckoutState = { ok: false, message: '' }

type Props = {
  productSlug: string
  productName: string
  variantId: number
  variantName?: string
  priceUsd: number | null
  shippingUsd: number
}

export default function BuyNowForm({ productSlug, productName, variantId, variantName, priceUsd, shippingUsd }: Props) {
  const [state, formAction, pending] = useActionState(startCheckout, initial)

  useEffect(() => {
    if (state.redirect) window.location.href = state.redirect
  }, [state.redirect])

  const total = priceUsd != null ? priceUsd + shippingUsd : null

  return (
    <div className="grid grid-2" style={{ gap: '1.5rem', alignItems: 'start' }}>
      <form action={formAction} className="form-grid">
        <input type="hidden" name="productSlug" value={productSlug} />
        <input type="hidden" name="variantId" value={variantId} />
        <input type="hidden" name="country" value="us" />

        <div className="grid grid-2" style={{ gap: '1rem' }}>
          <div><label htmlFor="bn-name">Full Name *</label><input id="bn-name" name="fullName" required /></div>
          <div><label htmlFor="bn-phone">Phone *</label><input id="bn-phone" name="phone" type="tel" required /></div>
          <div style={{ gridColumn: '1 / -1' }}><label htmlFor="bn-email">Email *</label><input id="bn-email" name="email" type="email" required /></div>
          <div style={{ gridColumn: '1 / -1' }}><label htmlFor="bn-addr">Street Address *</label><input id="bn-addr" name="addressLine1" required /></div>
          <div><label htmlFor="bn-addr2">Apt / Suite</label><input id="bn-addr2" name="addressLine2" /></div>
          <div><label htmlFor="bn-city">City *</label><input id="bn-city" name="city" required /></div>
          <div><label htmlFor="bn-state">State</label><input id="bn-state" name="state" /></div>
          <div><label htmlFor="bn-zip">ZIP / Postal Code *</label><input id="bn-zip" name="postalCode" required /></div>
        </div>

        {state.message ? <div className="notice">{state.message}</div> : null}
        <div>
          <button type="submit" className="btn btn-primary" disabled={pending || !priceUsd} style={{ width: '100%', padding: '0.8rem' }}>
            {pending ? 'Redirecting to PayPal…' : `Pay $${total != null ? total.toFixed(2) : '—'} with PayPal`}
          </button>
          <p className="muted" style={{ fontSize: '0.82rem', margin: '0.5rem 0 0', textAlign: 'center' }}>
            🔒 Secure checkout via PayPal — card details never touch our servers.
          </p>
        </div>
      </form>

      <aside className="checkout-summary">
        <h3 style={{ marginTop: 0 }}>Order Summary</h3>
        <div className="row"><span>Item</span><span style={{ textAlign: 'right', maxWidth: '60%' }}>{productName}{variantName ? ` — ${variantName}` : ''}</span></div>
        <div className="row"><span>Qty</span><span>1</span></div>
        <div className="row"><span>Item price</span><span>${priceUsd != null ? priceUsd.toFixed(2) : '—'}</span></div>
        <div className="row"><span>Shipping (USA)</span><span>{shippingUsd === 0 ? 'Free' : `$${shippingUsd.toFixed(2)}`}</span></div>
        <div className="row total"><span>Total</span><span>${total != null ? total.toFixed(2) : '—'} USD</span></div>
        <div className="trust-row" style={{ marginTop: '1rem' }}>
          <span>SSL Encrypted</span>
          <span>Ships USA &amp; Canada</span>
          <span>7-Day Returns</span>
          <span>Tracking Included</span>
        </div>
        <p className="muted" style={{ fontSize: '0.8rem', margin: '1rem 0 0' }}>
          Questions before ordering? Call <a href="tel:+18449667866" className="tel-link">+1 (844) 966-7866</a> or email info@gpslane.com.
        </p>
      </aside>
    </div>
  )
}

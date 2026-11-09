'use client'

import { useActionState, useEffect } from 'react'
import { startCheckout, type CheckoutState } from '../../checkout/actions'

const initial: CheckoutState = { ok: false, message: '' }

type Props = { productSlug: string; variantId: number; variantName?: string; priceUsd: number | null; shippingUsd: number }

export default function BuyNowForm({ productSlug, variantId, variantName, priceUsd, shippingUsd }: Props) {
  const [state, formAction, pending] = useActionState(startCheckout, initial)

  useEffect(() => {
    if (state.redirect) window.location.href = state.redirect
  }, [state.redirect])

  const total = priceUsd != null ? (priceUsd + shippingUsd).toFixed(2) : null

  return (
    <form action={formAction} className="form-grid">
      <input type="hidden" name="productSlug" value={productSlug} />
      <input type="hidden" name="variantId" value={variantId} />
      <input type="hidden" name="country" value="us" />

      <div className="grid grid-2" style={{ gap: '1rem' }}>
        <div><label htmlFor="bn-name">Full Name *</label><input id="bn-name" name="fullName" required /></div>
        <div><label htmlFor="bn-phone">Phone *</label><input id="bn-phone" name="phone" type="tel" required /></div>
        <div><label htmlFor="bn-email">Email *</label><input id="bn-email" name="email" type="email" required /></div>
        <div><label htmlFor="bn-addr">Street Address *</label><input id="bn-addr" name="addressLine1" required /></div>
        <div><label htmlFor="bn-addr2">Apt / Suite</label><input id="bn-addr2" name="addressLine2" /></div>
        <div><label htmlFor="bn-city">City *</label><input id="bn-city" name="city" required /></div>
        <div><label htmlFor="bn-state">State</label><input id="bn-state" name="state" /></div>
        <div><label htmlFor="bn-zip">ZIP / Postal Code *</label><input id="bn-zip" name="postalCode" required /></div>
      </div>

      {total ? (
        <div className="notice" style={{ margin: 0 }}>
          Total due today: <strong>${total} USD</strong>
          {variantName ? ` · ${variantName}` : ''} · includes ${shippingUsd === 0 ? 'free' : `$${shippingUsd.toFixed(2)}`} shipping
        </div>
      ) : null}
      {state.message ? <div className="notice">{state.message}</div> : null}
      <div>
        <button type="submit" className="btn btn-primary" disabled={pending || !priceUsd}>
          {pending ? 'Redirecting to PayPal…' : 'Buy Now — PayPal'}
        </button>
        <p className="muted" style={{ fontSize: '0.82rem', margin: '0.5rem 0 0' }}>
          🔒 Secure checkout via PayPal. You&apos;ll be redirected to PayPal to complete payment.
        </p>
      </div>
    </form>
  )
}

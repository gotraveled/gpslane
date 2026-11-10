'use client'

import Link from 'next/link'
import { useCart } from '../../../components/CartProvider'
import { cartTotal } from '../../../lib/cart'

export default function CartPage() {
  const { items, setQuantity, remove, clear } = useCart()
  const total = cartTotal(items)

  if (items.length === 0) {
    return (
      <div className="container prose" style={{ padding: '3rem 1.25rem', textAlign: 'center' }}>
        <h1>Your Cart is Empty</h1>
        <p className="muted">Browse our GPS devices and accessories — shipped to the USA and Canada.</p>
        <Link href="/shop" className="btn btn-primary">Shop GPS Devices</Link>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      <div className="page-head" style={{ textAlign: 'left' }}>
        <h1>Shopping Cart</h1>
        <p className="lede">{items.length} item{items.length === 1 ? '' : 's'} in your cart</p>
      </div>
      <div className="grid grid-2" style={{ alignItems: 'start', gridTemplateColumns: '2fr 1fr' }}>
        <div className="card" style={{ padding: '0.5rem 1.25rem' }}>
          <table className="cart-table">
            <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th></th></tr></thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.variantId}>
                  <td>
                    <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'center' }}>
                      {i.imageUrl ? <img src={i.imageUrl} alt={i.productName} className="cart-thumb" /> : <div className="cart-thumb" />}
                      <div>
                        <Link href={`/product/${i.productSlug}`} style={{ fontWeight: 600 }}>{i.productName}</Link>
                        {i.variantName ? <div className="muted" style={{ fontSize: '0.85rem' }}>{i.variantName}</div> : null}
                      </div>
                    </div>
                  </td>
                  <td>${(i.priceUsd * i.qty).toFixed(2)}</td>
                  <td><input className="qty-input" type="number" min={1} value={i.qty} onChange={(e) => setQuantity(i.variantId, Number(e.target.value))} /></td>
                  <td><button className="btn btn-ghost" style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }} onClick={() => remove(i.variantId)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ textAlign: 'right', marginTop: '0.75rem' }}><button className="btn btn-ghost" style={{ fontSize: '0.85rem' }} onClick={clear}>Clear cart</button></p>
        </div>
        <aside className="checkout-summary">
          <h3 style={{ marginTop: 0 }}>Order Summary</h3>
          <div className="row"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
          <div className="row"><span>Shipping</span><span>Calculated at checkout</span></div>
          <div className="row total"><span>Est. total</span><span>${total.toFixed(2)} USD</span></div>
          <Link href="/checkout" className="btn btn-primary" style={{ width: '100%', textAlign: 'center', marginTop: '1rem', display: 'block', padding: '0.8rem' }}>Proceed to Checkout</Link>
          <p className="muted" style={{ fontSize: '0.8rem', marginTop: '0.75rem' }}>🔒 Secure PayPal checkout · Ships USA &amp; Canada · 7-day returns</p>
        </aside>
      </div>
    </div>
  )
}

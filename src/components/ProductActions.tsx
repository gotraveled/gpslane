'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCart } from './CartProvider'
import type { CartItem } from '../lib/cart'

type Props = { item: Omit<CartItem, 'qty'> }

export default function ProductActions({ item }: Props) {
  const { add } = useCart()
  const router = useRouter()
  const [qty, setQty] = useState(1)
  const [toast, setToast] = useState(false)

  const addAndGo = () => {
    add(item, qty)
    setToast(true)
    setTimeout(() => router.push('/checkout'), 900)
  }

  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
      {toast ? <div className="cart-toast" role="status">✓ {item.productName} added to cart — taking you to checkout…</div> : null}
      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ padding: '0.6rem 0.8rem', border: 'none', background: 'var(--bg-soft)', cursor: 'pointer', fontSize: '1rem' }}>−</button>
        <span style={{ padding: '0.6rem 0.9rem', minWidth: 40, textAlign: 'center', fontWeight: 600 }}>{qty}</span>
        <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)} style={{ padding: '0.6rem 0.8rem', border: 'none', background: 'var(--bg-soft)', cursor: 'pointer', fontSize: '1rem' }}>+</button>
      </div>
      <button
        type="button"
        className="btn btn-ghost"
        style={{ padding: '0.7rem 1.4rem' }}
        onClick={addAndGo}
      >
        Add to Cart
      </button>
      <button
        type="button"
        className="btn btn-primary"
        style={{ padding: '0.7rem 1.6rem' }}
        onClick={addAndGo}
      >
        Buy Now
      </button>
    </div>
  )
}

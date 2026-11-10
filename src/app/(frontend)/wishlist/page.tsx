'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getWishlist, type WishlistItem } from '../../../lib/wishlist'

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])
  useEffect(() => {
    const sync = () => setItems(getWishlist())
    sync()
    window.addEventListener('gpslane-wishlist-change', sync)
    return () => window.removeEventListener('gpslane-wishlist-change', sync)
  }, [])

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      <div className="page-head">
        <h1>My Wishlist</h1>
        <p className="lede">Products you saved for later.</p>
      </div>
      {items.length === 0 ? (
        <div className="empty-state">
          <p>Your wishlist is empty.</p>
          <Link href="/shop" className="btn btn-primary">Browse GPS Devices</Link>
        </div>
      ) : (
        <div className="grid grid-4">
          {items.map((i) => (
            <div className="card" key={String(i.productId)}>
              <Link href={`/product/${i.slug}`} className="card-img" aria-label={i.name}>
                {i.imageUrl ? <img src={i.imageUrl} alt={i.name} loading="lazy" /> : <span>{i.name}</span>}
              </Link>
              <div className="card-body">
                <h3><Link href={`/product/${i.slug}`}>{i.name}</Link></h3>
                {i.priceUsd != null ? <span className="card-price">${i.priceUsd.toFixed(2)} USD</span> : null}
                <Link href={`/product/${i.slug}`} className="btn btn-primary" style={{ width: '100%', textAlign: 'center', marginTop: 'auto' }}>View &amp; Buy</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

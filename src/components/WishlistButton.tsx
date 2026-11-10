'use client'

import { useEffect, useState } from 'react'
import { isWishlisted, toggleWishlist, type WishlistItem } from '../lib/wishlist'

export default function WishlistButton({ item, className }: { item: WishlistItem; className?: string }) {
  const [active, setActive] = useState(false)
  useEffect(() => {
    const sync = () => setActive(isWishlisted(item.productId))
    sync()
    window.addEventListener('gpslane-wishlist-change', sync)
    return () => window.removeEventListener('gpslane-wishlist-change', sync)
  }, [item.productId])
  return (
    <button
      type="button"
      className={className ?? 'wish-btn'}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={active}
      onClick={(e) => { e.preventDefault(); setActive(toggleWishlist(item)) }}
    >
      {active ? '❤️' : '🤍'}
    </button>
  )
}

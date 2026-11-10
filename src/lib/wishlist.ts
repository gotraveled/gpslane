export type WishlistItem = {
  productId: number | string
  slug: string
  name: string
  imageUrl?: string | null
  priceUsd?: number | null
}

const KEY = 'gpslane-wishlist'

export function getWishlist(): WishlistItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as WishlistItem[]) : []
  } catch { return [] }
}

function save(items: WishlistItem[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('gpslane-wishlist-change'))
}

export function toggleWishlist(item: WishlistItem): boolean {
  const list = getWishlist()
  const exists = list.some((i) => i.productId === item.productId)
  if (exists) { save(list.filter((i) => i.productId !== item.productId)); return false }
  save([...list, item])
  return true
}

export function isWishlisted(productId: number | string): boolean {
  return getWishlist().some((i) => i.productId === productId)
}

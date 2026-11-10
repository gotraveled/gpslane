export type CartItem = {
  productId: number | string
  productSlug: string
  productName: string
  variantId: number
  variantName?: string
  priceUsd: number
  shippingUsd: number
  priceCad?: number | null
  shippingCad?: number | null
  qty: number
  imageUrl?: string | null
}

const KEY = 'gpslane-cart'

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    const items = raw ? (JSON.parse(raw) as CartItem[]) : []
    // Legacy carts stored shipping separately — fold it into price so display stays consistent
    const migrated = items.map((i) =>
      i.shippingUsd ? { ...i, priceUsd: i.priceUsd + i.shippingUsd, shippingUsd: 0, priceCad: i.priceCad != null && i.shippingCad != null ? i.priceCad + i.shippingCad : i.priceCad, shippingCad: null } : i,
    )
    if (migrated.some((m, idx) => m !== items[idx])) saveCart(migrated)
    return migrated
  } catch {
    return []
  }
}

export function saveCart(items: CartItem[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('gpslane-cart-change'))
}

export function addToCart(item: Omit<CartItem, 'qty'>, qty = 1) {
  const cart = getCart()
  const existing = cart.find((i) => i.variantId === item.variantId)
  if (existing) existing.qty += qty
  else cart.push({ ...item, qty })
  saveCart(cart)
  return cart
}

export function updateQty(variantId: number, qty: number) {
  const cart = getCart().map((i) => (i.variantId === variantId ? { ...i, qty: Math.max(0, qty) } : i)).filter((i) => i.qty > 0)
  saveCart(cart)
  return cart
}

export function removeFromCart(variantId: number) {
  saveCart(getCart().filter((i) => i.variantId !== variantId))
}

export function clearCart() {
  saveCart([])
}

export function cartCount(items: CartItem[]) {
  return items.reduce((n, i) => n + i.qty, 0)
}

export function cartTotal(items: CartItem[], country: 'US' | 'CA' = 'US') {
  if (country === 'CA') {
    return items.reduce((n, i) => n + ((i.priceCad ?? i.priceUsd) + (i.shippingCad ?? i.shippingUsd)) * i.qty, 0)
  }
  return items.reduce((n, i) => n + (i.priceUsd + i.shippingUsd) * i.qty, 0)
}

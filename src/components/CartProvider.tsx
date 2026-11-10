'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { addToCart as addItem, cartCount, clearCart as clear, getCart, removeFromCart as removeItem, updateQty as setQty, type CartItem } from '../lib/cart'

type CartCtx = {
  items: CartItem[]
  count: number
  hydrated: boolean
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  setQuantity: (variantId: number, qty: number) => void
  remove: (variantId: number) => void
  clear: () => void
  refresh: () => void
}

const Ctx = createContext<CartCtx>({ items: [], count: 0, hydrated: false, add: () => {}, setQuantity: () => {}, remove: () => {}, clear: () => {}, refresh: () => {} })

export function useCart() {
  return useContext(Ctx)
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  const refresh = useCallback(() => setItems(getCart()), [])

  useEffect(() => {
    const onChange = () => refresh()
    queueMicrotask(() => { refresh(); setHydrated(true) })
    window.addEventListener('gpslane-cart-change', onChange)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener('gpslane-cart-change', onChange)
      window.removeEventListener('storage', onChange)
    }
  }, [refresh])

  const value: CartCtx = {
    items,
    count: cartCount(items),
    hydrated,
    add: (item, qty = 1) => { addItem(item, qty); refresh() },
    setQuantity: (variantId, qty) => { setQty(variantId, qty); refresh() },
    remove: (variantId) => { removeItem(variantId); refresh() },
    clear: () => { clear(); refresh() },
    refresh,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

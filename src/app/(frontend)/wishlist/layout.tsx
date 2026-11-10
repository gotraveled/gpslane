import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Wishlist | GPS Lane', robots: { index: false } }

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

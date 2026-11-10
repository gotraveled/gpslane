import Link from 'next/link'

export const metadata = { title: 'Checkout Cancelled | GPSLane', robots: { index: false } }

export default function CheckoutCancelPage() {
  return (
    <div className="container prose" style={{ padding: '2.5rem 1.25rem' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <h1>Checkout Cancelled</h1>
        <p className="lede">No payment was taken. Your cart is still available whenever you&apos;re ready.</p>
        <p><Link href="/shop" className="btn btn-primary">Back to Shop</Link></p>
      </div>
    </div>
  )
}

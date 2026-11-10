import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayloadClient } from '../../../lib/storefront'
import AccountAuth from './AccountAuth'
import LogoutButton from './LogoutButton'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'My Account | GPS Lane', robots: { index: false } }

export default async function AccountPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (!token) {
    return (
      <div className="container" style={{ padding: '0.5rem 1.25rem 2.5rem' }}>
        <div className="page-head" style={{ textAlign: 'center' }}>
          <h1>My Account</h1>
          <p className="lede">Sign in to track orders, view order history and check out faster.</p>
        </div>
        <AccountAuth mode="login" />
        <div style={{ margin: '1.5rem auto 0' }}>
          <div className="page-head" style={{ textAlign: 'center' }}><h2 style={{ fontSize: '1.3rem' }}>Create Account</h2></div>
          <AccountAuth mode="register" />
        </div>
      </div>
    )
  }

  const payload = await getPayloadClient()
  const auth = await payload.auth({ headers: new Headers({ cookie: `payload-token=${token}` }) })
  const user: any = auth.user
  if (!user) redirect('/account')

  const orders = await payload.find({
    collection: 'orders',
    where: { customerEmail: { equals: user.email } },
    sort: '-createdAt',
    limit: 50,
    depth: 0,
  })

  return (
    <div className="container" style={{ padding: '0.5rem 1.25rem 2.5rem' }}>
      <div className="page-head" style={{ textAlign: 'left' }}>
        <h1>Hello, {user.name || user.email}</h1>
        <p className="lede">Your orders and account details.</p>
      </div>
      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginTop: 0 }}>Order History</h3>
          {orders.docs.length === 0 ? (
            <p className="muted">No orders yet. <Link href="/shop">Start shopping →</Link></p>
          ) : (
            <table className="cart-table">
              <thead><tr><th>Order</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {(orders.docs as any[]).map((o) => (
                  <tr key={o.id}>
                    <td><strong>{o.orderNumber}</strong></td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td>${(o.totalCents / 100).toFixed(2)}</td>
                    <td><span className="card-badge" style={{ position: 'static', background: o.status === 'paid' ? 'var(--primary)' : 'var(--muted)' }}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginTop: 0 }}>Account Details</h3>
          <p><strong>Email:</strong> {user.email}</p>
          {user.phone ? <p><strong>Phone:</strong> {user.phone}</p> : null}
          <p className="muted" style={{ fontSize: '0.9rem' }}>Orders are matched to this email address automatically at checkout.</p>
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}

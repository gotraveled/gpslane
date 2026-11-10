import { getPayloadClient } from '../../../lib/storefront'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Track Your Order | GPSLane',
  description: 'Check your GPSLane order status and tracking — enter your order number and email.',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Awaiting payment',
  paid: 'Paid — preparing for shipment',
  processing: 'Processing with our fulfillment partner',
  fulfilled: 'Fulfilled — shipped',
  shipped: 'Shipped',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

export default async function TrackOrderPage({ searchParams }: { searchParams: Promise<{ order?: string; email?: string }> }) {
  const { order: orderNumber, email } = await searchParams
  let order: any = null
  let searched = false
  let error = ''

  if (orderNumber && email) {
    searched = true
    try {
      const payload = await getPayloadClient()
      const found = await payload.find({
        collection: 'orders',
        where: {
          and: [
            { orderNumber: { equals: orderNumber.trim().toUpperCase() } },
            { customerEmail: { equals: email.trim().toLowerCase() } },
          ],
        },
        limit: 1,
        depth: 0,
      })
      order = found.docs[0] ?? null
      if (!order) error = 'No order found with that order number and email. Check your confirmation email or contact us.'
    } catch {
      error = 'We could not look up your order right now — please try again or contact support.'
    }
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      <div className="page-head">
        <h1>Track Your Order</h1>
        <p className="lede">Enter the order number from your confirmation email and the email you used at checkout.</p>
      </div>

      <div className="card" style={{ padding: '1.6rem', marginBottom: '1.5rem' }}>
        <form method="get" className="track-form">
          <div>
            <label htmlFor="to-order">Order Number *</label>
            <input id="to-order" name="order" placeholder="GPS-XXXXXXXX" defaultValue={orderNumber ?? ''} required />
          </div>
          <div>
            <label htmlFor="to-email">Email Address *</label>
            <input id="to-email" name="email" type="email" placeholder="you@example.com" defaultValue={email ?? ''} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.7rem 1.4rem' }}>Track Order</button>
        </form>
      </div>

      {error ? <div className="notice">{error}</div> : null}

      {order ? (
        <div className="card" style={{ padding: '1.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2 style={{ margin: 0 }}>Order {order.orderNumber}</h2>
            <span className="card-badge" style={{ position: 'static', background: ['paid', 'processing', 'fulfilled', 'shipped'].includes(order.status) ? 'var(--primary)' : 'var(--muted)' }}>
              {STATUS_LABELS[order.status] ?? order.status}
            </span>
          </div>
          <p className="muted" style={{ marginTop: '0.5rem' }}>
            Placed {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · ${(order.totalCents / 100).toFixed(2)} {String(order.currency).toUpperCase()}
          </p>

          <table className="cart-table" style={{ marginTop: '1rem' }}>
            <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
            <tbody>
              {(order.items ?? []).map((i: any, idx: number) => (
                <tr key={idx}><td>{i.name}</td><td>{i.quantity}</td><td>${((i.unitPriceCents * i.quantity) / 100).toFixed(2)}</td></tr>
              ))}
            </tbody>
          </table>

          {order.trackingNumber ? (
            <div className="notice" style={{ marginTop: '1.25rem' }}>
              <strong>📦 Tracking:</strong> {order.trackingNumber}
              {order.carrier ? <> via <strong>{order.carrier}</strong></> : null}
              {order.shippedAt ? <> · shipped {new Date(order.shippedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</> : null}
            </div>
          ) : (
            <p className="muted" style={{ marginTop: '1.25rem', fontSize: '0.9rem' }}>
              No tracking number yet — we ship within 2–5 business days and email you tracking details as soon as your order is on the way.
            </p>
          )}

          <p className="muted" style={{ marginTop: '1.25rem', fontSize: '0.9rem' }}>
            Questions about this order? Call <a href="tel:+18449667866" className="tel-link">+1 (844) 966-7866</a> or email <a href="mailto:info@gpslane.com">info@gpslane.com</a>.
          </p>
        </div>
      ) : null}

      {searched && !order && !error ? <div className="notice">No order found — check your order number and email and try again.</div> : null}
    </div>
  )
}

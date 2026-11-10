import React from 'react'
import { getPayload } from 'payload'

import config from '../../payload.config'

export default async function DashboardStats() {
  let stats = { ordersToday: 0, pending: 0, paid: 0, fulfilled: 0, messages: 0, reviewsPending: 0 }
  try {
    const payload = await getPayload({ config })
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const [todayRes, pendingRes, paidRes, fulfilledRes, msgRes, revRes] = await Promise.all([
      payload.find({ collection: 'orders', where: { createdAt: { greater_than: today.toISOString() } }, limit: 0, depth: 0, overrideAccess: true }),
      payload.find({ collection: 'orders', where: { status: { equals: 'pending' } }, limit: 0, depth: 0, overrideAccess: true }),
      payload.find({ collection: 'orders', where: { status: { equals: 'paid' } }, limit: 0, depth: 0, overrideAccess: true }),
      payload.find({ collection: 'orders', where: { status: { equals: 'fulfilled' } }, limit: 0, depth: 0, overrideAccess: true }),
      payload.find({ collection: 'contact-messages', where: { status: { equals: 'new' } }, limit: 0, depth: 0, overrideAccess: true }),
      payload.find({ collection: 'reviews', where: { status: { equals: 'pending' } }, limit: 0, depth: 0, overrideAccess: true }),
    ])
    stats = {
      ordersToday: todayRes.totalDocs, pending: pendingRes.totalDocs,
      paid: paidRes.totalDocs, fulfilled: fulfilledRes.totalDocs,
      messages: msgRes.totalDocs, reviewsPending: revRes.totalDocs,
    }
  } catch { /* dashboard widget — never block admin */ }

  const cards: [string, number, string][] = [
    ['Orders today', stats.ordersToday, '/admin/collections/orders'],
    ['Awaiting payment', stats.pending, '/admin/collections/orders'],
    ['Paid — needs fulfillment', stats.paid, '/admin/collections/orders'],
    ['Fulfilled', stats.fulfilled, '/admin/collections/orders'],
    ['New contact messages', stats.messages, '/admin/collections/contact-messages'],
    ['Reviews to approve', stats.reviewsPending, '/admin/collections/reviews'],
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', margin: '0 0 24px' }}>
      {cards.map(([label, value, href]) => (
        <a key={label} href={href} style={{ display: 'block', padding: '14px 16px', borderRadius: 10, border: '1px solid var(--theme-elevation-150)', background: 'var(--theme-elevation-50)', textDecoration: 'none', color: 'var(--theme-text)' }}>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: value > 0 && label !== 'Fulfilled' && label !== 'Orders today' ? '#c2410c' : '#227000' }}>{value}</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.75 }}>{label}</div>
        </a>
      ))}
    </div>
  )
}

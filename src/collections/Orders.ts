import type { CollectionConfig } from 'payload'

import { staffOnlyAccess } from '../lib/access'

/**
 * Customer orders placed through PayPal checkout.
 * Staff-only: contains customer PII and payment references.
 */
export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerEmail', 'totalCents', 'status', 'createdAt'],
  },
  access: staffOnlyAccess,
  fields: [
    { name: 'orderNumber', type: 'text', required: true, unique: true, index: true },
    { name: 'customerName', type: 'text', required: true },
    { name: 'customerEmail', type: 'email', required: true },
    { name: 'customerPhone', type: 'text' },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products' },
        { name: 'variant', type: 'relationship', relationTo: 'product-variants' },
        { name: 'name', type: 'text', required: true },
        { name: 'sku', type: 'text' },
        { name: 'quantity', type: 'number', required: true, defaultValue: 1, min: 1 },
        { name: 'unitPriceCents', type: 'number', required: true, min: 0 },
        { name: 'currency', type: 'select', required: true, options: [{ label: 'USD', value: 'usd' }, { label: 'CAD', value: 'cad' }], defaultValue: 'usd' },
      ],
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        { name: 'line1', type: 'text' }, { name: 'line2', type: 'text' },
        { name: 'city', type: 'text' }, { name: 'state', type: 'text' },
        { name: 'postalCode', type: 'text' }, { name: 'country', type: 'text' },
      ],
    },
    { name: 'subtotalCents', type: 'number', required: true, min: 0 },
    { name: 'shippingCents', type: 'number', required: true, defaultValue: 0, min: 0 },
    { name: 'totalCents', type: 'number', required: true, min: 0 },
    { name: 'currency', type: 'select', required: true, options: [{ label: 'USD', value: 'usd' }, { label: 'CAD', value: 'cad' }], defaultValue: 'usd' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending payment', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Processing (sent to supplier)', value: 'processing' },
        { label: 'Fulfilled', value: 'fulfilled' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Refunded', value: 'refunded' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'paypalOrderId', type: 'text', index: true },
    { name: 'paypalCaptureId', type: 'text' },
    { name: 'paidAt', type: 'date' },
    { name: 'trackingNumber', type: 'text', admin: { description: 'Carrier tracking number — email sent when saved' } },
    { name: 'carrier', type: 'text' },
    { name: 'shippedAt', type: 'date' },
    { name: 'reminderSent', type: 'checkbox', defaultValue: false, admin: { readOnly: true, description: 'Abandoned-cart reminder sent' } },
    { name: 'supplierOrderId', type: 'text', admin: { description: 'CJ/EPROLO order id once forwarded to supplier' } },
    { name: 'notes', type: 'textarea' },
  ],
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        try {
          if (doc.status === 'fulfilled' && previousDoc?.status !== 'fulfilled' && doc.customerEmail) {
            const tracking = doc.trackingNumber
              ? `Tracking: ${doc.trackingNumber}${doc.carrier ? ` via ${doc.carrier}` : ''}`
              : 'Tracking details will follow shortly.'
            await req.payload.sendEmail({
              to: doc.customerEmail,
              subject: `Your GPSLane order ${doc.orderNumber} has shipped`,
              text: `Hi ${doc.customerName},\n\nGreat news — your order ${doc.orderNumber} has shipped!\n\n${tracking}\n\nQuestions? Call +1 (844) 966-7866 or email info@gpslane.com.\n\n— GPSLane`,
            })
          }
        } catch { /* email optional */ }
        return doc
      },
    ],
  },
}

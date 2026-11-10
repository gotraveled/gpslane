import type { CollectionConfig } from 'payload'

import { staffOnlyAccess } from '../lib/access'

/**
 * Product reviews — admin-moderated. Customers submit via PDP form;
 * only 'approved' reviews render on the storefront.
 */
export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['product', 'rating', 'authorName', 'status', 'createdAt'],
  },
  access: staffOnlyAccess,
  fields: [
    { name: 'product', type: 'relationship', relationTo: 'products', required: true },
    { name: 'rating', type: 'number', required: true, min: 1, max: 5 },
    { name: 'title', type: 'text', required: true },
    { name: 'body', type: 'textarea', required: true },
    { name: 'authorName', type: 'text', required: true },
    { name: 'authorEmail', type: 'email' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending review', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}

import type { CollectionConfig } from 'payload'

/**
 * Customer accounts — separate from staff Users.
 * Auth-enabled so customers can sign in and view order history.
 */
export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'createdAt'],
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 30, // 30 days
    verify: false,
  },
  fields: [
    { name: 'name', type: 'text' },
    { name: 'phone', type: 'text' },
  ],
}

import type { CollectionConfig } from 'payload'

import { staffOnlyAccess } from '../lib/access'

export const Suppliers: CollectionConfig = {
  slug: 'suppliers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'code', 'providerType', 'status'],
  },
  access: staffOnlyAccess,
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'code',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'Unique-ish code: cjdropshipping, manual, aliexpress…' },
    },
    {
      name: 'providerType',
      type: 'select',
      required: true,
      options: [
        { label: 'CJdropshipping', value: 'cjdropshipping' },
        { label: 'Manual', value: 'manual' },
        { label: 'Mock (dev)', value: 'mock' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'disabled',
      options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Disabled', value: 'disabled' },
      ],
    },
    {
      name: 'config',
      type: 'json',
      admin: { description: 'Non-secret provider config only (endpoints, poll interval). Credentials live in env vars.' },
    },
  ],
}

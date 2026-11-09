import type { CollectionConfig } from 'payload'

import { publicReadStaffWrite } from '../lib/access'

/**
 * Configurable service catalog — e.g. map_update_assist.
 * Prices explicit per currency; no FX conversion.
 */
export const ServiceOfferings: CollectionConfig = {
  slug: 'service-offerings',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'code', 'active'],
  },
  access: publicReadStaffWrite,
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'Stable code e.g. map_update_assist' },
    },
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'prices',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'currency',
          type: 'select',
          required: true,
          options: [
            { label: 'USD', value: 'usd' },
            { label: 'CAD', value: 'cad' },
          ],
        },
        { name: 'priceCents', type: 'number', required: true, min: 0 },
      ],
    },
    {
      name: 'requiresCompatibilityCheck',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Must pass eligibility review before quoting' },
    },
    { name: 'active', type: 'checkbox', defaultValue: false },
  ],
}

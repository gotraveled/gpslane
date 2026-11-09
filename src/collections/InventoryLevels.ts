import type { CollectionConfig } from 'payload'

import { staffOnlyAccess } from '../lib/access'

export const InventoryLevels: CollectionConfig = {
  slug: 'inventory-levels',
  admin: {
    useAsTitle: 'location',
    defaultColumns: ['variant', 'location', 'onHand', 'reserved'],
  },
  access: staffOnlyAccess,
  fields: [
    {
      name: 'variant',
      type: 'relationship',
      relationTo: 'product-variants',
      required: true,
      index: true,
    },
    { name: 'location', type: 'text', required: true, defaultValue: 'default' },
    { name: 'onHand', type: 'number', required: true, defaultValue: 0, min: 0 },
    { name: 'reserved', type: 'number', required: true, defaultValue: 0, min: 0 },
    {
      name: 'policy',
      type: 'select',
      required: true,
      defaultValue: 'track',
      options: [
        { label: 'Track (hide when out)', value: 'track' },
        { label: 'Deny oversell', value: 'deny' },
        { label: 'Allow backorder', value: 'backorder' },
      ],
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'manual',
      options: [
        { label: 'Manual', value: 'manual' },
        { label: 'Supplier sync', value: 'supplier' },
      ],
    },
  ],
}

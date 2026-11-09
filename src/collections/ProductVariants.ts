import type { CollectionConfig } from 'payload'

import { publicReadStaffWrite } from '../lib/access'

export const ProductVariants: CollectionConfig = {
  slug: 'product-variants',
  admin: {
    useAsTitle: 'sku',
    defaultColumns: ['sku', 'product', 'status'],
  },
  access: publicReadStaffWrite,
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      index: true,
    },
    {
      name: 'sku',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'Internal SKU, e.g. GPS-AUTO-001' },
    },
    { name: 'name', type: 'text', defaultValue: 'Default' },
    {
      name: 'optionValues',
      type: 'json',
      admin: { description: 'Variant options e.g. {"color":"black"} — empty for single-variant products' },
    },
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
        { name: 'compareAtPriceCents', type: 'number', min: 0, admin: { description: 'Strikethrough price — only when a genuine former price exists' } },
        { name: 'effectiveFrom', type: 'date' },
        { name: 'effectiveTo', type: 'date' },
      ],
      admin: { description: 'Explicit price per currency — no FX conversion' },
    },
    { name: 'weightGrams', type: 'number', min: 0 },
    { name: 'requiresShipping', type: 'checkbox', defaultValue: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Discontinued', value: 'discontinued' },
      ],
    },
    {
      name: 'attributes',
      type: 'json',
      admin: { description: 'Structured spec table: {"screenSizeIn": 7, "ramGb": 1, …} — only substantiated specs' },
    },
    {
      name: 'compatibilityNotes',
      type: 'textarea',
      admin: { description: 'Only substantiated compatibility statements' },
    },
  ],
}

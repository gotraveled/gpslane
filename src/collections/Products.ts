import type { CollectionConfig } from 'payload'

import { seoFields } from '../fields/seo'
import { publicReadStaffWrite } from '../lib/access'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'status', 'sourcingStatus'],
  },
  access: publicReadStaffWrite,
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'New PDP URL: /product/{slug} — lowercase-hyphenated, generic accurate title' },
    },
    { name: 'shortDescription', type: 'textarea' },
    { name: 'description', type: 'richText', required: true },
    {
      name: 'productType',
      type: 'select',
      required: true,
      defaultValue: 'physical',
      options: [
        { label: 'Physical product', value: 'physical' },
        { label: 'Service (not checkout)', value: 'service' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
    {
      name: 'primaryCategory',
      type: 'relationship',
      relationTo: 'categories',
      admin: { description: 'Used for breadcrumbs' },
    },
    { name: 'images', type: 'upload', relationTo: 'media', hasMany: true },

    // ---- Sourcing & review workflow ----
    {
      name: 'sourcingStatus',
      type: 'select',
      defaultValue: 'not_started',
      options: [
        { label: 'Not started', value: 'not_started' },
        { label: 'Pending review', value: 'pending_review' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Published candidate', value: 'published_candidate' },
      ],
      admin: { position: 'sidebar', description: 'CJ sourcing pipeline state — see PRODUCT_SELECTION_SCORECARD.md' },
    },
    {
      name: 'scorecard',
      type: 'json',
      admin: { readOnly: true, description: 'Computed scorecard snapshot (admin-only fields)' },
      access: { read: ({ req }) => Boolean(req.user) },
    },
    {
      name: 'cjProductId',
      type: 'text',
      index: true,
      admin: { description: 'CJdropshipping product ID (pid) once verified' },
    },
    { name: 'cjProductUrl', type: 'text' },
    {
      name: 'eproloProductId',
      type: 'text',
      index: true,
      admin: { description: 'EPROLO store product ID once verified' },
    },
    { name: 'eproloPlatformId', type: 'text', admin: { description: 'EPROLO platform catalog product ID' } },

    // ---- Own-brand metadata ----
    {
      name: 'brandingTier',
      type: 'select',
      defaultValue: 'generic',
      options: [
        { label: 'Generic unbranded', value: 'generic' },
        { label: 'GPSLane-branded packaging', value: 'gpslane_packaging' },
        { label: 'GPSLane-branded product', value: 'gpslane_product' },
      ],
      admin: { description: 'Only advertise branding after supplier confirmation' },
    },
    {
      name: 'brandingEvidence',
      type: 'textarea',
      admin: { description: 'Supplier confirmation reference + date' },
    },

    // ---- Migration ----
    {
      name: 'legacySlug',
      type: 'text',
      index: true,
      admin: { description: 'Old gpslane.com slug if this product replaces a legacy URL (for 301 mapping)' },
    },

    ...seoFields,
  ],
}

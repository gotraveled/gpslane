import type { CollectionConfig } from 'payload'

import { seoFields } from '../fields/seo'
import { staffWrite } from '../lib/access'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'status', 'sourcingStatus'],
  },
  access: {
    // Public sees published products only; drafts/pending stay private even via REST API.
    read: ({ req }) => (req.user ? true : { status: { equals: 'published' } }),
    create: staffWrite,
    update: staffWrite,
    delete: staffWrite,
  },
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

    // ---- Phase 9: GPS verification & launch readiness (staff-only) ----
    {
      name: 'launchVerification',
      type: 'group',
      admin: { description: 'Phase 9 product verification — staff only' },
      access: { read: ({ req }) => Boolean(req.user) },
      fields: [
        {
          name: 'gpsClassification',
          type: 'select',
          options: [
            { label: 'Standalone GPS navigator', value: 'standalone_gps_navigator' },
            { label: 'GPS cycling computer', value: 'gps_cycling_computer' },
            { label: 'Navigation display', value: 'navigation_display' },
            { label: 'GPS accessory', value: 'gps_accessory' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'gpsFunctionality',
          type: 'select',
          options: [
            { label: 'Verified', value: 'verified' },
            { label: 'Unverified', value: 'unverified' },
            { label: 'No GPS function', value: 'no' },
          ],
          admin: { description: 'Never mark verified from title/marketing alone' },
        },
        { name: 'gpsReceiverEvidence', type: 'textarea' },
        { name: 'navSoftwareOs', type: 'text', admin: { description: 'Navigation app + operating system' } },
        { name: 'mapRegions', type: 'text' },
        { name: 'mapVersion', type: 'text' },
        {
          name: 'offlineMaps',
          type: 'select',
          options: [
            { label: 'Verified offline', value: 'verified' },
            { label: 'Unverified', value: 'unverified' },
            { label: 'No', value: 'no' },
          ],
        },
        { name: 'manufacturerModel', type: 'text' },
        {
          name: 'fccISEDStatus',
          type: 'select',
          options: [
            { label: 'Not applicable', value: 'not_applicable' },
            { label: 'Pending evidence', value: 'pending_evidence' },
            { label: 'Verified', value: 'verified' },
            { label: 'Blocked', value: 'blocked' },
          ],
        },
        {
          name: 'evidenceLinks',
          type: 'array',
          fields: [
            { name: 'url', type: 'text' },
            { name: 'label', type: 'text' },
            { name: 'checkedAt', type: 'date' },
          ],
        },
        { name: 'lastVerifiedAt', type: 'date' },
        {
          name: 'launchReadiness',
          type: 'select',
          options: [
            { label: 'Approved for review', value: 'approved_for_review' },
            { label: 'Pending supplier evidence', value: 'pending_supplier_evidence' },
            { label: 'Pending product verification', value: 'pending_product_verification' },
            { label: 'Blocked shipping', value: 'blocked_shipping' },
            { label: 'Blocked compliance', value: 'blocked_compliance' },
            { label: 'Rejected', value: 'rejected' },
          ],
          admin: { description: 'Review status only — not permission to publish' },
        },
        { name: 'launchNotes', type: 'textarea' },
      ],
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

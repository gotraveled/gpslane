import type { CollectionConfig } from 'payload'

import { seoFields } from '../fields/seo'
import { publicReadStaffWrite } from '../lib/access'

/**
 * Editable content pages — preserves the 11 legacy content/policy URLs.
 * Slug maps 1:1 to the URL path (e.g. slug 'about-us' → /about-us).
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status'],
  },
  access: publicReadStaffWrite,
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'URL path without leading slash — MUST match legacy slug for preserved URLs' },
    },
    { name: 'body', type: 'richText', required: true },
    {
      name: 'template',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Service landing', value: 'service' },
        { label: 'Contact', value: 'contact' },
        { label: 'Policy', value: 'policy' },
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
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'showInNav', type: 'checkbox', defaultValue: false },
    { name: 'showInFooter', type: 'checkbox', defaultValue: false },
    ...seoFields,
  ],
}

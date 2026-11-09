import type { CollectionConfig } from 'payload'

import { seoFields } from '../fields/seo'
import { staffWrite } from '../lib/access'

/**
 * Educational articles — the DIY guide slug is frozen:
 * 'how-to-update-gps-maps-diy-guide' must never change.
 */
export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'publishedAt', 'status'],
  },
  access: {
    read: ({ req }) => (req.user ? true : { status: { equals: 'published' } }),
    create: staffWrite,
    update: staffWrite,
    delete: staffWrite,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'URL path — how-to-update-gps-maps-diy-guide is FROZEN' },
    },
    { name: 'excerpt', type: 'textarea' },
    { name: 'body', type: 'richText', required: true },
    { name: 'publishedAt', type: 'date' },
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
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
    {
      name: 'ctaBlock',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'body', type: 'textarea' },
        { name: 'linkLabel', type: 'text' },
        { name: 'linkUrl', type: 'text' },
      ],
      admin: { description: 'e.g. "Need it done for you?" → /gps-maps-updates' },
    },
    ...seoFields,
  ],
}

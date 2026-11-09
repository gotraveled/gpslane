import type { CollectionConfig } from 'payload'

import { seoFields } from '../fields/seo'
import { publicReadStaffWrite } from '../lib/access'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'isActive', 'sortOrder'],
  },
  access: publicReadStaffWrite,
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'URL segment under /shop — lowercase-hyphenated' },
    },
    { name: 'description', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      admin: { description: 'Leave empty for top-level categories' },
    },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    { name: 'isActive', type: 'checkbox', defaultValue: false, admin: { description: 'Category page only goes live when active with published products' } },
    {
      name: 'requiresReview',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'e.g. trackers — hidden until owner legal sign-off' },
    },
    ...seoFields,
  ],
}

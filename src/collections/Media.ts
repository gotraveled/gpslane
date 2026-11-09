import type { CollectionConfig } from 'payload'

import { staffWrite } from '../lib/access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    defaultColumns: ['filename', 'alt', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: staffWrite,
    update: staffWrite,
    delete: staffWrite,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
  },
}

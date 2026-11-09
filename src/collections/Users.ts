import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    tokenExpiration: 7200,
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => (req.user as { role?: string } | null)?.role === 'super-admin',
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => (req.user as { role?: string } | null)?.role === 'super-admin',
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'support',
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Support', value: 'support' },
        { label: 'Fulfilment', value: 'fulfilment' },
      ],
      access: {
        update: ({ req }) => (req.user as { role?: string } | null)?.role === 'super-admin',
      },
      saveToJWT: true,
    },
    { name: 'name', type: 'text' },
  ],
  versions: false,
}

import type { Access, CollectionConfig } from 'payload'

/** Any authenticated admin user (staff). Public storefront reads use access.read: () => true or overrideAccess. */
export const staffOnly: Access = ({ req }) => Boolean(req.user)

export const isSuperAdmin: Access = ({ req }) =>
  Boolean(req.user && (req.user as { role?: string }).role === 'super-admin')

/** Admin-only write; public read where appropriate. */
export const staffWrite: Access = ({ req }) => Boolean(req.user)

/** Read restricted to staff (costs, margins, supplier internals). */
export const staffRead: Access = ({ req }) => Boolean(req.user)

/**
 * Standard admin-managed collection access:
 * public read, staff write. Apply to catalogue/content collections.
 */
export const publicReadStaffWrite = {
  read: () => true,
  create: staffWrite,
  update: staffWrite,
  delete: staffWrite,
} satisfies NonNullable<CollectionConfig['access']>

/** Fully staff-only collection (supplier mappings, inventory internals, logs). */
export const staffOnlyAccess = {
  read: staffOnly,
  create: staffWrite,
  update: staffWrite,
  delete: staffWrite,
} satisfies NonNullable<CollectionConfig['access']>

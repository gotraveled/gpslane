import type { CollectionConfig } from 'payload'

import { staffOnlyAccess } from '../lib/access'

/**
 * Eligibility rules for the map-update service.
 * Rules suggest an outcome; a human ALWAYS confirms before quoting.
 * Staff-only: internal decision logic.
 */
export const CompatibilityRules: CollectionConfig = {
  slug: 'compatibility-rules',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'outcome', 'priority', 'isActive'],
  },
  access: staffOnlyAccess,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'manufacturerPattern', type: 'text', admin: { description: 'Case-insensitive substring/regex match on manufacturer' } },
    { name: 'modelPattern', type: 'text' },
    { name: 'screenSizeIn', type: 'number', min: 0 },
    {
      name: 'outcome',
      type: 'select',
      required: true,
      options: [
        { label: 'Official free update', value: 'official_free' },
        { label: 'Official paid maps', value: 'official_paid' },
        { label: 'Assistance eligible (review required)', value: 'assist_eligible' },
        { label: 'Not eligible', value: 'not_eligible' },
        { label: 'Pending review', value: 'pending_review' },
      ],
    },
    { name: 'reason', type: 'textarea', required: true, admin: { description: 'Shown internally and (for customer-facing outcomes) adapted for the customer' } },
    { name: 'officialUpdateUrl', type: 'text' },
    { name: 'priority', type: 'number', defaultValue: 0, admin: { description: 'Higher = evaluated first' } },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    { name: 'reviewedAt', type: 'date' },
    { name: 'reviewedBy', type: 'relationship', relationTo: 'users' },
  ],
}

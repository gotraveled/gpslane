import type { CollectionConfig } from 'payload'

import { staffOnlyAccess } from '../lib/access'

/**
 * Map-update service requests — the $service business-line pipeline.
 * See docs/MAP_UPDATE_SERVICE_WORKFLOW.md.
 */
export const MapUpdateRequests: CollectionConfig = {
  slug: 'map-update-requests',
  admin: {
    useAsTitle: 'requestNumber',
    defaultColumns: ['requestNumber', 'fullName', 'eligibilityOutcome', 'status', 'createdAt'],
  },
  access: staffOnlyAccess,
  fields: [
    { name: 'requestNumber', type: 'text', required: true, index: true, admin: { readOnly: true, description: 'MU-YYYY-NNNN — generated on create' } },

    // Contact
    { name: 'fullName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', required: true },

    // Device identification
    { name: 'deviceManufacturer', type: 'text', required: true },
    { name: 'deviceModel', type: 'text' },
    { name: 'deviceSerial', type: 'text' },
    { name: 'screenSizeIn', type: 'number', min: 0 },
    { name: 'deviceAgeBand', type: 'select', options: ['under_2y', '2_5y', '5_10y', 'over_10y', 'unknown'] },

    // Region & current state
    {
      name: 'country',
      type: 'select',
      required: true,
      options: [
        { label: 'United States', value: 'us' },
        { label: 'Canada', value: 'ca' },
      ],
    },
    { name: 'mapVersion', type: 'text', admin: { description: 'Free text; "don\'t know" allowed' } },
    {
      name: 'mapSource',
      type: 'select',
      options: ['manufacturer_site', 'sd_card', 'preinstalled', 'unknown', 'other'],
    },
    { name: 'hasWifi', type: 'checkbox' },

    // Eligibility & quoting
    {
      name: 'eligibilityOutcome',
      type: 'select',
      options: [
        { label: 'Pending review', value: 'pending_review' },
        { label: 'Official free update', value: 'official_free' },
        { label: 'Official paid maps', value: 'official_paid' },
        { label: 'Assistance eligible', value: 'assist_eligible' },
        { label: 'Not eligible', value: 'not_eligible' },
      ],
      admin: { description: 'Rules-engine suggestion; human confirms before quoting' },
    },
    {
      name: 'rulesSuggestion',
      type: 'json',
      admin: { readOnly: true, description: 'Snapshot of the rule that suggested the outcome' },
      access: { read: ({ req }) => Boolean(req.user) },
    },
    {
      name: 'serviceOffering',
      type: 'relationship',
      relationTo: 'service-offerings',
    },
    { name: 'quotedPriceCents', type: 'number', min: 0 },
    {
      name: 'quotedCurrency',
      type: 'select',
      options: [
        { label: 'USD', value: 'usd' },
        { label: 'CAD', value: 'cad' },
      ],
    },

    // Workflow
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In review', value: 'in_review' },
        { label: 'Quoted', value: 'quoted' },
        { label: 'Accepted', value: 'accepted' },
        { label: 'In progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Declined', value: 'declined' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'assignedTo', type: 'relationship', relationTo: 'users' },
    { name: 'notes', type: 'textarea' },
    { name: 'internalFlags', type: 'text', admin: { description: 'e.g. suspicious, vip, follow-up' } },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, operation }) => {
        if (operation === 'create' && data && !data.requestNumber) {
          const year = new Date().getFullYear()
          // Sequential-ish number; admin can correct. Uniqueness enforced by index + app layer.
          data.requestNumber = `MU-${year}-${String(Date.now() % 100000).padStart(5, '0')}`
        }
        return data
      },
    ],
  },
}

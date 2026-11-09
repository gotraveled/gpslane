import type { GlobalConfig } from 'payload'

import { staffWrite } from '../lib/access'

/**
 * Admin-configurable pricing/margin settings.
 * Target: 35–40% gross margin on landed cost (product + shipping).
 * Price at margin m: landed / (1 - m). PayPal fees and refund reserve
 * are contribution-margin deductions applied on top.
 */
export const PricingSettings: GlobalConfig = {
  slug: 'pricing-settings',
  label: 'Pricing & Margin Settings',
  access: {
    read: staffWrite,
    update: staffWrite,
  },
  fields: [
    {
      name: 'targetMargin',
      type: 'group',
      fields: [
        { name: 'minPercent', type: 'number', required: true, defaultValue: 35, min: 0, max: 100, admin: { description: 'Minimum gross margin % on landed cost' } },
        { name: 'maxPercent', type: 'number', required: true, defaultValue: 40, min: 0, max: 100, admin: { description: 'Target gross margin % on landed cost' } },
      ],
    },
    {
      name: 'paymentFees',
      type: 'group',
      fields: [
        { name: 'paypalRatePercent', type: 'number', required: true, defaultValue: 3.49, min: 0, admin: { description: 'PayPal percentage fee' } },
        { name: 'paypalFixedUsdCents', type: 'number', required: true, defaultValue: 49 },
        { name: 'paypalFixedCadCents', type: 'number', required: true, defaultValue: 49 },
      ],
    },
    {
      name: 'refundReservePercent',
      type: 'number',
      required: true,
      defaultValue: 5,
      min: 0,
      max: 100,
      admin: { description: 'Refund/return reserve as % of selling price' },
    },
    {
      name: 'platformCostCents',
      type: 'number',
      required: true,
      defaultValue: 50,
      min: 0,
      admin: { description: 'Per-order platform/infra cost allocation (USD cents)' },
    },
    {
      name: 'fx',
      type: 'group',
      admin: { description: 'Planning FX only — final CAD prices are set explicitly per product, never auto-converted' },
      fields: [
        { name: 'usdCadRate', type: 'number', required: true, defaultValue: 1.38, min: 0 },
      ],
    },
  ],
}

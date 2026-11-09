import type { CollectionConfig } from 'payload'

import { staffOnlyAccess } from '../lib/access'

/**
 * Supplier product mappings + cost/inventory data.
 * Staff-only: contains unit costs, margins inputs — never exposed publicly.
 */
export const SupplierProducts: CollectionConfig = {
  slug: 'supplier-products',
  admin: {
    useAsTitle: 'supplierProductId',
    defaultColumns: ['supplierProductId', 'variant', 'supplier', 'syncStatus'],
  },
  access: staffOnlyAccess,
  fields: [
    {
      name: 'variant',
      type: 'relationship',
      relationTo: 'product-variants',
      required: true,
      index: true,
    },
    {
      name: 'supplier',
      type: 'relationship',
      relationTo: 'suppliers',
      required: true,
    },
    { name: 'supplierProductId', type: 'text', required: true, index: true, admin: { description: 'CJ pid / supplier product ID' } },
    { name: 'supplierVariantId', type: 'text', admin: { description: 'CJ vid / variant ID' } },
    { name: 'supplierSku', type: 'text' },

    // ---- Cost (admin-only, never customer-facing) ----
    { name: 'unitCostCents', type: 'number', min: 0, admin: { description: 'Supplier unit cost in costCurrency minor units' } },
    {
      name: 'costCurrency',
      type: 'select',
      options: [
        { label: 'USD', value: 'usd' },
        { label: 'CAD', value: 'cad' },
      ],
      defaultValue: 'usd',
    },
    {
      name: 'shippingQuotes',
      type: 'array',
      fields: [
        {
          name: 'destinationCountry',
          type: 'select',
          required: true,
          options: [
            { label: 'United States', value: 'US' },
            { label: 'Canada', value: 'CA' },
          ],
        },
        { name: 'costCents', type: 'number', min: 0 },
        { name: 'originCountry', type: 'select', options: [
          { label: 'US', value: 'US' }, { label: 'CA', value: 'CA' }, { label: 'CN', value: 'CN' },
        ] },
        { name: 'serviceName', type: 'text' },
        { name: 'trackingAvailable', type: 'checkbox' },
        { name: 'etaMinDays', type: 'number', min: 0 },
        { name: 'etaMaxDays', type: 'number', min: 0 },
        { name: 'method', type: 'text' },
        { name: 'quotedAt', type: 'date' },
      ],
      admin: { description: 'Destination-specific shipping cost/ETA snapshots from supplier quotes' },
    },

    // ---- Stock (destination-specific, verified via supplier API) ----
    { name: 'stockUs', type: 'number', min: 0, admin: { description: 'Available units — US warehouse' } },
    { name: 'stockCa', type: 'number', min: 0, admin: { description: 'Available units — Canada warehouse' } },
    { name: 'stockCn', type: 'number', min: 0, admin: { description: 'Available units — China warehouse (fallback)' } },

    // ---- Warehouse verification (Phase 5 NA strategy) ----
    {
      name: 'warehouseCountry',
      type: 'select',
      options: [
        { label: 'United States', value: 'US' },
        { label: 'Canada', value: 'CA' },
        { label: 'China (fallback)', value: 'CN' },
        { label: 'Multiple / mixed', value: 'mixed' },
        { label: 'Unknown', value: 'unknown' },
      ],
      admin: { description: 'Physical warehouse origin — verified via CJ getInventoryByPid, not marketing claims' },
    },
    {
      name: 'warehouseStatus',
      type: 'select',
      defaultValue: 'warehouse_unverified',
      options: [
        { label: 'Warehouse verified', value: 'warehouse_verified' },
        { label: 'Warehouse unverified', value: 'warehouse_unverified' },
      ],
    },

    // ---- Branding status ----
    {
      name: 'brandingStatus',
      type: 'select',
      defaultValue: 'branding_unverified',
      options: [
        { label: 'Verified private label', value: 'verified_private_label' },
        { label: 'Storefront brand only', value: 'storefront_brand_only' },
        { label: 'Branding unverified', value: 'branding_unverified' },
      ],
      admin: { description: 'verified_private_label requires supplier-confirmed branding evidence' },
    },

    // ---- Review workflow ----
    {
      name: 'reviewStatus',
      type: 'select',
      defaultValue: 'pending_review',
      options: [
        { label: 'Pending review', value: 'pending_review' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
    },

    // ---- Sync state ----
    { name: 'lastInventorySyncAt', type: 'date' },
    { name: 'lastCostSyncAt', type: 'date' },
    {
      name: 'syncStatus',
      type: 'select',
      defaultValue: 'unmapped',
      options: [
        { label: 'OK', value: 'ok' },
        { label: 'Error', value: 'error' },
        { label: 'Unmapped', value: 'unmapped' },
      ],
    },
    { name: 'syncError', type: 'textarea' },

    // ---- Private label ----
    {
      name: 'privateLabel',
      type: 'group',
      fields: [
        { name: 'confirmed', type: 'checkbox', defaultValue: false, admin: { description: 'Supplier-confirmed only' } },
        { name: 'moq', type: 'number', min: 0 },
        { name: 'evidence', type: 'textarea', admin: { description: 'Confirmation reference + date' } },
      ],
    },
  ],
}

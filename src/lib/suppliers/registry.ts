import type { SupplierAdapter, SupplierId, SupplierCapabilities } from './types'
import { AdapterNotConfiguredError } from './types'

/**
 * Supplier registry — single source of truth for which fulfilment
 * providers are wired up and what each can do.
 * Statuses reflect docs/GPSLANE_GLOBAL_SUPPLIER_RESEARCH.md (Phase 6).
 */

const NO_CAPS: SupplierCapabilities = {
  productSearch: false,
  productDetail: false,
  variantListing: false,
  inventorySync: false,
  shippingQuotes: false,
  orderSubmission: false,
  orderTracking: false,
  cancellationsRefunds: false,
  privateLabel: false,
  webhooks: false,
}

const CJ_CAPS: SupplierCapabilities = {
  ...NO_CAPS,
  productSearch: true,
  productDetail: true,
  variantListing: true,
  inventorySync: true,
  shippingQuotes: true,
  orderSubmission: true, // implemented but sandbox-gated (isSandbox=1); live use not approved
  orderTracking: true,
  cancellationsRefunds: true,
  webhooks: true,
  privateLabel: false, // endpoint exists; no product confirmed
}

export const SUPPLIER_REGISTRY: Record<SupplierId, { displayName: string; capabilities: SupplierCapabilities; status: string }> = {
  cjdropshipping: {
    displayName: 'CJdropshipping',
    capabilities: CJ_CAPS,
    status: 'active-research', // API verified; catalogue has thin NA GPS stock
  },
  doba: {
    displayName: 'Doba',
    capabilities: { ...NO_CAPS, productSearch: true }, // catalog browsable; API requires paid plan + supplier approval
    status: 'candidate', // GPS navigator listings found; per-supplier verification required
  },
  'dropcommerce': {
    displayName: 'DropCommerce',
    capabilities: { ...NO_CAPS, productSearch: true },
    status: 'candidate', // 400+ US/CA suppliers; GPS catalog unverified
  },
  zendrop: {
    displayName: 'Zendrop',
    capabilities: { ...NO_CAPS },
    status: 'candidate', // US fulfillment + private label; GPS catalog unverified; paid plan
  },
  'cwr-distribution': {
    displayName: 'CWR Wholesale Distribution',
    capabilities: { ...NO_CAPS },
    status: 'candidate', // US warehouses (NJ/FL), Garmin GPS products, dealer API, $9.95 flat ship
  },
  'petra-industries': {
    displayName: 'Petra Industries',
    capabilities: { ...NO_CAPS },
    status: 'candidate', // Garmin wholesale; GPS accessories (mounts/cables); dealer account needed
  },
  manual: {
    displayName: 'Manual fulfilment',
    capabilities: { ...NO_CAPS, orderSubmission: true, orderTracking: true, cancellationsRefunds: true },
    status: 'fallback', // always available; staff-fulfilled orders
  },
}

const adapters = new Map<SupplierId, SupplierAdapter>()

export function registerAdapter(adapter: SupplierAdapter) {
  adapters.set(adapter.id, adapter)
}

export function getAdapter(id: SupplierId): SupplierAdapter {
  const adapter = adapters.get(id)
  if (!adapter) throw new AdapterNotConfiguredError(id, 'adapter implementation')
  return adapter
}

export function listSuppliers() {
  return Object.entries(SUPPLIER_REGISTRY).map(([id, meta]) => ({ id: id as SupplierId, ...meta }))
}

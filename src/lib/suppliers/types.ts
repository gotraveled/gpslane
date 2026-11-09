/**
 * Multi-supplier adapter contract.
 * Every fulfilment supplier implements this interface so the catalogue,
 * pricing, and order pipeline stay supplier-agnostic.
 * See docs/GPSLANE_GLOBAL_SUPPLIER_RESEARCH.md for per-supplier status.
 */

export type SupplierId =
  | 'cjdropshipping'
  | 'doba'
  | 'dropcommerce'
  | 'zendrop'
  | 'cwr-distribution'
  | 'petra-industries'
  | 'manual'

export type DestinationCountry = 'US' | 'CA'

export type SupplierCapabilities = {
  productSearch: boolean
  productDetail: boolean
  variantListing: boolean
  inventorySync: boolean
  shippingQuotes: boolean
  orderSubmission: boolean
  orderTracking: boolean
  cancellationsRefunds: boolean
  privateLabel: boolean
  webhooks: boolean
}

export type SupplierProduct = {
  supplierProductId: string
  title: string
  description?: string
  imageUrls: string[]
  categoryHints: string[]
  supplierUrl?: string
}

export type SupplierVariant = {
  supplierVariantId: string
  supplierSku?: string
  title?: string
  priceUsdCents?: number
  weightGrams?: number
  dimensionsMm?: { l: number; w: number; h: number }
  imageUrl?: string
}

export type WarehouseStock = {
  countryCode: string
  warehouseName?: string
  onHand: number
  cjStock?: number
  factoryStock?: number
}

export type ShippingQuote = {
  serviceName: string
  carrier?: string
  originCountry: string
  destinationCountry: DestinationCountry
  costUsdCents: number
  etaMinDays?: number
  etaMaxDays?: number
  trackingIncluded: boolean
  quotedAt: string
}

export type SupplierOrderLine = {
  supplierVariantId: string
  quantity: number
}

export type SupplierOrder = {
  idempotencyKey: string
  lines: SupplierOrderLine[]
  shipTo: {
    name: string
    address1: string
    address2?: string
    city: string
    state: string
    postalCode: string
    country: DestinationCountry
    phone?: string
    email?: string
  }
  isSandbox?: boolean
}

export type SupplierOrderResult = {
  supplierOrderId: string
  status: 'accepted' | 'pending' | 'rejected'
  raw?: unknown
}

export type SupplierAdapter = {
  readonly id: SupplierId
  readonly displayName: string
  readonly capabilities: SupplierCapabilities

  searchProducts(query: { keyword: string; destinationCountry?: DestinationCountry; limit?: number }): Promise<SupplierProduct[]>
  getProduct(supplierProductId: string): Promise<SupplierProduct | null>
  getVariants(supplierProductId: string): Promise<SupplierVariant[]>
  getInventory(supplierProductId: string): Promise<WarehouseStock[]>
  getShippingQuotes(input: { supplierVariantId: string; quantity: number; destinationCountry: DestinationCountry }): Promise<ShippingQuote[]>

  /** Order submission — must remain unimplemented until supplier + live fulfilment are approved. */
  submitOrder(order: SupplierOrder): Promise<SupplierOrderResult>
  getOrderStatus(supplierOrderId: string): Promise<{ status: string; tracking?: { carrier?: string; number?: string; url?: string } }>
  cancelOrder(supplierOrderId: string, reason: string): Promise<{ cancelled: boolean }>
}

export class AdapterNotConfiguredError extends Error {
  constructor(supplierId: SupplierId, capability: string) {
    super(`Supplier "${supplierId}" does not support ${capability} yet — see docs/GPSLANE_GLOBAL_SUPPLIER_RESEARCH.md`)
    this.name = 'AdapterNotConfiguredError'
  }
}

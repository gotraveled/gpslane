# GPSLane — Fulfilment Design

## 1. Requirements (from brief)

Provider abstraction supporting CJdropshipping, manual fulfilment, and future suppliers; operations: product mapping, inventory lookup, order submission, status retrieval, tracking, cancellation where supported; idempotency, retries, error handling, event logging. **No fictional CJ endpoints** — CJ specifics are marked [VERIFY] until credentials/docs access is confirmed.

## 2. `FulfilmentProvider` interface

```ts
// src/domains/fulfilment/types.ts

export type FulfilmentStatus =
  | 'queued' | 'submitted' | 'acknowledged'
  | 'processing' | 'shipped' | 'delivered'
  | 'cancelled' | 'failed';

export interface SupplierProductRef {
  supplierProductId: string;
  supplierVariantId?: string;
  supplierSku?: string;
}

export interface SubmitOrderInput {
  idempotencyKey: string;          // = fulfilments.idempotencyKey
  orderNumber: string;
  currency: 'usd' | 'cad';
  shippingAddress: NormalizedAddress;   // {name, phone, line1, line2?, city, region, postalCode, country}
  items: Array<{
    sku: string;
    quantity: number;
    supplierRefs: SupplierProductRef[];  // resolved via supplier_product_mappings
  }>;
  note?: string;
}

export interface ProviderOrderStatus {
  providerOrderId: string;
  status: FulfilmentStatus;
  carrierName?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  shippedAt?: string;
  deliveredAt?: string;
  raw: unknown;                    // stored verbatim in fulfilment_events
}

export interface FulfilmentProvider {
  readonly code: string;           // 'mock' | 'manual' | 'cjdropshipping' | ...
  readonly capabilities: {
    inventoryLookup: boolean;
    orderSubmit: boolean;
    statusPoll: boolean;
    cancel: boolean;
    webhooks: boolean;
  };

  mapProduct?(internalVariantId: string, supplierRefs: SupplierProductRef[]): Promise<void>;
  getInventory?(supplierProductId: string): Promise<{ available: number | null; costCents?: number }>;
  submitOrder(input: SubmitOrderInput): Promise<{ providerOrderId: string; raw?: unknown }>;
  getOrderStatus(providerOrderId: string): Promise<ProviderOrderStatus>;
  cancelOrder?(providerOrderId: string, reason: string): Promise<{ cancelled: boolean; raw?: unknown }>;
}
```

Provider is selected per supplier via `fulfilment_providers` row (`providerType` + `credentialsRef` pointing at an env var **name**, never the secret value).

## 3. Providers

### 3.1 `MockProvider` (development)

- Deterministic fake: returns synthetic `providerOrderId = mock_<ulid>`, status transitions `submitted → acknowledged → shipped` driven by event count or a `?simulate=` hook **only when `NODE_ENV !== 'production'` and `MOCK_FULFILMENT=1`**.
- Used for all local dev, CI, and preview deploys. Never enabled in production (guard at boot).

### 3.2 `ManualProvider` (production fallback — ships first)

- `submitOrder` → creates a `fulfilments` row in `queued` status and an admin "Fulfilment queue" work item; ops staff place the order directly with the supplier (CJ dashboard, AliExpress, wholesaler) and record `supplierOrderId` + tracking in admin.
- `getOrderStatus` reads our own `shipments`/`tracking_events` (entered by staff or imported).
- This is the **operational baseline**: even if CJ integration ships, manual remains the escape hatch for unmapped/failed items.
- `cancelOrder` supported (pre-shipment flag only).

### 3.3 `CJProvider` (blocked on verification)

**Status: [BLOCKED] — no credentials, no confirmed product mappings, API surface to be re-verified against current CJdropshipping developer docs before any code is written.**

Design constraints already fixed (independent of CJ specifics):

- All CJ calls go through an HTTP client with: API-key header from env (`CJDROPSHIPPING_API_KEY` — name TBD after docs check), base URL from config, 10s timeout, exponential backoff (3 attempts, jitter), circuit-breaker after 5 consecutive failures.
- `submitOrder` maps our `SubmitOrderInput` → CJ order-create payload **only after** the exact documented endpoint/payload is verified. Until then this method throws `ProviderNotImplemented` and the order falls back to `ManualProvider` queue automatically.
- Inventory lookup and status polling only enabled if `capabilities` flags are set true after doc verification — do not assume endpoints exist.
- CJ order IDs stored in `fulfilments.supplierOrderId`; tracking flows into `shipments`/`tracking_events` via the same path as manual entry.

**Verification checklist before CJ adapter implementation:**
1. Owner provides CJ account + API credentials (or confirms none exist).
2. Confirm the 7 products exist in CJ catalog; capture `productId`/`vid`/SKU per variant → `supplier_product_mappings`.
3. Verify against live CJ docs: auth mechanism, order-create endpoint, order-query/status endpoint, tracking field names, cancel support, rate limits.
4. Confirm whether CJ supports CAD pricing or USD-only (affects `currency` handling).
5. Test in CJ sandbox/test mode only — **never submit real orders during development**.

## 4. Order → fulfilment pipeline

```
order.paid (webhook)
   │
   ▼ Inngest event: order/paid
create fulfilments row (idempotencyKey = `fulfil-${orderId}`)
   │
   ▼ resolve provider per item:
   │   all items mapped to same enabled provider? → that provider
   │   else → ManualProvider (split shipments supported via multiple fulfilments rows)
   │
   ▼ provider.submitOrder()
   │   success → status=acknowledged, store supplierOrderId
   │   failure → retry w/ backoff (Inngest retries: 3, exponential)
   │             after exhaustion → status=failed + admin alert + activity log
   │             → ops can requeue manually (idempotencyKey prevents dupes)
   │
   ▼ scheduled poll (Inngest cron, interval per provider config e.g. 6h)
   getOrderStatus() → diff vs last known → append fulfilment_events
   → on shipped: create/update shipments + tracking_events → customer email
```

## 5. Idempotency, retries, errors

- **Idempotency:** `fulfilments.idempotencyKey` unique; Inngest event ids derived from order id; CJ submission guarded by checking for existing `supplierOrderId` before calling `submitOrder` (CJ order-create may not be idempotent — verify; if not, we enforce single-attempt semantics ourselves by only submitting from the `queued→submitted` transition, once).
- **Retries:** Inngest function-level retries for transient errors (5xx, timeouts, 429 with `Retry-After`). Permanent errors (4xx validation) → `failed` + manual queue, no retry.
- **Duplicate events:** webhook dedupe via `webhook_events.eventId`; status polling is naturally idempotent (diff-based).
- **Partial failures:** per-item mapping — if one item unmapped, split: mapped items go to CJ, unmapped to manual queue (two `fulfilments` rows, one order). Customer sees single order, multiple shipments.
- **Event log:** every provider interaction appended to `fulfilment_events` (type, payload, error) — full audit trail for disputes.

## 6. Cancellation

- Customer/admin cancel pre-shipment → if `fulfilments.status` is `queued|submitted|acknowledged` and provider `capabilities.cancel`, call `cancelOrder`; on success mark `cancelled`. If already `shipped`, cancellation impossible → return/refund flow instead (commerce doc §7).
- CJ cancel support: [VERIFY].

## 7. Inventory sync

- Nightly Inngest job per enabled provider with `inventoryLookup`: pull availability for mapped products → update `inventory_levels` (source='supplier') → flag mismatches vs. local stock in admin dashboard.
- Cost sync (`unitCostCents`) feeds margin reporting only — never customer-facing.

## 8. What we explicitly do NOT do

- No real supplier orders from dev/preview/CI (MockProvider only; CJ adapter behind env flag + test-mode keys).
- No scraping of CJ or supplier sites.
- No storing supplier credentials in DB — env vars referenced by name only.
- No auto-refund on fulfilment failure — refund is always an explicit admin/payment action.

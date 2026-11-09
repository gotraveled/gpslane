# GPSLane — Commerce Design

Scope: products, categories, variants, pricing, inventory, cart, checkout, orders, payments, refunds, shipping, tracking, accounts, guest checkout, coupons, tax. Currency: **USD and CAD** with explicit handling.

## 1. Catalogue model

- **Product** → many **Variants** (SKU, supplier refs) → **Prices** per currency.
- Existing 7 products are single-variant; schema supports variants without forcing them.
- `compareAtPriceCents` drives strikethrough pricing (all 7 current products show one — preserve per-product values from audit: e.g., Drive 7 → 159.99/189.99).
- **Categories**: seed minimal truthful set (e.g., `car-gps`, `truck-gps`, `accessories`, `bundles`) — final taxonomy [PENDING owner confirm]; products can also live uncategorized under `/shop`.
- Stock: `inventory_levels` per variant; display "In stock" only when `onHand - reserved > 0` or policy allows backorder. Current site shows all InStock — verify real quantities before launch [PENDING].

## 2. Pricing & currency

- Prices stored per variant **per currency** (`prices` table). No runtime FX conversion — owner sets USD and CAD price lists explicitly [REC]. If CAD pricing isn't ready at launch, launch USD-only and hide CAD selector [PENDING owner confirm CAD pricing].
- Money math in integer cents via `lib/money.ts`; all totals server-computed.
- Cart stores `{ variantId, quantity, currency }`; prices never trusted from client.

## 3. Cart

- Client-side cart (Zustand + localStorage persistence) for anonymous + logged-in users; server re-validates on `/api/cart/validate` and again at checkout-session creation.
- Cart drawer UI (matches current "Add to bag" UX); empty state; stock/price-change warnings.
- No standalone `/cart` page needed — `/cart` will 301 → `/shop` or render drawer state (decide; current site 404s it, so a 404 is also acceptable — [REC] implement `/cart` → 301 `/shop` only if analytics show usage).

## 4. Checkout

- `/checkout` page: contact (guest or account), shipping address (US/CA only per policy), shipping method, coupon, order summary, payment.
- **Guest checkout supported**; account creation optional post-purchase.
- Server flow:
  1. `POST /api/checkout/session` — validates cart server-side (price, stock, coupon), computes totals incl. tax + shipping, creates `order` (status `pending_payment`) + `payment` row.
  2. Stripe: create Checkout Session or PaymentIntent → redirect/embedded confirm. PayPal: create order via JS SDK → `onApprove` captures.
  3. Webhook (source of truth) → mark `paid`, decrement reserved inventory, enqueue fulfilment, send confirmation email.
  4. `POST /api/checkout/confirm` — fallback sync path for return-redirect flows; idempotent.
- Abandoned `pending_payment` orders expire via scheduled job (2h) and release reservations.

## 5. Payments — `PaymentProvider` interface

```ts
interface PaymentProvider {
  createSession(input: CheckoutInput): Promise<PaymentSession>   // stripe session id / paypal order id
  getStatus(providerRef: string): Promise<PaymentStatus>
  refund(providerRef: string, amountCents: number, reason?: string): Promise<RefundResult>
  verifyWebhook(req: Request): Promise<VerifiedWebhookEvent>      // signature check inside
}
```

- **Stripe** [PENDING merchant account]: PaymentIntents/Checkout, webhook `payment_intent.succeeded`, `charge.refunded`. Card data never touches our servers (Stripe-hosted fields/Checkout).
- **PayPal** [PENDING business account]: Orders v2 API, webhook `PAYMENT.CAPTURE.COMPLETED` / `CHECKOUT.ORDER.APPROVED`. PayPal Buttons on checkout.
- If PayPal merchant eligibility fails → Stripe-only launch; site copy updated accordingly [PENDING].
- All webhook handlers: verify signature → insert `webhook_events` (dedupe on event id) → dispatch to order domain → 200 fast, process async via Inngest for anything slow.

## 6. Orders & lifecycle

State machine (enforced in `domains/orders`):

```
pending_payment → paid → processing → fulfilment_submitted → shipped → delivered
     │              │         │              │
     └─expired──► expired   └─► cancelled (pre-ship, ≤24h policy) / refunded / partially_refunded
```

- Order number format `GL-YYYY-NNNNNN` sequential per year.
- Customer-facing status page: `/account/orders/[orderNumber]` (auth) + guest lookup by email+order number.
- Emails: confirmation (paid), shipped (tracking), delivered, refund issued, cancellation — Resend templates.

## 7. Refunds, cancellations, returns

- **Cancellation**: allowed ≤24h post-purchase and pre-fulfilment-submit → auto-refund via PaymentProvider, order → `cancelled`.
- **Refunds**: admin-initiated from order detail; supports full/partial; records `refunds` row + provider refund id; email customer.
- **Returns**: 7-day window per policy — implemented as admin workflow (mark `return_requested` → inspect → refund or deny); no self-serve return portal in v1 [REC scope].
- Map-update service ($99.99): **not a checkout product** — it's a lead-gen service fulfilled manually. Represented as `productType: service` content + `map_update_requests` pipeline, invoiced via PayPal payment link [PENDING: confirm PayPal invoice/manual payment flow].

## 8. Shipping

- Policy: free shipping, US & CA only, 10–20 business days, processed 2–5 days [CONFIRMED from live policy pages].
- `store_settings.shippingMethods`: seed one method `standard` = $0, countries US/CA, handlingDays 2–5, transitDays 10–20.
- Carrier/tracking numbers arrive via fulfilment provider (CJ tracking or manual entry) → `shipments` + `tracking_events`.
- No real-time carrier rates in v1 (dropship model makes them meaningless pre-fulfilment) [REC].

## 9. Tax

- **[PENDING owner]:** nexus/registration status in US states and Canada provinces is unknown — this is a business decision, not a technical one.
- Design supports: (a) manual tax table (rate per region, configurable), (b) Stripe Tax add-on. Default seed: tax = 0 with a config flag, pending owner input. **Do not charge tax until rules are confirmed.**

## 10. Coupons

- Codes: percent or fixed-amount (per currency), min subtotal, date window, usage caps, optional product restrictions.
- Applied server-side at session creation; redemption recorded on order; disabled codes rejected.

## 11. Customer accounts

- Optional registration; Payload `customers` auth collection (email+password, verification email).
- Account area: order history, tracking links, default address, GDPR data export/delete request (admin-executed).
- No saved payment methods in v1 (Stripe customer mapping possible later) [REC].

## 12. Edge cases explicitly handled

- Price/stock change between add-to-cart and payment → revalidate; if insufficient stock, cancel session with message.
- Duplicate webhook delivery → `webhook_events.eventId` unique.
- PayPal capture succeeds but webhook delayed → confirm endpoint reconciles via `getStatus`.
- Partial refunds → `partially_refunded` status, remainder still tracked.
- Currency mismatch (CAD cart, USD-only price missing) → block checkout with clear error.
- Guest + account same email → orders linked by email; account claim merges on registration.

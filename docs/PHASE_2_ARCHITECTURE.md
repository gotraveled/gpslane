# GPSLane — Phase 2: Production Architecture

**Status:** Proposal for review. No implementation has begun.
**Baseline:** Phase 1 audit (`PROJECT_AUDIT.md`, `EXISTING_URL_INVENTORY.md`, `COMMERCE_INTEGRATION_AUDIT.md`).

Legend used throughout: **[CONFIRMED]** = decided requirement · **[REC]** = recommended technical decision · **[PENDING]** = owner decision needed · **[BLOCKED]** = waiting on credentials/access.

---

## 1. Architecture at a glance

**Modular monolith**: one Next.js application on Vercel containing the public storefront, checkout API, webhooks, and an embedded CMS/admin (Payload CMS). PostgreSQL (Neon) is the single system of record. External services are thin adapters behind interfaces.

```
                        ┌─────────────────────────────────────────────┐
                        │              Vercel (Next.js)               │
                        │                                             │
  Browser ────────────► │  App Router storefront (RSC + client comps) │
                        │      │                                      │
                        │      ├── /api/checkout/*   (cart→order)     │
                        │      ├── /api/webhooks/*   (Stripe/PayPal)  │
                        │      ├── /api/fulfilment/* (provider sync)  │
                        │      ├── /api/forms/*      (leads)          │
                        │      └── /admin/*          (Payload CMS)    │
                        └──────┬───────────┬───────────┬──────────────┘
                               │           │           │
                  ┌────────────▼──┐  ┌─────▼─────┐  ┌──▼───────────────┐
                  │  Neon Postgres│  │ Vercel    │  │ External services │
                  │  (Payload     │  │ Blob      │  │ Stripe · PayPal  │
                  │   collections)│  │ (media)   │  │ Resend (email)   │
                  └───────────────┘  └───────────┘  │ Inngest (jobs)   │
                                                    │ Upstash (ratelimit)│
                                                    │ Sentry (errors)  │
                                                    │ FulfilmentProvider│
                                                    │  ├ MockProvider   │
                                                    │  ├ ManualProvider │
                                                    │  └ CJProvider [BLOCKED]│
                                                    └──────────────────┘
```

**Why modular monolith:** team size is small, the domain is one store + one service, and the traffic profile does not justify service boundaries. Separation is enforced at the module level (`src/domains/*`) and at the provider-adapter level (`FulfilmentProvider`), which is where the real external risk lives.

## 2. Technology decisions

| Concern | Decision | Class | Rationale |
|---|---|---|---|
| Framework | Next.js 15 App Router, TypeScript strict | [CONFIRMED] | Brief requirement |
| Styling | Tailwind CSS v4 + design tokens | [CONFIRMED] | Brief requirement |
| Hosting | Vercel | [CONFIRMED] | Brief requirement; ISR/edge/Payload all compatible |
| Database | PostgreSQL on **Neon** (serverless, branching) | [REC] | Vercel-native integration, preview-branch DBs per deploy, PITR backups. Alternative: Supabase/Vercel Postgres (same Neon infra). |
| ORM/migrations | **Payload CMS 3.x** with **Drizzle Postgres adapter** | [REC] | See §3 — solves CMS + admin + ORM + migrations in one maintained dependency. Payload manages schema migrations (`payload migrate`). |
| CMS | Payload CMS embedded in the same Next.js app at `/admin` | [REC] | See §3 |
| Media | Vercel Blob via `@payloadcms/storage-vercel-blob` | [REC] | Zero-egress from Vercel, Payload-native adapter, keeps images off the DB |
| Email | **Resend** (transactional) | [REC] | Simple API, React Email templates, generous free tier. Postmark is the fallback if deliverability becomes an issue. |
| Background jobs | **Inngest** (event-driven functions on Vercel) | [REC] | Durable retries, scheduling, and observability for fulfilment polling/webhooks; avoids hand-rolled cron+queue. Fallback: Vercel Cron + `jobs` table. |
| Rate limiting | Upstash Redis (`@upstash/ratelimit`) | [REC] | Edge-compatible, per-IP limits on checkout/forms/auth |
| Monitoring | Sentry + Vercel Analytics + structured logs | [REC] | Error tracking with source maps; Web Vitals via `@vercel/analytics` |
| Validation | Zod schemas shared between forms, API routes, and Payload hooks | [REC] | Single source of truth for input shapes |
| Payments | Stripe (Payment Intents/Checkout) **and** PayPal JS SDK | [CONFIRMED] plan, [PENDING] merchant eligibility | §commerce doc |
| Auth (admin) | Payload built-in auth (email+password, salted, session) + RBAC via collection access control | [REC] | No second auth system |
| Auth (customers) | Payload `customers` collection with auth enabled; guest checkout supported | [REC] | One identity store; optional accounts |

## 3. CMS decision: Payload CMS vs. custom admin

**Recommendation: Payload CMS 3.x, embedded.**

| Requirement | Payload delivers |
|---|---|
| Editable pages/articles without code | `pages` + `articles` collections with rich text (Lexical), drafts, publish scheduling |
| Per-page SEO metadata | Native `meta` fields pattern (title, description, canonical, OG image) on every collection |
| Admin panel sections (products, orders, customers, coupons, reviews, enquiries, settings, users, logs) | All are collections/globals with auto-generated admin UI at `/admin` |
| RBAC | Collection- and field-level `access` functions; roles: `super-admin`, `editor`, `support`, `fulfilment` |
| Image alt text, focal point | Native upload fields with required `alt` |
| Activity logs | `payload-locks`/`versions` + custom `activityLogs` collection via hooks |
| E-commerce | No native cart/checkout — we build the transactional layer ourselves (Payload is the back office, not the payment processor) |

**Rejected alternatives:**
- *Custom admin:* weeks of UI work for CRUD that Payload generates; higher security surface (hand-rolled auth).
- *Sanity/Contentful:* external service + cost + webhook sync complexity; content would live outside the transactional DB.
- *WordPress headless:* reintroduces the platform we are leaving.

**Boundary rule:** Payload owns *content and back-office state* (catalogue drafts, orders, customers, settings, logs). Next.js route handlers own *transactional flows* (checkout session creation, payment webhooks, fulfilment submission). They share the same Postgres DB through Payload's Local API — no duplicate data stores.

## 4. Application structure

```
gpslane/
├── docs/                        # audit + architecture docs (this set)
├── src/
│   ├── app/                     # App Router
│   │   ├── (storefront)/        # public site, route group w/ shared layout
│   │   │   ├── page.tsx         # /
│   │   │   ├── shop/page.tsx    # /shop
│   │   │   ├── [slug]/page.tsx  # PDPs + preserved legacy slugs (products resolve here)
│   │   │   ├── gps-maps-updates/page.tsx
│   │   │   ├── how-to-update-gps-maps-diy-guide/page.tsx  # FROZEN slug
│   │   │   ├── about-us/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── frequently-asked-questions-faqs/page.tsx
│   │   │   ├── shipping-and-returns/page.tsx
│   │   │   ├── terms-and-conditions/page.tsx
│   │   │   ├── privacy-policy/page.tsx
│   │   │   ├── disclaimer/page.tsx
│   │   │   ├── checkout/page.tsx
│   │   │   ├── order-confirmation/[orderNumber]/page.tsx
│   │   │   ├── account/         # customer order history/tracking (auth-gated)
│   │   │   ├── sitemap.ts
│   │   │   └── robots.ts
│   │   ├── (payload)/admin/…    # Payload admin UI (generated)
│   │   ├── (payload)/api/[…]/   # Payload REST/GraphQL (optional, admin-auth'd)
│   │   ├── api/
│   │   │   ├── checkout/session/route.ts     # create payment session
│   │   │   ├── checkout/confirm/route.ts     # post-payment order finalization
│   │   │   ├── webhooks/stripe/route.ts      # signature-verified
│   │   │   ├── webhooks/paypal/route.ts      # signature-verified
│   │   │   ├── fulfilment/sync/route.ts      # Inngest-claimed sync endpoint
│   │   │   ├── forms/map-update/route.ts     # lead capture
│   │   │   ├── forms/contact/route.ts
│   │   │   └── cart/validate/route.ts        # server-side price/stock check
│   │   ├── layout.tsx, globals.css, not-found.tsx, error.tsx
│   ├── domains/
│   │   ├── catalog/        # products, variants, categories, pricing queries
│   │   ├── cart/           # cart types + server validation
│   │   ├── orders/         # order lifecycle, totals, status machine
│   │   ├── payments/       # stripe/, paypal/ adapters + shared PaymentProvider iface
│   │   ├── fulfilment/     # FulfilmentProvider iface + mock/manual/CJ adapters
│   │   ├── customers/      # accounts, order lookup, addresses
│   │   ├── content/        # pages/articles resolution, SEO helpers
│   │   ├── notifications/  # email templates + send wrappers
│   │   ├── promotions/     # coupons, discounts
│   │   └── settings/       # store settings global reads (shipping, tax, currency)
│   ├── lib/                # db client (payload local API), env, logger, ratelimit, money utils
│   ├── payload.config.ts   # collections, globals, admin config
│   ├── payload-types.ts    # generated TS types
│   └── middleware.ts       # admin route protection, geo/currency hints, rate limits
├── payload/                # collection/global field definitions if split out
├── tests/                  # vitest unit + integration; playwright e2e
├── .env.example
└── package.json
```

**Route-resolution rule for preserved URLs:** static segments always win over `[slug]` in Next.js, so `/about-us`, `/shop`, etc. are explicit routes; `[slug]` resolves *products only* (lookup by slug → 404 otherwise). This guarantees all 17 legacy URLs map 1:1 with zero redirect rules for kept pages.

## 5. Data flow — purchase journey (device)

```
PDP (/gpslane-*)                Cart drawer            /checkout               Webhooks
   │                              │                     │                        │
   │ add item (client state)      │                     │                        │
   │─────────────────────────────►│                     │                        │
   │                              │ POST /api/cart/validate (price+stock server check)
   │                              │────────────────────►│                        │
   │                              │                     │ Stripe Checkout Session │
   │                              │                     │ or PayPal order create  │
   │                              │                     │──── customer pays ─────►│
   │                              │                     │◄── webhook (signed) ────│
   │                              │                     │ verify → create Order   │
   │                              │                     │ (status=paid)           │
   │                              │                     │ enqueue fulfilment job  │
   │                              │                     │ (Inngest: submit to     │
   │                              │                     │  FulfilmentProvider)    │
   │                              │                     │ send confirmation email │
```

Idempotency: Stripe `event.id` / PayPal `invoice_id`+transmission id stored in `webhookEvents`; order creation keyed on payment intent ID (unique constraint) so replays are no-ops.

## 6. Module boundaries & API surface

- **Public API** (`app/api/*`): checkout session/confirm, cart validation, forms, webhooks. All input Zod-validated, rate-limited, no auth except webhooks (signature-verified).
- **Admin**: Payload Local API used server-side by domains; Payload REST API exposed under `/api` but access-controlled (admin sessions only). Admin UI at `/admin`.
- **Internal**: domain modules call each other via typed functions (`domains/orders`, `domains/fulfilment`), never via HTTP.
- **Outbound**: `FulfilmentProvider`, `PaymentProvider`, `EmailProvider` are the only network boundaries besides inbound webhooks.

## 7. Implementation sequence (post-approval)

1. Scaffold Next.js+TS+Tailwind, Payload+Drizzle+Neon, Vercel Blob, env plumbing, CI (lint/typecheck/test/build).
2. Content model + seed: pages, articles, products (from Hostinger export), settings globals.
3. Storefront pages 1:1 with legacy URLs + SEO layer (metadata, JSON-LD, sitemap, robots).
4. Cart + checkout + Stripe/PayPal (test mode) + order lifecycle + emails.
5. Admin configuration (roles, collections, fulfilment queue view).
6. Fulfilment providers: Mock → Manual queue → CJ adapter (blocked on credentials).
7. Forms, account area, coupons, reviews moderation.
8. Migration import scripts + reconciliation checklist execution.
9. E2E tests, a11y/perf passes, go/no-go checklist.

## 8. Top risks

| Risk | Mitigation |
|---|---|
| CJdropshipping workflow unconfirmed | `FulfilmentProvider` abstraction + Manual provider ships first; CJ adapter last, gated on credentials |
| Product/order data locked in Hostinger | Manual export checklist (`DATA_MIGRATION` section of decisions doc); import scripts accept CSV |
| Payload e-commerce scope creep | Hard boundary: Payload = back office; payments/fulfilment are custom domain code |
| Multi-currency tax/shipping complexity | Explicit per-currency price lists; tax as configurable rules table; Stripe Tax optional [PENDING] |
| Preview deploys hitting prod services | Neon branching + Stripe/PayPal test keys per environment; Inngest env isolation |

# GPSLane.com — Implementation Roadmap

Phase 1 (audit) and Phase 2 (architecture) are complete � see `PROJECT_AUDIT.md`, `PHASE_2_ARCHITECTURE.md` and the Phase 2/3 design docs. **Current strategy (Phase 6c):** GPSLane is a **map-update service website + small CJ-sourced catalogue** � 15 draft products with USPS 5�11 day shipping (see `LAUNCH_CATALOGUE.md`). The Phase 6b service-only pivot was superseded when the owner relaxed sourcing criteria to allow CN-origin stock with USPS delivery. Map-update service remains a co-equal business line (device identification, compatibility review, update guidance, paid assistance). Doba/CWR/Petra/Canadian B2B/EPROLO remain unverified supplier candidates (`GPSLANE_GLOBAL_SUPPLIER_RESEARCH.md` �11). **PayPal-only** payments, Drizzle ORM via Payload adapter. Each step lists deliverables and its release gate. Nothing deploys to production without explicit approval.

## Phase 2 — Architecture proposal (next, before any code)

**Recommended stack:** Next.js (App Router) + TypeScript + Tailwind CSS on Vercel, as specified in the brief. The empty repo provides no reason to deviate.

**Commerce backend decision — RESOLVED:** custom Next.js storefront + **PayPal-only** (service invoices/orders). Orders in Postgres (Neon). **Catalogue descoped (Phase 6b):** service-only site; product collections remain dormant — see `MAP_UPDATE_SERVICE_WORKFLOW.md`, `GPSLANE_GLOBAL_SUPPLIER_RESEARCH.md`.

**Deliverables for Phase 2 doc (`docs/ARCHITECTURE.md`):** data flow, route map, product/content models, admin auth boundary, fulfilment design, env-var list, testing/deploy strategy.

## Phase 3 — SEO & URL preservation (built into every page from day one)

- 11 content/policy URLs + DIY guide preserved 1:1 (see `URL_MIGRATION_MATRIX.md` §A).
- 8 legacy product URLs → documented 301s to the map-update service / relevant content pages (§B) — no product catalogue exists to redirect to.
- Service pages: `/gps-maps-updates`, `/how-to-update-gps-maps-diy-guide`, device-compatibility content.
- Metadata/canonical/sitemap/robots/JSON-LD per `SEO_CONTENT_ARCHITECTURE.md` (updated for new routes).
- Content port: DIY guide (slug frozen), 18 FAQs, 4 policy pages, about, contact — with corrections listed in `PHASE_2_DECISIONS_REQUIRED.md` §B7.

## Phase 4 — Design & UX

- Design system: deep navy + white + electric-blue accent, premium automotive aesthetic; reusable component library (nav, footer, product card, PDP gallery, forms, badges).
- Pages: `/`, `/gps-maps-updates`, `/how-to-update-gps-maps-diy-guide`, `/about-us`, `/contact`, `/frequently-asked-questions-faqs`, 4 policy pages, service-request flow, order/confirmation pages.
- Homepage leads with "Update my GPS maps" service path (no product sales).
- Device-identification / compatibility checker **only if** backed by real data — otherwise ship as curated content, not fake tools.
- Accessibility + performance budgets enforced via lint rules and Lighthouse CI.

## Phase 5 — Service commerce & fulfilment

1. ~~CJ sourcing pipeline / product catalogue~~ — **descoped (Phase 6b)**; collections retained dormant.
2. Map-update service pipeline: intake steps → eligibility rules → human review → PayPal invoice → status tracking (`MAP_UPDATE_SERVICE_WORKFLOW.md`).
3. Service orders in DB: requests, eligibility outcomes, quotes, invoices, status history.
4. Payment: PayPal Orders v2 for service invoices → webhook-verified → order record + audit log.
5. Fulfilment: manual/service-delivery workflow (guidance docs, remote assistance) — `ManualProvider` only; no supplier orders.
6. Notifications: request received, quote issued, payment confirmed, status updates (Resend).
7. Forms: contact + service intake → DB + email notification.
8. Admin: Payload admin — service requests, orders/invoices, content, SEO, users/roles, activity logs.

## Phase 6 — Quality & release gates

Per-step gates: lint + typecheck + unit tests + `next build` green; a11y/SEO review; commit per step.

**Go/no-go checklist (pre-launch):**
- [ ] Production build + full test suite green
- [ ] URL parity script: all 17 old URLs → 200 at same paths on staging
- [ ] Test purchase end-to-end in PayPal **test mode** (no live charges)
- [ ] ~~Launch catalogue approved~~ — descoped; service-only launch
- [ ] All 8 legacy product 301s tested single-hop to service/content destinations
- [ ] Map-update service intake → quote → payment flow tested end-to-end in sandbox
- [ ] Shipping/tax/refund rules match policy pages
- [ ] Mobile + desktop QA pass; Lighthouse ≥ 90 perf/a11y/SEO
- [ ] Security review: no secrets in repo, admin routes protected, webhook signature verification
- [ ] Rollback plan: DNS repoint to Hostinger (kept alive 30 days)
- [ ] Search Console: old property verified, new sitemap submitted
- [ ] Owner sign-off on content (prices, policies, map-version claims)

## Immediate next actions (awaiting owner input)

1. Owner confirms **service-only pivot** (catalogue descoped — no verified NA GPS supplier; revisit only if Doba/CWR/Petra/Canadian B2B verification succeeds).
2. Owner confirms **PayPal Business** account status and approves PayPal-only launch for service invoices.
3. Owner decisions from `PHASE_2_DECISIONS_REQUIRED.md` §B relevant to service (service price, tax, refund policy).
4. Hostinger export still useful for **content** (page copy, FAQs, policies) — product data no longer needed.
5. On receipt: build service intake → eligibility → quote → PayPal invoice → tracking flows in tested increments.


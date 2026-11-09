# GPSLane.com — Implementation Roadmap

Phase 1 (audit) and Phase 2 (architecture) are complete — see `PROJECT_AUDIT.md`, `PHASE_2_ARCHITECTURE.md` and the Phase 2/3 design docs. **Revised strategy:** own-brand catalogue sourced via owner's CJdropshipping account (not the 7 Hostinger products), map-update service as co-equal business line, **PayPal-only** payments, Drizzle ORM via Payload adapter. Each step lists deliverables and its release gate. Nothing deploys to production without explicit approval.

## Phase 2 — Architecture proposal (next, before any code)

**Recommended stack:** Next.js (App Router) + TypeScript + Tailwind CSS on Vercel, as specified in the brief. The empty repo provides no reason to deviate.

**Commerce backend decision — RESOLVED:** custom Next.js storefront + **PayPal-only** at launch (Stripe path retained behind `PaymentProvider` interface, disabled). Orders in Postgres (Neon). Catalogue is **new, CJdropshipping-sourced** — see `CJ_PRODUCT_SOURCING_PLAN.md`, `PRODUCT_CATALOGUE_TAXONOMY.md`, `PRODUCT_SELECTION_SCORECARD.md`.

**Deliverables for Phase 2 doc (`docs/ARCHITECTURE.md`):** data flow, route map, product/content models, admin auth boundary, fulfilment design, env-var list, testing/deploy strategy.

## Phase 3 — SEO & URL preservation (built into every page from day one)

- 11 content/policy URLs + DIY guide preserved 1:1 (see `URL_MIGRATION_MATRIX.md` §A).
- 8 legacy product URLs → documented 301s to relevant new catalogue destinations (§B) — targets finalized when launch catalogue approved.
- New PDPs at `/product/[slug]`; category pages at `/shop/[category]`.
- Metadata/canonical/sitemap/robots/JSON-LD per `SEO_CONTENT_ARCHITECTURE.md` (updated for new routes).
- Content port: DIY guide (slug frozen), 18 FAQs, 4 policy pages, about, contact — with corrections listed in `PHASE_2_DECISIONS_REQUIRED.md` §B7.

## Phase 4 — Design & UX

- Design system: deep navy + white + electric-blue accent, premium automotive aesthetic; reusable component library (nav, footer, product card, PDP gallery, forms, badges).
- Pages: `/`, `/shop`, 7 PDPs (dynamic `[slug]` route preserving exact slugs), `/gps-maps-updates`, `/how-to-update-gps-maps-diy-guide`, `/about-us`, `/contact`, `/frequently-asked-questions-faqs`, 4 policy pages, cart drawer, `/checkout`, order-confirmation.
- Homepage must clearly split "Buy a GPS device" vs "Update my existing GPS" paths.
- Discovery tools (device finder, compatibility checker) **only if** backed by real data — otherwise ship as curated content, not fake tools.
- Accessibility + performance budgets enforced via lint rules and Lighthouse CI.

## Phase 5 — Commerce & fulfilment

1. **CJ sourcing pipeline**: API client (verified endpoints only), product staging/import screen, scorecard computation, owner review queue → curated launch catalogue (8–12 products target).
2. Product catalogue in DB: categories (10-taxonomy), products, variants, supplier mappings, per-destination shipping data, USD+CAD prices, branding tier metadata.
3. Cart (client state) → checkout (PayPal Orders v2) → webhook-verified order creation → order record + audit log.
4. Order states: paid → processing → fulfilment_submitted → shipped → delivered; cancellation/refund flows per verified policy (7-day returns, 24h cancel, PayPal refund path).
5. Fulfilment adapter: `FulfilmentProvider` → `CJProvider` (primary, once API key verified) + `ManualProvider` fallback + `MockProvider` (dev). Never real orders in dev.
6. Map-update service pipeline: intake steps → eligibility rules → human review → PayPal invoice → status tracking (`MAP_UPDATE_SERVICE_WORKFLOW.md`).
7. Notifications: order confirmation, shipping/tracking emails (Resend).
8. Forms: contact + service intake → DB + email notification.
9. Admin: Payload admin — orders, fulfilment queue, sourcing review, service requests, content, SEO, coupons, reviews moderation, settings, users/roles, activity logs.

## Phase 6 — Quality & release gates

Per-step gates: lint + typecheck + unit tests + `next build` green; a11y/SEO review; commit per step.

**Go/no-go checklist (pre-launch):**
- [ ] Production build + full test suite green
- [ ] URL parity script: all 17 old URLs → 200 at same paths on staging
- [ ] Test purchase end-to-end in Stripe/PayPal **test mode** (no live charges)
- [ ] CJdropshipping integration verified in sandbox/test mode (or manual-queue fallback documented)
- [ ] PayPal sandbox checkout end-to-end (no live charges)
- [ ] Launch catalogue approved via scorecard review (8–12 products, USD+CAD priced)
- [ ] All 8 legacy product 301s tested single-hop to relevant destinations
- [ ] Map-update service intake → quote → payment flow tested end-to-end in sandbox
- [ ] Shipping/tax/refund rules match policy pages
- [ ] Mobile + desktop QA pass; Lighthouse ≥ 90 perf/a11y/SEO
- [ ] Security review: no secrets in repo, admin routes protected, webhook signature verification
- [ ] Rollback plan: DNS repoint to Hostinger (kept alive 30 days)
- [ ] Search Console: old property verified, new sitemap submitted
- [ ] Owner sign-off on content (prices, policies, map-version claims)

## Immediate next actions (awaiting owner input)

1. Owner provides **CJdropshipping API key** (CJ dashboard → API section) — unblocks product verification, real catalogue pull, and fulfilment adapter.
2. Owner confirms **PayPal Business** account status and approves PayPal-only launch.
3. Owner decisions from `PHASE_2_DECISIONS_REQUIRED.md` §B (CAD pricing, tax, SKUs, inventory policy, tracker legal review, service price).
4. Hostinger export still useful for **content** (page copy, FAQs, policies) — product data no longer needed.
5. On receipt: scaffold the app (Payload+Drizzle+Neon), build catalogue + service foundations in tested increments.

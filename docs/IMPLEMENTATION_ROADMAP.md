# GPSLane.com — Implementation Roadmap

Phase 1 (audit) is complete — see `PROJECT_AUDIT.md`. This roadmap covers Phases 2–6. Each step lists deliverables and its release gate. Nothing deploys to production without explicit approval.

## Phase 2 — Architecture proposal (next, before any code)

**Recommended stack:** Next.js (App Router) + TypeScript + Tailwind CSS on Vercel, as specified in the brief. The empty repo provides no reason to deviate.

**Commerce backend decision — required before implementation:**

| Option | Pros | Cons |
|---|---|---|
| **A. Custom Next.js + Stripe** (recommended) | Full control, best DX, hosted card fields (PCI SAQ-A), supports PayPal alongside | Must build admin/order management; fulfilment integration is ours to write |
| B. Retain WooCommerce headless | Mature order admin, plugins | Brief's "WordPress" assumption was wrong — there is no WooCommerce to retain; adds a second runtime to host/secure |
| C. Shopify headless / Buy Button | Fastest commerce, proven checkout | Monthly cost, less control over URL structure, theming constraints |
| D. Keep Hostinger store, rebuild frontend only | Zero commerce migration risk | Hostinger builder doesn't offer a headless/API storefront path — effectively impossible |

**Recommendation: Option A** — custom storefront + Stripe (cards) + PayPal (to match existing customer expectations), with orders written to Postgres (Neon/Supabase/Vercel Postgres) and fulfilment handled by a CJdropshipping integration layer — **contingent on owner confirming the CJ workflow** (see open question below).

**Open question blocking commerce design:** Does CJdropshipping actually hold these products, and how do orders reach it today? Options once confirmed:
- CJ Open API order push + polling for tracking (documented endpoints only).
- Manual fulfilment queue (admin marks order → CSV export for CJ) as an interim step.

**Deliverables for Phase 2 doc (`docs/ARCHITECTURE.md`):** data flow, route map, product/content models, admin auth boundary, fulfilment design, env-var list, testing/deploy strategy.

## Phase 3 — SEO & URL preservation (built into every page from day one)

- Route structure mirrors the 17-URL inventory 1:1.
- Metadata/canonical/sitemap/robots/JSON-LD implemented per `SEO_MIGRATION_PLAN.md` §3.
- Redirect map for any dropped URL (expected: none).
- Content port: DIY guide (slug frozen), 18 FAQs, 4 policy pages, about, contact.

## Phase 4 — Design & UX

- Design system: deep navy + white + electric-blue accent, premium automotive aesthetic; reusable component library (nav, footer, product card, PDP gallery, forms, badges).
- Pages: `/`, `/shop`, 7 PDPs (dynamic `[slug]` route preserving exact slugs), `/gps-maps-updates`, `/how-to-update-gps-maps-diy-guide`, `/about-us`, `/contact`, `/frequently-asked-questions-faqs`, 4 policy pages, cart drawer, `/checkout`, order-confirmation.
- Homepage must clearly split "Buy a GPS device" vs "Update my existing GPS" paths.
- Discovery tools (device finder, compatibility checker) **only if** backed by real data — otherwise ship as curated content, not fake tools.
- Accessibility + performance budgets enforced via lint rules and Lighthouse CI.

## Phase 5 — Commerce & fulfilment

1. Product catalogue import (from Hostinger export/CSV) into DB; seed script preserves slugs, prices, images (re-hosted).
2. Cart (client state) → checkout (Stripe Payment Element / PayPal Buttons) → webhook-verified order creation → order record + audit log.
3. Order states: paid → processing → fulfilled → shipped (+tracking) → delivered; cancellation/refund flows per verified policy (7-day returns, 24h cancel, PayPal refund path).
4. Fulfilment adapter interface: `FulfilmentProvider` with CJdropshipping implementation once credentials/API access confirmed; manual-queue fallback.
5. Notifications: order confirmation, shipping/tracking emails (transactional provider e.g. Resend/Postmark).
6. Forms: map-update request + contact form → DB + email notification to `info@gpslane.com`.
7. Admin: minimal protected area (auth via e.g. NextAuth/Auth.js or Clerk) for orders, refunds, fulfilment status. Secrets in env vars only.

## Phase 6 — Quality & release gates

Per-step gates: lint + typecheck + unit tests + `next build` green; a11y/SEO review; commit per step.

**Go/no-go checklist (pre-launch):**
- [ ] Production build + full test suite green
- [ ] URL parity script: all 17 old URLs → 200 at same paths on staging
- [ ] Test purchase end-to-end in Stripe/PayPal **test mode** (no live charges)
- [ ] CJdropshipping integration verified in sandbox/test mode (or manual-queue fallback documented)
- [ ] Shipping/tax/refund rules match policy pages
- [ ] Mobile + desktop QA pass; Lighthouse ≥ 90 perf/a11y/SEO
- [ ] Security review: no secrets in repo, admin routes protected, webhook signature verification
- [ ] Rollback plan: DNS repoint to Hostinger (kept alive 30 days)
- [ ] Search Console: old property verified, new sitemap submitted
- [ ] Owner sign-off on content (prices, policies, map-version claims)

## Immediate next actions (awaiting owner input)

1. Owner confirms fulfilment reality: CJdropshipping vs. AliExpress vs. manual — **this gates Phase 2 commerce design**.
2. Owner provides Hostinger product/order/form export or dashboard access.
3. Owner provides: PayPal/Stripe merchant decision, DNS registrar access, Search Console access, brand assets (logo files), real social URLs.
4. On receipt: write `docs/ARCHITECTURE.md`, then scaffold the Next.js app.

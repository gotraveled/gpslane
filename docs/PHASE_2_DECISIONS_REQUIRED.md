# GPSLane — Phase 2/3: Decisions Required Before Implementation

> **Revision note (new product strategy):** the 7 Hostinger products are NOT being migrated — the catalogue is rebuilt from the owner's CJdropshipping account (`CJ_PRODUCT_SOURCING_PLAN.md`). Payments are **PayPal-only** at launch. Drizzle ORM is confirmed (via Payload adapter). Items A3/A4 (Hostinger product/order/image export) are downgraded — still useful for page content only. New blockers: CJ API key, launch-catalogue approval, tracker legal review, CAD pricing, service price confirmation.

Every item classified: **[CONFIRMED]** already decided · **[REC]** our recommendation awaiting sign-off · **[PENDING]** owner must decide/provide · **[BLOCKED]** cannot proceed without external access/credentials.

## A. Blocking decisions (must resolve before Phase 3 scaffold)

| # | Decision | Class | Detail |
|---|---|---|---|
| A1 | **Fulfilment reality** | [BLOCKED] | Confirm whether CJdropshipping is actually used, holds these products, and how orders reach it today. Site copy says "AliExpress partners" + manual forwarding. Determines whether `CJProvider` is built at all. |
| A2 | **CJdropshipping credentials + docs access** | [BLOCKED] | CJ account API key, or confirmation none exists. Until then: MockProvider (dev) + ManualProvider (prod fallback) ship regardless. |
| A3 | **Hostinger data export** | [BLOCKED] | Dashboard access or CSV export of: 7 products (full descriptions/specs/prices/images/stock), all historical orders, form submissions (map-update leads = revenue pipeline), coupons, tax/shipping settings. Public scraping recovers product copy only — not orders/customers. |
| A4 | **Product images** | [BLOCKED] | Download all `cdn.zyrosite.com` product/content images before Hostinger plan lapses; confirm licensing to reuse. |
| A5 | **Payment merchants** | [PENDING] | PayPal Business account status (site promises PayPal) + Stripe account eligibility for this business category (GPS devices + map-update services — Stripe restricted-business check needed). |

## B. Business-rule decisions

| # | Decision | Class | Detail |
|---|---|---|---|
| B1 | CAD pricing | [PENDING] | Launch USD-only or provide CAD price list? Schema supports both; no FX conversion assumed. |
| B2 | Tax nexus | [PENDING] | US state / Canada province registration status → determines tax engine (manual table vs Stripe Tax). Default seed: 0% + config flag. **Do not charge tax until confirmed.** |
| B3 | SKUs | [PENDING] | No SKUs exist today. Approve generated scheme (e.g., `GPS-DRIVE7`) or supply real ones — needed for supplier mapping & inventory. |
| B4 | Real inventory quantities | [PENDING] | Current site shows all "InStock" but quantities unknown. Backorder policy? (REC: track stock, allow backorder with honest ETA copy.) |
| B5 | Product taxonomy | [PENDING] | Category structure for 7 products (car/truck/accessories/bundles?). Affects `/shop` filters and URLs (new URLs OK — none are legacy). |
| B6 | Map-update service payment flow | [PENDING] | Confirm $99.99 stays, PayPal invoice/manual payment vs. adding it as a paid checkout "service product". Recommend keeping lead-form → manual invoice (matches current ops). |
| B7 | Content corrections | [PENDING] | Verify before port: "2025 map data" claims, "24/7 support" vs Mon–Sat IST hours, "Live Chat" claim (no widget exists — remove or add real chat), testimonial authenticity, Essentials Bundle $99.99 price (= service price, possible error). |
| B8 | Return/refund authority | [PENDING] | Who can approve refunds — super-admin only or support role too? Partial refunds allowed? |

## C. Technical sign-offs

| # | Decision | Class | Detail |
|---|---|---|---|
| C1 | Payload CMS choice | [REC] | Embedded Payload 3.x = CMS + admin + ORM. Sign off vs. custom admin. |
| C2 | Neon + Vercel Blob + Resend + Inngest + Upstash stack | [REC] | Monthly cost estimate ~$0–25 at launch volume; all have free tiers. |
| C3 | GA4 addition | [REC] | Currently only Google Ads tag exists. Add GA4 property + preserve `AW-17799807671`. Need GA4 account/access. |
| C4 | Search Console | [PENDING] | Provide access to existing GSC property (DNS-verified?) — required for migration monitoring. |
| C5 | Cookie consent/CMP | [PENDING] | Required for GA4/Ads in CA/EU; choose tool (e.g., Cookiebot, Termly) or counsel guidance. |
| C6 | Social profiles | [PENDING] | Real Facebook/Instagram/X URLs — current footer links are placeholders. |
| C7 | Phone number | [PENDING] | Confirm (888) 400-3290 remains active and porting/forwarding plan. |
| C8 | Email domain auth | [PENDING] | SPF/DKIM/DMARC for `gpslane.com` sending domain (order emails via Resend need verified domain). |

## D. Access checklist (owner to provide)

- [ ] Hostinger Website Builder dashboard (products, orders, forms, settings export)
- [ ] Domain registrar access (DNS cutover)
- [ ] Vercel account/team access
- [ ] Neon account (or approve Vercel Marketplace provisioning)
- [ ] Stripe + PayPal merchant dashboards
- [ ] CJdropshipping account (if it exists)
- [ ] Google Ads account (AW-17799807671) + GA4/Search Console properties
- [ ] Resend/Upstash/Inngest/Sentry account creation (or approve us creating them)
- [ ] Brand assets: logo files (SVG/PNG), brand colors confirmation, product photography originals if available
- [ ] Legal review contact for privacy policy/terms updates naming new processors

## E. Data migration reconciliation checklist (for Phase 3–5 execution)

For each of the 7 products verify parity old→new:

- [ ] slug identical, HTTP 200
- [ ] title + meta description ported
- [ ] price (sale) + compare-at price exact
- [ ] image(s) re-hosted, alt text preserved
- [ ] description content ported (no invented specs)
- [ ] stock status matches verified inventory
- [ ] JSON-LD Product schema validates

For orders/customers: export completeness unknown until Hostinger access granted — historical orders need **not** be migrated into the new system unless owner requires it (DECISION: recommend importing order *history* read-only for support lookup, not re-platforming old orders) [PENDING B-confirm].

## F. What we can start WITHOUT the blockers

Once A-items are at least scheduled, Phase 3 scaffold can begin in parallel: Next.js+Payload+Neon skeleton, all 17 routes with ported content, SEO layer, storefront UI, MockProvider fulfilment, Stripe **test-mode** checkout. Nothing here touches production data or live payments.

## G. Phase 6b decision � catalogue descoped (service-only site)

**DECISION (owner-directed):** after supplier research (GPSLANE_GLOBAL_SUPPLIER_RESEARCH.md, NORTH_AMERICA_SUPPLIER_RESEARCH.md) and the DSers/AliExpress evaluation, no verified NA-warehouse GPS product supplier exists. GPSLane proceeds as a **map-update service website**. The product catalogue is removed from scope; Payload product/supplier collections remain as dormant infrastructure. Legacy product URLs redirect to service/content pages (see updated URL_MIGRATION_MATRIX.md �B). Catalogue may be revived only if a supplier passes account-level verification (Doba, CWR, Petra, Canadian B2B candidates).

Supersedes earlier catalogue-dependent items in �B (SKU scheme, CAD product pricing, tracker legal review, product import). Service-relevant items remain open: service price confirmation, tax/refund policy, PayPal account.


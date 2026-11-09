# GPSLane.com — Phase 1 Project Audit

**Date:** 2026-11-09
**Auditor:** Devin (senior engineering audit)
**Scope:** Repository inspection + live production site inspection (https://www.gpslane.com)

---

## 1. Executive summary

| Area | Finding |
|---|---|
| Repository | **Empty.** Fresh `main` branch, zero commits, zero files. No prior implementation exists. |
| Production platform | **Hostinger Website Builder** (Zyro/Hostinger stack, `X-Powered-By: HostingerWebsiteBuilder`, assets on `cdn.zyrosite.com`). **Not WordPress and not WooCommerce**, despite the project brief stating WordPress. |
| Commerce | Hostinger Website Builder native e-commerce (store ID `store_01K9MZQ8TNAA0HZ16538GDPKAX`). 7 products, USD pricing, sale/compare-at pricing, "Add to bag", `/checkout` route (HTTP 200), `/cart` returns 404. |
| Fulfilment | Site copy states orders are "forwarded to our shipping partner" and sourced from "verified international suppliers, including **AliExpress partners**". After-sales team located in Mohali, Punjab, India. **No evidence of CJdropshipping anywhere on the site.** |
| Map-update service | Manual, phone-assisted service at a flat **$99.99 USD** via PayPal invoice after a compatibility call. Driven by on-site request forms (Hostinger form tokens). |
| Analytics | Single Google tag: **Google Ads `AW-17799807671`** (gtag.js) injected site-wide. **No GA4 measurement ID found.** |
| SEO | Custom `sitemap.xml` with 17 URLs; self-referencing canonicals; Product JSON-LD on product pages; clean 404s; apex → www 301. `/shop` product grid is client-rendered only (no product links in static HTML). |
| Support claims | Site repeatedly claims "Live Chat available on Gpslane.com" — **no chat widget was detected** in page source. Likely aspirational copy. |

**Critical correction to the brief:** the production site is a Hostinger Website Builder site, not WordPress/WooCommerce. There is no WP admin, no WooCommerce REST API, and no plugin surface to migrate from. This *simplifies* the migration (no WP data export needed) but means **all commerce data lives inside Hostinger's proprietary store backend** and must be extracted manually or via export.

---

## 2. Repository audit

- `git log`: no commits. `git status`: clean, empty tree.
- No `package.json`, no source files, no config, no `.env.example`, no tests, no CI, no deployment config.
- **Conclusion:** this is a greenfield codebase. Everything in Phases 2–6 will be built from scratch. The "existing GitHub repository" is an empty shell created for this project.

## 3. Production platform evidence

Evidence collected from raw HTML of 16 pages (saved during audit, since removed):

- `<meta name="generator" content="Hostinger Website Builder">` on every page.
- Response headers: `Server: hcdn`, `x-hcdn-cache-status: DYNAMIC`, `X-Powered-By: HostingerWebsiteBuilder`, `platform: hostinger`.
- Assets served from `cdn.zyrosite.com` / `assets.zyrosite.com`; images via `cdn.zyrosite.com/cdn-ecommerce/store_01K9MZQ8TNAA0HZ16538GDPKAX/...`.
- Framework: Astro-based SSR (`astro-island`, `astro-slot` custom elements in markup).
- Security headers present: HSTS preload, `X-Content-Type-Options: nosniff`, `X-XSS-Protection`, CSP limited to `frame-ancestors` for builder previews. `Cache-Control: public, max-age=3600`.
- `robots.txt`: `Sitemap: https://www.gpslane.com/sitemap.xml`, empty `Disallow:` (allow all).

## 4. URL inventory (from live `sitemap.xml`, 17 URLs)

| URL | Type | Notes |
|---|---|---|
| `/` | Home | Priority 1.0 |
| `/shop` | Shop index | Product grid is JS-rendered; no product anchors in HTML |
| `/gps-maps-updates` | Service landing | Map-update request form + pricing ($99.99) |
| `/about-us` | Content | Mentions AliExpress sourcing |
| `/contact` | Contact | Hostinger form (name/email/message) |
| `/frequently-asked-questions-faqs` | Content | 18 Q&As — valuable SEO content |
| `/shipping-and-returns` | Policy | Processing 2–5 days, delivery 10–20 days, 7-day returns, PayPal refunds |
| `/terms-and-conditions` | Policy | |
| `/privacy-policy` | Policy | |
| `/disclaimer` | Policy | |
| `/how-to-update-gps-maps-diy-guide` | Article | **Mandatory preserved slug** |
| 7 × `/gpslane-*` product pages | Products | See COMMERCE_INTEGRATION_AUDIT.md |

Full detail: `docs/EXISTING_URL_INVENTORY.md`.

## 5. Key risks and dependencies

1. **CJdropshipping claim is unverified.** Site copy describes AliExpress-partner sourcing and in-house forwarding ("we verify your order… and forward your order to our shipping partner"). There is no CJdropshipping code, webhook, or documentation reference visible. **Owner must confirm where CJdropshipping actually fits** — possibly orders are manually placed in CJ after a Hostinger sale, or the claim in the brief is aspirational.
2. **Product data lock-in.** Prices, SKUs, images, and stock live in Hostinger's proprietary e-commerce backend. No public API is known; an export/CSV or manual capture is required before the Hostinger subscription lapses.
3. **Checkout/payment opacity.** Site copy promises PayPal-only, but Hostinger checkout (`/checkout`) likely supports its own payment stack (Stripe/PayPal express). Actual enabled methods must be confirmed in the Hostinger dashboard.
4. **Form handling.** Contact and map-update forms are Hostinger-hosted forms with opaque tokens; submissions presumably email `info@gpslane.com`. Replacement requires a forms backend (e.g., Resend + DB, or a service like Formspree).
5. **No GA4.** Only a Google Ads conversion tag exists. Baseline analytics are essentially absent — recommend adding GA4 + preserving the AW- tag.
6. **"Live Chat" copy is unsupported** by any detected widget — do not carry the claim forward unless a real chat tool is added.
7. **Placeholder social links** (`facebook.com/`, `instagram.com/`, `twitter.com/` root URLs) — should be replaced with real profiles or removed.
8. **Map-update service is human-delivered.** It cannot be "integrated" like a product; the new site needs a request form → CRM/email pipeline → manual fulfilment workflow. Automating it would misrepresent the service.
9. **Em-dash/mojibake artifacts** in content (encoding issues in policy pages) — content needs cleanup during migration.

## 6. Proposed resolution sequence

See `docs/IMPLEMENTATION_ROADMAP.md`. Summary: audit export → Next.js scaffold → content/pages parity → product catalogue import → cart/checkout (decision: Stripe vs. retain PayPal) → forms/notifications → CJdropshipping fulfilment integration (pending owner confirmation) → SEO cutover with redirect map → staged launch.

## 7. Information still required from the owner

- Confirmation of the actual fulfilment workflow (CJdropshipping? AliExpress? manual?) and access to the CJdropshipping account/API credentials.
- Hostinger dashboard access or product/order CSV export.
- Payment provider decision and merchant account details (PayPal business account? Stripe?).
- Domain/DNS registrar access for cutover planning.
- Real social profile URLs, logo/brand assets, and any existing GA4/Search Console properties.
- Whether the $99.99 map-update service and phone number (888) 400-3290 remain the supported channels.

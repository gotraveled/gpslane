# GPSLane — URL Migration Matrix

Supersedes the "all 17 URLs preserved" assumption for **product pages only**. The original 7 Hostinger products are NOT the target catalogue — their URLs may change. Every removal/change gets a documented one-to-one 301 to a *relevant* replacement, never the homepage, never an unrelated product.

## A. Frozen / preserved URLs (HTTP 200, identical path)

| Legacy URL | Disposition | New implementation |
|---|---|---|
| `/` | PRESERVE | `app/(storefront)/page.tsx` |
| `/shop` | PRESERVE | `shop/page.tsx` — SSR product grid (fixes JS-only defect) |
| `/gps-maps-updates` | PRESERVE | service landing + new intake flow |
| `/about-us` | PRESERVE | `pages` slug `about-us` |
| `/contact` | PRESERVE | `pages` slug `contact` + form |
| `/frequently-asked-questions-faqs` | PRESERVE | structured FAQ repeater |
| `/shipping-and-returns` | PRESERVE | `pages` slug `shipping-returns` (update copy: CJ fulfilment, PayPal-only confirmed) |
| `/terms-and-conditions` | PRESERVE | `pages` slug `terms` |
| `/privacy-policy` | PRESERVE | `pages` slug `privacy` (update processors list) |
| `/disclaimer` | PRESERVE | `pages` slug `disclaimer` |
| `/how-to-update-gps-maps-diy-guide` | **PRESERVE — mandatory** | `articles` slug identical; content upgraded, slug/content value/internal links kept |

## B. Legacy product URLs — redirect matrix

**Phase 6b update:** catalogue descoped — GPSLane is a map-update service site. No `/shop` or PDP destinations exist. All 8 legacy product URLs 301 to the closest *content* destination: `/gps-maps-updates` (service page) for device/navigation products, `/how-to-update-gps-maps-diy-guide` for accessory/bundle items, or `/frequently-asked-questions-faqs` where topical. These targets are final unless the catalogue is revived.

| Legacy URL | Product (old) | 301 target | Rationale | SEO value note |
|---|---|---|---|---|
| `/gpslane-drive-7-hd-gps-navigation-unit` | 7" car GPS | `/gps-maps-updates` | device owners need map updates — core service | was indexed; equity flows to service page |
| `/gpslane-compact-5-car-gps-navigator` | 5" car GPS | `/gps-maps-updates` | same | same |
| `/gpslane-premium-car-gps-unit-8` | 8" car GPS | `/gps-maps-updates` | same | same |
| `/gpslane-navigator-travel-edition-gps-unit` | travel GPS | `/gps-maps-updates` | same | same |
| `/gpslane-truckpro-9-wide-gps-navigator` | truck GPS | `/gps-maps-updates` | truck/RV devices are a service segment | same |
| `/gpslane-fleettracker-pro-gps-device` | fleet tracker | `/frequently-asked-questions-faqs` | tracker category excluded (compliance); FAQ covers device questions | lowest relevance — monitor GSC |
| `/gpslane-navigator-essentials-bundle` | bundle | `/how-to-update-gps-maps-diy-guide` | accessories → DIY guide mentions mounts/storage | lowest value; verify GSC impressions before deciding 301 vs. let expire |
| `/gpslane-accessory-kit-car-mount-and-32gb-microsd` | mount+SD kit | `/how-to-update-gps-maps-diy-guide` | guide covers mounts/microSD for updates | could redirect to `/contact` if guide lacks accessory content |

**Rules:**
- No product PDPs exist — every product URL redirects to the most relevant service/content page (never `/`).
- If the catalogue is revived later, revisit targets per original matrix.
- All redirects 301, single hop, implemented via `seo_redirects` collection + edge middleware; tested pre-launch.
- Keep a `URL_MIGRATION_MATRIX` export for Search Console monitoring.

## C. New URL surface (no legacy equity, designed freely)

- `/shop/[category]` — 10 category pages (launch only active ones)
- `/product/[slug]` or root-level product slugs? **Decision:** new products get `/product/[slug]` prefix to avoid root-namespace collisions and future-proofing — root `[slug]` catch-all is NOT used for new products. Wait — legacy PDPs were root-level; since they all redirect anyway, new PDPs at `/product/[slug]` is cleaner. [REC]
- `/gps-update-check` or intake embedded in `/gps-maps-updates` (step flow, not separate indexable pages)
- `/account/*`, `/checkout`, `/order-confirmation/*` — noindex
- Future articles: `/guides/[slug]` or `/blog/[slug]` — decide when second article exists [PENDING]

## D. Redirect implementation & testing

- `seo_redirects` collection (fromPath, toPath, 301, enabled) + generated `next.config` redirects at build + middleware fallback.
- Pre-launch test: script iterates all 18 legacy URLs → asserts 301→200 chains resolve in ≤1 hop to 200.
- Post-launch: monitor 404s in Vercel logs + GSC Coverage; any missed legacy URL (from backlinks not in sitemap) discovered via log review gets a redirect added.
- Sitemap contains ONLY new canonical indexable URLs.

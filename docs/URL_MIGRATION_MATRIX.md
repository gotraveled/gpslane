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

New catalogue is CJ-sourced; slugs will be new. For each legacy product URL, choose the closest relevant destination once the launch catalogue is approved. **Redirect targets below are placeholders pending catalogue approval** — final targets must be genuinely related (same product type), never `/`.

| Legacy URL | Product (old) | Proposed 301 target | Rationale | SEO value note |
|---|---|---|---|---|
| `/gpslane-drive-7-hd-gps-navigation-unit` | 7" car GPS | `/shop/automotive-gps` or closest new car navigator PDP | same product type | was indexed; preserve via category or like-for-like PDP |
| `/gpslane-compact-5-car-gps-navigator` | 5" car GPS | `/shop/automotive-gps` or compact PDP | same | same |
| `/gpslane-premium-car-gps-unit-8` | 8" car GPS | `/shop/automotive-gps` or large-screen PDP | same | same |
| `/gpslane-navigator-travel-edition-gps-unit` | travel GPS | `/shop/portable-gps` | portable/use-case match | same |
| `/gpslane-truckpro-9-wide-gps-navigator` | truck GPS | `/shop/truck-rv-gps` (if launched) else `/shop/automotive-gps` | vehicle-type match | same |
| `/gpslane-fleettracker-pro-gps-device` | fleet tracker | `/shop/trackers` (if legal review passes) else `/shop` | closest category | same |
| `/gpslane-navigator-essentials-bundle` | bundle | `/shop` or mounts/accessories category | bundle concept → accessories | lowest value; verify GSC impressions before deciding 301 vs. let expire |
| `/gpslane-accessory-kit-car-mount-and-32gb-microsd` | mount+SD kit | `/shop/mounts-holders` or storage-connectivity | split: mount + storage both exist as categories | could map to a new equivalent accessory PDP if one launches |

**Rules:**
- Prefer a specific relevant PDP over a category page when a like-for-like product exists in the new catalogue.
- If a legacy product's category doesn't exist in the new taxonomy (e.g., trackers not launched), redirect to parent `/shop` or nearest active category — document each exception.
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

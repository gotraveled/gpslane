# GPSLane.com — Existing URL Inventory

**Captured:** 2026-11-09 from live `https://www.gpslane.com/sitemap.xml` (17 URLs) and direct page fetches.
**Status codes** verified with `curl` where noted. All paths are lowercase, no trailing slashes, no query parameters observed.

## Canonical rules observed

- Canonical host: `https://www.gpslane.com` (www).
- `https://gpslane.com/` → 301 → `https://www.gpslane.com/`
- `http://www.gpslane.com/` → 301 → `https://www.gpslane.com/`
- Unknown paths return a real **404** (verified `/nonexistent-page-xyz`, `/cart`).
- Each page emits a self-referencing `<link rel="canonical">` and `og:url` matching its URL.
- `hreflang="x-default"` present on pages (no regional variants).

## Inventory

### Core pages

| URL | Title (approx.) | Indexable | Notes |
|---|---|---|---|
| `/` | STAY ON THE RIGHT LANE WITH GPSLANE | Yes (priority 1.0) | Hero, services, map-update CTA, shop CTA, contact form, testimonial |
| `/shop` | Shop | Yes | **Product grid renders client-side only** — static HTML contains no product links. SEO risk. |
| `/gps-maps-updates` | GPS MAP UPDATES FOR USA & CANADA | Yes | Service landing; request form (name, email, GPS model/SN, phone); $99.99 pricing; 4-step process |
| `/about-us` | About Us | Yes | Company story; states AliExpress-partner sourcing |
| `/contact` | Contact Us | Yes | Phone, email, address (Mohali, India), hours Mon–Sat 9–7 IST; Hostinger form |
| `/frequently-asked-questions-faqs` | Frequently Asked Questions | Yes | 18 Q&As covering service, shipping, payment, returns, data |

### Policy / legal pages

| URL | Purpose |
|---|---|
| `/shipping-and-returns` | Processing 2–5 biz days; delivery 10–20 biz days; free shipping US/CA only; 7-day returns; refunds 5–10 biz days; cancel within 24h pre-shipment; duties buyer responsibility |
| `/terms-and-conditions` | Terms of service |
| `/privacy-policy` | Privacy policy |
| `/disclaimer` | Liability disclaimer (important: GPS/map-update service disclaimers) |

### Educational content

| URL | Purpose | Priority |
|---|---|---|
| `/how-to-update-gps-maps-diy-guide` | 6-step DIY GPS map update guide | **Mandatory — slug must not change** |

### Product pages (7)

| URL | Product | JSON-LD price (USD) | Compare-at shown | Stock |
|---|---|---|---|---|
| `/gpslane-drive-7-hd-gps-navigation-unit` | Gpslane Drive 7" HD GPS Navigation Unit | 159.99 | 189.99 | InStock |
| `/gpslane-accessory-kit-car-mount-and-32gb-microsd` | Gpslane Accessory Kit — Car Mount & 32GB MicroSD | 89.99 | 99.99 | InStock |
| `/gpslane-compact-5-car-gps-navigator` | Gpslane Compact 5" Car GPS Navigator | 149.99 | 179.99 | InStock |
| `/gpslane-navigator-travel-edition-gps-unit` | Gpslane Navigator Travel Edition GPS Unit | 149.99 | 192.99 | InStock |
| `/gpslane-premium-car-gps-unit-8` | Gpslane Premium Car GPS Unit 8" | 179.99 | 219.99 | InStock |
| `/gpslane-fleettracker-pro-gps-device` | Gpslane FleetTracker Pro GPS Device | 259.99 | 299.99 | InStock |
| `/gpslane-navigator-essentials-bundle` | Gpslane Navigator Essentials Bundle | 99.99 | 138.99 | InStock |
| `/gpslane-truckpro-9-wide-gps-navigator` | Gpslane TruckPro 9" Wide GPS Navigator | 229.99 | 299.99 | InStock |

All product pages emit `Product` JSON-LD with `offers.price`, `priceCurrency: usd`, `availability: InStock`, and a CDN image. No SKU, brand, or aggregateRating in structured data. Product descriptions are marketing copy (~2–3 sentences); detailed specs were not exposed in static HTML and must be captured from the Hostinger dashboard or product editor.

### Functional routes (not in sitemap)

| URL | Behavior |
|---|---|
| `/checkout` | HTTP 200 — Hostinger checkout entry |
| `/cart` | 404 (cart is likely a modal/drawer, not a page) |
| Any other path | 404 |

## Redirect/behavior notes

- No redirect chains observed on canonical URLs; all sitemap URLs return 200 directly.
- Trailing-slash behavior not fully tested; verify `/<path>/` variants during migration and normalize to the no-trailing-slash convention (or match whatever the new stack emits — pick one and 301 the other).
- Query strings: none observed in sitemap; cart/checkout may use them — preserve functionality, not indexation.

## Migration requirements derived from this inventory

1. All 17 URLs above should return **HTTP 200 at the identical path** post-launch.
2. `/how-to-update-gps-maps-diy-guide` is non-negotiable.
3. `/shop` must render product links in server-side HTML (fixes existing SEO deficiency).
4. New XML sitemap must contain only canonical, indexable URLs (exclude cart/checkout/account).
5. Preserve: page titles, meta descriptions (captured per page during build), canonicals, Product JSON-LD, internal linking structure (header nav + footer link set).
6. Content to port verbatim-ish: FAQ answers, shipping/returns terms, disclaimer, DIY guide body (improve layout, keep slug and facts; do not add unverified map-version claims).

# GPSLane — SEO & Content Architecture

## 1. Route migration specification — all 17 indexable URLs

Routing rule: static App Router segments for content pages; `[slug]` resolves **products only**. Every row below returns **HTTP 200 at the identical path** — zero redirects for kept URLs.

| # | Legacy URL | New route | Content source | Schema |
|---|---|---|---|---|
| 1 | `/` | `app/(storefront)/page.tsx` | `pages` collection, slug `home` | Organization+WebSite, WebPage |
| 2 | `/shop` | `shop/page.tsx` | Product grid (SSR — fixes current JS-only defect) | CollectionPage+ItemList |
| 3 | `/gps-maps-updates` | `gps-maps-updates/page.tsx` | `pages` slug `gps-maps-updates` | Service + FAQPage (service Q&As) |
| 4 | `/about-us` | `about-us/page.tsx` | `pages` slug `about-us` | AboutPage |
| 5 | `/contact` | `contact/page.tsx` | `pages` slug `contact` + enquiry form | ContactPage |
| 6 | `/frequently-asked-questions-faqs` | `frequently-asked-questions-faqs/page.tsx` | `pages` slug `faqs` — 18 Q&As as structured repeater | FAQPage |
| 7 | `/shipping-and-returns` | `shipping-and-returns/page.tsx` | `pages` slug `shipping-returns` | WebPage |
| 8 | `/terms-and-conditions` | `terms-and-conditions/page.tsx` | `pages` slug `terms` | WebPage |
| 9 | `/privacy-policy` | `privacy-policy/page.tsx` | `pages` slug `privacy` | WebPage |
| 10 | `/disclaimer` | `disclaimer/page.tsx` | `pages` slug `disclaimer` | WebPage |
| 11 | `/how-to-update-gps-maps-diy-guide` | `how-to-update-gps-maps-diy-guide/page.tsx` | `articles` slug `how-to-update-gps-maps-diy-guide` — **slug frozen** | Article/HowTo + BreadcrumbList |
| 12–18 | 7 × `/gpslane-*` | `[slug]/page.tsx` → product lookup | `products.slug` = exact legacy slug | Product+Offer+BreadcrumbList |

**Functional (non-indexed) routes:** `/checkout`, `/order-confirmation/[orderNumber]`, `/account/*`, `/api/*`, `/admin/*` — all `noindex` via robots + meta.

**Redirects:** `seo_redirects` collection + `next.config` redirects for anything removed. Current expectation: **none needed**. `/cart` → decide 301→`/shop` or leave 404 [REC: leave unimplemented → 404, matching current].

## 2. Metadata system

- `metadataBase = https://www.gpslane.com` in root layout; `alternates.canonical` set per page from the content's `seo.canonical` (defaults to own path).
- Every `pages`/`articles`/`products` record carries `seo` group: `metaTitle`, `metaDescription`, `canonical`, `ogImage`, `noIndex`, `focusKeyword` (editorial hint only).
- Open Graph + Twitter card tags generated via Next `metadata` API; product pages override `og:type`/image.
- Title template: `%s | GPSLane` with per-page overrides matching current titles (inventory doc has them).

## 3. Structured data (JSON-LD, server-rendered)

| Page type | Schema |
|---|---|
| All pages | `BreadcrumbList` (Home → section → page) |
| Home | `Organization` (name, url, logo, contactPoint phone/email), `WebSite` |
| `/shop` | `CollectionPage` + `ItemList` of products |
| PDPs | `Product` (name, image, description, `brand: Gpslane`, `offers`: price, priceCurrency, availability, url) — port current fields, add `sku` once assigned |
| DIY guide | `Article` (headline, datePublished, author Organization, publisher) + `HowTo` for the 6 steps **only if** steps map cleanly — else Article alone |
| FAQ page | `FAQPage` with all 18 Q&As from the structured repeater |
| Service page | `Service` schema |

Rules: only markup for content visibly on the page; no fabricated `aggregateRating`, `gtin`, or author credentials. Validate with Rich Results Test before launch.

## 4. Sitemap & robots

- `app/sitemap.ts`: dynamic — queries published products/pages/articles, emits exactly the 17 URLs (+ any future published content). `lastModified` from `updatedAt`. Excludes checkout/account/api/admin/cart.
- `app/robots.ts`: `Allow: /`, `Disallow: /admin /api /checkout /account /order-confirmation`, `Sitemap: https://www.gpslane.com/sitemap.xml`.
- Preserve `hreflang="x-default"` → www URL (current site emits it; single-locale so it's trivially satisfied).

## 5. Content architecture in CMS

- **`pages` collection**: slug, title, Lexical rich text body (supports headings, images w/ alt, CTA blocks, accordions for FAQs), `seo` group, `showInNav`/`footer` flags, `template` enum (default/service/contact/policy) driving layout variants.
- **`articles` collection**: slug, title, body, `publishedAt`, `author` (Organization attribution — no invented personal authors), `seo`, `relatedProducts` relationship, `ctaBlock` (e.g., link to `/gps-maps-updates` on the DIY guide).
- **Content blocks**: reusable Lexical blocks + a small set of custom blocks (CTA banner, product card embed, FAQ repeater, comparison table) — keeps pages editable without code.
- **Internal linking**: header nav (Home/Shop/Gps Maps Updates/About/Contact) + footer link set ported verbatim from current site; breadcrumbs on all interior pages; contextual links inside article body preserved.

## 6. Image & media rules

- All product/article images re-hosted to Vercel Blob (download from `cdn.zyrosite.com` before Hostinger lapses — see migration checklist).
- `alt` required on every upload (Payload enforced); decorative images get `alt=""`.
- `next/image` everywhere; `sizes` attributes; hero/LCP image `priority`; below-fold `loading="lazy"`.
- OG images: dedicated 1200×630 per page where provided, fallback to branded default.

## 7. Editorial governance

- Owner/editor can publish articles, edit SEO fields, manage redirects — no deploy needed (ISR revalidation on publish via Payload hooks → `revalidatePath`).
- Prohibited content enforced by editorial review, not code: no unverified map-version claims, no manufacturer affiliation claims, no fake reviews/testimonials, no invented specs.
- Existing content flagged for review during port: "2025 map data" claims (verify currency), "24/7 customer service" vs actual Mon–Sat IST hours, "Live Chat available" (no widget — remove or implement), testimonial "Mark T." (verify it's a real customer quote).

## 8. Pre-launch SEO verification (extends migration plan)

1. Crawl parity script old-vs-new sitemap diff = ∅.
2. Per-URL title/meta/canonical diff report (improvements allowed, regressions flagged).
3. JSON-LD validation on 1 page per schema type.
4. Mobile-friendly + CWV lab test; field data baseline via Vercel Analytics + (new) GA4.
5. Search Console: submit sitemap, request indexing on top pages, monitor Coverage weekly × 8 weeks.

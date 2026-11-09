# GPSLane.com — SEO Migration Plan

## 1. Current SEO baseline (measured 2026-11-09)

**Strengths**
- Clean URL structure: 17 lowercase, hyphenated, slash-free paths.
- Self-referencing canonicals + `og:url` on all pages; `hreflang="x-default"`.
- Real 404s for unknown paths; apex and HTTP redirect to `https://www.gpslane.com` in a single hop.
- Product pages carry `Product` JSON-LD with price, currency, availability, image.
- Custom XML sitemap at `/sitemap.xml` listing exactly the intended indexable URLs.
- robots.txt allows all and references the sitemap.

**Weaknesses to fix during migration**
- `/shop` renders no product links in server HTML — product pages are only discoverable via sitemap/direct URL. Fix: SSR product grid.
- Only one analytics tag (Google Ads `AW-17799807671`); no GA4 → weak baseline measurement. Add GA4 before launch.
- FAQ content is present but not marked up with `FAQPage` JSON-LD (verify; add if appropriate — Google now limits FAQ rich results, but markup is still valid).
- Product JSON-LD lacks `sku`, `brand`, `gtin`, `aggregateRating` — add what's truthful (`brand: Gpslane`).
- Image `alt` text exists via `og:image:alt`; verify per-image alt coverage in rebuild.
- Content has mojibake artifacts (e.g., `dY"` sequences from icon fonts leaking into text extraction — likely rendering artifacts, but audit each page visually).

## 2. Non-negotiable URL requirements

| Requirement | Rule |
|---|---|
| `/how-to-update-gps-maps-diy-guide` | **Exact same path, HTTP 200, self-canonical.** Slug is frozen. |
| All 17 sitemap URLs | Return 200 at identical paths; identical or improved titles/meta. |
| Host | `www.gpslane.com` canonical; apex → www 301; HTTP → HTTPS 301. |
| Trailing slashes | Choose one convention (recommend **no trailing slash**, matching current). 301 any variant. |
| Removed URLs | Only if genuinely dropped: one-to-one 301 to the closest relevant page. **Never** blanket-redirect to `/`. Current inventory suggests nothing needs removal. |
| Query strings | Cart/checkout internals may change; ensure no indexed URLs depend on them. |

## 3. Technical SEO checklist for the Next.js build

- `app/sitemap.ts` (or route handler) emitting XML with all canonical indexable URLs only; `lastModified` from content dates.
- `app/robots.ts` → allow all, sitemap reference, disallow `/checkout`, `/cart`, `/account`, `/api/`.
- Per-page `metadata`: unique title, meta description (ported from current pages — captured in inventory), canonical via `metadataBase` + `alternates.canonical`.
- Open Graph + Twitter cards on every page; product pages get `og:type=product`-equivalent via Product JSON-LD.
- JSON-LD: `Organization` + `WebSite` sitewide; `Product` + `Offer` on PDPs; `Article`/`BlogPosting` on the DIY guide; `BreadcrumbList` on all interior pages.
- Semantic HTML: single `h1` per page, logical heading order, descriptive anchors (port current internal links).
- Image optimization: `next/image`, explicit width/height, descriptive alt, `priority` only for LCP hero.
- Performance budget: LCP < 2.5s, INP < 200ms, CLS < 0.1 on 4G/mobile.
- Accessibility: WCAG 2.2 AA — contrast ≥ 4.5:1, visible focus, keyboard nav, `prefers-reduced-motion` support.
- Redirects implemented in `next.config.ts` `redirects()` or edge middleware for anything not 1:1.

## 4. Content preservation rules

- **DIY guide:** keep slug, keep all six steps and the "Important Notes" safety warnings, keep the $99.99 service CTA price only if still accurate. Improve typography/layout; add a sticky "Need it done for you?" CTA module linking to `/gps-maps-updates`. Do **not** add specific map-version claims (e.g., "2025 maps") beyond what current copy states, and flag the existing "2025" references for owner verification.
- **FAQs:** port all 18 Q&As verbatim (fix encoding artifacts); they are the site's strongest informational content.
- **Policies:** port shipping/returns, terms, privacy, disclaimer content; have owner/legal review before launch — these contain business rules (7-day returns, 24h cancellation, 30-day delay remedy) that must match operational reality.
- **Product descriptions:** port existing copy; request full spec sheets from owner/supplier before enriching — no invented specs.

## 5. Pre-launch verification protocol

1. Crawl old sitemap (17 URLs) and new sitemap; diff must be empty for kept URLs.
2. Scripted check: every old URL returns 200 on new site (run against staging with host-header or preview deploy).
3. Validate titles/meta/canonical parity per URL (allow improvements, never regressions to empty/generic).
4. Validate JSON-LD with Rich Results Test on representative pages.
5. Check redirect map: old→new pairs all 301, single hop, correct destination.
6. Submit new sitemap in Google Search Console; keep old property verified (DNS TXT) through cutover.
7. Monitor 4–8 weeks post-launch: Coverage/indexing report, 404 spikes in server logs, ranking changes for brand + "gps map update" queries.

## 6. Cutover & rollback plan

- Lower DNS TTL to 300s ≥ 48h before cutover.
- Deploy Next.js to Vercel (or equivalent) on `www.gpslane.com`; keep Hostinger site intact but unreachable during soak period.
- Rollback = repoint DNS to Hostinger (kept live, not deleted) — **do not delete the WordPress/Hostinger installation** until 30 days post-launch and owner sign-off.
- Keep the AW-17799807671 tag firing identically pre/post launch to preserve Google Ads conversion history.

## 7. Honest expectations

A domain + URL-preserving migration typically retains most rankings, but **no guarantee can be made** that positions, traffic, or indexing remain unchanged. Google's own guidance: keep content, URLs, internal links, and structured data stable; expect a re-crawl period of days–weeks. The monitoring plan above is the verifiable mechanism.

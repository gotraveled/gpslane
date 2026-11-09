# GPSLane — CJdropshipping Product Sourcing Plan

**Status:** Plan + verified API research. No authenticated CJ account access has been provided; nothing below claims otherwise. All supplier data marked **UNVERIFIED** must be confirmed inside the owner's CJ account before use.

## 1. What is verified vs. assumed

**Verified (public CJ developer documentation, developers.cjdropshipping.com):**

| Capability | Documented endpoint family | Auth |
|---|---|---|
| Category tree | `GET /api2.0/v1/product/getCategory` | `CJ-Access-Token` header (API key → token exchange, see "How to Get API Key"/"Get Access-token" docs) |
| Product search | `GET /api2.0/v1/product/listV2` — keyword, categoryId, lv2/lv3 category lists, `countryCode` (US/CA inventory filter), price range, `addMarkStatus` (free shipping), productType, paging (page≤1000, size≤100) | same |
| Product details | `GET /api2.0/v1/product/getProductDetail`-family (1.5) + `POST` query endpoints (1.10) | same |
| Variants | `GET` all-variants (2.1), variant-by-id (2.2) | same |
| Inventory | `GET` inventory inquiry (3.1), by SKU (3.2), by product ID (3.3) | same |
| My products / add to list | 1.6–1.7 | same |
| Packaging / individualization | 1.8–1.9 packaging queries, **1.11 Create Individualization Product** (private-label/customization candidate) | same |
| Orders | Section 5 "Shopping" (create/query order family) | same |
| Webhooks | Section 8 "Webhook" + a dedicated Webhook getting-started doc | same |
| Sandbox | Documented "Sandbox" getting-started section | same |

**Not yet verified (requires owner's authenticated account):**
- Actual GPS-category product IDs, SKUs, variant IDs, costs, US/CA shipping rates and ETAs.
- Whether the account has "My Product" listings already (brief said products are "connected" — unconfirmed).
- Private-label capability per product (CJ offers "individualization" products — per-product eligibility unknown).
- API rate limits ("Interface Call Restrictions" doc exists — must be read before designing poll cadence).
- Webhook event types and signature verification method.

**Public-catalog observations (unverified, indexed pages only — details blocked by CJ bot-check):**
- Product URL pattern: `cjdropshipping.com/product/<slug>-p-<numericId>.html`.
- Three GPS-adjacent listings surfaced in public index (details NOT retrievable without account):
  - `car-hud-head-up-display-gps-compass-speedometer-multi-function-usb-power-supply-velometer` — p-1776923119836475392
  - `car-tracker-magnetic-mini-car-tracker-gps-real-time-tracking-locator-device-recordable-anti-lost-rechargeable-locator` — p-1385423428458254336
  - `mini-gps-gsm-car-tracker-locator-cut-off-fuel` — p-1417330528432033792
- CJ category tree includes "Automobiles & Motorcycles → Car Electronics → Car Monitors" and GPS-adjacent categories; exact GPS navigator category IDs must be pulled via `getCategory` with the account token.

## 2. Sourcing workflow (repeatable, reviewable)

```
1. DISCOVER   — CJ API listV2 per target keyword (see §4) + category browse.
                Filters: countryCode=US AND CA availability, price band, in-stock.
2. SCREEN     — Reject: branded/OEM products (Garmin/TomTom/etc.),
                electronics without certifications where required,
                oversized/heavy items, listings with dispute-rate red flags.
3. DILIGENCE  — For survivors pull: product detail, all variants, inventory
                by country, packaging options, reviews count, listed count.
4. COST MODEL — landed cost = unit cost + US shipping + CA shipping +
                payment fee % + refund reserve (see scorecard doc).
                Reject if contribution margin < threshold at target price.
5. BRANDING   — Classify: generic / GPSLane-packaging / GPSLane-product.
                Only proceed past "generic" with supplier confirmation.
6. STAGE      — Import as status=draft + sourcingStatus=pending_review.
                Owner reviews scorecard sheet → approve/reject.
7. PUBLISH    — Only approved, priced (USD+CAD), mapped, imaged products
                become status=published.
```

**Import tooling:** admin "Supplier import" screen — paste CJ product URL or ID → server-side fetch via `CJProvider.getProductDetail` → preview card with scorecard → "Stage to catalogue" button creates draft product+variant+mapping rows. Never auto-publishes.

## 3. Data to capture per candidate (import checklist)

| Field | Source | Stored in |
|---|---|---|
| CJ product ID (pid), product URL | listV2/detail | `supplier_product_mappings.supplierProductId` |
| Variant IDs, SKU, variant options | variants API | `product_variants.supplierVariantId`, optionValues |
| Title, description, specs | detail | products/description (rewritten — never copy verbatim if copyrighted; write own copy) |
| Images | detail (CDN URLs → re-host to Vercel Blob) | media collection |
| Unit cost (USD) | detail/listV2 | mapping `unitCostCents` (admin-only, never customer-facing) |
| Shipping cost US / CA | logistics API per address | captured in scorecard + `shippingQuote` snapshot; runtime rates via CJ logistics API at checkout or flat configured margins [design decision needed] |
| Stock by country | inventory API 3.3 | `inventory_levels` (per-channel) |
| Shipping methods + ETAs | logistics API | product/variant metadata + store shipping copy |
| Certifications | detail/specs | product attributes (FCC/CE where claimed — only if listed) |
| Packaging/branded options | detail + 1.11 individualization | `brandingTier` field |
| Return/defect terms | CJ policy + supplier | internal notes; informs refund policy copy |
| Private-label MOQ | individualization inquiry | `privateLabel` jsonb |

## 4. Search terms → target categories

| Keyword (CJ `keyWord`) | Target taxonomy category |
|---|---|
| portable car GPS navigator | portable-gps |
| vehicle GPS navigation / car GPS navigator | automotive-gps |
| truck GPS navigator / RV GPS | truck-rv-gps |
| motorcycle GPS navigation | motorcycle-gps |
| GPS windshield mount / dashboard holder | mounts-holders |
| GPS power cable / car charger | power-cables |
| GPS antenna | antennas |
| GPS carrying case | cases-carrying |
| GPS memory card / USB / mount accessories | storage-connectivity |
| vehicle GPS tracker / magnetic tracker | trackers (secondary) |

Run each with `countryCode=US`, then `CA`; merge results; dedupe by CJ pid.

## 5. Branding tiers (separate concepts — never blur)

| Tier | Meaning | Advertising rule |
|---|---|---|
| `generic` | Unbranded CJ product as shipped | Sell as "GPSLane selection"; no brand claims on hardware |
| `gpslane_packaging` | Supplier confirms neutral/custom box or logo insert | May say "GPSLane branded packaging" only after supplier confirmation recorded |
| `gpslane_product` | Supplier confirms product-level branding/private label | Requires written supplier confirmation + MOQ; never remove regulatory/certification markings |

Store `brandingTier` + `brandingEvidence` (note/screenshot ref + date) per product. UI badges derive from this field only.

## 6. Curated launch catalogue — approach

Do NOT import all results. Target **8–12 launch products**: 1–2 hero devices per relevant category + 2–3 high-margin accessories (mounts/cables — cheap, light, low dispute). Trackers secondary (compliance/privacy sensitivity — review carefully; some jurisdictions restrict covert trackers).

## 7. Candidate list for owner review

**Tier A — public-index leads (UNVERIFIED; confirm in account before any use):**
1. Car HUD / GPS compass display — CJ pid `1776923119836475392` — accessory/secondary category candidate.
2. Magnetic mini car GPS tracker — CJ pid `1385423428458254336` — trackers category; privacy review required.
3. Mini GPS GSM car tracker w/ fuel cut-off — CJ pid `1417330528432033792` — trackers; **fuel cut-off raises safety/legal flags — likely reject or restrict marketing claims**.

**Tier B — category ideas only (no verified listings yet):**
Portable 4–7" car GPS navigators; motorcycle GPS pods; truck/RV units with topographic maps; suction/dash mounts; 12V GPS power cables; shark-fin antennas; hard cases; microSD/USB accessories.

**Owner action:** provide CJ API key (CJ dashboard → API) so Tier A/B can be verified and the real catalogue pull executed. Until then all candidates stay `pending_review`.

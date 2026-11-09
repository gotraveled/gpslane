# GPSLane — Phase 11 Product Import Report

**Total Payload products: 36** (17 CJ + 19 EPROLO) — all drafts except 6 published passive accessories.

## Import method

- `scripts/import-catalogue.ts --source=cj|eprolo` — idempotent by slug; creates product (draft) + variant (draft) + supplier-product + inventory-levels.
- Phase 11 additions appended to `data/cj/launch-catalogue.json` (2) and `data/eprolo/launch-catalogue.json` (4).
- `scripts/phase11-fix-frame.ts` corrected the mislabeled installation-frame product.
- `scripts/phase11-backfill.ts` + `phase11-storefront-setup.ts` wrote verification fields, categories, availability and published the launch set.

## Status breakdown

| Status | Count | Notes |
|---|---|---|
| **published** | 6 | Passive accessories only (no radio → no FCC dependency): vehicle-navigation-mount, dashboard-navigation-holder, vent-navigation-holder, folding-suction-navigation-mount, magnetic-navigation-mount, motorcycle-gps-power-adapter |
| pending_product_verification | 12 | GPS-claim devices needing spec/manual evidence |
| pending_supplier_evidence | 18 | EPROLO items (warehouse unverified, economy carriers) + 2 CJ US-only items |

## Deduplication

- Slug-keyed idempotency verified: re-runs skip all existing products.
- `1368761182843965440` duplicate caught: was imported as "installation frame" but is actually the MP5 head unit — corrected in place (name, slug, price, verification), not duplicated.
- EPROLO platform IDs and CJ pids stored on products (`cjProductId`, `eproloProductId`, `eproloPlatformId`) and supplier-products (`supplierProductId`, `supplierVariantId`, `supplierSku`) — private/staff-only.

## Images

- 6 published products: supplier images downloaded into Payload `media` collection (5–6 each) — permanent storage, not fragile CDN links.
- Draft products retain supplier image references in catalogue JSONs; media import deferred until publication approval.

## Content quality

- Descriptions: conservative supplier-based blurbs; no invented specs, battery life, waterproof ratings, warranties or certifications.
- Classification: `launchVerification.gpsClassification` on every product; CarPlay/projection devices never labeled standalone GPS.
- Variants: single-variant imports where supplier exposes one sellable variant; multi-variant products (EPROLO interface box ×18, Magene ×3 colours) imported with default variant + `allVariants` metadata for later expansion.

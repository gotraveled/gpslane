# GPSLane â€” Global Supplier Research (Phase 6)

**Date:** 2026-11-09 Â· **Scope:** suppliers for genuine GPS navigation products/accessories with US or Canadian inventory Â· **Constraints:** no live orders, no supplier accounts created, all provider claims marked verified/unverified.

> Builds on `NORTH_AMERICA_SUPPLIER_RESEARCH.md` (CJ US/CA warehouse audit) and `CJ_DISCOVERY_REPORT.md`. Raw CJ data in `data/cj/` (gitignored).

## 1. Executive summary

- **CJ remains the only API-verified supplier** but lacks NA GPS-specific stock.
- **Doba is the strongest new lead**: public catalog shows real GPS navigator listings (7â€“9" touch-screen units with maps/dash cam, trucker GPS) with US shipping, "in stock, 3 business days" â€” **supplier-level verification still required** (Doba is an aggregator; the underlying supplier must be confirmed per listing).
- **Brand-name GPS via US wholesale distributors** is viable for accessories and possibly devices: CWR (Garmin GPSMAP/GLO, same-day drop-ship), Petra (Garmin mounts/cables). Dealer accounts required; MAP pricing rules apply.
- **Canadian B2B channel exists**: Prosonic, Erikson Consumer (car navigation category), Singh Electronics, AZ Electronics, Importel â€” dealer accounts, dropship terms negotiable, no public API.
- **True private label = China OEM path** (Shenzhen Pretech portable GPS navigator, Ewaygps CarPlay boxes, ZESTECH head units) â€” MOQ 100+, branding/packaging documented, but no NA dropship; freight + duties required. Not compatible with pure dropship model.
- **Platforms** (DropCommerce, Zendrop, Spocket, Wholesale2B) offer NA-warehouse catalogs + APIs but GPS assortment unverified.

## 2. Supplier comparison

| Supplier | HQ / Warehouses | GPS product evidence | Dropship | API/Integration | Private label | Status |
|---|---|---|---|---|---|---|
| **CJdropshipping** | CN + US + CA warehouses | âœ… verified via API (thin NA GPS stock) | âœ… | âœ… full REST API v2 + webhooks | âš ï¸ unconfirmed | **Active â€” keep** |
| **Doba** | US (Lehi UT) aggregator | âœ… GPS navigator + trucker GPS listings, in-stock, 3-day ship | âœ… | âš ï¸ API via paid plan ($29.99/mo+) | âš ï¸ supplier-dependent | **Candidate â€” verify** |
| **CWR Wholesale Distribution** | Bayville NJ + Tampa FL | âœ… Garmin GPSMAP combos, GLO 2, automotive GPS category | âœ… same-day, $9.95 flat | âœ… dealer automation software | âŒ brand products only | **Candidate â€” dealer account** |
| **Petra Industries** | US | âœ… Garmin handheld/vehicle GPS + mounts/cables (retail prices public) | âš ï¸ verify | âš ï¸ verify | âŒ | **Candidate â€” dealer account** |
| **DropCommerce** | Kelowna BC (platform) | âš ï¸ 400+ US/CA suppliers, GPS unverified | âœ… | âœ… API/CSV/Shopify | âš ï¸ per-supplier white-label invoicing/packaging | **Candidate** |
| **Zendrop** | US | âš ï¸ 1M+ catalog, GPS unverified | âœ… | âœ… API | âœ… private label + POD | **Candidate â€” paid plan** |
| **Spocket** | US/EU curated | âš ï¸ lifestyle-heavy, GPS unlikely | âœ… | âœ… API | âš ï¸ | Low priority |
| **Wholesale2B / Wholesale Central** | US directories | âš ï¸ directories, per-supplier | varies | âš ï¸ | varies | Research tool only |
| **Prosonic Canada** | Canada | âš ï¸ 1,700+ electronics SKUs incl. car electronics | âš ï¸ B2B terms | âŒ | âš ï¸ | **Candidate â€” dealer account** |
| **Erikson Consumer** | Canada | âœ… "car navigation devices" category | âš ï¸ dealer model | âŒ | âŒ | **Candidate â€” dealer account** |
| **Singh Electronics** | Toronto ON | âš ï¸ car audio/video distributor | âš ï¸ | âŒ | âŒ | Candidate |
| **AZ Electronics** | Vaughan ON | âœ… car navigation/multimedia + alarm/GPS systems | âš ï¸ | âŒ | âŒ | Candidate |
| **Importel Ltd** | Toronto + Edmonton | âš ï¸ car audio/marine/motorcycle B2B | âš ï¸ | âŒ | âŒ | Candidate |
| **SupplyLeader** | Casper WY | âš ï¸ GPS wholesale directory | varies | âŒ | varies | Research tool only |
| **The GPS Store** | US retailer | n/a (retail, not dropship) | âŒ | âŒ | âŒ | Not a supplier |
| **Shenzhen Pretech (made-in-china)** | China | âœ… ODM portable GPS navigator (N70, 7â€³, CarPlay) | âŒ | âš ï¸ B2B portal | âœ… ODM branding documented, MOQ 100â€“3,000 | **PL path only â€” not dropship** |
| **Ewaygps** | China | âœ… CarPlay/Android box ODM/OEM, UI+packaging branding | âŒ | âš ï¸ | âœ… documented | **PL path only** |
| **ZESTECH** | China/HK | âœ… Android head units OEM/ODM, low-MOQ pilot | âŒ | âš ï¸ | âœ… | **PL path only** |
| **TrackerOne** | Global | âŒ trackers only â€” excluded category | âœ… | âš ï¸ | âš ï¸ | **Rejected â€” excluded products** |

## 3. Verified North American availability

**US warehouse (verified):**
- CJ US: vehicle accessories + 1 HUD (Phase 5 findings).
- Doba: GPS navigator listings marked in-stock with US shipping â€” underlying supplier warehouse unverified.
- CWR/Petra: physical US inventory, brand-name Garmin products.

**Canada warehouse:**
- No verified GPS stock found anywhere yet. CJ CA warehouse: 0 relevant. Canadian B2B distributors hold stock in Canada but dropship terms unconfirmed.

## 4. GPS product leads (unverified â€” require account-level confirmation)

| Lead | Supplier | Product | Evidence | Required verification |
|---|---|---|---|---|
| L1 | Doba | 7â€³ GPS Navigator, 16GB, lifetime maps, dash cam | Public listing, in-stock, 3-day ship | Supplier identity, real stock, unit cost, true shipping cost, return terms |
| L2 | Doba | 9â€³ GPS Navigator (same family) | Public listing | Same |
| L3 | Doba | Truck GPS Navigator 7â€³, truck routing | Public listing | Same + truck-market fit |
| L4 | CWR | Garmin GLO 2 Bluetooth GPS receiver | CWR catalog | Dealer pricing, dropship eligibility, MAP rules |
| L5 | CWR | Garmin GPSMAP automotive combos | CWR category page | Same + marine/auto crossover fit |
| L6 | Petra | Garmin vehicle power cables, mounts | Public retail prices | Dealer discount, dropship program |
| L7 | Petra | Garmin eTrex handheld GPS | Public listing | Same |
| L8â€“L12 | OEM path | Portable GPS navigator / motorcycle display | made-in-china ODM listings | MOQ economics, branding cost, certification, freight |

**Margin note:** brand-name Garmin via wholesale typically yields thinner margins than generic CJ devices but stronger brand trust and easier compatibility claims (map-update service synergy). Generic ODM devices offer best margin but weakest NA availability.

## 5. Shipping & pricing approach

- Per-supplier landed-cost model identical to Phase 5: product cost + destination freight â†’ 35%/40% price floors â†’ PayPal 3.49%+$0.49 â†’ 5% refund reserve â†’ platform cost.
- US-bound: prefer US-warehouse stock (Doba US, CWR, CJ US). CA-bound: Canadian B2B stock or USâ†’CA; CJ CNâ†’CA verified working.
- Free shipping only where full freight is inside price and margin â‰¥35%.
- CAD prices explicit per product; planning FX 1.38 for analysis only.

## 6. White-label evidence

| Path | Evidence | Verdict |
|---|---|---|
| CJ individualization/packaging | API endpoints exist; no product confirmed | `branding_unverified` |
| Doba/Zendrop private label | Zendrop advertises PL/POD; Doba supplier-dependent | `branding_unverified` pending supplier |
| DropCommerce | Supplier-level "white labelling for packages, branded invoicing" option exists | Per-supplier verification |
| OEM/ODM (Pretech, Ewaygps, ZESTECH) | Documented logo/boot/UI/packaging customization, MOQ tiers | Genuine PL path â€” requires inventory purchase, not dropship |

**Honest position:** GPSLane storefront branding is supportable everywhere; physical GPSLane branding requires either (a) a dropship supplier confirming PL terms, or (b) the CN OEM route with owned inventory â€” a different business model decision for the owner.

## 7. API / integration possibilities

- **CJ:** live, verified (Phase 4).
- **Doba:** API available on paid plans; order routing to underlying suppliers; needs account.
- **CWR:** dealer automation software (product sync); API details behind dealer login.
- **Petra:** dealer portal; integration unverified.
- **DropCommerce:** REST API + CSV + Shopify app.
- **Zendrop:** REST API + webhooks.
- **Canadian B2B (Prosonic, Erikson, Singh, AZ, Importel):** no public API â€” likely CSV/manual order flow initially.
- **OEMs:** B2B portals/Alibaba-style RFQ; no dropship API.

## 8. Supplier risks

- **Doba aggregator risk:** underlying supplier quality varies per listing; returns/disputes route through Doba.
- **MAP compliance:** Garmin/brand products carry minimum advertised price rules â€” GPSLane cannot discount below MAP.
- **Canadian B2B:** no API, dealer approval required, dropship terms unknown.
- **OEM path:** inventory capital, freight/duties, certification liability (radio equipment FCC/ISED for GPS devices sold in NA).
- **Marketplace GPS listings** (Doba 7â€³ units) may be rebadged CN devices with inflated specs â€” same verification burden as CJ.

## 9. Recommended next steps (owner approval required)

1. **Approve Doba evaluation:** create paid account, pull the 3 GPS navigator listings + underlying supplier details, verify stock/cost/shipping/returns. â†’ determines if Doba becomes supplier #2.
2. **Request CWR dealer account** for Garmin GLO 2 + automotive GPS category evaluation (brand-name NA-stocked GPS).
3. **Request Petra dealer pricing** for Garmin accessories (cables/mounts â€” complements GPSLane accessories category).
4. **Contact 1â€“2 Canadian B2B distributors** (Erikson â€” has car navigation category; Prosonic â€” electronics catalog) for dropship terms.
5. **Decide private-label strategy:** dropship-PL (uncertain) vs CN OEM inventory (capital required). Document decision in `PHASE_2_DECISIONS_REQUIRED.md`.
6. **Implement `src/lib/suppliers/` adapters** as accounts are approved â€” interface already in place (`types.ts`, `registry.ts`).

## 10. Architecture implemented

- `src/lib/suppliers/types.ts` â€” `SupplierAdapter` contract: search, detail, variants, inventory, shipping quotes, order submit/status/cancel. `AdapterNotConfiguredError` for unapproved capabilities.
- `src/lib/suppliers/registry.ts` â€” supplier registry with capability flags + status per research findings. CJ adapter wraps verified `src/lib/cj/client.ts`; `manual` is the fallback.
- No live order submission implemented for any new supplier; CJ order path remains sandbox-gated.

## 11. DSers / AliExpress evaluation (Phase 6b)

**Verdict: DSers does NOT solve the NA GPS problem.**

- DSers is an AliExpress order-automation tool, not a supplier. Its US-warehouse mapping ships AliExpress items from US warehouses **where available** (advertised 4–7 days), but GPS navigation devices are overwhelmingly CN-shipped generic units — the same sourcing risk as CJ, with weaker spec verification.
- AliExpress does list car GPS navigators (e.g. generic 7? units), but none were verified as US/CA-warehouse stock; AliExpress US-warehouse assortment skews to small consumer goods, not GPS electronics.
- DSers offers no supplier API comparable to CJ's; it's Shopify/WooCommerce-centric automation.`n**Consequence:** no verified NA-warehouse GPS supplier exists among evaluated options. Per owner instruction, the catalogue is descoped — GPSLane proceeds as a **map-update service website** (device ID, compatibility review, update guidance, paid assistance). Commerce/product collections remain in the codebase as dormant infrastructure should a verified supplier emerge later.


## 12. EPROLO API integration (Phase 7 — COMPLETE)

API doc obtained from EPROLO support (showdoc + gist mirror). Gateway `openapi.eprolo.com`; auth: `apiKey` header + `sign=MD5(apiKey+timestamp+apiSecret)` + `timestamp` (ms, GMT). Client: `src/lib/suppliers/eprolo.ts`.

Endpoints used: `product_type.html` (categories), `eprolo_product_list.html` (catalog; `page_index`+`page_size=200`+`wareTypeId`), `get_product_shiping_fees.html` (per-variant US/CA freight), `add_product.html` (stages products into the account import list — no orders, no cost).

Scan covered Consumer Electronic, Phones & Accessories, Cars & Motorcycles (~2,900 products): **62 GPS-relevant candidates** → 16 shortlisted → **15 imported as Payload drafts** (`data/eprolo/launch-catalogue.json`, gitignored).

Key finding: EPROLO has a **genuine standalone GPS navigator** (7" portable, MSTAR 2531, GPS receiver, WinCE, regional map variants) at $31 + freight — better GPS authenticity than most CJ listings. Carriers are 4PX/Yanwen/Yun/Jiayou economy lines (**not USPS**), quoted 10–20 days US / 8–15 days CA. Warehouse origin unverified (assumed CN). EPROLO offers no-MOQ branding ($19.90/yr + per-order) but unverified per SKU → `storefront_brand_only`.

Excluded during triage: GPS smartwatches/kids' watches (wearables, off-focus), drones, signal/camera detectors (surveillance-adjacent), and generic accessories without navigation relevance.

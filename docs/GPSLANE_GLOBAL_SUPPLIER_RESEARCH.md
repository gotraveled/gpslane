# GPSLane — Global Supplier Research (Phase 6)

**Date:** 2026-11-09 · **Scope:** suppliers for genuine GPS navigation products/accessories with US or Canadian inventory · **Constraints:** no live orders, no supplier accounts created, all provider claims marked verified/unverified.

> Builds on `NORTH_AMERICA_SUPPLIER_RESEARCH.md` (CJ US/CA warehouse audit) and `CJ_DISCOVERY_REPORT.md`. Raw CJ data in `data/cj/` (gitignored).

## 1. Executive summary

- **CJ remains the only API-verified supplier** but lacks NA GPS-specific stock.
- **Doba is the strongest new lead**: public catalog shows real GPS navigator listings (7–9" touch-screen units with maps/dash cam, trucker GPS) with US shipping, "in stock, 3 business days" — **supplier-level verification still required** (Doba is an aggregator; the underlying supplier must be confirmed per listing).
- **Brand-name GPS via US wholesale distributors** is viable for accessories and possibly devices: CWR (Garmin GPSMAP/GLO, same-day drop-ship), Petra (Garmin mounts/cables). Dealer accounts required; MAP pricing rules apply.
- **Canadian B2B channel exists**: Prosonic, Erikson Consumer (car navigation category), Singh Electronics, AZ Electronics, Importel — dealer accounts, dropship terms negotiable, no public API.
- **True private label = China OEM path** (Shenzhen Pretech portable GPS navigator, Ewaygps CarPlay boxes, ZESTECH head units) — MOQ 100+, branding/packaging documented, but no NA dropship; freight + duties required. Not compatible with pure dropship model.
- **Platforms** (DropCommerce, Zendrop, Spocket, Wholesale2B) offer NA-warehouse catalogs + APIs but GPS assortment unverified.

## 2. Supplier comparison

| Supplier | HQ / Warehouses | GPS product evidence | Dropship | API/Integration | Private label | Status |
|---|---|---|---|---|---|---|
| **CJdropshipping** | CN + US + CA warehouses | ✅ verified via API (thin NA GPS stock) | ✅ | ✅ full REST API v2 + webhooks | ⚠️ unconfirmed | **Active — keep** |
| **Doba** | US (Lehi UT) aggregator | ✅ GPS navigator + trucker GPS listings, in-stock, 3-day ship | ✅ | ⚠️ API via paid plan ($29.99/mo+) | ⚠️ supplier-dependent | **Candidate — verify** |
| **CWR Wholesale Distribution** | Bayville NJ + Tampa FL | ✅ Garmin GPSMAP combos, GLO 2, automotive GPS category | ✅ same-day, $9.95 flat | ✅ dealer automation software | ❌ brand products only | **Candidate — dealer account** |
| **Petra Industries** | US | ✅ Garmin handheld/vehicle GPS + mounts/cables (retail prices public) | ⚠️ verify | ⚠️ verify | ❌ | **Candidate — dealer account** |
| **DropCommerce** | Kelowna BC (platform) | ⚠️ 400+ US/CA suppliers, GPS unverified | ✅ | ✅ API/CSV/Shopify | ⚠️ per-supplier white-label invoicing/packaging | **Candidate** |
| **Zendrop** | US | ⚠️ 1M+ catalog, GPS unverified | ✅ | ✅ API | ✅ private label + POD | **Candidate — paid plan** |
| **Spocket** | US/EU curated | ⚠️ lifestyle-heavy, GPS unlikely | ✅ | ✅ API | ⚠️ | Low priority |
| **Wholesale2B / Wholesale Central** | US directories | ⚠️ directories, per-supplier | varies | ⚠️ | varies | Research tool only |
| **Prosonic Canada** | Canada | ⚠️ 1,700+ electronics SKUs incl. car electronics | ⚠️ B2B terms | ❌ | ⚠️ | **Candidate — dealer account** |
| **Erikson Consumer** | Canada | ✅ "car navigation devices" category | ⚠️ dealer model | ❌ | ❌ | **Candidate — dealer account** |
| **Singh Electronics** | Toronto ON | ⚠️ car audio/video distributor | ⚠️ | ❌ | ❌ | Candidate |
| **AZ Electronics** | Vaughan ON | ✅ car navigation/multimedia + alarm/GPS systems | ⚠️ | ❌ | ❌ | Candidate |
| **Importel Ltd** | Toronto + Edmonton | ⚠️ car audio/marine/motorcycle B2B | ⚠️ | ❌ | ❌ | Candidate |
| **SupplyLeader** | Casper WY | ⚠️ GPS wholesale directory | varies | ❌ | varies | Research tool only |
| **The GPS Store** | US retailer | n/a (retail, not dropship) | ❌ | ❌ | ❌ | Not a supplier |
| **Shenzhen Pretech (made-in-china)** | China | ✅ ODM portable GPS navigator (N70, 7″, CarPlay) | ❌ | ⚠️ B2B portal | ✅ ODM branding documented, MOQ 100–3,000 | **PL path only — not dropship** |
| **Ewaygps** | China | ✅ CarPlay/Android box ODM/OEM, UI+packaging branding | ❌ | ⚠️ | ✅ documented | **PL path only** |
| **ZESTECH** | China/HK | ✅ Android head units OEM/ODM, low-MOQ pilot | ❌ | ⚠️ | ✅ | **PL path only** |
| **TrackerOne** | Global | ❌ trackers only — excluded category | ✅ | ⚠️ | ⚠️ | **Rejected — excluded products** |

## 3. Verified North American availability

**US warehouse (verified):**
- CJ US: vehicle accessories + 1 HUD (Phase 5 findings).
- Doba: GPS navigator listings marked in-stock with US shipping — underlying supplier warehouse unverified.
- CWR/Petra: physical US inventory, brand-name Garmin products.

**Canada warehouse:**
- No verified GPS stock found anywhere yet. CJ CA warehouse: 0 relevant. Canadian B2B distributors hold stock in Canada but dropship terms unconfirmed.

## 4. GPS product leads (unverified — require account-level confirmation)

| Lead | Supplier | Product | Evidence | Required verification |
|---|---|---|---|---|
| L1 | Doba | 7″ GPS Navigator, 16GB, lifetime maps, dash cam | Public listing, in-stock, 3-day ship | Supplier identity, real stock, unit cost, true shipping cost, return terms |
| L2 | Doba | 9″ GPS Navigator (same family) | Public listing | Same |
| L3 | Doba | Truck GPS Navigator 7″, truck routing | Public listing | Same + truck-market fit |
| L4 | CWR | Garmin GLO 2 Bluetooth GPS receiver | CWR catalog | Dealer pricing, dropship eligibility, MAP rules |
| L5 | CWR | Garmin GPSMAP automotive combos | CWR category page | Same + marine/auto crossover fit |
| L6 | Petra | Garmin vehicle power cables, mounts | Public retail prices | Dealer discount, dropship program |
| L7 | Petra | Garmin eTrex handheld GPS | Public listing | Same |
| L8–L12 | OEM path | Portable GPS navigator / motorcycle display | made-in-china ODM listings | MOQ economics, branding cost, certification, freight |

**Margin note:** brand-name Garmin via wholesale typically yields thinner margins than generic CJ devices but stronger brand trust and easier compatibility claims (map-update service synergy). Generic ODM devices offer best margin but weakest NA availability.

## 5. Shipping & pricing approach

- Per-supplier landed-cost model identical to Phase 5: product cost + destination freight → 35%/40% price floors → PayPal 3.49%+$0.49 → 5% refund reserve → platform cost.
- US-bound: prefer US-warehouse stock (Doba US, CWR, CJ US). CA-bound: Canadian B2B stock or US→CA; CJ CN→CA verified working.
- Free shipping only where full freight is inside price and margin ≥35%.
- CAD prices explicit per product; planning FX 1.38 for analysis only.

## 6. White-label evidence

| Path | Evidence | Verdict |
|---|---|---|
| CJ individualization/packaging | API endpoints exist; no product confirmed | `branding_unverified` |
| Doba/Zendrop private label | Zendrop advertises PL/POD; Doba supplier-dependent | `branding_unverified` pending supplier |
| DropCommerce | Supplier-level "white labelling for packages, branded invoicing" option exists | Per-supplier verification |
| OEM/ODM (Pretech, Ewaygps, ZESTECH) | Documented logo/boot/UI/packaging customization, MOQ tiers | Genuine PL path — requires inventory purchase, not dropship |

**Honest position:** GPSLane storefront branding is supportable everywhere; physical GPSLane branding requires either (a) a dropship supplier confirming PL terms, or (b) the CN OEM route with owned inventory — a different business model decision for the owner.

## 7. API / integration possibilities

- **CJ:** live, verified (Phase 4).
- **Doba:** API available on paid plans; order routing to underlying suppliers; needs account.
- **CWR:** dealer automation software (product sync); API details behind dealer login.
- **Petra:** dealer portal; integration unverified.
- **DropCommerce:** REST API + CSV + Shopify app.
- **Zendrop:** REST API + webhooks.
- **Canadian B2B (Prosonic, Erikson, Singh, AZ, Importel):** no public API — likely CSV/manual order flow initially.
- **OEMs:** B2B portals/Alibaba-style RFQ; no dropship API.

## 8. Supplier risks

- **Doba aggregator risk:** underlying supplier quality varies per listing; returns/disputes route through Doba.
- **MAP compliance:** Garmin/brand products carry minimum advertised price rules — GPSLane cannot discount below MAP.
- **Canadian B2B:** no API, dealer approval required, dropship terms unknown.
- **OEM path:** inventory capital, freight/duties, certification liability (radio equipment FCC/ISED for GPS devices sold in NA).
- **Marketplace GPS listings** (Doba 7″ units) may be rebadged CN devices with inflated specs — same verification burden as CJ.

## 9. Recommended next steps (owner approval required)

1. **Approve Doba evaluation:** create paid account, pull the 3 GPS navigator listings + underlying supplier details, verify stock/cost/shipping/returns. → determines if Doba becomes supplier #2.
2. **Request CWR dealer account** for Garmin GLO 2 + automotive GPS category evaluation (brand-name NA-stocked GPS).
3. **Request Petra dealer pricing** for Garmin accessories (cables/mounts — complements GPSLane accessories category).
4. **Contact 1–2 Canadian B2B distributors** (Erikson — has car navigation category; Prosonic — electronics catalog) for dropship terms.
5. **Decide private-label strategy:** dropship-PL (uncertain) vs CN OEM inventory (capital required). Document decision in `PHASE_2_DECISIONS_REQUIRED.md`.
6. **Implement `src/lib/suppliers/` adapters** as accounts are approved — interface already in place (`types.ts`, `registry.ts`).

## 10. Architecture implemented

- `src/lib/suppliers/types.ts` — `SupplierAdapter` contract: search, detail, variants, inventory, shipping quotes, order submit/status/cancel. `AdapterNotConfiguredError` for unapproved capabilities.
- `src/lib/suppliers/registry.ts` — supplier registry with capability flags + status per research findings. CJ adapter wraps verified `src/lib/cj/client.ts`; `manual` is the fallback.
- No live order submission implemented for any new supplier; CJ order path remains sandbox-gated.

## 11. DSers / AliExpress evaluation (Phase 6b)

**Verdict: DSers does NOT solve the NA GPS problem.**

- DSers is an AliExpress order-automation tool, not a supplier. Its US-warehouse mapping ships AliExpress items from US warehouses **where available** (advertised 4�7 days), but GPS navigation devices are overwhelmingly CN-shipped generic units � the same sourcing risk as CJ, with weaker spec verification.
- AliExpress does list car GPS navigators (e.g. generic 7? units), but none were verified as US/CA-warehouse stock; AliExpress US-warehouse assortment skews to small consumer goods, not GPS electronics.
- DSers offers no supplier API comparable to CJ's; it's Shopify/WooCommerce-centric automation.`n**Consequence:** no verified NA-warehouse GPS supplier exists among evaluated options. Per owner instruction, the catalogue is descoped � GPSLane proceeds as a **map-update service website** (device ID, compatibility review, update guidance, paid assistance). Commerce/product collections remain in the codebase as dormant infrastructure should a verified supplier emerge later.


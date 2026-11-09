# GPSLane — Phase 9: Product Verification Report

**Date:** 2026-11-09 · **Scope:** all 30 draft products (15 CJ + 15 EPROLO) · **Result:** 9 approved_for_review · 6 pending_product_verification · 15 pending_supplier_evidence · 0 blocked · 0 rejected.

All records remain **draft / pending_review / unpublished** in Neon. Schema extended with a staff-only `launchVerification` group (classification, GPS evidence, maps, FCC/ISED, evidence links, readiness) and supplier-product verification flags (`warehouseVerified`, `shippingRouteVerified`, `supplierEvidence`, `supplierEvidenceCheckedAt`). No public exposure: all new fields are staff-read-only or on staff-only collections.

## Counts

| Status | Count | Products |
|---|---|---|
| approved_for_review | 9 | CJ: motorcycle-navigation-display, wireless-carplay-adapter, navigation-installation-frame, vehicle-navigation-mount, dashboard-navigation-holder, vent-navigation-holder, folding-suction-navigation-mount, magnetic-navigation-mount, motorcycle-gps-power-adapter |
| pending_product_verification | 6 | CJ: portable-car-navigation-display, car-navigation-system-10-6, carplay-navigation-player, gps-cycling-computer · EPROLO: gps-navigator-7-inch-portable, pnd-navigation-player-dashcam |
| pending_supplier_evidence | 15 | CJ: vehicle-navigation-power-cable, head-up-display · EPROLO: all other 13 |
| blocked_shipping / blocked_compliance / rejected | 0 | — |

## Evidence matrix (condensed — full notes in Payload `launchVerification.launchNotes`)

| Slug | Supplier | Class | GPS func | Warehouse | US ship | CA ship | Readiness |
|---|---|---|---|---|---|---|---|
| motorcycle-navigation-display | CJ | navigation_display | no | CN verified | USPS 5–11d $32.69 | CJPacket 4–7d $19.30 | approved |
| portable-car-navigation-display | CJ | standalone_gps_navigator | unverified | CN verified | USPS 4–9d $25.01 | CJPacket 7–15d $14.40 | pending_product_verification |
| car-navigation-system-10-6 | CJ | navigation_display | unverified | CN verified | USPS 4–9d $30.09 | CJPacket 4–7d $18.60 | pending_product_verification |
| carplay-navigation-player | CJ | navigation_display | unverified | CN verified | USPS 5–11d $27.11 | CJPacket 4–7d $15.63 | pending_product_verification |
| gps-cycling-computer | CJ | gps_cycling_computer | unverified | CN verified | USPS 4–9d $10.40 | CJPacket 7–15d $5.81 | pending_product_verification |
| navigation-installation-frame | CJ | gps_accessory | no | CN verified | USPS 5–11d $34.13 | CJPacket 4–7d $19.69 | approved |
| vehicle-navigation-mount | CJ | gps_accessory | no | CN verified | USPS 5–11d $9.15 | CJPacket 4–7d $6.38 | approved |
| dashboard-navigation-holder | CJ | gps_accessory | no | CN verified | USPS 5–11d $6.27 | CJPacket 7–15d $4.54 | approved |
| vent-navigation-holder | CJ | gps_accessory | no | CN verified | USPS 5–11d $6.93 | CJPacket 7–15d $5.00 | approved |
| folding-suction-navigation-mount | CJ | gps_accessory | no | CN verified | USPS 5–11d $8.31 | CJPacket 7–15d $6.17 | approved |
| magnetic-navigation-mount | CJ | gps_accessory | no | CN verified | USPS-remote 5–10d $8.33 | CJPacket 7–15d $4.64 | approved |
| motorcycle-gps-power-adapter | CJ | gps_accessory | no | CN verified | USPS 5–11d $6.79 | CJPacket 7–15d $4.89 | approved |
| vehicle-navigation-power-cable | CJ | gps_accessory | no | CN+US verified | USPS+VIP 3–7d $6.71 | **no quote** | pending_supplier_evidence |
| head-up-display | CJ | gps_accessory | no | CN+US verified | USPS+VIP 3–7d $6.41 | **no quote** | pending_supplier_evidence |
| wireless-carplay-adapter | CJ | gps_accessory | no | CN verified | USPS-remote 5–10d $8.39 | CJPacket 7–15d $4.66 | approved |
| gps-navigator-7-inch-portable | EPROLO | standalone_gps_navigator | unverified | **unverified (assumed CN)** | 4PX 10–18d $16.61 | YUN 8–15d $12.59 | pending_product_verification |
| pnd-navigation-player-dashcam | EPROLO | standalone_gps_navigator | unverified | unverified | 4PX 10–18d $25.08 | YANWEN 8–15d $19.04 | pending_product_verification |
| carplay-screen-10-26-portable | EPROLO | navigation_display | no | unverified | 4PX 10–18d $27.06 | YUN 8–15d $20.41 | pending_supplier_evidence |
| carplay-mp5-7-inch-portable | EPROLO | navigation_display | no | unverified | 4PX 10–18d $20.00 | YANWEN 8–15d $15.90 | pending_supplier_evidence |
| carplay-android-auto-interface-box | EPROLO | gps_accessory | no | unverified | 4PX 10–18d $7.61 | YANWEN 8–15d $5.92 | pending_supplier_evidence |
| wireless-carplay-adapter-box | EPROLO | gps_accessory | no | unverified | 4PX 10–18d $5.97 | YANWEN 8–15d $4.64 | pending_supplier_evidence |
| carlinkit-4-0-carplay-adapter | EPROLO | gps_accessory | no | unverified | 4PX 10–18d $7.44 | YANWEN 8–15d $5.82 | pending_supplier_evidence |
| hud-gps-speedometer | EPROLO | gps_accessory | unverified | unverified | 4PX 10–18d $7.20 | YANWEN 8–15d $5.64 | pending_supplier_evidence |
| hud-obd2-head-up-display | EPROLO | gps_accessory | no | unverified | 4PX 10–18d $8.82 | YANWEN 8–15d $7.16 | pending_supplier_evidence |
| hud-a900-head-up-display | EPROLO | gps_accessory | no | unverified | 4PX 10–18d $11.38 | YANWEN 8–15d $8.88 | pending_supplier_evidence |
| magnetic-suction-navigation-holder | EPROLO | gps_accessory | no | unverified | 4PX 10–18d $8.51 | YANWEN 8–15d $6.51 | pending_supplier_evidence |
| vent-magnetic-navigation-holder | EPROLO | gps_accessory | no | unverified | 4PX 10–18d $8.51 | YANWEN 8–15d $6.51 | pending_supplier_evidence |
| universal-dashboard-navigation-holder | EPROLO | gps_accessory | no | unverified | YUN-remote 10–20d $8.91 | YUN 10–20d $5.16 | pending_supplier_evidence |
| motorcycle-usb-power-socket-36w | EPROLO | gps_accessory | no | unverified | 4PX 10–18d $6.41 | YANWEN 8–15d $4.94 | pending_supplier_evidence |
| dual-usb-car-charger-gps | EPROLO | gps_accessory | no | unverified | 4PX 10–18d $7.13 | YANWEN 8–15d $5.65 | pending_supplier_evidence |

## Key corrections vs Phase 7

- **`portable-car-navigation-display` reclassified** → `standalone_gps_navigator`. CJ description contains real GPS specs (positioning accuracy, GSm frequency, Autonavi maps, Linux) — it is a portable navigator, not just a projection screen. GPS function remains `unverified` (supplier specs only).
- **EPROLO 7″ GPS navigator** gets the deepest evidence in the catalogue (see §Special review).
- **CJ wireless-carplay-adapter**: supplier packing list ambiguously mentions "Car GPS" — flagged for content verification.
- **`vehicle-navigation-power-cable` + `head-up-display`**: no Canada freight quote → treated as US-only until CA shipping is confirmed.

## Special review — EPROLO 7-inch GPS Navigator (`gps-navigator-7-inch-portable`)

Supplier spec evidence (EPROLO `body_html`, checked 2026-11-09):

| Item | Evidence | Status |
|---|---|---|
| GPS receiver | "Receiver: GPS" in spec table | supplier-claimed |
| Chipset | MSTAR 2531 800MHz | supplier-claimed |
| OS | Microsoft Windows CE 6.0 | supplier-claimed |
| Memory | 256MB RAM / 8GB ROM, SD≤32GB | supplier-claimed |
| Display | 7″ TFT 800×480 touch | supplier-claimed |
| Power | 1200mAh battery, 12V car adapter, DC8–36V in | supplier-claimed |
| Maps | "latest maps 2025, free update"; regions US/EU/UK/AU via variants | supplier-claimed, unverified |
| Offline maps | implied by PND architecture + SD slot | unverified |
| Nav software | not named (no iGO/Autonavi/Sygic identified) | **missing** |
| Model number/manual | none provided | **missing** |
| Package contents | not itemized | **missing** |
| Demo/test evidence | none | **missing** |

**Verdict: `pending_product_verification`.** Supplier specs are consistent with a genuine standalone PND navigator and it is the only true GPS device sourced so far, but no independent evidence (manual, demo video, teardown, certification) exists. Do not market as verified GPS until a spec sheet/manual or sample is obtained.

## USA vs Canada shipping comparison

- **CJ products:** US = USPS end-to-end quotes (Ordinary/Remote/USPS+/USPS+VIP, 3–11d). CA = CJPacket/JYSP Sensitive economy lines (4–15d) — **not USPS**; two products have **no CA quote** (US-only for now).
- **EPROLO products:** all freight is 4PX/Yanwen/Yun/Jiayou economy (10–20d US, 8–15d CA) — **not USPS**, slower than CJ. No US/CA warehouse stock verified — all assumed CN origin.
- Delivery promises: none published; quotes are API-reported estimates, not guarantees.

## Pricing & contribution margin

Formula: `landed = cost + route shipping`; sell ≥ `landed/0.65` (35% GM floor); contribution = sell − landed − PayPal (3.49% + $0.49) − 5% refund reserve − $0.50 platform. **Contribution margin is NOT 35–40%** — it is what remains after those deductions.

| Product | Cost | US ship | Landed | Sell USD | GM% | Contribution |
|---|---|---|---|---|---|---|
| CJ motorcycle-navigation-display | $73.23 | $32.69 | $105.92 | $162.99 | 35.0 | $42.24 |
| CJ car-navigation-system-10-6 | $43.28 | $30.09 | $73.37 | $112.99 | 35.1 | $29.04 |
| EPROLO pnd-navigation-player | $43.86 | $25.08 | $68.94 | $107.05 | 35.6 | $28.03 |
| CJ navigation-installation-frame | $35.78 | $34.13 | $69.91 | $107.99 | 35.3 | $27.92 |
| CJ carplay-navigation-player | $41.22 | $27.11 | $68.33 | $105.99 | 35.5 | $27.67 |
| EPROLO carplay-screen-10-26 | $39.67 | $27.06 | $66.73 | $103.65 | 35.6 | $27.13 |
| EPROLO carlinkit-4-0 | $56.60 | $7.44 | $64.04 | $99.51 | 35.6 | $26.03 |
| CJ portable-car-navigation-display | $30.68 | $25.01 | $55.69 | $85.99 | 35.2 | $22.01 |
| EPROLO gps-navigator-7-inch | $31.00 | $16.61 | $47.61 | $74.23 | 35.9 | $19.33 |
| EPROLO carplay-mp5-7-inch | $25.44 | $20.00 | $45.44 | $70.89 | 35.9 | $18.44 |
| CJ gps-cycling-computer | $30.52 | $10.40 | $40.92 | $62.99 | 35.0 | $15.73 |
| EPROLO carplay-interface-box | $27.49 | $7.61 | $35.10 | $54.99 | 36.2 | $14.23 |
| CJ wireless-carplay-adapter | $22.89 | $8.39 | $31.28 | $48.99 | 36.2 | $12.56 |
| EPROLO hud-a900 | $13.77 | $11.38 | $25.15 | $39.68 | 36.6 | $10.17 |
| EPROLO wireless-carplay-adapter-box | $15.56 | $5.97 | $21.53 | $34.11 | 36.9 | $8.69 |
| EPROLO hud-obd2 | $12.23 | $8.82 | $21.05 | $33.37 | 36.9 | $8.50 |
| CJ vehicle-navigation-power-cable | $12.44 | $6.71 | $19.15 | $29.99 | 36.1 | $7.30 |
| CJ head-up-display | $9.78 | $6.41 | $16.19 | $24.99 | 35.2 | $5.69 |
| EPROLO motorcycle-usb-socket | $6.75 | $6.41 | $13.16 | $21.23 | 38.0 | $5.28 |
| EPROLO hud-gps-speedometer | $4.61 | $7.20 | $11.81 | $19.15 | 38.3 | $4.72 |
| EPROLO dual-usb-car-charger | $4.55 | $7.13 | $11.68 | $18.95 | 38.4 | $4.67 |
| CJ motorcycle-gps-power-adapter | $5.03 | $6.79 | $11.82 | $18.99 | 37.8 | $4.57 |
| EPROLO vent-magnetic-holder | $2.59 | $8.51 | $11.10 | $18.06 | 38.5 | $4.44 |
| CJ vehicle-navigation-mount | $2.10 | $9.15 | $11.25 | $17.99 | 37.5 | $4.22 |
| CJ folding-suction-mount | $2.10 | $8.31 | $10.41 | $16.99 | 38.7 | $4.15 |
| EPROLO universal-dashboard-holder | $1.18 | $8.91 | $10.09 | $16.51 | 38.9 | $4.03 |
| EPROLO magnetic-suction-holder | $1.26 | $8.51 | $9.77 | $16.02 | 39.0 | $3.90 |
| CJ magnetic-navigation-mount | $1.68 | $8.33 | $10.01 | $15.99 | 37.4 | $3.63 |
| CJ vent-navigation-holder | $1.15 | $6.93 | $8.08 | $12.99 | 37.8 | $2.82 |
| CJ dashboard-navigation-holder | $0.64 | $6.27 | $6.91 | $10.99 | 37.1 | $2.16 |

CAD prices are planning estimates (FX 1.38, 35% floor on CAD landed) — CAD freight differs from US and must be confirmed per product before Canadian sale. All 30 currently have CA freight data **except** the two CJ US-only items.

## Supplier verification summary

| Supplier | Identity | Warehouse | Route | Branding | Private label | Manufacturer |
|---|---|---|---|---|---|---|
| CJdropshipping | verified (API account active) | CN verified via inventory API; US verified for 2 SKUs | USPS/USPS+ end-to-end US quotes; CJPacket CA | storefront only | unverified | per-listing, mostly unbranded |
| EPROLO | verified (API account active) | **unverified** (assumed CN) | economy carriers only, verified per-variant quotes | storefront only | offered ($19.90/yr + per-order) but unconfirmed per SKU | Carlinkit 4.0 is third-party branded |

No product claims physical GPSLane branding, manufacture, certification or ownership.

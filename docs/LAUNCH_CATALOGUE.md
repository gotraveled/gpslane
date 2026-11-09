# GPSLane — Launch Catalogue (CJdropshipping)

**Date:** 2026-11-09 · **Status:** draft / pending_review — nothing published · **Source:** CJ API verified stock + USPS freight quotes · **Script:** `scripts/build-launch-catalogue.ts` → `data/cj/launch-catalogue.json` (gitignored, contains costs) → `scripts/import-catalogue.ts` stages into Payload as drafts.

**Criteria applied:** GPS navigation devices + accessories only; USPS shipping preferred; ~5–11 day delivery (faster US-domestic 3–7d accepted); 35%+ gross margin on landed cost; trackers/jammers/off-category items excluded.

## Navigation devices (6)

| GPSLane title | Slug | Warehouse | Stock | Ship (USPS) | USD | CAD* | Est. contribution |
|---|---|---|---|---|---|---|---|
| GPSLane Motorcycle Navigation Display | `motorcycle-navigation-display` | CN | 25,708 | USPS Ordinary 5–11d | $162.99 | $196.99 | ~$42 |
| GPSLane Portable Car Navigation Display | `portable-car-navigation-display` | CN | 25,523 | USPS 4–9d | $85.99 | $95.99 | ~$22 |
| GPSLane 10.6-inch Car Navigation System | `car-navigation-system-10-6` | CN | 160,638 | USPS 4–9d | $112.99 | $131.99 | ~$29 |
| GPSLane CarPlay Navigation Player | `carplay-navigation-player` | CN | 14,312 | USPS Ordinary 5–11d | $105.99 | $120.99 | ~$28 |
| GPSLane GPS Cycling Computer | `gps-cycling-computer` | CN | 40,000 | USPS 4–9d | $62.99 | $77.99 | ~$16 |
| GPSLane Wireless CarPlay Adapter | `wireless-carplay-adapter` | CN | 11,275 | USPS Remote 5–10d | $48.99 | $58.99 | ~$13 |

## Accessories (9)

| GPSLane title | Slug | Warehouse | Stock | Ship (USPS) | USD | CAD* | Est. contribution |
|---|---|---|---|---|---|---|---|
| GPSLane Navigation Installation Frame | `navigation-installation-frame` | CN | 80,000 | USPS Ordinary 5–11d | $107.99 | $117.99 | ~$28 |
| GPSLane Vehicle Navigation Mount | `vehicle-navigation-mount` | CN | 165,501 | USPS Ordinary 5–11d | $17.99 | $18.99 | ~$4 |
| GPSLane Air-vent variant | *(same product, variant)* | CN | — | — | — | — | — |
| GPSLane Dashboard Navigation Holder | `dashboard-navigation-holder` | CN | 165,190 | USPS Ordinary 5–11d | $10.99 | $11.99 | ~$2 |
| GPSLane Vent Navigation Holder | `vent-navigation-holder` | CN | 26,253 | USPS Ordinary 5–11d | $12.99 | $13.99 | ~$3 |
| GPSLane Folding Suction Navigation Mount | `folding-suction-navigation-mount` | CN | 20,000 | USPS Ordinary 5–11d | $16.99 | $17.99 | ~$4 |
| GPSLane Magnetic Navigation Mount | `magnetic-navigation-mount` | CN | 84,733 | USPS Remote 5–10d | $15.99 | $13.99 | ~$4 |
| GPSLane Motorcycle GPS Power Adapter | `motorcycle-gps-power-adapter` | CN | 14,873 | USPS Ordinary 5–11d | $18.99 | $21.99 | ~$5 |
| GPSLane Vehicle Navigation Power Cable | `vehicle-navigation-power-cable` | **US** (28) + CN | US 28 / CN 174k | USPS+ 3–7d (US→US) | $29.99 | $40.99 | ~$7 |
| GPSLane Head-Up Display | `head-up-display` | **US** (66) + CN | US 66 / CN 74k | USPS+ 3–7d (US→US) | $24.99 | $34.99 | ~$6 |

\* CAD prices are planning estimates at 1.38 FX — set explicitly before publishing; never auto-convert.

## Sourcing notes

- All 15 ship via **USPS** services (Ordinary / Remote / USPS+ / USPS+VIP) — meets the USPS preference.
- 13 products ship CN→US/CA in 4–11 days; 2 (power cable, HUD) fulfil from verified **US warehouse stock** in 3–7 days.
- CarPlay/Android displays are described as projection/navigation displays — **not** marketed as standalone GPS navigators unless GPS function is verified per listing.
- All products: `branding_unverified`, `brandingTier: generic` — GPSLane storefront titles only; no physical-branding claims.
- Supplier unit costs and landed-cost detail live only in `data/cj/launch-catalogue.json` (gitignored) and the staff-only `supplier-products` collection.

## Excluded from this pull

- GPS signal blocker/jammer — illegal in US/CA.
- "GPS positioner" belt unit — covert-tracking form factor, needs functional proof.
- Car vacuum, towels, heaters, pet seat belts, LED lights, engine stands, brake pads, reflective stickers, cup holder — off-category vehicle accessories.
- Tempered screen films — commodity, off-brand.
- Car stereo 7″ — GPS capability unverified.

## DSers / EPROLO status

- **DSers (AliExpress):** no verified US/CA-warehouse GPS stock; CN-generic units only — not used.
- **EPROLO:** free dropshipping platform, 13K+ suppliers, US/UK/EU/CN warehouses, 5–15d US delivery, no-MOQ branding — fashion-focused; GPS electronics assortment unverified, requires account to check. Candidate for future accessory/private-label evaluation.

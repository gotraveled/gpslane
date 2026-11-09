# GPSLane — Launch Catalogue Validation Report (Phase 7)

**Date:** 2026-11-09 · **Scope:** 15-product CJdropshipping catalogue · **Result:** all 15 pass validation; Payload import **blocked — no reachable database**.

## 1. Product validation summary

All 15 products verified via CJ API `productDetail/query` + `getInventoryByPid` + `freightCalculate`:

| # | GPSLane title | CJ PID | Type | Images | Orders | Dispute | Stock | Function class |
|---|---|---|---|---|---|---|---|---|
| 1 | Motorcycle Navigation Display | `1621030460279238656` | CarPlay/Android motorcycle screen (front+rear recording) | 6 | 0 | 0.00% | CN 25,708 | **projection display — NOT standalone GPS** |
| 2 | Portable Car Navigation Display | `1605840112464703488` | Portable wireless-projection car screen | 6 | 13 | 0.00% | CN 25,523 | **projection display — NOT standalone GPS** |
| 3 | 10.6-inch Car Navigation System | `1762433618531590144` | Full-touch Android head unit (13 variants) | 16 | 0 | 0.00% | CN 160,638 | Android unit — GPS capability **unverified** |
| 4 | CarPlay Navigation Player | `1640899139242307584` | CarPlay MP5 player | 5 | 1 | 0.00% | CN 14,312 | **CarPlay device — NOT standalone GPS** |
| 5 | GPS Cycling Computer | `1381795220596854784` | iGS50E cycling computer | 7 | 0 | 0.00% | CN 40,000 | **genuine GPS device** |
| 6 | Navigation Installation Frame | `1368761182843965440` | 9/10″ dash-kit frame | 5 | 0 | 0.00% | CN 80,000 | accessory |
| 7 | Vehicle Navigation Mount | `1372740742929321984` | phone/nav bracket (multi-variant) | 7 | 1 | 0.00% | CN 165,501 | accessory |
| 8 | Dashboard Navigation Holder | `1553294377827708928` | dashboard holder | 6 | 4 | 0.00% | CN 165,190 | accessory |
| 9 | Vent Navigation Holder | `1734143220638035968` | air-vent holder | 7 | 9 | 0.00% | CN 26,253 | accessory |
| 10 | Folding Suction Navigation Mount | `65C385B4-6A37-466C-9ACD-FD7890C41F4D` | suction mount | 6 | 0 | 0.00% | CN 20,000 | accessory |
| 11 | Magnetic Navigation Mount | `1564542997939892224` | magnetic mount | 16 | 72 | 0.00% | CN 84,733 | accessory |
| 12 | Motorcycle GPS Power Adapter | `2409070656521627500` | SAE→USB power adapter | 5 | 0 | 0.00% | CN 14,873 | accessory |
| 13 | Vehicle Navigation Power Cable | `1681189962663862272` | 100W USB-C car charger | 27 | 28 | 0.00% | **US 28** / CN 174k | accessory |
| 14 | Head-Up Display | `1428891025237217280` | HUD projector | 6 | 1 | 0.00% | **US 66** / CN 74k | accessory-adjacent |
| 15 | Wireless CarPlay Adapter | `1763160474423664640` | wired→wireless CarPlay adapter | 26 | 0 | 0.00% | CN 11,275 | adapter — projection class |

**GPS-function classification (per §1 requirement):**
- **Standalone GPS:** only #5 (cycling computer). Possibly #3 if its Android unit has real GPS — **unverified, must not market as GPS navigator**.
- **Smartphone-dependent projection (CarPlay/Android/MirrorLink):** #1, #2, #4, #15 — must be described as "navigation display / CarPlay screen", never "GPS navigator".
- **Accessories:** #6–#14.

## 2. Product-mix review

- Passes: genuine GPS device (1), projection displays serving navigation use-case (4), accessories (10).
- **No unrelated automotive products** in the set; trackers/jammers/films/off-category gear excluded.
- Weakness: only ONE true standalone GPS device — the catalogue leans on CarPlay/projection products. Honest marketing required.

## 3. Shipping validation

- **US-bound:** all 15 quote **USPS** services (Ordinary / Remote / USPS+ / USPS+VIP). USPS is the **end-to-end carrier shown by CJ's freight API** — first-mile handoff inside China not separately disclosed by the API; treat "USPS 4–11 days" as CJ's quoted estimate, not a guaranteed service level.
- **CA-bound:** **no USPS services exist** on CN→CA lanes — CA shipments use CJPacket/Sensitive services, 4–15 days, tracked. Two US-stocked items (#13, #14) returned **no US→CA quote** — Canadian shipping cost/delivery for those is **unverified**; do not sell to CA until quoted.
- **Warehouse origin:** #13/#14 verified US stock (28/66 units — thin); rest CN-verified via `getInventoryByPid`. No marketing claims of US fulfilment for CN items.

## 4. Pricing audit (USD)

All 15 sell prices ≥ 35% gross-margin floor; actual GM at sell price 35.0–37.8%. Contribution after PayPal 3.49%+$0.49, 5% reserve, $0.50 platform: **$2.16–$42.24** per order.

CAD prices are planning estimates (1.38 FX) — **must be set explicitly**; CA freight differs from US freight. `PricingSettings` global holds configurable margin/fee/reserve values for recalculation when costs change.

## 5. Branding

All titles carry `GPSLane` storefront branding; `brandingTier: generic`, `brandingStatus: branding_unverified` — **no physical-branding claims anywhere**.

## 6. Evidence gaps (honest)

- **Regulatory:** GPS devices with radio (wifi/BT/4G) sold in US/CA need FCC/ISED certification. CJ listings show `qualificationList`/`certificationMaterialList` fields — **per-product certification evidence not yet extracted/verified**. Blocks claiming compliance; does not block draft import.
- **Returns/RMA:** CJ platform-level returns policy applies; per-product defect/RMA terms unverified.
- **GPS specs:** screen sizes, RAM, GPS chipset unverified — descriptions are marketing HTML, not spec sheets.
- **US→CA freight:** missing for #13/#14.
- **CA-bound carrier:** non-USPS (CJPacket) — owner accepted "USPS preferred", not mandatory.

## 7. Payload import — BLOCKED

`DATABASE_URL` in `.env.local` points to `localhost:5432` but **no PostgreSQL is running** (no service, no Docker, port closed). `import-catalogue.ts` was fixed for ESM env-loading and is ready, but cannot connect. **Owner action needed:** provide a reachable `DATABASE_URL` (e.g., Neon) or start local Postgres, then run `npx tsx scripts/import-catalogue.ts`. Import will create draft/pending_review records only — idempotent via slug check.

## 8. Remaining launch blockers

1. Database provisioning (above).
2. Per-product spec verification + photography (CJ images exist; need selection/cropping).
3. FCC/ISED evidence for radio-enabled devices (#1–#5, #15).
4. US→CA freight quotes for #13/#14 or CA-delivery exclusion.
5. Product descriptions rewritten accurately (CarPlay ≠ GPS navigator).
6. Owner approval of final USD/CAD price list.
7. EPROLO API credentials received and stored in `.env.local` (`EPROLO_OPEN_API_KEY/SECRET`) — GPS catalogue check still pending; evaluate in a later phase.

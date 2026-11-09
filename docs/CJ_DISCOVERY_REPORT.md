# GPSLane — CJdropshipping Discovery Report (Phase 4)

**Date:** 2026-11-09 · **Account:** owner's new CJdropshipping account (API key in `.env.local`, gitignored) · **Mode:** read-only discovery — no orders, no purchases, no live fulfilment.

> Full raw data (product details, variants, stock, freight quotes, unit costs) lives in `data/cj/` — **gitignored**, contains supplier cost data. This report intentionally omits absolute unit costs; margins are percentages only.

## 1. Authentication — PASS

- `POST /api2.0/v1/authentication/getAccessToken` with `{apiKey}` → access token valid **2027-05-08** (~180 days). Server-side 24h token caching confirmed by docs.
- Token sent as `CJ-Access-Token` header on all subsequent calls. QPS=1 enforced client-side (~1.1s spacing).

## 2. Endpoints tested — all live

| Endpoint | Result |
|---|---|
| `GET /product/getCategory` | ✅ ~578 category nodes |
| `GET /product/listV2` (keyword, paging) | ✅ 15 searches × 20 results |
| `POST /product/productDetail/query` `{id}` | ✅ full detail incl. specs, images, scores |
| `GET /product/variant/query?pid=` | ✅ vid, SKU, price, weight, dimensions per variant |
| `GET /product/stock/queryByVid?vid=` | ✅ per-warehouse stock (see caveat below) |
| `POST /logistic/freightCalculate` | ✅ real US + CA quotes with carrier, price, ETA |

**Stock caveat:** `cjInventoryNum` = 0 for every sampled product; all stock is `factoryInventoryNum` (factory-direct, longer lead time). "In stock" on CJ ≠ CJ-warehouse stock — verify per product before promising fast dispatch.

## 3. Discovery volume

- 15 keyword searches → **136 unique products**, 15 excluded by tracker/locator filter → **121 eligible**, 40 detailed (variants + stock + freight).
- **Critical catalog finding:** CJ's GPS-navigator assortment is thin. Results are dominated by phone mounts, screen protectors, motorcycle accessories, HUD displays, MP5 players/frame hosts, and covert trackers (excluded). Genuinely relevant hits are few.

## 4. Products with US & CA shipping options

All 40 detailed products returned freight quotes for **both** US and CA (cheapest option per destination recorded). CA shipping is consistently ~15–25% cheaper than US.

## 5. Shortlist assessment (top candidates by fit, not just margin)

Margins below use the scorecard model (landed cost + PayPal ~3.49%+$0.49 + 5% refund reserve + platform cost) at heuristic retail multipliers — **screening estimates only; final pricing is explicit per product**.

### Tier 1 — Best GPSLane fit (verify specs before staging)

| CJ PID | Product | Cat | Stock | Ship US / CA (cheapest) | Est. margin |
|---|---|---|---|---|---|
| `1621030460279238656` | Smart Screen Front+Rear 1080P (motorcycle CarPlay/Android screen) | motorcycle-gps | ~13.5k | $23.33 / $19.30 | ~49% |
| `1605840112464703488` | Portable IPS Car Smart Screen wireless projection | automotive-gps | ~12.2k | $16.09 / $14.40 | ~49% |
| `1762433618531590144` | 10.26" Full-touch all-in-one car navigation device (13 variants) | automotive-gps | ~11.6k | $21.14 / $18.60 | ~49% |
| `1640899139242307584` | Universal CarPlay navigation MP5 player | automotive-gps | ~14.3k | $18.30 / $15.63 | ~49% |
| `1381795220596854784` | iGS50E GPS cycling computer | portable-gps | ~40k | $7.58 / $5.81 | ~49% |
| `ED5E3732-5C75-4D6D-A5F6-F6D84C6157CC` | GPS magnetic long-belt positioner | portable-gps | ~10.5k | $12.44 / $10.13 | ~49% |

### Tier 2 — Accessories with real demand signals (orderCount>0)

| CJ PID | Product | Cat | Stock | Ship US / CA | Est. margin |
|---|---|---|---|---|---|
| `1425659988868730880` | Car USB GPS signal interference blocker | power-cables | ~30.6k | $4.88 / $4.11 | ~56% (135 orders) |
| `1564542997939892224` | Rotate metal magnetic car phone holder | mounts-holders | ~10.7k | $5.71 / $4.64 | ~54% (72 orders) |
| `1734143220638035968` | Car phone holder vent dashboard | mounts-holders | ~14k | $6.17 / $5.00 | ~54% (9 orders) |
| `F059936F-4E09-486D-81FA-AF465860C898` | Waterproof motorcycle cover | cases-carrying | ~15k | $9.04 / $7.73 | ~56% (39 orders) |
| `1553294377827708928` | Car phone holder dashboard navigation | mounts-holders | ~40.8k | $5.56 / $4.54 | ~53% |
| `7C59DE5B-A511-4920-88A8-C808B21476EE` | Windshield car phone holder universal | mounts-holders | ~13k | $3.00 / $2.01 | ~56% |
| `1587815807701635072` | Magnetic air-vent car phone holder | mounts-holders | ~3.1k | $3.00 / $2.00 | ~55% |

### Tier 3 — Screen protectors / misc (high margin, low GPS specificity — owner decision)

Multiple tempered-film/screen-protector listings at ~52–56% est. margin with deep stock. These are commodity phone accessories — including them dilutes GPSLane brand focus; recommend at most 1–2 if owner wants accessory attach-rate.

## 6. Economic reality check

- **Heavy electronics shipping is brutal**: a ~$36 MP5 frame host costs ~$24 to ship to the US — landed cost ≈$60 before fees. At realistic market pricing ($70–90), margin compresses to ~15–25%, below the 15% floor in some scenarios. Devices need retail ≥2.5× landed cost.
- **Accessories are the margin engine**: $1–9 items with $2–7 shipping retain ~50%+ at sane price points ($15–35).
- Free-shipping promise (legacy policy) is **economically dangerous** on heavy CJ items — shipping must be priced in or selectively offered.

## 7. Missing / unverified supplier info

- **Certifications:** `qualificationList`/`hasCECertification` fields exist but were null/empty on sampled products — must verify per product before publishing electronics.
- **Private label:** `customization`/`isPersonalized` fields present; no product confirmed PL-eligible — requires per-product inquiry (endpoint 1.11 exists).
- **Return/defect terms:** not exposed via these endpoints — CJ platform policy + per-order dispute flow; document from account dashboard.
- **Product specs:** `propertyen` mostly "Ordinary" — spec sheets are thin; descriptions need supplier confirmation or omission.
- **CAD pricing:** CJ quotes are USD; CAD retail must be set explicitly (no FX).
- **Truck/RV and dedicated portable-navigator categories:** effectively absent from this keyword sweep — may need category-ID browsing (`getCategory` → category list) or different search terms in a second pass.

## 8. Integration issues & blockers

1. `productDetail/query` requires `{id}` not `{pid}` — documented fix applied.
2. `variant/query`, `stock/queryByVid`, `freightCalculate` all verified working.
3. Tracker spam dominates generic "GPS" keywords — exclusion filter mandatory in import tooling.
4. Webhook/order endpoints exist (`createOrderV2` + `isSandbox=1`) but were **not exercised** — order flow remains unverified until sandbox testing is explicitly approved.
5. Admin import UI (search→stage→review) is designed but not yet built — current path is scripts + Payload collections.

## 9. Recommended next steps

1. Owner reviews shortlist → approve 8–12 for staging (suggest: 2 motorcycle/automotive screens, 1 cycling computer, 3–4 mounts, 1–2 accessories, 1 signal blocker if brand-appropriate).
2. Second discovery pass via category IDs for truck/RV + portable navigators + antennas + cases (keywords underperformed).
3. Build admin "CJ import" screen on top of `src/lib/cj/client.ts`.
4. Sandbox order test (`isSandbox=1`) once owner approves.
5. Verify certifications/specs per shortlisted product via detail pages before publish.

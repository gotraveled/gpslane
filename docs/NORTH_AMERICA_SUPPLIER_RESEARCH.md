# GPSLane — North America Supplier Research (Phase 5)

**Date:** 2026-11-09 · **Source:** CJdropshipping API v2 (owner account, read-only) · **Method:** `countryCode`-filtered catalog scan → per-variant `getInventoryByPid` warehouse verification → `freightCalculate` quotes US→US / US→CA / CN→US / CN→CA.

> Raw data (unit costs, freight quotes) in `data/cj/` — gitignored. Costs omitted here; margins shown as prices/profit only.

## 1. Executive summary — the hard truth

- **US warehouse: real but shallow for GPS.** CJ's US warehouse stocks general vehicle/household goods (VEVOR tools, carriers, heaters). GPS-*specific* electronics are nearly absent — essentially **one** relevant device (Car HUD) plus generic vehicle accessories.
- **Canada warehouse: zero relevant stock.** `countryCode=CA` returned 0 results across 13 tested keyword families (gps, mounts, holders, chargers, motorcycle, carplay, stereo, cases, cables, antennas, truck, rv). Canadian customers must be served US→CA or CN→CA.
- **China warehouse: the actual GPS catalogue.** All Phase-4 GPS devices (screens, head units, cycling computer) are CN-stock only — allowed as flagged fallback per strategy §A.4.
- **No private-label evidence found.** CJ's packaging endpoints expose CJ's own packaging-product catalog, not PL services. `individualization/add` exists but per-product/supplier confirmation is required → **everything is `branding_unverified` until supplier confirms**.

## 2. Verified US warehouse products (stock confirmed via getInventoryByPid)

| CJ PID | Product | US stock | Category fit | Notes |
|---|---|---|---|---|
| `1428891025237217280` | Car HUD HD Head-up Display | 66 | automotive accessory | Only GPS-adjacent electronics with US stock |
| `1939569012321931265` | Car Stereo Autoradio 7" Touch Screen | 100 | car navigation system (verify GPS function) | Needs spec check — may be radio-only |
| `1681189962663862272` | Metal Car Charger 100W USB/C (cigarette lighter) | 28 | power cables/chargers | 28 CJ orders — demand signal |
| `1953028967254958082` | Motorcycle Carrier hitch 600lb | 866 | vehicle accessory (weak GPS fit) | Heavy/large — shipping risk |
| `1953077329429495809` | Motorcycle Wheel Chock | 90 | vehicle accessory | |
| `1917146169614041090` | Motorcycle scissor jack 300lb | 427 | vehicle accessory | |
| `2045337196703039489` | ATV/motorcycle engine dolly | 20 | vehicle accessory | |
| `1821454936031776768` | Car vacuum cleaner | 234 | vehicle accessory | 9 orders |
| `1851850527215603712` | 12V air heater car/RV/bus | 702 | vehicle accessory | |
| `1953135920534757378` | RV extension cord 30A 25ft | 449 | RV accessory | Good RV-category fit |
| `1955097636363993090` | Bike V-brake pads 5 pairs | 71 | bicycle accessory | |
| `1971116010725896194` | LED DRL daytime running lights | 460 | vehicle accessory | |
| `1909883128103481345` | Car engine repair stand | 156 | vehicle accessory | |
| `B07BA231-93FD-4A87-B941-38E84EF47060` | Reflective luminous stickers | 24 | safety accessory | 12 orders |
| `1386170811295076352` | Car seat-back storage bag | 1 | vehicle accessory | Thin stock |
| `41CAB303-4E96-4FE9-AE77-7762F0CC0E1C` | Car cup holder | 6 | vehicle accessory | Thin stock |
| `2407200305291611900` | Car microfiber towel | 27 | vehicle accessory | 84 orders |
| `1956654039511355394` | Pet car seat belt/leash | 476 | pet vehicle accessory | |
| `C4F25112-41EE-4C8C-9F7C-9B9F235B8CD9` | Car heating cushion | 10 | vehicle accessory | 21 orders |
| `1947152309840289794` | Pet dog seat belt for car | 11 | pet vehicle accessory | Thin stock |

**US→US freight caveat:** `freightCalculate` returned `$0` quotes for most US-stocked items (e.g., 98 methods for the motorcycle carrier) — likely CJ-included/seller-arranged shipping that only resolves at order time. **Do not advertise "free shipping" until confirmed per product.** Items with real quotes: car charger ~$7, storage bag ~$11.50, cup holder ~$6, towel ~$6.34, heating cushion ~$9.44.

**US→CA freight: API returned no quotes** for US-warehouse variants — Canadian delivery cost for US-stocked items is **unverified** and must be confirmed manually or via order-time calculation.

## 3. Verified Canadian warehouse products

**None found.** All tested keyword families returned 0 CA-warehouse results. Canada is served via US→CA or CN→CA only.

## 4. Supplier & private-label capabilities

| Capability | Status |
|---|---|
| CJ US warehouse | ✅ Verified via `globalWarehouseList` + `getInventoryByPid` |
| CJ CA warehouse | ✅ Exists (areaId 11) but no relevant stock |
| Packaging catalog (`packagingProduct/query`, `cjPackaging/query`) | ✅ Live — CJ's own packaging products (boxes, bags), NOT PL service |
| Individualization (`product/individualization/add`) | ⚠️ Endpoint exists; per-product/supplier terms unconfirmed |
| Private-label product | ❌ No product confirmed — all candidates `branding_unverified` |
| GPSLane-branded packaging | ❌ Not confirmed — requires CJ support inquiry |

## 5. CN-fallback GPS devices (warehouse_unverified — flagged per §A.4)

Real GPS electronics, all CN-stock only, with verified CN→US and CN→CA freight:

| CJ PID | Product | CN stock | CN→US ship | CN→CA ship | Role |
|---|---|---|---|---|---|
| `1621030460279238656` | Motorcycle CarPlay/Android screen (front+rear) | 25.7k | $23.33 (5-11d) | $19.30 (4-7d) | motorcycle navigation display |
| `1605840112464703488` | Portable car smart screen wireless projection | 25.5k | $16.09 (4-9d) | $14.40 (7-15d) | vehicle navigation display |
| `1762433618531590144` | 10.26" full-touch all-in-one car navigation (13 variants) | 160k | $21.14 (4-9d) | $18.60 (4-7d) | car navigation system |
| `1640899139242307584` | Universal CarPlay navigation MP5 player | 14.3k | $18.30 (5-11d) | $15.63 (4-7d) | car navigation system |
| `1381795220596854784` | iGS50E GPS cycling computer | 40k | $7.58 (5-11d) | $5.81 (7-15d) | GPS cycling computer |
| `ED5E3732-5C75-4D6D-A5F6-F6D84C6157CC` | GPS magnetic long-belt positioner | 10.5k | $12.44 (4-9d) | $10.13 (7-15d) | tracker-adjacent — **needs functional review; possibly covert-tracking form factor → likely exclude** |

## 6. Margin analysis (35% / 40% gross on landed cost; PayPal 3.49%+$0.49; 5% refund reserve; $0.50 platform)

CN-fallback devices (US-bound, landed = CN cost + CN→US freight):

| Product | Landed US | Price @35% | Price @40% | Contribution @35% price |
|---|---|---|---|---|
| Motorcycle screen | ~$96.56 | $148.55 | $160.93 | ~$38.42 (35.0%) |
| Portable smart screen | ~$46.77 | $71.95 | $77.95 | ~$18.12 (35.0%) |
| 10.26" head unit | ~$64.42 | $99.11 | $107.37 | ~$25.31 (35.0%) |
| CarPlay MP5 | ~$59.52 | $91.57 | $99.20 | ~$23.30 (35.0%) |
| Cycling computer | ~$38.10 | $58.62 | $63.50 | ~$14.57 (35.0%) |

US-warehouse items (landed = cost + quoted/estimated freight; $0-quote items use $0 pending confirmation — **optimistic, must re-verify**):

| Product | Landed US | Price @35% | Price @40% | Contribution @35% |
|---|---|---|---|---|
| Car charger 100W | ~$19.15 | $29.46 | $31.92 | ~$6.85 |
| Car stereo 7" | ~$40.56* | $62.40 | $67.60 | ~$15.55 |
| Car HUD | ~$16.19 | $24.91 | $26.98 | ~$5.64 |
| Motorcycle carrier | ~$117.52* | $180.80 | $195.87 | ~$46.94 |
| Motorcycle chock | ~$59.12* | $90.95 | $98.53 | ~$23.15 |
| Motorcycle jack | ~$178.51* | $274.63 | $297.52 | ~$71.83 |
| RV extension cord | ~$46.32* | $71.26 | $77.20 | ~$17.93 |
| Car vacuum | ~$45.93 | $70.66 | $76.55 | ~$17.77 |
| 12V air heater | ~$84.72* | $130.34 | $141.20 | ~$33.56 |
| Bike brake pads | ~$11.63* | $17.89 | $19.38 | ~$3.76 |
| LED DRL | ~$15.61* | $24.02 | $26.02 | ~$5.40 |
| Engine stand | ~$45.95* | $70.69 | $76.58 | ~$17.76 |
| Reflective stickers | ~$5.81 | $8.94 | $9.68 | ~$1.39 |
| Seat-back storage | ~$16.83 | $25.89 | $28.05 | ~$5.88 |
| Cup holder | ~$6.74 | $10.37 | $11.23 | ~$1.78 |
| Car towel | ~$6.91 | $10.63 | $11.52 | ~$1.84 |
| Pet seat belt | ~$10.22* | $15.72 | $17.03 | ~$3.19 |
| Heating cushion | ~$13.43 | $20.66 | $22.38 | ~$4.51 |
| Pet seat belt (2) | ~$12.47* | $19.18 | $20.78 | ~$4.10 |

`*` = freight quote returned $0 — landed cost optimistic; re-quote at order time before pricing.

**CAD:** CJ quotes are USD; CAD landed uses planning rate 1.38 for analysis only. Final CAD prices set explicitly — never FX-derived.

## 7. Rejected / excluded

- **GPS signal blocker/jammer** (`1425659988868730880`, CN) — GPS jammers are **illegal in US & Canada**; permanently excluded.
- **All trackers/locators** (15 found in Phase 4 sweep) — excluded per §C pending legal review; most are covert-tracking form factors unsuitable for GPSLane anyway.
- **CarPlay screens sold as "GPS navigators"** — functionality must be verified per listing; market as CarPlay/Android displays unless GPS capability confirmed.
- **Privacy screens, welding curtains, movie screens** — keyword noise, excluded.
- **Phone-tempered-film listings** — commodity, off-brand; excluded from shortlist.

## 8. Missing evidence & blockers

1. **US→CA freight for US-stocked items: no API quotes** — manual confirmation needed.
2. **$0 US→US quotes ambiguous** — confirm whether shipping is CJ-included at order time.
3. **No CA warehouse stock** — Canada served cross-border only.
4. **No private-label confirmation** — requires CJ support inquiry per product (MOQ, cost, lead time, logo method).
5. **GPS-specific US-warehouse electronics essentially absent** — options: (a) accept CN fallback for devices, (b) request CJ to source/stock US warehouse, (c) non-CJ US supplier for core devices.
6. **Car stereo GPS capability unverified** — needs spec-sheet check.
7. **Motorcycle "GPS positioner"** likely covert-tracking form factor — exclude unless proven otherwise.

## 9. Recommended shortlist for owner approval (12 items)

**US-warehouse verified (6):** car charger 100W, car stereo 7" (pending GPS-function check), Car HUD, RV extension cord, car vacuum, LED DRL — all `storefront_brand_only`/`branding_unverified`, `warehouse_verified` for US.

**CN-fallback flagged (6):** motorcycle CarPlay screen, portable smart screen, 10.26" head unit, CarPlay MP5, GPS cycling computer, +1 owner choice (motorcycle positioner pending review or a CN mount/accessory).

Heavy vehicle equipment (carrier, jack, chock, dolly, heater, engine stand, brake pads) — profitable but **off-category** for GPSLane; recommend only if owner wants to broaden into vehicle accessories.

## 10. Statuses applied

- All 26 reviewed products: `branding_unverified` (no PL evidence), `pending_review`.
- US-stocked items: `warehouse_verified` (US); CN devices: `warehouse_unverified` for NA preference (CN confirmed).
- Nothing published; no orders placed.

# GPSLane — Phase 11: Complete Catalogue Discovery

**Date:** 2026-11-09 · **Suppliers:** CJdropshipping + EPROLO · **Result:** 36 products imported (17 CJ + 19 EPROLO); 6 published; 30 remain drafts pending evidence.

## Coverage

### CJdropshipping

| Source | Coverage |
|---|---|
| Phase 4–7 keyword searches (`data/cj/search-*.json`, ~25 queries × 20 results) | ~500 result rows across GPS, navigation, mount, cable, antenna, truck/RV/motorcycle queries |
| `us-candidates.json` (US countryCode scan, 14 GPS keywords × ≤5 pages) | 360 unique products |
| `na-candidates.json` (CA+US inventory scan) | 62 products |
| Detail pulls (`detail-*.json`, ~50 products) | full specs/images/variants/inventory |
| Phase 11 targeted fetch (`phase11-candidates.json`) | 4 additional pids (Android MP5 player, Scout MP5 player, M22 HUD, car stereo) |

**API limitation:** CJ `listV2` returns max ~20/page and keyword search is fuzzy — generic terms ("screen", "mount") return large irrelevant sets. Coverage is keyword-driven, not exhaustive catalogue enumeration. Tracker/locator/jammer/surveillance results were excluded by policy.

### EPROLO

| Source | Coverage |
|---|---|
| `eprolo_product_list.html` category scans | Consumer Electronics (13), Phones & Accessories (9), Cars & Motorcycles (10) — ~2,900 products, paginated to exhaustion |
| Phase 11: Sports & Outdoors (26) | 877 products scanned to exhaustion |
| Candidates | 62 GPS-relevant (electronics/auto) + 31 sports-scan hits (mostly irrelevant bike gear; 4 genuine cycling computers) |

## Discovery funnel

| Stage | CJ | EPROLO | Total |
|---|---|---|---|
| Raw results scanned | ~960 | ~3,777 | ~4,737 |
| Unique products | ~420 | ~900 | ~1,320 |
| GPS-relevant | ~70 | ~93 | ~163 |
| Duplicates (vs existing 30) | ~45 | ~77 | ~122 |
| Excluded (trackers, surveillance, irrelevant, no-quote) | ~25 | ~55 | ~80 |
| **Imported** | **17** | **19** | **36** |
| Manual-review queue | 6 pending_product_verification | 11 pending_* | 17 |

## Phase 11 additions vs Phase 9 baseline

- **+3 CJ products:** `android-gps-navigation-player-7-inch` (Android GPS player), `gps-head-up-display-speed-compass` (M22 HUD), and corrected `mp5-gps-navigation-player-9-10-inch` (was mislabeled "navigation-installation-frame").
- **+4 EPROLO products:** CYCPLUS M1, Walker XOSS, iGPSPORT iGS10S, Magene McKim C406 — branded GPS cycling computers found in the Sports & Outdoors category.
- **−1 excluded:** CJ car stereo (MirrorLink, no GPS, no freight quote).
- **Tracker/locator exclusions:** ~15 CJ GPS-locator/tracker listings and EPROLO watch/detection products rejected per safety policy.

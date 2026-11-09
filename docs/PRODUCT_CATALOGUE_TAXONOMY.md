# GPSLane — Product Catalogue Taxonomy

Ten target categories from the brief. These are **organizing buckets, not availability claims** — a category may launch empty or with a "coming soon" state; no category page goes live without ≥1 published product.

## Category tree

```
shop
├── portable-gps              Portable GPS Navigation
│   └── (handheld/outdoor units, compact navigators)
├── automotive-gps            Automotive GPS Navigation
│   └── (dashboard-mounted car units, CarPlay-adjacent navigators)
├── truck-rv-gps              Truck & RV Navigation
│   └── (large-screen, truck routing, RV-specific — "where available")
├── motorcycle-gps            Motorcycle Navigation
│   └── (vibration-proof pods, helmet/handlebar mounts)
├── mounts-holders            GPS Mounts & Holders
│   └── (suction, dash, cradle, anti-vibration)
├── power-cables              Power Cables & Chargers
│   └── (12V/24V vehicle chargers, USB cables, hardwire kits)
├── antennas                  GPS Antennas & Replacement Parts
│   └── (shark-fin, magnetic, extension antennas)
├── cases-carrying            Cases & Carrying Accessories
│   └── (hard shells, sleeves, bags, screen protectors)
├── storage-connectivity      Storage & Connectivity Accessories
│   └── (microSD cards, USB drives, map-update media, cables)
└── trackers                  Vehicle GPS Trackers  [SECONDARY]
    └── (real-time trackers — gated: legal/compliance review before publish)
```

## Rules

- **Slugs** are new URLs (no legacy equivalents) — free choice, keep lowercase-hyphenated. They live under `/shop/[category]` or `/category/[slug]` [design decision: recommend `/shop/[category]` for shallower architecture; final in route spec].
- **Trackers gated**: category hidden until owner approves legal review (covert-tracking laws vary US state-by-state and CA federal/provincial). Publish only with clear lawful-use copy.
- **Truck/RV & motorcycle** marked "where available" — launch only if CJ actually stocks suitable units; otherwise hold category.
- Each category: `slug`, `name`, `description` (original copy), `image`, `seo` group, `sortOrder`, `isActive` flag, `requiresReview` flag (trackers=true).
- Product↔category is many-to-many (a mount fits multiple device categories via accessories cross-listing) — product still has ONE primary category for breadcrumbs.

## Product attribute schema (per category facets)

Common: screen size, resolution, OS, RAM/storage, battery, connectivity (BT/WiFi/FM), map regions (US/CA/world), certifications, weight, dimensions, what's-in-box, warranty.

Category-specific facets stored as structured `attributes` jsonb + rendered spec table:
- devices: screenSizeIn, cpu, ramGb, storageGb, batteryMah, waterproofRating (motorcycle), mountType
- mounts: mountType (suction/dash/cradle/magnetic), deviceCompatibility notes
- cables: voltage (12V/24V), connector type, lengthM
- antennas: connector (SMA/MMCX), gainDbi, type (sharkfin/magnetic/patch)
- trackers: connectivity (4G/Bluetooth), battery, subscription requirement **(flag: recurring-cost products need honest copy — "requires data plan" is a material fact)**
- storage: capacityGb, class rating, format

## Compatibility-data policy

- `compatibilityNotes` field allowed ONLY when substantiated (supplier spec sheet or manufacturer documentation). Wording like "fits most 1/4-20 mounts" is fine; "compatible with Garmin Dezl" requires evidence.
- No manufacturer names used as GPSLane branding; mentioning "works with standard microSD" is factual, "Garmin-compatible antenna" needs the connector spec to be true.
- Spec table renders only attributes with sources; empty specs → omit section rather than fabricate.

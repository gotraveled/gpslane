# GPSLane — Phase 11 Compliance Report

## Radio-device certification (FCC/ISED)

| Category | Products | Status |
|---|---|---|
| Passive accessories (no radio) | 6 published + power cable, HUD, frame | `not_applicable` — publishable |
| Radio devices (Wi-Fi/BT/GPS/cellular) | 24 drafts | `pending_evidence` — **must remain unpublished until cert docs obtained** |

Evidence status: no FCC ID or ISED certificate has been obtained for ANY product. Supplier-level CE qualification exists for the CJ 10.6″ unit only. EPROLO A900 HUD *claims* "CE, ROHS, FCC" in spec text — treated as unverified claim, not evidence.

**Blocker for launch of electronics:** before publishing any screen, adapter, HUD, GPS unit or cycling computer, obtain manufacturer FCC ID (US) and ISED (Canada) documentation matching exact model.

## Product-safety exclusions (enforced)

- GPS trackers/locators: excluded (~15 CJ listings).
- Surveillance-adjacent (signal detectors, hidden cameras): excluded.
- Jammers/interference devices: excluded.
- GPS smartwatches/kids' watches: excluded (off-focus wearables).
- Drones: excluded.

## Privacy & data

- Public REST API exposes only `status=published` products and `status=active` variants — drafts are invisible publicly (verified: draft slug returns 0 docs, supplier-products 403).
- `launchVerification`, `scorecard`, supplier costs, API IDs: staff-read-only fields/collections.
- Map-update request form collects only needed fields; no payment data.
- Privacy policy published disclosing collection, sharing (fulfilment partners, PayPal) and deletion rights.

## Claims compliance

- No GPS functionality claimed as verified anywhere public.
- No warehouse/carrier claims beyond quoted evidence.
- No certification claims.
- Terms prohibit unlawful surveillance use.

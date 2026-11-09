# GPSLane — Phase 11 Supplier & Shipping Report

## Supplier verification matrix

| Check | CJdropshipping | EPROLO |
|---|---|---|
| Supplier identity verified | ✅ API account active | ✅ API account active |
| Warehouse origin verified | ✅ CN via inventory API (all); US stock verified for 2 SKUs | ❌ assumed CN — unverified |
| Shipping route verified | ✅ end-to-end quotes: USPS/USPS+/USPS+VIP (US), CJPacket/JYSP (CA) | ⚠️ economy carriers only (4PX/Yanwen/Yun/Jiayou), quotes verified per variant |
| Branding capability verified | ⚠️ unverified | ⚠️ program exists ($19.90/yr + per-order), unconfirmed per SKU |
| Physical private-label verified | ❌ | ❌ |
| Manufacturer identified | per-listing, mostly unbranded | Carlinkit 4.0, CYCPLUS, iGPSPORT, Magene, Walker (named on listings) |

## USA vs Canada shipping

| Lane | CJ | EPROLO |
|---|---|---|
| USA | USPS Ordinary/Remote/+/VIP — 3–11 days quoted | 4PX/Yun/Jiayou — 7–20 days quoted |
| Canada | CJPacket Ordinary / JYSP Sensitive — 4–15 days | JIAYOU/YANWEN — 7–15 days |
| Gaps | power-cable + HUD: **no CA quote** → US-only | none missing, but all economy-tier |

Rules enforced: no US prices copied to Canada; no USPS claims for CJPacket/EPROLO economy lines; delivery ranges shown as estimates.

## Availability model

`product-variants.availability[]` stores per-country {available, shippingCostCents, etaMinDays, etaMaxDays, serviceName}. Currently populated only for the 6 published products (US+CA each). Draft products get availability populated at publish time from supplier-products.shippingQuotes.

## Returns

Supplier return locations unverified for both — returns handled by GPSLane per published policy; supplier-level return evidence still pending.

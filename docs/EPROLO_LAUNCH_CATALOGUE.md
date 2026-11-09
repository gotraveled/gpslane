# GPSLane — EPROLO Launch Catalogue (Phase 7)

**Status:** 15 products imported into Payload/Neon as **draft + pending_review + unpublished**. No orders, no charges, no publishing.

## Source

EPROLO open API (`openapi.eprolo.com`), authenticated via `apiKey` header + `sign=MD5(apiKey+timestamp+apiSecret)`. Client: `src/lib/suppliers/eprolo.ts`. Products staged in the EPROLO account import list via `add_product.html` (16 products; no purchase).

## Devices (navigation-relevant)

| GPSLane title | EPROLO platform ID | Type | Cost | US ship | CA ship | Sell (USD) |
|---|---|---|---|---|---|---|
| 7-Inch Portable GPS Navigator | `30816802` | **Standalone GPS** (MSTAR 2531, GPS receiver, WinCE, regional maps) | $31.00 | $16.61 (10–18d) | $12.59 (8–15d) | $74.23 |
| 10.6-Inch Portable CarPlay/Android Screen | `30605296` | Projection display | $39.67 | $27.06 | $20.41 | $103.65 |
| 7-Inch Wireless CarPlay MP5 | `30212551` | Projection display | $25.44 | $20.00 | $15.90 | $70.89 |
| PND Navigation Player + Dashcam | `29572817` | PND — GPS unverified | $43.86 | $25.08 | $19.04 | $107.05 |
| CarPlay/Android Auto Interface Box | `26727255` | Adapter (18 variants) | $27.49 | $7.61 | $5.92 | $54.99 |
| Wireless CarPlay Adapter Box | `27777277` | Adapter | $15.56 | $5.97 | $4.64 | $34.11 |
| Carlinkit 4.0 CarPlay Adapter | `20204559` | Adapter — **branded, pending review** | $56.60 | $7.44 | $5.82 | $99.51 |
| HUD GPS Speedometer | `26713049` | HUD | $4.61 | $7.20 | $5.64 | $19.15 |
| OBD2 HUD | `1600184` | HUD | $12.23 | $8.82 | $7.16 | $33.37 |
| A900 HUD | `1599978` | HUD | $13.77 | $11.38 | $8.88 | $39.68 |

## Accessories

| GPSLane title | Platform ID | Cost | US ship | Sell |
|---|---|---|---|---|
| Magnetic Suction Navigation Holder | `29719368` | $1.26 | $8.51 | $16.02 |
| Vent-Mount Magnetic Holder | `29971751` | $2.59 | $8.51 | $18.06 |
| Universal Dashboard Holder | `10719202` | $1.18 | $8.91 | $16.51 |
| 36W Motorcycle USB Socket | `10607586` | $6.75 | $6.41 | $21.23 |
| Dual USB Car Charger | `1718270` | $4.55 | $7.13 | $18.95 |

All prices ≥ 35% gross-margin floor on landed cost (product + cheapest quoted freight). CAD prices are planning estimates pending explicit CAD freight confirmation.

## Honest limitations

- **Carriers are NOT USPS** — quoted lines are 4PX / Yanwen / Yun Express / Jiayou economy services, 10–20 days US, 8–15 days CA. Slower and less premium than CJ's USPS quotes.
- **Warehouse origin unverified** — assumed CN; do not advertise US fulfilment.
- **EPROLO "US warehouse" claims unverified** for these SKUs.
- PND player GPS reception unverified; Carlinkit is a third-party brand.
- `storefront_brand_only` everywhere; physical branding available via EPROLO ($19.90/yr + per-order) but unconfirmed per SKU.
- Regulated-radio certification (FCC/ISED) not yet evidenced.

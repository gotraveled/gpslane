# GPSLane — Phase 11 Pricing Report

## Method

`landed_cost = product_cost + destination_shipping_cost`
`price_at_35% = landed / 0.65` · `price_at_40% = landed / 0.60`
Contribution = price − landed − PayPal (3.49% + $0.49) − 5% refund reserve − $0.50 platform.

**Contribution margin is NOT 35–40%** — gross margin is; contribution is after payment/reserve/platform deductions.

## Published products (US lane, landed → sell → contribution)

| Product | Cost | Ship | Landed | Sell USD | GM% | Contribution |
|---|---|---|---|---|---|---|
| vehicle-navigation-mount | $2.10 | $9.15 | $11.25 | $17.99 | 37.5 | $4.22 |
| dashboard-navigation-holder | $0.64 | $6.27 | $6.91 | $10.99 | 37.1 | $2.16 |
| vent-navigation-holder | $1.15 | $6.93 | $8.08 | $12.99 | 37.8 | $2.82 |
| folding-suction-navigation-mount | $2.10 | $8.31 | $10.41 | $16.99 | 38.7 | $4.15 |
| magnetic-navigation-mount | $1.68 | $8.33 | $10.01 | $15.99 | 37.4 | $3.63 |
| motorcycle-gps-power-adapter | $5.03 | $6.79 | $11.82 | $18.99 | 37.8 | $4.57 |

CAD prices stored per variant (`prices[]` currency=cad) using CAD freight + FX planning estimate — flagged for confirmation before Canadian marketing push.

## Draft catalogue pricing (all ≥35% GM floor)

Full 36-product table in `PHASE_9_PRODUCT_VERIFICATION_REPORT.md` + Phase 11 additions:

| New product | Landed US | Sell USD | Contribution |
|---|---|---|---|
| android-gps-navigation-player-7-inch | $118.06 | $181.64 | $47.17 |
| mp5-gps-navigation-player-9-10-inch (corrected) | $75.08 | $115.51* | ~$29 |
| gps-head-up-display-speed-compass | $27.82 | $42.80 | $10.36 |
| cycplus-m1-racer-plus | $44.20 | $68.99 | ~$17 |
| walker-xoss | $19.09 | $30.35 | ~$7 |
| igpsport-igs10s | $35.53 | $55.65 | ~$13 |
| magene-mckim-c406 | $53.13 | $82.72 | ~$20 |

*variant price updated to $111.33 USD / $134.99 CAD in Payload.

## Pricing settings

`PricingSettings` global exists for configurable rules; current imports used the approved 35% floor formula. No hardcoded rates in storefront — prices come from variant records.

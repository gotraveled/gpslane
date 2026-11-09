# GPSLane — Product Selection Scorecard

Every candidate product is scored before staging. Output is a reviewable sheet (admin export or doc) the owner approves/rejects per SKU. **Cost data is admin-only — never rendered to customers.**

## 1. Contribution-margin model

Per variant, per currency (compute for USD and CAD separately):

```
landedCost  = unitCostCents
            + shippingCostCents(destination)        // CJ logistics quote or observed range
            + packagingCostCents                     // 0 unless branded packaging confirmed
            + paymentFeeCents                        // PayPal: ~3.49% + fixed (verify current rate)
            + refundReserveCents                     // expectedRefundRate × avgRefundCost
            + platformAllocCents                     // Vercel/infra allocation (small)

contributionMargin$ = salePriceCents − landedCost
contributionMargin% = contributionMargin$ / salePriceCents
breakEvenPriceCents = landedCost / (1 − paymentFeeRate − refundReserveRate)
```

**Inputs marked EST until verified in account:** CJ unit cost, per-destination shipping quotes, PayPal merchant rate, observed refund rate (start 5% reserve for electronics).

**Thresholds (proposed, owner-tunable in admin settings):**
- Reject if margin% < 15% at target retail price.
- Reject if break-even price > category price ceiling (keeps us competitive).
- Flag (not reject) if shipping ETA > 20 business days or US/CA stock < 50 units.

## 2. Scoring rubric (0–5 each, weighted)

| Criterion | Weight | 5 = | 1 = |
|---|---|---|---|
| Relevance to GPSLane assortment | 20% | core GPS/accessory, matches brand | tangential electronics |
| Supplier reliability | 15% | high order count, low dispute rate, verified warehouse | new/unknown supplier |
| Destination availability | 15% | in-stock US **and** CA | one or neither |
| Shipping economics | 15% | free/cheap shipping, <10 biz days | expensive/slow |
| Margin potential | 15% | ≥30% at viable retail | <15% |
| Product quality risk | 10% | certifications, specs, few returns | vague specs, high return category |
| Branding potential | 5% | packaging/PL confirmed | none |
| Legal/compliance | 5% | clean (no restricted claims) | trackers w/o review, cert gaps |

**Score = Σ(weight × score)/5 → 0–100.** Auto-thresholds: <50 reject-review, 50–70 owner review, >70 recommended.

## 3. Per-candidate worksheet fields

```
cjProductId, cjUrl, title, category, variantCount
unitCostUsd, shippingUsd, shippingCad, stockUs, stockCa
etaDaysUs, etaDaysCa, certifications[], brandingTier, brandingEvidence
computed: landedCostUsd/Cad, breakEvenUsd/Cad, marginAtPriceUsd/Cad
scores per criterion + total → decision: approve / reject / pending_review
reviewer, reviewedAt, notes
```

## 4. Pricing rules

- USD and CAD retail prices set **explicitly per product** (no FX formula). Suggested starting point: `retail ≈ landedCostUsd × categoryMultiplier`, multiplier per category set in admin (e.g., devices 2.2–2.8×, accessories 2.5–3.5×) — then owner adjusts.
- `compareAtPrice` optional; only use when a genuine former price exists — no fabricated "was" prices.
- Never expose cost/margin fields in storefront API responses — enforced by Payload field-level access control (`access.read` admin-only on cost fields).

## 5. Review workflow

1. Import stages candidate as `sourcingStatus: pending_review` + scorecard snapshot.
2. Admin "Sourcing review" queue sorts by score; owner sets decision + optional price override.
3. Approved → product enters pricing step (USD+CAD entry required) → `published`.
4. Rejected → retained for audit (never deleted; `archived`).
5. Quarterly re-score: cost/stock drift triggers re-review flag on mapped products.

## 6. Red flags (auto-reject regardless of score)

- Product requires removing certification marks or falsifying specs.
- Category is restricted (e.g., trackers pending legal review).
- Unit cost + shipping exceeds plausible retail for the niche.
- Supplier listing shows prohibited content or IP-infringing branding.
- Variant-level stock is zero in both US and CA.

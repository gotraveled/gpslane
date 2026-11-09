# GPSLane.com — Commerce & Integration Audit

**Date:** 2026-11-09. All findings verified against live HTML/headers or explicitly marked unverified.

## 1. Store platform

- **Hostinger Website Builder e-commerce**, store ID `store_01K9MZQ8TNAA0HZ16538GDPKAX`.
- Product blocks identified as `ecommerce-dynamic-product` with internal IDs `prod_01K9NEP8…` (7 products).
- Cart is a client-side drawer/modal ("Add to bag", "Shopping bag is empty", "Checkout" strings in i18n payload); `/cart` is 404, `/checkout` returns 200.
- Checkout modal strings indicate Hostinger's built-in checkout with express-checkout support and out-of-stock handling. **Actual payment methods enabled are not visible in public HTML** — site copy claims PayPal only; Hostinger typically offers Stripe + PayPal. **Must be confirmed in the Hostinger dashboard.**

## 2. Product catalogue (verified from JSON-LD + page markup)

| Hostinger product ID | Slug | Price (sale) | Compare-at | JSON-LD stock |
|---|---|---|---|---|
| prod_01K9NEP82KKFYDPJ4HRX287X0V | gpslane-drive-7-hd-gps-navigation-unit | $159.99 | $189.99 | InStock |
| prod_01K9NEPAG1N4M0P5D5J8AMQ6PS | gpslane-accessory-kit-car-mount-and-32gb-microsd | $89.99 | $99.99 | InStock |
| prod_01K9NEP84JCD9WT3FH1SPTHEYK | gpslane-compact-5-car-gps-navigator | $149.99 | $179.99 | InStock |
| prod_01K9NEPAEYP7QCD13KSHBXX6VF | gpslane-navigator-travel-edition-gps-unit | $149.99 | $192.99 | InStock |
| prod_01K9NEPADS7PNX05J19SX9Y9YV | gpslane-premium-car-gps-unit-8 | $179.99 | $219.99 | InStock |
| prod_01K9NEP88AP26XAP3FQZ9T9X2C | gpslane-fleettracker-pro-gps-device | $259.99 | $299.99 | InStock |
| prod_01K9NEP872B1JMTQ4JSJ77HCKE | gpslane-navigator-essentials-bundle | $99.99 | $138.99 | InStock |
| prod_01K9NEP85NBY2JX9YNHWAKGP7S | gpslane-truckpro-9-wide-gps-navigator | $229.99 | $299.99 | InStock |

- No public SKUs, variants, or inventory quantities exposed. Variants: none observed (each product appears single-variant).
- Images hosted on `cdn.zyrosite.com/cdn-ecommerce/...` — **must be downloaded and re-hosted** before the Hostinger plan lapses, or product imagery will break.
- Note: the "Navigator Essentials Bundle" sells at $99.99 — identical to the map-update service fee. Verify this is intentional and not a data-entry error.

## 3. Fulfilment workflow (as described by the site — unverified operationally)

From Shipping & Returns, FAQs, and About Us copy:

1. Customer orders on site → payment via PayPal.
2. Team "verifies your order, confirms payment via PayPal, and **forwards your order to our shipping partner**" (processing 2–5 business days).
3. Sourcing described as "verified international suppliers, including **AliExpress partners**"; units are "unbranded, high-quality GPS units".
4. After-sales/customer service run from Mohali, Punjab, India (Mon–Sat 9 AM–7 PM IST).
5. Tracking number emailed after dispatch; delivery 10–20 business days US/CA; free shipping US/CA only.
6. Returns: 7-day window, RA process via email; refunds 5–10 business days to original payment method; cancellations within 24h if unshipped; orders delayed >30 business days eligible for replacement/refund.

## 4. CJdropshipping — UNVERIFIED

- **No evidence of CJdropshipping on the live site**: no mention in copy, no API/webhook artifacts, no CJ product IDs or SKUs.
- The brief states products "are already listed and connected to CJdropshipping" — this may refer to an off-site workflow (e.g., orders manually re-created in the CJ dashboard) that is invisible to the website.
- **Action required:** owner must confirm (a) whether CJdropshipping is actually used, (b) whether products exist in the CJ catalog with matching SKUs, (c) whether CJ API credentials exist, (d) how orders currently reach CJ (manual vs. automated).
- CJdropshipping's documented integration paths (verified against public docs at audit time): CJ Open API (product sync, order creation `v1.0/product/query`, order fulfillment endpoints), Payoneer/Wishlist imports, and manual order placement. Webhook support is limited — order/tracking status typically requires polling or email parsing. Final design must be re-verified against current CJ API docs before implementation.

## 5. Map-update service ($99.99)

- Not a shippable product — a **manual service**: request form → technician phone call → PayPal invoice → guided remote install.
- Forms: Hostinger-hosted forms (tokens observed in page payloads), fields: name, email, GPS model/serial, phone. Submissions presumably emailed to `info@gpslane.com`. Destination must be confirmed.
- Contact page has a second Hostinger form (name, last name, email, message).
- **Migration requirement:** replace with a real forms pipeline (DB + notification email, or transactional email service). Preserve form fields exactly; do not imply automation that doesn't exist.

## 6. Payments

- Site-wide copy: "Secure PayPal Payments", "we never store your card details", refunds "to your PayPal account or credit card".
- Hostinger checkout may support additional methods — **confirm in dashboard before migration**.
- Decision needed for rebuild: keep PayPal-only (matches copy, simpler) vs. Stripe (better Next.js ecosystem, supports cards + PayPal). Never handle raw card data — use hosted checkout/Payment Element only.

## 7. External integrations & credentials inventory

| Integration | Evidence | Status |
|---|---|---|
| Google Ads tag `AW-17799807671` | gtag.js in `customBodyElements` site-wide | Active — must be preserved |
| GA4 | None found | Absent — recommend adding |
| Search Console verification | Not visible in HTML meta; may exist via DNS | Unknown — owner to confirm |
| PayPal | Referenced in copy; checkout internals hidden | Partially verified |
| Hostinger forms | Form tokens in page payloads | Active; destination unknown |
| "Live Chat" | Claimed in copy on 4+ pages | **No widget detected — unsupported claim** |
| Social profiles | Footer links point to bare `facebook.com/`, `instagram.com/`, `twitter.com/` | Placeholders — not real profiles |
| Email | `info@gpslane.com` | MX/forwarding unknown |
| Phone | (888) 400-3290 toll-free | Verify ownership/porting |
| CJdropshipping | None visible | **Unverified — see §4** |

## 8. Data that must be exported before decommissioning Hostinger

1. Product catalogue: titles, descriptions, prices (sale + compare-at), images, stock, any variants/SKUs, categories.
2. Order history (if accessible) for customer records and accounting.
3. Form submission history (map-update requests, contact messages) — these are leads; losing them loses revenue pipeline.
4. DNS records and any email hosting tied to the domain.
5. Hostinger ecommerce settings: tax rules, shipping zones, coupon codes, payment gateways.

## 9. Key risks

- **Highest risk:** discovering the "CJdropshipping connection" doesn't exist as described, requiring a fulfilment workflow to be built from scratch (order → CJ API → tracking sync).
- **Second:** product/order data trapped in Hostinger with no export path → manual CSV capture needed while subscription is active.
- **Third:** payment method mismatch between site promises (PayPal) and actual checkout capabilities.

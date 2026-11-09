# GPSLane — Map Update Service Workflow

Core business line #1: device identification → guided update assistance → transparent paid service. This is a **service pipeline**, not a checkout product — it must never promise proprietary map files, activation keys, or updates we cannot legitimately deliver.

## 1. Service journey (customer-facing)

```
/home or /gps-maps-updates CTA
  → STEP 1 Device identification
      "What device do you have?" — brand-agnostic fields:
      manufacturer (generic list: Garmin/TomTom/insignia brands/"unbranded"/"not sure"),
      model name or serial, screen size, approximate age
      → powers compatibility pre-check (rules-based, see §3)
  → STEP 2 Region & current state
      country (US/CA), current map version (free text + "don't know"),
      how maps were originally obtained (manufacturer site / SD card / unknown)
  → STEP 3 Update-method questions
      does device have Wi-Fi? screen type? who made the maps?
      (determines which legitimate path applies)
  → STEP 4 Eligibility review (automated pre-screen + human confirm)
      outcome buckets:
        a) OFFICIAL_FREE   — manufacturer offers free official update
                             → we explain the free path, no charge
        b) OFFICIAL_PAID   — official maps exist but cost money
                             → we explain official purchase, optionally assist
        c) ASSIST_ELIGIBLE — unbranded/older unit, no official channel;
                             paid assistance may apply ($99.99 legacy price — [PENDING] confirm current price)
        d) NOT_ELIGIBLE    — explain why, suggest alternatives (new device)
  → STEP 5 Transparent pricing
      only chargeable outcomes (c, sometimes b-assistance) show price +
      what's included BEFORE any payment request
  → STEP 6 Request submission
      contact details + service summary → map_update_requests record
  → STEP 7 Notifications & support
      auto-acknowledgment email → technician review → phone/email contact
      → quote/invoice (PayPal) → guided session → completion confirmation
```

## 2. Data model additions (extends DATABASE_SCHEMA.md)

**`map_update_requests`** (refined):

| field | type | notes |
|---|---|---|
| requestNumber | `MU-YYYY-NNNN` unique | |
| fullName, email, phone | | contact |
| deviceManufacturer, deviceModel, deviceSerial, screenSizeIn, deviceAgeBand | | identification |
| country | us/ca | |
| mapVersion, mapSource, hasWifi | | state |
| eligibilityOutcome | enum: official_free / official_paid / assist_eligible / not_eligible / pending_review | set by rules + human override |
| quotedPriceCents, currency | int nullable | only for chargeable outcomes |
| status | new → in_review → quoted → accepted → in_progress → completed / declined / closed | |
| assignedTo | → users | technician |
| notes, internalFlags | | |
| createdAt/updatedAt | | |

**`service_offerings`** (configurable service catalog):
| code | name | priceCents by currency | description | active | requiresCompatibilityCheck |
e.g. `map_update_assist` $99.99 USD [PENDING confirm], `map_update_guided_premium`, `device_setup_assist`.

**`compatibility_rules`** (admin-editable, versioned):
| manufacturerPattern, modelPattern, screenSize, outcome, reason, officialUpdateUrl, reviewedAt, reviewedBy |
— rules engine suggests outcome; **human always confirms before quoting**. Rules are data, not code, so staff update them without deploys.

## 3. Eligibility rules (initial seed — conservative)

- Manufacturer has known free update program (e.g., certain brands' web updaters) → `official_free` with link.
- Manufacturer sells maps officially → `official_paid` + we can offer paid assistance as add-on.
- Unbranded/generic unit, no official channel, customer owns device → `assist_eligible` candidate → human verifies model before quoting.
- Device not a GPS / not customer-owned / suspicious → `not_eligible`.
- **Never** output `assist_eligible` automatically without human review in v1.

## 4. Honest-capability rules (hard constraints)

- We assist with updates the customer is entitled to make; we do **not** provide pirated/proprietary map files, cracked activations, or bypass licenses.
- Where maps are officially free → we say so and give the official path (builds trust; the DIY guide already supports this).
- Copy distinguishes: "free official update" vs "paid setup assistance" vs "official map purchase guidance" — three different things, never blurred.
- No uptime/"guaranteed update" promises beyond "we assist until successful or refund per policy" (align with existing policy language; legal review).

## 5. Notifications & workflow

- Auto-acknowledgment on submit (Resend template) with realistic response time (current site claims 24h; hours are Mon–Sat IST — copy must match reality).
- Internal: new request → dashboard widget + optional email to support inbox.
- Status emails at: review complete (outcome + next step), quote sent, payment received, session scheduled, completed.
- Payment: PayPal invoice/payment link [PENDING: confirm mechanism — PayPal Invoicing API vs. manual link]. No card data touches us.
- Every status change → `activity_logs` + optional internal note; assignment to technician.

## 6. Admin screens (extends ADMIN_PANEL_DESIGN.md)

- **Service requests queue**: filter by status/outcome/assignee; detail view with device info, rules-engine suggestion vs. human outcome, quote actions, notes timeline.
- **Compatibility rules editor**: CRUD on `compatibility_rules` with review metadata.
- **Service offerings editor**: prices per currency, active flags.
- **Funnel metrics** (dashboard): requests by outcome, conversion rate quoted→paid, avg handling time.

## 7. SEO/content ties

- `/gps-maps-updates` landing page hosts the multi-step intake (progressive form — one step per screen, mobile-first).
- DIY guide (`/how-to-update-gps-maps-diy-guide`) gains contextual CTAs: "Check if we can help" → intake step 1; "Prefer we do it?" → service page. Preserves link equity while feeding the funnel.
- FAQ page updated to reflect real service scope (free vs. paid distinction).

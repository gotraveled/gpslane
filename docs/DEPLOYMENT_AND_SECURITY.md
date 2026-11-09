# GPSLane — Deployment, Security & Operations

## 1. Hosting & runtime

| Component | Choice | Notes |
|---|---|---|
| App | Vercel (Next.js) | SSR/RSC + Payload admin in same deployment; preview deploy per PR |
| Database | Neon Postgres (via Vercel Marketplace) | Serverless driver (`@neondatabase/serverless`); **branch per preview env** so previews never touch prod data |
| Media | Vercel Blob | Payload storage adapter; private-by-default with public read for product/content images |
| Email | Resend | API key env; React Email templates |
| Jobs | Inngest | `INNGEST_EVENT_KEY`/`INNGEST_SIGNING_KEY`; dev server for local; functions: fulfilment submit/poll, webhook processing, inventory sync, order expiry sweep, tracking poll |
| Rate limit | Upstash Redis | `UPSTASH_REDIS_REST_URL/TOKEN` |
| Errors | Sentry (`@sentry/nextjs`) | DSN env; source maps uploaded in CI only |
| Analytics | `@vercel/analytics` + GA4 (new) + preserved Google Ads `AW-17799807671` gtag | Ads tag loaded via `next/script` after consent strategy [PENDING: consent mode/CMP — see privacy] |

**Vercel compatibility notes:** Payload 3.x + Drizzle adapter runs on Node runtime — mark `/admin` and `/api` routes `runtime = 'nodejs'` (Payload needs Node APIs); storefront pages can stay default. Fluid compute/ISR fine. Payload migrations run as a deploy step (`vercel-build` → `payload migrate`) with a guard: preview deploys migrate the Neon **branch**, production migrates main — never the reverse.

## 2. Environment & secrets

`.env.example` categories (names indicative):

```
# Core
DATABASE_URL=            # Neon pooled connection string
PAYLOAD_SECRET=          # Payload JWT/session secret (32+ bytes random)
NEXT_PUBLIC_SITE_URL=https://www.gpslane.com

# Payments (server-only; test + live sets)
STRIPE_SECRET_KEY=  STRIPE_WEBHOOK_SECRET=  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
PAYPAL_CLIENT_ID=  PAYPAL_CLIENT_SECRET=  PAYPAL_WEBHOOK_ID=

# Fulfilment — secrets never in DB; providers reference these var NAMES
CJDROPSHIPPING_API_KEY=      # [BLOCKED] pending credentials + doc verification
FULFILMENT_PROVIDER_MODE=mock|manual|cj

# Services
RESEND_API_KEY=  EMAIL_FROM=orders@gpslane.com (or verified subdomain)
INNGEST_EVENT_KEY=  INNGEST_SIGNING_KEY=
UPSTASH_REDIS_REST_URL=  UPSTASH_REDIS_REST_TOKEN=
SENTRY_DSN=
BLOB_READ_WRITE_TOKEN=      # Vercel Blob
```

Rules: no secrets in repo (check `.env*` in `.gitignore`, add gitleaks to CI); rotation runbook in ops docs; preview envs get test-mode payment keys only.

## 3. Webhook & API security

- **Stripe:** verify `stripe-signature` with `STRIPE_WEBHOOK_SECRET`; tolerate replays via `webhook_events` dedupe; respond 200 quickly, enqueue heavy work.
- **PayPal:** verify webhook signature via PayPal verify API + `PAYPAL_WEBHOOK_ID`; also verify capture on return path.
- **Inngest:** signing-key verification is built into the SDK serve handler.
- **Payload REST API:** admin-session only; disable public read of `users`, `activity_logs`, `fulfilments` internals via collection access control; consider disabling REST API entirely if only Local API is needed [REC: keep GraphQL/REST off in prod unless needed].
- **Checkout endpoints:** rate-limited (e.g., 10 sessions/min/IP), Zod-validated, idempotent order creation.
- **Forms:** honeypot + Upstash rate limit + Turnstile [REC: Cloudflare Turnstile — free, privacy-friendly] on contact/map-update forms.

## 4. Data privacy & compliance

- Markets US/CA → **PIPEDA** (Canada) + **state privacy laws** (CCPA/CPRA etc.) + **GDPR best-practice** for any EU traffic.
- `privacy-policy` page content ported; must be reviewed to name actual processors (Neon, Vercel, Stripe, PayPal, Resend, Inngest, Upstash, Sentry) and retention periods [PENDING legal review].
- Cookie consent: GA4/Ads tags require consent-mode strategy for CA/EU visitors [PENDING owner: CMP choice].
- Customer data rights: export + deletion workflow (admin-executed, logged).
- Payment data: never stored — Stripe/PayPal hosted fields only (SAQ-A scope).
- PII in logs: logger redacts email/address/phone patterns; Sentry `sendDefaultPii=false`.

## 5. Performance & Core Web Vitals

- Targets: LCP <2.5s, INP <200ms, CLS <0.1 (mobile, 4G).
- Techniques: RSC-first pages, `next/image`, font `next/font` self-hosted, minimal client JS (cart drawer only), static generation/ISR for content pages with on-demand revalidation on publish, edge caching for anonymous storefront.
- CI gate: `lighthouse-ci` budgets on key templates; Vercel Speed Insights post-launch.

## 6. Reliability & DR

- **DB:** Neon PITR (point-in-time restore, 7–30d history per plan); nightly logical dump to Blob [REC]; tested restore runbook.
- **Deploys:** Vercel instant rollback (previous deployment alias); DB migrations are forward-only — destructive changes require expand/contract pattern across two deploys.
- **Webhooks:** replay-safe by design; dead-letter queue = `webhook_events` rows with `processingError` surfaced on admin dashboard.
- **Uptime:** Vercel 99.99% SLA; status page optional; Sentry alerts on error-rate spike.
- **Backups of media:** Vercel Blob versioning enabled.

## 7. Deployment pipeline

```
PR → Vercel preview (Neon branch, test keys)
   → CI: lint, typecheck, vitest, playwright smoke, lighthouse budgets, gitleaks
   → review → merge to main
   → Vercel production deploy: build → payload migrate (prod DB) → promote
   → post-deploy: smoke test script hits 17 legacy URLs + checkout test-session create
```

Rollback: Vercel "promote previous deployment" (seconds) + DNS unchanged; DB rollback only via PITR for catastrophic cases (avoid by expand/contract migrations).

## 8. Cutover & rollback (production domain)

- Staging on `staging.gpslane.com` or Vercel preview URL with full parity test.
- Pre-cutover: lower DNS TTL ≥48h; snapshot Hostinger order/export data.
- Cutover: add domain in Vercel, update DNS (A/CNAME per Vercel instructions) at registrar; keep Hostinger site live-but-unlinked for 30 days.
- Post-cutover monitoring: 404 logs, Search Console coverage, Sentry, order flow test purchase (real $1 test then refund, or full test-mode beforehand).
- Rollback trigger thresholds: checkout failure rate >2%, any 5xx spike, indexing errors — revert DNS to Hostinger (kept intact).

## 9. Open security questions for owner

- Who owns the (888) 400-3290 number / email deliverability domain (SPF/DKIM for `gpslane.com`)?
- Is a CMP/cookie-consent tool required by their privacy counsel?
- 2FA mandatory for all admin roles or super-admin only?

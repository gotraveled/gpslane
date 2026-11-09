# GPSLane — Phase 11 Production Deployment Checklist

## Status: NOT DEPLOYED — owner actions required

The site builds and runs locally against Neon. Production deployment is blocked on the items below.

## Owner actions required

### 1. Hosting
- [ ] Choose host (Vercel recommended — Next.js native). No `vercel.json`/hosting config exists yet.
- [ ] Connect repo or deploy manually: `vercel --prod` after env setup.
- [ ] Set production env vars: `DATABASE_URL` (Neon pooled), `DATABASE_URL_UNPOOLED` (migrations), `PAYLOAD_SECRET` (strong random), `NEXT_PUBLIC_SITE_URL=https://gpslane.com`, `CJDROPSHIPPING_API_KEY`, `EPROLO_OPEN_API_KEY`, `EPROLO_OPEN_API_SECRET`.

### 2. Database
- [x] Neon project `shy-bread-98924136` connected (production branch).
- [ ] Enable Neon point-in-time restore / verify backup schedule.
- [ ] Run `payload migrate` status check before first prod deploy (schema push already applied).

### 3. Media storage ⚠️ BLOCKER
- Payload `media` files store to local disk — **ephemeral on serverless**. Before deploy, add `@payloadcms/storage-vercel-blob` (or S3/R2) and migrate the 35 uploaded images, or accept image loss on redeploy.

### 4. Domain & DNS
- [ ] Confirm current gpslane.com DNS (Hostinger) records before any change.
- [ ] Point domain to host (Vercel: A/CNAME records per dashboard).
- [ ] HTTPS auto-provisioned by host.
- [ ] Preserve rollback: keep Hostinger site intact until replacement verified; document old DNS values first.

### 5. Email
- [ ] Add Resend (or SMTP) email adapter — currently console-only; form submissions and order emails won't send.

### 6. Payments (checkout stays disabled until ALL confirmed)
- [ ] Legal entity confirmed
- [ ] PayPal business account KYC complete
- [ ] Market eligibility (US/CA) confirmed
- [ ] Refund/dispute procedures documented
- [ ] Only then enable checkout — currently PDP shows "contact us to order"

### 7. Pre-launch verification on preview URL
- [ ] All 12 routes 200 on preview deployment
- [ ] `/product/*` drafts return 404 publicly
- [ ] `/api/products` shows only published
- [ ] `/admin` requires login
- [ ] Map-update request form submits → record appears in admin
- [ ] Mobile viewport check
- [ ] Lighthouse/CWV check

## Rollback plan

- Git revert to previous commit + redeploy previous deployment.
- Neon: point-in-time restore to pre-launch timestamp.
- DNS: restore recorded Hostinger values.

## Explicitly NOT done (per restrictions)

- No DNS changes made
- No live PayPal activation
- No supplier orders
- No customer charges
- No publication of the 30 evidence-pending products
- No claim that site is live — it is not

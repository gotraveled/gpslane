# GPSLane — Agent Notes

Own-brand GPS navigation e-commerce + map-update services for US/Canada. Rebuild of gpslane.com (currently Hostinger Website Builder — see `docs/`).

## Stack

Next.js 16 (App Router) + TypeScript + Payload CMS 3.93 + PostgreSQL via `@payloadcms/db-postgres` (Drizzle under the hood). Tailwind CSS to be added with storefront work.

## Layout

- `src/payload.config.ts` — all collections registered here
- `src/collections/` — Payload collections (admin UI auto-generated at `/admin`)
- `src/fields/seo.ts` — shared SEO metadata group
- `src/lib/access.ts` — RBAC helpers (`publicReadStaffWrite`, `staffOnlyAccess`, `staffWrite`)
- `src/app/(payload)/` — Payload admin + API routes
- `src/app/(frontend)/` — public storefront (currently placeholder)
- `docs/` — audit, architecture, SEO migration, sourcing plans (read before major work)

## Commands

- `npm install`
- `npm run dev` — Next dev server (needs `DATABASE_URL` + `PAYLOAD_SECRET` in `.env`)
- `npm run build` — production build
- `npx tsc --noEmit` — typecheck
- `npm run lint` — eslint
- `npm run payload generate:types` — regenerate `src/payload-types.ts` after collection changes
- `npm run payload generate:importmap` — regenerate admin import map after collection/plugin changes
- `npm run payload migrate:create` / `migrate` — DB migrations (requires live Postgres)
- `npm run test:int` — vitest integration tests (requires DATABASE_URL)

## Conventions

- Money = integer cents; explicit `usd`/`cad` currency fields; no FX conversion.
- Cost/margin/supplier fields are staff-only via `staffOnlyAccess` or field-level `access.read`.
- Public collections must set `access` explicitly — Payload defaults allow public writes otherwise.
- Product slugs: `/product/{slug}`; content pages: `pages.slug` = URL path; article slug `how-to-update-gps-maps-diy-guide` is FROZEN.
- Never commit secrets; `.env` is gitignored.
- Node >= 22 required (Payload warns on <24.22.1 — works, engine warning only).

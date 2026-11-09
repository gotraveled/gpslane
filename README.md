# GPSLane.com

Own-brand GPS navigation devices and map-update services for the United States and Canada.
Rebuild of https://www.gpslane.com (migrating off Hostinger Website Builder).

## Stack

- Next.js 16 (App Router) + TypeScript
- Payload CMS 3.93 (admin panel at `/admin`, PostgreSQL via Drizzle adapter)
- PostgreSQL (Neon target), Tailwind CSS (storefront, in progress)

## Docs

All architecture, audit, SEO migration, and sourcing plans live in [`docs/`](docs/):

- `PROJECT_AUDIT.md` — Phase 1 production-site audit
- `PHASE_2_ARCHITECTURE.md` — system architecture
- `DATABASE_SCHEMA.md`, `COMMERCE_DESIGN.md`, `FULFILMENT_DESIGN.md`
- `CJ_PRODUCT_SOURCING_PLAN.md`, `PRODUCT_CATALOGUE_TAXONOMY.md`, `PRODUCT_SELECTION_SCORECARD.md`
- `MAP_UPDATE_SERVICE_WORKFLOW.md`, `URL_MIGRATION_MATRIX.md`
- `SEO_CONTENT_ARCHITECTURE.md`, `DEPLOYMENT_AND_SECURITY.md`, `PHASE_2_DECISIONS_REQUIRED.md`

## Develop

```bash
npm install
cp .env.example .env   # fill DATABASE_URL (Postgres) + PAYLOAD_SECRET
npm run dev
```

Admin UI: `/admin` · Storefront: `/`

See `AGENTS.md` for conventions and commands.

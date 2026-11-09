# GPSLane — Admin Panel Design

## 1. Approach

**Payload CMS admin at `/admin`** — auto-generated, collection-driven UI. Custom React components (Payload "Views"/"Cells") added only where the generated UI is insufficient (fulfilment queue, order detail actions, dashboard widgets). No separate admin app.

## 2. Access control & authentication

Payload auth collection `users` (admin staff — distinct from `customers`).

| Role | Permissions |
|---|---|
| `super-admin` | Everything incl. user management, integration settings, refunds |
| `editor` | Pages, articles, FAQs, SEO fields, reviews moderation |
| `support` | Orders (read + status notes), customers, enquiries, map-update requests |
| `fulfilment` | Fulfilment queue, shipments/tracking entry, inventory read |

- Email+password login, Payload-managed sessions (httpOnly cookies), optional TOTP 2FA for `super-admin` [REC].
- `/admin` routes protected by Payload middleware; API access requires valid session + collection `access` rules.
- Rate-limit `/admin` login (5 attempts / 15 min / IP via Upstash).
- All mutations write `activity_logs` rows via collection `afterChange` hooks (actor, action, diff, IP).
- Secrets (Stripe/PayPal/CJ keys, DB URL, Resend) live **only** in env vars; admin "Integration settings" screens store non-secret config + show which env var is expected — never accept secret values through the UI.

## 3. Sections

| Section | Backing collection/global | Notes |
|---|---|---|
| Dashboard | Custom Payload view | KPI cards: revenue (30d), orders by status, pending fulfilments, failed webhooks, open enquiries, low-stock SKUs; recent activity feed from `activity_logs` |
| Products | `products`, `product_variants`, `prices`, `inventory_levels` | List + edit; variant grid; price-per-currency editor; image manager w/ required alt; SEO tab |
| Categories | `categories` | Tree (parent/child), sort order |
| Orders | `orders`, `order_items`, `payments`, `refunds`, `shipments` | Search by order# / email / name; detail view: items, addresses, payment status, fulfilment rows, tracking; actions: cancel (≤24h/pre-ship), refund (full/partial), resend email, add internal note |
| Customers | `customers` | Search; detail: orders, addresses, GDPR export/delete request buttons |
| Fulfilment queue | `fulfilments`, `fulfilment_events`, `supplier_product_mappings` | **Custom view**: queue grouped by status (queued → failed → submitted); per-row actions: mark submitted (enter supplierOrderId), enter tracking, retry, split to manual; event timeline; mapping editor (variant ↔ supplier product/SKU) |
| Inventory | `inventory_levels`, mappings | Stock table, sync status, manual adjust w/ reason (logged) |
| Content | `pages`, `articles` | Rich text (Lexical), drafts, preview link, per-page SEO fields (title/desc/canonical/OG/noIndex), FAQ repeater on relevant pages |
| SEO management | `seo_redirects` + SEO fields everywhere | Redirect list (301), plus validation warnings (missing meta description, duplicate titles) via dashboard widget |
| Coupons | `coupons`, `coupon_redemptions` | Code, type/value, windows, limits, usage stats |
| Reviews | `reviews` | Pending queue approve/reject; never seed fake reviews |
| Enquiries | `contact_enquiries`, `map_update_requests` | Inbox-style; status workflow new→contacted→quoted→converted/lost; map-update pipeline for the $99.99 service |
| Payments | `payments`, `store_settings` | Read-only payment records; settings: which providers enabled, test/live mode indicator |
| Shipping | `store_settings.shippingMethods` | Methods, rates, countries, handling/transit days |
| Integrations | `fulfilment_providers`, env-var references | Enable/disable providers, poll intervals, last-sync health; shows env var names required — values never displayed |
| Activity logs | `activity_logs` | Filterable audit trail |
| Users & roles | `users` | Invite, role assignment, disable, 2FA reset |

## 4. Key custom components

1. **FulfilmentQueueView** — the only genuinely custom admin screen. Needs: bulk "send to manual", per-order supplier assignment, tracking entry form, event timeline, retry button (re-emits Inngest event).
2. **OrderDetailView** — Payload doc view + action buttons hitting authenticated `/api/admin/orders/[id]/actions` route (cancel/refund/resend) so business logic stays in domain code, not admin UI.
3. **DashboardView** — aggregate queries via Payload Local API.

## 5. Security specifics

- CSRF: Payload admin uses same-origin session cookies + Payload's built-in protections; additionally enforce `SameSite=Lax` cookies.
- Admin API routes re-check role server-side (defense in depth — UI hiding is not authorization).
- File uploads: images only, size cap (5MB), payload `alt` required; served from Vercel Blob with sanitised filenames.
- No admin functionality exposed to customer auth tokens; separate `users` vs `customers` collections with disjoint access rules.
- Audit: every refund, cancel, price edit, role change, integration toggle → `activity_logs` + optional Slack/email alert to super-admins for refunds > $100 [REC].

## 6. Editorial workflow

- `pages`/`articles` support drafts → publish; `status` + `publishedAt`; optional scheduled publish.
- SEO fields validated on save (warn, don't block): title ≤60 chars, description ≤160, canonical absolute URL on www host.
- Preview: draft preview URLs on Vercel preview deployments.

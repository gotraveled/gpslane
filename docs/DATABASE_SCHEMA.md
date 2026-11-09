# GPSLane — Database Schema

PostgreSQL on Neon, accessed through Payload CMS 3.x (Drizzle adapter). Payload auto-generates base tables for collections; custom tables listed here are created via Payload collection config + migrations. All money is stored as **integer minor units** (cents) with an explicit ISO 4217 currency column — never floats.

Naming: snake_case tables, camelCase→snake_case field mapping handled by Drizzle adapter.

## Entity-relationship overview

```
stores ──< products >── categories (M2M via product_categories)
products ──< variants >── inventory_levels
products >── media (images)
pages/articles ──> media
customers ──< orders >── order_items >── products/variants (snapshot)
orders ──< payments >── refunds
orders ──< fulfilments >── fulfilment_events
orders >── shipments >── tracking_events
coupons ──< coupon_redemptions
products >── supplier_product_mappings >── suppliers
suppliers ──< fulfilment_providers (config)
users (admin) ──< activity_logs
contact_enquiries / map_update_requests (leads)
seo_redirects
webhook_events (idempotency)
```

## Collections (Payload) / tables

### Content & catalogue

**products**
| field | type | notes |
|---|---|---|
| id | uuid pk | |
| slug | text unique | Must equal legacy URL slug for the 7 existing products |
| name, description (lexical rich text), shortDescription | | |
| status | enum: draft/published/archived | |
| productType | enum: physical / service | `service` = map-update ($99.99) sold via lead form, not cart — kept as content type, not checkout item [REC] |
| categories | relationship[] → categories | |
| images | upload[] → media (alt required) | |
| seo | group: metaTitle, metaDescription, canonical, ogImage, noIndex | |
| legacyId | text | Hostinger `prod_01K9…` ID for reconciliation |
| createdAt/updatedAt | timestamps | |

**product_variants**
| field | type | notes |
|---|---|---|
| productId | fk → products | |
| sku | text unique nullable | currently none observed — generate `GPS-DRIVE7` style SKUs [PENDING owner confirm] |
| name | text | e.g. "Default" for single-variant |
| optionValues | jsonb | future-proofing (color/size) |
| priceCents | int | per currency — see prices table |
| compareAtPriceCents | int nullable | strikethrough price |
| supplierProductId | text nullable | CJ/AliExpress reference |
| weightGrams, requiresShipping | | for future carriers |

**prices** (per variant per currency — explicit USD/CAD, no FX guessing)
| currency | enum usd/cad | |
| priceCents, compareAtPriceCents | int | |
| effectiveFrom/To | timestamp | scheduled sales |

**inventory_levels**
| variantId fk | location text (default 'default') | onHand int | reserved int | policy enum: track/deny/backorder |

**categories**
| slug unique | name | description | image | parentId self-fk (nullable) | sortOrder | seo group |

### Commerce

**customers** (Payload auth collection)
| email unique | passwordHash (managed) | firstName, lastName | phone | defaultAddress jsonb | emailVerified bool | gdprConsent timestamps |

**guest_orders** — guest checkout still creates an `orders` row; `customerId` nullable, `guestEmail` captured. Order-lookup page requires email + orderNumber.

**orders**
| orderNumber | text unique (human-readable, e.g. `GL-2026-000123`) | status enum: `pending_payment → paid → processing → fulfilment_submitted → shipped → delivered / cancelled / refunded / partially_refunded / failed` | customerId fk nullable | guestEmail | currency enum | subtotalCents, discountCents, shippingCents, taxCents, totalCents | shippingAddress jsonb | billingAddress jsonb | couponId fk nullable | notes | placedAt, paidAt, shippedAt, deliveredAt | idempotencyKey unique |

**order_items** (snapshot — prices/desc frozen at purchase, immune to catalogue edits)
| orderId fk | variantId fk nullable (nullable so deleted variants don't break history) | productName, variantName, sku, unitPriceCents, quantity, imageUrl, supplierRefs jsonb |

**payments**
| orderId fk | provider enum stripe/paypal | providerRef unique (payment_intent/invoice id) | amountCents, currency | status enum: requires_action/succeeded/failed/refunded | rawStatus text | createdAt |

**refunds**
| paymentId fk | amountCents | reason | status enum: pending/succeeded/failed | providerRefundId | issuedBy userId | createdAt |

**shipments**
| orderId fk | provider enum: cjdropshipping/manual/carrier | carrierName, trackingNumber, trackingUrl | status enum: label_created/in_transit/out_for_delivery/delivered/exception/returned | shippedAt, deliveredAt |

**tracking_events**
| shipmentId fk | status, description, location, occurredAt | raw payload jsonb |

**coupons**
| code unique (case-insensitive) | type enum percent/fixed | value int (percent×100 or cents) | currency nullable (fixed-amount coupons) | minSubtotalCents | maxRedemptions, perCustomerLimit | validFrom/To | status active/disabled | applicableProducts jsonb nullable |

**coupon_redemptions**: couponId fk, orderId fk, discountCents, redeemedAt.

### Fulfilment

**suppliers**: name, code unique (`manual`, `cjdropshipping`, `aliexpress`…), status, config jsonb (non-secret refs only).

**fulfilment_providers** (per-supplier credentials pointer)
| supplierId fk | providerType enum mock/manual/cjdropshipping | credentialsRef text — **reference to env var name, never the secret itself** | status enabled/disabled | config jsonb (endpoints, timeouts, poll interval) |

**supplier_product_mappings**
| variantId fk | supplierId fk | supplierProductId, supplierSku, supplierVariantId | unitCostCents nullable, costCurrency | lastInventorySyncAt, lastCostSyncAt | syncStatus enum ok/error/unmapped | unique(variantId, supplierId) |

**fulfilments** (one per order per attempt)
| orderId fk | providerId fk | idempotencyKey unique | status enum: queued/submitted/acknowledged/failed/cancelled | supplierOrderId nullable | submittedAt, acknowledgedAt | error jsonb | attempts int |

**fulfilment_events** (append-only audit)
| fulfilmentId fk | type enum: created/submitted/polled/status_changed/tracking_updated/error/retry/cancelled | payload jsonb | createdAt |

### Operations

**webhook_events**: provider enum, eventId unique, payload jsonb, processedAt, processingError — idempotency + replay audit.

**activity_logs**: actorUserId fk, action, entityType, entityId, diff jsonb, ip, createdAt — every admin mutation via Payload hooks.

**contact_enquiries**: name, email, subject, message, status new/read/replied/spam, source page.

**map_update_requests**: fullName, email, phone, gpsModelOrSerial, status new/contacted/quoted/converted/lost, assignedTo userId, notes — the $99.99 service pipeline.

**reviews**: productId fk, customerId fk nullable, authorName, rating 1–5, title, body, status pending/approved/rejected, createdAt — **manual approval only; no seeding of fake reviews**.

**seo_redirects**: fromPath unique, toPath, statusCode 301, createdAt, enabled — for any future URL changes.

**store_settings** (Payload global, singleton): storeName, supportEmail, supportPhone, addresses, businessHours, announcementBar, shippingMethods jsonb, taxConfig jsonb, currencyConfig jsonb (usd/cad enabled, default), socialLinks jsonb, mapUpdateServicePriceCents.

**media** (Payload upload collection): file on Vercel Blob, alt (required), focalX/Y, usedIn relationships.

## Key constraints & invariants

- `orders.idempotencyKey` + `payments.providerRef` unique → webhook replay safety.
- `fulfilments.idempotencyKey` unique → exactly-once supplier submission intent.
- Order totals are **server-computed only**; client cart is advisory. `unitPriceCents` snapshots on `order_items`.
- Currency: every money column paired with a currency column or lives on an entity already scoped to one (orders carry `currency`).
- Soft references: `order_items.variantId` nullable + name/sku snapshots so catalogue changes never corrupt order history.
- All timestamps `timestamptz`. PII fields (email, address, phone) encrypted at rest by Neon; access logged.

## Migration strategy

Payload Drizzle adapter generates SQL migrations (`payload migrate:create` / `migrate`). Seed via `payload run seed.ts`: 17 pages/articles content ported from audit captures, 7 products + variants from Hostinger export, settings global defaults (free shipping US/CA, PayPal/Stripe placeholders, $99.99 map-update price). Reconciliation checklist in `PHASE_2_DECISIONS_REQUIRED.md` §data migration.

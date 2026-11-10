require('dotenv').config({ path: '.env.local' })
const { Client } = require('pg')

const SQL = `
CREATE TYPE "enum_reviews_status" AS ENUM ('pending','approved','rejected');

CREATE TABLE IF NOT EXISTS "reviews" (
  "id" serial PRIMARY KEY,
  "rating" numeric NOT NULL,
  "title" varchar NOT NULL,
  "body" varchar NOT NULL,
  "author_name" varchar NOT NULL,
  "author_email" varchar,
  "status" "enum_reviews_status" NOT NULL DEFAULT 'pending',
  "updated_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
  "created_at" timestamp(3) with time zone NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "reviews_updated_at_idx" ON "reviews" ("updated_at");
CREATE INDEX IF NOT EXISTS "reviews_created_at_idx" ON "reviews" ("created_at");

CREATE TABLE IF NOT EXISTS "reviews_rels" (
  "id" serial PRIMARY KEY,
  "order" integer,
  "parent_id" integer NOT NULL,
  "path" varchar NOT NULL,
  "products_id" integer
);
CREATE INDEX IF NOT EXISTS "reviews_rels_order_idx" ON "reviews_rels" ("order");
CREATE INDEX IF NOT EXISTS "reviews_rels_parent_idx" ON "reviews_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "reviews_rels_path_idx" ON "reviews_rels" ("path");
CREATE INDEX IF NOT EXISTS "reviews_rels_products_id_idx" ON "reviews_rels" ("products_id");

ALTER TABLE "reviews_rels" ADD CONSTRAINT "reviews_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "reviews"("id") ON DELETE CASCADE;
ALTER TABLE "reviews_rels" ADD CONSTRAINT "reviews_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "products"("id") ON DELETE CASCADE;

ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "reviews_id" integer;
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "reviews"("id") ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_reviews_id_idx" ON "payload_locked_documents_rels" ("reviews_id");
`

async function main() {
  const c = new Client({ connectionString: process.env.DATABASE_URL })
  await c.connect()
  await c.query('BEGIN')
  try {
    await c.query(SQL)
    await c.query('COMMIT')
    console.log('reviews schema created OK')
  } catch (e) {
    await c.query('ROLLBACK')
    console.error('FAILED — rolled back:', e.message)
    process.exit(1)
  }
  await c.end()
}
main()

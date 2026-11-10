require('dotenv').config({ path: '.env.local' })
const { Client } = require('pg')

async function main() {
  const c = new Client({ connectionString: process.env.DATABASE_URL })
  await c.connect()
  // ADD VALUE must commit before use in some PG versions — run it alone first
  await c.query(`ALTER TYPE "enum_orders_status" ADD VALUE IF NOT EXISTS 'processing'`)
  await c.query('BEGIN')
  try {
    await c.query(`
      ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "tracking_number" varchar;
      ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "carrier" varchar;
      ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shipped_at" timestamp(3) with time zone;
      ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "reminder_sent" boolean DEFAULT false;
      ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "supplier_order_id" varchar;
      CREATE INDEX IF NOT EXISTS "orders_tracking_number_idx" ON "orders" ("tracking_number");
      CREATE INDEX IF NOT EXISTS "orders_supplier_order_id_idx" ON "orders" ("supplier_order_id");
    `)
    await c.query('COMMIT')
    console.log('orders schema fixed OK')
  } catch (e) {
    await c.query('ROLLBACK')
    console.error('FAILED — rolled back:', e.message)
    process.exit(1)
  }
  await c.end()
}
main()

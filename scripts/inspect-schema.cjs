require('dotenv').config({ path: '.env.local' })
const { Client } = require('pg')
async function main() {
  const c = new Client({ connectionString: process.env.DATABASE_URL })
  await c.connect()
  const fk = await c.query(`select conname, pg_get_constraintdef(oid) d from pg_constraint where conrelid='payload_locked_documents_rels'::regclass and contype='f' order by conname`)
  fk.rows.forEach((r) => console.log(`  ${r.conname}: ${r.d}`))
  const oc = await c.query(`select udt_name from information_schema.columns where table_name='orders' and column_name='total_cents'`)
  console.log('orders.total_cents type:', oc.rows[0]?.udt_name)
  await c.end()
}
main().catch((e) => { console.error('ERR', e.message); process.exit(1) })

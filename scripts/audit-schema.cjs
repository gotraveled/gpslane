require('dotenv').config({ path: '.env.local' })
const { Client } = require('pg')

async function main() {
  const c = new Client({ connectionString: process.env.DATABASE_URL })
  await c.connect()
  const enums = await c.query(
    `select t.typname, array_agg(e.enumlabel order by e.enumsortorder) vals
     from pg_type t join pg_enum e on e.enumtypid=t.oid group by t.typname order by t.typname`)
  enums.rows.forEach((r) => console.log(`${r.typname}: ${r.vals}`))
  // verify orders fix
  const oc = await c.query(`select column_name from information_schema.columns where table_name='orders'`)
  console.log('\norders cols:', oc.rows.map((r) => r.column_name).join(','))
  await c.end()
}
main().catch((e) => { console.error('ERR', e.message); process.exit(1) })

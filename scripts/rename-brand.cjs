require('dotenv').config({ path: '.env.local' })
const { Client } = require('pg')

async function main() {
  const c = new Client({ connectionString: process.env.DATABASE_URL })
  await c.connect()
  for (const [t, col] of [['products', 'description'], ['product_variants', 'attributes'], ['articles', 'body'], ['pages', 'body']]) {
    try {
      const r = await c.query(`UPDATE "${t}" SET "${col}" = replace("${col}"::text, 'GPSLane', 'GPS Lane')::jsonb WHERE "${col}"::text LIKE '%GPSLane%'`)
      console.log(`${t}.${col}: ${r.rowCount}`)
    } catch (e) {
      console.log(`${t}.${col}: skip (${e.message.split('\n')[0]})`)
    }
  }
  await c.end()
}
main()

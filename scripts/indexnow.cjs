// Submit all site URLs to IndexNow (Bing, Yandex, DuckDuckGo instant indexing)
require('dotenv').config({ path: '.env.local' })
const { Client } = require('pg')
const KEY = 'gpslane2026indexnowkey'
const SITE = 'https://gpslane.com'

async function main() {
  const c = new Client({ connectionString: process.env.DATABASE_URL })
  await c.connect()
  const products = await c.query(`SELECT slug FROM products WHERE status = 'published'`)
  const cats = await c.query(`SELECT slug FROM categories`)
  await c.end()

  const urls = [
    '', '/shop', '/about', '/contact', '/faq', '/shipping-and-returns', '/privacy', '/terms',
    '/disclaimer', '/cookie-policy', '/accessibility', '/payment-security', '/track-order', '/reviews',
    '/guides', '/guides/best-gps-for-truck-drivers', '/guides/gps-vs-smartphone-navigation',
    '/guides/how-to-choose-carplay-gps-screen', '/guides/how-to-update-garmin-maps',
    '/guides/how-to-update-tomtom-maps', '/guides/gps-map-update-not-working',
    '/map-updates', '/map-updates/request', '/map-updates/eligibility',
    '/how-to-update-gps-maps-diy-guide',
    ...products.rows.map((r) => `/product/${r.slug}`),
    ...cats.rows.map((r) => `/shop/${r.slug}`),
  ].map((p) => `${SITE}${p}`)

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ host: 'gpslane.com', key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls }),
  })
  console.log('IndexNow:', res.status, await res.text())
}
main().catch((e) => console.error(e))

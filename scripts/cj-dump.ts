import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
const BASE = 'https://developers.cjdropshipping.com/api2.0/v1'
const r = await fetch(`${BASE}/authentication/getAccessToken`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ apiKey: process.env.CJDROPSHIPPING_API_KEY }) })
const token = (await r.json()).data.accessToken
const q = await fetch(`${BASE}/product/query?pid=1368761182843965440`, { headers: { 'CJ-Access-Token': token } })
const j: any = await q.json()
const d = j.data
console.log('variants:', JSON.stringify(d.variants).slice(0, 800))
console.log('productImageSet:', JSON.stringify(d.productImageSet).slice(0, 400))
console.log('sellPrice:', d.sellPrice, '| listedNum:', d.listedNum, '| sku:', d.productSku)

/** Probe CJ API endpoints for warehouse/NA-stock/private-label capabilities. Read-only. */
import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })

const BASE = 'https://developers.cjdropshipping.com/api2.0/v1'
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
let token: string | null = null

async function api(method: 'GET' | 'POST', path: string, opts: { query?: any; body?: any } = {}) {
  if (!token) {
    const r = await fetch(`${BASE}/authentication/getAccessToken`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: process.env.CJDROPSHIPPING_API_KEY }),
    })
    token = (await r.json()).data.accessToken
  }
  const qs = opts.query ? '?' + Object.entries(opts.query).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&') : ''
  const res = await fetch(`${BASE}${path}${qs}`, {
    method,
    headers: { 'CJ-Access-Token': token!, ...(opts.body ? { 'Content-Type': 'application/json' } : {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  })
  await sleep(1100)
  const j: any = await res.json().catch(() => null)
  return { http: res.status, code: j?.code, msg: j?.message, data: j?.data }
}

const show = (label: string, v: any, max = 2500) => {
  console.log(`\n=== ${label} ===`)
  console.log(JSON.stringify(v, null, 1)?.slice(0, max))
}

async function main() {
  // 1. Warehouse list
  show('globalWarehouseList', await api('GET', '/product/globalWarehouseList'))

  // 2. US-inventory filtered product search
  show('listV2 countryCode=US "gps navigation"', await api('GET', '/product/listV2', { query: { keyWord: 'gps navigation', countryCode: 'US', page: 1, size: 5 } }))

  // 3. stock by pid for a known product
  show('getInventoryByPid', await api('GET', '/product/stock/getInventoryByPid', { query: { pid: '1368761182843965440' } }))

  // 4. freight US->US and CA->CA for a vid (need a vid — reuse known one)
  show('freight US->US', await api('POST', '/logistic/freightCalculate', { body: { startCountryCode: 'US', endCountryCode: 'US', products: [{ quantity: 1, vid: '1368761184295194624' }] } }))
  show('freight CA->CA', await api('POST', '/logistic/freightCalculate', { body: { startCountryCode: 'CA', endCountryCode: 'CA', products: [{ quantity: 1, vid: '1368761184295194624' }] } }))

  // 5. packaging + individualization queries (read-only probes)
  show('packagingProduct/query', await api('POST', '/product/packagingProduct/query', { body: { page: 1, size: 3 } }))
  show('cjPackaging/query', await api('POST', '/product/cjPackaging/query', { body: { page: 1, size: 3 } }))
}

main().catch((e) => { console.error('FATAL', e); process.exit(1) })


import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
const B = 'https://developers.cjdropshipping.com/api2.0/v1'
const s = (ms: number) => new Promise((r) => setTimeout(r, ms))
let t: string | null = null
async function api(p: string, q: Record<string, any>) {
  if (!t) {
    const r = await fetch(`${B}/authentication/getAccessToken`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ apiKey: process.env.CJDROPSHIPPING_API_KEY }) })
    t = (await r.json()).data.accessToken
  }
  const qs = '?' + Object.entries(q).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')
  const res = await fetch(`${B}${p}${qs}`, { headers: { 'CJ-Access-Token': t! } })
  await s(1100)
  return (await res.json())?.data
}
async function main() {
  for (const kw of ['phone holder', 'charger', 'cushion', 'motorcycle', 'screen protector', 'dash cam', 'car accessories']) {
    const d: any = await api('/product/listV2', { keyWord: kw, countryCode: 'CA', page: 1, size: 5 })
    const n = (d?.content ?? []).flatMap((c: any) => c.productList ?? [c]).filter((p: any) => p?.id).length
    console.log('CA', kw, '→', n, 'total', d?.totalRecords)
  }
  for (const kw of ['gps antenna', 'gps cable', 'gps case', 'portable gps', 'gps navigator']) {
    const d: any = await api('/product/listV2', { keyWord: kw, countryCode: 'US', page: 1, size: 5 })
    const n = (d?.content ?? []).flatMap((c: any) => c.productList ?? [c]).filter((p: any) => p?.id).length
    console.log('US', kw, '→', n, 'total', d?.totalRecords)
  }
}
main().catch((e) => { console.error(e); process.exit(1) })

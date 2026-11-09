import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
const B = 'https://developers.cjdropshipping.com/api2.0/v1'
const s = (ms: number) => new Promise((r) => setTimeout(r, ms))
let t: string | null = null
async function api(p: string, q?: Record<string, any>, body?: any) {
  if (!t) {
    const r = await fetch(`${B}/authentication/getAccessToken`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ apiKey: process.env.CJDROPSHIPPING_API_KEY }) })
    t = (await r.json()).data.accessToken
  }
  const qs = q ? '?' + Object.entries(q).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&') : ''
  const res = await fetch(`${B}${p}${qs}`, { method: body ? 'POST' : 'GET', headers: { 'CJ-Access-Token': t!, ...(body ? { 'Content-Type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined })
  await s(1100)
  return (await res.json())?.data
}
const summarize = (inv: any) => {
  const variants = inv?.variantInventories ?? []
  const countries = new Map<string, number>()
  for (const vi of variants) {
    for (const i of vi.inventory ?? []) {
      countries.set(i.countryCode, (countries.get(i.countryCode) ?? 0) + (i.totalInventory ?? 0))
    }
  }
  return { variantCount: variants.length, countries: Object.fromEntries(countries) }
}
async function main() {
  const pids = [
    '1953028967254958082', // motorcycle carrier (US-listed)
    '1621030460279238656', // motorcycle carplay screen (phase4)
    '1605840112464703488', // portable car smart screen
    '1762433618531590144', // 10.26" head unit
    '1640899139242307584', // carplay MP5
    '1381795220596854784', // gps cycling computer
    '1428891025237217280', // car HUD (US-listed)
    '1564542997939892224', // magnetic phone holder
  ]
  for (const pid of pids) {
    try {
      const inv = await api('/product/stock/getInventoryByPid', { pid })
      console.log(pid, JSON.stringify(summarize(inv)))
    } catch (e: any) {
      console.log(pid, 'ERR', e.message)
    }
  }
}
main().catch((e) => { console.error(e); process.exit(1) })

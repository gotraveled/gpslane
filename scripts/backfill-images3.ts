import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
import { writeFileSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { getPayload } from 'payload'
import { eproloGet } from '../src/lib/suppliers/eprolo'

const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0/v1'

async function cjToken() {
  const r = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: process.env.CJDROPSHIPPING_API_KEY }),
  })
  const j: any = await r.json()
  return j?.data?.accessToken ?? j?.accessToken
}

async function download(url: string, fp: string): Promise<boolean> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(25000), headers: { 'User-Agent': 'Mozilla/5.0' } })
    if (!res.ok) return false
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 3000) return false
    writeFileSync(fp, buf)
    return true
  } catch { return false }
}

async function main() {
  const { default: configPromise } = await import('../src/payload.config')
  const payload = await getPayload({ config: configPromise })
  const tmp = mkdtempSync(path.join(tmpdir(), 'gpslane-img4-'))
  const token = await cjToken()

  const cjTargets: [string, string][] = [
    ['head-up-display', '1428891025237217280'],
    ['vehicle-navigation-power-cable', '1681189962663862272'],
  ]
  for (const [slug, pid] of cjTargets) {
    const found = await payload.find({ collection: 'products', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
    const p: any = found.docs[0]
    if (!p || (p.images ?? []).length > 0) { console.log(slug, 'skip'); continue }
    const r = await fetch(`${CJ_BASE}/product/query?pid=${pid}`, { headers: { 'CJ-Access-Token': token } })
    const j: any = await r.json()
    const d = j?.data ?? j
    const urls: string[] = d?.productImageSet ?? d?.productImageList ?? []
    console.log(slug, 'cj urls:', urls.length)
    const ids: any[] = []
    for (let i = 0; i < Math.min(urls.length, 5); i++) {
      const fp = path.join(tmp, `${slug}-${i}.jpg`)
      if (await download(urls[i], fp)) {
        try {
          const doc: any = await payload.create({ collection: 'media', data: { alt: `${p.name} — photo ${i + 1}` }, filePath: fp })
          ids.push(doc.id)
        } catch {}
      }
    }
    console.log(slug, '->', ids.length)
    if (ids.length) await payload.update({ collection: 'products', id: p.id, data: { images: ids } as any })
  }

  const epTargets: [string, string][] = [
    ['hud-gps-speedometer', '33380711'],
    ['carlinkit-4-0-carplay-adapter', '33380712'],
    ['wireless-carplay-adapter-box', '33380709'],
  ]
  for (const [slug, id] of epTargets) {
    const found = await payload.find({ collection: 'products', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
    const p: any = found.docs[0]
    if (!p || (p.images ?? []).length > 0) { console.log(slug, 'skip'); continue }
    try {
      const d: any = await eproloGet('getproduct.html', { id, product_id: `gpslane-${id}` })
      const pd = d?.data ?? d
      const _raw = JSON.stringify(pd).slice(0, 0)
      const urls: string[] = []
      const push = (u: any) => { if (typeof u === 'string' && u.startsWith('http')) urls.push(u) }
      push(pd?.imagefirst)
      for (const im of pd?.imagelist ?? []) push(im?.src ?? im)
      for (const im of pd?.images ?? []) push(im?.src ?? im)
      console.log(slug, 'ep urls:', urls.length, urls[0]?.slice(-40) ?? 'none')
      const ids: any[] = []
      for (let i = 0; i < Math.min([...new Set(urls)].length, 5); i++) {
        const fp = path.join(tmp, `${slug}-${i}.jpg`)
        if (await download([...new Set(urls)][i], fp)) {
          try {
            const doc: any = await payload.create({ collection: 'media', data: { alt: `${p.name} — photo ${i + 1}` }, filePath: fp })
            ids.push(doc.id)
          } catch {}
        }
      }
      console.log(slug, '->', ids.length)
      if (ids.length) await payload.update({ collection: 'products', id: p.id, data: { images: ids } as any })
    } catch (e: any) { console.log(slug, 'EP fail', e.message?.slice(0, 80)) }
  }
  process.exit(0)
}
main().catch((e) => { console.error('FATAL', e); process.exit(1) })

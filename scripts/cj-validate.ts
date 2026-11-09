/** Fetch productDetail for the 15 launch-catalogue pids → data/cj/validation-details.json */
import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'

const BASE = 'https://developers.cjdropshipping.com/api2.0/v1'
const OUT = path.resolve('data/cj')
mkdirSync(OUT, { recursive: true })
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
let token: string | null = null

async function api(method: 'GET' | 'POST', p: string, opts: { query?: any; body?: any } = {}) {
  if (!token) {
    const r = await fetch(`${BASE}/authentication/getAccessToken`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: process.env.CJDROPSHIPPING_API_KEY }),
    })
    token = (await r.json()).data.accessToken
  }
  const qs = opts.query ? '?' + Object.entries(opts.query).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&') : ''
  const res = await fetch(`${BASE}${p}${qs}`, {
    method,
    headers: { 'CJ-Access-Token': token!, ...(opts.body ? { 'Content-Type': 'application/json' } : {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  })
  await sleep(1100)
  const j: any = await res.json().catch(() => null)
  if (j && j.code !== undefined && ![200, 0].includes(j.code)) throw new Error(`${p} code=${j.code} ${j.message}`)
  return j?.data
}

async function main() {
  const cat: any[] = JSON.parse(readFileSync(path.join(OUT, 'launch-catalogue.json'), 'utf8'))
  const out: any[] = []
  for (const p of cat) {
    try {
      const d: any = await api('POST', '/product/productDetail/query', { body: { id: p.supplierProductId } })
      const pd = d?.productDetail ?? d ?? {}
      const desc = String(pd.description ?? '')
      const stripHtml = (h: string) => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      const images: string[] = Array.isArray(pd.newImgList) ? pd.newImgList : []
      const totalQty = Number(pd.totalQuantity ?? 0)
      const refundQty = Number(pd.totalRefundQuantity ?? 0)
      out.push({
        pid: p.supplierProductId,
        slug: p.slug,
        nameEn: pd.nameen ?? null,
        images,
        imageCount: images.length,
        hasBigImage: Boolean(pd.bigimg),
        sellPriceRange: pd.sellprice ?? null,
        listed: pd.listed,
        orderCount: pd.orderCount,
        qualityDisputeRate: pd.qualityDisputeRate,
        refundRatePct: totalQty > 0 ? Math.round((refundQty / totalQty) * 10000) / 100 : null,
        productType: pd.producttype,
        category: pd.category ?? pd.categoryIds,
        sku: pd.sku,
        weight: pd.weight,
        packWeight: pd.packweight,
        packing: pd.packing ?? pd.packingen,
        supplier: pd.supplier ?? pd.supplierNameEn,
        verifiedWarehouse: pd.verifiedWarehouse,
        qualificationList: pd.qualificationList,
        certificationMaterialList: pd.certificationMaterialList,
        isPersonalized: pd.isPersonalized,
        customeDesign: pd.customeDesign,
        descriptionLen: desc.length,
        descriptionText: stripHtml(desc).slice(0, 1500),
        hasVideo: pd.isHaveVideo,
      })
      console.log('OK', p.slug, '| imgs', images.length, '| orders', pd.orderCount, '| dispute', pd.qualityDisputeRate)
    } catch (e: any) {
      console.log('FAIL', p.slug, e.message)
    }
  }
  writeFileSync(path.join(OUT, 'validation-details.json'), JSON.stringify(out, null, 2))
  console.log('DONE', out.length)
}
main().catch((e) => { console.error('FATAL', e); process.exit(1) })

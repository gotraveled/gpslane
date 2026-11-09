/**
 * CJdropshipping product discovery — runs against the live CJ API.
 * Usage: npx tsx scripts/cj-discover.ts [--detail] [--keywords "a,b"]
 *
 * Reads CJDROPSHIPPING_API_KEY from .env.local (gitignored).
 * Writes raw responses to data/cj/ (gitignored — contains supplier cost data).
 * Read-only: no orders, no purchases, no writes to CJ.
 */
import 'dotenv/config'
import { config } from 'dotenv'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

config({ path: '.env.local', override: true })

const OUT_DIR = path.resolve('data/cj')
mkdirSync(OUT_DIR, { recursive: true })

const BASE = 'https://developers.cjdropshipping.com/api2.0/v1'
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

let accessToken: string | null = null

async function api<T = any>(method: 'GET' | 'POST', pathName: string, opts: { query?: Record<string, any>; body?: any } = {}): Promise<T> {
  if (!accessToken) {
    const res = await fetch(`${BASE}/authentication/getAccessToken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: process.env.CJDROPSHIPPING_API_KEY }),
    })
    const json: any = await res.json()
    if (!json.result || !json.data?.accessToken) {
      throw new Error(`AUTH FAILED: ${json.message} (code ${json.code})`)
    }
    accessToken = json.data.accessToken
    console.log(`AUTH OK — token acquired (expires ${json.data.accessTokenExpiryDate})`)
  }

  const qs = opts.query
    ? '?' + Object.entries(opts.query).filter(([, v]) => v !== undefined && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')
    : ''
  const res = await fetch(`${BASE}${pathName}${qs}`, {
    method,
    headers: {
      'CJ-Access-Token': accessToken!,
      ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  })
  await sleep(1100) // QPS=1
  const json: any = await res.json().catch(() => null)
  if (!res.ok || (json && (json.code === undefined ? false : ![200, 0].includes(json.code)))) {
    throw new Error(`API ${method} ${pathName} → HTTP ${res.status} code=${json?.code} msg=${json?.message}`)
  }
  return json?.data ?? json
}

const KEYWORDS = [
  'portable GPS navigator',
  'car GPS navigation system',
  'GPS navigation system 7 inch',
  'truck GPS navigation',
  'RV GPS navigation',
  'motorcycle GPS navigation',
  'motorcycle CarPlay screen',
  'GPS windshield mount',
  'GPS dashboard holder',
  'GPS suction cup mount',
  'GPS power cable',
  'GPS car charger',
  'GPS antenna',
  'GPS carrying case',
  'GPS navigator accessories',
]

// Excluded categories: covert trackers/locators (pending legal review),
// pet trackers, fuel cut-off devices, non-navigation electronics.
const EXCLUDE_RE =
  /tracker|locator|anti-?theft|pet\s|beidou|fuel\s*cut|cut.?off|obd\s*(?!.*navigat)|hidden\s*camera|dash\s*cam(?!.*navigat)/i
const NAVIGATOR_RE = /gps|navigat|carplay|android\s*(auto|screen)|satnav/i

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
}

async function main() {
  const args = process.argv.slice(2)
  const detail = args.includes('--detail')
  const kwArg = args.find((a) => a.startsWith('--keywords='))
  const keywords = kwArg ? kwArg.split('=')[1].split(',') : KEYWORDS

  // 1. Auth + categories smoke test
  const cats: any = await api('GET', '/product/getCategory')
  writeFileSync(path.join(OUT_DIR, 'categories.json'), JSON.stringify(cats, null, 2))
  const catCount = JSON.stringify(cats).match(/categoryId/g)?.length ?? 0
  console.log(`CATEGORIES OK — ~${catCount} category nodes`)

  // 2. Keyword searches
  const found = new Map<string, { pid: string; name: string; keywords: string[]; listPrice?: any; listedNum?: any; warehouseInventoryNum?: any }>()
  for (const kw of keywords) {
    try {
      const data: any = await api('GET', '/product/listV2', { query: { keyWord: kw, page: 1, size: 20 } })
      writeFileSync(path.join(OUT_DIR, `search-${slug(kw)}.json`), JSON.stringify(data, null, 2))
      // Response shape: { content: [{ productList: [...] }], totalRecords, ... }
      const products: any[] = (data?.content ?? [])
        .flatMap((c: any) => c.productList ?? [c])
        .filter((p: any) => p && typeof p === 'object')
      let n = 0
      for (const p of products) {
        const pid = String(p.pid ?? p.productId ?? p.id ?? '')
        if (!pid) continue
        n++
        const entry = found.get(pid) ?? {
          pid,
          name: p.nameEn ?? p.productNameEn ?? p.productName ?? p.name ?? '',
          keywords: [] as string[],
          listPrice: p.sellPrice ?? p.price,
          listedNum: p.listedNum,
          warehouseInventoryNum: p.warehouseInventoryNum,
        }
        entry.keywords.push(kw)
        found.set(pid, entry)
      }
      console.log(`SEARCH "${kw}" → ${n} results (${products.length} raw)`)
    } catch (e: any) {
      console.log(`SEARCH "${kw}" FAILED: ${e.message}`)
    }
  }
  console.log(`UNIQUE PRODUCTS FOUND: ${found.size}`)

  // 3. Detail pass — exclude trackers/locators, prioritize navigator-relevant hits
  const all = [...found.values()]
  const eligible = all.filter((c) => !EXCLUDE_RE.test(c.name))
  const excluded = all.filter((c) => EXCLUDE_RE.test(c.name))
  console.log(`ELIGIBLE: ${eligible.length} | EXCLUDED (tracker/locator/etc): ${excluded.length}`)
  const navigatorHits = eligible.filter((c) => NAVIGATOR_RE.test(c.name))
  const others = eligible.filter((c) => !NAVIGATOR_RE.test(c.name))
  const candidates = [...navigatorHits, ...others].slice(0, detail ? eligible.length : 40)
  const details: any[] = []
  for (const c of candidates) {
    try {
      const detailData: any = await api('POST', '/product/productDetail/query', { body: { id: c.pid } })
      writeFileSync(path.join(OUT_DIR, `detail-${c.pid}.json`), JSON.stringify(detailData, null, 2))
      const product = detailData ?? {}

      // Variants come from the dedicated endpoint (2.1)
      let variants: any[] = []
      try {
        variants = await api<any[]>('GET', '/product/variant/query', { query: { pid: c.pid } })
        if (!Array.isArray(variants)) variants = (variants as any)?.data ?? []
      } catch {}

      // stock + freight per variant (first 3 variants to bound calls)
      const variantRows: any[] = []
      for (const v of variants.slice(0, 3)) {
        const vid = v.vid ?? v.variantId
        let stock: any = null, freightUs: any = null, freightCa: any = null
        if (vid) {
          try { stock = await api('GET', '/product/stock/queryByVid', { query: { vid } }) } catch {}
          try {
            freightUs = await api('POST', '/logistic/freightCalculate', {
              body: { startCountryCode: 'CN', endCountryCode: 'US', products: [{ quantity: 1, vid }] },
            })
          } catch {}
          try {
            freightCa = await api('POST', '/logistic/freightCalculate', {
              body: { startCountryCode: 'CN', endCountryCode: 'CA', products: [{ quantity: 1, vid }] },
            })
          } catch {}
        }
        variantRows.push({
          vid,
          sku: v.variantSku ?? v.sku,
          variantName: v.variantNameEn ?? v.variantName,
          price: v.variantSellPrice ?? v.sellPrice,
          weightG: v.variantWeight,
          dims: v.variantStandard,
          image: v.variantImage,
          stock,
          freightUs,
          freightCa,
        })
        writeFileSync(path.join(OUT_DIR, `variant-${vid ?? 'x'}.json`), JSON.stringify({ variant: v, stock, freightUs, freightCa }, null, 2))
      }

      details.push({
        pid: c.pid,
        name: product.nameen ?? product.productNameEn ?? product.productName ?? c.name,
        sellPrice: product.sellprice ?? product.sellPrice ?? c.listPrice,
        description: (product.descriptionen ?? product.description ?? '').toString().slice(0, 2000),
        images: (product.newImgList ?? product.img ?? product.bigimg ?? []).slice?.(0, 5),
        orderCount: product.orderCount,
        totalQuantity: product.totalQuantity,
        qualityDisputeRate: product.qualityDisputeRate,
        logisticsScore: product.logisticScore,
        customization: product.customization,
        qualificationList: product.qualificationList,
        keywords: c.keywords,
        variantCount: variants.length,
        variants: variantRows,
      })
      console.log(`DETAIL ${c.pid} "${(product.nameen ?? c.name ?? '').slice(0, 60)}" variants=${variants.length}`)
    } catch (e: any) {
      console.log(`DETAIL ${c.pid} FAILED: ${e.message}`)
    }
  }

  writeFileSync(path.join(OUT_DIR, 'discovery-summary.json'), JSON.stringify({ keywords, found: [...found.values()], details }, null, 2))
  console.log(`DONE — ${details.length} detailed products written to data/cj/`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})

/**
 * CJdropshipping API v2.0 client — server-side only.
 * Auth: POST /authentication/getAccessToken { apiKey } → accessToken (180d,
 * server-cached 24h by CJ). All calls send `CJ-Access-Token` header.
 * Rate limit: QPS = 1 — callers must serialize requests.
 * Docs: https://developers.cjdropshipping.com/en/api/api2/
 */

const BASE_URL = 'https://developers.cjdropshipping.com/api2.0/v1'

export class CjApiError extends Error {
  constructor(
    message: string,
    public readonly code?: number | string,
    public readonly requestId?: string,
  ) {
    super(message)
    this.name = 'CjApiError'
  }
}

type TokenResponse = {
  code: number
  result: boolean
  message: string
  data?: {
    accessToken: string
    accessTokenExpiryDate: string
    refreshToken: string
    refreshTokenExpiryDate: string
  }
  requestId?: string
}

let cachedToken: { token: string; expiresAt: number } | null = null
let tokenPromise: Promise<string> | null = null

function apiKey(): string {
  const key = process.env.CJDROPSHIPPING_API_KEY
  if (!key) throw new CjApiError('CJDROPSHIPPING_API_KEY is not set (server-side env only)')
  return key
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token
  }
  if (tokenPromise) return tokenPromise

  tokenPromise = (async () => {
    const res = await fetch(`${BASE_URL}/authentication/getAccessToken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: apiKey() }),
    })
    const json = (await res.json()) as TokenResponse
    if (!res.ok || !json.result || !json.data?.accessToken) {
      throw new CjApiError(
        `CJ auth failed: ${json.message ?? res.statusText}`,
        json.code,
        json.requestId,
      )
    }
    const expiresAt = new Date(json.data.accessTokenExpiryDate).getTime()
    cachedToken = { token: json.data.accessToken, expiresAt }
    return json.data.accessToken
  })().finally(() => {
    tokenPromise = null
  })

  return tokenPromise
}

export type CjEnvelope<T> = {
  code: number
  result: boolean
  message: string
  data: T
  requestId?: string
  success?: boolean
}

async function cjFetch<T>(path: string, init?: { method?: 'GET' | 'POST'; query?: Record<string, string | number | undefined>; body?: unknown }): Promise<T> {
  const token = await getAccessToken()
  const method = init?.method ?? 'GET'
  const qs = init?.query
    ? '?' +
      Object.entries(init.query)
        .filter(([, v]) => v !== undefined && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&')
    : ''

  const res = await fetch(`${BASE_URL}${path}${qs}`, {
    method,
    headers: {
      'CJ-Access-Token': token,
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: init?.body ? JSON.stringify(init.body) : undefined,
  })

  const json = (await res.json().catch(() => null)) as CjEnvelope<T> | null
  const success = res.ok && json && (json.code === 200 || json.code === 0 || json.code === undefined) && (json.result !== false)
  if (!success) {
    throw new CjApiError(
      `CJ ${method} ${path} failed: ${json?.message ?? res.statusText}`,
      json?.code,
      json?.requestId,
    )
  }
  return json.data as T
}

// ---------- Product endpoints (verified against CJ docs) ----------

export function getCategories() {
  return cjFetch<unknown>('/product/getCategory')
}

export function productListV2(params: {
  keyWord?: string
  page?: number
  size?: number
  categoryId?: string
  countryCode?: string
  startSellPrice?: number
  endSellPrice?: number
  addMarkStatus?: number
  productType?: number
}) {
  return cjFetch<unknown>('/product/listV2', { query: params })
}

export function productQuery(params: Record<string, string | number | undefined>) {
  return cjFetch<unknown>('/product/query', { query: params })
}

export function productDetail(id: string | number) {
  return cjFetch<unknown>('/product/productDetail/query', { method: 'POST', body: { id } })
}

export function productDetailQuery(params: Record<string, unknown>) {
  return cjFetch<unknown>('/product/productDetail/query', { method: 'POST', body: params })
}

export function productVariants(pid: string | number) {
  return cjFetch<unknown>('/product/variant/query', { query: { pid } })
}

export function variantByVid(vid: string | number) {
  return cjFetch<unknown>('/product/variant/queryByVid', { query: { vid } })
}

export function stockByVid(vid: string | number) {
  return cjFetch<unknown>('/product/stock/queryByVid', { query: { vid } })
}

export function stockBySku(sku: string) {
  return cjFetch<unknown>('/product/stock/queryBySku', { query: { sku } })
}

export function inventoryByPid(pid: string | number) {
  return cjFetch<unknown>('/product/stock/getInventoryByPid', { query: { pid } })
}

// ---------- Logistics ----------

export function freightCalculate(body: Record<string, unknown>) {
  return cjFetch<unknown>('/logistic/freightCalculate', { method: 'POST', body })
}

// ---------- Orders (sandbox only until approved — isSandbox=1) ----------

export function createOrderSandbox(body: Record<string, unknown>) {
  return cjFetch<unknown>('/shopping/order/createOrderV2', {
    method: 'POST',
    body: { ...body, isSandbox: 1 },
  })
}

export function getOrderList(params: Record<string, string | number | undefined>) {
  return cjFetch<unknown>('/shopping/order/list', { query: params })
}

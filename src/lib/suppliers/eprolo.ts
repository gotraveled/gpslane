/** EPROLO open API client — sign = MD5(apiKey + timestamp + apiSecret), apiKey header. */
import { createHash } from 'node:crypto'

const BASE = 'https://openapi.eprolo.com'

const apiKey = () => process.env.EPROLO_OPEN_API_KEY ?? ''
const apiSecret = () => process.env.EPROLO_OPEN_API_SECRET ?? ''

export function eproloSign(apiKey: string, timestamp: string, apiSecret: string) {
  return createHash('md5').update(apiKey + timestamp + apiSecret).digest('hex')
}

export async function eproloGet(path: string, params: Record<string, string | number> = {}) {
  const timestamp = Date.now().toString()
  const sign = eproloSign(apiKey(), timestamp, apiSecret())
  const qs = new URLSearchParams({ sign, timestamp, ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])) })
  const res = await fetch(`${BASE}/${path}?${qs}`, { headers: { apiKey: apiKey() } })
  const json: any = await res.json().catch(() => null)
  if (!res.ok) throw new Error(`EPROLO HTTP ${res.status} ${path}`)
  if (json && json.code !== undefined && String(json.code) !== '0') {
    throw new Error(`EPROLO ${path} code=${json.code} ${json.msg ?? ''}`)
  }
  return json?.data ?? json
}

export async function eproloPost(path: string, body: Record<string, unknown>) {
  const timestamp = Date.now().toString()
  const sign = eproloSign(apiKey(), timestamp, apiSecret())
  const res = await fetch(`${BASE}/${path}`, {
    method: 'POST',
    headers: { apiKey: apiKey(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ sign, timestamp, ...body }),
  })
  const json: any = await res.json().catch(() => null)
  if (!res.ok) throw new Error(`EPROLO HTTP ${res.status} ${path}`)
  return json
}

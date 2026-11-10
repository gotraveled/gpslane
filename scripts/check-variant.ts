import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
import { getPayload } from 'payload'

async function main() {
  const { default: cfg } = await import('../src/payload.config')
  const p = await getPayload({ config: cfg })
  const v = await p.find({ collection: 'product-variants', limit: 3, depth: 0, where: { status: { equals: 'active' } } })
  for (const d of v.docs as any[]) console.log(JSON.stringify({ id: d.id, sku: d.sku, prices: d.prices, availability: d.availability }, null, 1))
  process.exit(0)
}
main().catch((e) => { console.error('FATAL', e); process.exit(1) })

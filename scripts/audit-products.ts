import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
import { getPayload } from 'payload'

async function main() {
  const { default: cfg } = await import('../src/payload.config')
  const payload = await getPayload({ config: cfg })
  const products = await payload.find({ collection: 'products', limit: 100, depth: 0 })
  const noDesc: string[] = []
  const noImg: string[] = []
  const noSeo: string[] = []
  for (const p of products.docs as any[]) {
    const hasDesc = p.description && JSON.stringify(p.description).length > 200
    if (!hasDesc) noDesc.push(p.slug)
    if (!(p.images ?? []).length) noImg.push(p.slug)
    if (!p.seo?.metaTitle) noSeo.push(p.slug)
  }
  console.log('noDesc:', noDesc.length, noDesc.join(', '))
  console.log('noImg:', noImg.join(', '))
  console.log('noSeo:', noSeo.length, noSeo.join(', '))
  process.exit(0)
}
main().catch((e) => { console.error('FATAL', e); process.exit(1) })

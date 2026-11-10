import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
import { getPayload } from 'payload'

async function main() {
  const { default: configPromise } = await import('../src/payload.config')
  const payload = await getPayload({ config: configPromise })
  const products = await payload.find({ collection: 'products', limit: 100, depth: 0 })
  let fixed = 0
  for (const p of products.docs as any[]) {
    const updates: any = {}
    for (const field of ['name', 'shortDescription']) {
      const v = p[field]
      if (typeof v === 'string' && v.includes('�')) updates[field] = v.replace(/�/g, '—')
    }
    if (p.seo && typeof p.seo === 'object') {
      const seo = { ...p.seo }
      let dirty = false
      for (const k of Object.keys(seo)) {
        if (typeof seo[k] === 'string' && seo[k].includes('�')) { seo[k] = seo[k].replace(/�/g, '—'); dirty = true }
      }
      if (dirty) updates.seo = seo
    }
    if (Object.keys(updates).length) {
      await payload.update({ collection: 'products', id: p.id, data: updates })
      console.log('fixed', p.slug)
      fixed++
    }
  }
  // also scan media alts
  const media = await payload.find({ collection: 'media', limit: 200, depth: 0 })
  for (const m of media.docs as any[]) {
    if (typeof m.alt === 'string' && m.alt.includes('�')) {
      await payload.update({ collection: 'media', id: m.id, data: { alt: m.alt.replace(/�/g, '—') } })
    }
  }
  console.log('done, fixed', fixed)
  process.exit(0)
}
main().catch((e) => { console.error('FATAL', e); process.exit(1) })

import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
import { getPayload } from 'payload'

const TARGETS: [string, string][] = [
  ['hud-gps-speedometer', 'tmp/placeholders/hud-gps-speedometer.svg'],
  ['carlinkit-4-0-carplay-adapter', 'tmp/placeholders/carlinkit-4-0-carplay-adapter.svg'],
  ['wireless-carplay-adapter-box', 'tmp/placeholders/wireless-carplay-adapter-box.svg'],
]

async function main() {
  const { default: configPromise } = await import('../src/payload.config')
  const payload = await getPayload({ config: configPromise })
  for (const [slug, fp] of TARGETS) {
    const found = await payload.find({ collection: 'products', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
    const p: any = found.docs[0]
    if (!p) { console.log('missing', slug); continue }
    const media: any = await payload.create({
      collection: 'media',
      data: { alt: `${p.name} — GPSLane product visual` },
      filePath: fp,
    })
    await payload.update({ collection: 'products', id: p.id, data: { images: [media.id] } as any })
    console.log(slug, '-> media', media.id)
  }
  process.exit(0)
}
main().catch((e) => { console.error('FATAL', e); process.exit(1) })

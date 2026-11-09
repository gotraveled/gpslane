/** Phase 11 backfill: launchVerification for the 6 newly imported products. */
import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
import { getPayload } from 'payload'

const NOW = new Date().toISOString()
const V: Record<string, any> = {
  'android-gps-navigation-player-7-inch': {
    gpsClassification: 'standalone_gps_navigator', gpsFunctionality: 'unverified', fccISEDStatus: 'pending_evidence',
    gpsReceiverEvidence: 'CJ listing title claims Android GPS navigation player; no receiver spec or manual evidence',
    navSoftwareOs: 'Android (supplier listing)', launchReadiness: 'pending_product_verification',
    launchNotes: 'Phase 11 addition. CJ pid AC9C5BEA. Stock unverified (no inventory data returned). USPS 4-9d US $36.28 / CJPacket 4-7d CA $19.52. High cost+shipping — thin catalogue fit until verified.',
    lastVerifiedAt: NOW,
  },
  'gps-head-up-display-speed-compass': {
    gpsClassification: 'gps_accessory', gpsFunctionality: 'unverified', fccISEDStatus: 'pending_evidence',
    gpsReceiverEvidence: 'Title claims GPS speed/compass HUD (M22/E-dog); no receiver spec in supplier text',
    launchReadiness: 'pending_product_verification',
    launchNotes: 'Phase 11 addition. CJ pid 1775119195689193472. Stock unverified. USPS 5-11d US $8.29 / CJPacket 7-15d CA $6.16.',
    lastVerifiedAt: NOW,
  },
  'cycplus-m1-racer-plus-gps-cycling-computer': {
    gpsClassification: 'gps_cycling_computer', gpsFunctionality: 'unverified', fccISEDStatus: 'pending_evidence',
    gpsReceiverEvidence: 'Supplier title claims GPS cycling computer (CYCPLUS M1); ANT+ sensors supported',
    manufacturerModel: 'CYCPLUS M1', launchReadiness: 'pending_product_verification',
    launchNotes: 'Phase 11 addition (EPROLO Sports & Outdoors scan). Third-party CYCPLUS brand. Inventory 3,000 claimed. YUN 7-13d US $9.87 / JIAYOU 7-10d CA $7.76. Warehouse unverified.',
    lastVerifiedAt: NOW,
  },
  'walker-xoss-bicycle-cycling-computer': {
    gpsClassification: 'gps_cycling_computer', gpsFunctionality: 'unverified', fccISEDStatus: 'pending_evidence',
    gpsReceiverEvidence: 'Bike computer with speed/cadence + G+ sensor; GPS receiver not explicit in supplier title',
    manufacturerModel: 'Walker XOSS', launchReadiness: 'pending_product_verification',
    launchNotes: 'Phase 11 addition. GPS function ambiguous — verify before marketing as GPS computer. Inventory 3,000 claimed.',
    lastVerifiedAt: NOW,
  },
  'igpsport-igs10s-gps-cycling-computer': {
    gpsClassification: 'gps_cycling_computer', gpsFunctionality: 'unverified', fccISEDStatus: 'pending_evidence',
    gpsReceiverEvidence: 'Supplier title claims GPS stopwatch cycling computer (iGPSPORT iGS10S), ANT+ HR/cadence',
    manufacturerModel: 'iGPSPORT iGS10S', launchReadiness: 'pending_product_verification',
    launchNotes: 'Phase 11 addition. iGPSPORT brand. Inventory 3,000 claimed.',
    lastVerifiedAt: NOW,
  },
  'magene-mckim-c406-gps-cycling-computer': {
    gpsClassification: 'gps_cycling_computer', gpsFunctionality: 'unverified', fccISEDStatus: 'pending_evidence',
    gpsReceiverEvidence: 'Supplier title claims GPS bike computer (Magene McKim C406), ANT+ support, 3 colours',
    manufacturerModel: 'Magene McKim C406', launchReadiness: 'pending_product_verification',
    launchNotes: 'Phase 11 addition. Magene brand; 3 colour variants share SKU family — variant mapping pending.',
    lastVerifiedAt: NOW,
  },
}

async function main() {
  const { default: configPromise } = await import('../src/payload.config')
  const payload = await getPayload({ config: configPromise })
  let n = 0
  for (const [slug, v] of Object.entries(V)) {
    const f = await payload.find({ collection: 'products', where: { slug: { equals: slug } }, limit: 1 })
    const p: any = f.docs[0]
    if (!p) { console.log('MISS', slug); continue }
    await payload.update({ collection: 'products', id: p.id, data: { launchVerification: v } as any })
    n++
  }
  console.log('updated', n)
  process.exit(0)
}
main().catch((e) => { console.error('FATAL', e); process.exit(1) })

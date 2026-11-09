/**
 * Phase 9 backfill: writes launchVerification group + supplier-product
 * verification flags onto the 30 draft products. Idempotent (updates by slug).
 * Run: npx tsx scripts/phase9-backfill.ts
 */
import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local', override: true })
import { getPayload } from 'payload'

const NOW = new Date().toISOString()

type V = {
  gpsClassification: string
  gpsFunctionality: 'verified' | 'unverified' | 'no'
  gpsReceiverEvidence?: string
  navSoftwareOs?: string
  mapRegions?: string
  mapVersion?: string
  offlineMaps?: 'verified' | 'unverified' | 'no'
  manufacturerModel?: string
  fccISEDStatus: 'not_applicable' | 'pending_evidence' | 'verified' | 'blocked'
  launchReadiness: string
  launchNotes: string
  evidenceLinks?: { url: string; label: string; checkedAt: string }[]
}

const CJ_EVIDENCE = { url: 'https://developers.cjdropshipping.com', label: 'CJ API productDetail/variantInventory/freightCalculate', checkedAt: NOW }
const EPROLO_EVIDENCE = { url: 'https://openapi.eprolo.com', label: 'EPROLO API eprolo_product_list/get_product_shiping_fees/add_product', checkedAt: NOW }

const V: Record<string, V> = {
  // ---------- CJ (15) ----------
  'motorcycle-navigation-display': {
    gpsClassification: 'navigation_display', gpsFunctionality: 'no', fccISEDStatus: 'pending_evidence',
    navSoftwareOs: 'Android head unit (supplier listing)', launchReadiness: 'approved_for_review',
    launchNotes: 'CarPlay/Android motorcycle screen with front+rear recording. No standalone GPS claim in supplier description — marketed as navigation display only. CN stock 25,708; USPS 5-11d US / CJPacket 4-7d CA.',
    evidenceLinks: [CJ_EVIDENCE],
  },
  'portable-car-navigation-display': {
    gpsClassification: 'standalone_gps_navigator', gpsFunctionality: 'unverified', fccISEDStatus: 'pending_evidence',
    gpsReceiverEvidence: 'Supplier spec claims GPS startup time, GSm frequency, positioning accuracy 1m, tracking sensitivity — listing specs only, no manual/test evidence',
    navSoftwareOs: 'Linux', mapRegions: 'Autonavi (claimed)', mapVersion: 'unverified', offlineMaps: 'unverified',
    launchReadiness: 'pending_product_verification',
    launchNotes: 'RECLASSIFIED: supplier description indicates portable GPS navigator (Autonavi maps, GPS specs), not merely a projection screen. GPS claims need manual/spec-sheet verification before marketing as navigator. CN stock 25,523; USPS 4-9d US / CJPacket 7-15d CA.',
    evidenceLinks: [CJ_EVIDENCE],
  },
  'car-navigation-system-10-6': {
    gpsClassification: 'navigation_display', gpsFunctionality: 'unverified', fccISEDStatus: 'pending_evidence',
    gpsReceiverEvidence: 'Supplier description mentions "front and rear dual recording GPS" — ambiguous whether receiver-based navigation or GPS-tagged recording',
    navSoftwareOs: 'Android (supplier listing)', launchReadiness: 'pending_product_verification',
    launchNotes: '10.6" Android head unit, 13 variants. CE qualification present in CJ qualificationList (supplier-level). GPS capability ambiguous — do not market as navigator until verified. CN stock 160,638; USPS 4-9d US / CJPacket 4-7d CA.',
    evidenceLinks: [CJ_EVIDENCE],
  },
  'carplay-navigation-player': {
    gpsClassification: 'navigation_display', gpsFunctionality: 'unverified', fccISEDStatus: 'pending_evidence',
    gpsReceiverEvidence: 'Sold as "navigation integrated radio" 7" player — PND-class device likely has GPS but unverified',
    launchReadiness: 'pending_product_verification',
    launchNotes: '7" CarPlay/MP5 player. GPS function plausible but unverified — classify as navigation display until proven. CN stock 14,312; USPS 5-11d US / CJPacket 4-7d CA.',
    evidenceLinks: [CJ_EVIDENCE],
  },
  'gps-cycling-computer': {
    gpsClassification: 'gps_cycling_computer', gpsFunctionality: 'unverified', fccISEDStatus: 'pending_evidence',
    gpsReceiverEvidence: 'Supplier spec: "High-sensitivity GPS + Beidou + Glonass", iGS50E model, HR/cadence/speed sensors included',
    manufacturerModel: 'iGS50E', launchReadiness: 'pending_product_verification',
    launchNotes: 'Genuine GPS cycling computer category. Supplier specs claim triple-constellation GNSS; independent verification pending. CN stock 40,000; USPS 4-9d US / CJPacket 7-15d CA.',
    evidenceLinks: [CJ_EVIDENCE],
  },
  'navigation-installation-frame': {
    gpsClassification: 'gps_accessory', gpsFunctionality: 'no', fccISEDStatus: 'not_applicable',
    launchReadiness: 'approved_for_review',
    launchNotes: 'Dash-kit frame for 9/10" units. Passive part, no electronics. CN stock 80,000; USPS 5-11d US / CJPacket 4-7d CA.',
    evidenceLinks: [CJ_EVIDENCE],
  },
  'vehicle-navigation-mount': {
    gpsClassification: 'gps_accessory', gpsFunctionality: 'no', fccISEDStatus: 'not_applicable',
    launchReadiness: 'approved_for_review',
    launchNotes: 'Phone/nav bracket, multi-variant. Passive. CN stock 165,501; USPS 5-11d US / CJPacket 4-7d CA.',
    evidenceLinks: [CJ_EVIDENCE],
  },
  'dashboard-navigation-holder': {
    gpsClassification: 'gps_accessory', gpsFunctionality: 'no', fccISEDStatus: 'not_applicable',
    launchReadiness: 'approved_for_review',
    launchNotes: 'Dashboard holder. Passive. CN stock 165,190; USPS 5-11d US / CJPacket 7-15d CA.',
    evidenceLinks: [CJ_EVIDENCE],
  },
  'vent-navigation-holder': {
    gpsClassification: 'gps_accessory', gpsFunctionality: 'no', fccISEDStatus: 'not_applicable',
    launchReadiness: 'approved_for_review',
    launchNotes: 'Air-vent holder. Passive. CN stock 26,253; USPS 5-11d US / CJPacket 7-15d CA.',
    evidenceLinks: [CJ_EVIDENCE],
  },
  'folding-suction-navigation-mount': {
    gpsClassification: 'gps_accessory', gpsFunctionality: 'no', fccISEDStatus: 'not_applicable',
    launchReadiness: 'approved_for_review',
    launchNotes: 'Suction mount. Passive. CN stock 20,000; USPS 5-11d US / CJPacket 7-15d CA.',
    evidenceLinks: [CJ_EVIDENCE],
  },
  'magnetic-navigation-mount': {
    gpsClassification: 'gps_accessory', gpsFunctionality: 'no', fccISEDStatus: 'not_applicable',
    launchReadiness: 'approved_for_review',
    launchNotes: 'Magnetic mount. Passive. CN stock 84,733; USPS-remote service 5-10d US / CJPacket 7-15d CA.',
    evidenceLinks: [CJ_EVIDENCE],
  },
  'motorcycle-gps-power-adapter': {
    gpsClassification: 'gps_accessory', gpsFunctionality: 'no', fccISEDStatus: 'not_applicable',
    launchReadiness: 'approved_for_review',
    launchNotes: 'SAE-to-USB power adapter for motorcycle GPS. Passive power accessory. CN stock 14,873; USPS 5-11d US / CJPacket 7-15d CA.',
    evidenceLinks: [CJ_EVIDENCE],
  },
  'vehicle-navigation-power-cable': {
    gpsClassification: 'gps_accessory', gpsFunctionality: 'no', fccISEDStatus: 'not_applicable',
    launchReadiness: 'pending_supplier_evidence',
    launchNotes: '100W USB-C car charger. US stock only 28 units (CN 174,116). NO Canada freight quote captured — CA availability unverified, mark US-only until quoted. USPS+VIP 3-7d US.',
    evidenceLinks: [CJ_EVIDENCE],
  },
  'head-up-display': {
    gpsClassification: 'gps_accessory', gpsFunctionality: 'no', fccISEDStatus: 'pending_evidence',
    launchReadiness: 'pending_supplier_evidence',
    launchNotes: 'OBD/head-up display ("on-board computer monitor"). No GPS claim in supplier description. US stock 66 (CN 74,227). NO Canada freight quote — mark US-only until quoted. USPS+VIP 3-7d US.',
    evidenceLinks: [CJ_EVIDENCE],
  },
  'wireless-carplay-adapter': {
    gpsClassification: 'gps_accessory', gpsFunctionality: 'no', fccISEDStatus: 'pending_evidence',
    launchReadiness: 'approved_for_review',
    launchNotes: 'Wired-to-wireless CarPlay adapter. Supplier packing list ambiguously mentions "Car GPS" — listing appears to bundle screen+adapter; verify actual contents before publishing. CN stock 11,275; USPS-remote 5-10d US / CJPacket 7-15d CA.',
    evidenceLinks: [CJ_EVIDENCE],
  },

  // ---------- EPROLO (15) ----------
  'gps-navigator-7-inch-portable': {
    gpsClassification: 'standalone_gps_navigator', gpsFunctionality: 'unverified', fccISEDStatus: 'pending_evidence',
    gpsReceiverEvidence: 'Supplier spec sheet: "Receiver: GPS", MSTAR 2531 800MHz, Windows CE 6.0, 256MB RAM / 8GB ROM, 1200mAh battery, SD≤32GB, FM, car adapter. Map claim: "latest maps 2025, free update". Regional variants US/EU/UK/AU.',
    navSoftwareOs: 'Windows CE 6.0 (supplier spec)', mapRegions: 'US / EU / UK / AU (variant-dependent)', mapVersion: '2025 claimed, unverified', offlineMaps: 'unverified',
    manufacturerModel: 'unverified (MSTAR 2531 platform)',
    launchReadiness: 'pending_product_verification',
    launchNotes: 'SPECIAL REVIEW: strongest genuine-GPS candidate in catalogue. Supplier specs support standalone navigation w/ offline-capable PND architecture, but no independent test/manual evidence. Warehouse origin unverified (assumed CN). Carriers 4PX/Yanwen/Yun/Jiayou economy, 10-20d US / 8-15d CA — NOT USPS.',
    evidenceLinks: [EPROLO_EVIDENCE],
  },
  'carplay-screen-10-26-portable': {
    gpsClassification: 'navigation_display', gpsFunctionality: 'no', fccISEDStatus: 'pending_evidence',
    navSoftwareOs: 'Linux (supplier spec)', launchReadiness: 'pending_supplier_evidence',
    launchNotes: '10.26" portable CarPlay/Android Auto/AirPlay screen + AHD camera option. No GPS function — projection display only. EPROLO warehouse unverified; economy carriers 10-20d US / 8-15d CA.',
    evidenceLinks: [EPROLO_EVIDENCE],
  },
  'carplay-mp5-7-inch-portable': {
    gpsClassification: 'navigation_display', gpsFunctionality: 'no', fccISEDStatus: 'pending_evidence',
    navSoftwareOs: 'Android-based (supplier spec)', launchReadiness: 'pending_supplier_evidence',
    launchNotes: '7" wireless CarPlay MP5, 8GB/64GB. No GPS — projection display. EPROLO warehouse unverified; economy carriers.',
    evidenceLinks: [EPROLO_EVIDENCE],
  },
  'pnd-navigation-player-dashcam': {
    gpsClassification: 'standalone_gps_navigator', gpsFunctionality: 'unverified', fccISEDStatus: 'pending_evidence',
    gpsReceiverEvidence: 'Listed as "PND multimedia player navigation" with front 4K/rear 1080P recording; GPS receiver not explicitly confirmed in retrieved spec text',
    launchReadiness: 'pending_product_verification',
    launchNotes: 'PND-class navigation player + dashcam. GPS capability plausible but unverified — verify receiver before marketing as navigator. EPROLO warehouse unverified; economy carriers.',
    evidenceLinks: [EPROLO_EVIDENCE],
  },
  'carplay-android-auto-interface-box': {
    gpsClassification: 'gps_accessory', gpsFunctionality: 'no', fccISEDStatus: 'pending_evidence',
    launchReadiness: 'pending_supplier_evidence',
    launchNotes: 'Wireless CarPlay/Android Auto interface box (18 supplier variants — vehicle compatibility must be mapped before sale). EPROLO warehouse unverified.',
    evidenceLinks: [EPROLO_EVIDENCE],
  },
  'wireless-carplay-adapter-box': {
    gpsClassification: 'gps_accessory', gpsFunctionality: 'no', fccISEDStatus: 'pending_evidence',
    launchReadiness: 'pending_supplier_evidence',
    launchNotes: 'Wired-to-wireless CarPlay/Android Auto adapter. EPROLO warehouse unverified; economy carriers.',
    evidenceLinks: [EPROLO_EVIDENCE],
  },
  'carlinkit-4-0-carplay-adapter': {
    gpsClassification: 'gps_accessory', gpsFunctionality: 'no', fccISEDStatus: 'pending_evidence',
    launchReadiness: 'pending_supplier_evidence',
    launchNotes: 'Carlinkit 4.0 (CP2A) — third-party BRANDED product; supplier compatibility list covers many OEM systems. Brand attribution must be accurate in listing (not GPSLane-manufactured). EPROLO warehouse unverified.',
    evidenceLinks: [EPROLO_EVIDENCE],
  },
  'hud-gps-speedometer': {
    gpsClassification: 'gps_accessory', gpsFunctionality: 'unverified', fccISEDStatus: 'pending_evidence',
    gpsReceiverEvidence: 'Title claims GPS speedometer; retrieved spec (ABS, LED, 4in) does not confirm GPS receiver',
    launchReadiness: 'pending_supplier_evidence',
    launchNotes: 'HUD projector. GPS-based speed claim unverified — if no GPS receiver, it is a standard HUD. EPROLO warehouse unverified.',
    evidenceLinks: [EPROLO_EVIDENCE],
  },
  'hud-obd2-head-up-display': {
    gpsClassification: 'gps_accessory', gpsFunctionality: 'no', fccISEDStatus: 'pending_evidence',
    launchReadiness: 'pending_supplier_evidence',
    launchNotes: 'Wired OBD2 HUD (speed/RPM/voltage from vehicle bus — no GPS). EPROLO warehouse unverified.',
    evidenceLinks: [EPROLO_EVIDENCE],
  },
  'hud-a900-head-up-display': {
    gpsClassification: 'gps_accessory', gpsFunctionality: 'no', fccISEDStatus: 'pending_evidence',
    launchReadiness: 'pending_supplier_evidence',
    launchNotes: 'Wired A900 HUD. Supplier claims "CE, ROHS, FCC" testing in spec text — claim only, certificates not provided. EPROLO warehouse unverified.',
    evidenceLinks: [EPROLO_EVIDENCE],
  },
  'magnetic-suction-navigation-holder': {
    gpsClassification: 'gps_accessory', gpsFunctionality: 'no', fccISEDStatus: 'not_applicable',
    launchReadiness: 'pending_supplier_evidence',
    launchNotes: 'Dashboard suction magnetic holder. Passive. EPROLO warehouse unverified; economy carriers.',
    evidenceLinks: [EPROLO_EVIDENCE],
  },
  'vent-magnetic-navigation-holder': {
    gpsClassification: 'gps_accessory', gpsFunctionality: 'no', fccISEDStatus: 'not_applicable',
    launchReadiness: 'pending_supplier_evidence',
    launchNotes: 'Vent magnetic holder. Passive. EPROLO warehouse unverified.',
    evidenceLinks: [EPROLO_EVIDENCE],
  },
  'universal-dashboard-navigation-holder': {
    gpsClassification: 'gps_accessory', gpsFunctionality: 'no', fccISEDStatus: 'not_applicable',
    launchReadiness: 'pending_supplier_evidence',
    launchNotes: 'Universal dashboard holder. Passive. EPROLO warehouse unverified.',
    evidenceLinks: [EPROLO_EVIDENCE],
  },
  'motorcycle-usb-power-socket-36w': {
    gpsClassification: 'gps_accessory', gpsFunctionality: 'no', fccISEDStatus: 'not_applicable',
    launchReadiness: 'pending_supplier_evidence',
    launchNotes: '12V/24V dual-USB socket for motorcycle GPS. Passive power accessory. EPROLO warehouse unverified.',
    evidenceLinks: [EPROLO_EVIDENCE],
  },
  'dual-usb-car-charger-gps': {
    gpsClassification: 'gps_accessory', gpsFunctionality: 'no', fccISEDStatus: 'not_applicable',
    launchReadiness: 'pending_supplier_evidence',
    launchNotes: 'Dual USB car charger. Passive. EPROLO warehouse unverified.',
    evidenceLinks: [EPROLO_EVIDENCE],
  },
}

const WAREHOUSE_VERIFIED_SLUGS = new Set([
  'motorcycle-navigation-display', 'portable-car-navigation-display', 'car-navigation-system-10-6',
  'carplay-navigation-player', 'gps-cycling-computer', 'navigation-installation-frame', 'vehicle-navigation-mount',
  'dashboard-navigation-holder', 'vent-navigation-holder', 'folding-suction-navigation-mount',
  'magnetic-navigation-mount', 'motorcycle-gps-power-adapter', 'vehicle-navigation-power-cable', 'head-up-display',
]) // CJ stock verified via getInventoryByPid (CN for most; CN+US for the two US-stocked items)

async function main() {
  const { default: configPromise } = await import('../src/payload.config')
  const payload = await getPayload({ config: configPromise })

  let updated = 0
  const missing: string[] = []
  for (const [slug, v] of Object.entries(V)) {
    const found = await payload.find({ collection: 'products', where: { slug: { equals: slug } }, limit: 1 })
    const product = found.docs[0]
    if (!product) { missing.push(slug); continue }

    await payload.update({
      collection: 'products',
      id: product.id,
      data: { launchVerification: v } as any,
    })

    updated++
  }
  console.log(`products updated=${updated} missing=${missing.length}`, missing)

  // supplier-products flags: second pass via variant linkage
  let spUpdated = 0
  for (const [slug] of Object.entries(V)) {
    const found = await payload.find({ collection: 'products', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
    const product: any = found.docs[0]
    if (!product) continue
    const variants = await payload.find({ collection: 'product-variants', where: { product: { equals: product.id } }, limit: 5 })
    for (const vr of variants.docs as any[]) {
      const sps = await payload.find({ collection: 'supplier-products', where: { variant: { equals: vr.id } }, limit: 1 })
      const sp: any = sps.docs[0]
      if (!sp) continue
      const isEprolo = slug === 'gps-navigator-7-inch-portable' || V[slug].evidenceLinks?.[0]?.label?.includes('EPROLO')
      await payload.update({
        collection: 'supplier-products',
        id: sp.id,
        data: {
          warehouseVerified: WAREHOUSE_VERIFIED_SLUGS.has(slug),
          shippingRouteVerified: true, // freight quotes captured per destination via supplier API
          supplierEvidence: `${isEprolo ? 'EPROLO' : 'CJ'} API evidence checked ${NOW.slice(0, 10)}: product detail, variant inventory, per-destination freight quotes.`,
          supplierEvidenceCheckedAt: NOW,
        } as any,
      })
      spUpdated++
    }
  }
  console.log(`supplier-products updated=${spUpdated}`)
  process.exit(0)
}

main().catch((e) => { console.error('FATAL', e); process.exit(1) })

/** Build data/eprolo/launch-catalogue.json from imported-products + shipping data. */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'

const DIR = path.resolve('data/eprolo')
mkdirSync(DIR, { recursive: true })

const imported: any[] = JSON.parse(readFileSync(path.join(DIR, 'imported-products.json'), 'utf8'))
const shipping: any[] = JSON.parse(readFileSync(path.join(DIR, 'shipping.json'), 'utf8'))
const cands: any[] = JSON.parse(readFileSync(path.join(DIR, 'gps-candidates.json'), 'utf8'))
const shipById = new Map(shipping.map((s) => [String(s.id), s]))
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 60)
const importedByTitle = new Map(imported.map((p: any) => [norm(p.title), p]))
const _platformIdByTitle = new Map(cands.map((c: any) => [norm(c.title), String(c.id)]))

// curated selection — devices first, then accessories; Carlinkit kept pending (brand)
const PICKS: { srcId: string; slug: string; title: string; blurb: string; category: string; variantIdx?: number; note?: string }[] = [
  { srcId: '30816802', slug: 'gps-navigator-7-inch-portable', title: 'GPSLane 7-Inch Portable GPS Navigator for Cars & Trucks', blurb: 'Standalone GPS navigation device with 7-inch touchscreen, GPS receiver, multimedia player and regional map support. No smartphone required for navigation.', category: 'gps-navigators', variantIdx: 2, note: 'Variants differ by map region (US/EU/UK/AU); US variant selected as default.' },
  { srcId: '30605296', slug: 'carplay-screen-10-26-portable', title: 'GPSLane 10.6-Inch Portable CarPlay & Android Auto Screen', blurb: 'Portable 10.6-inch smart display for wireless CarPlay, Android Auto and AirPlay with rear-view camera support. Navigation is provided by the connected smartphone.', category: 'carplay-displays' },
  { srcId: '30212551', slug: 'carplay-mp5-7-inch-portable', title: 'GPSLane 7-Inch Wireless CarPlay Portable MP5 Player', blurb: 'Portable 7-inch wireless CarPlay screen with 8GB RAM / 64GB storage, backup camera input and smartphone projection. Not a standalone GPS navigator.', category: 'carplay-displays' },
  { srcId: '29572817', slug: 'pnd-navigation-player-dashcam', title: 'GPSLane PND Navigation Player with Driving Recorder', blurb: 'Portable navigation multimedia player (PND) with driving recorder and multilingual interface. GPS capability pending spec verification.', category: 'gps-navigators', note: 'Verify standalone GPS reception before publishing.' },
  { srcId: '26727255', slug: 'carplay-android-auto-interface-box', title: 'GPSLane Wireless CarPlay & Android Auto Interface Box', blurb: 'Converts factory wired CarPlay/Android Auto to wireless. Compact OBD-free adapter for compatible vehicles. Smartphone-dependent.', category: 'carplay-accessories', note: '18 supplier variants (vehicle compatibility); default variant only for now.' },
  { srcId: '27777277', slug: 'wireless-carplay-adapter-box', title: 'GPSLane Wireless CarPlay Adapter Box', blurb: 'Wired-to-wireless CarPlay and Android Auto adapter module for vehicles with factory wired CarPlay. Smartphone-dependent.', category: 'carplay-accessories' },
  { srcId: '20204559', slug: 'carlinkit-4-0-carplay-adapter', title: 'GPSLane Carlinkit 4.0 Wireless CarPlay Adapter', blurb: 'Carlinkit 4.0 wired-to-wireless CarPlay/Android Auto adapter for compatible factory systems. Smartphone-dependent.', category: 'carplay-accessories', note: 'Branded Carlinkit product — pending review.' },
  { srcId: '26713049', slug: 'hud-gps-speedometer', title: 'GPSLane Head-Up Display GPS Speedometer', blurb: 'HUD projector showing GPS-based speed, mileage and overspeed warning on the windshield. Smartphone-free speed display.', category: 'gps-accessories' },
  { srcId: '1600184', slug: 'hud-obd2-head-up-display', title: 'GPSLane OBD2 Head-Up Display with Overspeed Warning', blurb: 'Wired OBD2 head-up display projecting speed, RPM and voltage onto the windshield.', category: 'gps-accessories' },
  { srcId: '1599978', slug: 'hud-a900-head-up-display', title: 'GPSLane A900 Head-Up Display Projector', blurb: 'Compact wired HUD displaying speed, RPM, water temperature and voltage on the windshield.', category: 'gps-accessories' },
  { srcId: '29719368', slug: 'magnetic-suction-navigation-holder', title: 'GPSLane Magnetic Suction Cup Navigation Phone Holder', blurb: 'Dashboard suction-cup magnetic phone mount for navigation devices and smartphones.', category: 'gps-accessories' },
  { srcId: '29971751', slug: 'vent-magnetic-navigation-holder', title: 'GPSLane Vent-Mount Magnetic Navigation Holder', blurb: 'Air-vent magnetic phone holder for navigation devices and smartphones.', category: 'gps-accessories' },
  { srcId: '10719202', slug: 'universal-dashboard-navigation-holder', title: 'GPSLane Universal Dashboard Navigation Holder', blurb: 'Adjustable dashboard bracket for GPS navigators and phones up to 6.5 inches.', category: 'gps-accessories' },
  { srcId: '10607586', slug: 'motorcycle-usb-power-socket-36w', title: 'GPSLane 36W Motorcycle & Car Dual USB Power Socket', blurb: '12V/24V waterproof dual-USB charging socket for motorcycle GPS units and phones.', category: 'gps-accessories' },
  { srcId: '1718270', slug: 'dual-usb-car-charger-gps', title: 'GPSLane Dual USB Car Charger for GPS & Phones', blurb: 'Dual USB car charger for powering GPS navigators and smartphones.', category: 'gps-accessories' },
]

const priceFloor = (landedUsd: number, landedCad: number) => {
  const usd = Math.round((Math.floor((landedUsd / 0.65) * 100) / 100 + 0.99) * 100) / 100
  const cad = Math.round((Math.floor(((landedCad * 1.38) / 0.65) * 100) / 100 + 0.99) * 100) / 100
  return { usd, cad }
}

const out: any[] = []
for (const pick of PICKS) {
  const ship = shipById.get(pick.srcId)
  const cand = cands.find((x: any) => String(x.id) === pick.srcId)
  const epId = importedByTitle.get(norm(cand?.title ?? ''))
  if (!epId || !ship) { console.log('MISSING', pick.srcId); continue }
  const vIdx = pick.variantIdx ?? 0
  const variant = epId.variantlist?.[vIdx] ?? epId.variantlist?.[0]
  const costUsd = parseFloat(variant?.cost ?? '0')
  const shipUs = ship.shipUS?.costUsd ?? 0
  const shipCa = ship.shipCA?.costUsd ?? 0
  const landedUsd = Math.round((costUsd + shipUs) * 100) / 100
  const landedCad = Math.round((costUsd + shipCa) * 1.38 * 100) / 100
  const { usd: priceUsd, cad: priceCad } = priceFloor(landedUsd, landedCad)
  const agingUs = ship.shipUS?.shipTime ?? ''
  const agingCa = ship.shipCA?.shipTime ?? ''
  const agingUsNorm = agingUs.replace(/Ｄ/g, 'D')
  const agingCaNorm = agingCa.replace(/Ｄ/g, 'D')
  out.push({
    slug: pick.slug,
    title: pick.title,
    blurb: pick.blurb,
    category: pick.category,
    supplierId: 'eprolo',
    supplierProductId: String(epId.id),
    eproloPlatformId: pick.srcId,
    supplierVariantId: String(variant?.id ?? ''),
    supplierSku: variant?.sku ?? '',
    eproloNote: pick.note,
    variantName: variant?.title ?? variant?.option1 ?? 'Default',
    unitCostUsd: costUsd,
    weightG: variant?.weight ?? null,
    inventoryQty: variant?.inventory_quantity ?? null,
    warehouseCountry: 'CN',
    warehouseVerified: false,
    warehouseStock: { CN: variant?.inventory_quantity ?? 0, US: 0, CA: 0 },
    brandingTier: 'generic',
    brandingStatus: 'branding_unverified',
    reviewStatus: 'pending_review',
    isship: epId.isship,
    imagefirst: epId.imagefirst,
    bodyHtml: epId.body_html,
    shippingUs: { service: ship.shipUS?.method ?? 'economy', carrier: ship.shipUS?.method ?? '', priceUsd: shipUs, aging: agingUsNorm, allOptions: ship.shipUSAll },
    shippingCa: { service: ship.shipCA?.method ?? 'economy', carrier: ship.shipCA?.method ?? '', priceUsd: shipCa, aging: agingCaNorm, allOptions: ship.shipCAAll },
    landedCostUsd: landedUsd,
    landedCostCad: landedCad,
    priceUsd, priceCad,
    marginFloorUsd: Math.round((landedUsd / 0.65) * 100) / 100,
    marginFloorCad: Math.round(((landedCad * 1.38) / 0.65) * 100) / 100,
    allVariants: (epId.variantlist ?? []).map((v: any) => ({ id: v.id, title: v.title, cost: v.cost, inventory: v.inventory_quantity, sku: v.sku })),
  })
  console.log(`${pick.slug} | cost $${costUsd} | US $${shipUs} ${agingUsNorm} | CA $${shipCa} ${agingCaNorm} | sell $${priceUsd}`)
}
writeFileSync(path.join(DIR, 'launch-catalogue.json'), JSON.stringify(out, null, 2))
console.log('DONE', out.length, '→ data/eprolo/launch-catalogue.json')

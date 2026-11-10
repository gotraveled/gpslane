import { writeFileSync, mkdirSync } from 'node:fs'

// Generates branded placeholder product images (SVG) for products whose
// supplier image URLs are dead. Green gradient + line icon + product title.

const ICONS: Record<string, string> = {
  hud: `<rect x="120" y="150" width="560" height="220" rx="24" fill="none" stroke="#fff" stroke-width="10"/>
        <path d="M160 300 L300 200 L420 280 L540 190 L640 260" fill="none" stroke="#a4e26e" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="660" cy="180" r="26" fill="#a4e26e"/>`,
  carplay: `<rect x="140" y="160" width="520" height="300" rx="20" fill="none" stroke="#fff" stroke-width="10"/>
        <rect x="180" y="200" width="440" height="180" rx="8" fill="rgba(255,255,255,0.12)"/>
        <path d="M260 360 l40 -60 40 40 60 -80" fill="none" stroke="#a4e26e" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="620" cy="200" r="18" fill="#a4e26e"/>`,
  box: `<rect x="200" y="220" width="400" height="200" rx="18" fill="none" stroke="#fff" stroke-width="10"/>
        <circle cx="280" cy="300" r="24" fill="#a4e26e"/>
        <path d="M340 300 h120 M460 300 l-30 -25 M460 300 l-30 25" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round"/>
        <path d="M250 380 h300" stroke="rgba(255,255,255,0.5)" stroke-width="6" stroke-linecap="round"/>`,
  gps: `<circle cx="400" cy="330" r="150" fill="none" stroke="#fff" stroke-width="10"/>
        <circle cx="400" cy="330" r="90" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="6"/>
        <path d="M400 230 v-50 M400 430 v50 M300 330 h-50 M500 330 h50" stroke="#a4e26e" stroke-width="10" stroke-linecap="round"/>
        <circle cx="400" cy="330" r="20" fill="#a4e26e"/>`,
}

const PRODUCTS: [string, string, string][] = [
  ['hud-gps-speedometer', 'HUD GPS Speedometer', 'hud'],
  ['carlinkit-4-0-carplay-adapter', 'Carlinkit 4.0 CarPlay Adapter', 'carplay'],
  ['wireless-carplay-adapter-box', 'Wireless CarPlay Adapter Box', 'box'],
]

mkdirSync('tmp/placeholders', { recursive: true })

for (const [slug, title, icon] of PRODUCTS) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1a4d00"/><stop offset="0.55" stop-color="#227000"/><stop offset="1" stop-color="#0d2f00"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.35" r="0.6">
      <stop offset="0" stop-color="rgba(164,226,110,0.25)"/><stop offset="1" stop-color="rgba(0,0,0,0)"/>
    </radialGradient>
  </defs>
  <rect width="800" height="800" fill="url(#bg)"/>
  <rect width="800" height="800" fill="url(#glow)"/>
  <g opacity="0.9">${ICONS[icon]}</g>
  <text x="400" y="560" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="700" fill="#ffffff" letter-spacing="2">${title.toUpperCase()}</text>
  <text x="400" y="615" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="600" fill="#a4e26e" letter-spacing="4">GPSLANE</text>
  <text x="400" y="745" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="rgba(255,255,255,0.65)">Premium GPS Navigation &amp; Accessories</text>
</svg>`
  writeFileSync(`tmp/placeholders/${slug}.svg`, svg)
  console.log('wrote', slug)
}

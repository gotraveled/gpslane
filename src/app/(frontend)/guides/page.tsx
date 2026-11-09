import Link from 'next/link'

export const metadata = {
  title: 'GPS Guides & Tips | GPSLane',
  description: 'Free GPS guides — how to choose a GPS for truck driving, GPS vs smartphone navigation, and how to pick the right CarPlay GPS screen for your vehicle.',
  keywords: 'GPS guides, GPS tips, truck GPS guide, GPS vs smartphone, CarPlay GPS screen guide',
}

const GUIDES = [
  {
    href: '/guides/best-gps-for-truck-drivers',
    title: 'Best GPS Features for Truck Drivers',
    desc: 'What actually matters in a truck GPS — screen size, truck-specific routing, lane guidance and mount compatibility.',
  },
  {
    href: '/guides/gps-vs-smartphone-navigation',
    title: 'GPS Device vs Smartphone Navigation',
    desc: 'An honest comparison — when a dedicated GPS beats your phone, and when your phone is enough.',
  },
  {
    href: '/guides/how-to-choose-carplay-gps-screen',
    title: 'How to Choose a CarPlay GPS Screen',
    desc: 'Screen size, standalone GPS vs projection-only, installation type and what to check before buying.',
  },
]

export default function GuidesPage() {
  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      <div className="page-head">
        <h1>GPS Guides &amp; Tips</h1>
        <p className="lede">Free, practical guides to help you choose, install and get the most from your GPS navigation.</p>
      </div>
      <div className="grid grid-3">
        {GUIDES.map((g) => (
          <Link key={g.href} href={g.href} className="card" style={{ padding: '1.6rem', textDecoration: 'none' }}>
            <h3 style={{ color: 'var(--text)' }}>{g.title}</h3>
            <p className="muted" style={{ fontSize: '0.92rem', marginBottom: '0.75rem' }}>{g.desc}</p>
            <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>Read guide →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

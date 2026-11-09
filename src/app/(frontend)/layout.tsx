import React from 'react'
import Link from 'next/link'
import './styles.css'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gpslane.com'),
  title: {
    default: 'GPSLane — GPS Navigation Devices & Map Updates for USA & Canada',
    template: '%s | GPSLane',
  },
  description:
    'GPS navigation devices, mounts and accessories for cars, motorcycles and cyclists — plus professional GPS map-update assistance for USA and Canada.',
}

const NAV = [
  { href: '/shop', label: 'Shop' },
  { href: '/shop/gps-navigators', label: 'GPS Navigators' },
  { href: '/shop/navigation-displays', label: 'Displays' },
  { href: '/shop/gps-cycling-computers', label: 'Cycling' },
  { href: '/shop/gps-accessories', label: 'Accessories' },
  { href: '/map-updates', label: 'Map Updates' },
]

const FOOTER = [
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/shipping', label: 'Shipping' },
  { href: '/returns', label: 'Returns & Refunds' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/contact', label: 'Contact' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container header-inner">
            <Link href="/" className="brand">
              GPS<span>Lane</span>
            </Link>
            <nav className="main-nav" aria-label="Main">
              {NAV.map((l) => (
                <Link key={l.href} href={l.href}>{l.label}</Link>
              ))}
            </nav>
            <Link href="/shop" className="btn btn-primary header-cta">Shop Now</Link>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container footer-grid">
            <div>
              <div className="brand footer-brand">GPS<span>Lane</span></div>
              <p className="muted">GPS navigation devices, accessories and professional map-update assistance for drivers and riders across the USA and Canada.</p>
            </div>
            <div>
              <h4>Store</h4>
              <Link href="/shop">All products</Link>
              <Link href="/shop/gps-navigators">GPS Navigators</Link>
              <Link href="/shop/navigation-displays">Navigation Displays</Link>
              <Link href="/shop/gps-cycling-computers">Cycling Computers</Link>
              <Link href="/shop/gps-accessories">Accessories</Link>
            </div>
            <div>
              <h4>Services</h4>
              <Link href="/map-updates">GPS Map Updates</Link>
              <Link href="/map-updates/request">Request map update</Link>
              <Link href="/map-updates/eligibility">Eligibility check</Link>
            </div>
            <div>
              <h4>Company</h4>
              {FOOTER.map((l) => (
                <Link key={l.href} href={l.href}>{l.label}</Link>
              ))}
            </div>
          </div>
          <div className="container footer-bottom">
            <p className="muted">© {new Date().getFullYear()} GPSLane. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}

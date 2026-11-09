import React from 'react'
import Link from 'next/link'
import { Inter, Roboto_Condensed } from 'next/font/google'
import './styles.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-roboto-condensed',
  display: 'swap',
})

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
  { href: '/gps-maps-updates', label: 'Gps Maps Updates' },
  { href: '/about-us', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
]

const FOOTER = [
  { href: '/about-us', label: 'About Us' },
  { href: '/gps-maps-updates', label: 'GPS Map Update Service' },
  { href: '/how-to-update-gps-maps-diy-guide', label: 'How to Update Maps (DIY Guide)' },
  { href: '/frequently-asked-questions-faqs', label: 'FAQs' },
  { href: '/shipping-and-returns', label: 'Shipping & Returns' },
  { href: '/terms-and-conditions', label: 'Terms & Conditions' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/disclaimer', label: 'Disclaimer' },
  { href: '/contact', label: 'Contact Us' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoCondensed.variable}`}>
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
            <Link href="/shop" className="btn btn-primary header-cta">Shop GPS Devices</Link>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container footer-grid">
            <div>
              <div className="brand footer-brand">GPS<span>Lane</span></div>
              <p className="muted">Your trusted GPS brand for reliable navigation and map updates across the USA &amp; Canada.</p>
            </div>
            <div>
              <h4>Store</h4>
              <Link href="/shop">All Products</Link>
              <Link href="/shop/gps-navigators">GPS Navigators</Link>
              <Link href="/shop/navigation-displays">Navigation Displays</Link>
              <Link href="/shop/gps-cycling-computers">Cycling Computers</Link>
              <Link href="/shop/gps-accessories">GPS Accessories</Link>
            </div>
            <div>
              <h4>Contact</h4>
              <p className="muted" style={{ fontSize: '0.88rem', marginBottom: '0.4rem' }}>
                📞 (888) 400-3290<br />
                📧 info@gpslane.com<br />
                📍 C201-202, Phase 8B, Mohali, Punjab 140203, India<br />
                🕐 Mon–Sat: 9 AM – 7 PM IST
              </p>
            </div>
            <div>
              <h4>Company</h4>
              {FOOTER.map((l) => (
                <Link key={l.href} href={l.href}>{l.label}</Link>
              ))}
            </div>
          </div>
          <div className="container footer-bottom">
            <p className="muted">© {new Date().getFullYear()} GPSLane. All rights reserved. · <Link href="/contact" style={{ display: 'inline' }}>info@gpslane.com</Link> · (888) 400-3290</p>
          </div>
        </footer>
      </body>
    </html>
  )
}

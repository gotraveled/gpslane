import React from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { Roboto, Roboto_Condensed } from 'next/font/google'
import CartIcon from '../../components/CartIcon'
import CartProvider from '../../components/CartProvider'
import './styles.css'

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-roboto', display: 'swap' })
const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-roboto-condensed',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gpslane.com'),
  alternates: {
    languages: { 'en-US': '/', 'en-CA': '/', 'x-default': '/' },
  },
  title: {
    default: 'GPSLane — GPS Navigation Devices & Map Updates for USA & Canada',
    template: '%s | GPSLane',
  },
  description:
    'GPSLane — GPS navigation devices, mounts and accessories plus professional GPS map update service for USA and Canada. One-time $99.99 map updates, PayPal payments, real human support.',
  keywords:
    'GPSLane, GPS map update, GPS navigation device, update GPS maps USA Canada, GPS devices, CarPlay display, GPS cycling computer',
  openGraph: {
    type: 'website',
    siteName: 'GPSLane',
    title: 'GPSLane - GPS Navigation Devices & Map Updates for USA & Canada',
    description: 'Affordable GPS navigation devices and professional $99.99 map update service for USA and Canada.',
    images: [{ url: '/logo-gpslane.png', width: 600, height: 400, alt: 'GPSLane' }],
  },
  twitter: {
    card: 'summary',
    title: 'GPSLane',
    description: 'GPS navigation devices & map updates for USA and Canada.',
    images: ['/logo-gpslane.png'],
  },
}

const NAV = [
  { href: '/shop', label: 'Shop' },
  { href: '/map-updates', label: 'Map Updates' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const FOOTER = [
  { href: '/about', label: 'About' },
  { href: '/map-updates', label: 'GPS Map Update Service' },
  { href: '/how-to-update-gps-maps-diy-guide', label: 'How to Update Maps (DIY Guide)' },
  { href: '/faq', label: 'FAQs' },
  { href: '/shipping-and-returns', label: 'Shipping & Returns' },
  { href: '/terms', label: 'Terms & Conditions' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/cookie-policy', label: 'Cookie Policy' },
  { href: '/payment-security', label: 'Payment Security' },
  { href: '/accessibility', label: 'Accessibility' },
  { href: '/disclaimer', label: 'Disclaimer' },
  { href: '/contact', label: 'Contact Us' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${roboto.variable} ${robotoCondensed.variable}`}>
      <head>
        <Script id="gtm" strategy="beforeInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-P66V5MQF');
        `}</Script>
      </head>
      <body className={`${roboto.variable} ${robotoCondensed.variable}`}>
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P66V5MQF" height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
        </noscript>
        <Script src="//code.jivosite.com/widget/89zATt2IcH" strategy="lazyOnload" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'GPSLane',
              url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gpslane.com',
              logo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gpslane.com'}/logo-gpslane.png`,
              email: 'info@gpslane.com',
              telephone: '+1-844-966-7866',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '4500 Margalo Avenue',
                addressLocality: 'Bakersfield',
                addressRegion: 'CA',
                postalCode: '93313',
                addressCountry: 'US',
              },
            }),
          }}
        />
        <CartProvider>
        <header className="site-header">
          <div className="container header-inner">
            <Link href="/" className="brand" aria-label="GPSLane home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-gpslane.png" alt="GPSLane" className="logo-img" />
            </Link>
            <input type="checkbox" id="nav-toggle" className="nav-toggle" aria-hidden="true" />
            <label htmlFor="nav-toggle" className="nav-toggle-label" aria-label="Toggle navigation menu">
              <span></span><span></span><span></span>
            </label>
            <nav className="main-nav" aria-label="Main">
              {NAV.map((l) => (
                <Link key={l.href} href={l.href}>{l.label}</Link>
              ))}
            </nav>
            <div style={{ gridColumn: 3, justifySelf: 'end', display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
              <Link href="/wishlist" className="account-link" aria-label="My wishlist">♥</Link>
              <CartIcon />
              <Link href="/account" className="account-link" aria-label="My account">👤</Link>
              <Link href="/shop" className="btn btn-primary header-cta">Shop GPS Devices</Link>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container footer-grid">
            <div className="footer-brand">
              <Link href="/" aria-label="GPSLane home">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-gpslane.png" alt="GPSLane" className="logo-img footer-logo" />
              </Link>
              <p className="muted">
                Your trusted GPS brand for reliable navigation and map updates across the USA &amp; Canada.
                Affordable devices, verified North American shipping, and real human support for every order.
              </p>
              <ul className="footer-highlights">
                <li>✓ Verified USA &amp; Canada stock</li>
                <li>✓ Secure PayPal checkout</li>
                <li>✓ Tracking on every order</li>
                <li>✓ $99.99 map update service</li>
              </ul>
            </div>
            <div>
              <h4>Store</h4>
              <Link href="/shop">All Products</Link>
              <Link href="/shop/gps-navigators">GPS Navigators</Link>
              <Link href="/shop/navigation-displays">Navigation Displays</Link>
              <Link href="/shop/gps-cycling-computers">Cycling Computers</Link>
              <Link href="/shop/gps-accessories">GPS Accessories</Link>
              <Link href="/guides">GPS Guides</Link>
              <Link href="/track-order">Track Your Order</Link>
              <Link href="/reviews">Customer Reviews</Link>
            </div>
            <div>
              <h4>Support &amp; Contact</h4>
              <div className="footer-contact">
                <div><span>📞</span><a href="tel:+18449667866" className="tel-link">+1 (844) 966-7866</a><small>Toll-free USA &amp; Canada</small></div>
                <div><span>📧</span><a href="mailto:info@gpslane.com">info@gpslane.com</a><small>Reply within 24h</small></div>
                <div><span>💬</span><span>Live chat on every page</span><small>Green widget, bottom-right</small></div>
                <div><span>📍</span><span>4500 Margalo Avenue</span><small>Bakersfield, CA 93313</small></div>
                <div><span>🕐</span><span>Mon–Sat: 9 AM – 7 PM PT</span><small>Sunday closed</small></div>
              </div>
            </div>
            <div>
              <h4>Company</h4>
              {FOOTER.map((l) => (
                <Link key={l.href} href={l.href}>{l.label}</Link>
              ))}
            </div>
          </div>
          <div className="container footer-bottom">
            <p className="muted footer-disclaimer">
              GPSLane is an independent GPS navigation service provider and is not affiliated with
              Garmin, TomTom, Magellan, or any other OEM brand. Map update assistance is guidance
              and support only — not resale of proprietary software.
            </p>
            <p className="muted footer-copy">© {new Date().getFullYear()} GPSLane. All rights reserved.</p>
          </div>
        </footer>
        </CartProvider>
      </body>
    </html>
  )
}

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container" style={{ padding: '5rem 1.25rem', textAlign: 'center' }}>
      <p style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--primary)', margin: 0, lineHeight: 1 }}>404</p>
      <h1>Page Not Found</h1>
      <p className="muted" style={{ maxWidth: 520, margin: '0.75rem auto 1.75rem' }}>
        The page you were looking for moved, was renamed, or never existed.
        Try one of the links below — or search our shop.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/" className="btn btn-primary">Back to Home</Link>
        <Link href="/shop" className="btn btn-ghost">Shop GPS Devices</Link>
        <Link href="/map-updates" className="btn btn-ghost">Map Updates</Link>
        <Link href="/contact" className="btn btn-ghost">Contact Us</Link>
      </div>
    </div>
  )
}

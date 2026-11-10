import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🧭</div>
      <h1>Page Not Found</h1>
      <p className="lede">Looks like this route took a wrong turn. Let&apos;s get you back on the right lane.</p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
        <Link href="/" className="btn btn-primary">Go Home</Link>
        <Link href="/shop" className="btn btn-ghost">Shop GPS Devices</Link>
        <Link href="/map-updates" className="btn btn-ghost">Map Updates</Link>
      </div>
    </div>
  )
}

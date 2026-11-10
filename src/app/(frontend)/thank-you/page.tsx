import Link from 'next/link'
import ThankYouTracker from './ThankYouTracker'

export const metadata = {
  title: 'Thank You | GPS Lane',
  robots: { index: false, follow: false },
}

const CONTENT: Record<string, { title: string; body: string; cta: string; href: string }> = {
  contact: {
    title: 'Message Received — Thank You!',
    body: 'Your message has reached the GPS Lane team. We typically reply within 24 hours (Mon–Sat, 9 AM–7 PM PT). For urgent help call +1 (844) 966-7866.',
    cta: 'Continue Shopping',
    href: '/shop',
  },
  'map-update': {
    title: 'Map Update Request Confirmed!',
    body: 'A GPS Lane technician will call you shortly to verify your device compatibility. No payment is taken until your update is confirmed.',
    cta: 'Back to Map Updates',
    href: '/map-updates',
  },
  newsletter: {
    title: 'You\u2019re Subscribed!',
    body: 'Welcome aboard — GPS tips, map-update reminders and subscriber-only deals are on the way to your inbox.',
    cta: 'Browse GPS Devices',
    href: '/shop',
  },
  'back-in-stock': {
    title: 'Got It — We\u2019ll Email You!',
    body: 'You\u2019re on the list. We\u2019ll email you the moment this product is back in stock.',
    cta: 'Continue Shopping',
    href: '/shop',
  },
}

export default async function ThankYouPage({ searchParams }: { searchParams: Promise<{ form?: string }> }) {
  const { form } = await searchParams
  const c = CONTENT[form ?? ''] ?? {
    title: 'Thank You!',
    body: 'Your submission was received. A member of the GPS Lane team will be in touch shortly.',
    cta: 'Back to Home',
    href: '/',
  }
  return (
    <div className="container" style={{ padding: '0.5rem 1.25rem 2.5rem' }}>
      <ThankYouTracker form={form ?? 'unknown'} />
      <div style={{ maxWidth: 620, margin: '3rem auto', textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✅</div>
        <h1>{c.title}</h1>
        <p className="lede">{c.body}</p>
        <div className="notice" style={{ textAlign: 'left', marginTop: '1.5rem' }}>
          <strong>Need help now?</strong> Call <strong>+1 (844) 966-7866</strong> (toll-free USA &amp; Canada)
          or email <a href="mailto:info@gpslane.com">info@gpslane.com</a>.
        </div>
        <p style={{ marginTop: '2rem' }}>
          <Link href={c.href} className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>{c.cta} →</Link>
        </p>
      </div>
    </div>
  )
}

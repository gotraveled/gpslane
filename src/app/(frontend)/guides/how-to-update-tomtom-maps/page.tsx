import Link from 'next/link'

export const metadata = {
  title: 'How to Update TomTom Maps: Complete Guide (USA & Canada)',
  description: 'Step-by-step guide to updating TomTom GPS maps — MyDrive Connect, Wi-Fi updates, and fixes for common update errors. Or get expert help for $99.99.',
  keywords: 'update TomTom maps, TomTom MyDrive Connect, TomTom map update USA, TomTom GPS update, TomTom GO',
}

const STEPS: [string, string][] = [
  ['Identify Your TomTom Model', 'Check the back of your device or go to Settings → System → About. Model names: TomTom GO 50/60/500/600/5000/6000, TomTom Start 42/52/62, TomTom Via 1525.'],
  ['Try Wi-Fi Update (Newer Models)', 'TomTom GO 500+, Start 42+, Rider 400+: connect to Wi-Fi → Settings → System → Updates → Check for Updates. If your unit has Wi-Fi, you never need a computer.'],
  ['Download MyDrive Connect', 'For older or non-Wi-Fi models: install TomTom MyDrive Connect on Windows or Mac from tomtom.com/mydrive — the official update tool.'],
  ['Connect Your Device', 'Power on the TomTom → connect via USB → sign in to MyDrive Connect with your TomTom account. The app will automatically scan for available updates.'],
  ['Install Map Updates First', 'Click "My Content" → install any available "Map" updates for USA & Canada, then "Software" updates. Larger maps install faster if you split them into regions.'],
  ['Eject Safely & Verify', 'When complete, safely eject → restart the device → check Settings → Maps to confirm the new North America map version installed correctly.'],
]

const TROUBLESHOOT: [string, string][] = [
  ['MyDrive Connect not detecting device', 'Try a different USB port (rear of desktop, not front), the original cable, and make sure the TomTom is powered ON — it cannot be in car charger or sleep mode.'],
  ['"Device is not responding"', 'Hold the power button for 20-30 seconds to force reset → reconnect to MyDrive Connect immediately after it boots.'],
  ['Download extremely slow', 'TomTom servers can be slow at peak hours. Try early morning (US Eastern) or pause/resume the download. On very old units, expect hours not minutes.'],
  ['"Not enough space" error', 'Delete unused voice packs and POI categories, or update only the USA region instead of all of North America.'],
  ['Device says "No maps available" after update', 'Reinstall the map through MyDrive Connect → "My Content" → re-add the North America map. Do not interrupt the process.'],
  ['My model says "Lifetime Maps"', 'If your model came with lifetime maps, all future updates are free via MyDrive Connect — no subscription needed.'],
]

export default function TomTomUpdateGuidePage() {
  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      <nav className="breadcrumbs">
        <Link href="/">Home</Link> / <Link href="/guides">Guides</Link> / TomTom Map Update
      </nav>
      <div className="page-head">
        <h1>How to Update TomTom Maps</h1>
        <p className="lede">
          Complete 2026 guide to updating TomTom GPS devices — MyDrive Connect, Wi-Fi updates,
          and troubleshooting when things go wrong. Or get expert help for $99.99.
        </p>
      </div>

      <h2>📋 Before You Start</h2>
      <ul className="check-list muted">
        <li>Charge your TomTom to at least 50% (updates can take 30-90 minutes)</li>
        <li>Use a stable internet connection — map files are 4-8GB for NA region</li>
        <li>Have your TomTom account email ready (needed for MyDrive Connect)</li>
        <li>Use the original TomTom USB cable if you still have it</li>
      </ul>

      <h2>🔧 Step-by-Step Update Process</h2>
      {STEPS.map(([h, p], i) => (
        <div key={h}>
          <h3>{i + 1}. {h}</h3>
          <p className="muted">{p}</p>
        </div>
      ))}

      <h2>🚨 Common Problems &amp; Fixes</h2>
      <div className="grid grid-2" style={{ gap: '1rem' }}>
        {TROUBLESHOOT.map(([h, p]) => (
          <div key={h} className="card" style={{ padding: '1.25rem' }}>
            <h4 style={{ marginTop: 0, color: 'var(--primary)' }}>{h}</h4>
            <p className="muted" style={{ fontSize: '0.9rem', margin: 0 }}>{p}</p>
          </div>
        ))}
      </div>

      <h2>🧑‍💻 Prefer Expert Help?</h2>
      <p className="muted">
        TomTom updates can be finicky — MyDrive Connect errors, slow downloads, and space issues are common.
        GPSLane offers a professional map update service for <strong>$99.99 USD</strong> where our
        technicians handle everything: verify your model, install the latest USA &amp; Canada maps, and
        guide you by phone until it works.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <Link href="/gps-maps-updates" className="btn btn-primary">Start GPS Maps Updates</Link>
        <Link href="/contact" className="btn btn-ghost">Ask a Question First</Link>
      </div>

      <div className="notice" style={{ marginTop: '2rem' }}>
        <strong>Related guides:</strong>{' '}
        <Link href="/guides/how-to-update-garmin-maps">Garmin Map Update</Link> ·{' '}
        <Link href="/how-to-update-gps-maps-diy-guide">DIY Map Update Guide</Link> ·{' '}
        <Link href="/guides/gps-vs-smartphone-navigation">GPS vs Smartphone</Link>
      </div>
    </div>
  )
}

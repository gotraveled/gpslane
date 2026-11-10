import Link from 'next/link'

export const metadata = {
  title: 'How to Update Garmin Maps: Complete Guide (USA & Canada)',
  description: 'Step-by-step guide to updating Garmin GPS maps — Garmin Express, Wi-Fi updates, Drive app, and what to do when updates fail. Or get expert help for $99.99.',
  keywords: 'update Garmin maps, Garmin Express, Garmin map update USA, Garmin GPS update, Garmin Drive',
}

const STEPS: [string, string][] = [
  ['Check Which Garmin You Have', 'Look at the back of your device for the model number (e.g., Garmin DriveSmart 65, Garmin Nuvi 2595, Garmin Drive 52). The update method depends on whether your unit supports Wi-Fi.'],
  ['Try the Built-In Wi-Fi Update First', 'Newer Garmin models (DriveSmart 55+, Drive 50+, dezl 2022+): connect to Wi-Fi → Settings → Updates. If available, tap Install All — no computer needed.'],
  ['Download Garmin Express', 'Older or non-Wi-Fi models need a computer. Go to garmin.com/express on a Windows PC or Mac and download Garmin Express — the official (and only safe) update tool.'],
  ['Connect Your GPS', 'Turn the device on, connect it with a USB cable (use the original Garmin cable if possible — generic cables sometimes only charge). Wait for Garmin Express to detect it.'],
  ['Register Your Device', 'Garmin Express will prompt you to register the device if it\'s your first time. Use a real email — update notifications go there.'],
  ['Install Available Updates', 'Click the device → Check for Updates. Install "Map Updates" first, then "Software Updates" and "Other" files. Keep the device plugged in until everything finishes.'],
  ['Verify the Update', 'Eject the device safely → Power on → Check Settings → Map & Vehicle → myMaps — the map version/date should reflect the latest North America region.'],
]

const TROUBLESHOOT: [string, string][] = [
  ['Garmin Express does not detect my device', 'Use a different USB port (direct to computer, not a hub), try the original cable, make sure the device is powered ON and not in mass storage mode.'],
  ['"Not enough space" error', 'Map files are large (8-20GB for full NA coverage). Free space by removing old voices/languages, or use a microSD card (supports up to 32GB on most models).'],
  ['Update stuck or freezes', 'Do not unplug. Restart Garmin Express, unplug and replug the device, and retry. If it stays stuck, the device may need a reset (backup first).'],
  ['"Update service unavailable"', 'Garmin\'s servers occasionally throttle large downloads. Try again during off-peak hours (early morning US time) or switch to a wired internet connection.'],
  ['Maps still look outdated after update', 'You may have multiple map regions installed. Check Settings → Map & Vehicle → myMaps and ensure the newest North America map is the only one selected/active.'],
]

export default function GarminUpdateGuidePage() {
  return (
    <div className="container prose" style={{ padding: '2.5rem 1.25rem' }}>
      <nav className="breadcrumbs">
        <Link href="/">Home</Link> / <Link href="/guides">Guides</Link> / Garmin Map Update
      </nav>
      <div className="page-head">
        <h1>How to Update Garmin Maps</h1>
        <p className="lede">
          Complete 2026 guide to updating Garmin GPS devices — Garmin Express, Wi-Fi updates,
          Drive app, and troubleshooting when things go wrong. Or get expert help for $99.99.
        </p>
      </div>

      <h2>📋 Before You Start</h2>
      <ul className="check-list muted">
        <li>Fully charge your Garmin device (or keep it plugged in during update)</li>
        <li>Use the original Garmin USB cable if you have it</li>
        <li>A stable internet connection — map files can be 8–20GB</li>
        <li>At least 8GB free space on the device or a 32GB microSD card</li>
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

      <h2>🧑‍💻 Too Complicated? Get Expert Help</h2>
      <p className="muted">
        If Garmin Express is giving you trouble, or you just want it done right the first time,
        GPSLane offers a professional map update service for <strong>$99.99 USD</strong>. Our
        technicians verify your model, install the latest USA &amp; Canada maps, and guide you
        by phone until everything works — guaranteed.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <Link href="/gps-maps-updates" className="btn btn-primary">Start GPS Maps Updates</Link>
        <Link href="/contact" className="btn btn-ghost">Ask a Question First</Link>
      </div>

      <div className="notice" style={{ marginTop: '2rem' }}>
        <strong>Related guides:</strong>{' '}
        <Link href="/how-to-update-gps-maps-diy-guide">DIY Map Update Guide</Link> ·{' '}
        <Link href="/guides/best-gps-for-truck-drivers">Best GPS for Truck Drivers</Link> ·{' '}
        <Link href="/guides/gps-vs-smartphone-navigation">GPS vs Smartphone</Link>
      </div>
    </div>
  )
}

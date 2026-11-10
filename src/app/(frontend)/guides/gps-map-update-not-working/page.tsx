import Link from 'next/link'

export const metadata = {
  title: 'GPS Map Update Not Working? 15 Fixes That Actually Help',
  description: 'GPS map update failing, freezing or not installing? 15 proven fixes for Garmin, TomTom, Magellan and standalone car GPS units — or get expert help for $99.99.',
  keywords: 'GPS map update not working, GPS update failed, Garmin update stuck, TomTom update error, GPS update troubleshooting',
}

const FIXES: [string, string][] = [
  ['Restart everything', 'Unplug the GPS, close Garmin Express/MyDrive, restart your computer, then reconnect. Fixes ~30% of update failures.'],
  ['Use the original USB cable', 'Generic cables often only charge — they do not carry data. The cable that came with your GPS is almost always required for updates.'],
  ['Try a different USB port', 'Use a rear motherboard USB port on desktop PCs. Front-panel and hub ports often drop connections mid-transfer.'],
  ['Free up space on the device', 'Delete unused map regions, voice packs and POI categories. Map updates need 4-20GB free — check Settings → Storage.'],
  ['Update the update tool first', 'Garmin Express and MyDrive Connect update themselves — restart the app and let it self-update before retrying the GPS update.'],
  ['Check your internet speed', 'Map files are 4-20GB. A stable 10+ Mbps connection is strongly recommended; avoid public/hotel Wi-Fi.'],
  ['Charge the device to 80%+', 'Many units refuse to update below a certain battery level — or worse, die mid-update and corrupt the map.'],
  ['Use a wired connection, not Wi-Fi', 'Even if your GPS supports Wi-Fi updates, wired (USB to computer) is more reliable for large map downloads.'],
  ['Install only the region you need', 'A "USA & Canada" map often includes Mexico. Splitting to just "USA" or "Canada" reduces size dramatically.'],
  ['Disable antivirus/firewall temporarily', 'Real-time scanning can block the multi-GB transfer. Re-enable after the update completes.'],
  ['Run the update tool as Administrator', 'Right-click → "Run as administrator" (Windows). Permission issues silently kill transfers on some systems.'],
  ['Update the device firmware first', 'Always install Software/Firmware updates BEFORE map updates — an outdated OS can reject new map files.'],
  ['Eject safely, every time', 'Removing a GPS mid-write corrupts the map database. Always use "Safely remove hardware" before unplugging.'],
  ['Try a microSD card', 'Devices with microSD slots (Garmin 32GB, TomTom 32GB) let you install maps to the card, bypassing full internal storage.'],
  ['Factory reset as last resort', 'If nothing else works, factory reset the GPS (backup first) → install maps fresh. Contact support before doing this.'],
]

export default function GpsMapUpdateNotWorkingPage() {
  return (
    <div className="container prose wide" style={{ padding: '2.5rem 1.25rem' }}>
      <nav className="breadcrumbs">
        <Link href="/">Home</Link> / <Link href="/guides">Guides</Link> / Map Update Not Working
      </nav>
      <div className="page-head">
        <h1>GPS Map Update Not Working?</h1>
        <p className="lede">
          15 fixes that resolve the most common Garmin, TomTom, Magellan and standalone GPS update
          failures — tried, tested, and used daily by our own support team.
        </p>
      </div>

      <div className="grid grid-3" style={{ gap: '1rem' }}>
        {FIXES.map(([h, p], i) => (
          <div key={h} className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.4rem' }}>FIX #{i + 1}</div>
            <h4 style={{ marginTop: 0, marginBottom: '0.4rem' }}>{h}</h4>
            <p className="muted" style={{ fontSize: '0.88rem', margin: 0 }}>{p}</p>
          </div>
        ))}
      </div>

      <h2>Still Stuck? Get It Done For You</h2>
      <p className="muted">
        If you&apos;ve tried everything above and the update still won&apos;t cooperate, GPSLane offers a
        <strong> professional map update service for $99.99 USD</strong>. Our technicians verify your
        exact model, source the correct latest USA &amp; Canada maps, and walk you through the update
        over the phone until it&apos;s confirmed working.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <Link href="/gps-maps-updates" className="btn btn-primary">Start GPS Maps Updates</Link>
        <a href="tel:+18449667866" className="btn btn-ghost">Call +1 (844) 966-7866</a>
      </div>

      <div className="notice" style={{ marginTop: '2rem' }}>
        <strong>Related guides:</strong>{' '}
        <Link href="/guides/how-to-update-garmin-maps">Garmin Updates</Link> ·{' '}
        <Link href="/guides/how-to-update-tomtom-maps">TomTom Updates</Link> ·{' '}
        <Link href="/how-to-update-gps-maps-diy-guide">DIY Map Update Guide</Link>
      </div>
    </div>
  )
}

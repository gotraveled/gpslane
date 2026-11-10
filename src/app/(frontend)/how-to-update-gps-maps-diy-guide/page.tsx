import Link from 'next/link'
import MapUpdateRequestForm from '../map-updates/request/RequestForm'

export const metadata = {
  title: 'How to Update GPS Maps (DIY Guide) | GPSLane',
  description: 'Free step-by-step DIY guide to updating your GPS maps yourself — connect your device, backup maps, download and install the latest USA & Canada map data safely.',
  keywords: 'how to update GPS maps, DIY GPS map update, update TomTom maps, update Garmin maps, GPS map update guide USA Canada',
}

const STEPS: [string, string[]][] = [
  ['Before You Begin', [
    'Before starting your GPS map update, make sure you have: a computer (Windows or macOS), a USB cable or SD card reader, a stable internet connection, your GPS device and charger, and enough storage space for new map files.',
    'If your device uses removable memory (SD card), ensure it\u2019s properly inserted and recognized by your computer.',
  ]],
  ['Step 1 – Connect Your GPS Device to the Computer', [
    'Use a compatible USB cable to connect your GPS unit to your computer. Turn on your device and wait for the computer to recognize it — it should appear as a removable drive.',
    'If your GPS uses an SD card for maps, you can remove it from the device and insert it directly into your computer\u2019s card reader.',
  ]],
  ['Step 2 – Check Your Current Map Version', [
    'On your GPS device, open the Settings or Map Info section. Look for "Map Version" or "Version Information" and note down your current version number — this helps identify whether an update is available.',
    'If your map version is older than 2024 or 2025, it\u2019s time for an update.',
  ]],
  ['Step 3 – Backup Your Existing Maps', [
    'Before replacing your old maps, create a backup copy of your existing map files. Open your GPS drive on your computer and copy the entire "MAP" or "NAVDATA" folder to your desktop.',
    'This ensures that if anything goes wrong, you can restore your GPS to its previous state safely.',
  ]],
  ['Step 4 – Download Updated Maps', [
    'If your GPS manufacturer provides map updates through their website or app, log in to your account and download the latest map version.',
    'For unbranded or older GPS models (which don\u2019t have an official site), you can contact GPSLane for professional assistance — our technicians can identify your device model and safely install the correct USA & Canada map data.',
  ]],
  ['Step 5 – Install the New Map Files', [
    'Once you\u2019ve downloaded the new map files: copy them into the same directory as your old maps (usually in the "MAP" folder), replace the old files when prompted, and safely eject your GPS or SD card after transfer completes.',
    'Restart your GPS device and open the map application. You should now see the latest updates loaded.',
  ]],
  ['Step 6 – Verify Your Update', [
    'After installation, confirm the new version: go to Menu → Settings → Map Info and check that the version reflects the new update (e.g., 2025.01 or similar). Test it by searching for a new route or landmark.',
    'If the update fails, don\u2019t panic — you can always restore your backup or contact our team for assistance.',
  ]],
]


export default function DiyGuidePage() {
  return (
    <div className="container prose wide" style={{ padding: '2.5rem 1.25rem' }}>
      <div className="page-head">
        <h1>How to Update Your GPS Maps – Step-by-Step DIY Guide</h1>
        <p className="lede">
          Keeping your GPS maps updated is essential for safe and accurate navigation. With new
          roads, highway changes, and route improvements introduced every year, an outdated GPS can
          cause delays or misdirection.
        </p>
        <p className="muted">
          At GPSLane, we help drivers across the <strong>USA and Canada</strong> stay on track —
          whether you choose to update your maps yourself or let our experts handle it for you.
          This guide walks you through the DIY map update process and explains when professional
          assistance might be the better option.
        </p>
      </div>

      <div className="diy-layout">
        <div>
          <h2>🧭 Why Update Your GPS Maps?</h2>
          <p className="muted">
            Your GPS relies on stored map data to calculate routes. Over time, this data becomes outdated as:
          </p>
          <ul className="check-list muted">
            <li>New roads and highways open</li>
            <li>Old routes close or change direction</li>
            <li>Businesses, gas stations, and landmarks update their locations</li>
            <li>Traffic and speed limit data changes</li>
          </ul>
          <p className="muted">
            Updating your GPS ensures accurate navigation and directions, time-saving fuel-efficient
            routes, improved road safety, and updated points of interest (POIs).
          </p>

          {STEPS.map(([h, paras]) => (
            <div key={h}>
              <h2>{h}</h2>
              {paras.map((p, i) => <p key={i} className="muted">{p}</p>)}
            </div>
          ))}

          <h2>⚠️ Important Notes</h2>
          <ul className="check-list muted">
            <li>Always make a backup before attempting a manual update.</li>
            <li>Avoid downloading map files from unofficial or unverified sources.</li>
            <li>Ensure your GPS stays powered during the entire update process.</li>
            <li>Do not disconnect your device while transferring data.</li>
          </ul>

          <h2>🕊️ GPSLane – Your Reliable Navigation Partner</h2>
          <p className="muted">
            Whether you update maps yourself or rely on our expert service, <strong>GPSLane</strong>{' '}
            ensures you stay safe and informed on every journey. We&apos;re here to make GPS
            navigation simple, accurate, and worry-free.
          </p>
          <p className="muted"><strong>Remember:</strong> Roads change, and so should your maps. Keep your GPS on the right lane — with GPSLane.</p>
        </div>
        <div className="diy-sidebar">
          <div className="card" style={{ padding: '1.6rem' }}>
            <h3 style={{ marginTop: 0 }}>📅 Schedule Map Update</h3>
            <p className="muted" style={{ fontSize: '0.9rem' }}>
              Tell us your name, phone number and GPS model — a GPSLane technician will call you to
              confirm compatibility. No payment until your update is confirmed.
            </p>
            <MapUpdateRequestForm compact minimal />
          </div>
          <div className="notice">
            <h3 style={{ marginTop: 0 }}>🧑‍💻 Need Professional Help?</h3>
            <p style={{ marginBottom: '0.5rem' }}>
              If you prefer not to risk technical errors, GPSLane offers a{' '}
              <strong>Professional GPS Map Update Service</strong> for only{' '}
              <strong>$99.99 USD</strong>. Our experts will verify your GPS model compatibility and
              install the latest USA &amp; Canada maps with step-by-step phone guidance until your
              update completes successfully.
            </p>
            <p style={{ marginBottom: '0.75rem' }}>
              📞 <strong>Call:</strong> <a href="tel:+18449667866" className="tel-link">+1 (844) 966-7866</a> · 📧 <a href="mailto:info@gpslane.com">info@gpslane.com</a>
            </p>
            <Link href="/gps-maps-updates" className="btn btn-primary">Start GPS Maps Updates</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

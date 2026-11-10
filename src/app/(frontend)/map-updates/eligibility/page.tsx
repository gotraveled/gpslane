import Link from 'next/link'

export const metadata = {
  title: 'GPS Map Update Eligibility | GPSLane',
  description: 'Check whether your GPS device can be updated — manufacturer support, map regions for USA & Canada, and what to expect from GPSLane\u2019s map update service.',
  keywords: 'GPS map update eligibility, compatible GPS devices, GPS map update requirements',
}

const CASES = [
  ['Manufacturer still supports the device', 'Usually the easiest case — official map downloads or SD-card updates are available, often free for a period or a paid region license.'],
  ['Manufacturer supports it but charges for maps', 'You can buy the official map license directly, or we can walk you through the purchase and installation.'],
  ['Manufacturer no longer supports the device', 'We will tell you honestly. Options are limited to what the manufacturer left available; we do not install unofficial maps.'],
  ['Very old or discontinued hardware', 'If the hardware cannot run current map formats, the honest answer is replacement — we can suggest current GPSLane devices that fit your use case.'],
]


export default function EligibilityPage() {
  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      <h1>Map Update Eligibility</h1>
      <p>
        Whether your GPS maps can be updated depends on the device manufacturer, model age and
        region — not on the map files themselves. This page explains the outcomes you might receive.
      </p>
      {CASES.map(([h, p]) => (
        <div key={h}><h2>{h}</h2><p className="muted">{p}</p></div>
      ))}
      <div className="notice">
        Eligibility can only be confirmed per device. <Link href="/map-updates/request">Submit a request</Link> and we will check yours.
      </div>
    </div>
  )
}

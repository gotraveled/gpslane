export const metadata = { title: 'How to Update GPS Maps â€” DIY Guide' }

export default function DiyGuidePage() {
  return (
    <div className="container prose" style={{ padding: '2.5rem 1.25rem' }}>
      <h1>How to Update GPS Maps Yourself (DIY Guide)</h1>
      <p className="muted">A practical guide for TomTom, Garmin, Magellan, SatNav and similar devices serving the USA and Canada.</p>

      <h2>Step 1 â€” Identify your device and map provider</h2>
      <p>
        Check the manufacturer name on the device or its menu (often under Settings â†’ About or System
        Information). The map provider matters: TomTom devices use TomTom maps, Garmin uses Garmin
        maps, Magellan/SatNav devices differ by model and region. The same brand can ship different
        map versions in USA vs Canada units â€” confirm your region before downloading anything.
      </p>

      <h2>Step 2 â€” Find your current map version</h2>
      <p>
        On most devices: Settings â†’ Map/Navigation â†’ Map Version, or System Information. Write it
        down â€” you&apos;ll need it to confirm an update actually installed.
      </p>

      <h2>Step 3 â€” Choose the official update path</h2>
      <ul>
        <li><strong>Wi-Fi enabled devices:</strong> use the built-in update feature (e.g. TomTom services, Garmin Express). Connect to Wi-Fi and follow the on-screen prompts.</li>
        <li><strong>Computer-based updates:</strong> install the manufacturer&apos;s companion app (Garmin Express, TomTom MyDrive) on a Windows/Mac computer, connect the device by USB and let it check for map updates.</li>
        <li><strong>SD-card updates:</strong> some devices take map data on an SD card â€” purchase or download the correct regional map file and copy it exactly as the manual specifies.</li>
      </ul>

      <h2>Step 4 â€” Get the right region</h2>
      <p>
        For North America driving, look for &quot;USA &amp; Canada&quot;, &quot;North America&quot; or &quot;US &amp; Canada&quot; map
        packages. A USA-only map will not include Canadian roads and vice versa. Buying the wrong
        region is the most common â€” and most expensive â€” mistake.
      </p>

      <h2>Step 5 â€” Verify after updating</h2>
      <p>
        After installation, recheck the map version in system information. Then test a route you know
        well â€” new roads, changed intersections and updated points of interest should appear.
      </p>

      <h2>When DIY doesn&apos;t work</h2>
      <div className="notice">
        If your device is discontinued, won&apos;t connect, or the manufacturer no longer offers maps for
        your region, <a href="/map-updates/request">send us a map-update request</a> â€” we&apos;ll tell you
        honestly whether an update is possible.
      </div>

      <h2>Warnings</h2>
      <ul>
        <li>Never install map files from unknown sources â€” corrupted or unofficial maps can brick navigation.</li>
        <li>Keep the device charged during updates; interruption can corrupt map data.</li>
        <li>Back up personal places/favorites before major updates where the manual recommends it.</li>
      </ul>
    </div>
  )
}

export const metadata = { title: 'How to Update GPS Maps — DIY Guide' }

export default function DiyGuidePage() {
  return (
    <div className="container prose" style={{ padding: '2.5rem 1.25rem' }}>
      <h1>How to Update GPS Maps Yourself (DIY Guide)</h1>
      <p className="muted">A practical guide for TomTom, Garmin, Magellan, SatNav and similar devices serving the USA and Canada.</p>

      <h2>Step 1 — Identify your device and map provider</h2>
      <p>
        Check the manufacturer name on the device or its menu (often under Settings → About or System
        Information). The map provider matters: TomTom devices use TomTom maps, Garmin uses Garmin
        maps, Magellan/SatNav devices differ by model and region. The same brand can ship different
        map versions in USA vs Canada units — confirm your region before downloading anything.
      </p>

      <h2>Step 2 — Find your current map version</h2>
      <p>
        On most devices: Settings → Map/Navigation → Map Version, or System Information. Write it
        down — you&rsquo;ll need it to confirm an update actually installed.
      </p>

      <h2>Step 3 — Choose the official update path</h2>
      <ul>
        <li><strong>Wi-Fi enabled devices:</strong> use the built-in update feature (e.g. TomTom services, Garmin Express). Connect to Wi-Fi and follow the on-screen prompts.</li>
        <li><strong>Computer-based updates:</strong> install the manufacturer&rsquo;s companion app (Garmin Express, TomTom MyDrive) on a Windows/Mac computer, connect the device by USB and let it check for map updates.</li>
        <li><strong>SD-card updates:</strong> some devices take map data on an SD card — purchase or download the correct regional map file and copy it exactly as the manual specifies.</li>
      </ul>

      <h2>Step 4 — Get the right region</h2>
      <p>
        For North America driving, look for &quot;USA &amp; Canada&quot;, &quot;North America&quot; or &quot;US &amp; Canada&quot; map
        packages. A USA-only map will not include Canadian roads and vice versa. Buying the wrong
        region is the most common — and most expensive — mistake.
      </p>

      <h2>Step 5 — Verify after updating</h2>
      <p>
        After installation, recheck the map version in system information. Then test a route you know
        well — new roads, changed intersections and updated points of interest should appear.
      </p>

      <h2>When DIY doesn&rsquo;t work</h2>
      <div className="notice">
        If your device is discontinued, won&rsquo;t connect, or the manufacturer no longer offers maps for
        your region, <a href="/map-updates/request">send us a map-update request</a> — we&rsquo;ll tell you
        honestly whether an update is possible.
      </div>

      <h2>Warnings</h2>
      <ul>
        <li>Never install map files from unknown sources — corrupted or unofficial maps can brick navigation.</li>
        <li>Keep the device charged during updates; interruption can corrupt map data.</li>
        <li>Back up personal places/favorites before major updates where the manual recommends it.</li>
      </ul>
    </div>
  )
}

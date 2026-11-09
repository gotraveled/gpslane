export const metadata = { title: 'About GPSLane' }

export default function AboutPage() {
  return (
    <div className="container prose" style={{ padding: '2.5rem 1.25rem' }}>
      <h1>About GPSLane</h1>
      <p>
        GPSLane helps drivers, riders and outdoor enthusiasts in the USA and Canada get the right
        navigation hardware — and keep its maps current. We sell GPS navigation devices, cycling
        computers and accessories, and we provide hands-on assistance with GPS map updates.
      </p>
      <h2>What we stand for</h2>
      <ul>
        <li><strong>Honest specifications.</strong> We publish only product information we can support. If something is unverified, we say so — on our product pages and in our documentation.</li>
        <li><strong>Clear shipping.</strong> USA and Canada are treated as separate destinations with their own shipping costs and delivery estimates.</li>
        <li><strong>No fake trust signals.</strong> No invented reviews, badges, sales numbers or certifications.</li>
        <li><strong>Real support.</strong> Especially for the thing GPSLane was built around: keeping your GPS maps up to date.</li>
      </ul>
      <h2>GPS map-update assistance</h2>
      <p>
        Outdated road data is one of the most common reasons navigation devices frustrate drivers.
        Our map-update service helps you identify your device, confirm which map regions and
        versions apply, and complete manufacturer-supported updates — or tells you honestly when a
        device is too old or unsupported.
      </p>
      <p><a href="/map-updates" className="btn btn-primary">Explore map-update assistance</a></p>
    </div>
  )
}

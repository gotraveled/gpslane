export const metadata = {
  title: 'Disclaimer | GPSLane',
  description: 'GPSLane disclaimer — independent GPS navigation brand, product sourcing transparency, map data limitations, liability and third-party links.',
  keywords: 'GPSLane disclaimer, GPS independent brand, GPS map data disclaimer',
}

const SECTIONS: [string, string[]][] = [
  ['Independent Brand Notice', [
    'GPSLane.com is an independent GPS navigation brand. We are not affiliated, associated, authorized, endorsed by, or in any way officially connected with any original equipment manufacturer (OEM) such as Garmin, TomTom, Magellan, or any other GPS brand.',
    'All brand names, trademarks, and registered trademarks mentioned on this website are the property of their respective owners. They are used only for identification and compatibility purposes when explaining product features or supported devices.',
  ]],
  ['Our Products and Services', [
    'GPSLane provides two main categories of offerings: (1) GPS Devices — GPSLane-branded or unbranded GPS units, sourced from verified international suppliers, tested, verified, and preloaded with map data for USA and Canada before shipping; and (2) GPS Map Update Services — a professional map update service for a one-time fee of $99.99 USD, including technician assistance and technical guidance. It does not include the distribution or resale of copyrighted map software from any other brand.',
  ]],
  ['Product Sourcing Transparency', [
    'All GPSLane GPS devices and accessories are fulfilled through verified global suppliers, including select partners on AliExpress and other reputable marketplaces. We do not maintain warehouses in the USA or Canada — orders are shipped directly from our fulfillment partners to your address via standard international carriers.',
    'Key points: orders processed within 2–5 business days; delivery time 10–20 business days (USA & Canada); tracking details provided for every shipment. For full details, visit our Shipping & Returns Policy.',
  ]],
  ['Payments and Pricing', [
    'All transactions on GPSLane.com are processed securely via PayPal. We never store your credit card or banking information. Our pricing is transparent — one-time fees with no hidden costs or recurring subscriptions. All prices are displayed in U.S. Dollars (USD).',
  ]],
  ['Map Data Disclaimer', [
    'GPSLane provides map update services using publicly available or open-source navigation data where permitted. Our service technicians assist customers with technical guidance for installation and system setup. We do not sell or redistribute any proprietary map files or copyrighted navigation software belonging to third-party brands.',
    'GPSLane cannot guarantee the accuracy or completeness of third-party map data. Minor variations or outdated details may exist depending on the GPS model or map provider.',
  ]],
  ['Technical Limitations', [
    'GPSLane is not responsible for: map data errors caused by third-party data sources; software malfunctions resulting from user modification or improper installation; device performance issues unrelated to our service; or compatibility errors when customers fail to provide correct model information.',
    'We strive to ensure that every service and product functions as intended, but certain limitations beyond our control (such as hardware condition, firmware version, or third-party software) may affect performance.',
  ]],
  ['Use of Information', [
    'The information on GPSLane.com is provided for general informational purposes only. While we make every effort to ensure accuracy, we do not warrant or guarantee that all content — including product specifications, pricing, or availability — is always current or error-free. GPSLane reserves the right to update or modify website content, policies, and pricing without prior notice.',
  ]],
  ['Liability Disclaimer', [
    'To the maximum extent permitted by law, GPSLane and its team are not liable for any direct, indirect, incidental, or consequential damages; data loss, device malfunction, or map accuracy issues; delays caused by shipping carriers or customs processes; or misuse of GPS devices or updates performed without professional supervision.',
    'By purchasing or using any product or service from GPSLane, you agree to assume all associated risks and responsibilities related to installation, use, and operation.',
  ]],
  ['Customer Privacy and Data', [
    'GPSLane respects your privacy and protects your information in accordance with our Privacy Policy. We only collect data necessary to process orders and provide support. All customer communications and payment transactions are encrypted and handled securely.',
  ]],
  ['Third-Party Links and References', [
    'Our website may contain links to third-party sites or resources for convenience (for example, PayPal, courier tracking portals, or navigation support resources). GPSLane is not responsible for the content, privacy policies, or practices of these external websites. Users are encouraged to review the terms and privacy policies of any third-party site before using it.',
  ]],
  ['Governing Law', [
    'This Disclaimer, along with all other terms and policies on GPSLane.com, is governed by the laws of the State of California, USA. Any disputes arising from this Disclaimer will be subject to the jurisdiction of the courts in Bakersfield, California, USA. However, GPSLane always seeks to resolve customer concerns amicably through communication before any legal process.',
  ]],
]

export default function DisclaimerPage() {
  return (
    <div className="container prose" style={{ padding: '2.5rem 1.25rem' }}>
      <div className="page-head">
        <h1>Disclaimer – Transparency, Accuracy, and Independence</h1>
        <p className="muted">Last updated: November 2026</p>
        <p className="lede">
          At GPSLane, we believe in open communication and complete transparency with our customers.
          This Disclaimer explains how we operate, where our products come from, and how we handle
          service responsibilities. Please read this page carefully before using our website or
          purchasing any GPSLane products or services.
        </p>
      </div>
      {SECTIONS.map(([h, paras]) => (
        <div key={h}>
          <h2>{h}</h2>
          {paras.map((p, i) => <p key={i} className="muted">{p}</p>)}
        </div>
      ))}
    </div>
  )
}

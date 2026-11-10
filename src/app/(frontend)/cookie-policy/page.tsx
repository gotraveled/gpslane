export const metadata = {
  title: 'Cookie Policy | GPSLane',
  description: 'How GPSLane uses cookies and similar technologies — analytics (Google), live chat (JivoChat), cart storage, and your choices.',
}

const SECTIONS: [string, string][] = [
  [
    'What Are Cookies?',
    'Cookies are small text files stored on your device when you visit a website. We also use similar technologies such as browser local storage (for your shopping cart and wishlist) and pixels/tags loaded by our analytics and chat tools.',
  ],
  [
    'Cookies We Use — Strictly Necessary',
    'These are required for the site to function and cannot be switched off: shopping cart and wishlist (localStorage), security and load-balancing cookies set by our hosting provider (Vercel), and your session cookie if you sign in.',
  ],
  [
    'Analytics Cookies — Google Tag Manager / Google Analytics',
    'We use Google Tag Manager (container GTM-P66V5MQF) and Google Analytics to understand how visitors use the site — pages visited, time on page, and general traffic sources. These cookies collect anonymized usage data and are not used to identify you personally. Google may process this data on servers in the United States.',
  ],
  [
    'Live Chat Cookies — JivoChat',
    'Our live chat widget (JivoChat) sets cookies to remember your chat session and route conversations to our support team. If you disable these cookies, live chat will not function.',
  ],
  [
    'Error Monitoring — Sentry',
    'We use Sentry to detect and diagnose technical errors. It may record browser and device information when an error occurs; it is not used for advertising.',
  ],
  [
    'Cookies We Do NOT Use',
    'GPSLane does not run advertising, retargeting, or social-media tracking pixels. We do not sell your personal information and we do not share cookie data with advertisers.',
  ],
  [
    'Managing Cookies',
    'You can block or delete cookies at any time through your browser settings. Blocking strictly-necessary cookies will prevent the cart and checkout from working. Blocking analytics and chat cookies will not affect checkout.',
  ],
  [
    'Do Not Track',
    'We honor browser Do-Not-Track signals where technically feasible and do not respond to them with additional tracking.',
  ],
  [
    'Updates to This Policy',
    'We may update this Cookie Policy when we add or remove third-party tools. The date above reflects the latest revision. Continued use of the site after changes constitutes acceptance.',
  ],
  [
    'Contact',
    'Questions about cookies or privacy? Email info@gpslane.com or call +1 (844) 966-7866 (toll-free USA & Canada).',
  ],
]

export default function CookiePolicyPage() {
  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      <div className="page-head">
        <h1>Cookie Policy</h1>
        <p className="muted">Effective Date: November 2025</p>
      </div>
      {SECTIONS.map(([h, body]) => (
        <div key={h} style={{ marginBottom: '1.25rem' }}>
          <h2>{h}</h2>
          <p className="muted">{body}</p>
        </div>
      ))}
      <div className="notice">
        <strong>Your privacy matters:</strong> GPSLane uses only the minimum cookies needed to run
        the store and support you. See our full <a href="/privacy">Privacy Policy</a> for how we
        handle personal data.
      </div>
    </div>
  )
}

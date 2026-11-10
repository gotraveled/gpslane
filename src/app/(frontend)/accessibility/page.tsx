export const metadata = {
  title: 'Accessibility Statement | GPSLane',
  description: 'GPSLane accessibility commitment — our efforts to make gpslane.com usable for everyone, and how to report barriers.',
}

export default function AccessibilityPage() {
  return (
    <div className="container" style={{ padding: '0.5rem 1.25rem 2.5rem' }}>
      <div className="page-head">
        <h1>Accessibility Statement</h1>
        <p className="muted">Last updated: November 2025</p>
      </div>

      {[
        ['Our Commitment', 'GPSLane is committed to making our website accessible and usable for all customers, including people with disabilities. We aim to meet WCAG 2.1 Level AA guidelines across gpslane.com.'],
        ['What We Do', 'We use semantic HTML, keyboard-navigable menus and forms, sufficient color contrast, alt text on product imagery, and clear, resizable text. Our checkout works with screen readers and keyboard-only navigation.'],
        ['Known Limitations', 'Some third-party tools — the JivoChat live-chat widget and the PayPal payment popup — are managed by external providers and may have their own accessibility characteristics. We choose vendors that publish accessibility commitments.'],
        ['Feedback', 'If you encounter an accessibility barrier on gpslane.com — such as a page that is hard to navigate by keyboard or a form that is difficult to complete — please let us know. We take accessibility reports seriously and will work to fix issues promptly.'],
        ['Contact Us', 'Email info@gpslane.com with the subject "Accessibility" or call +1 (844) 966-7866 (Mon–Sat, 9 AM – 7 PM PT). Please include the page URL and a description of the problem.'],
      ].map(([h, p]) => (
        <div key={h} style={{ marginBottom: '1.25rem' }}>
          <h2>{h}</h2>
          <p className="muted">{p}</p>
        </div>
      ))}
    </div>
  )
}

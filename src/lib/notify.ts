export async function notifyOwner(subject: string, text: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[notify] RESEND_API_KEY missing')
    return
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? 'GPS Lane <info@gpslane.com>',
      to: process.env.NOTIFY_EMAIL ?? 'vijay0262@gmail.com',
      subject,
      text,
    }),
  }).catch((e) => {
    console.error('[notify] fetch failed', e)
    return null
  })
  if (!res) return
  if (!res.ok) console.error('[notify] resend error', res.status, await res.text())
}

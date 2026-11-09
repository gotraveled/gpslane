'use server'

import { getPayloadClient } from '../../../lib/storefront'

export type ContactState = { ok: boolean; message: string }

export async function submitContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const str = (k: string) => String(formData.get(k) ?? '').trim()
  if (!str('name')) return { ok: false, message: 'Please enter your name.' }
  if (!str('email') || !/^\S+@\S+\.\S+$/.test(str('email'))) return { ok: false, message: 'Please enter a valid email address.' }
  if (!str('message')) return { ok: false, message: 'Please enter a message.' }

  try {
    const payload = await getPayloadClient()
    const doc: any = await payload.create({
      collection: 'contact-messages',
      overrideAccess: true,
      data: {
        name: str('name'),
        email: str('email'),
        subject: str('subject') || 'General inquiry',
        message: str('message'),
        status: 'new',
      },
    })
    try {
      await payload.sendEmail({
        to: 'info@gpslane.com',
        subject: `New contact message — ${doc.subject}`,
        text: `From: ${doc.name} <${doc.email}>\nSubject: ${doc.subject}\n\n${doc.message}`,
      })
    } catch { /* email adapter optional */ }
    return { ok: true, message: 'Message sent — we\u2019ll get back to you within 24 hours.' }
  } catch {
    return { ok: false, message: 'Something went wrong. Please email info@gpslane.com directly.' }
  }
}

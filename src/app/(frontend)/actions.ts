'use server'

import { getPayloadClient } from '../../lib/storefront'

export type SubscribeState = { ok: boolean; message: string }

export async function subscribeNewsletter(_prev: SubscribeState, formData: FormData): Promise<SubscribeState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, message: 'Please enter a valid email address.' }
  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'contact-messages',
      overrideAccess: true,
      data: {
        name: email.split('@')[0],
        email,
        subject: 'Newsletter signup',
        message: 'Newsletter subscription request from the website.',
        status: 'new',
      },
    })
    return { ok: true, message: 'Subscribed! Watch your inbox for GPS tips and deals.' }
  } catch {
    return { ok: false, message: 'Could not subscribe right now — please try again.' }
  }
}

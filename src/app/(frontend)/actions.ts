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

export async function notifyBackInStock(_prev: SubscribeState, formData: FormData): Promise<SubscribeState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const product = String(formData.get('product') ?? '').trim()
  const variant = String(formData.get('variant') ?? '').trim()
  if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, message: 'Please enter a valid email address.' }
  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'contact-messages',
      overrideAccess: true,
      data: {
        name: email.split('@')[0],
        email,
        subject: `Back in stock — ${product}${variant ? ` (${variant})` : ''}`,
        message: `Please notify this customer when "${product}${variant ? ` — ${variant}` : ''}" is back in stock.`,
        status: 'new',
      },
    })
    return { ok: true, message: 'Got it — we\u2019ll email you when it\u2019s back in stock.' }
  } catch {
    return { ok: false, message: 'Could not save your request — please try again.' }
  }
}

'use server'

import { getPayloadClient } from '../../../../lib/storefront'
import { notifyOwner } from '../../../../lib/notify'

export type ReviewState = { ok: boolean; message: string }

export async function submitReview(_prev: ReviewState, formData: FormData): Promise<ReviewState> {
  const str = (k: string) => String(formData.get(k) ?? '').trim()
  const productId = Number(str('productId'))
  const rating = Math.min(Math.max(Number(str('rating') || 5), 1), 5)
  if (!productId) return { ok: false, message: 'Missing product.' }
  if (!str('authorName')) return { ok: false, message: 'Please enter your name.' }
  if (!str('title') || !str('body')) return { ok: false, message: 'Please complete your review.' }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'reviews',
      overrideAccess: true,
      data: {
        product: productId,
        rating,
        title: str('title'),
        body: str('body'),
        authorName: str('authorName'),
        authorEmail: str('email') || undefined,
        status: 'pending',
      },
    })
    await notifyOwner(
      `New review pending approval — ${rating}/5`,
      `A review was submitted on gpslane.com and needs moderation:\n\nProduct ID: ${productId}\nRating: ${rating}/5\nTitle: ${str('title')}\nBy: ${str('authorName')} <${str('email') || 'no email'}>\n\n${str('body')}\n\nApprove/reject in admin: https://gpslane.com/admin/collections/reviews`,
    )
    return { ok: true, message: '' }
  } catch {
    return { ok: false, message: 'Could not submit your review — please try again.' }
  }
}

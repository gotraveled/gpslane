'use server'

import { getPayloadClient } from '../../../../lib/storefront'

export type RequestState = { ok: boolean; message: string; requestNumber?: string }

export async function submitMapUpdateRequest(_prev: RequestState, formData: FormData): Promise<RequestState> {
  const str = (k: string) => String(formData.get(k) ?? '').trim()
  if (!str('fullName')) return { ok: false, message: 'Please enter your name.' }
  if (str('email') && !/^\S+@\S+\.\S+$/.test(str('email'))) return { ok: false, message: 'Please enter a valid email address.' }
  if (!str('phone')) return { ok: false, message: 'Please enter your phone number.' }

  try {
    const payload = await getPayloadClient()
    const doc: any = await payload.create({
      collection: 'map-update-requests',
      overrideAccess: true,
      data: {
        fullName: str('fullName'),
        email: str('email') || undefined,
        phone: str('phone'),
        deviceManufacturer: str('deviceManufacturer') || 'Unknown',
        deviceModel: str('deviceModel'),
        country: (str('country') || 'us') as 'us' | 'ca',
        deviceAgeBand: 'unknown' as any,
        mapSource: 'unknown' as any,
        notes: str('notes') || undefined,
        status: 'new',
        eligibilityOutcome: 'pending_review',
      } as any,
    })
    try {
      await payload.sendEmail({
        to: 'info@gpslane.com',
        subject: `New map-update request ${doc.requestNumber ?? ''} — ${doc.deviceModel || 'GPS device'}`,
        text: `Name: ${doc.fullName}\nPhone: ${doc.phone}\nEmail: ${doc.email ?? 'n/a'}\nDevice: ${doc.deviceModel ?? 'n/a'}\nCountry: ${doc.country}\nRequest #: ${doc.requestNumber}`,
      })
    } catch { /* email adapter optional */ }
    return { ok: true, message: 'Request received — a GPSLane technician will call you to confirm compatibility. No payment is taken until your update is confirmed.', requestNumber: doc.requestNumber }
  } catch {
    return { ok: false, message: 'Something went wrong submitting the form. Please call +1 (844) 966-7866 or email info@gpslane.com.' }
  }
}

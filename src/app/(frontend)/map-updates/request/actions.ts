'use server'

import { getPayloadClient } from '../../../../lib/storefront'

export type RequestState = { ok: boolean; message: string; requestNumber?: string }

export async function submitMapUpdateRequest(_prev: RequestState, formData: FormData): Promise<RequestState> {
  const str = (k: string) => String(formData.get(k) ?? '').trim()
  const required = ['fullName', 'email', 'phone', 'deviceManufacturer', 'country'] as const
  for (const k of required) {
    if (!str(k)) return { ok: false, message: `Please fill in ${k.replace(/([A-Z])/g, ' $1').toLowerCase()}.` }
  }
  if (!/^\S+@\S+\.\S+$/.test(str('email'))) return { ok: false, message: 'Please enter a valid email address.' }

  try {
    const payload = await getPayloadClient()
    const doc = await payload.create({
      collection: 'map-update-requests',
      overrideAccess: true,
      data: {
        fullName: str('fullName'),
        email: str('email'),
        phone: str('phone'),
        deviceManufacturer: str('deviceManufacturer'),
        deviceModel: str('deviceModel') || undefined,
        deviceSerial: str('deviceSerial') || undefined,
        screenSizeIn: str('screenSizeIn') ? Number(str('screenSizeIn')) : undefined,
        deviceAgeBand: (str('deviceAgeBand') || 'unknown') as any,
        country: str('country') as 'us' | 'ca',
        mapVersion: str('mapVersion') || undefined,
        mapSource: (str('mapSource') || 'unknown') as any,
        hasWifi: formData.get('hasWifi') === 'on',
        notes: str('notes') || undefined,
        status: 'new',
        eligibilityOutcome: 'pending_review',
      } as any,
    })
    return { ok: true, message: 'Request received — we will review your device and reply by email.', requestNumber: (doc as any).requestNumber }
  } catch (e: any) {
    return { ok: false, message: 'Something went wrong submitting the form. Please email support@gpslane.com instead.' }
  }
}

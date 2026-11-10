'use client'

import { useEffect } from 'react'

export default function ThankYouTracker({ form }: { form: string }) {
  useEffect(() => {
    const w = window as any
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push({ event: 'lead_form_submit', form_name: form })
  }, [form])
  return null
}

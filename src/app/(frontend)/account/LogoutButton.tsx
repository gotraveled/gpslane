'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LogoutButton() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  return (
    <button
      type="button"
      className="btn btn-ghost"
      style={{ fontSize: '0.85rem' }}
      disabled={pending}
      onClick={async () => {
        setPending(true)
        await fetch('/api/customers/logout', { method: 'POST' }).catch(() => {})
        router.refresh()
        setPending(false)
      }}
    >
      {pending ? 'Signing out…' : 'Sign out'}
    </button>
  )
}

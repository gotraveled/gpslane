'use client'

import Link from 'next/link'
import { useRef } from 'react'

export default function MobileNav({ items }: { items: { href: string; label: string }[] }) {
  const toggleRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <input ref={toggleRef} type="checkbox" id="nav-toggle" className="nav-toggle" aria-hidden="true" />
      <label htmlFor="nav-toggle" className="nav-toggle-label" aria-label="Toggle navigation menu">
        <span></span><span></span><span></span>
      </label>
      <nav className="main-nav" aria-label="Main" onClick={() => { if (toggleRef.current) toggleRef.current.checked = false }}>
        {items.map((l) => (
          <Link key={l.href} href={l.href}>{l.label}</Link>
        ))}
      </nav>
    </>
  )
}

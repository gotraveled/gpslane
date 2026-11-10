'use client'

import { useMemo, useState } from 'react'
import ProductActions from './ProductActions'

export type VariantLite = {
  id: number
  name?: string | null
  sku?: string | null
  priceUsd: number | null
  compareAtUsd?: number | null
  priceCad: number | null
  compareAtCad?: number | null
  shipUs?: { cost: number; min: number; max: number } | null
  shipCa?: { cost: number; min: number; max: number } | null
}

export default function VariantPicker({
  variants,
  productId,
  productSlug,
  productName,
  imageUrl,
}: {
  variants: VariantLite[]
  productId: string | number
  productSlug: string
  productName: string
  imageUrl?: string | null
}) {
  const [selectedId, setSelectedId] = useState<number>(variants.find((v) => v.shipUs)?.id ?? variants[0]?.id ?? 0)
  const v = useMemo(() => variants.find((x) => x.id === selectedId) ?? variants[0], [variants, selectedId])
  if (!v) return null

  return (
    <div className="card" style={{ padding: '1.5rem', marginTop: '1rem' }}>
      {variants.length > 1 ? (
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="variant-select" style={{ fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Option</label>
          <select id="variant-select" value={v.id} onChange={(e) => setSelectedId(Number(e.target.value))} style={{ width: '100%', padding: '0.7rem', border: '1px solid var(--border)', borderRadius: 10 }}>
            {variants.map((x) => (
              <option key={x.id} value={x.id}>{x.name ?? `Option ${x.id}`} — ${x.priceUsd?.toFixed(2) ?? '—'}</option>
            ))}
          </select>
        </div>
      ) : null}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
        <span className="price" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>
          {v.priceUsd != null ? `$${v.priceUsd.toFixed(2)}` : '—'} <small style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--muted)' }}>USD</small>
          {v.compareAtUsd ? <small style={{ marginLeft: '0.5rem', textDecoration: 'line-through', color: 'var(--muted)', fontWeight: 500, fontSize: '1rem' }}>${v.compareAtUsd.toFixed(2)}</small> : null}
          {v.compareAtUsd && v.priceUsd ? <small style={{ marginLeft: '0.4rem', background: '#e7f5e0', color: 'var(--primary)', fontWeight: 700, fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: 999 }}>SAVE {Math.round((1 - v.priceUsd / v.compareAtUsd) * 100)}%</small> : null}
        </span>
        {v.priceCad != null ? <span className="muted" style={{ fontSize: '0.85rem' }}>≈ ${v.priceCad.toFixed(2)} CAD</span> : null}
      </div>

      <div className="avail" style={{ marginBottom: '1rem' }}>
        {v.shipUs ? <span><strong style={{ color: 'var(--primary)' }}>Free shipping</strong> USA · {v.shipUs.min}–{v.shipUs.max} days</span> : <span className="muted">Not available in USA</span>}
        {v.shipCa ? <span><strong style={{ color: 'var(--primary)' }}>Free shipping</strong> Canada · {v.shipCa.min}–{v.shipCa.max} days</span> : null}
      </div>

      <ProductActions
        item={{
          productId,
          productSlug,
          productName,
          variantId: v.id,
          variantName: v.name ?? undefined,
          priceUsd: v.priceUsd ?? 0,
          shippingUsd: 0,
          priceCad: v.priceCad,
          shippingCad: null,
          imageUrl: imageUrl ?? null,
        }}
      />
      <p className="muted" style={{ fontSize: '0.85rem', marginTop: '0.9rem', marginBottom: 0 }}>
        Free cancellation within 24h before shipping · Secure PayPal payment · Tracking included
      </p>
    </div>
  )
}

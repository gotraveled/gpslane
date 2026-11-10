'use client'

import { useMemo, useState } from 'react'
import ProductActions from './ProductActions'

export type VariantLite = {
  id: number
  name?: string | null
  sku?: string | null
  priceUsd: number | null
  priceCad: number | null
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
        </span>
        {v.priceCad != null ? <span className="muted" style={{ fontSize: '0.85rem' }}>≈ ${v.priceCad.toFixed(2)} CAD</span> : null}
      </div>

      <div className="avail" style={{ marginBottom: '1rem' }}>
        {v.shipUs ? <span>USA — {v.shipUs.cost === 0 ? 'Free shipping' : `$${v.shipUs.cost.toFixed(2)} shipping`} · {v.shipUs.min}–{v.shipUs.max} days</span> : <span className="muted">Not available in USA</span>}
        {v.shipCa ? <span>Canada — ${v.shipCa.cost.toFixed(2)} shipping · {v.shipCa.min}–{v.shipCa.max} days</span> : null}
      </div>

      <ProductActions
        item={{
          productId,
          productSlug,
          productName,
          variantId: v.id,
          variantName: v.name ?? undefined,
          priceUsd: v.priceUsd ?? 0,
          shippingUsd: v.shipUs?.cost ?? 0,
          priceCad: v.priceCad,
          shippingCad: v.shipCa?.cost ?? null,
          imageUrl: imageUrl ?? null,
        }}
      />
      <p className="muted" style={{ fontSize: '0.85rem', marginTop: '0.9rem', marginBottom: 0 }}>
        Free cancellation within 24h before shipping · Secure PayPal payment · Tracking included
      </p>
    </div>
  )
}

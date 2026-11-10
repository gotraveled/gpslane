'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import WishlistButton from './WishlistButton'

export type ShopItem = {
  id: string | number
  slug: string
  name: string
  shortDescription?: string | null
  imageUrl?: string | null
  categoryName?: string | null
  categorySlug?: string | null
  priceUsd?: number | null
  compareAtUsd?: number | null
}

export default function ShopGrid({ items, categories }: { items: ShopItem[]; categories: { slug: string; name: string }[] }) {
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState<string>('all')
  const [sort, setSort] = useState<'name' | 'price-asc' | 'price-desc'>('name')

  const filtered = useMemo(() => {
    let list = items
    const q = query.trim().toLowerCase()
    if (q) list = list.filter((i) => `${i.name} ${i.shortDescription ?? ''}`.toLowerCase().includes(q))
    if (cat !== 'all') list = list.filter((i) => i.categorySlug === cat)
    const sorted = [...list]
    if (sort === 'price-asc') sorted.sort((a, b) => (a.priceUsd ?? Infinity) - (b.priceUsd ?? Infinity))
    if (sort === 'price-desc') sorted.sort((a, b) => (b.priceUsd ?? 0) - (a.priceUsd ?? 0))
    else if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name))
    return sorted
  }, [items, query, cat, sort])

  return (
    <>
      <div className="shop-toolbar">
        <input
          type="search"
          placeholder="Search GPS devices…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="shop-search"
          aria-label="Search products"
        />
        <select value={sort} onChange={(e) => setSort(e.target.value as any)} aria-label="Sort products" className="shop-sort">
          <option value="name">Sort: Name A–Z</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
      <div className="shop-filters">
        <button className={`chip ${cat === 'all' ? 'active' : ''}`} onClick={() => setCat('all')}>All</button>
        {categories.map((c) => (
          <button key={c.slug} className={`chip ${cat === c.slug ? 'active' : ''}`} onClick={() => setCat(c.slug)}>{c.name}</button>
        ))}
      </div>
      {filtered.length ? (
        <div className="grid grid-4">
          {filtered.map((i) => (
            <div className="card" key={i.id}>
              <Link href={`/product/${i.slug}`} className="card-img" aria-label={i.name}>
                {i.imageUrl ? <Image src={i.imageUrl} alt={i.name} fill sizes="(max-width: 760px) 100vw, 25vw" style={{ objectFit: 'cover' }} /> : <span>{i.name}</span>}
                <span className="card-badge">GPS Lane</span>
              </Link>
              <WishlistButton item={{ productId: i.id, slug: i.slug, name: i.name, imageUrl: i.imageUrl, priceUsd: i.priceUsd }} />
              <div className="card-body">
                {i.categoryName ? <span className="card-cat">{i.categoryName}</span> : null}
                <h3><Link href={`/product/${i.slug}`}>{i.name}</Link></h3>
                {i.shortDescription ? <p className="muted" style={{ fontSize: '0.88rem', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{i.shortDescription}</p> : null}
                <div style={{ marginTop: 'auto', paddingTop: '0.6rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.6rem' }}>
                    {i.priceUsd != null ? (
                      <span className="card-price">
                        ${i.priceUsd.toFixed(2)} <small style={{ fontWeight: 500, color: 'var(--muted)' }}>USD</small>
                        {i.compareAtUsd ? <small style={{ marginLeft: '0.4rem', textDecoration: 'line-through', color: 'var(--muted)', fontWeight: 500, fontSize: '0.8rem' }}>${i.compareAtUsd.toFixed(2)}</small> : null}
                      </span>
                    ) : <span className="muted">—</span>}
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)' }}>FREE SHIPPING</span>
                  </div>
                  <Link href={`/product/${i.slug}`} className="btn btn-primary" style={{ width: '100%', textAlign: 'center', padding: '0.55rem 1rem', fontSize: '0.9rem' }}>View &amp; Buy</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state"><p>No products match your search.</p></div>
      )}
    </>
  )
}

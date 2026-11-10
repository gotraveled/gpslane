import Image from 'next/image'
import Link from 'next/link'
import { availabilityFor, getPublishedProducts, getVariantsForProduct, mediaUrl, salePriceFor } from '../../../lib/storefront'

export const revalidate = 3600
export const metadata = {
  title: 'Compare GPS Devices | GPSLane',
  description: 'Compare GPSLane navigation devices side-by-side — price, shipping time, category and features.',
  robots: { index: false },
}

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ a?: string; b?: string; c?: string }> }) {
  const { a, b, c } = await searchParams
  const products = await getPublishedProducts().catch(() => [] as any[])
  const picks = [a, b, c].filter(Boolean) as string[]
  const selected = await Promise.all(
    picks.map(async (slug) => {
      const product = products.find((p: any) => p.slug === slug)
      if (!product) return null
      const variant = (await getVariantsForProduct(product.id))[0]
      return { product, variant }
    }),
  )
  const list = selected.filter(Boolean) as { product: any; variant: any }[]

  const sel = (key: 'a' | 'b' | 'c') => {
    const val = { a, b, c }[key]
    return (
      <select name={key} defaultValue={val ?? ''} style={{ width: '100%' }}>
        <option value="">— Select a product —</option>
        {products.map((p: any) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
      </select>
    )
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      <div className="page-head">
        <h1>Compare GPS Devices</h1>
        <p className="lede">Pick up to three products to see them side-by-side.</p>
      </div>

      <form method="get" className="grid grid-3" style={{ gap: '1rem', marginBottom: '2rem' }}>
        {sel('a')}
        {sel('b')}
        {sel('c')}
        <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.7rem 2rem' }}>Compare</button>
        </div>
      </form>

      {list.length ? (
        <table className="cart-table compare-table">
          <thead>
            <tr>
              <th style={{ width: 140 }}>Spec</th>
              {list.map(({ product }) => <th key={product.id}><Link href={`/product/${product.slug}`}>{product.name}</Link></th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Image</strong></td>
              {list.map(({ product }) => {
                const img = Array.isArray(product.images) && product.images.length ? mediaUrl(product.images[0]) : null
                return <td key={product.id}>{img ? <Image src={img} alt={product.name} width={120} height={120} style={{ objectFit: 'cover', borderRadius: 10 }} /> : '—'}</td>
              })}
            </tr>
            <tr>
              <td><strong>Price</strong></td>
              {list.map(({ product, variant }) => (
                <td key={product.id}><strong style={{ color: 'var(--primary)' }}>{variant ? `$${salePriceFor(variant, 'usd', 'US')?.toFixed(2) ?? '—'} USD` : '—'}</strong></td>
              ))}
            </tr>
            <tr>
              <td><strong>Category</strong></td>
              {list.map(({ product }) => {
                const cat = Array.isArray(product.primaryCategory) ? product.primaryCategory[0] : product.primaryCategory
                return <td key={product.id}>{cat?.name ?? '—'}</td>
              })}
            </tr>
            <tr>
              <td><strong>Shipping (USA)</strong></td>
              {list.map(({ product, variant }) => {
                const av = variant ? availabilityFor(variant, 'US') : null
                return <td key={product.id}>{av ? `FREE · ${av.etaMinDays}–${av.etaMaxDays} days` : '—'}</td>
              })}
            </tr>
            <tr>
              <td><strong>Shipping (Canada)</strong></td>
              {list.map(({ product, variant }) => {
                const av = variant ? availabilityFor(variant, 'CA') : null
                return <td key={product.id}>{av ? `FREE · ${av.etaMinDays}–${av.etaMaxDays} days` : '—'}</td>
              })}
            </tr>
            <tr>
              <td><strong>Payment</strong></td>
              {list.map(({ product }) => <td key={product.id}>PayPal Secure</td>)}
            </tr>
            <tr>
              <td><strong>Returns</strong></td>
              {list.map(({ product }) => <td key={product.id}>7-day window</td>)}
            </tr>
            <tr>
              <td><strong>Description</strong></td>
              {list.map(({ product }) => <td key={product.id} style={{ fontSize: '0.88rem' }}>{product.shortDescription ?? '—'}</td>)}
            </tr>
            <tr>
              <td />
              {list.map(({ product }) => (
                <td key={product.id}>
                  <Link href={`/product/${product.slug}`} className="btn btn-primary" style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}>View Product</Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      ) : (
        <div className="notice" style={{ textAlign: 'center' }}>Select products above to compare them side-by-side.</div>
      )}
    </div>
  )
}

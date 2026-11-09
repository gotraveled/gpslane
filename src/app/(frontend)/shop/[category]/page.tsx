import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getActiveCategories, getProductsByCategory, getVariantsForProduct } from '../../../../lib/storefront'
import ProductCard from '../../../../components/ProductCard'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const cats = await getActiveCategories()
  const cat = cats.find((c: any) => c.slug === category)
  if (!cat) return { title: 'Category' }
  return { title: cat.name, description: cat.description ?? `Shop ${cat.name} at GPSLane.` }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const cats = await getActiveCategories()
  const cat = cats.find((c: any) => c.slug === category)
  if (!cat) notFound()
  const products = await getProductsByCategory(cat.id)
  const withVariants = await Promise.all(
    products.map(async (p) => ({ product: p, variant: (await getVariantsForProduct(p.id))[0] })),
  )
  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      <nav className="breadcrumbs"><Link href="/shop">Shop</Link> / {cat.name}</nav>
      <div className="page-head">
        <h1>{cat.name}</h1>
        {cat.description ? <p className="muted">{cat.description}</p> : null}
      </div>
      {withVariants.length ? (
        <div className="grid grid-3">
          {withVariants.map(({ product, variant }) => (
            <ProductCard key={product.id} product={product} variant={variant} />
          ))}
        </div>
      ) : (
        <div className="empty-state"><p>No products in this category yet.</p></div>
      )}
    </div>
  )
}

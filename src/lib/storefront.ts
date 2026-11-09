import { getPayload } from 'payload'
import configPromise from '../payload.config'

export async function getPayloadClient() {
  return getPayload({ config: configPromise })
}

export type StorefrontProduct = {
  id: number | string
  name: string
  slug: string
  shortDescription?: string | null
  description?: any
  images?: any[]
  categories?: any[]
  primaryCategory?: any
  seo?: { metaTitle?: string | null; metaDescription?: string | null }
}

export async function getPublishedProducts() {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'products',
    where: { status: { equals: 'published' } },
    depth: 2,
    limit: 100,
    sort: 'name',
  })
  return res.docs as unknown as StorefrontProduct[]
}

export async function getProductBySlug(slug: string) {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'products',
    where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
    depth: 2,
    limit: 1,
  })
  return (res.docs[0] as unknown as StorefrontProduct) ?? null
}

export async function getVariantsForProduct(productId: number | string) {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'product-variants',
    where: { and: [{ product: { equals: productId } }, { status: { equals: 'active' } }] },
    depth: 0,
    limit: 20,
  })
  return res.docs as any[]
}

export async function getActiveCategories() {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'categories',
    where: { isActive: { equals: true } },
    depth: 0,
    limit: 50,
    sort: 'sortOrder',
  })
  return res.docs as any[]
}

export async function getProductsByCategory(categoryId: number | string) {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'products',
    where: {
      and: [{ status: { equals: 'published' } }, { categories: { contains: categoryId } }],
    },
    depth: 2,
    limit: 100,
    sort: 'name',
  })
  return res.docs as unknown as StorefrontProduct[]
}

export function priceFor(variant: any, currency: 'usd' | 'cad' = 'usd') {
  const p = (variant?.prices ?? []).find((x: any) => x.currency === currency)
  return p ? p.priceCents / 100 : null
}

export function availabilityFor(variant: any, country: 'US' | 'CA') {
  return (variant?.availability ?? []).find((a: any) => a.country === country && a.available)
}

export function mediaUrl(media: any): string | null {
  if (!media) return null
  if (typeof media === 'string' || typeof media === 'number') return null
  const m = media as any
  return m.url ?? (m.filename ? `/api/media/file/${m.filename}` : null)
}

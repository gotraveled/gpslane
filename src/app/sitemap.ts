import type { MetadataRoute } from 'next'
import { getPublishedProducts, getActiveCategories, getPayloadClient } from '../lib/storefront'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gpslane.com'
  const staticRoutes = [
    '', '/shop', '/about', '/contact', '/faq', '/shipping', '/returns', '/privacy', '/terms',
    '/map-updates', '/map-updates/request', '/map-updates/eligibility',
    '/how-to-update-gps-maps-diy-guide',
  ].map((p) => ({ url: `${base}${p}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.7 }))

  const [products, categories] = await Promise.all([getPublishedProducts(), getActiveCategories()])
  const productRoutes = products.map((p) => ({
    url: `${base}/product/${p.slug}`, changeFrequency: 'weekly' as const, priority: 0.8,
  }))
  const categoryRoutes = categories.map((c: any) => ({
    url: `${base}/shop/${c.slug}`, changeFrequency: 'weekly' as const, priority: 0.6,
  }))
  return [...staticRoutes, ...productRoutes, ...categoryRoutes]
}

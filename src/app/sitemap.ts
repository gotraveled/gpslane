import type { MetadataRoute } from 'next'
import { getPublishedProducts, getActiveCategories } from '../lib/storefront'

// Rendered on demand — requires PAYLOAD_SECRET + DATABASE_URL at runtime,
// which may not exist during static export/prerender.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gpslane.com'
  const staticRoutes = [
    '', '/shop', '/about', '/contact', '/faq', '/shipping-and-returns', '/privacy', '/terms',
    '/disclaimer', '/cookie-policy', '/accessibility', '/payment-security', '/track-order', '/reviews', '/guides', '/guides/best-gps-for-truck-drivers',
    '/guides/gps-vs-smartphone-navigation', '/guides/how-to-choose-carplay-gps-screen',
    '/guides/how-to-update-garmin-maps', '/guides/how-to-update-tomtom-maps',
    '/guides/gps-map-update-not-working',
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

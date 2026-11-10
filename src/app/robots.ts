import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gpslane.com'
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/cart', '/checkout', '/account', '/wishlist', '/compare', '/thank-you'] },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}

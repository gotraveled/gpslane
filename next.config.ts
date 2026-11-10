import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  async redirects() {
    // Preserve legacy gpslane.com (Zyro) URLs with 301s to new canonical routes.
    return [
      { source: '/gps-maps-updates', destination: '/map-updates', permanent: true },
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/shipping', destination: '/shipping-and-returns', permanent: true },
      { source: '/returns', destination: '/shipping-and-returns', permanent: true },
      { source: '/frequently-asked-questions-faqs', destination: '/faq', permanent: true },
      { source: '/terms-and-conditions', destination: '/terms', permanent: true },
      { source: '/privacy-policy', destination: '/privacy', permanent: true },
    ]
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
    remotePatterns: [
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: '**.blob.vercel-storage.com' },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })

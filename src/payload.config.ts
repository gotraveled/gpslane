import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Articles } from './collections/Articles'
import { Categories } from './collections/Categories'
import { CompatibilityRules } from './collections/CompatibilityRules'
import { PricingSettings } from './globals/PricingSettings'
import { InventoryLevels } from './collections/InventoryLevels'
import { ContactMessages } from './collections/ContactMessages'
import { Customers } from './collections/Customers'
import { Reviews } from './collections/Reviews'
import { MapUpdateRequests } from './collections/MapUpdateRequests'
import { Orders } from './collections/Orders'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { ProductVariants } from './collections/ProductVariants'
import { Products } from './collections/Products'
import { ServiceOfferings } from './collections/ServiceOfferings'
import { SupplierProducts } from './collections/SupplierProducts'
import { Suppliers } from './collections/Suppliers'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      beforeDashboard: ['@/components/admin/DashboardStats'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Categories,
    Products,
    ProductVariants,
    Suppliers,
    SupplierProducts,
    InventoryLevels,
    Pages,
    Articles,
    ServiceOfferings,
    CompatibilityRules,
    MapUpdateRequests,
    ContactMessages,
    Orders,
    Customers,
    Reviews,
  ],
  globals: [PricingSettings],
  editor: lexicalEditor(),
  ...(process.env.RESEND_API_KEY
    ? {
        email: resendAdapter({
          apiKey: process.env.RESEND_API_KEY,
          defaultFromAddress: process.env.EMAIL_FROM ?? 'GPSLane <info@gpslane.com>',
          defaultFromName: 'GPSLane',
        }),
      }
    : {}),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  localization: {
    locales: [{ code: 'en', label: 'English' }],
    fallback: true,
    defaultLocale: 'en',
  },
  plugins: [
    mcpPlugin({}),
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            collections: { media: true },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
})

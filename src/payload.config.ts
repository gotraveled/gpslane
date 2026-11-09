import { postgresAdapter } from '@payloadcms/db-postgres'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Articles } from './collections/Articles'
import { Categories } from './collections/Categories'
import { CompatibilityRules } from './collections/CompatibilityRules'
import { InventoryLevels } from './collections/InventoryLevels'
import { MapUpdateRequests } from './collections/MapUpdateRequests'
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
  ],
  editor: lexicalEditor(),
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
  plugins: [mcpPlugin({})],
})

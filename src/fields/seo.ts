import type { Field } from 'payload'

/**
 * Shared SEO metadata group — applied to pages, articles, products, categories.
 * Editable in admin without code changes; rendered into metadata + JSON-LD.
 */
export const seoFields: Field[] = [
  {
    name: 'seo',
    type: 'group',
    label: 'SEO',
    fields: [
      { name: 'metaTitle', type: 'text', admin: { description: '≤60 chars recommended' } },
      { name: 'metaDescription', type: 'textarea', admin: { description: '≤160 chars recommended' } },
      {
        name: 'canonical',
        type: 'text',
        admin: { description: 'Absolute canonical URL; defaults to page URL' },
      },
      { name: 'ogImage', type: 'upload', relationTo: 'media' },
      { name: 'noIndex', type: 'checkbox', defaultValue: false },
      { name: 'focusKeyword', type: 'text', admin: { description: 'Editorial hint only' } },
    ],
  },
]

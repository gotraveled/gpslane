type Props = {
  title: string
  description: string
  slug: string
  datePublished?: string
  dateModified?: string
}

export default function GuideSchema({ title, description, slug, datePublished = '2025-11-15', dateModified = '2026-11-20' }: Props) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gpslane.com'
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      author: { '@type': 'Organization', name: 'GPS Lane', url: site },
      publisher: { '@type': 'Organization', name: 'GPS Lane', url: site, logo: { '@type': 'ImageObject', url: `${site}/logo-gpslane.png` } },
      mainEntityOfPage: `${site}${slug}`,
      datePublished,
      dateModified,
      inLanguage: 'en',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: `${site}/guides` },
        { '@type': 'ListItem', position: 3, name: title, item: `${site}${slug}` },
      ],
    },
  ]
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

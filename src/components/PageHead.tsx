import Head from 'next/head'

interface PageHeadProps {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  ogType?: string
  structuredData?: Record<string, unknown> | Record<string, unknown>[]
}

export default function PageHead({
  title,
  description,
  keywords = [],
  canonical,
  ogImage = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&fit=crop',
  ogType = 'website',
  structuredData,
}: PageHeadProps) {
  const fullTitle = `${title} | Infinite Gundawar`
  const allKeywords = [
    'Infinite Gundawar',
    'Infinite Gundawar Business Private Limited',
    ...keywords,
  ].join(', ')

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <link rel="canonical" href={`https://infinite-gundawar-webapp.vercel.app${canonical || ''}`} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={`https://infinite-gundawar-webapp.vercel.app${canonical || ''}`} />
      <meta property="og:site_name" content="Infinite Gundawar" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(Array.isArray(structuredData) ? structuredData : [structuredData]),
          }}
        />
      )}
    </Head>
  )
}

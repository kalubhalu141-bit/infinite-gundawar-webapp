import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://infinite-gundawar-webapp.vercel.app'
  const now = new Date()

  const pages = [
    { url: '/', priority: 1.0, changeFrequency: 'daily' as const },
    { url: '/health', priority: 0.9, changeFrequency: 'daily' as const },
    { url: '/investment', priority: 0.9, changeFrequency: 'daily' as const },
    { url: '/happiness-hub', priority: 0.9, changeFrequency: 'daily' as const },
    { url: '/education', priority: 0.9, changeFrequency: 'daily' as const },
    { url: '/business', priority: 0.9, changeFrequency: 'daily' as const },
    { url: '/finance', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/ayurveda', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/ai-tools', priority: 0.7, changeFrequency: 'weekly' as const },
    { url: '/career', priority: 0.7, changeFrequency: 'weekly' as const },
    { url: '/property-finder', priority: 0.7, changeFrequency: 'weekly' as const },
    { url: '/data-scraper', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/phone-scraper', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/email-sender', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/interior-design', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/lead-dashboard', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/leads-dashboard', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/free-business-kit', priority: 0.7, changeFrequency: 'weekly' as const },
    { url: '/marketing', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/whatsapp', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/business-calculators', priority: 0.7, changeFrequency: 'weekly' as const },
    { url: '/happiness', priority: 0.7, changeFrequency: 'weekly' as const },
    { url: '/herb-finder', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/trending-bots', priority: 0.6, changeFrequency: 'weekly' as const },
  ]

  return pages.map(page => ({
    url: `${baseUrl}${page.url}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))
}

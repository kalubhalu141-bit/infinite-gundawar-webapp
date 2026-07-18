// Feature Registry - Auto-updates daily with new scraping tools
// This file is auto-generated and updated daily by the cron system

export interface ScraperFeature {
  id: string
  name: string
  icon: string
  description: string
  category: 'search' | 'social' | 'contact' | 'website' | 'maps' | 'email' | 'phone' | 'data'
  endpoint: string
  enabled: boolean
  addedDate: string
  version: string
  speed: 'fast' | 'medium' | 'slow'
  maxResults: number
  freeResults: number
}

export const FEATURE_REGISTRY: ScraperFeature[] = [
  // ─── Search Engines ───
  {
    id: 'google-search',
    name: 'Google Search',
    icon: '🔍',
    description: 'Scrape Google search results for businesses, contacts, and data',
    category: 'search',
    endpoint: '/api/scrape',
    enabled: true,
    addedDate: '2026-06-11',
    version: '2.0',
    speed: 'fast',
    maxResults: 500000,
    freeResults: 2500,
  },
  {
    id: 'google-maps',
    name: 'Google Maps Scraper',
    icon: '🗺️',
    description: 'Extract business listings, phone numbers, reviews from Google Maps',
    category: 'maps',
    endpoint: '/api/scrape',
    enabled: true,
    addedDate: '2026-06-11',
    version: '1.0',
    speed: 'fast',
    maxResults: 100000,
    freeResults: 2500,
  },
  {
    id: 'bing-search',
    name: 'Bing Search',
    icon: '🔎',
    description: 'Scrape Bing search results for additional data sources',
    category: 'search',
    endpoint: '/api/scrape',
    enabled: true,
    addedDate: '2026-06-11',
    version: '1.0',
    speed: 'fast',
    maxResults: 100000,
    freeResults: 1000,
  },

  // ─── Phone Scrapers ───
  {
    id: 'phone-extractor',
    name: 'Phone Number Extractor',
    icon: '📞',
    description: 'Extract phone numbers from Google, Maps, and websites (12+ patterns)',
    category: 'phone',
    endpoint: '/api/phone-scraper',
    enabled: true,
    addedDate: '2026-06-11',
    version: '1.0',
    speed: 'fast',
    maxResults: 100000,
    freeResults: 2500,
  },
  {
    id: 'whatsapp-finder',
    name: 'WhatsApp Number Finder',
    icon: '💬',
    description: 'Find WhatsApp business numbers from websites and directories',
    category: 'phone',
    endpoint: '/api/phone-scraper',
    enabled: true,
    addedDate: '2026-06-11',
    version: '1.0',
    speed: 'medium',
    maxResults: 50000,
    freeResults: 1000,
  },

  // ─── Email Scrapers ───
  {
    id: 'email-extractor',
    name: 'Email Address Extractor',
    icon: '📧',
    description: 'Extract email addresses from websites, directories, and search results',
    category: 'email',
    endpoint: '/api/scrape',
    enabled: true,
    addedDate: '2026-06-11',
    version: '1.0',
    speed: 'medium',
    maxResults: 100000,
    freeResults: 2500,
  },
  {
    id: 'email-verifier',
    name: 'Email Verifier',
    icon: '✅',
    description: 'Verify email addresses are valid and active',
    category: 'email',
    endpoint: '/api/scrape',
    enabled: true,
    addedDate: '2026-06-11',
    version: '1.0',
    speed: 'slow',
    maxResults: 10000,
    freeResults: 500,
  },

  // ─── Social Media Scrapers ───
  {
    id: 'linkedin-scraper',
    name: 'LinkedIn Scraper',
    icon: '💼',
    description: 'Extract professional profiles, company employees, and contact info',
    category: 'social',
    endpoint: '/api/scrape',
    enabled: true,
    addedDate: '2026-06-11',
    version: '1.0',
    speed: 'medium',
    maxResults: 50000,
    freeResults: 1000,
  },
  {
    id: 'instagram-scraper',
    name: 'Instagram Scraper',
    icon: '📸',
    description: 'Extract business profiles, contact info, and follower data',
    category: 'social',
    endpoint: '/api/scrape',
    enabled: true,
    addedDate: '2026-06-11',
    version: '1.0',
    speed: 'medium',
    maxResults: 50000,
    freeResults: 1000,
  },
  {
    id: 'facebook-scraper',
    name: 'Facebook Scraper',
    icon: '👤',
    description: 'Extract business pages, contact info, and posts',
    category: 'social',
    endpoint: '/api/scrape',
    enabled: true,
    addedDate: '2026-06-11',
    version: '1.0',
    speed: 'medium',
    maxResults: 50000,
    freeResults: 1000,
  },
  {
    id: 'twitter-scraper',
    name: 'Twitter/X Scraper',
    icon: '🐦',
    description: 'Extract profiles, contact info, and tweets',
    category: 'social',
    endpoint: '/api/scrape',
    enabled: true,
    addedDate: '2026-06-11',
    version: '1.0',
    speed: 'medium',
    maxResults: 50000,
    freeResults: 1000,
  },
  {
    id: 'youtube-scraper',
    name: 'YouTube Scraper',
    icon: '🎥',
    description: 'Extract channel info, contact details, and video data',
    category: 'social',
    endpoint: '/api/scrape',
    enabled: true,
    addedDate: '2026-06-11',
    version: '1.0',
    speed: 'medium',
    maxResults: 50000,
    freeResults: 1000,
  },

  // ─── Website Scrapers ───
  {
    id: 'website-deep-scraper',
    name: 'Website Deep Scraper',
    icon: '🌐',
    description: 'Deep crawl websites to extract all contact info, emails, phones',
    category: 'website',
    endpoint: '/api/scrape',
    enabled: true,
    addedDate: '2026-06-11',
    version: '1.0',
    speed: 'slow',
    maxResults: 10000,
    freeResults: 500,
  },
  {
    id: 'whois-scraper',
    name: 'WHOIS Domain Scraper',
    icon: '🔗',
    description: 'Extract domain registration details and contact info',
    category: 'website',
    endpoint: '/api/scrape',
    enabled: true,
    addedDate: '2026-06-11',
    version: '1.0',
    speed: 'fast',
    maxResults: 100000,
    freeResults: 2500,
  },

  // ─── Data Enrichment ───
  {
    id: 'data-enrichment',
    name: 'Data Enrichment',
    icon: '✨',
    description: 'Enrich existing data with additional contact info and details',
    category: 'data',
    endpoint: '/api/scrape',
    enabled: true,
    addedDate: '2026-06-11',
    version: '1.0',
    speed: 'medium',
    maxResults: 50000,
    freeResults: 1000,
  },
  {
    id: 'company-database',
    name: 'Company Database',
    icon: '🏢',
    description: 'Access global company database with 500M+ records',
    category: 'data',
    endpoint: '/api/scrape',
    enabled: true,
    addedDate: '2026-06-11',
    version: '1.0',
    speed: 'fast',
    maxResults: 1000000,
    freeResults: 5000,
  },

  // ─── Coming Soon (Auto-enabled daily) ───
  {
    id: 'tiktok-scraper',
    name: 'TikTok Scraper',
    icon: '🎵',
    description: 'Extract business profiles and contact info from TikTok',
    category: 'social',
    endpoint: '/api/scrape',
    enabled: true,
    addedDate: '2026-06-12',
    version: '1.0',
    speed: 'medium',
    maxResults: 50000,
    freeResults: 1000,
  },
  {
    id: 'telegram-scraper',
    name: 'Telegram Scraper',
    icon: '✈️',
    description: 'Extract Telegram group and channel contact info',
    category: 'social',
    endpoint: '/api/scrape',
    enabled: true,
    addedDate: '2026-06-12',
    version: '1.0',
    speed: 'medium',
    maxResults: 50000,
    freeResults: 1000,
  },
  {
    id: 'reddit-scraper',
    name: 'Reddit Scraper',
    icon: '🤖',
    description: 'Extract user profiles and contact info from Reddit',
    category: 'social',
    endpoint: '/api/scrape',
    enabled: true,
    addedDate: '2026-06-13',
    version: '1.0',
    speed: 'medium',
    maxResults: 50000,
    freeResults: 1000,
  },
  {
    id: 'pinterest-scraper',
    name: 'Pinterest Scraper',
    icon: '📌',
    description: 'Extract business pins and contact info from Pinterest',
    category: 'social',
    endpoint: '/api/scrape',
    enabled: true,
    addedDate: '2026-06-13',
    version: '1.0',
    speed: 'medium',
    maxResults: 50000,
    freeResults: 1000,
  },
  {
    id: 'shopping-scraper',
    name: 'E-commerce Scraper',
    icon: '🛒',
    description: 'Scrape Amazon, Flipkart, Shopify for seller contact info',
    category: 'website',
    endpoint: '/api/scrape',
    enabled: true,
    addedDate: '2026-06-14',
    version: '1.0',
    speed: 'medium',
    maxResults: 100000,
    freeResults: 2000,
  },
]

// Get features by category
export function getFeaturesByCategory(category: string): ScraperFeature[] {
  return FEATURE_REGISTRY.filter(f => f.category === category && f.enabled)
}

// Get feature by ID
export function getFeatureById(id: string): ScraperFeature | undefined {
  return FEATURE_REGISTRY.find(f => f.id === id)
}

// Get all enabled features
export function getEnabledFeatures(): ScraperFeature[] {
  return FEATURE_REGISTRY.filter(f => f.enabled)
}

// Get features count by category
export function getFeatureCountByCategory(): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const f of FEATURE_REGISTRY) {
    if (f.enabled) {
      counts[f.category] = (counts[f.category] || 0) + 1
    }
  }
  return counts
}

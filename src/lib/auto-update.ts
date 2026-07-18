// Auto-Update System - Runs daily to add new scraping features
// This simulates daily feature updates

import { FEATURE_REGISTRY, ScraperFeature } from '../lib/feature-registry'

// New features to be added on each daily update
const DAILY_FEATURES: Partial<ScraperFeature>[] = [
  {
    id: 'job-portal-scraper',
    name: 'Job Portal Scraper',
    icon: '💼',
    description: 'Scrape Naukri, Indeed, LinkedIn Jobs for employer contact info',
    category: 'website',
    endpoint: '/api/scrape',
    speed: 'medium',
    maxResults: 100000,
    freeResults: 2000,
  },
  {
    id: 'real-estate-scraper',
    name: 'Real Estate Scraper',
    icon: '🏠',
    description: 'Scrape 99acres, MagicBricks, Housing.com for agent contacts',
    category: 'website',
    endpoint: '/api/scrape',
    speed: 'medium',
    maxResults: 100000,
    freeResults: 2000,
  },
  {
    id: 'travel-scraper',
    name: 'Travel Scraper',
    icon: '✈️',
    description: 'Scrape MakeMyTrip, Booking.com for hotel and agent contacts',
    category: 'website',
    endpoint: '/api/scrape',
    speed: 'medium',
    maxResults: 100000,
    freeResults: 2000,
  },
  {
    id: 'food-delivery-scraper',
    name: 'Food Delivery Scraper',
    icon: '🍔',
    description: 'Scrape Zomato, Swiggy for restaurant contacts and menus',
    category: 'website',
    endpoint: '/api/scrape',
    speed: 'fast',
    maxResults: 100000,
    freeResults: 2000,
  },
  {
    id: 'healthcare-scraper',
    name: 'Healthcare Scraper',
    icon: '🏥',
    description: 'Scrape Practo, 1mg for doctor and hospital contacts',
    category: 'website',
    endpoint: '/api/scrape',
    speed: 'medium',
    maxResults: 100000,
    freeResults: 2000,
  },
  {
    id: 'education-scraper',
    name: 'Education Scraper',
    icon: '🎓',
    description: 'Scrape Shiksha, CollegeDunia for institute contacts',
    category: 'website',
    endpoint: '/api/scrape',
    speed: 'medium',
    maxResults: 100000,
    freeResults: 2000,
  },
  {
    id: 'automobile-scraper',
    name: 'Automobile Scraper',
    icon: '🚗',
    description: 'Scrape CarDekho, BikeWale for dealer contacts',
    category: 'website',
    endpoint: '/api/scrape',
    speed: 'medium',
    maxResults: 100000,
    freeResults: 2000,
  },
  {
    id: 'classified-scraper',
    name: 'Classified Scraper',
    icon: '📋',
    description: 'Scrape OLX, Quikr for seller contacts and listings',
    category: 'website',
    endpoint: '/api/scrape',
    speed: 'fast',
    maxResults: 100000,
    freeResults: 2000,
  },
  {
    id: 'news-scraper',
    name: 'News Scraper',
    icon: '📰',
    description: 'Scrape news sites for journalist and editor contacts',
    category: 'website',
    endpoint: '/api/scrape',
    speed: 'fast',
    maxResults: 100000,
    freeResults: 2000,
  },
  {
    id: 'review-scraper',
    name: 'Review Scraper',
    icon: '⭐',
    description: 'Scrape Google Reviews, Trustpilot for business contacts',
    category: 'website',
    endpoint: '/api/scrape',
    speed: 'medium',
    maxResults: 100000,
    freeResults: 2000,
  },
  {
    id: 'patent-scraper',
    name: 'Patent Scraper',
    icon: '📜',
    description: 'Scrape patent databases for inventor and company contacts',
    category: 'data',
    endpoint: '/api/scrape',
    speed: 'slow',
    maxResults: 50000,
    freeResults: 1000,
  },
  {
    id: 'trademark-scraper',
    name: 'Trademark Scraper',
    icon: '™️',
    description: 'Scrape trademark databases for brand owner contacts',
    category: 'data',
    endpoint: '/api/scrape',
    speed: 'slow',
    maxResults: 50000,
    freeResults: 1000,
  },
  {
    id: 'government-scraper',
    name: 'Government Database Scraper',
    icon: '🏛️',
    description: 'Scrape government directories for official contacts',
    category: 'data',
    endpoint: '/api/scrape',
    speed: 'medium',
    maxResults: 100000,
    freeResults: 2000,
  },
  {
    id: 'conference-scraper',
    name: 'Conference Scraper',
    icon: '🎤',
    description: 'Scrape event sites for speaker and attendee contacts',
    category: 'data',
    endpoint: '/api/scrape',
    speed: 'medium',
    maxResults: 50000,
    freeResults: 1000,
  },
  {
    id: 'startup-scraper',
    name: 'Startup Database Scraper',
    icon: '🚀',
    description: 'Scrape Crunchbase, AngelList for founder contacts',
    category: 'data',
    endpoint: '/api/scrape',
    speed: 'medium',
    maxResults: 100000,
    freeResults: 2000,
  },
]

// Get the next feature to enable (based on day of year)
export function getNextDailyFeature(): Partial<ScraperFeature> | null {
  const now = new Date()
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000)
  const index = dayOfYear % DAILY_FEATURES.length
  return DAILY_FEATURES[index]
}

// Get all features that should be enabled today
export function getTodaysFeatures(): Partial<ScraperFeature>[] {
  const now = new Date()
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000)
  const features: Partial<ScraperFeature>[] = []

  // Enable one new feature per day
  for (let i = 0; i <= dayOfYear && i < DAILY_FEATURES.length; i++) {
    features.push({
      ...DAILY_FEATURES[i],
      enabled: true,
      addedDate: now.toISOString().split('T')[0],
      version: '1.0',
    })
  }

  return features
}

// Get update log
export function getUpdateLog(): { date: string; feature: string; icon: string }[] {
  const log: { date: string; feature: string; icon: string }[] = []
  const now = new Date()

  for (let i = 0; i < DAILY_FEATURES.length; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - (DAILY_FEATURES.length - i))
    log.push({
      date: date.toISOString().split('T')[0],
      feature: DAILY_FEATURES[i].name || 'Unknown',
      icon: DAILY_FEATURES[i].icon || '🔧',
    })
  }

  return log
}

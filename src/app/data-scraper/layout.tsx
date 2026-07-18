import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Data Scraper | Infinite Gundawar Business Private Limited',
  description: 'Ethical business data scraper for leads, properties and market research — generate real prospecting datasets.',
  keywords: ['data scraper', 'lead generation', 'web scraping', 'market research'],
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

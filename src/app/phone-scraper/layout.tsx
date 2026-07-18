import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Phone & Contact Scraper | Infinite Gundawar Business Private Limited',
  description: 'Ethical contact and phone scraper to build verified business contact lists for outreach.',
  keywords: ['phone scraper', 'contact scraper', 'business contacts', 'lead lists'],
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

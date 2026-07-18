import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Property Finder | Infinite Gundawar Business Private Limited',
  description: 'Find residential and commercial properties with filters across Indian cities and export shortlists.',
  keywords: ['property finder', 'real estate', 'buy property', 'commercial property'],
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

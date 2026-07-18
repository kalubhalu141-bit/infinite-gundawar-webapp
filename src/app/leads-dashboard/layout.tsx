import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Leads Dashboard | Infinite Gundawar Business Private Limited',
  description: 'Commercial lead analytics dashboard with search, source and city filtering and CSV export.',
  keywords: ['leads dashboard', 'lead analytics', 'prospecting', 'csv export'],
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

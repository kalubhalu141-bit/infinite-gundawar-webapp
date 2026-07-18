import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lead Dashboard | Infinite Gundawar Business Private Limited',
  description: 'Manage and analyse your business leads with filters, stats and export — built for sales teams.',
  keywords: ['lead dashboard', 'crm', 'lead management', 'sales analytics'],
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Tools Directory | Infinite Gundawar Business Private Limited',
  description: 'Explore a curated directory of free AI tools for business, marketing, career growth and everyday productivity.',
  keywords: ['ai tools', 'free ai', 'business ai', 'productivity tools'],
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

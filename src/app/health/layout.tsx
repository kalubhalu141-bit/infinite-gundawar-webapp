import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Health & Wellness | Infinite Gundawar Business Private Limited',
  description: 'Health and wellness guidance powered by real herb and disease databases for informed natural living.',
  keywords: ['health', 'wellness', 'herbs', 'disease database', 'natural health'],
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Career Opportunities | Infinite Gundawar Business Private Limited',
  description: 'Global career opportunities, free career counselling and professional certification guidance across industries.',
  keywords: ['careers', 'jobs', 'career counselling', 'certification', 'employment'],
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

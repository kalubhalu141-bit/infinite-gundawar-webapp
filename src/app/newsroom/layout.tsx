import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Newsroom | Infinite Gundawar Business Private Limited',
  description: 'Company news, press and announcements from Infinite Gundawar Business Private Limited.',
  keywords: ['newsroom', 'press', 'company news', 'announcements'],
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

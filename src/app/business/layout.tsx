import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Business Services | Infinite Gundawar Business Private Limited',
  description: 'End-to-end business services — infrastructure, trading, education and digital marketing under one roof for Indian and global enterprises.',
  keywords: ['business services', 'sme', 'enterprise', 'infrastructure', 'trading'],
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

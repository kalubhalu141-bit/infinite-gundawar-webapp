import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Email Sender | Infinite Gundawar Business Private Limited',
  description: 'Bulk email sender for campaigns and newsletters with verification and delivery tracking.',
  keywords: ['email marketing', 'bulk email', 'newsletter', 'campaigns'],
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

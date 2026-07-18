import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Digital Marketing | Infinite Gundawar Business Private Limited',
  description: 'Digital marketing and advertising services — SEO, social media, branding and campaign management.',
  keywords: ['digital marketing', 'seo', 'social media', 'branding', 'advertising'],
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

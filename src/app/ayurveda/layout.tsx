import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ayurveda & Wellness | Infinite Gundawar Business Private Limited',
  description: 'Authentic Ayurvedic herbs, remedies and doctor directory. Search 10,000+ indexed herbs and find verified Ayurvedic practitioners across India.',
  keywords: ['ayurveda', 'herbal remedies', 'ayurvedic doctor', 'wellness', 'herbs'],
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

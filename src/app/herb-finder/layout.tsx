import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Herb Finder | Infinite Gundawar Business Private Limited',
  description: 'Find Ayurvedic herbs by symptom or use case with our free on-device semantic herb search.',
  keywords: ['herb finder', 'ayurvedic herbs', 'herbal search', 'natural remedies'],
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

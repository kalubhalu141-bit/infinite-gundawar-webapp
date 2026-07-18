import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Business Calculators | Infinite Gundawar Business Private Limited',
  description: 'Free business calculators — pricing, ROI, GST, margins and profitability tools for entrepreneurs and finance teams.',
  keywords: ['business calculators', 'roi calculator', 'gst', 'margin calculator'],
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

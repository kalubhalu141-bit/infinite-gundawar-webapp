import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Investment & Trading | Infinite Gundawar Business Private Limited',
  description: 'Investment insights, trading patterns and market strategies with real documented pattern library.',
  keywords: ['investment', 'trading', 'stock market', 'trading patterns', 'wealth'],
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

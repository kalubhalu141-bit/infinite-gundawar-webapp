import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Financial Tools & Calculators | Infinite Gundawar',
  description: 'Free financial calculators, investment tools, stock market insights, and wealth management resources. Plan your financial future with our comprehensive tools.',
  keywords: ['financial calculators', 'investment tools', 'stock market', 'wealth management', 'loan calculator'],
}

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

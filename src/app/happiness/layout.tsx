import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Happiness & Wellbeing | Infinite Gundawar Business Private Limited',
  description: 'Happiness and life-balance resources — daily insights, mindfulness and wellbeing tools.',
  keywords: ['happiness', 'wellbeing', 'mindfulness', 'life balance'],
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

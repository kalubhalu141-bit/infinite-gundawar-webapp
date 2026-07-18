import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Happiness Hub | Infinite Gundawar Business Private Limited',
  description: 'Your hub for happiness, gratitude and personal growth with daily prompts and tracking.',
  keywords: ['happiness hub', 'gratitude', 'personal growth', 'wellbeing'],
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

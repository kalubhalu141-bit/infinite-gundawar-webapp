import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Education & Coaching | Infinite Gundawar Business Private Limited',
  description: 'Skill development, competitive exam coaching and professional certification programs for students and professionals.',
  keywords: ['education', 'coaching', 'competitive exam', 'skill development', 'certification'],
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

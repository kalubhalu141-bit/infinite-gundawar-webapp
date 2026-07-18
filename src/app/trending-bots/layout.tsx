import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trending Bots | Infinite Gundawar Business Private Limited',
  description: 'Trending AI bots and tools updated regularly — discover what is popular in AI right now.',
  keywords: ['trending bots', 'ai bots', 'trending ai', 'ai tools'],
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

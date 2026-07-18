import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Web Deep-Dive | Infinite Gundawar',
  description: 'Ask anything and get a free on-device AI summary with cited live web sources. Real web search + private, key-less AI research.',
  keywords: ['ai research', 'web search ai', 'free ai', 'on-device ai', 'cited sources', 'deep dive'],
}

export default function AIResearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

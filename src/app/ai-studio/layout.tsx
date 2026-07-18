import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Studio | Infinite Gundawar Business Private Limited',
  description: 'Free on-device AI studio — sentiment, translation, summarizer, voice and semantic search running privately in your browser with zero API keys.',
  keywords: ['ai studio', 'on-device ai', 'free ai tools', 'transformers.js', 'webgpu'],
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

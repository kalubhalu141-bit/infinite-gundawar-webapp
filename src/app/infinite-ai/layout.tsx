import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Infinite AI Suite | Infinite Gundawar Business Private Limited',
  description: 'The Infinite AI suite — 14+ free on-device AI tools for business, powered by Hugging Face transformers.js. No keys, fully private.',
  keywords: ['infinite ai', 'free ai suite', 'on-device ai', 'private ai', 'transformers.js'],
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

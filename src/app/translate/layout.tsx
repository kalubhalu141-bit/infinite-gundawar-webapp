import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Universal Translator | Infinite Gundawar',
  description: 'Free, key-less translation across 15 languages. Built on the on-device/free-AI stack — no cost, no API keys.',
  keywords: ['free translator', 'translate hindi english', 'marathi translator', 'no api key translation', 'ai translate'],
}

export default function TranslateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

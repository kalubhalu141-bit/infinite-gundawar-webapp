import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Symptom Checker | Infinite Gundawar',
  description: 'Free on-device AI symptom checker — describe your symptoms and get likely Ayurvedic conditions, herbs, remedies and red-flag guidance privately in your browser. Educational wellness tool.',
  keywords: ['ai symptom checker', 'ayurvedic diagnosis', 'symptom analyzer', 'herb recommendation', 'free health ai', 'on-device ai'],
}

export default function DiagnoseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Doctors Directory | Infinite Gundawar',
  description: 'Search real Ayurvedic doctors across India by country, state, district, city and specialty. Live-gathered directory with on-device AI symptom-to-specialty routing. Discovery only.',
  keywords: ['ayurvedic doctors', 'doctor directory india', 'find doctor', 'BAMS doctor', 'ayurveda clinic', 'free ai search'],
}

export default function DoctorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

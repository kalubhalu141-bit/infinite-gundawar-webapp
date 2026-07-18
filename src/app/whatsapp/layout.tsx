import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WhatsApp Business Tools | Infinite Gundawar Business Private Limited',
  description: 'WhatsApp business messaging tools for notifications, broadcasts and customer engagement.',
  keywords: ['whatsapp business', 'whatsapp api', 'customer engagement', 'broadcasts'],
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

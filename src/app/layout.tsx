import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Infinite Gundawar Business Private Limited | Infrastructure, Trading, Education & Marketing',
  description: 'Infinite Gundawar Business Private Limited - Leading infrastructure developers, import/export traders, educational coaching providers, and digital marketing experts based in Maharashtra, India.',
  keywords: ['infrastructure', 'real estate', 'import export', 'trading', 'coaching', 'education', 'digital marketing', 'Maharashtra', 'India'],
  authors: [{ name: 'Infinite Gundawar Business Private Limited' }],
  openGraph: {
    title: 'Infinite Gundawar Business Private Limited',
    description: 'Leading infrastructure developers, import/export traders, educational coaching providers, and digital marketing experts.',
    type: 'website',
    locale: 'en_IN',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <script src="/ai.js" defer></script>
      </body>
    </html>
  )
}

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
    siteName: 'Infinite Gundawar Business Private Limited',
    url: 'https://infinite-gundawar-webapp.vercel.app',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'Infinite Gundawar Business Private Limited' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Infinite Gundawar Business Private Limited',
    description: 'Infrastructure, import/export trading, education, digital marketing & free on-device AI — Maharashtra, India.',
    images: ['/api/og'],
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

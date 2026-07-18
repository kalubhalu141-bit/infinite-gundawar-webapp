import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Interior Design & Planning | Infinite Gundawar Business Private Limited',
  description: 'AI-assisted interior design, 3D home layouts and Vastu-compliant planning for homes and offices.',
  keywords: ['interior design', '3d home design', 'vastu', 'home planner', 'interiors'],
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

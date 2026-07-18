// src/components/PageEnhancements.tsx — drop-in pro touches for every page.
// Renders the scroll-progress bar + the daily free-AI insight strip so the
// whole site shares the home page's premium, "improves daily" experience.
'use client'
import { ScrollProgress, } from './ui'
import DailyInsight from './DailyInsight'

export default function PageEnhancements() {
  return (
    <>
      <ScrollProgress />
      <DailyInsight />
    </>
  )
}

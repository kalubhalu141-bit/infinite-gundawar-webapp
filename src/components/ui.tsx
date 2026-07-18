// src/components/ui.tsx — Pro design primitives for Infinite Gundawar
// Reusable, premium building blocks shared across every page so the whole
// site inherits one cohesive "pro" system. Pure presentational components.
'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/* ─── Scroll progress bar (top of viewport) ─── */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight || 1)
      if (ref.current) ref.current.style.transform = `scaleX(${scrolled})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 60,
        transform: 'scaleX(0)',
        transformOrigin: '0 50%',
        background: 'linear-gradient(90deg,#1e3a5f,#2c5282,#d4a843)',
        transition: 'transform 80ms linear',
      }}
    />
  )
}

/* ─── Section heading (eyebrow + title + subtitle) ─── */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'center' | 'left'
}) {
  return (
    <div className={align === 'center' ? 'text-center mb-14 mx-auto max-w-2xl' : 'mb-14 max-w-2xl'}>
      {eyebrow && (
        <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wide uppercase rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f]">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">{subtitle}</p>}
    </div>
  )
}

/* ─── ProCard (glass/elevated surface with hover lift) ─── */
export function ProCard({
  children,
  className = '',
  hover = true,
}: {
  children: ReactNode
  className?: string
  hover?: boolean
}) {
  return (
    <div
      className={`rounded-3xl border border-gray-100 bg-white/80 shadow-sm backdrop-blur-sm ${
        hover ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#1e3a5f]/10' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

/* ─── Stat (big number + label) ─── */
export function Stat({ value, label, icon }: { value: string; label: string; icon?: ReactNode }) {
  return (
    <div className="text-center rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#2c5282] px-5 py-7 text-white shadow-lg">
      {icon && <div className="mb-2 text-2xl">{icon}</div>}
      <div className="text-3xl font-extrabold text-[#d4a843] sm:text-4xl">{value}</div>
      <div className="mt-1 text-sm text-white/80">{label}</div>
    </div>
  )
}

/* ─── Badge (pill) ─── */
export function Badge({ children, tone = 'gold' }: { children: ReactNode; tone?: 'gold' | 'navy' | 'cyan' }) {
  const tones: Record<string, string> = {
    gold: 'bg-[#d4a843]/15 text-[#9a7a1f] border-[#d4a843]/30',
    navy: 'bg-[#1e3a5f]/10 text-[#1e3a5f] border-[#1e3a5f]/20',
    cyan: 'bg-cyan-500/15 text-cyan-700 border-cyan-400/30',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${tones[tone]}`}>
      {children}
    </span>
  )
}

/* ─── EngineStatusPill — shows which free AI tier is live ─── */
export function EngineStatusPill({ engine }: { engine?: string }) {
  const live = !!engine && engine !== 'fallback' && engine !== 'local'
  return (
    <Badge tone={live ? 'cyan' : 'gold'}>
      <span className={`w-1.5 h-1.5 rounded-full ${live ? 'bg-cyan-500' : 'bg-[#d4a843]'}`} />
      {live ? `AI: ${engine}` : 'AI: On-device'}
    </Badge>
  )
}

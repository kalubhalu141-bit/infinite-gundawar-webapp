'use client'

import { Breadcrumb } from '@/components/LoadingStates'

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: { label: string; href?: string }[]
  gradient?: string
}

export default function PageHeader({ title, subtitle, breadcrumbs, gradient = 'from-[#1e3a5f] to-[#2c5282]' }: PageHeaderProps) {
  return (
    <section className={`relative pt-28 pb-16 bg-gradient-to-br ${gradient} overflow-hidden`}>
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#d4a843] rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">{title}</h1>
        {subtitle && <p className="text-lg text-white/70 max-w-2xl">{subtitle}</p>}
      </div>
    </section>
  )
}

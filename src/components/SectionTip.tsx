// src/components/SectionTip.tsx — compact "Tip of the day" for any section.
// Pulls a topic-relevant, REAL curated (or free-AI-expanded) insight from
// /api/insight?topic=... so every pillar page gets its own daily, improving tip.
'use client'
import { useEffect, useState } from 'react'

export default function SectionTip({ topic, label = 'Tip of the Day' }: { topic: string; label?: string }) {
  const [data, setData] = useState<{ title?: string; insight?: string; action?: string; aiLive?: boolean } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 20000)
    fetch(`/api/insight?topic=${encodeURIComponent(topic)}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => active && setData(d))
      .catch(() => {})
      .finally(() => {
        clearTimeout(t)
        active && setLoading(false)
      })
    return () => {
      active = false
      ctrl.abort()
    }
  }, [topic])

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 mb-8">
        <div className="skeleton h-4 w-1/3 rounded mb-2" />
        <div className="skeleton h-3 w-full rounded" />
      </div>
    )
  }
  if (!data) return null

  return (
    <div className="rounded-2xl border border-[#1e3a5f]/15 bg-gradient-to-br from-[#1e3a5f]/5 to-[#d4a843]/5 p-5 mb-8">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#d4a843]">{label}</span>
        {data.aiLive && <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-700">AI</span>}
      </div>
      <h4 className="font-bold text-[#0f172a] mb-1">{data.title}</h4>
      <p className="text-sm text-gray-600 leading-relaxed">{data.insight}</p>
      {data.action && <p className="text-xs text-[#1e3a5f] font-medium mt-2">✓ {data.action}</p>}
    </div>
  )
}

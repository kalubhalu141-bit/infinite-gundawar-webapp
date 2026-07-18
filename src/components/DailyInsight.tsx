'use client'
import { useEffect, useState } from 'react'
import { Badge } from './ui'

interface Insight {
  ok: boolean
  dayKey: string
  category: string
  title: string
  insight: string
  action: string
  sourceLabel: string
  engine: string
  aiLive: boolean
}

export default function DailyInsight() {
  const [data, setData] = useState<Insight | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [now, setNow] = useState('')

  const load = () => {
    setLoading(true)
    setError(false)
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 22000)
    fetch('/api/insight', { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => {
        if (!d?.ok) throw new Error('bad')
        setData(d)
      })
      .catch(() => setError(true))
      .finally(() => {
        clearTimeout(t)
        setLoading(false)
      })
  }

  useEffect(() => {
    setNow(new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="relative py-16 overflow-hidden bg-aurora">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-[#d4a843] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold tracking-wide uppercase rounded-full bg-white/10 text-[#d4a843] border border-white/15 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] animate-pulse" /> Insight of the Day
          </span>
          <span className="text-xs text-white/60 hidden sm:block">{now}</span>
        </div>

        <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md p-7 sm:p-9 shadow-2xl">
          {loading && (
            <div className="space-y-4">
              <div className="skeleton h-6 w-1/3 rounded-lg" />
              <div className="skeleton h-4 w-full rounded-lg" />
              <div className="skeleton h-4 w-11/12 rounded-lg" />
              <div className="skeleton h-4 w-2/3 rounded-lg" />
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-6">
              <p className="text-white/70 mb-4">Couldn’t load today’s insight.</p>
              <button onClick={load} className="px-5 py-2.5 rounded-xl bg-[#d4a843] text-[#1e3a5f] font-semibold text-sm hover:bg-[#ecc94b] transition">
                Retry
              </button>
            </div>
          )}

          {data && !loading && (
            <>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Badge tone={data.aiLive ? 'cyan' : 'gold'}>
                  {data.aiLive ? `AI · ${data.engine}` : 'Curated'}
                </Badge>
                <span className="text-xs text-white/60">{data.category}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">{data.title}</h3>
              <p className="text-white/85 leading-relaxed text-base sm:text-lg whitespace-pre-line">{data.insight}</p>
              <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
                <span className="text-sm text-[#d4a843] font-medium">✓ {data.action}</span>
                <span className="text-[11px] text-white/40">{data.sourceLabel}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

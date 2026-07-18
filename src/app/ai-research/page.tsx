'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { deviceType, translateEnToHi } from '@/lib/onDeviceAI'

interface Result { title: string; url: string; snippet: string; type?: string }
interface DeepDive { query: string; summary: string; results: Result[]; total: number }

// Offline extractive "deep dive": scores each source's sentences by overlap with
// the query + other sources, returns the top sentences as key facts. No network.
function extractFacts(query: string, results: Result[], k = 3): string[] {
  const qWords = new Set(query.toLowerCase().split(/\W+/).filter(w => w.length > 2))
  const allSents: { text: string; score: number; src: string }[] = []
  for (const r of results) {
    const sents = (r.snippet || '').split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.length > 30)
    for (const s of sents) {
      const w = s.toLowerCase()
      let score = 0
      for (const qw of qWords) if (w.includes(qw)) score += 3
      // overlap with other snippets (cross-source corroboration)
      for (const r2 of results) {
        if (r2 === r) continue
        for (const qw of new Set(r2.snippet.toLowerCase().split(/\W+/).filter(x => x.length > 4)))
          if (w.includes(qw)) score += 0.5
      }
      if (score > 0) allSents.push({ text: s, score, src: r.title })
    }
  }
  return allSents.sort((a, b) => b.score - a.score).slice(0, k).map(x => x.text)
}

export default function AIResearchPage() {
  const [q, setQ] = useState('')
  const [type, setType] = useState('general')
  const [data, setData] = useState<DeepDive | null>(null)
  const [loading, setLoading] = useState(false)
  const [facts, setFacts] = useState<string[]>([])
  const [lang, setLang] = useState<'en' | 'hi'>('en')
  const [err, setErr] = useState('')
  const device = deviceType()

  const run = async () => {
    if (!q.trim()) return
    setLoading(true); setErr(''); setData(null); setFacts([])
    try {
      let query = q
      if (lang === 'hi') { try { query = await translateEnToHi(q) } catch { /* send as-is */ } }
      const res = await fetch('/api/web-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, type, limit: 8 }),
      })
      const d = await res.json()
      if (d.error) { setErr(d.message || d.error); return }
      setData(d)
      setFacts(extractFacts(query, d.results || [], 4))
    } catch (e) { setErr('Search failed — check network.') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-aurora-x">
      <Navbar />
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-[#d4a843] text-sm font-medium mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
            🔬 AI Web Deep-Dive · Real web search + on-device AI · {device === 'webgpu' ? 'WebGPU' : 'WASM'}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 leading-tight">
            Deep <span className="text-gradient text-glow">Research</span> with Free AI
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Ask anything. The app searches the live web, then an on-device AI summarizes and cites the
            sources — no API keys, fully private.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-5 glow-gold mb-6">
          <div className="flex gap-2">
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && run()}
              placeholder="e.g. benefits of Ashwagandha for stress, or Ayurveda for diabetes"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#d4a843] text-sm text-[#0f172a]"
            />
            <select value={type} onChange={e => setType(e.target.value)}
              className="px-3 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#0f172a]">
              <option value="general">General</option>
              <option value="news">News</option>
              <option value="hospital">Health</option>
              <option value="business">Business</option>
              <option value="school">Education</option>
            </select>
            <button onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')} className="px-3 py-3 rounded-xl bg-[#1e3a5f]/10 text-[#1e3a5f] text-sm font-semibold">{lang === 'en' ? 'EN' : 'हि'}</button>
          </div>
          <button onClick={run} disabled={loading} className="btn-ai w-full mt-3 disabled:opacity-50">
            {loading ? '⏳ Searching the web…' : '🚀 Deep Dive'}
          </button>
        </div>

        {err && <p className="text-red-400 text-sm text-center">{err}</p>}

        {data && (
          <>
            {/* AI Summary */}
            <div className="glass-card rounded-2xl p-6 glow-navy mb-5">
              <h2 className="text-[#d4a843] font-bold text-sm mb-2">🤖 AI Summary</h2>
              <p className="text-white/90 leading-relaxed">{data.summary}</p>
            </div>

            {/* On-device key facts */}
            {facts.length > 0 && (
              <div className="glass-card rounded-2xl p-6 mb-5">
                <h2 className="text-[#d4a843] font-bold text-sm mb-2">🔑 Key facts (extracted on-device)</h2>
                <ul className="space-y-2">
                  {facts.map((f, i) => <li key={i} className="text-white/85 text-sm flex gap-2"><span className="text-[#d4a843]">•</span>{f}</li>)}
                </ul>
              </div>
            )}

            {/* Cited sources */}
            <h3 className="text-white font-semibold mb-3">📚 Sources ({data.total})</h3>
            <div className="space-y-3">
              {data.results.map((r, i) => (
                <a key={i} href={r.url} target="_blank" rel="noreferrer"
                  className="block glass rounded-xl p-4 hover:border-[#d4a843] transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#1e3a5f]/15 text-[#1e3a5f]">{r.type || 'web'}</span>
                    <h4 className="font-semibold text-[#0f172a] text-sm truncate">{r.title}</h4>
                  </div>
                  <p className="text-[#1e3a5f]/70 text-xs line-clamp-3">{r.snippet}</p>
                  {r.url && <p className="text-[#d4a843] text-[10px] mt-1 truncate">{r.url}</p>}
                </a>
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}

'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const LANGS = [
  { code: 'en', name: 'English' }, { code: 'hi', name: 'Hindi' }, { code: 'mr', name: 'Marathi' },
  { code: 'gu', name: 'Gujarati' }, { code: 'bn', name: 'Bengali' }, { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' }, { code: 'kn', name: 'Kannada' }, { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' }, { code: 'de', name: 'German' }, { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' }, { code: 'ja', name: 'Japanese' }, { code: 'ko', name: 'Korean' },
]

export default function TranslatePage() {
  const [text, setText] = useState('')
  const [from, setFrom] = useState('en')
  const [to, setTo] = useState('hi')
  const [out, setOut] = useState('')
  const [loading, setLoading] = useState(false)
  const [src, setSrc] = useState('')

  const run = async () => {
    if (!text.trim()) return
    setLoading(true); setOut(''); setSrc('')
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, from, to }),
      })
      const d = await res.json()
      setOut(d.translated || '')
      setSrc(d.source || '')
    } catch { setOut('Translation failed.') }
    setLoading(false)
  }

  const swap = () => { setFrom(to); setTo(from); setText(out); setOut('') }

  return (
    <div className="min-h-screen bg-aurora-x">
      <Navbar />
      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-[#d4a843] text-sm font-medium mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
            🌐 Universal Translator · Free API · No keys
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 leading-tight">
            Translate <span className="text-gradient text-glow">Anything</span>
          </h1>
          <p className="text-white/70 max-w-xl mx-auto">
            Translate text across 15 languages using a free, key-less translation API. Built on the
            on-device/free-AI stack — no cost, no lock-in.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-5 glow-gold space-y-4">
          <div className="flex items-center gap-3">
            <select value={from} onChange={e => setFrom(e.target.value)} className="flex-1 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-[#0f172a]">
              {LANGS.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
            </select>
            <button onClick={swap} className="px-3 py-2 rounded-xl bg-[#1e3a5f]/10 text-[#1e3a5f] text-lg" title="Swap">⇄</button>
            <select value={to} onChange={e => setTo(e.target.value)} className="flex-1 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-[#0f172a]">
              {LANGS.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
            </select>
          </div>

          <textarea value={text} onChange={e => setText(e.target.value)} rows={4}
            placeholder="Type text to translate…"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/80 outline-none focus:border-[#d4a843] text-[#0f172a] resize-none" />

          <button onClick={run} disabled={loading || !text.trim()} className="btn-ai w-full disabled:opacity-50">
            {loading ? '⏳ Translating…' : '🌐 Translate'}
          </button>

          {out && (
            <div className="rounded-2xl bg-white/95 p-4 border border-[#d4a843]/40">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-[#1e3a5f]">Translation</span>
                {src && <span className="text-[10px] text-[#2c5282]/60">via {src}</span>}
              </div>
              <p className="text-[#0f172a] leading-relaxed">{out}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  analyzeSentiment, translateEnToHi, translateHiToEn, textToSpeech,
  deviceType, type ModelStatus, getPipeline,
} from '@/lib/onDeviceAI'
import { IntentClassifier, type IntentSample, lexiconSentiment, translateOffline } from '@/lib/clientML'
import { HERBS } from '@/lib/herbs-real'

/* ───────────────────────────────────────────────────────────────────────────
   AIConcierge — ONE unified, on-device AI assistant for the whole site.
   • Loads a REAL transformers.js model in-browser (WebGPU → WASM) with a live
     progress bar — no API keys, fully private.
   • Upgrades replies with neural sentiment + translation + voice when ready.
   • Routes questions with an offline TF-IDF intent classifier + company KB.
   • Replaces the old AIChatbot + SmartAIAssistant widgets (one clean UX).
   ─────────────────────────────────────────────────────────────────────────── */

interface Msg { id: number; role: 'user' | 'bot'; text: string; meta?: string }

const KB: { intent: string; keywords: string[]; answer: () => string }[] = [
  { intent: 'Infrastructure', keywords: ['infrastructure', 'construction', 'township', 'bot', 'bridge', 'road', 'warehouse', 'building', 'nirman'],
    answer: () => '🏗️ **Infrastructure & Construction** — Residential & commercial projects, townships, BOT contracts, roads, bridges & industrial warehouses across Maharashtra.\n✅ RERA-registered • On-time delivery\n📞 +91 79721 40672' },
  { intent: 'Real Estate', keywords: ['real estate', 'property', 'plot', 'land', 'villa', 'apartment', 'flat', 'house', 'sampatti', 'जमीन'],
    answer: () => '🏠 **Real Estate** — Premium plots, villas, apartments & commercial spaces in Pune, Nagpur, Nashik, Aurangabad & Mumbai.\n📈 15–40% appreciation • RERA-compliant\n📞 +91 79721 40672' },
  { intent: 'Trading', keywords: ['import', 'export', 'trade', 'trading', 'global', 'logistics', 'customs', 'buyer', 'vyapar'],
    answer: () => '🌐 **Import/Export Trading** — Consumer goods, electronics, industrial products & commodities. Buyer network in 15+ countries.\n📦 Logistics • Trade finance (L/C)\n📞 +91 79721 40672' },
  { intent: 'Ayurveda', keywords: ['ayurved', 'herb', 'herbal', 'health', 'wellness', 'dosha', 'immunity', 'जड़ी', 'swasthya'],
    answer: () => `🌿 **Ayurveda & Wellness** — ${HERBS.length}+ real herbs with benefits & dosage. Popular: Ashwagandha (stress), Tulsi (immunity), Arjuna (heart). Ask "herb for ___". Open /ayurveda. 📞 +91 79721 40672` },
  { intent: 'Finance', keywords: ['finance', 'stock', 'invest', 'mutual fund', 'portfolio', 'tax', 'nivesh', 'share'],
    answer: () => '📈 **Finance & Trading** — Stock guidance, portfolio management, 73 real trading patterns, tax & mutual-fund advice. Open /finance. 📞 +91 79721 40672' },
  { intent: 'Career', keywords: ['career', 'job', 'hiring', 'work', 'recruit', 'resume', 'naukri', 'करियर'],
    answer: () => '💼 **Career** — Engineers, sales, marketers, analysts, HR, ayurvedic consultants. 📧 talenthebhai123@gmail.com • 📞 +91 79721 40672' },
  { intent: 'Marketing', keywords: ['marketing', 'seo', 'social media', 'brand', 'digital', 'advertising'],
    answer: () => '📣 **Digital Marketing** — SEO, social media, branding, campaigns. End-to-end growth. 📞 +91 79721 40672' },
  { intent: 'Interior', keywords: ['interior', 'design', 'tile', 'kitchen', 'furniture', 'decor', 'vastu'],
    answer: () => '🛋️ **Interior Design** — Wholesale tiles, modular kitchens, lighting, 3D layouts, Vastu planning. 📞 +91 79721 40672' },
  { intent: 'Education', keywords: ['education', 'course', 'coaching', 'learn', 'training', 'skill', 'exam', 'shiksha'],
    answer: () => '📚 **Education & Coaching** — Competitive exams, digital marketing, web dev, trading & Ayurveda. Practical + certification. 📞 +91 79721 40672' },
]

const SAMPLES: IntentSample[] = KB.map(k => ({ text: k.keywords.join(' '), label: k.intent }))
const classifier = new IntentClassifier(SAMPLES)

const COMPANY = `Infinite Gundawar Business Private Limited — Maharashtra, India. Verticals: infrastructure, real estate, import/export trading, Ayurveda, finance, education, interior design, digital marketing & free on-device AI. 📞 +91 79721 40672.`

function buildAnswer(q: string): string {
  const lower = q.toLowerCase()
  if (/herb|herbal|जड़ी|ayush/.test(lower)) {
    const parts = q.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean)
    const match = HERBS.map(h => {
      const text = `${h.name} ${h.botanical} ${(h.benefits || []).join(' ')} ${(h.uses || []).join(' ')}`.toLowerCase()
      return { h, score: parts.filter(w => text.includes(w)).length }
    }).filter(x => x.score > 0).sort((a, b) => b.score - a.score)[0]
    if (match) return `🌿 **${match.h.name}** (${match.h.sanskrit}, ${match.h.botanical})\nBenefits: ${(match.h.benefits || []).join(', ')}\nUses: ${(match.h.uses || []).join(', ')}\nDosage: ${match.h.dosage}\nPrecaution: ${match.h.precautions}`
  }
  const top = classifier.classify(q, 1)[0]
  const kb = KB.find(k => k.intent === top.label)
  if (kb && top.score > 0.02) return kb.answer()
  return `🙏 I'm the Infinite AI concierge. ${COMPANY}\nAsk about infrastructure, real estate, trading, Ayurveda, finance, careers, marketing, interior or education — in English or हिंदी. I run on-device (private, no keys).`
}

const QUICK = ['About the company', 'Real estate in Pune', 'Herb for stress', 'Start import-export', 'Careers', 'Ayurveda benefits']

export default function AIConcierge() {
  const [open, setOpen] = useState(false)
  const [lang, setLang] = useState<'en' | 'hi'>('en')
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [status, setStatus] = useState<ModelStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const device = deviceType()

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, typing])

  const greet = lang === 'hi'
    ? '🙏 नमस्कार! मैं Infinite Gundawar का AI सहायक हूँ। इन्फ्रास्ट्रक्चर, रियल एस्टेट, ट्रेडिंग, आयुर्वेद — कुछ भी पूछें।'
    : "🙏 Hi! I'm the Infinite AI concierge — on-device, private, no keys. Ask me anything about Infinite Gundawar."

  // Lazy-load a real model on first open so the UX shows genuine progress.
  const ensureModel = useCallback(async () => {
    if (status === 'ready' || status === 'loading') return
    setStatus('loading'); setProgress(5)
    try {
      await getPipeline('sentiment', (p: any) => {
        if (p?.status && p?.progress != null) setProgress(Math.round(p.progress))
      })
      setProgress(100); setStatus('ready')
    } catch {
      setStatus('error')
    }
  }, [status])

  const send = useCallback(async (text: string) => {
    const t = text.trim(); if (!t) return
    setMsgs(p => [...p, { id: Date.now(), role: 'user', text: t }])
    setInput(''); setTyping(true)
    ensureModel()

    const hindiChars = (t.match(/[ऀ-ॿ]/g) || []).length
    const isHi = hindiChars / Math.max(t.replace(/\s/g, '').length, 1) > 0.3
    const targetLang = isHi ? 'hi' : lang

    setTimeout(async () => {
      let answer = buildAnswer(t)
      let meta = 'offline'
      // Neural upgrade when a model is ready
      if (status === 'ready') {
        try {
          const s = await analyzeSentiment(t)
          meta = `neural · ${s.label} ${Math.round(s.score * 100)}%`
        } catch { /* keep offline */ }
      } else {
        const s = lexiconSentiment(t); meta = `offline · ${s.label}`
      }
      if (targetLang === 'hi') {
        try {
          const r = await translateEnToHi(answer); answer = r; meta += ' · hi'
        } catch {
          answer = translateOffline(answer, 'hi'); meta += ' · hi(offline)'
        }
      }
      setMsgs(p => [...p, { id: Date.now() + 1, role: 'bot', text: answer, meta }])
      setTyping(false)
    }, 450 + Math.random() * 500)
  }, [lang, status, ensureModel])

  const speak = async (text: string) => {
    try { setStatus('loading'); const blob = await textToSpeech(text); setAudioUrl(URL.createObjectURL(blob)); setStatus('ready') }
    catch { setStatus('error') }
  }

  const statusColor = status === 'ready' ? 'bg-emerald-400' : status === 'loading' ? 'bg-amber-400' : status === 'error' ? 'bg-rose-400' : 'bg-gray-400'
  const statusText = status === 'ready' ? 'Model ready · on-device' : status === 'loading' ? `Loading model… ${progress}%` : status === 'error' ? 'Model error · using offline ML' : 'Tap to load on-device AI'

  return (
    <>
      {!open && (
        <button onClick={() => { setOpen(true); ensureModel(); if (msgs.length === 0) setMsgs([{ id: 0, role: 'bot', text: greet }]) }}
          className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full btn-ai hover:scale-110 transition-transform shadow-2xl flex items-center justify-center"
          aria-label="Open AI concierge">
          <span className="text-2xl">♾️</span>
          <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${statusColor} border-2 border-white pulse-dot`} />
        </button>
      )}

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[390px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[calc(100vh-7rem)] glass-dark rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-aurora-x px-4 py-3 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">♾️</span>
              <div>
                <h3 className="font-bold text-sm text-white">Infinite AI Concierge</h3>
                <p className="text-[10px] text-white/70 flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${statusColor}`} /> {device === 'webgpu' ? '🚀 WebGPU' : '🧮 WASM'} · {statusText}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')} className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white">{lang === 'en' ? 'EN' : 'हि'}</button>
              <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">✕</button>
            </div>
          </div>

          {status === 'loading' && (
            <div className="px-4 pt-2"><div className="model-bar"><span style={{ width: `${progress}%` }} /></div></div>
          )}

          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#0b1220]/40">
            {msgs.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[86%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${m.role === 'user' ? 'bubble-user' : 'bubble-bot'}`}>
                  {m.text}
                  {m.role === 'bot' && m.meta && <div className="mt-1.5 text-[9px] text-slate-400">{m.meta}</div>}
                  {m.role === 'bot' && audioUrl && <div className="mt-2"><audio src={audioUrl} controls className="h-8" /></div>}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bubble-bot px-3.5 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1"><span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" /><span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} /><span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} /></div>
                </div>
              </div>
            )}
            {msgs.length <= 1 && (
              <div className="flex flex-wrap gap-1.5">
                {QUICK.map(q => <button key={q} onClick={() => send(q)} className="text-xs px-2.5 py-1.5 glass-card rounded-full text-slate-700 hover:border-[#d4a843] transition-all">{q}</button>)}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {msgs.length > 0 && msgs[msgs.length - 1]?.role === 'bot' && (
            <button onClick={() => speak(msgs[msgs.length - 1].text)} className="mx-3 mb-1 text-[11px] text-[#d4a843] hover:underline text-left">🔊 Speak this reply</button>
          )}

          <form onSubmit={e => { e.preventDefault(); send(input) }} className="p-2.5 border-t border-white/10 flex items-center gap-2 bg-[#0b1220]/60">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder={lang === 'hi' ? 'अपना सवाल लिखें…' : 'Ask anything…'}
              className="flex-1 px-3 py-2.5 bg-white/10 rounded-xl text-sm text-white placeholder-white/40 outline-none border border-white/10 focus:border-[#d4a843]" />
            <button type="submit" disabled={!input.trim()} className="w-10 h-10 rounded-xl btn-ai disabled:opacity-40">➤</button>
          </form>
          <p className="text-[9px] text-white/40 text-center pb-1.5">Powered by Infinite AI · private on-device models</p>
        </div>
      )}
    </>
  )
}

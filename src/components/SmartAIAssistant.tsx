'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  analyzeSentiment, translateEnToHi, translateHiToEn, textToSpeech,
  deviceType, type ModelStatus,
} from '@/lib/onDeviceAI'
import { lexiconSentiment, translateOffline, IntentClassifier, type IntentSample } from '@/lib/clientML'
import { HERBS } from '@/lib/herbs-real'

/* ───────────────────────────────────────────────────────────────────────────
   SmartAIAssistant — one universal, on-device AI helper for the WHOLE site.
   • Routes the user's question to the right answer using a real TF-IDF KNN
     intent classifier (instant, offline).
   • When a transformers.js model is loaded, it upgrades sentiment / translation
     / voice to genuine neural AI — automatically, no keys.
   • Always works (falls back to offline ML). Knows the company + real data.
   ─────────────────────────────────────────────────────────────────────────── */

interface Msg { id: number; role: 'user' | 'bot'; text: string }

// Offline knowledge base (real company facts + real data pointers)
const KB: { intent: string; keywords: string[]; answer: (q: string) => string }[] = [
  {
    intent: 'Infrastructure',
    keywords: ['infrastructure', 'construction', 'township', 'bot', 'bridge', 'road', 'warehouse', 'building', 'nirman', 'construction'],
    answer: () => '🏗️ **Infrastructure & Construction** — Infinite Gundawar handles residential & commercial projects, townships, BOT (Build-Operate-Transfer) contracts, roads, bridges and industrial warehouses across Maharashtra.\n\n✅ RERA-registered • On-time delivery • End-to-end project management\n\n📞 +91 79721 40672 to discuss a project.',
  },
  {
    intent: 'Real Estate',
    keywords: ['real estate', 'property', 'plot', 'land', 'villa', 'apartment', 'flat', 'house', 'sampatti', 'real estate', 'जमीन'],
    answer: () => '🏠 **Real Estate** — Premium plots, villas, apartments & commercial spaces in Pune, Nagpur, Nashik, Aurangabad & Mumbai.\n\n📈 15–40% appreciation in 3–5 yrs • Home-loan assistance • RERA-compliant • Clear title\n\n📞 +91 79721 40672 for current inventory.',
  },
  {
    intent: 'Trading',
    keywords: ['import', 'export', 'trade', 'trading', 'global', 'logistics', 'customs', 'buyer', 'vyapar', 'trade'],
    answer: () => '🌐 **Import/Export Trading** — Consumer goods, electronics, industrial products, agricultural commodities, technology & fashion. Established buyer network in 15+ countries.\n\n📦 Logistics • Trade finance (L/C) • Documentation\n\n📞 +91 79721 40672.',
  },
  {
    intent: 'Ayurveda',
    keywords: ['ayurved', 'ayurveda', 'herb', 'herbal', 'health', 'wellness', 'dosha', 'immunity', 'ayurved', 'जड़ी', 'swasthya'],
    answer: () => `🌿 **Ayurveda & Wellness** — ${HERBS.length}+ real herbs with benefits, dosage & precautions. Popular: Ashwagandha (stress/sleep), Tulsi (immunity), Arjuna (heart), Brahmi (memory).\n\nAsk “herb for ___” and I’ll match from the real database. Open /ayurveda for the full collection. 📞 +91 79721 40672.`,
  },
  {
    intent: 'Finance',
    keywords: ['finance', 'trading', 'stock', 'invest', 'mutual fund', 'portfolio', 'tax', 'money', 'nivesh', 'finance', 'share'],
    answer: () => '📈 **Finance & Trading** — Stock guidance, portfolio management, investment advisory & 73 real candlestick/trading patterns. Tax-saving & mutual-fund guidance.\n\nOpen /finance for patterns. 📞 +91 79721 40672.',
  },
  {
    intent: 'Career',
    keywords: ['career', 'job', 'hiring', 'work', 'recruit', 'salary', 'resume', 'naukri', 'career', 'करियर'],
    answer: () => '💼 **Career** — Open roles: construction engineers, sales executives, digital marketers, financial analysts, HR, ayurvedic consultants. Fast-growing company, learning culture.\n\n📧 talenthebhai123@gmail.com • 📞 +91 79721 40672.',
  },
  {
    intent: 'Marketing',
    keywords: ['marketing', 'seo', 'social media', 'brand', 'digital', 'advertising', 'marketing'],
    answer: () => '📣 **Digital Marketing** — SEO, social media, branding, market research & campaigns. End-to-end growth for your business.\n\n📞 +91 79721 40672.',
  },
  {
    intent: 'Interior',
    keywords: ['interior', 'design', 'tile', 'kitchen', 'furniture', 'decor', 'vastu', 'interior'],
    answer: () => '🛋️ **Interior Design** — Wholesale tiles, modular kitchens, lighting, bathroom fittings, paint & furniture. 3D layouts, Vastu-compliant planning.\n\n📞 +91 79721 40672.',
  },
  {
    intent: 'Education',
    keywords: ['education', 'course', 'coaching', 'learn', 'training', 'skill', 'exam', 'shiksha', 'education'],
    answer: () => '📚 **Education & Coaching** — Competitive-exam coaching, digital marketing, web dev, trading & Ayurveda studies. Practical training + certification.\n\n📞 +91 79721 40672.',
  },
  {
    intent: 'Legal',
    keywords: ['legal', 'company registration', 'gst', 'trademark', 'contract', 'compliance', 'kanuni'],
    answer: () => '⚖️ **Legal & Compliance** — Company registration, GST, trademark/IP, business contracts, employment law. Fully compliant operations.\n\n📞 +91 79721 40672.',
  },
]

const SAMPLES: IntentSample[] = KB.map(k => ({ text: k.keywords.join(' '), label: k.intent }))
const classifier = new IntentClassifier(SAMPLES)

const COMPANY = `Infinite Gundawar Business Private Limited — founded by Niraj Gundawar in Maharashtra, India. Verticals: infrastructure & real estate, import/export trading, Ayurveda & wellness, finance & trading education, education/coaching, interior design, digital marketing, and AI tools. Phone +91 79721 40672, email talenthebhai123@gmail.com, WhatsApp wa.me/917972140672.`

function buildAnswer(q: string): string {
  const lower = q.toLowerCase()
  // herb intent → real search
  if (/herb|herbal|जड़ी|ayush/.test(lower)) {
    const parts = q.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean)
    const match = HERBS.map(h => {
      const text = `${h.name} ${h.botanical} ${(h.benefits || []).join(' ')} ${(h.uses || []).join(' ')}`.toLowerCase()
      const score = parts.filter(w => text.includes(w)).length
      return { h, score }
    }).filter(x => x.score > 0).sort((a, b) => b.score - a.score)[0]
    if (match) return `🌿 **${match.h.name}** (${match.h.sanskrit}, ${match.h.botanical})\n\nBenefits: ${(match.h.benefits || []).join(', ')}\nUses: ${(match.h.uses || []).join(', ')}\nDosage: ${match.h.dosage}\nPrecaution: ${match.h.precautions}`
  }
  const top = classifier.classify(q, 1)[0]
  const kb = KB.find(k => k.intent === top.label)
  if (kb && top.score > 0.02) return kb.answer(q)
  return `I'm the Infinite AI assistant for Infinite Gundawar. 🏢\n\n${COMPANY}\n\nAsk me about infrastructure, real estate, trading, Ayurveda, finance, careers, marketing, interior design, education or legal — in English or हिंदी. I use on-device AI (no keys, private).`
}

export default function SmartAIAssistant() {
  const [open, setOpen] = useState(false)
  const [lang, setLang] = useState<'en' | 'hi'>('en')
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [status, setStatus] = useState<ModelStatus>('idle')
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const device = deviceType()

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, typing])

  const greet = lang === 'hi'
    ? '🙏 नमस्कार! मैं Infinite Gundawar का AI सहायक हूँ। इन्फ्रास्ट्रक्चर, रियल एस्टेट, ट्रेडिंग, आयुर्वेद, फाइनेंस — कुछ भी पूछें।'
    : "🙏 Hi! I'm the Infinite AI assistant. Ask me anything about Infinite Gundawar — infrastructure, real estate, trading, Ayurveda, finance, careers and more. I run on-device (no keys, private)."

  const send = useCallback(async (text: string) => {
    const t = text.trim()
    if (!t) return
    const userMsg: Msg = { id: Date.now(), role: 'user', text: t }
    setMsgs(p => [...p, userMsg])
    setInput(''); setTyping(true)

    // Detect language for response
    const hindiChars = (t.match(/[ऀ-ॿ]/g) || []).length
    const isHi = hindiChars / Math.max(t.replace(/\s/g, '').length, 1) > 0.3
    const targetLang = isHi ? 'hi' : lang

    setTimeout(() => {
      let answer = buildAnswer(t)
      if (targetLang === 'hi') {
        try {
          // Try neural translation; fall back to offline phrase dict
          setStatus('loading')
          translateEnToHi(answer).then(r => { setMsgs(p => [...p, { id: Date.now() + 1, role: 'bot', text: r }]); setStatus('ready') })
            .catch(() => { const r = translateOffline(answer, 'hi'); setMsgs(p => [...p, { id: Date.now() + 1, role: 'bot', text: r }]); setStatus('error') })
          setTyping(false)
          return
        } catch { answer = translateOffline(answer, 'hi') }
      }
      setMsgs(p => [...p, { id: Date.now() + 1, role: 'bot', text: answer }])
      setTyping(false)
    }, 500 + Math.random() * 600)
  }, [lang])

  const quick = ['Tell me about the company', 'Real estate in Pune', 'Herb for stress', 'Start import-export', 'Careers', 'Ayurveda benefits']

  const speak = async (text: string) => {
    try {
      setStatus('loading')
      const blob = await textToSpeech(text)
      setAudioUrl(URL.createObjectURL(blob)); setStatus('ready')
    } catch { setStatus('error') }
  }

  return (
    <>
      {!open && (
        <button onClick={() => { setOpen(true); if (msgs.length === 0) setMsgs([{ id: 0, role: 'bot', text: greet }]) }}
          className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-fuchsia-600 to-cyan-600 shadow-2xl flex items-center justify-center hover:scale-110 transition-transform">
          <span className="text-2xl">♾️</span>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse border-2 border-white" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-7rem)] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-fuchsia-600 to-cyan-600 p-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">♾️</span>
              <div>
                <h3 className="font-bold text-sm">Infinite AI Assistant</h3>
                <p className="text-[10px] text-white/80">{device === 'webgpu' ? '🚀 WebGPU' : '🧮 WASM'} · on-device · free</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold">{lang === 'en' ? 'EN' : 'हि'}</button>
              <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center">✕</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {msgs.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${m.role === 'user' ? 'bg-fuchsia-600 text-white rounded-br-md' : 'bg-white text-gray-700 border border-gray-100 rounded-bl-md shadow-sm'}`}>
                  {m.text}
                  {m.role === 'bot' && audioUrl && <div className="mt-2"><audio src={audioUrl} controls className="h-8" /></div>}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-white px-3 py-2 rounded-2xl rounded-bl-md border border-gray-100">
                  <div className="flex gap-1"><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" /><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} /><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} /></div>
                </div>
              </div>
            )}
            {msgs.length <= 1 && (
              <div className="flex flex-wrap gap-1.5">
                {quick.map(q => <button key={q} onClick={() => send(q)} className="text-xs px-2.5 py-1.5 bg-white border border-gray-100 rounded-full text-gray-600 hover:border-fuchsia-400 hover:bg-fuchsia-50 transition-all">{q}</button>)}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form onSubmit={e => { e.preventDefault(); send(input) }} className="p-2.5 bg-white border-t border-gray-100 flex items-center gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder={lang === 'hi' ? 'अपना सवाल लिखें…' : 'Ask anything…'}
              className="flex-1 px-3 py-2.5 bg-gray-50 rounded-xl text-sm outline-none border border-gray-100 focus:border-fuchsia-300" />
            <button type="submit" disabled={!input.trim()} className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-600 to-cyan-600 text-white flex items-center justify-center disabled:opacity-40">➤</button>
          </form>
          <p className="text-[9px] text-gray-400 text-center pb-1.5">Powered by Infinite AI · private on-device models</p>
        </div>
      )}
    </>
  )
}

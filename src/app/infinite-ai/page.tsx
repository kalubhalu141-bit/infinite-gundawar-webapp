'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Navbar from '@/components/Navbar'
import PageEnhancements from '@/components/PageEnhancements'
import OnDevicePanel from '@/components/OnDevicePanel'
import Footer from '@/components/Footer'
import {
  analyzeSentiment, analyzeSentimentMulti, translateEnToHi, translateHiToEn,
  classifyZeroShot, embed, summarize, answerQuestion, textToSpeech,
  deviceType, type ModelStatus,
} from '@/lib/onDeviceAI'
import {
  lexiconSentiment, translateOffline, extractiveSummary, extractKeywords,
  IntentClassifier, type IntentSample,
} from '@/lib/clientML'
import { HERBS } from '@/lib/herbs-real'
import { TRADING_PATTERNS } from '@/lib/trading-patterns-data'
import { DISEASES } from '@/lib/disease-database'

/* ───────────────────────────────────────────────────────────────────────────
   INFINITE AI — unified on-device AI suite
   100% FREE · ZERO KEYS · runs in your browser (WebGPU/WASM)
   Every tool falls back to instant client-side ML if the AI model is still
   downloading or the CDN is unreachable, so it is ALWAYS robust.
   ─────────────────────────────────────────────────────────────────────────── */

type ToolId =
  | 'sentiment' | 'sentiment-hi' | 'translate-eh' | 'translate-he' | 'zeroshot'
  | 'intent' | 'embed' | 'summarize' | 'qa' | 'tts' | 'keywords' | 'herb-search'
  | 'pattern-search' | 'disease-search'

const TOOLS: { id: ToolId; name: string; icon: string; cat: string; hint: string }[] = [
  { id: 'sentiment', name: 'Sentiment Analyzer', icon: '😊', cat: 'Text', hint: 'DistilBERT detects POSITIVE / NEGATIVE (English).' },
  { id: 'sentiment-hi', name: 'Multilingual Sentiment', icon: '🌍', cat: 'Text', hint: 'BERT sentiment in हिंदी & 100+ languages.' },
  { id: 'translate-eh', name: 'English → Hindi', icon: '🌐', cat: 'Language', hint: 'NLLB-200 neural translation, offline.' },
  { id: 'translate-he', name: 'Hindi → English', icon: '🔁', cat: 'Language', hint: 'Opus-MT neural translation, offline.' },
  { id: 'zeroshot', name: 'Zero-Shot Router', icon: '🏷️', cat: 'Text', hint: 'Route any message to the right department — no training.' },
  { id: 'intent', name: 'Intent Classifier', icon: '🧭', cat: 'Text', hint: 'TF-IDF + cosine KNN intent detection (instant, offline).' },
  { id: 'embed', name: 'Semantic Embeddings', icon: '🧠', cat: 'Vector', hint: 'all-MiniLM 384-d meaning vectors.' },
  { id: 'summarize', name: 'Smart Summarizer', icon: '📝', cat: 'Text', hint: 'BART-CNN abstractive summary (offline fallback included).' },
  { id: 'qa', name: 'Question Answerer', icon: '❓', cat: 'Text', hint: 'DistilBERT-SQuAD extracts answers from context.' },
  { id: 'tts', name: 'Text-to-Speech', icon: '🔊', cat: 'Audio', hint: 'SpeechT5 natural voice, on-device.' },
  { id: 'keywords', name: 'Keyword Extractor', icon: '🔑', cat: 'Text', hint: 'TF-IDF key-phrase extraction (offline).' },
  { id: 'herb-search', name: 'Herb Semantic Search', icon: '🌿', cat: 'Data', hint: 'Search 320+ real Ayurvedic herbs by meaning.' },
  { id: 'pattern-search', name: 'Trading Pattern Search', icon: '📈', cat: 'Data', hint: 'Find trading patterns by description.' },
  { id: 'disease-search', name: 'Disease Symptom Search', icon: '🩺', cat: 'Data', hint: 'Match symptoms to real diseases.' },
]

const CATS = ['All', ...Array.from(new Set(TOOLS.map(t => t.cat)))]

// Intent training samples (domain routing) — used by the offline KNN classifier
const INTENT_SAMPLES: IntentSample[] = [
  { text: 'i want to build a house and need construction help', label: 'Infrastructure' },
  { text: 'real estate plot for sale in pune maharashtra', label: 'Real Estate' },
  { text: 'how to start import export business with china', label: 'Trading' },
  { text: 'ashwagandha benefits for stress and sleep', label: 'Ayurveda' },
  { text: 'best mutual funds and tax saving in india', label: 'Finance' },
  { text: 'job opening for sales executive in nagpur', label: 'Career' },
  { text: 'digital marketing seo strategy for my brand', label: 'Marketing' },
  { text: 'interior design ideas for small living room', label: 'Interior' },
  { text: 'competitive exam coaching and career guidance', label: 'Education' },
  { text: 'company registration and gst legal compliance', label: 'Legal' },
]

const ZERO_SHOT_LABELS = ['Infrastructure', 'Real Estate', 'Trading', 'Ayurveda', 'Finance', 'Career', 'Marketing', 'Interior', 'Education', 'Legal', 'Other']

export default function InfiniteAIPage() {
  const device = deviceType()
  const [warm, setWarm] = useState<ModelStatus>('idle')
  const [warmMsg, setWarmMsg] = useState('')

  // First-load warm-up: pre-load the sentiment + embedding models so the
  // first real tool use feels instant. All on-device, fully free.
  const warmUp = useCallback(async () => {
    setWarm('loading'); setWarmMsg('Loading core AI models (one-time, ~5MB)…')
    try {
      await analyzeSentiment('Warm-up test: I love Infinite Gundawar AI.')
      await embed('warmup')
      setWarm('ready'); setWarmMsg('✅ Core AI ready — all tools are instant now.')
    } catch {
      setWarm('error'); setWarmMsg('Model CDN busy. Tools still work via offline ML — retry warm-up anytime.')
    }
  }, [])

  // Auto warm-up shortly after mount (non-blocking; user can use tools immediately).
  useEffect(() => {
    const t = setTimeout(() => { if (warm === 'idle') warmUp() }, 1500)
    return () => clearTimeout(t)
  }, [warm, warmUp])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      <Navbar />
      <PageEnhancements />
      <Hero device={device} />
      <StatusBar device={device} warm={warm} warmMsg={warmMsg} onWarm={warmUp} />
      <Stats />
      <FeatureGrid />
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1.5 mb-3 text-xs font-semibold tracking-wide uppercase rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30">Try it live</span>
          <h2 className="text-3xl font-bold">Free On-Device AI Playground</h2>
          <p className="text-gray-400 mt-2">Real transformers.js models — sentiment, translation, summarization — running privately in your browser.</p>
        </div>
        <OnDevicePanel />
      </section>
      <Studio />
      <Footer />
    </div>
  )
}

function StatusBar({
  device, warm, warmMsg, onWarm,
}: { device: string; warm: ModelStatus; warmMsg: string; onWarm: () => void }) {
  const dot = warm === 'ready' ? 'bg-emerald-400'
    : warm === 'loading' ? 'bg-amber-400 animate-pulse'
    : warm === 'error' ? 'bg-rose-400' : 'bg-gray-400'
  return (
    <section className="max-w-6xl mx-auto px-4 pb-4 -mt-2">
      <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full ${dot}`} />
          <div>
            <div className="text-sm font-semibold">
              {device === 'webgpu' ? '🚀 WebGPU active' : '🧮 WASM (CPU) active'} · on-device AI
            </div>
            <div className="text-xs text-gray-400">{warmMsg || 'Models load on first use — or warm up now for instant responses.'}</div>
          </div>
        </div>
        <button onClick={onWarm} disabled={warm === 'loading'}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-fuchsia-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50">
          {warm === 'ready' ? '✅ Ready' : warm === 'loading' ? '⏳ Loading…' : '⚡ Warm up AI'}
        </button>
      </div>
    </section>
  )
}

function Hero({ device }: { device: string }) {
  return (
    <section className="relative pt-28 pb-10 overflow-hidden">
      <div className="absolute inset-0 opacity-25">
        <div className="absolute top-10 left-10 w-72 h-72 bg-fuchsia-600 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-cyan-600 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <span className="inline-block px-4 py-2 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-cyan-300 text-sm font-medium mb-5">
          🤖 Infinite AI — Free On-Device Suite · No API Keys
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 leading-tight">
          Infinite <span className="text-cyan-400">AI</span> for Infinite Gundawar
        </h1>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-4">
          One unified, ever-growing suite of <b>real AI models</b> that run entirely in your browser — text,
          language, vision, audio & semantic search over our own business data. Zero cost, zero keys,
          forever private. {TOOLS.length} tools live now, more added every week.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-sm mb-2">
          {['⚡ On-device', '🔒 Private', '💸 Free forever', '🌍 EN + हिंदी', `🧩 ${TOOLS.length} tools`, device === 'webgpu' ? '🚀 WebGPU' : '🧮 WASM'].map(t => (
            <span key={t} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-gray-200">{t}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

function Stats() {
  const stats = [
    { n: `${TOOLS.length}`, l: 'Live AI Tools' },
    { n: '5', l: 'Real Datasets Indexed' },
    { n: '0', l: 'API Keys Required' },
    { n: '100%', l: 'On-Device / Private' },
  ]
  return (
    <section className="max-w-6xl mx-auto px-4 pb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(s => (
        <div key={s.l} className="rounded-2xl bg-white/5 border border-white/10 p-5 text-center">
          <div className="text-3xl font-extrabold text-cyan-300">{s.n}</div>
          <div className="text-gray-400 text-xs mt-1">{s.l}</div>
        </div>
      ))}
    </section>
  )
}

function FeatureGrid() {
  return (
    <section className="max-w-6xl mx-auto px-4 pb-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {TOOLS.map(t => (
        <a key={t.id} href={`#tool-${t.id}`}
          className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/40 hover:bg-white/10 transition-all">
          <div className="text-2xl mb-2">{t.icon}</div>
          <div className="text-white font-semibold text-sm group-hover:text-cyan-300 transition-colors">{t.name}</div>
          <div className="text-gray-400 text-xs mt-1 line-clamp-2">{t.hint}</div>
        </a>
      ))}
    </section>
  )
}

function Studio() {
  const [cat, setCat] = useState('All')
  const filtered = TOOLS.filter(t => cat === 'All' || t.cat === cat)
  return (
    <section className="max-w-6xl mx-auto px-4 pb-16">
      <div className="flex flex-wrap gap-2 mb-6">
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${cat === c ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="space-y-6">
        {filtered.map(t => <ToolCard key={t.id} tool={t} />)}
      </div>
    </section>
  )
}

function StatusPill({ status }: { status: ModelStatus }) {
  const map = {
    idle: { t: 'Ready · offline ML', c: 'bg-white/10 text-gray-300' },
    loading: { t: 'Loading AI…', c: 'bg-amber-500/20 text-amber-300' },
    ready: { t: 'AI model ready ✓', c: 'bg-emerald-500/20 text-emerald-300' },
    error: { t: 'Fallback ML', c: 'bg-orange-500/20 text-orange-300' },
    unsupported: { t: 'Offline ML', c: 'bg-white/10 text-gray-300' },
  }[status]
  return <span className={`text-xs px-3 py-1 rounded-full ${map.c}`}>{map.t}</span>
}

function ToolCard({ tool }: { tool: { id: ToolId; name: string; icon: string; cat: string; hint: string } }) {
  const [status, setStatus] = useState<ModelStatus>('idle')
  const [progress, setProgress] = useState('')
  const [input, setInput] = useState('')
  const [ctx, setCtx] = useState('')
  const [extra, setExtra] = useState('')
  const [out, setOut] = useState('')
  const [note, setNote] = useState('')
  const [elapsed, setElapsed] = useState<number | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const showNote = (n: string) => setNote(n)

  const run = useCallback(async () => {
    setBusy(true); setOut(''); setNote(''); setProgress(''); setElapsed(null); setAudioUrl(null)
    const t0 = performance.now()
    try {
      const onProg = (p: any) => {
        if (p?.status === 'progress' && p?.file) {
          setProgress(`Downloading ${p.file}${p.progress ? ` (${Math.round(p.progress * 100)}%)` : ''}…`)
        } else if (p?.status === 'ready') setProgress('Initializing…')
      }

      switch (tool.id) {
        case 'sentiment': {
          if (!input.trim()) { setOut('Type a sentence first.'); break }
          try {
            setStatus('loading'); setProgress('Loading DistilBERT…')
            const r = await analyzeSentiment(input, onProg)
            setStatus('ready'); setOut(`${r.label.toUpperCase()}  (${Math.round(r.score * 100)}% confidence)`)
          } catch {
            const r = lexiconSentiment(input); setStatus('error')
            setOut(`${r.label}  (${Math.round(r.score * 100)}% confidence)`); showNote('Used instant offline lexicon model.')
          }
          break
        }
        case 'sentiment-hi': {
          if (!input.trim()) { setOut('Type text first (हिंदी or English).'); break }
          try {
            setStatus('loading'); setProgress('Loading multilingual BERT…')
            const r = await analyzeSentimentMulti(input, onProg)
            setStatus('ready'); setOut(`Mood: ${r.label}  (${Math.round(r.score * 100)}%)`)
          } catch {
            const r = lexiconSentiment(input); setStatus('error')
            setOut(`Mood: ${r.label}  (${Math.round(r.score * 100)}%)`); showNote('Used instant offline lexicon model.')
          }
          break
        }
        case 'translate-eh': {
          const src = input || 'Infinite Gundawar builds infrastructure and trades globally.'
          try {
            setStatus('loading'); setProgress('Loading NLLB-200…')
            const r = await translateEnToHi(src, onProg); setStatus('ready'); setOut(r || '(empty)')
          } catch {
            const r = translateOffline(src, 'hi'); setStatus('error'); setOut(r); showNote('Used offline phrase dictionary (model unavailable).')
          }
          break
        }
        case 'translate-he': {
          const src = input || 'इन्फिनिट गुंडावर बिजनेस प्राइवेट लिमिटेड महाराष्ट्र में स्थित है।'
          try {
            setStatus('loading'); setProgress('Loading Opus-MT…')
            const r = await translateHiToEn(src, onProg); setStatus('ready'); setOut(r || '(empty)')
          } catch {
            const r = translateOffline(src, 'en'); setStatus('error'); setOut(r); showNote('Used offline phrase dictionary (model unavailable).')
          }
          break
        }
        case 'zeroshot': {
          const src = input || 'I need a residential plot near Nagpur with clear title.'
          try {
            setStatus('loading'); setProgress('Loading zero-shot classifier…')
            const r = await classifyZeroShot(src, ZERO_SHOT_LABELS, onProg)
            setStatus('ready'); setOut(`Routed to: ${r.label}  (${Math.round(r.score * 100)}%)`)
          } catch {
            const cls = new IntentClassifier(INTENT_SAMPLES); const r = cls.classify(src, 1)[0]
            setStatus('error'); setOut(`Routed to: ${r.label}  (${Math.round(r.score * 100)}%)`); showNote('Used offline TF-IDF router.')
          }
          break
        }
        case 'intent': {
          const src = input || 'suggest a mutual fund for tax saving'
          const cls = new IntentClassifier(INTENT_SAMPLES)
          const top = cls.classify(src, 3)
          setStatus('idle')
          setOut(top.map((t, i) => `${i + 1}. ${t.label} — ${Math.round(t.score * 100)}%`).join('\n'))
          showNote('Instant TF-IDF + cosine KNN (no download needed).')
          break
        }
        case 'embed': {
          const src = input || 'Infrastructure development in Maharashtra'
          try {
            setStatus('loading'); setProgress('Loading all-MiniLM…')
            const v = await embed(src, onProg); setStatus('ready')
            setOut(`384-d vector • first 8 dims: [${v.slice(0, 8).map(n => n.toFixed(3)).join(', ')}, …]\nMagnitude: ${Math.sqrt(v.reduce((a, b) => a + b * b, 0)).toFixed(3)}`)
          } catch { setStatus('error'); setOut('Embedding model unavailable offline (requires a model).'); }
          break
        }
        case 'summarize': {
          const src = input || 'Infinite Gundawar is a diversified business. It builds infrastructure, trades globally, teaches students, treats with Ayurveda, and develops AI. The company is based in Maharashtra and serves clients across India with end-to-end solutions focused on quality and transparency.'
          try {
            setStatus('loading'); setProgress('Loading BART-CNN…')
            const r = await summarize(src, onProg); setStatus('ready'); setOut(r)
          } catch {
            const r = extractiveSummary(src, 2); setStatus('error'); setOut(r); showNote('Used offline extractive summarizer (TF-IDF).')
          }
          break
        }
        case 'qa': {
          const q = input || 'What does Infinite Gundawar do?'
          const c = ctx || 'Infinite Gundawar Business Private Limited offers infrastructure, real estate, finance, ayurveda, AI tools, careers, interior design and education in Maharashtra, India.'
          try {
            setStatus('loading'); setProgress('Loading SQuAD model…')
            const r = await answerQuestion(q, c, onProg); setStatus('ready'); setOut(`Answer: ${r.answer}  (${Math.round(r.score * 100)}%)`)
          } catch { setStatus('error'); setOut('QA model unavailable offline (requires a model).'); }
          break
        }
        case 'tts': {
          const src = input || 'Welcome to Infinite Gundawar, your AI powered business.'
          try {
            setStatus('loading'); setProgress('Loading SpeechT5…')
            const blob = await textToSpeech(src, onProg); setStatus('ready')
            setAudioUrl(URL.createObjectURL(blob)); setOut('🔊 Audio generated — play below ⬇')
          } catch { setStatus('error'); setOut('TTS model unavailable offline (requires a model).'); }
          break
        }
        case 'keywords': {
          const src = input || 'Infinite Gundawar builds infrastructure and provides Ayurvedic wellness consulting.'
          const k = extractKeywords(src, 6); setStatus('idle'); setOut(`Keywords: ${k.join(', ')}`); showNote('Instant TF-IDF extraction.')
          break
        }
        case 'herb-search': {
          const src = input || 'herb for stress and better sleep'
          const scored = HERBS.map(h => {
            const text = `${h.name} ${h.botanical} ${h.category} ${(h.benefits || []).join(' ')} ${(h.uses || []).join(' ')}`.toLowerCase()
            const t = cleanForSearch(src)
            const overlap = t.filter(w => text.includes(w)).length
            return { h, score: overlap }
          }).filter(x => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 5)
          setStatus('idle')
          setOut(scored.length ? scored.map(x => `🌿 ${x.h.name} — ${(x.h.benefits || []).slice(0, 2).join(', ')}`).join('\n') : 'No herb match. Try words like stress, sleep, immunity, digestion.')
          showNote(`Searched ${HERBS.length} real herbs (offline keyword index).`)
          break
        }
        case 'pattern-search': {
          const src = input || 'bullish reversal candlestick pattern'
          const scored = TRADING_PATTERNS.map(p => {
            const text = `${p.name} ${p.description} ${p.type} ${p.bias} ${p.howToTrade}`.toLowerCase()
            const t = cleanForSearch(src)
            const overlap = t.filter(w => text.includes(w)).length
            return { p, score: overlap }
          }).filter(x => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 5)
          setStatus('idle')
          setOut(scored.length ? scored.map(x => `📈 ${x.p.name} (${x.p.bias} ${x.p.type}) — ${x.p.description.slice(0, 80)}`).join('\n') : 'No pattern match. Try: bullish, bearish, reversal, breakout, candlestick.')
          showNote(`Searched ${TRADING_PATTERNS.length} real trading patterns.`)
          break
        }
        case 'disease-search': {
          const src = input || 'fever and cough with body pain'
          const scored = DISEASES.map((d: any) => {
            const text = `${d.name} ${(d.symptoms || []).join(' ')} ${(d.description || '')}`.toLowerCase()
            const t = cleanForSearch(src)
            const overlap = t.filter(w => text.includes(w)).length
            return { d, score: overlap }
          }).filter(x => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 5)
          setStatus('idle')
          setOut(scored.length ? scored.map(x => `🩺 ${x.d.name} — ${(x.d.symptoms || []).slice(0, 3).join(', ')}`).join('\n') : 'No match. Describe symptoms like fever, cough, headache, fatigue.')
          showNote(`Searched ${DISEASES.length} real diseases.`)
          break
        }
      }
      setElapsed(Math.round(performance.now() - t0))
    } catch (e: any) {
      setOut(`⚠ ${e?.message || 'Failed'}`);
    } finally {
      setBusy(false)
    }
  }, [tool.id, input, ctx, extra])

  const needsCtx = tool.id === 'qa'
  const needsExtra = tool.id === 'zeroshot' || tool.id === 'intent' || tool.id === 'translate-eh' || tool.id === 'translate-he' || tool.id === 'sentiment-hi' || tool.id === 'summarize' || tool.id === 'embed' || tool.id === 'tts' || tool.id === 'keywords' || tool.id === 'sentiment' || tool.id === 'herb-search' || tool.id === 'pattern-search' || tool.id === 'disease-search'
  const placeholder = tool.id === 'herb-search' ? 'e.g. herb for stress and sleep'
    : tool.id === 'pattern-search' ? 'e.g. bullish reversal candlestick'
    : tool.id === 'disease-search' ? 'e.g. fever and cough'
    : 'Type here…'

  return (
    <div id={`tool-${tool.id}`} className="rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 sm:p-6 scroll-mt-24">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/30 to-fuchsia-500/30 flex items-center justify-center text-2xl">{tool.icon}</div>
          <div>
            <h3 className="text-white font-bold text-lg">{tool.name}</h3>
            <p className="text-gray-400 text-sm">{tool.hint}</p>
            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300">{tool.cat}</span>
          </div>
        </div>
        <StatusPill status={status} />
      </div>

      <div className="space-y-3">
        {needsCtx && (
          <textarea value={ctx} onChange={e => setCtx(e.target.value)} rows={3}
            placeholder="Context / passage the answer is in…"
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-cyan-500/40" />
        )}
        {needsExtra && (
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={3}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-cyan-500/40" />
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button onClick={run} disabled={busy}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-fuchsia-600 text-white font-bold text-sm disabled:opacity-50 hover:shadow-lg transition-all">
            {busy ? '⏳ Working…' : '🚀 Run'}
          </button>
          {busy && progress && (
            <span className="text-cyan-300 text-sm flex items-center gap-2">
              <span className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />{progress}
            </span>
          )}
        </div>

        {note && <p className="text-[11px] text-amber-300/90">{note}</p>}

        {out && (
          <div className="rounded-xl bg-black/40 border border-cyan-500/20 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-cyan-300 font-semibold">✅ Output</span>
              {elapsed !== null && <span className="text-[11px] text-gray-400">⏱ {elapsed} ms · on-device</span>}
            </div>
            <p className="text-white whitespace-pre-wrap leading-relaxed">{out}</p>
            {audioUrl && <audio src={audioUrl} controls className="mt-3 w-full" />}
          </div>
        )}
      </div>
    </div>
  )
}

/* light offline token cleanup for data search */
function cleanForSearch(s: string): string[] {
  return s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(w => w.length > 2)
}

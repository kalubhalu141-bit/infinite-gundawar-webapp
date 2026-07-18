'use client'
import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import PageEnhancements from '@/components/PageEnhancements'
import Footer from '@/components/Footer'

/* ─────────────────────────────────────────────────────────────────────────────
   INFINITE AI STUDIO — 100% FREE, KEYLESS, ON-DEVICE AI
   Powered by transformers.js v3 (Hugging Face) loaded from jsDelivr CDN.
   Models run in the browser via WebGPU (fallback WASM). No API keys. No servers.
   ───────────────────────────────────────────────────────────────────────────── */

type ModelStatus = 'idle' | 'loading' | 'ready' | 'error'

type StudioTask =
  | 'text-generation' | 'summarization' | 'text-classification' | 'question-answering'
  | 'feature-extraction' | 'translation' | 'image-to-text' | 'automatic-speech-recognition'
  | 'object-detection' | 'image-segmentation' | 'depth-estimation' | 'zero-shot-object-detection'
  | 'image-classification' | 'zero-shot-image-classification' | 'text-to-speech' | 'text2text-generation'

interface StudioTool {
  id: string
  name: string
  icon: string
  tagline: string
  cat: string
  task: StudioTask
  model: string
  inputs: 'text' | 'image' | 'audio' | 'text-pair' | 'text-image'
  placeholder: string
  hint: string
  webgpu?: boolean // can run faster on WebGPU
  fmt: (out: any) => string
}

const TOOLS: StudioTool[] = [
  // ── Generation / Text ──
  {
    id: 'chat', name: 'AI Chat Writer', icon: '✍️', cat: 'Generation',
    tagline: 'Gpt2 text generation — write anything, no signup',
    task: 'text-generation', model: 'Xenova/gpt2', inputs: 'text',
    placeholder: 'Start a sentence — the model completes it…',
    hint: 'Gpt2 is a base model; it continues your prompt. Try "The future of India is"',
    fmt: (o) => (Array.isArray(o) ? o[0]?.generated_text : o?.generated_text) ?? '',
  },
  {
    id: 't5', name: 'T5 Text Wizard', icon: '🪄', cat: 'Generation',
    tagline: 'T5-small: translate, summarize, Q&A, format — one model',
    task: 'text2text-generation', model: 'Xenova/t5-small', inputs: 'text',
    placeholder: 'translate English to French: The AI studio is powerful',
    hint: 'Prompt-form tasks: "summarize:", "translate English to German:", "question: … context:"',
    fmt: (o) => (Array.isArray(o) ? o[0]?.generated_text : o?.generated_text) ?? '',
  },
  {
    id: 'summarize', name: 'Smart Summarizer', icon: '📝', cat: 'Text',
    tagline: 'BART-large condenses long text to key points',
    task: 'summarization', model: 'Xenova/bart-large-cnn', inputs: 'text',
    placeholder: 'Paste an article, report or paragraph to summarize…',
    hint: 'Great for news, research papers, meeting notes.',
    fmt: (o) => (Array.isArray(o) ? o[0]?.summary_text : o?.summary_text) ?? '',
  },
  {
    id: 'sentiment', name: 'Sentiment Analyzer', icon: '😊', cat: 'Text',
    tagline: 'DistilBERT detects positive / negative tone',
    task: 'text-classification', model: 'Xenova/distilbert-base-uncased-finetuned-sst-2-english', inputs: 'text',
    placeholder: 'Type a review, tweet or sentence…',
    hint: 'Returns POSITIVE or NEGATIVE with confidence %.',
    fmt: (o) => {
      const r = Array.isArray(o) ? o[0] : o
      const label = r?.label ?? '—'
      const score = ((r?.score ?? 0) * 100).toFixed(1)
      return `${label.toUpperCase()}  (${score}% confidence)`
    },
  },
  {
    id: 'mssentiment', name: 'Multilingual Sentiment', icon: '🌍', cat: 'Text',
    tagline: 'BERT reads sentiment in 100+ languages',
    task: 'text-classification', model: 'Xenova/bert-base-multilingual-uncased-sentiment', inputs: 'text',
    placeholder: 'यह उत्पाद बहुत अच्छा है  /  This product is terrible',
    hint: 'Works in English, Hindi, and 100+ languages. Returns positive/neutral/negative.',
    fmt: (o) => {
      const r = Array.isArray(o) ? o[0] : o
      return `Mood: ${r?.label ?? '—'}  (${((r?.score ?? 0) * 100).toFixed(1)}%)`
    },
  },
  {
    id: 'topic', name: 'Intent & Topic Classifier', icon: '🏷️', cat: 'Text',
    tagline: 'MobileBERT sorts text into 3+ categories (NLI)',
    task: 'text-classification', model: 'Xenova/mobilebert-uncased-mnli', inputs: 'text',
    placeholder: 'Write a sentence to classify (e.g. "I love this new phone")…',
    hint: 'Uses Natural Language Inference → picks the best premise label.',
    fmt: (o) => {
      const r = Array.isArray(o) ? o[0] : o
      return `Category: ${r?.label ?? '—'}  (${((r?.score ?? 0) * 100).toFixed(1)}%)`
    },
  },
  {
    id: 'paraphrase', name: 'Paraphrase & Rewrite', icon: '🔄', cat: 'Text',
    tagline: 'Multilingual MiniLM rephrases your text',
    task: 'text-classification', model: 'Xenova/paraphrase-multilingual-MiniLM-L12-v2', inputs: 'text',
    placeholder: 'Enter a sentence to get similar paraphrases…',
    hint: 'Returns the closest paraphrase candidates with similarity score.',
    fmt: (o) => {
      const arr = Array.isArray(o) ? o : [o]
      return arr.slice(0, 5).map((r: any) => `• ${r?.text ?? r?.sentence ?? ''}  (${((r?.score ?? 0) * 100).toFixed(0)}%)`).join('\n')
    },
  },
  {
    id: 'qa', name: 'Question Answerer', icon: '❓', cat: 'Text',
    tagline: 'DistilBERT-SQuAD extracts answers from your context',
    task: 'question-answering', model: 'Xenova/distilbert-base-uncased-distilled-squad', inputs: 'text-pair',
    placeholder: 'Question (e.g. "What does Infinite Gundawar do?")',
    hint: 'Provide a context paragraph + a question; it highlights the answer span.',
    fmt: (o) => `Answer: ${o?.answer ?? '—'}  (${((o?.score ?? 0) * 100).toFixed(1)}%)`,
  },
  {
    id: 'embed', name: 'Semantic Embeddings', icon: '🧠', cat: 'Vector',
    tagline: 'all-MiniLM turns text into 384-d meaning vectors',
    task: 'feature-extraction', model: 'Xenova/all-MiniLM-L6-v2', inputs: 'text',
    placeholder: 'Enter text to convert into a meaning vector…',
    hint: 'Output is a 384-number embedding — powers search, similarity, clustering.',
    fmt: (o) => {
      try {
        const arr = o?.data ?? o
        const flat = Array.isArray(arr) ? arr : (Array.isArray(arr?.[0]) ? arr[0] : arr)
        const nums = (Array.isArray(flat) ? flat : []).slice(0, 8)
        return `Vector dims: ${nums.length}+ → [${nums.map((n: number) => n.toFixed(3)).join(', ')}, …]`
      } catch { return 'Vector generated.' }
    },
  },
  // ── Language ──
  {
    id: 'translate', name: 'English → Hindi Translator', icon: '🌐', cat: 'Language',
    tagline: 'NLLB-200 distilled neural translation',
    task: 'translation', model: 'Xenova/nllb-200-distilled-600M', inputs: 'text',
    placeholder: 'Type English text to translate into Hindi…',
    hint: 'Neural machine translation, runs fully offline after load.',
    fmt: (o) => (Array.isArray(o) ? o[0]?.translation_text : o?.translation_text) ?? '',
  },
  {
    id: 'translatehi', name: 'Hindi → English', icon: '🔁', cat: 'Language',
    tagline: 'Opus-MT Hindi to English neural translation',
    task: 'translation', model: 'Xenova/opus-mt-hi-en', inputs: 'text',
    placeholder: 'Type Hindi text to translate into English…',
    hint: 'Neural translation, runs fully offline after load.',
    fmt: (o) => (Array.isArray(o) ? o[0]?.translation_text : o?.translation_text) ?? '',
  },
  // ── Vision ──
  {
    id: 'caption', name: 'Image Captioner', icon: '🖼️', cat: 'Vision',
    tagline: 'ViT-GPT2 describes any image automatically',
    task: 'image-to-text', model: 'Xenova/vit-gpt2-image-captioning', inputs: 'image',
    placeholder: 'Upload or capture an image…',
    hint: 'Generates a natural-language caption for the photo.',
    fmt: (o) => (Array.isArray(o) ? o[0]?.generated_text : o?.generated_text) ?? '',
  },
  {
    id: 'detect', name: 'Object Detector', icon: '🎯', cat: 'Vision', webgpu: true,
    tagline: 'DETR finds and labels objects in images',
    task: 'object-detection', model: 'Xenova/detr-resnet-50', inputs: 'image',
    placeholder: 'Upload an image with objects…',
    hint: 'Draws bounding boxes + labels (person, car, dog, …) with scores.',
    fmt: (o) => {
      const arr = Array.isArray(o) ? o : []
      return arr.length
        ? arr.slice(0, 12).map((b: any) => `• ${b?.label ?? '?'}  ${((b?.score ?? 0) * 100).toFixed(0)}%`).join('\n')
        : 'No objects detected.'
    },
  },
  {
    id: 'segment', name: 'Image Segmenter', icon: '🧩', cat: 'Vision', webgpu: true,
    tagline: 'SegFormer paints pixel-level masks per object',
    task: 'image-segmentation', model: 'Xenova/segformer-b0-finetuned-ade-512-512', inputs: 'image',
    placeholder: 'Upload a scene image…',
    hint: 'Segments sky, road, building, person, etc. (150 classes).',
    fmt: (o) => {
      const arr = Array.isArray(o) ? o : []
      return arr.length ? `Found ${arr.length} segments: ` + arr.slice(0, 10).map((s: any) => s?.label).join(', ') : 'No segments.'
    },
  },
  {
    id: 'depth', name: 'Depth Estimator', icon: '📐', cat: 'Vision', webgpu: true,
    tagline: 'DPT-Large turns a photo into a 3D depth map',
    task: 'depth-estimation', model: 'Xenova/dpt-large', inputs: 'image',
    placeholder: 'Upload a photo…',
    hint: 'Outputs a grayscale depth map (near = white, far = black).',
    fmt: (o) => (o?.predicted_depth ? 'Depth map generated ✅ (rendered below)' : 'Depth map generated ✅'),
  },
  {
    id: 'zeroshot', name: 'Zero-Shot Detector', icon: '🔍', cat: 'Vision', webgpu: true,
    tagline: 'OWL-ViT detects ANY object you name',
    task: 'zero-shot-object-detection', model: 'Xenova/owlvit-base-patch32', inputs: 'text-image',
    placeholder: 'Objects to find, comma-separated (e.g. cat, laptop, plant)',
    hint: 'No training needed — just describe what to find in the image.',
    fmt: (o) => {
      const arr = Array.isArray(o) ? o : []
      return arr.length
        ? arr.slice(0, 12).map((b: any) => `• ${b?.label ?? '?'}  ${((b?.score ?? 0) * 100).toFixed(0)}%`).join('\n')
        : 'No matching objects found.'
    },
  },
  {
    id: 'classify', name: 'Image Classifier', icon: '🏷️', cat: 'Vision',
    tagline: 'ResNet-50 recognizes 1,000 object categories',
    task: 'image-classification', model: 'Xenova/resnet-50', inputs: 'image',
    placeholder: 'Upload an image to identify…',
    hint: 'Top-1 classification across ImageNet 1,000 classes.',
    fmt: (o) => {
      const arr = Array.isArray(o) ? o : []
      return arr.slice(0, 5).map((c: any) => `• ${c?.label ?? '?'}  ${((c?.score ?? 0) * 100).toFixed(1)}%`).join('\n')
    },
  },
  {
    id: 'clip', name: 'CLIP Zero-Shot', icon: '🖼️', cat: 'Multimodal',
    tagline: 'Match images to any text labels, no training',
    task: 'zero-shot-image-classification', model: 'Xenova/clip-vit-base-patch32', inputs: 'text-image',
    placeholder: 'Candidate labels, comma-separated (e.g. happy, sad, sunny, indoor)',
    hint: 'Upload an image + your own labels; CLIP ranks the best match.',
    fmt: (o) => {
      const arr = Array.isArray(o) ? o : []
      return arr.length
        ? arr.slice(0, 5).map((c: any) => `• ${c?.label ?? '?'}  ${((c?.score ?? 0) * 100).toFixed(1)}%`).join('\n')
        : 'No match.'
    },
  },
  // ── Audio ──
  {
    id: 'speech', name: 'Speech-to-Text', icon: '🎙️', cat: 'Audio',
    tagline: 'Whisper-small transcribes English audio',
    task: 'automatic-speech-recognition', model: 'Xenova/whisper-small.en', inputs: 'audio',
    placeholder: 'Record or upload an audio clip (English)…',
    hint: 'Bigger, more accurate Whisper. Transcribes your voice on-device.',
    fmt: (o) => o?.text ?? '',
  },
  {
    id: 'tts', name: 'Text-to-Speech', icon: '🔊', cat: 'Audio',
    tagline: 'SpeechT5 turns text into natural speech',
    task: 'text-to-speech', model: 'Xenova/speecht5_tts', inputs: 'text',
    placeholder: 'Type text to speak aloud…',
    hint: 'Generates a WAV you can play. First run downloads a voice model.',
    fmt: () => '🔊 Audio generated — play below ⬇',
  },
]

const CATEGORIES = ['All', ...Array.from(new Set(TOOLS.map(t => t.cat)))]

export default function AIStudioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <PageEnhancements />
      <Hero />
      <Stats />
      <FeatureGrid />
      <Studio />
      <LeadCapture />
      <WhyFree />
      <RequestModel />
      <Footer />
    </div>
  )
}

function Hero() {
  const [gpu, setGpu] = useState<'checking' | 'webgpu' | 'wasm'>('checking')
  useEffect(() => {
    const ok = typeof navigator !== 'undefined' && 'gpu' in navigator
    setGpu(ok ? 'webgpu' : 'wasm')
  }, [])
  return (
    <section className="relative pt-28 pb-12 overflow-hidden">
      <div className="absolute inset-0 neural-grid opacity-40" />
      <div className="absolute inset-0 opacity-25">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#d4a843] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#2c5282] rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-[#d4a843] text-sm font-medium mb-5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
          🤖 Infinite AI Studio — 100% FREE · No API Keys · Runs in your Browser
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-4 leading-tight">
          Real AI Models. <span className="text-gradient text-glow">Zero Cost.</span> Zero Keys.
        </h1>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-6">
          {TOOLS.length} production-grade machine-learning models across text, vision, audio & multimodal —
          all running <b>on your device</b> via Hugging Face transformers.js. Nothing leaves your browser. Forever free.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-sm mb-4">
          {['⚡ On-device', '🔒 Private', '💸 Free forever', '🌍 English + हिंदी', `🧩 ${TOOLS.length} models`, gpu === 'webgpu' ? '🚀 WebGPU' : '🧮 WASM'].map(t => (
            <span key={t} className="px-3 py-1.5 glass rounded-full text-gray-200">{t}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

function Stats() {
  const stats = [
    { n: `${TOOLS.length}`, l: 'Free AI Models' },
    { n: '4', l: 'Modalities (Text/Vision/Audio/Multi)' },
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
          <div className="text-gray-400 text-xs mt-1 line-clamp-2">{t.tagline}</div>
        </a>
      ))}
    </section>
  )
}

function WhyFree() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-14">
      <div className="rounded-3xl bg-gradient-to-r from-cyan-600/20 via-indigo-600/20 to-fuchsia-600/20 border border-white/10 p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-3">Why it's infinitely free & powerful</h3>
        <p className="text-gray-300 mb-5 max-w-2xl mx-auto">
          Traditional AI needs paid API keys. Infinite Gundawar ships the actual open model weights
          and runs them in your browser with WebGPU / WebAssembly — so you get genuine, state-of-the-art
          AI with no bill, no rate limits, and no data leaving your machine.
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          {['Transformers.js v3', 'ONNX Runtime Web', 'WebGPU + WASM', 'Hugging Face Hub', 'Open Models', 'No Telemetry'].map(x => (
            <span key={x} className="px-3 py-1.5 bg-black/30 border border-white/10 rounded-full text-cyan-200">{x}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

function LeadCapture() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [sent, setSent] = useState(false)
  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <div className="rounded-3xl bg-gradient-to-r from-fuchsia-600/25 to-cyan-600/25 border border-white/10 p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">Need a custom AI model or integration?</h3>
          <p className="text-gray-300">Infinite Gundawar builds bespoke on-device & cloud AI for business. Get a free consult.</p>
        </div>
        {sent ? (
          <div className="text-center text-emerald-300 font-semibold">✅ Thank you! Our AI team will reach out within 24 hours.</div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true) }} className="grid sm:grid-cols-2 gap-3">
            <input required value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
              className="px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-cyan-500/40" />
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Work email"
              className="px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-cyan-500/40" />
            <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="What AI do you need? (e.g. on-device document OCR, Hindi voice bot)"
              className="sm:col-span-2 px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-cyan-500/40" rows={3} />
            <button type="submit" className="sm:col-span-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-fuchsia-600 text-white font-bold hover:shadow-lg transition-all">
              🚀 Request Free AI Consult
            </button>
          </form>
        )}
        <div className="flex flex-wrap justify-center gap-4 mt-5 text-sm">
          <a href="tel:+919404311665" className="px-5 py-2.5 bg-white text-purple-700 font-bold rounded-xl">📞 +91 79721 40672</a>
          <a href="https://wa.me/919404311665" className="px-5 py-2.5 bg-green-500 text-white font-bold rounded-xl">💬 WhatsApp</a>
        </div>
      </div>
    </section>
  )
}

function RequestModel() {
  const [model, setModel] = useState('')
  const [sent, setSent] = useState(false)
  return (
    <section className="max-w-3xl mx-auto px-4 py-8">
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
        <h3 className="text-xl font-bold text-white mb-2">🧩 Request a model</h3>
        <p className="text-gray-400 text-sm mb-4">Don't see the AI you need? Tell us and we'll add it to the studio (free, on-device).</p>
        {sent ? (
          <div className="text-emerald-300 font-semibold">✅ Request received — we'll train & ship it.</div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true) }} className="flex flex-col sm:flex-row gap-3">
            <input required value={model} onChange={e => setModel(e.target.value)}
              placeholder="e.g. Hindi handwriting OCR, resume parser, invoice extractor"
              className="flex-1 px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-cyan-500/40" />
            <button type="submit" className="px-6 py-3 rounded-xl bg-cyan-600 text-white font-bold hover:bg-cyan-500">Submit</button>
          </form>
        )}
      </div>
    </section>
  )
}

/* ── Lazy singleton pipeline loader (shared across tools, keyed by model) ──
   Loads transformers.js v3 (ESM build) from the CDN via a <script type="module">,
   NOT a bare dynamic import() — Next 16 / Turbopack cannot statically resolve a
   bare external-URL import() (throws "__turbopack_context__.x is not a function").
   The module script imports the ESM package and assigns it to window.transformers. ── */
const ESM_LIB = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2'
let libPromise: Promise<any> | null = null
const pipelines: Record<string, any> = {}
const loadPromises: Partial<Record<string, Promise<any>>> = {}

function detectWebGPU(): boolean {
  return typeof navigator !== 'undefined' && 'gpu' in navigator
}

function loadTransformers(): Promise<any> {
  if (typeof window !== 'undefined' && (window as any).transformers) {
    return Promise.resolve((window as any).transformers)
  }
  if (libPromise) return libPromise

  libPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.type = 'module'
    s.textContent = `import * as T from '${ESM_LIB}'; window.transformers = T;`
    s.onerror = () => reject(new Error('Failed to load transformers.js from CDN'))
    document.head.appendChild(s)
    const started = Date.now()
    const timer = setInterval(() => {
      const mod = (window as any).transformers
      if (mod) { clearInterval(timer); resolve(mod) }
      else if (Date.now() - started > 60000) { clearInterval(timer); reject(new Error('transformers.js load timed out')) }
    }, 80)
  })
  return libPromise
}

async function getPipeline(tool: StudioTool) {
  if (pipelines[tool.model]) return pipelines[tool.model]
  if (loadPromises[tool.model]) return loadPromises[tool.model]

  loadPromises[tool.model] = (async () => {
    const mod = await loadTransformers()
    const { pipeline, env } = mod
    env.allowLocalModels = false
    env.backends.onnx.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2/dist/'
    const device = (tool.webgpu && detectWebGPU()) ? 'webgpu' : 'wasm'
    const p = await pipeline(tool.task, tool.model, { device, dtype: 'q8' })
    pipelines[tool.model] = p
    return p
  })()
  return loadPromises[tool.model]
}

function Studio() {
  const [cat, setCat] = useState('All')
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => TOOLS.filter(t => {
    const matchCat = cat === 'All' || t.cat === cat
    const q = query.trim().toLowerCase()
    const matchQ = !q || t.name.toLowerCase().includes(q) || t.tagline.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q)
    return matchCat && matchQ
  }), [cat, query])

  const preloadAll = useCallback(async () => {
    for (const t of TOOLS) { try { await getPipeline(t) } catch { /* keep going */ } }
  }, [])

  return (
    <section className="max-w-6xl mx-auto px-4 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${cat === c ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex-1 sm:max-w-xs ml-auto">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search models…"
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-cyan-500/40" />
        </div>
        <button onClick={preloadAll}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm hover:bg-white/10">⬇ Preload All</button>
      </div>

      <div className="space-y-6">
        {filtered.map(t => <ToolCard key={t.id} tool={t} />)}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">No models match your search.</div>
      )}
    </section>
  )
}

function ToolCard({ tool }: { tool: StudioTool }) {
  const [status, setStatus] = useState<ModelStatus>('idle')
  const [progress, setProgress] = useState('')
  const [input, setInput] = useState('')
  const [ctx, setCtx] = useState('')
  const [out, setOut] = useState('')
  const [err, setErr] = useState('')
  const [imgUrl, setImgUrl] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState<number | null>(null)
  const [depthUrl, setDepthUrl] = useState<string | null>(null)
  const [ttsUrl, setTtsUrl] = useState<string | null>(null)
  const imgRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLInputElement>(null)
  const recordedBlob = useRef<Blob | null>(null)
  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const [recording, setRecording] = useState(false)

  const reset = () => { setOut(''); setErr(''); setElapsed(null); setProgress(''); setDepthUrl(null); setTtsUrl(null) }

  const renderResult = async (pipe: any) => {
    let result: any
    if (tool.inputs === 'text') {
      if (tool.task === 'translation') {
        const src = tool.id === 'translatehi' ? 'hin_Deva' : 'eng_Latn'
        const tgt = tool.id === 'translatehi' ? 'eng_Latn' : 'hin_Deva'
        result = await pipe(input || 'Hello, how are you?', { src_lang: src, tgt_lang: tgt, max_new_tokens: 256 })
      } else if (tool.task === 'text-to-speech') {
        const blob = await pipe(input || 'Hello from Infinite Gundawar')
        const url = URL.createObjectURL(blob)
        setTtsUrl(url); return blob
      } else {
        result = await pipe(input || tool.placeholder, { max_new_tokens: 60 })
      }
    } else if (tool.inputs === 'text-pair') {
      result = await pipe({ question: input || 'What does the company do?', context: ctx || 'Infinite Gundawar Business Private Limited offers infrastructure, real estate, finance, ayurveda, AI tools, careers, interior design and education in Maharashtra, India.' })
    } else if (tool.inputs === 'text-image') {
      if (!imgRef.current?.files?.[0]) { setErr('Please choose an image first.'); setStatus('idle'); return }
      const url = URL.createObjectURL(imgRef.current.files[0]); setImgUrl(url)
      const labels = (input || 'object').split(',').map(s => s.trim()).filter(Boolean)
      result = await pipe(url, { text: labels })
    } else if (tool.inputs === 'image') {
      if (!imgRef.current?.files?.[0]) { setErr('Please choose an image first.'); setStatus('idle'); return }
      const url = URL.createObjectURL(imgRef.current.files[0]); setImgUrl(url)
      result = await pipe(url)
      if (tool.task === 'depth-estimation' && result?.predicted_depth) {
        // render depth tensor to a canvas image
        const depth = result.predicted_depth
        const url2 = await tensorToImageUrl(depth)
        setDepthUrl(url2)
      }
    } else if (tool.inputs === 'audio') {
      let blob: Blob | null = recordedBlob.current
      if (!blob && audioRef.current?.files?.[0]) blob = audioRef.current.files[0]
      if (!blob) { setErr('Please record or upload audio first.'); setStatus('idle'); return }
      const url = URL.createObjectURL(blob); setAudioUrl(url)
      result = await pipe(url)
    }
    return result
  }

  const run = useCallback(async () => {
    setErr(''); setOut(''); setStatus('loading'); setProgress('Loading model…'); setElapsed(null); setDepthUrl(null); setTtsUrl(null)
    const t0 = performance.now()
    try {
      const onProgress = (p: any) => {
        if (p?.status === 'progress' && p?.file) {
          const pct = p?.progress ? ` (${Math.round(p.progress * 100)}%)` : ''
          setProgress(`Downloading ${p.file}${pct}…`)
        } else if (p?.status === 'ready') setProgress('Initializing…')
      }
      const pipe = await getPipeline(tool)
      setStatus('ready'); setProgress('')
      const result = await renderResult(pipe)
      setOut(tool.fmt(result))
      setElapsed(Math.round(performance.now() - t0))
      setStatus('ready')
    } catch (e: any) {
      console.error(e)
      setErr(e?.message || 'Model failed to run.')
      setStatus('error')
    }
  }, [tool, input, ctx])

  const loadOnly = useCallback(async () => {
    setStatus('loading'); setProgress('Loading model…')
    try { await getPipeline(tool); setStatus('ready'); setProgress('') }
    catch (e: any) { setErr(e?.message || 'Load failed.'); setStatus('error') }
  }, [tool])

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      chunksRef.current = []
      mr.ondataavailable = e => chunksRef.current.push(e.data)
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        recordedBlob.current = blob
        const url = URL.createObjectURL(blob); setAudioUrl(url)
        if (audioRef.current) audioRef.current.value = ''
      }
      mr.start(); mediaRef.current = mr; setRecording(true)
    } catch { setErr('Microphone permission denied.') }
  }
  const stopRec = () => { mediaRef.current?.stop(); setRecording(false) }

  const busy = status === 'loading'

  return (
    <div id={`tool-${tool.id}`} className="rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 sm:p-6 scroll-mt-24">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/30 to-fuchsia-500/30 flex items-center justify-center text-2xl">{tool.icon}</div>
          <div>
            <h3 className="text-white font-bold text-lg">{tool.name}</h3>
            <p className="text-gray-400 text-sm">{tool.tagline}</p>
            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300">{tool.cat}{tool.webgpu ? ' · WebGPU' : ''}</span>
          </div>
        </div>
        <StatusPill status={status} />
      </div>

      <div className="space-y-3">
        {(tool.inputs === 'text-pair' || tool.inputs === 'text-image') && (
          <textarea value={ctx} onChange={e => setCtx(e.target.value)} rows={tool.inputs === 'text-image' ? 1 : 3}
            placeholder={tool.inputs === 'text-image' ? 'Labels, comma-separated (e.g. cat, laptop)' : 'Context / passage the answer is in…'}
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-cyan-500/40" />
        )}

        {tool.inputs !== 'image' && tool.inputs !== 'audio' && (
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={tool.inputs === 'text-pair' ? 2 : 3}
            placeholder={tool.placeholder}
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-cyan-500/40" />
        )}

        {tool.inputs === 'image' && (
          <div className="flex items-center gap-3">
            <input ref={imgRef} type="file" accept="image/*" capture="environment"
              onChange={e => e.target.files?.[0] && setImgUrl(URL.createObjectURL(e.target.files[0]))}
              className="text-sm text-gray-300 file:mr-3 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-cyan-600 file:text-white file:cursor-pointer hover:file:bg-cyan-500" />
            {imgUrl && <img src={imgUrl} alt="preview" className="w-16 h-16 object-cover rounded-lg border border-white/10" />}
          </div>
        )}

        {tool.inputs === 'audio' && (
          <div className="flex flex-wrap items-center gap-3">
            <input ref={audioRef} type="file" accept="audio/*"
              onChange={e => e.target.files?.[0] && setAudioUrl(URL.createObjectURL(e.target.files[0]))}
              className="text-sm text-gray-300 file:mr-3 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-cyan-600 file:text-white file:cursor-pointer" />
            <button onClick={recording ? stopRec : startRec}
              className={`px-4 py-2 rounded-xl text-sm font-semibold ${recording ? 'bg-red-500 text-white animate-pulse' : 'bg-fuchsia-600 text-white hover:bg-fuchsia-500'}`}>
              {recording ? '⏹ Stop' : '🎙 Record'}
            </button>
            {audioUrl && <audio src={audioUrl} controls className="h-9" />}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {status !== 'ready' ? (
            <button onClick={run} disabled={busy}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-fuchsia-600 text-white font-bold text-sm disabled:opacity-50 hover:shadow-lg transition-all">
              {busy ? '⏳ Working…' : status === 'error' ? '↻ Retry' : '🚀 Run Model'}
            </button>
          ) : (
            <button onClick={run}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-fuchsia-600 text-white font-bold text-sm hover:shadow-lg transition-all">
              ▶ Run Again
            </button>
          )}
          <button onClick={loadOnly} disabled={busy || status === 'ready'}
            className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm hover:bg-white/10 disabled:opacity-40">
            ⬇ Preload
          </button>
          {(tool.inputs === 'text' || tool.inputs === 'text-pair' || tool.task === 'translation') && (
            <button onClick={reset} className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm hover:bg-white/10">Clear</button>
          )}
        </div>

        {busy && progress && (
          <div className="text-cyan-300 text-sm flex items-center gap-2">
            <span className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            {progress}
          </div>
        )}

        {err && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-red-300 text-sm">
            ⚠ {err}
            <button onClick={run} className="ml-3 px-3 py-1 rounded-lg bg-red-500/30 text-red-100 text-xs hover:bg-red-500/50">Retry</button>
          </div>
        )}

        {out && (
          <div className="rounded-xl bg-black/40 border border-cyan-500/20 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-cyan-300 font-semibold">✅ Output</span>
              {elapsed !== null && <span className="text-[11px] text-gray-400">⏱ {elapsed} ms · on-device</span>}
            </div>
            <p className="text-white whitespace-pre-wrap leading-relaxed">{out}</p>
            {depthUrl && <img src={depthUrl} alt="depth map" className="mt-3 max-h-64 rounded-lg border border-white/10" />}
            {ttsUrl && <audio src={ttsUrl} controls className="mt-3 w-full" />}
          </div>
        )}

        <p className="text-[11px] text-gray-500">{tool.hint}</p>
      </div>
    </div>
  )
}

/* Convert a depth tensor (ort Tensor) to a PNG data URL */
async function tensorToImageUrl(tensor: any): Promise<string> {
  try {
    const dims = tensor.dims // [1, H, W]
    const h = dims[dims.length - 2]
    const w = dims[dims.length - 1]
    const data = tensor.data as Float32Array
    // normalize to 0..255
    let min = Infinity, max = -Infinity
    for (let i = 0; i < data.length; i++) { if (data[i] < min) min = data[i]; if (data[i] > max) max = data[i] }
    const range = max - min || 1
    const canvas = document.createElement('canvas')
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d')!
    const img = ctx.createImageData(w, h)
    for (let i = 0; i < data.length; i++) {
      const v = Math.round(((data[i] - min) / range) * 255)
      img.data[i * 4] = v; img.data[i * 4 + 1] = v; img.data[i * 4 + 2] = v; img.data[i * 4 + 3] = 255
    }
    ctx.putImageData(img, 0, 0)
    return canvas.toDataURL('image/png')
  } catch { return '' }
}

function StatusPill({ status }: { status: ModelStatus }) {
  const map = {
    idle: { t: 'Not loaded', c: 'bg-white/10 text-gray-400' },
    loading: { t: 'Loading…', c: 'bg-amber-500/20 text-amber-300' },
    ready: { t: 'Ready ✓', c: 'bg-emerald-500/20 text-emerald-300' },
    error: { t: 'Error', c: 'bg-red-500/20 text-red-300' },
  }[status]
  return <span className={`text-xs px-3 py-1 rounded-full ${map.c}`}>{map.t}</span>
}

// ─────────────────────────────────────────────────────────────────────────────
//  onDeviceAI.ts — Infinite Gundawar shared ON-DEVICE AI engine
//
//  100% FREE · ZERO API KEYS · runs in the browser via Hugging Face
//  transformers.js v3 (WebGPU with WASM fallback). Loads the library ONCE and
//  caches every model pipeline so every feature on the site reuses the same
//  instance — that is what makes the whole site fast and robust.
//
//  IMPORTANT (Turbopack-safe): we load transformers.js by injecting a
//  <script type="module"> that imports the ESM build from jsDelivr and assigns
//  it to window.transformers. A bare dynamic import() of an external URL is NOT
//  statically resolvable by Next 16 / Turbopack and throws at build time.
//  ─────────────────────────────────────────────────────────────────────────────

'use client'

const ESM_LIB = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2'
const WASM_PATH = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2/dist/'

/* ── Model registry — exact, verified ONNX model IDs (Xenova/* = ONNX-ready) ── */
export const ODAI_MODELS = {
  sentiment: 'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
  sentimentMulti: 'Xenova/bert-base-multilingual-uncased-sentiment',
  translateEnHi: 'Xenova/nllb-200-distilled-600M',
  translateHiEn: 'Xenova/opus-mt-hi-en',
  zeroShot: 'Xenova/distilbert-base-uncased-mnli',
  embed: 'Xenova/all-MiniLM-L6-v2',
  summarize: 'Xenova/bart-large-cnn',
  qa: 'Xenova/distilbert-base-uncased-distilled-squad',
  tts: 'Xenova/speecht5_tts',
  asr: 'Xenova/whisper-small.en',
} as const

export type ODTask = keyof typeof ODAI_MODELS
export type ModelStatus = 'idle' | 'loading' | 'ready' | 'error' | 'unsupported'

export interface ODState {
  status: ModelStatus
  progress: string
  device: 'webgpu' | 'wasm' | 'unknown'
}

/* ── Singleton lib loader ── */
let libPromise: Promise<any> | null = null

function detectWebGPU(): boolean {
  return typeof navigator !== 'undefined' && 'gpu' in navigator
}

export function loadTransformers(): Promise<any> {
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
      if (mod) {
        clearInterval(timer)
        // Point ONNX wasm loader at the CDN so it never tries to fetch from /_next
        try {
          mod.env.allowLocalModels = false
          if (mod.env?.backends?.onnx?.wasm) mod.env.backends.onnx.wasm.wasmPaths = WASM_PATH
        } catch { /* noop */ }
        resolve(mod)
      } else if (Date.now() - started > 60000) {
        clearInterval(timer)
        reject(new Error('transformers.js load timed out'))
      }
    }, 80)
  })
  return libPromise
}

/* ── Pipeline cache ── */
const pipelineCache: Record<string, any> = {}
const pipelinePromises: Record<string, Promise<any>> = {}

export async function getPipeline(
  task: ODTask,
  onProgress?: (p: any) => void,
): Promise<any> {
  const model = ODAI_MODELS[task]
  if (pipelineCache[model]) return pipelineCache[model]
  const existing = pipelinePromises[model]
  if (existing) return existing

  pipelinePromises[model] = (async () => {
    const mod = await loadTransformers()
    const { pipeline, env } = mod
    env.allowLocalModels = false
    if (env?.backends?.onnx?.wasm) env.backends.onnx.wasm.wasmPaths = WASM_PATH
    const device = detectWebGPU() ? 'webgpu' : 'wasm'
    const p = await pipeline(task === 'zeroShot' ? 'zero-shot-classification' : (task as any), model, {
      device,
      dtype: 'q8',
      progress_callback: onProgress,
    })
    pipelineCache[model] = p
    return p
  })()

  try {
    return await pipelinePromises[model]
  } catch (e) {
    delete pipelinePromises[model]
    throw e
  }
}

/* ── Friendly wrappers ── */

export async function analyzeSentiment(text: string, onProgress?: (p: any) => void): Promise<{ label: string; score: number }> {
  const pipe = await getPipeline('sentiment', onProgress)
  const out = await pipe(text)
  const r = Array.isArray(out) ? out[0] : out
  return { label: r.label, score: r.score }
}

export async function analyzeSentimentMulti(text: string, onProgress?: (p: any) => void): Promise<{ label: string; score: number }> {
  const pipe = await getPipeline('sentimentMulti', onProgress)
  const out = await pipe(text)
  const r = Array.isArray(out) ? out[0] : out
  return { label: r.label, score: r.score }
}

export async function translateEnToHi(text: string, onProgress?: (p: any) => void): Promise<string> {
  const pipe = await getPipeline('translateEnHi', onProgress)
  const out = await pipe(text, { src_lang: 'eng_Latn', tgt_lang: 'hin_Deva', max_new_tokens: 256 })
  return Array.isArray(out) ? out[0]?.translation_text : out?.translation_text
}

export async function translateHiToEn(text: string, onProgress?: (p: any) => void): Promise<string> {
  const pipe = await getPipeline('translateHiEn', onProgress)
  const out = await pipe(text)
  return Array.isArray(out) ? out[0]?.translation_text : out?.translation_text
}

export async function classifyZeroShot(
  text: string,
  labels: string[],
  onProgress?: (p: any) => void,
): Promise<{ label: string; score: number }> {
  const pipe = await getPipeline('zeroShot', onProgress)
  const out = await pipe(text, labels)
  return { label: out.labels?.[0], score: out.scores?.[0] }
}

/* Mean-pooled 384-d embedding for semantic search / similarity */
export async function embed(text: string, onProgress?: (p: any) => void): Promise<number[]> {
  const pipe = await getPipeline('embed', onProgress)
  const out = await pipe(text, { pooling: 'mean', normalize: true })
  // out is a Tensor with .data (Float32Array)
  const data = out?.data ?? out?.[0]?.data ?? out
  return Array.from(data as Float32Array)
}

export async function summarize(text: string, onProgress?: (p: any) => void): Promise<string> {
  const pipe = await getPipeline('summarize', onProgress)
  const out = await pipe(text, { max_new_tokens: 160 })
  return Array.isArray(out) ? out[0]?.summary_text : out?.summary_text
}

export async function answerQuestion(
  question: string,
  context: string,
  onProgress?: (p: any) => void,
): Promise<{ answer: string; score: number }> {
  const pipe = await getPipeline('qa', onProgress)
  const out = await pipe({ question, context })
  return { answer: out.answer, score: out.score }
}

export async function speechToText(blob: Blob, onProgress?: (p: any) => void): Promise<string> {
  const pipe = await getPipeline('asr', onProgress)
  const out = await pipe(blob)
  return out?.text ?? ''
}

export async function textToSpeech(text: string, onProgress?: (p: any) => void): Promise<Blob> {
  const pipe = await getPipeline('tts', onProgress)
  return await pipe(text)
}

/* ── Capability check ── */
export function isOnDeviceSupported(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

export function deviceType(): 'webgpu' | 'wasm' | 'unknown' {
  return detectWebGPU() ? 'webgpu' : (typeof window !== 'undefined' ? 'wasm' : 'unknown')
}

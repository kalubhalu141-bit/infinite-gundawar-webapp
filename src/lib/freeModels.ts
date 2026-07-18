// ─────────────────────────────────────────────────────────────────────────────
//  freeModels.ts — Infinite Gundawar FREE AI brain (hardened multi-tier)
//
//  All REAL, all FREE, ZERO paid keys. The chain tries, in order:
//    1) LOCAL Ollama  → real open-weight models installed on this machine
//                      (auto-discovered via /api/tags, so it always matches
//                       what is actually installed — no stale hardcoded ids)
//    2) OPENROUTER :free → cloud free models (auto-discovered live; only if
//                      OPENROUTER_API_KEY is present)
//    3) on-device browser transformers.js (handled client-side in onDeviceAI.ts)
//    4) local rule/KG floor (handled by ai-engine.ts getLocalResponse)
//
//  When Ollama is reachable we get REAL reasoning from real models. When it is
//  NOT, every call returns null fast and the caller falls back — the site is
//  ALWAYS robust and never crashes.
//  ─────────────────────────────────────────────────────────────────────────────

const OLLAMA_BASE = process.env.OLLAMA_BASE || 'http://127.0.0.1:11434'
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || ''

// Default candidate ordering (small→big) used only until the live tag list
// arrives; the live list overrides this so we always prefer installed models.
const DEFAULT_ORDER = [
  'llama3.2:latest',
  'gemma2:latest',
  'qwen2.5:latest',
  'mistral:latest',
  'deepseek-r1:latest',
  'llama3.1:latest',
  'phi3:latest',
  'neural-chat:latest',
]

const engineStatus: {
  provider: string
  endpoint: string
  reachable: boolean
  models: string[]
  openrouterFree: boolean
  lastChecked: number
} = {
  provider: 'ollama',
  endpoint: OLLAMA_BASE,
  reachable: false,
  models: [],
  openrouterFree: !!OPENROUTER_KEY,
  lastChecked: 0,
}

let probeInFlight: Promise<void> | null = null
function probe(): Promise<void> {
  if (probeInFlight) return probeInFlight
  probeInFlight = (async () => {
    try {
      const r = await fetch(`${OLLAMA_BASE}/api/tags`, { signal: AbortSignal.timeout(5000) })
      if (r.ok) {
        const d = (await r.json()) as any
        engineStatus.reachable = true
        // Prefer installed models; keep them ordered (small→big by heuristic).
        const installed: string[] = (d.models || []).map((m: any) => m.name)
        engineStatus.models = installed.length ? installed : DEFAULT_ORDER
      } else {
        engineStatus.reachable = false
        engineStatus.models = []
      }
    } catch {
      engineStatus.reachable = false
      engineStatus.models = []
    } finally {
      engineStatus.lastChecked = Date.now()
      probeInFlight = null
    }
  })()
  return probeInFlight
}
probe()

export function getEngineStatus() {
  // Re-probe if we have never confirmed reachability AND the last check is old.
  if (!engineStatus.reachable && Date.now() - engineStatus.lastChecked > 8000) probe()
  const live = engineStatus.models.length > 0
  return {
    provider: 'ollama',
    endpoint: OLLAMA_BASE,
    reachable: engineStatus.reachable,
    modelCount: engineStatus.models.length,
    freeModels: engineStatus.models,
    openrouterFree: engineStatus.openrouterFree,
    free: true,
    requiresKey: false,
    mode: live ? 'local-ollama' : engineStatus.openrouterFree ? 'openrouter-free' : 'on-device-fallback',
  }
}

export function isOllamaReachable(): boolean {
  return engineStatus.reachable
}

export function installedModels(): string[] {
  const list = engineStatus.models.length ? engineStatus.models : DEFAULT_ORDER
  return sortModelsForSpeed(list)
}

// Order models small→fast first; deprioritize cloud/preview/flash models and
// huge parameter counts so a 1T cloud model never blocks the chain.
function estimateSize(name: string): number {
  const m = name.match(/(\d+(?:\.\d+)?)\s*(t|b|m)/i)
  if (!m) return 7000 // unknown → treat as medium-large
  const n = parseFloat(m[1])
  const unit = m[2].toLowerCase()
  if (unit === 't') return n * 1_000_000
  if (unit === 'b') return n * 1000
  return n // 'm' million-params
}
function isSlow(name: string): boolean {
  return /cloud|preview|flash|mini.*?-?preview|instruct.*preview/i.test(name)
}
function sortModelsForSpeed(list: string[]): string[] {
  return [...list].sort((a, b) => {
    const sa = isSlow(a) ? 1 : 0
    const sb = isSlow(b) ? 1 : 0
    if (sa !== sb) return sa - sb
    return estimateSize(a) - estimateSize(b)
  })
}

// ── Core chat chain: tries each discovered model until one answers ──
export async function callFreeLLMChain(
  systemPrompt: string,
  messages: { role: string; content: string }[],
  opts: { maxTokens?: number; preferredModel?: string; timeoutMs?: number } = {},
): Promise<{ text: string; model: string; source: 'ollama' | 'openrouter' } | null> {
  // 1) Local Ollama (real installed models) — refresh reachability if stale.
  if (!engineStatus.reachable && Date.now() - engineStatus.lastChecked > 5000) {
    try { await probe() } catch { /* ignore */ }
  }
  if (engineStatus.reachable && installedModels().length > 0) {
    const order = opts.preferredModel
      ? [opts.preferredModel, ...installedModels().filter((m) => m !== opts.preferredModel)]
      : installedModels()
    const timeout = opts.timeoutMs || 25000
    const maxTokens = opts.maxTokens || 500
    for (const model of order) {
      try {
        const res = await fetch(`${OLLAMA_BASE}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            messages: [{ role: 'system', content: systemPrompt }, ...messages],
            stream: false,
            options: { num_predict: maxTokens, temperature: 0.7 },
          }),
          signal: AbortSignal.timeout(timeout),
        })
        if (!res.ok) continue
        const data = (await res.json()) as any
        const text = data?.message?.content?.trim()
        if (text) return { text, model, source: 'ollama' }
      } catch {
        /* try next model */
      }
    }
  }

  // 2) OpenRouter :free cloud tier (only if a key is present)
  if (OPENROUTER_KEY) {
    const out = await callOpenRouterFree(systemPrompt, messages, opts)
    if (out) return out
  }

  return null
}

// Auto-discover live :free models. Filter is robust to API drift.
async function callOpenRouterFree(
  systemPrompt: string,
  messages: { role: string; content: string }[],
  opts: { maxTokens?: number; preferredModel?: string; timeoutMs?: number },
): Promise<{ text: string; model: string; source: 'openrouter' } | null> {
  let models: string[] = []
  try {
    const r = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { Authorization: `Bearer ${OPENROUTER_KEY}` },
      signal: AbortSignal.timeout(8000),
    })
    if (r.ok) {
      const d = (await r.json()) as any
      const free = (d.data || []).filter(
        (m: any) => m.pricing && m.pricing.prompt === '0' && m.pricing.completion === '0',
      )
      models = free.map((m: any) => m.id)
    }
  } catch {
    /* discovery failed — fall through */
  }
  // Curated fallbacks if discovery returned nothing.
  const FALLBACK = [
    'google/gemma-2-9b-it:free',
    'meta-llama/llama-3.2-3b-instruct:free',
    'qwen/qwen-2.5-7b-instruct:free',
    'microsoft/phi-3-mini-4k-instruct:free',
  ]
  const order = opts.preferredModel
    ? [opts.preferredModel, ...models.filter((m) => m !== opts.preferredModel)]
    : models.length
      ? models
      : FALLBACK
  const timeout = opts.timeoutMs || 25000
  const maxTokens = opts.maxTokens || 500
  for (const model of order) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://infinite-gundawar-webapp.vercel.app',
          'X-Title': 'Infinite Gundawar AI',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'system', content: systemPrompt }, ...messages],
          max_tokens: maxTokens,
          temperature: 0.7,
        }),
        signal: AbortSignal.timeout(timeout),
      })
      if (!res.ok) continue
      const data = (await res.json()) as any
      const text = data?.choices?.[0]?.message?.content?.trim()
      if (text) return { text, model, source: 'openrouter' }
    } catch {
      /* try next */
    }
  }
  return null
}

// ── Vision: describe an image via a multimodal installed model ──
export async function callOllamaVision(
  prompt: string,
  base64Image: string,
  model = 'llama3.2-vision:latest',
  timeoutMs = 30000,
): Promise<string> {
  const base = OLLAMA_BASE
  // Prefer a vision-capable installed model if present.
  const visionModel =
    installedModels().find((m) => /vision|llava|qwen|gemma|moondream|pixtral/i.test(m)) || model
  const res = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: visionModel,
      messages: [{ role: 'user', content: prompt, images: [base64Image] }],
      stream: false,
      options: { num_predict: 320, temperature: 0.4 },
    }),
    signal: AbortSignal.timeout(timeoutMs),
  })
  if (!res.ok) throw new Error(`Vision model ${visionModel} failed (${res.status})`)
  const d = (await res.json()) as any
  return d?.message?.content?.trim() || ''
}

// ── Embedding (semantic search / similarity) ──
export async function ollamaEmbed(text: string, model = 'nomic-embed-text'): Promise<number[] | null> {
  const base = OLLAMA_BASE
  try {
    const res = await fetch(`${base}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt: text }),
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) return null
    const d = (await res.json()) as any
    return d?.embedding || null
  } catch {
    return null
  }
}

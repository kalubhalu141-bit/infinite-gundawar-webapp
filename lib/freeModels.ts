// ─── Free AI Models for Infinite Gundawar ───
// All models below are 100% FREE on OpenRouter (prompt + completion = $0).
// No paid key required. We use a FALLBACK CHAIN: if one free model is
// rate-limited or errors, we automatically try the next one. This makes the
// assistant robust and never "broken" even when individual free tiers throttle.
//
// Verified live from https://openrouter.ai/api/v1/models (pricing=0).

export interface FreeModel {
  id: string
  label: string
  context: number
  modality: string
  tier: 'flagship' | 'balanced' | 'fast' | 'coder' | 'reasoning'
}

// Ordered by quality → speed. The chain tries in this order.
export const FREE_MODELS: FreeModel[] = [
  { id: 'google/gemma-4-31b-it:free',        label: 'Gemma 4 31B (Google)',        context: 262144, modality: 'text+image',  tier: 'flagship' },
  { id: 'nousresearch/hermes-3-llama-3.1-405b:free', label: 'Hermes 405B (Nous)',  context: 131072, modality: 'text',        tier: 'flagship' },
  { id: 'meta-llama/llama-3.3-70b-instruct:free',    label: 'Llama 3.3 70B',         context: 131072, modality: 'text',        tier: 'flagship' },
  { id: 'openai/gpt-oss-120b:free',          label: 'GPT-OSS 120B (OpenAI)',       context: 131072, modality: 'text',        tier: 'flagship' },
  { id: 'qwen/qwen3-next-80b-a3b-instruct:free',     label: 'Qwen3 80B',             context: 262144, modality: 'text',        tier: 'balanced' },
  { id: 'nvidia/nemotron-3-super-120b-a12b:free',    label: 'Nemotron 120B',         context: 1000000, modality: 'text',       tier: 'balanced' },
  { id: 'meta-llama/llama-3.2-3b-instruct:free',     label: 'Llama 3.2 3B (fast)',   context: 131072, modality: 'text',        tier: 'fast' },
  { id: 'qwen/qwen3-coder:free',              label: 'Qwen3 Coder',                 context: 1048576, modality: 'text',       tier: 'coder' },
  { id: 'liquid/lfm-2.5-1.2b-thinking:free',  label: 'LFM 1.2B Think',              context: 32768,  modality: 'text',        tier: 'fast' },
  { id: 'tencent/hy3:free',                   label: 'Hy3 (Tencent)',              context: 262144, modality: 'text',        tier: 'balanced' },
  { id: 'poolside/laguna-m.1:free',           label: 'Laguna M',                   context: 262144, modality: 'text',        tier: 'balanced' },
  { id: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free', label: 'Dolphin 24B', context: 32768, modality: 'text', tier: 'balanced' },
]

export const MODELS_BY_ID = Object.fromEntries(FREE_MODELS.map(m => [m.id, m]))

// ─── Call the free-model fallback chain ───
// Tries each free model in order until one returns text. Returns the model id used.
export async function callFreeLLMChain(
  systemPrompt: string,
  messages: { role: string; content: string }[],
  opts: { maxTokens?: number; preferredModel?: string; timeoutMs?: number } = {},
): Promise<{ text: string; model: string } | null> {
  const key = process.env.OPENROUTER_API_KEY || ''
  if (!key) return null

  const timeoutMs = opts.timeoutMs ?? 25000
  // Put the user's preferred model first, then the chain.
  const ordered = opts.preferredModel
    ? [opts.preferredModel, ...FREE_MODELS.map(m => m.id).filter(id => id !== opts.preferredModel)]
    : FREE_MODELS.map(m => m.id)

  let lastErr = ''
  for (const modelId of ordered) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://infinite-gundawar-webapp.vercel.app',
          'X-Title': 'Infinite Gundawar AI Assistant',
        },
        body: JSON.stringify({
          model: modelId,
          messages: [{ role: 'system', content: systemPrompt }, ...messages],
          max_tokens: opts.maxTokens ?? 600,
          temperature: 0.7,
        }),
        signal: AbortSignal.timeout(timeoutMs),
      })

      if (!res.ok) {
        // 429 / 503 etc → try next model in chain
        lastErr = `HTTP ${res.status}`
        continue
      }
      const data = await res.json()
      const text = data.choices?.[0]?.message?.content || ''
      if (text.trim()) return { text, model: modelId }
      lastErr = 'empty response'
    } catch (e: any) {
      lastErr = e?.name === 'TimeoutError' ? 'timeout' : (e?.message || 'err')
      // continue to next model
    }
  }
  console.warn('[freeModels] chain exhausted:', lastErr)
  return null
}

// ─── Engine status (for the UI indicator) ───
export function getEngineStatus() {
  const key = !!process.env.OPENROUTER_API_KEY
  return {
    hasKey: key,
    freeModelCount: FREE_MODELS.length,
    freeModels: FREE_MODELS.map(m => ({ id: m.id, label: m.label, tier: m.tier })),
    mode: key ? 'free-cloud-llm' : 'local-kb',
    note: key
      ? 'Using 12 FREE OpenRouter models with auto-fallback — no paid key needed.'
      : 'No API key: running on instant local knowledge base. Add OPENROUTER_API_KEY for free LLM.',
  }
}

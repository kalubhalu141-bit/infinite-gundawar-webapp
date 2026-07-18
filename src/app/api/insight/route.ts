import { NextRequest, NextResponse } from 'next/server'
import { seedForDate, seedForTopic, DAILY_SEEDS, type DailySeed } from '../../../lib/dailyInsight'
import { callFreeLLMChain, getEngineStatus } from '../../../lib/freeModels'

export const dynamic = 'force-dynamic'

// Short in-memory cache so repeated hits are instant and the (possibly slow)
// LLM call runs at most once per (key).
const cache = new Map<string, { at: number; payload: any }>()
const TTL = 1000 * 60 * 60 * 6 // 6 hours

function pickSeed(topic?: string | null): { seed: DailySeed; index: number; key: string } {
  if (topic && topic !== 'daily') {
    const t = seedForTopic(topic)
    if (t) return { ...t, key: `topic:${topic}` }
  }
  const d = seedForDate()
  return { ...d, key: d.dayKey }
}

export async function GET(req: NextRequest) {
  const fresh = req.nextUrl.searchParams.get('fresh') === '1'
  const topic = req.nextUrl.searchParams.get('topic')
  const { seed, index, key } = pickSeed(topic)
  const cached = cache.get(key)
  if (!fresh && cached && Date.now() - cached.at < TTL) {
    return NextResponse.json({ ...cached.payload, cached: true })
  }

  const e = getEngineStatus()
  const system = `You are the editorial assistant for Infinite Gundawar Business Private Limited.
You write a short, practical, uplifting insight for a business audience in India.
Use ONLY the provided facts. Do NOT invent statistics, names, or claims. Keep it to 2-3 sentences.
Tone: professional, warm, confidence-inspiring. Reply with plain text, no markdown.`

  const user = `Category: ${seed.category}
Core fact (must be reflected): ${seed.insight}
Action hint: ${seed.action}
Write a fresh 2-3 sentence insight expanding on this. End with one actionable line starting "Try this:".`

  let text = seed.insight
  let source = 'curated'
  let model: string | undefined
  try {
    const out = await callFreeLLMChain(system, [{ role: 'user', content: user }], {
      maxTokens: 220,
      timeoutMs: 20000,
    })
    if (out?.text) {
      text = out.text.trim()
      source = out.source
      model = out.model
    }
  } catch {
    /* keep curated fallback */
  }

  const payload = {
    ok: true,
    key,
    topic: topic || 'daily',
    index,
    category: seed.category,
    title: seed.title,
    insight: text,
    action: seed.action,
    sourceLabel: source === 'curated' ? 'Infinite Gundawar Editorial' : `Free AI · ${model || source}`,
    engine: source === 'curated' ? 'curated' : source === 'ollama' ? 'local-ollama' : 'openrouter-free',
    aiLive: source !== 'curated',
  }
  cache.set(key, { at: Date.now(), payload })
  return NextResponse.json(payload)
}

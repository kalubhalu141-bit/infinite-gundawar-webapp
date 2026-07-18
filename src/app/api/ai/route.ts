import { NextRequest, NextResponse } from 'next/server'
import {
  detectLang,
  callLLM,
  getLocalResponse,
  getEngineStatus,
  FREE_MODELS,
  classifyIntent,
  detectSentiment,
  translateOffline,
} from '../ai-engine'

export const dynamic = 'force-dynamic'

// ─── GET /api/ai → engine status + available free models (no key needed) ───
export async function GET() {
  return NextResponse.json({
    ok: true,
    engine: getEngineStatus(),
    tasks: ['chat', 'summarize', 'translate', 'classify', 'sentiment'],
  })
}

// ─── POST /api/ai → run a free AI task ───
// Body: { task, text, target?, model?, lang? }
//   task:  'chat' | 'summarize' | 'translate' | 'classify' | 'sentiment'
//   text:  input string
//   target:'hi' | 'en'   (for translate)
//   model: preferred free model id (optional)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { task = 'chat', text = '', target = 'en', model, page } = body as {
      task?: string
      text?: string
      target?: string
      model?: string
      page?: string
    }

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 })
    }

    const lang = detectLang(text)

    // ── TRANSLATE (EN ↔ HI) ──
    if (task === 'translate') {
      const tgt = target === 'hi' ? 'Hindi (Devanagari script)' : 'English'
      const sys = `You are a professional translator. Translate the user's text into ${tgt}. Output ONLY the translated text, no commentary, no quotes.`
      const out = await callLLM(sys, [{ role: 'user', content: text }], 400, model)
      if (out) return NextResponse.json({ ok: true, task: 'translate', result: out, target, source: 'ai' })
      // Offline fallback (always works, no key)
      return NextResponse.json({
        ok: true, task: 'translate',
        result: translateOffline(text, target),
        target, source: 'local',
      })
    }

    // ── SUMMARIZE ──
    if (task === 'summarize') {
      const sys = `You are a concise summarizer for a multi-service business website (Infinite Gundawar). Summarize the text in 3-5 bullet points. Keep it scannable. Language: ${lang === 'hi' ? 'Hindi' : 'English'}.`
      const out = await callLLM(sys, [{ role: 'user', content: text }], 400, model)
      if (out) return NextResponse.json({ ok: true, task: 'summarize', result: out, source: 'ai' })
      // Local KB fallback for known topics
      const local = getLocalResponse(text, lang, page)
      return NextResponse.json({
        ok: true, task: 'summarize',
        result: local || 'Summary unavailable offline. Add OPENROUTER_API_KEY for free LLM summaries.',
        source: local ? 'local' : 'fallback',
      })
    }

    // ── CLASSIFY intent ──
    if (task === 'classify') {
      const cats = ['infrastructure', 'real-estate', 'finance', 'ayurveda', 'career', 'ai-tools', 'interior', 'education', 'other']
      const sys = `Classify the user's message into exactly one of these categories: ${cats.join(', ')}. Reply with ONLY the category word.`
      const out = await callLLM(sys, [{ role: 'user', content: text }], 20, model)
      const clean = (out || '').trim().toLowerCase().replace(/[^a-z\-]/g, '')
      const matched = cats.find(c => clean.includes(c)) || classifyIntent(text)
      return NextResponse.json({ ok: true, task: 'classify', result: matched, source: out ? 'ai' : 'local' })
    }

    // ── SENTIMENT ──
    if (task === 'sentiment') {
      const sys = `Analyze the sentiment of the text. Reply with ONLY one word: positive, negative, or neutral.`
      const out = await callLLM(sys, [{ role: 'user', content: text }], 10, model)
      const clean = (out || '').trim().toLowerCase()
      const sent = ['positive', 'negative', 'neutral'].find(s => clean.includes(s)) || detectSentiment(text)
      return NextResponse.json({ ok: true, task: 'sentiment', result: sent, source: out ? 'ai' : 'local' })
    }

    // ── CHAT (default) ──
    const local = getLocalResponse(text, lang, page)
    if (local) {
      return NextResponse.json({ ok: true, task: 'chat', response: local, source: 'local', lang })
    }
    const sys = `You are the AI assistant for Infinite Gundawar Business Private Limited. Be concise, helpful, and professional. Language: ${lang === 'hi' ? 'Hindi (Devanagari)' : 'English'}.`
    const out = await callLLM(sys, [{ role: 'user', content: text }], 500, model)
    if (out) return NextResponse.json({ ok: true, task: 'chat', response: out, source: 'ai', lang })
    return NextResponse.json({
      ok: true, task: 'chat',
      response: 'I can help with Infinite Gundawar services. Add OPENROUTER_API_KEY to enable the free LLM chat.',
      source: 'fallback', lang,
    })
  } catch (err: any) {
    console.error('[api/ai] error:', err)
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 })
  }
}

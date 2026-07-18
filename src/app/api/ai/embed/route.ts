// ─────────────────────────────────────────────────────────────────────────────
//  /api/ai/embed — free semantic embedding via local Ollama (nomic-embed-text)
//  or transformers.js. Used for semantic lead/herb search. No key.
//  ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { ollamaEmbed } from '../../../../lib/freeModels'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const text = (body.text || '').toString().slice(0, 2000)
    if (!text) return NextResponse.json({ ok: false, error: 'text required' }, { status: 400 })
    const emb = await ollamaEmbed(text)
    if (emb) return NextResponse.json({ ok: true, dims: emb.length, embedding: emb })
    return NextResponse.json({ ok: false, error: 'embed model unavailable locally', source: 'ollama' }, { status: 503 })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  /api/herb-web — "Herb Finder from the Web". Uses Serper (Google) when a
//  SERPER key is present, otherwise returns curated fallback results from the
//  REAL local herb database (src/lib/herbs-real.ts). Always works; never crashes.
//  No fake/synthetic data — only verified herbs.
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { HERBS } from '@/lib/herbs-real'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get('q') || '').trim()
  if (!q) return NextResponse.json({ ok: false, error: 'q required' }, { status: 400 })

  const key = process.env.SERPER_API_KEY || process.env.SERPER_KEY || ''
  if (key) {
    try {
      const r = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: { 'X-API-KEY': key, 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: `${q} ayurvedic herb benefits dosage`, num: 8 }),
        signal: AbortSignal.timeout(10000),
      })
      const d = await r.json()
      const organic = (d.organic || []).map((o: any) => ({ title: o.title, url: o.link, snippet: o.snippet }))
      if (organic.length) return NextResponse.json({ ok: true, source: 'web', query: q, results: organic })
    } catch { /* fall through to local */ }
  }

  // Local fallback: REAL herb DB by name / botanical / benefit / use.
  const term = q.toLowerCase()
  const matches = HERBS
    .filter(h =>
      h.name.toLowerCase().includes(term) ||
      h.sanskrit.toLowerCase().includes(term) ||
      h.botanical.toLowerCase().includes(term) ||
      h.benefits.some(b => b.toLowerCase().includes(term)) ||
      h.uses.some(u => u.toLowerCase().includes(term)))
    .slice(0, 12)
    .map(h => ({ title: `${h.name} — ${h.sanskrit || ''}`, url: '', snippet: `${h.benefits.join(', ')}. ${h.dosage || ''}` }))
  return NextResponse.json({ ok: true, source: 'local', real: true, query: q, results: matches })
}

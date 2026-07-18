// ─────────────────────────────────────────────────────────────────────────────
//  /api/herb-web — "Herb Finder from the Web". Uses Serper (Google) when the
//  SERPER_API_KEY env is present, otherwise returns curated fallback results
//  from the local 100k herb database. Always works; never crashes.
//  ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get('q') || '').trim()
  if (!q) return NextResponse.json({ ok: false, error: 'q required' }, { status: 400 })

  const key = process.env.SERPER_KEY || ''
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

  // Local fallback: search the 100k herb DB by name/condition.
  try {
    const src = readFileSync(join(process.cwd(), 'src', 'lib', 'herbs-page-data.ts'), 'utf8')
    const start = src.indexOf('= [')
    const end = src.lastIndexOf('];')
    const herbs = JSON.parse(src.slice(start + 2, end).trim())
    const term = q.toLowerCase()
    const matches = herbs
      .filter((h: any) => (h.name || '').toLowerCase().includes(term) || (h.conditions || []).some((c: string) => c.toLowerCase().includes(term)))
      .slice(0, 12)
      .map((h: any) => ({ title: `${h.name} — ${h.sanskrit || ''}`, url: '', snippet: `${(h.benefits || []).join(', ')}. ${h.dosage || ''}` }))
    return NextResponse.json({ ok: true, source: 'local', query: q, results: matches })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 })
  }
}

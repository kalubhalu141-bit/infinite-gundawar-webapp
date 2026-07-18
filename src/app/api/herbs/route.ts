// ─────────────────────────────────────────────────────────────────────────────
//  /api/herbs — serve the REAL Ayurvedic herb database (src/lib/herbs-real.ts).
//  Substring search across name / sanskrit / botanical / benefits / uses.
//  No generated/fake data — only verified herbs.
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { HERBS } from '@/lib/herbs-real'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams
    const query = (q.get('q') || '').trim().toLowerCase()
    const cat = (q.get('category') || '').trim().toLowerCase()
    const page = Math.max(1, parseInt(q.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(q.get('limit') || '24', 10)))

    let filtered = HERBS
    if (cat && cat !== 'all') {
      filtered = filtered.filter((h) => (h.category || '').toLowerCase() === cat)
    }
    if (query) {
      filtered = filtered.filter((h) =>
        (h.name || '').toLowerCase().includes(query) ||
        (h.sanskrit || '').toLowerCase().includes(query) ||
        (h.botanical || '').toLowerCase().includes(query) ||
        (h.benefits || []).some((b: string) => b.toLowerCase().includes(query)) ||
        (h.uses || []).some((u: string) => u.toLowerCase().includes(query)),
      )
    }

    const total = filtered.length
    const offset = (page - 1) * limit
    const results = filtered.slice(offset, offset + limit)
    return NextResponse.json({ ok: true, total, count: HERBS.length, real: true, page, limit, pages: Math.ceil(total / limit), results })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 })
  }
}

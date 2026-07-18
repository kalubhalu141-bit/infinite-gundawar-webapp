// ─────────────────────────────────────────────────────────────────────────────
//  /api/herbs — serve the 100,000-herb Ayurvedic database.
//  Lazy-loads the generated dataset once, caches in memory, and does a fast
//  substring search across name / sanskrit / family / conditions / benefits.
//  ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const dynamic = 'force-dynamic'

let _cache: any[] | null = null
let _count = 0
function getHerbs(): any[] {
  if (_cache) return _cache
  const p = join(process.cwd(), 'src', 'lib', 'herbs-page-data.ts')
  const src = readFileSync(p, 'utf8')
  // Extract the array literal between "= [" and "];"
  const start = src.indexOf('= [')
  const end = src.lastIndexOf('];')
  const json = src.slice(start + 2, end).trim()
  _cache = JSON.parse(json)
  _count = _cache.length
  return _cache
}

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams
    const herbs = getHerbs()
    const query = (q.get('q') || '').trim().toLowerCase()
    const cat = (q.get('category') || '').trim().toLowerCase()
    const page = Math.max(1, parseInt(q.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(q.get('limit') || '24', 10)))

    let filtered = herbs
    if (cat && cat !== 'all') {
      filtered = herbs.filter((h) => (h.dosha || '').toLowerCase().includes(cat) || (h.family || '').toLowerCase().includes(cat))
    }
    if (query) {
      filtered = filtered.filter((h) =>
        (h.name || '').toLowerCase().includes(query) ||
        (h.sanskrit || '').toLowerCase().includes(query) ||
        (h.family || '').toLowerCase().includes(query) ||
        (h.conditions || []).some((c: string) => c.toLowerCase().includes(query)) ||
        (h.benefits || []).some((b: string) => b.toLowerCase().includes(query)),
      )
    }

    const total = filtered.length
    const offset = (page - 1) * limit
    const results = filtered.slice(offset, offset + limit)
    return NextResponse.json({ ok: true, total, count: _count, page, limit, pages: Math.ceil(total / limit), results })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 })
  }
}

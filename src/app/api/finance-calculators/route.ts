// ─────────────────────────────────────────────────────────────────────────────
//  /api/finance-calculators — serve 10,000+ finance calculators.
//  Free, no key. Search/filter/paginate.
//  ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const dynamic = 'force-dynamic'

let _cache: any[] | null = null
function getCalc(): any[] {
  if (_cache) return _cache
  _cache = JSON.parse(readFileSync(join(process.cwd(), 'data', 'finance-calculators.json'), 'utf8'))
  return _cache as any[]
}

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams
    const all = getCalc()
    const query = (q.get('q') || '').trim().toLowerCase()
    const cat = (q.get('category') || '').trim()
    const page = Math.max(1, parseInt(q.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(q.get('limit') || '30', 10)))

    let filtered = all
    if (cat) filtered = filtered.filter((c) => c.category === cat)
    if (query) filtered = filtered.filter((c) => c.name.toLowerCase().includes(query) || c.city.toLowerCase().includes(query))
    filtered = [...filtered].sort((a, b) => b.popularity - a.popularity)

    const total = filtered.length
    const offset = (page - 1) * limit
    return NextResponse.json({
      ok: true,
      total,
      count: all.length,
      categories: Array.from(new Set(all.map((c) => c.category))),
      page, limit, pages: Math.ceil(total / limit),
      results: filtered.slice(offset, offset + limit),
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 })
  }
}

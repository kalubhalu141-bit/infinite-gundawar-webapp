// ─────────────────────────────────────────────────────────────────────────────
//  /api/commercial-leads — Query the 100,000-row commercial lead database.
//  Free, fast, no key. Supports search + filters + pagination + aggregate stats.
//  ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { join } from 'node:path'

export const dynamic = 'force-dynamic'

// better-sqlite3 is a native module that does NOT run on Vercel's serverless
// runtime (no prebuilt binary for the lambda + ephemeral filesystem). We keep
// the import lazy and degrade gracefully so the route never crashes the deploy
// or the rest of the site — it returns an empty, clearly-labelled result.
let _db: any = null
let _dbError: string | null = null
function getDb(): any {
  if (_dbError) return null
  if (!_db) {
    try {
      // Lazy require so a missing native binding only fails this route.
      const Database = require('better-sqlite3')
      const p = join(process.cwd(), 'data', 'leads.db')
      _db = new Database(p, { readonly: true, fileMustExist: true })
      _db.pragma('journal_mode = WAL')
      _db.pragma('busy_timeout = 5000')
    } catch (e: any) {
      _dbError = e?.message || 'sqlite unavailable'
      _db = null
    }
  }
  return _db
}

function buildWhere(q: URLSearchParams): { where: string; params: any[] } {
  const clauses: string[] = []
  const params: any[] = []

  const txt = (q.get('q') || '').trim()
  if (txt) {
    clauses.push('(company LIKE ? OR name LIKE ? OR email LIKE ? OR phone LIKE ? OR city LIKE ? OR industry LIKE ? OR state LIKE ?)')
    const like = `%${txt}%`
    params.push(like, like, like, like, like, like, like)
  }
  const map: Record<string, string> = {
    city: 'city', state: 'state', country: 'country', category: 'category',
    industry: 'industry', quality: 'leadQuality', source: 'leadSource', businessType: 'businessType',
  }
  for (const [key, col] of Object.entries(map)) {
    const v = (q.get(key) || '').trim()
    if (v) { clauses.push(`${col} = ?`); params.push(v) }
  }
  const minScore = parseInt(q.get('minScore') || '', 10)
  if (!isNaN(minScore)) { clauses.push('leadScore >= ?'); params.push(minScore) }
  const verifiedOnly = q.get('verified') === '1'
  if (verifiedOnly) { clauses.push('verified = 1') }

  return { where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', params }
}

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams
    const db = getDb()
    if (!db) {
      // Graceful degradation (e.g. Vercel serverless where sqlite isn't available).
      const statsOnly = q.get('action') === 'stats'
      const notice = 'Lead database is unavailable in this environment (runs on the local deployment with better-sqlite3).'
      if (statsOnly) {
        return NextResponse.json({ ok: true, total: 0, verified: 0, avgScore: 0, byCategory: [], byCountry: [], topCities: [], notice })
      }
      return NextResponse.json({ ok: true, total: 0, page: 1, limit: 25, pages: 0, results: [], notice })
    }

    const { where, params } = buildWhere(q)

    const statsOnly = q.get('action') === 'stats'
    if (statsOnly) {
      const total = (db.prepare(`SELECT COUNT(*) c FROM leads ${where}`).get(...params) as any).c
      const byCat = db.prepare(`SELECT category, COUNT(*) c FROM leads ${where} GROUP BY category ORDER BY c DESC`).all(...params)
      const byCountry = db.prepare(`SELECT country, COUNT(*) c FROM leads ${where} GROUP BY country ORDER BY c DESC`).all(...params)
      const byCity = db.prepare(`SELECT city, COUNT(*) c FROM leads ${where} GROUP BY city ORDER BY c DESC LIMIT 12`).all(...params)
      const avg = (db.prepare(`SELECT AVG(leadScore) a, SUM(verified) v FROM leads ${where}`).get(...params) as any)
      return NextResponse.json({
        ok: true,
        total,
        verified: avg.v || 0,
        avgScore: Math.round((avg.a || 0) * 10) / 10,
        byCategory: byCat,
        byCountry: byCountry,
        topCities: byCity,
      })
    }

    const total = (db.prepare(`SELECT COUNT(*) c FROM leads ${where}`).get(...params) as any).c
    const page = Math.max(1, parseInt(q.get('page') || '1', 10))
    const limit = Math.min(200, Math.max(1, parseInt(q.get('limit') || '25', 10)))
    const offset = (page - 1) * limit
    const sort = q.get('sort') === 'score' ? 'leadScore DESC' : q.get('sort') === 'rating' ? 'googleRating DESC' : 'scrapedDate DESC'

    const rows = db.prepare(`SELECT * FROM leads ${where} ORDER BY ${sort} LIMIT ? OFFSET ?`).all(...params, limit, offset)
    return NextResponse.json({
      ok: true,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      results: rows,
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  /api/commercial-leads/export — Stream the matching 100k leads as CSV or JSON.
//  ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { join } from 'node:path'

export const dynamic = 'force-dynamic'

let _db: any = null
let _dbError: string | null = null
function getDb(): any {
  if (_dbError) return null
  if (!_db) {
    try {
      const Database = require('better-sqlite3')
      _db = new Database(join(process.cwd(), 'data', 'leads.db'), { readonly: true, fileMustExist: true })
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
  if (q.get('verified') === '1') clauses.push('verified = 1')
  return { where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', params }
}

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams
    const db = getDb()
    if (!db) {
      return NextResponse.json(
        { ok: false, error: 'Lead database unavailable in this environment (runs on the local deployment).' },
        { status: 200 },
      )
    }
    const { where, params } = buildWhere(q)
    const rows = db.prepare(`SELECT * FROM leads ${where} ORDER BY leadScore DESC LIMIT 100000`).all(...params) as any[]
    const format = (q.get('format') || 'csv').toLowerCase()

    if (format === 'json') {
      return new NextResponse(JSON.stringify(rows), {
        headers: { 'Content-Type': 'application/json', 'Content-Disposition': 'attachment; filename="commercial-leads.json"' },
      })
    }

    const cols = [
      'name', 'email', 'phone', 'whatsapp', 'company', 'industry', 'category', 'city', 'state', 'country',
      'address', 'pincode', 'website', 'linkedin', 'facebook', 'instagram', 'businessType', 'employeeCount',
      'annualRevenue', 'yearEstablished', 'leadScore', 'leadQuality', 'leadSource', 'googleRating', 'reviewCount', 'verified',
    ]
    const esc = (v: any) => {
      const s = v == null ? '' : String(v)
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    }
    const header = cols.join(',')
    const body = rows.map((r) => cols.map((c) => esc(r[c])).join(',')).join('\n')
    return new NextResponse(`${header}\n${body}`, {
      headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="commercial-leads.csv"' },
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 })
  }
}

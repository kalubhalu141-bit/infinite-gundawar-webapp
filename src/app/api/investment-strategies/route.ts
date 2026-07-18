import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
export const dynamic = 'force-dynamic'
function load(f: string) { return JSON.parse(readFileSync(join(process.cwd(), 'data', f), 'utf8')) }
export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams
    const all = load('investment-strategies.json')
    const minRoi = parseFloat(q.get('minRoi') || '0')
    const risk = (q.get('risk') || '').trim()
    const sort = q.get('sort') === 'roi' ? 'expectedRoi' : 'updated'
    let f = all.filter((s: any) => s.expectedRoi >= minRoi)
    if (risk) f = f.filter((s: any) => s.risk === risk)
    f = [...f].sort((a: any, b: any) => (sort === 'expectedRoi' ? b.expectedRoi - a.expectedRoi : b.updated.localeCompare(a.updated)))
    const total = f.length
    const page = Math.max(1, parseInt(q.get('page') || '1', 10))
    const limit = Math.min(60, Math.max(1, parseInt(q.get('limit') || '24', 10)))
    return NextResponse.json({ ok: true, total, count: all.length, page, limit, results: f.slice((page - 1) * limit, (page - 1) * limit + limit) })
  } catch (e: any) { return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 }) }
}

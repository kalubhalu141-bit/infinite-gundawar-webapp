import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
export const dynamic = 'force-dynamic'
function load(f: string) { return JSON.parse(readFileSync(join(process.cwd(), 'data', f), 'utf8')) }
export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams
    const all = load('education-careers.json')
    const field = (q.get('field') || '').trim().toLowerCase()
    const country = (q.get('country') || '').trim().toLowerCase()
    const remote = q.get('remote') === '1'
    let f = all
    if (field) f = f.filter((e: any) => e.field.toLowerCase().includes(field))
    if (country) f = f.filter((e: any) => e.country.toLowerCase().includes(country))
    if (remote) f = f.filter((e: any) => e.remote)
    f = [...f].sort((a: any, b: any) => b.avgSalaryUSD - a.avgSalaryUSD)
    const total = f.length
    const page = Math.max(1, parseInt(q.get('page') || '1', 10))
    const limit = Math.min(60, Math.max(1, parseInt(q.get('limit') || '30', 10)))
    return NextResponse.json({ ok: true, total, count: all.length, fields: Array.from(new Set(all.map((e: any) => e.field))), countries: Array.from(new Set(all.map((e: any) => e.country))), page, limit, results: f.slice((page - 1) * limit, (page - 1) * limit + limit) })
  } catch (e: any) { return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 }) }
}

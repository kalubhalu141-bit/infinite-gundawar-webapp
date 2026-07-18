import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
export const dynamic = 'force-dynamic'
function load(f: string) { return JSON.parse(readFileSync(join(process.cwd(), 'data', f), 'utf8')) }
export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams
    const all = load('properties.json')
    const city = (q.get('city') || '').trim().toLowerCase()
    const type = (q.get('type') || '').trim().toLowerCase()
    const onlyNew = q.get('new') === '1'
    let f = all
    if (city) f = f.filter((p: any) => p.city.toLowerCase().includes(city))
    if (type) f = f.filter((p: any) => p.type.toLowerCase().includes(type))
    if (onlyNew) f = f.filter((p: any) => p.listedToday)
    f = [...f].sort((a: any, b: any) => b.posted.localeCompare(a.posted))
    const total = f.length
    const page = Math.max(1, parseInt(q.get('page') || '1', 10))
    const limit = Math.min(60, Math.max(1, parseInt(q.get('limit') || '24', 10)))
    return NextResponse.json({ ok: true, total, count: all.length, cities: Array.from(new Set(all.map((p: any) => p.city))), page, limit, results: f.slice((page - 1) * limit, (page - 1) * limit + limit) })
  } catch (e: any) { return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 }) }
}

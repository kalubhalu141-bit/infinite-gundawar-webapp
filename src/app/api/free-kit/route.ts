import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
export const dynamic = 'force-dynamic'
function load(f: string) { return JSON.parse(readFileSync(join(process.cwd(), 'data', f), 'utf8')) }
export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams
    const all = load('free-kit.json')
    const cat = (q.get('category') || '').trim()
    const tag = (q.get('tag') || '').trim()
    let f = all
    if (cat) f = f.filter((k: any) => k.category === cat)
    if (tag) f = f.filter((k: any) => k.tag === tag)
    f = [...f].sort((a: any, b: any) => b.day.localeCompare(a.day))
    const total = f.length
    const page = Math.max(1, parseInt(q.get('page') || '1', 10))
    const limit = Math.min(60, Math.max(1, parseInt(q.get('limit') || '30', 10)))
    return NextResponse.json({ ok: true, total, count: all.length, categories: Array.from(new Set(all.map((k: any) => k.category))), page, limit, results: f.slice((page - 1) * limit, (page - 1) * limit + limit) })
  } catch (e: any) { return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 }) }
}

import { NextRequest, NextResponse } from 'next/server'
import { searchDoctors, getFacets } from '@/lib/doctor-index'

// GET /api/doctors — search the real, accumulated doctor index.
// Query params: country, state, district, city, specialty, q, limit, offset, facets=1
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const facets = url.searchParams.get('facets') === '1'
    const q = {
      country: url.searchParams.get('country') || undefined,
      state: url.searchParams.get('state') || undefined,
      district: url.searchParams.get('district') || undefined,
      city: url.searchParams.get('city') || undefined,
      specialty: url.searchParams.get('specialty') || undefined,
      q: url.searchParams.get('q') || undefined,
      limit: Math.min(parseInt(url.searchParams.get('limit') || '50'), 200),
      offset: parseInt(url.searchParams.get('offset') || '0'),
    }
    const { doctors, total, stats } = searchDoctors(q)
    const body: any = { doctors, total, stats }
    if (facets) body.facets = getFacets()
    return NextResponse.json(body, { headers: { 'Cache-Control': 'public, max-age=30' } })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

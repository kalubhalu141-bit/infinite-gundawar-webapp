import { NextRequest, NextResponse } from 'next/server'
import { getLeadsByFilter } from '@/lib/leads-db'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const format = url.searchParams.get('format') || 'csv'
    const search = url.searchParams.get('search') || undefined
    const source = url.searchParams.get('source') || undefined
    const city = url.searchParams.get('city') || undefined

    const leads = await getLeadsByFilter(search, source, city)

    if (format === 'json') {
      return new NextResponse(JSON.stringify(leads, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename="leads.json"',
        },
      })
    }

    // CSV
    const headers = ['id', 'name', 'email', 'phone', 'company', 'city', 'source', 'verified', 'created_at']
    const csvRows = [headers.join(',')]
    for (const lead of leads) {
      csvRows.push(
        headers.map((h) => {
          const val = (lead as any)[h]
          const str = String(val ?? '')
          return str.includes(',') || str.includes('"') || str.includes('\n')
            ? `"${str.replace(/"/g, '""')}"`
            : str
        }).join(',')
      )
    }

    return new NextResponse(csvRows.join('\n'), {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="leads.csv"',
      },
    })
  } catch (err: any) {
    console.error('Export error:', err)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}

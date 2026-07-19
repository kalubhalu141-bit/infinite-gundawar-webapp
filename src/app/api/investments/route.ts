import { NextResponse } from 'next/server'
import strat from '@/../data/investment-strategies.json'

export const dynamic = 'force-static'

export function GET() {
  return NextResponse.json({ count: strat.length, data: strat })
}

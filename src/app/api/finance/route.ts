import { NextResponse } from 'next/server'
import calc from '@/../data/finance-calculators.json'

export const dynamic = 'force-static'

export function GET() {
  return NextResponse.json({ count: calc.length, data: calc })
}

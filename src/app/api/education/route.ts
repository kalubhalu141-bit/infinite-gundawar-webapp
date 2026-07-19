import { NextResponse } from 'next/server'
import edu from '@/../data/education-careers.json'

export const dynamic = 'force-static'

export function GET() {
  return NextResponse.json({ count: edu.length, data: edu })
}

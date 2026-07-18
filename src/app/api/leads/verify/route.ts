import { NextRequest, NextResponse } from 'next/server'
import { verifyLead } from '@/lib/leads-db'
import { sendWelcomeEmail } from '@/lib/email'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(`${url.origin}/free-business-kit?error=invalid`)
  }

  try {
    const lead = await verifyLead(token)

    if (!lead) {
      return NextResponse.redirect(`${url.origin}/free-business-kit?error=invalid`)
    }

    // Send welcome email with download link
    sendWelcomeEmail(lead.id, lead.name, lead.email).catch((err) => {
      console.error('Failed to send welcome email:', err.message)
    })

    return NextResponse.redirect(`${url.origin}/free-business-kit?verified=true`)
  } catch (err: any) {
    console.error('Verification error:', err)
    return NextResponse.redirect(`${url.origin}/free-business-kit?error=server`)
  }
}

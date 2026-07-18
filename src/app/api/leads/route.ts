import { NextRequest, NextResponse } from 'next/server'
import { insertLead, getLeads, deleteLead, getStats, checkRateLimit } from '@/lib/leads-db'
import { sendVerificationEmail } from '@/lib/email'

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders() })
}

// POST — Create a new lead
export async function POST(req: NextRequest) {
  try {
    // Rate limiting by IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'
    const ua = req.headers.get('user-agent') || ''
    const rateCheck = checkRateLimit(ip, 5, 15)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in 15 minutes.' },
        { status: 429, headers: corsHeaders() }
      )
    }

    const body = await req.json()
    const { name, email, phone, company, city, source, interests, message, website } = body

    // Honeypot check — if hidden "website" field is filled, it's a bot
    if (website) {
      return NextResponse.json({ success: true, message: 'Thank you!' }, { headers: corsHeaders() })
    }

    // Validation
    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400, headers: corsHeaders() })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400, headers: corsHeaders() })
    }

    if (name.trim().length < 2 || name.trim().length > 100) {
      return NextResponse.json({ error: 'Please enter a valid name' }, { status: 400, headers: corsHeaders() })
    }

    // Insert lead
    let result
    try {
      result = await insertLead({
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || '',
        company: company?.trim() || '',
        city: city?.trim() || '',
        source: source || 'website',
        interests: interests || [],
        message: message?.trim() || '',
        ip,
        user_agent: ua,
      })
    } catch (insertErr: any) {
      console.error('Insert lead error:', JSON.stringify(insertErr, null, 2))
      console.error('Error message:', insertErr?.message)
      console.error('Error code:', insertErr?.code)
      console.error('Supabase URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.error('Supabase key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      return NextResponse.json(
        { error: `Insert failed: ${insertErr?.message || 'Unknown error'}` },
        { status: 500, headers: corsHeaders() }
      )
    }

    // Send verification email (async — don't block response)
    if (result.token) {
      sendVerificationEmail(result.id, name.trim(), result.email, result.token).catch((err) => {
        console.error('Failed to send verification email:', err.message)
      })
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Please check your email to verify and download your kit.',
        leadId: result.id,
      },
      { status: 201, headers: corsHeaders() }
    )
  } catch (err: any) {
    console.error('Lead creation error:', err)
    if (err.message?.includes('already registered')) {
      return NextResponse.json(
        { error: 'This email is already registered. Check your inbox for the download link.' },
        { status: 409, headers: corsHeaders() }
      )
    }
    if (err.message?.includes('SQL setup')) {
      return NextResponse.json(
        { error: 'Database not set up yet. Run the Supabase SQL migration first.' },
        { status: 503, headers: corsHeaders() }
      )
    }
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500, headers: corsHeaders() }
    )
  }
}

// GET — List leads (with search/filter/pagination)
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 500)
    const search = url.searchParams.get('search') || undefined
    const source = url.searchParams.get('source') || undefined
    const city = url.searchParams.get('city') || undefined
    const action = url.searchParams.get('action')

    if (action === 'stats') {
      const stats = await getStats()
      return NextResponse.json(stats, { headers: corsHeaders() })
    }

    const result = await getLeads(page, limit, search, source, city)
    return NextResponse.json(result, { headers: corsHeaders() })
  } catch (err: any) {
    console.error('Lead fetch error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: corsHeaders() })
  }
}

// DELETE — Remove a lead
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Lead ID required' }, { status: 400, headers: corsHeaders() })
    }
    const deleted = await deleteLead(id)
    if (!deleted) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404, headers: corsHeaders() })
    }
    return NextResponse.json({ success: true }, { headers: corsHeaders() })
  } catch (err: any) {
    console.error('Lead delete error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: corsHeaders() })
  }
}

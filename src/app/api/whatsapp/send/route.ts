import { NextRequest, NextResponse } from 'next/server'

// ─── Phone validation for Indian numbers ───
function validateIndianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
  const pattern = /^(\+91)?[6-9]\d{9}$/
  return pattern.test(cleaned)
}

// ─── Format phone to international ───
function formatPhone(phone: string): string {
  let cleaned = phone.replace(/[\s\-\(\)]/g, '')
  if (cleaned.startsWith('+91')) return cleaned
  if (cleaned.startsWith('91') && cleaned.length === 12) return '+' + cleaned
  if (cleaned.length === 10) return '+91' + cleaned
  return cleaned
}

// ─── Generate WhatsApp click-to-chat URL ───
function generateWhatsAppUrl(phone: string, message: string): string {
  const formatted = formatPhone(phone).replace('+', '')
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${formatted}?text=${encoded}`
}

// ─── POST: Send WhatsApp message (generates link / simulates API) ───
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { apiKey, phone, message, templateName, templateParams, mediaUrl } = body

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 })
    }
    if (!message && !templateName) {
      return NextResponse.json({ success: false, error: 'Message or template name is required' }, { status: 400 })
    }

    if (!validateIndianPhone(phone)) {
      return NextResponse.json({ success: false, error: 'Invalid Indian phone number. Format: +91XXXXXXXXXX or 10-digit number' }, { status: 400 })
    }

    const formattedPhone = formatPhone(phone)
    const waUrl = generateWhatsAppUrl(phone, message || '')

    // If API key is provided, simulate WhatsApp Business API call
    if (apiKey) {
      // In production, this would call the actual WhatsApp Business API
      // For now, return the click-to-chat link and simulated response
      return NextResponse.json({
        success: true,
        message: 'WhatsApp message ready to send',
        data: {
          phone: formattedPhone,
          waUrl,
          messageId: `wa_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
          status: 'queued',
          timestamp: new Date().toISOString(),
          method: 'whatsapp_business_api',
        },
      })
    }

    // No API key — return click-to-chat link
    return NextResponse.json({
      success: true,
      message: 'WhatsApp click-to-chat link generated',
      data: {
        phone: formattedPhone,
        waUrl,
        method: 'click_to_chat',
        note: 'Open this link in browser to start WhatsApp conversation',
      },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 })
  }
}

// ─── GET: Generate WhatsApp link ───
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const phone = searchParams.get('phone')
  const message = searchParams.get('message') || ''

  if (!phone) {
    return NextResponse.json({ error: 'Phone parameter is required' }, { status: 400 })
  }

  if (!validateIndianPhone(phone)) {
    return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
  }

  const waUrl = generateWhatsAppUrl(phone, message)

  return NextResponse.json({
    success: true,
    phone: formatPhone(phone),
    waUrl,
    message: decodeURIComponent(message),
  })
}

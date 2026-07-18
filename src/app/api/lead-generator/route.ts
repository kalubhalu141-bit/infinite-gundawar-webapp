import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { LEAD_STRATEGIES, scoreLead, getDailyLeadTarget, type LeadRecord } from '@/lib/lead-engine'

const SERPER_API_URL = 'https://google.serper.dev/search'

// ─── Phone Extraction ───
function extractPhones(text: string): string[] {
  const patterns = [/\+\d{1,3}[-.\s]?\d{2,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g, /(?<!\d)[6-9]\d{9}(?!\d)/g, /1[-.\s]?(?:800|888|877|866|855|844|833)[-.\s]?\d{3}[-.\s]?\d{4}/g]
  const phones = new Set<string>()
  for (const pat of patterns) {
    const matches = text.match(pat)
    if (matches) for (const m of matches) {
      let normalized = m.replace(/[^\d+]/g, '')
      if (normalized.startsWith('0') && !normalized.startsWith('00')) normalized = normalized.substring(1)
      if (normalized.length >= 7 && normalized.length <= 16) phones.add(normalized)
    }
  }
  return Array.from(phones)
}

// ─── Email Extraction ───
function extractEmails(text: string): string[] {
  const m = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)
  return m ? Array.from(new Set(m)) : []
}

// ─── Address Extraction ───
function extractAddress(text: string): string {
  const patterns = [/(?:address|located|clinic at|hospital at|centre at|center at)[:\s]*([^.\n]{10,200})/i, /(\d+\s+[\w\s]+(?:road|street|lane|nagar|colony|market|complex|building|floor|flat|shop|chamber|clinic|hospital|centre|center|chowk|cross|main|layout|extension|phase|sector|block|area|district|state|pin|pincode)[^.\n]{0,100})/i]
  for (const pat of patterns) {
    const match = text.match(pat)
    if (match) return match[1].trim()
  }
  return ''
}

// ─── Social Media Extraction ───
function extractSocial(text: string): Record<string, string> {
  const social: Record<string, string> = {}
  const patterns: Record<string, RegExp> = {
    linkedin: /linkedin\.com\/[^\s"'<>]+/i,
    facebook: /(?:facebook\.com|fb\.com)\/[^\s"'<>]+/i,
    instagram: /instagram\.com\/[^\s"'<>]+/i,
    twitter: /(?:twitter\.com|x\.com)\/[^\s"'<>]+/i,
    whatsapp: /wa\.me\/\d+/i,
  }
  for (const [platform, pat] of Object.entries(patterns)) {
    const match = text.match(pat)
    if (match) social[platform] = match[0]
  }
  return social
}

// ─── Serper Search ───
async function searchSerper(query: string, apiKey: string): Promise<any> {
  const res = await fetch(SERPER_API_URL, {
    method: 'POST',
    headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: query, num: 100 }),
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`Serper ${res.status}`)
  return res.json()
}

// ─── Process Single Strategy ───
async function processStrategy(strategy: typeof LEAD_STRATEGIES[0], apiKey: string): Promise<LeadRecord[]> {
  const leads: LeadRecord[] = []
  const seen = new Set<string>()
  const now = new Date().toISOString()

  const locations = strategy.cities || strategy.countries || ['']

  for (const location of locations) {
    for (const queryTemplate of strategy.queries) {
      const query = queryTemplate.replace('{city}', location).replace('{country}', location)
      try {
        const data = await searchSerper(query, apiKey)

        for (const item of (data.organic || [])) {
          const text = `${item.title} ${item.snippet || ''} ${item.link || ''}`
          const key = `${item.title}_${item.link}`
          if (seen.has(key)) continue
          seen.add(key)

          const phones = extractPhones(text)
          const emails = extractEmails(text)
          const address = extractAddress(text)
          const social = extractSocial(text)

          const lead: LeadRecord = {
            name: item.title || '',
            email: emails[0] || '',
            phone: phones[0] || '',
            whatsapp: social.whatsapp || '',
            website: item.link || '',
            company: item.title || '',
            industry: strategy.category,
            category: strategy.category,
            city: location,
            state: '',
            country: strategy.countries ? location : 'India',
            address,
            pincode: '',
            linkedin: social.linkedin || '',
            facebook: social.facebook || '',
            instagram: social.instagram || '',
            twitter: social.twitter || '',
            businessType: strategy.name,
            employeeCount: '',
            annualRevenue: '',
            yearEstablished: '',
            services: [],
            leadScore: 0,
            leadQuality: 'cold',
            leadSource: strategy.id,
            leadCategory: strategy.category,
            specialty: '',
            ayurvedaServices: [],
            bamsDegree: text.toLowerCase().includes('bams') || text.toLowerCase().includes('ayurved'),
            panchakarmaAvailable: text.toLowerCase().includes('panchakarma'),
            hasWebsite: !!item.link,
            googleRating: 0,
            reviewCount: 0,
            scrapedDate: now,
            verified: false,
            notes: item.snippet || '',
          }

          const scoring = scoreLead(lead)
          lead.leadScore = scoring.score
          lead.leadQuality = scoring.quality

          leads.push(lead)
        }
      } catch { /* skip failed queries */ }
    }
  }

  return leads
}

// ─── Generate Excel File ───
function generateExcel(leads: LeadRecord[]): Buffer {
  const worksheet = XLSX.utils.json_to_sheet(leads.map(l => ({
    'Name': l.name,
    'Email': l.email,
    'Phone': l.phone,
    'WhatsApp': l.whatsapp,
    'Website': l.website,
    'Company': l.company,
    'Industry': l.industry,
    'Category': l.category,
    'City': l.city,
    'State': l.state,
    'Country': l.country,
    'Address': l.address,
    'LinkedIn': l.linkedin,
    'Facebook': l.facebook,
    'Instagram': l.instagram,
    'Twitter': l.twitter,
    'Business Type': l.businessType,
    'Lead Score': l.leadScore,
    'Lead Quality': l.leadQuality,
    'Lead Source': l.leadSource,
    'Specialty': l.specialty,
    'BAMS Degree': l.bamsDegree ? 'Yes' : 'No',
    'Panchakarma': l.panchakarmaAvailable ? 'Yes' : 'No',
    'Has Website': l.hasWebsite ? 'Yes' : 'No',
    'Google Rating': l.googleRating,
    'Reviews': l.reviewCount,
    'Verified': l.verified ? 'Yes' : 'No',
    'Notes': l.notes,
    'Scraped Date': l.scrapedDate,
  })))

  // Set column widths
  worksheet['!cols'] = [
    { wch: 30 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 40 },
    { wch: 30 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 },
    { wch: 15 }, { wch: 40 }, { wch: 30 }, { wch: 30 }, { wch: 30 },
    { wch: 20 }, { wch: 20 }, { wch: 10 }, { wch: 12 }, { wch: 20 },
    { wch: 20 }, { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 10 },
    { wch: 5 }, { wch: 8 }, { wch: 10 }, { wch: 50 }, { wch: 20 },
  ]

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads')

  // Add summary sheet
  const summary = [
    { 'Metric': 'Total Leads', 'Value': leads.length },
    { 'Metric': 'Hot Leads', 'Value': leads.filter(l => l.leadQuality === 'hot').length },
    { 'Metric': 'Warm Leads', 'Value': leads.filter(l => l.leadQuality === 'warm').length },
    { 'Metric': 'Cold Leads', 'Value': leads.filter(l => l.leadQuality === 'cold').length },
    { 'Metric': 'With Phone', 'Value': leads.filter(l => l.phone).length },
    { 'Metric': 'With Email', 'Value': leads.filter(l => l.email).length },
    { 'Metric': 'With Website', 'Value': leads.filter(l => l.website).length },
    { 'Metric': 'With Address', 'Value': leads.filter(l => l.address).length },
    { 'Metric': 'BAMS Doctors', 'Value': leads.filter(l => l.bamsDegree).length },
    { 'Metric': 'Panchakarma Centers', 'Value': leads.filter(l => l.panchakarmaAvailable).length },
    { 'Metric': 'Generated On', 'Value': new Date().toISOString() },
  ]
  const summarySheet = XLSX.utils.json_to_sheet(summary)
  summarySheet['!cols'] = [{ wch: 25 }, { wch: 20 }]
  XLSX.utils.book_append_sheet(workbook, summary, 'Summary')

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer
}

// ─── Main Handler ───
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { strategies: strategyIds, maxLeads = 10000 } = body

    const apiKey = process.env.SERPER_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'SERPER_API_KEY not configured' }, { status: 500 })

    // Get strategies to run
    const strategies = strategyIds
      ? LEAD_STRATEGIES.filter(s => strategyIds.includes(s.id) && s.enabled)
      : LEAD_STRATEGIES.filter(s => s.enabled)

    const allLeads: LeadRecord[] = []
    const errors: string[] = []

    for (const strategy of strategies) {
      try {
        const leads = await processStrategy(strategy, apiKey)
        allLeads.push(...leads)
        if (allLeads.length >= maxLeads) break
      } catch (e) {
        errors.push(`${strategy.id}: ${e instanceof Error ? e.message : 'error'}`)
      }
    }

    // Deduplicate
    const uniqueLeads = Array.from(new Map(allLeads.map(l => [`${l.name}_${l.website}`, l])).values())

    // Sort by lead score
    uniqueLeads.sort((a, b) => b.leadScore - a.leadScore)

    // Generate Excel
    const excelBuffer = generateExcel(uniqueLeads.slice(0, maxLeads))

    // Return Excel file
    return new Response(excelBuffer as any, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=leads_${new Date().toISOString().split('T')[0]}_${uniqueLeads.length}.xlsx`,
      },
    })
  } catch (error) {
    console.error('Lead Generation API error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

// ─── Get Lead Generation Status ───
export async function GET() {
  const target = getDailyLeadTarget()
  const strategies = LEAD_STRATEGIES.filter(s => s.enabled)

  return NextResponse.json({
    status: 'ready',
    dailyTarget: target,
    activeStrategies: strategies.length,
    strategies: strategies.map(s => ({
      id: s.id,
      name: s.name,
      category: s.category,
      priority: s.priority,
    })),
    lastRun: null,
    nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  })
}

import { NextRequest, NextResponse } from 'next/server'
import { appendDoctors, type Doctor } from '@/lib/doctor-index'

const SERPER_API_URL = 'https://google.serper.dev/search'

// ─── Phone Extraction (same as phone-scraper) ───
function extractAllPhones(text: string): { phone: string; type: string; confidence: number }[] {
  const results: { phone: string; type: string; confidence: number }[] = []
  const seen = new Set<string>()
  const addPhone = (raw: string, type: string, confidence: number) => {
    let normalized = raw.replace(/[^\d+]/g, '')
    if (normalized.startsWith('0') && !normalized.startsWith('00')) normalized = normalized.substring(1)
    if (seen.has(normalized) || normalized.length < 7 || normalized.length > 16) return
    seen.add(normalized)
    results.push({ phone: normalized, type, confidence })
  }
  const intl = text.match(/\+\d{1,3}[-.\s]?\d{2,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g)
  if (intl) for (const m of intl) addPhone(m, 'international', 95)
  const telLinks = text.match(/(?:tel|phone|call|contact|mobile|whatsapp|fax)[\s:+]*([+\d\s().-]{8,20})/gi)
  if (telLinks) for (const m of telLinks) { const num = m.replace(/^(tel|phone|call|contact|mobile|whatsapp|fax)[\s:+]*/i, ''); addPhone(num, 'tel_link', 98) }
  const indianIntl = text.match(/\+91[-\s]?\d{5}[-\s]?\d{5}/g)
  if (indianIntl) for (const m of indianIntl) addPhone(m, 'indian_intl', 95)
  const indianMobile = text.match(/(?<!\d)[6-9]\d{9}(?!\d)/g)
  if (indianMobile) for (const m of indianMobile) addPhone('+91' + m, 'indian_mobile', 85)
  const usPhone = text.match(/\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g)
  if (usPhone) for (const m of usPhone) { const d = m.replace(/\D/g, ''); if (d.length === 10) addPhone('+1' + d, 'us_phone', 90) }
  const ukPhone = text.match(/\+?44[-\s]?\d{4}[-\s]?\d{6}/g)
  if (ukPhone) for (const m of ukPhone) addPhone(m, 'uk_phone', 90)
  const whatsapp = text.match(/whatsapp[\s:+]*([+\d\s().-]{8,20})/gi)
  if (whatsapp) for (const m of whatsapp) { const num = m.replace(/whatsapp[\s:+]*/i, ''); addPhone(num, 'whatsapp', 95) }
  return results.sort((a, b) => b.confidence - a.confidence)
}

function extractEmails(text: string): string[] {
  const m = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)
  return m ? Array.from(new Set(m)).slice(0, 10) : []
}

function extractAddress(text: string): string {
  // Try to extract address patterns
  const addressPatterns = [
    /(?:address|located|located at|clinic at| hospital at|centre at|center at)[:\s]*([^.\n]{10,200})/i,
    /(\d+\s+[\w\s]+(?:road|street|lane|nagar|colony|market|complex|building|floor|flat|shop|chamber|clinic|hospital|centre|center|chowk|cross|main|layout|extension|phase|sector|block|area|district|state|pin|pincode)[^.\n]{0,100})/i,
    /(?:pin|pincode|zip|postal code)[:\s]*(\d{5,8})/i,
  ]
  for (const pat of addressPatterns) {
    const match = text.match(pat)
    if (match) return match[1].trim()
  }
  return ''
}

// ─── Ayurveda-Specific Query Builder ───
function buildAyurvedaQueries(specialty: string, location: string, country: string): string[] {
  const queries: string[] = []
  const loc = location || ''
  const ctry = country || ''

  // Core Ayurveda doctor queries
  const baseTerms = [
    'ayurveda doctor', 'ayurvedic physician', 'ayurveda practitioner',
    'BAMS doctor', 'ayurveda consultant', 'ayurvedic specialist',
    'ayurveda clinic', 'ayurvedic hospital', 'ayurveda centre',
    'panchakarma doctor', 'ayurveda vaidya', 'ayurvedic healer',
  ]

  const specialtyTerms: Record<string, string[]> = {
    'panchakarma': ['panchakarma doctor', 'panchakarma specialist', 'panchakarma therapist', 'panchakarma clinic'],
    'skin': ['ayurveda skin doctor', 'ayurvedic dermatology', 'ayurveda skin specialist', 'ayurveda skin clinic'],
    'ortho': ['ayurveda ortho doctor', 'ayurvedic bone specialist', 'ayurveda joint pain', 'ayurveda spine'],
    'neuro': ['ayurveda neuro doctor', 'ayurvedic neurology', 'ayurveda brain specialist', 'ayurveda migraine'],
    'digestive': ['ayurveda digestive doctor', 'ayurvedic gastroenterologist', 'ayurveda stomach specialist'],
    'women': ['ayurveda women doctor', 'ayurvedic gynecologist', 'ayurveda pregnancy', 'ayurveda fertility'],
    'child': ['ayurveda child doctor', 'ayurvedic pediatrician', 'ayurveda bal chikitsa'],
    'mental': ['ayurveda mental health', 'ayurvedic psychiatrist', 'ayurveda anxiety', 'ayurveda depression'],
    'diabetes': ['ayurveda diabetes doctor', 'ayurvedic diabetes specialist', 'ayurveda madhumeha'],
    'heart': ['ayurveda heart doctor', 'ayurvedic cardiology', 'ayurveda hridroga'],
    'kidney': ['ayurveda kidney doctor', 'ayurvedic nephrology', 'ayurveda mutra roga'],
    'liver': ['ayurveda liver doctor', 'ayurvedic hepatology', 'ayurveda yakrit roga'],
    'cancer': ['ayurveda cancer doctor', 'ayurvedic oncology', 'ayurveda arbuda'],
    'arthritis': ['ayurveda arthritis doctor', 'ayurvedic rheumatology', 'ayurveda amavata'],
    'asthma': ['ayurveda asthma doctor', 'ayurvedic pulmonology', 'ayurveda shwasa roga'],
    'general': ['ayurveda doctor', 'ayurvedic physician', 'BAMS doctor', 'ayurveda clinic'],
  }

  const terms = specialty && specialtyTerms[specialty] ? specialtyTerms[specialty] : baseTerms

  for (const term of terms) {
    if (loc) {
      queries.push(`${term} in ${loc} phone number`)
      queries.push(`${term} in ${loc} contact number`)
      queries.push(`${term} in ${loc} address`)
      queries.push(`${term} ${loc} call now`)
      queries.push(`${term} ${loc} clinic phone`)
    }
    if (ctry && ctry !== loc) {
      queries.push(`${term} in ${ctry} phone number`)
      queries.push(`${term} in ${ctry} contact`)
    }
    queries.push(`${term} phone number contact`)
    queries.push(`${term} near me phone`)
  }

  // India-specific directories
  if (!ctry || ctry === 'India') {
    const indiaDirs = [
      'site:practo.com ayurveda doctor',
      'site:lybrate.com ayurveda doctor',
      'site:justdial.com ayurveda doctor',
      'site:sulekha.com ayurveda doctor',
      'site:indiamart.com ayurveda doctor',
      'site:ayush.gov.in ayurveda doctor',
      'ayurveda doctor site:google.com/maps',
      'ayurvedic doctor site:google.com/maps',
      'BAMS doctor site:google.com/maps',
      'panchakarma centre site:google.com/maps',
    ]
    for (const dir of indiaDirs) {
      queries.push(loc ? `${dir} ${loc}` : dir)
    }
  }

  // Global directories
  const globalDirs = [
    'site:google.com/maps ayurveda doctor',
    'site:yelp.com ayurveda doctor',
    'site:healthgrades.com ayurveda',
    'site:webmd.com ayurveda doctor',
    'ayurveda doctor site:google.com',
    'ayurvedic physician site:google.com',
    'BAMS doctor site:google.com',
  ]
  for (const dir of globalDirs) {
    queries.push(loc ? `${dir} ${loc}` : dir)
  }

  return Array.from(new Set(queries)).slice(0, 100)
}

// ─── Serper Search ───
async function searchSerper(query: string, apiKey: string, num: number = 100): Promise<any> {
  const res = await fetch(SERPER_API_URL, {
    method: 'POST',
    headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: query, num: Math.min(num, 100) }),
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`Serper ${res.status}`)
  return res.json()
}

// ─── Main Handler ───
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { specialty, location, country, targetCount = 10000, maxConcurrent = 5 } = body

    const apiKey = process.env.SERPER_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'SERPER_API_KEY not configured' }, { status: 500 })

    const queries = buildAyurvedaQueries(specialty || 'general', location || '', country || 'India')

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const allDoctors = new Map<string, any>()
        const seenWebsites = new Set<string>()
        let totalProcessed = 0

        controller.enqueue(encoder.encode(JSON.stringify({
          type: 'status',
          message: `Ayurveda Doctor Scraper: ${queries.length} queries generated. Searching for ${specialty || 'ayurveda'} doctors in ${location || country || 'India'}...`,
          totalQueries: queries.length,
          targetCount,
        }) + '\n'))

        for (let i = 0; i < queries.length; i += maxConcurrent) {
          const batch = queries.slice(i, i + maxConcurrent)

          await Promise.all(batch.map(async (searchQuery) => {
            try {
              const data = await searchSerper(searchQuery, apiKey, 100)
              const now = new Date().toISOString()

              for (const item of (data.organic || [])) {
                const text = `${item.title} ${item.snippet || ''} ${item.link || ''}`
                const phones = extractAllPhones(text)
                const emails = extractEmails(text)
                const address = extractAddress(text)

                if (phones.length === 0 && !address) continue

                const key = `${item.title}_${item.link}`
                if (allDoctors.has(key)) {
                  // Merge additional phones
                  const existing = allDoctors.get(key)
                  for (const p of phones) {
                    if (!existing.phones.find((ep: any) => ep.phone === p.phone)) {
                      existing.phones.push(p)
                    }
                  }
                  if (address && !existing.address) existing.address = address
                  if (emails.length > 0 && existing.emails.length === 0) existing.emails = emails
                } else {
                  allDoctors.set(key, {
                    name: item.title || '',
                    phones,
                    emails,
                    address,
                    website: item.link || '',
                    snippet: item.snippet || '',
                    specialty: specialty || 'ayurveda',
                    source: 'google_search',
                    scrapedDate: now,
                  })
                }
              }

              totalProcessed++
              const doctorResults = Array.from(allDoctors.values())
              controller.enqueue(encoder.encode(JSON.stringify({
                type: 'progress',
                query: searchQuery,
                queriesProcessed: totalProcessed,
                totalQueries: queries.length,
                doctorsFound: doctorResults.length,
                targetCount,
                percentComplete: Math.round((totalProcessed / queries.length) * 100),
                latestDoctors: doctorResults.slice(-5),
              }) + '\n'))

              await new Promise(r => setTimeout(r, 300))
            } catch {
              totalProcessed++
            }
          }))

          await new Promise(r => setTimeout(r, 500))

          if (allDoctors.size >= targetCount) {
            controller.enqueue(encoder.encode(JSON.stringify({
              type: 'status',
              message: `Target reached! Found ${allDoctors.size} doctors. Stopping...`,
            }) + '\n'))
            break
          }
        }

        const finalDoctors = Array.from(allDoctors.values())
          .filter(d => d.phones.length > 0 || d.address)
          .sort((a, b) => b.phones.length - a.phones.length)

        // Persist real doctors into the accumulating index (dedupe + merge).
        let persist = { added: 0, total: 0 }
        try {
          persist = appendDoctors(finalDoctors as Doctor[])
        } catch (e) {
          console.error('[doctor-index] persist failed', e)
        }

        const stats = {
          total: finalDoctors.length,
          withPhone: finalDoctors.filter(d => d.phones.length > 0).length,
          withEmail: finalDoctors.filter(d => d.emails.length > 0).length,
          withAddress: finalDoctors.filter(d => d.address).length,
          withMultiplePhones: finalDoctors.filter(d => d.phones.length > 1).length,
          highConfidence: finalDoctors.filter(d => d.phones.some((p: any) => p.confidence >= 90)).length,
          indiaDoctors: finalDoctors.filter(d => d.phones.some((p: any) => p.phone.startsWith('+91'))).length,
          internationalDoctors: finalDoctors.filter(d => d.phones.some((p: any) => !p.phone.startsWith('+91'))).length,
          specialties: Array.from(new Set(finalDoctors.map(d => d.specialty).filter(Boolean))),
        }

        controller.enqueue(encoder.encode(JSON.stringify({
          type: 'complete',
          message: `Ayurveda doctor search complete! Found ${finalDoctors.length.toLocaleString()} doctors this run. Indexed total: ${persist.total.toLocaleString()} real doctors (${persist.added} new).`,
          stats,
          indexedTotal: persist.total,
          doctors: finalDoctors,
        }) + '\n'))

        controller.close()
      },
    })

    return new Response(stream, {
      headers: { 'Content-Type': 'application/x-ndjson', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' },
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

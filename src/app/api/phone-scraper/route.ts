import { NextRequest, NextResponse } from 'next/server'

const SERPER_API_URL = 'https://google.serper.dev/search'

// ─── Advanced Phone Extraction ───
function extractAllPhones(text: string): { phone: string; type: string; confidence: number }[] {
  const results: { phone: string; type: string; confidence: number }[] = []
  const seen = new Set<string>()

  // Helper to normalize and add phone
  const addPhone = (raw: string, type: string, confidence: number) => {
    // Normalize: remove all non-digit except +
    let normalized = raw.replace(/[^\d+]/g, '')
    // Remove leading 0 for international
    if (normalized.startsWith('0') && !normalized.startsWith('00')) {
      normalized = normalized.substring(1)
    }
    // Deduplicate
    if (seen.has(normalized)) return
    if (normalized.length < 7 || normalized.length > 16) return
    seen.add(normalized)
    results.push({ phone: normalized, type, confidence })
  }

  // Pattern 1: International format +XX-XXX-XXX-XXXX (highest confidence)
  const intl = text.match(/\+\d{1,3}[-.\s]?\d{2,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g)
  if (intl) for (const m of intl) addPhone(m, 'international', 95)

  // Pattern 2: Tel: / Phone: / Call: / Contact: links
  const telLinks = text.match(/(?:tel|phone|call|contact|mobile|whatsapp|fax)[\s:+]*([+\d\s().-]{8,20})/gi)
  if (telLinks) for (const m of telLinks) {
    const num = m.replace(/^(tel|phone|call|contact|mobile|whatsapp|fax)[\s:+]*/i, '')
    addPhone(num, 'tel_link', 98)
  }

  // Pattern 3: Indian phone numbers (specific patterns)
  // +91-XXXXX-XXXXX or +91 XXXXX XXXXX
  const indianIntl = text.match(/\+91[-\s]?\d{5}[-\s]?\d{5}/g)
  if (indianIntl) for (const m of indianIntl) addPhone(m, 'indian_intl', 95)

  // Pattern 4: Indian mobile (10 digits starting with 6-9)
  const indianMobile = text.match(/(?<!\d)[6-9]\d{9}(?!\d)/g)
  if (indianMobile) for (const m of indianMobile) addPhone('+91' + m, 'indian_mobile', 85)

  // Pattern 5: US/Canada phone numbers
  const usPhone = text.match(/\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g)
  if (usPhone) for (const m of usPhone) {
    const digits = m.replace(/\D/g, '')
    if (digits.length === 10) addPhone('+1' + digits, 'us_phone', 90)
    else if (digits.length === 11 && digits.startsWith('1')) addPhone('+' + digits, 'us_phone', 90)
  }

  // Pattern 6: UK phone numbers
  const ukPhone = text.match(/\+?44[-\s]?\d{4}[-\s]?\d{6}|\+?44[-\s]?\d{3}[-\s]?\d{3}[-\s]?\d{4}/g)
  if (ukPhone) for (const m of ukPhone) addPhone(m, 'uk_phone', 90)

  // Pattern 7: General formatted numbers (XXX-XXX-XXXX, XXX.XXX.XXXX)
  const formatted = text.match(/\d{3}[-.]\d{3}[-.]\d{4}/g)
  if (formatted) for (const m of formatted) addPhone(m, 'formatted', 70)

  // Pattern 8: Numbers in parentheses like (XXX) XXX-XXXX
  const paren = text.match(/\(\d{2,4}\)\s*\d{3,4}[-.\s]?\d{3,4}/g)
  if (paren) for (const m of paren) addPhone(m, 'parenthesized', 80)

  // Pattern 9: WhatsApp numbers
  const whatsapp = text.match(/whatsapp[\s:+]*([+\d\s().-]{8,20})/gi)
  if (whatsapp) for (const m of whatsapp) {
    const num = m.replace(/whatsapp[\s:+]*/i, '')
    addPhone(num, 'whatsapp', 95)
  }

  // Pattern 10: Numbers with country code in text
  const countryCodes: [RegExp, string][] = [
    [/\+91[\s-]?\d{10}/g, 'IN'],
    [/\+1[\s-]?\d{10}/g, 'US'],
    [/\+44[\s-]?\d{10}/g, 'UK'],
    [/\+61[\s-]?\d{9}/g, 'AU'],
    [/\+49[\s-]?\d{11}/g, 'DE'],
    [/\+33[\s-]?\d{9}/g, 'FR'],
    [/\+86[\s-]?\d{11}/g, 'CN'],
    [/\+81[\s-]?\d{10}/g, 'JP'],
    [/\+65[\s-]?\d{8}/g, 'SG'],
    [/\+971[\s-]?\d{9}/g, 'AE'],
    [/\+234[\s-]?\d{10}/g, 'NG'],
    [/\+254[\s-]?\d{9}/g, 'KE'],
    [/\+52[\s-]?\d{10}/g, 'MX'],
    [/\+55[\s-]?\d{10,11}/g, 'BR'],
    [/\+82[\s-]?\d{9,10}/g, 'KR'],
    [/\+62[\s-]?\d{9,11}/g, 'ID'],
    [/\+63[\s-]?\d{10}/g, 'PH'],
    [/\+66[\s-]?\d{9}/g, 'TH'],
    [/\+84[\s-]?\d{9,10}/g, 'VN'],
    [/\+92[\s-]?\d{10}/g, 'PK'],
    [/\+880[\s-]?\d{10}/g, 'BD'],
    [/\+94[\s-]?\d{9}/g, 'LK'],
    [/\+977[\s-]?\d{10}/g, 'NP'],
    [/\+64[\s-]?\d{8,9}/g, 'NZ'],
  ]
  for (const [pattern, country] of countryCodes) {
    const matches = text.match(pattern)
    if (matches) for (const m of matches) addPhone(m, `country_${country}`, 92)
  }

  // Pattern 11: Toll-free numbers (1-800, 1-888, etc.)
  const tollfree = text.match(/1[-.\s]?(?:800|888|877|866|855|844|833)[-.\s]?\d{3}[-.\s]?\d{4}/g)
  if (tollfree) for (const m of tollfree) addPhone(m, 'tollfree', 85)

  // Pattern 12: Extension numbers
  const ext = text.match(/\d{3,4}[-.\s]?\d{3,4}[-.\s]?\d{4}\s*(?:ext|extension|x)[.\s]*\d{2,5}/gi)
  if (ext) for (const m of ext) addPhone(m, 'extension', 75)

  return results.sort((a, b) => b.confidence - a.confidence)
}

// ─── Extract Emails (bonus) ───
function extractAllEmails(text: string): string[] {
  const pattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const matches = text.match(pattern)
  return matches ? Array.from(new Set(matches)).slice(0, 10) : []
}

// ─── Extract Social Links ───
function extractSocialLinks(text: string): Record<string, string> {
  const social: Record<string, string> = {}
  const patterns: Record<string, RegExp> = {
    linkedin: /https?:\/\/(?:www\.)?linkedin\.com\/[^\s"'<>]+/i,
    twitter: /https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/[^\s"'<>]+/i,
    facebook: /https?:\/\/(?:www\.)?(?:facebook\.com|fb\.com)\/[^\s"'<>]+/i,
    instagram: /https?:\/\/(?:www\.)?instagram\.com\/[^\s"'<>]+/i,
    youtube: /https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/[^\s"'<>]+/i,
    whatsapp: /wa\.me\/\d+/i,
  }
  for (const [platform, pat] of Object.entries(patterns)) {
    const match = text.match(pat)
    if (match) social[platform] = match[0]
  }
  return social
}

// ─── Google Maps Specific Scraping ───
function buildGoogleMapsQueries(baseQuery: string, location: string): string[] {
  const queries = [
    `${baseQuery} ${location} phone number`,
    `${baseQuery} ${location} contact number`,
    `${baseQuery} ${location} call`,
    `${baseQuery} ${location} mobile number`,
    `${baseQuery} ${location} telephone`,
    `site:maps.google.com ${baseQuery} ${location}`,
    `${baseQuery} ${location} site:justdial.com`,
    `${baseQuery} ${location} site:sulekha.com`,
    `${baseQuery} ${location} site:indiamart.com`,
    `${baseQuery} ${location} phone site:google.com`,
  ]
  return queries
}

// ─── Website Phone Scraping ───
async function scrapeWebsiteForPhones(url: string): Promise<{ phones: { phone: string; type: string; confidence: number }[]; emails: string[]; social: Record<string, string> }> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    })
    if (!res.ok) return { phones: [], emails: [], social: {} }

    const html = await res.text()
    const phones = extractAllPhones(html)
    const emails = extractAllEmails(html)
    const social = extractSocialLinks(html)

    return { phones, emails, social }
  } catch {
    return { phones: [], emails: [], social: {} }
  }
}

// ─── Serper Search ───
async function searchSerper(query: string, apiKey: string, num: number = 100, page: number = 1): Promise<any> {
  const res = await fetch(SERPER_API_URL, {
    method: 'POST',
    headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: query, num: Math.min(num, 100), page }),
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`Serper ${res.status}`)
  return res.json()
}

// ─── Main Handler ───
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      query,
      location,
      targetCount = 1000,
      scrapeWebsites = true,
      maxConcurrent = 5,
    } = body

    if (!query) return NextResponse.json({ error: 'Query is required' }, { status: 400 })

    const apiKey = process.env.SERPER_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'SERPER_API_KEY not configured' }, { status: 500 })

    // Build comprehensive query list for phone scraping
    const searchQueries: string[] = []
    const loc = location || ''

    // Google Maps style queries
    searchQueries.push(...buildGoogleMapsQueries(query, loc))

    // General phone-specific queries
    searchQueries.push(
      `${query} ${loc} phone number contact`,
      `${query} ${loc} mobile number`,
      `${query} ${loc} call now`,
      `${query} ${loc} contact us phone`,
      `${query} ${loc} telephone number`,
      `${query} ${loc} customer care number`,
      `${query} ${loc} helpline number`,
      `${query} ${loc} whatsapp number`,
      `${query} ${loc} phone site:google.com`,
      `${query} ${loc} phone number site:google.com`,
      `${query} ${loc} contact site:google.com`,
    )

    // Deduplicate
    const uniqueQueries = Array.from(new Set(searchQueries)).slice(0, 50)

    // Streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const allPhones = new Map<string, { phone: string; type: string; confidence: number; source: string; name: string; website: string; emails: string[]; social: Record<string, string> }>()
        const seenWebsites = new Set<string>()
        let totalProcessed = 0
        let websitesScraped = 0

        controller.enqueue(encoder.encode(JSON.stringify({
          type: 'status',
          message: `Phone Scraper started: ${uniqueQueries.length} search queries, target ${targetCount} phone numbers...`,
          totalQueries: uniqueQueries.length,
          targetCount,
        }) + '\n'))

        // Process queries in concurrent batches
        for (let i = 0; i < uniqueQueries.length; i += maxConcurrent) {
          const batch = uniqueQueries.slice(i, i + maxConcurrent)

          await Promise.all(batch.map(async (searchQuery) => {
            try {
              // Search Google via Serper
              const data = await searchSerper(searchQuery, apiKey, 100)

              for (const item of (data.organic || [])) {
                const text = `${item.title} ${item.snippet || ''} ${item.link || ''}`
                const phones = extractAllPhones(text)
                const emails = extractAllEmails(text)
                const social = extractSocialLinks(text)

                // Add phones from search results
                for (const p of phones) {
                  const key = p.phone
                  if (!allPhones.has(key)) {
                    allPhones.set(key, {
                      phone: p.phone,
                      type: p.type,
                      confidence: p.confidence,
                      source: 'google_search',
                      name: item.title || '',
                      website: item.link || '',
                      emails,
                      social,
                    })
                  }
                }

                // Scrape website for more phones if enabled
                if (scrapeWebsites && item.link && !seenWebsites.has(item.link)) {
                  seenWebsites.add(item.link)
                  try {
                    const siteData = await scrapeWebsiteForPhones(item.link)
                    websitesScraped++

                    for (const sp of siteData.phones) {
                      const key = sp.phone
                      if (!allPhones.has(key)) {
                        allPhones.set(key, {
                          phone: sp.phone,
                          type: sp.type,
                          confidence: sp.confidence,
                          source: 'website_scrape',
                          name: item.title || '',
                          website: item.link || '',
                          emails: siteData.emails,
                          social: siteData.social,
                        })
                      }
                    }

                    // Also add emails from website
                    if (siteData.emails.length > 0 && phones.length === 0) {
                      // Store as a record even without phone
                      const key = `email_${item.link}`
                      if (!allPhones.has(key)) {
                        allPhones.set(key, {
                          phone: '',
                          type: 'email_only',
                          confidence: 50,
                          source: 'website_scrape',
                          name: item.title || '',
                          website: item.link || '',
                          emails: siteData.emails,
                          social: siteData.social,
                        })
                      }
                    }
                  } catch { /* skip website scrape errors */ }
                }
              }

              totalProcessed++

              // Send progress
              const phoneResults = Array.from(allPhones.values()).filter(p => p.phone && p.phone !== 'email_only')
              controller.enqueue(encoder.encode(JSON.stringify({
                type: 'progress',
                query: searchQuery,
                queriesProcessed: totalProcessed,
                totalQueries: uniqueQueries.length,
                phonesFound: phoneResults.length,
                websitesScraped,
                targetCount,
                percentComplete: Math.round((totalProcessed / uniqueQueries.length) * 100),
                latestPhones: phoneResults.slice(-10),
              }) + '\n'))

              // Rate limiting
              await new Promise(r => setTimeout(r, 300))
            } catch (e) {
              totalProcessed++
            }
          }))

          await new Promise(r => setTimeout(r, 500))

          // Check if we have enough
          const currentPhones = Array.from(allPhones.values()).filter(p => p.phone && p.phone !== 'email_only')
          if (currentPhones.length >= targetCount) {
            controller.enqueue(encoder.encode(JSON.stringify({
              type: 'status',
              message: `Target reached! Found ${currentPhones.length} phone numbers. Stopping...`,
            }) + '\n'))
            break
          }
        }

        // Final results
        const finalPhones = Array.from(allPhones.values())
          .filter(p => p.phone && p.phone !== 'email_only')
          .sort((a, b) => b.confidence - a.confidence)

        const stats = {
          totalPhones: finalPhones.length,
          international: finalPhones.filter(p => p.type === 'international' || p.type === 'indian_intl').length,
          mobile: finalPhones.filter(p => p.type === 'indian_mobile' || p.type === 'us_phone').length,
          whatsapp: finalPhones.filter(p => p.type === 'whatsapp').length,
          fromSearch: finalPhones.filter(p => p.source === 'google_search').length,
          fromWebsites: finalPhones.filter(p => p.source === 'website_scrape').length,
          websitesScraped,
          withEmail: finalPhones.filter(p => p.emails.length > 0).length,
          withSocial: finalPhones.filter(p => Object.keys(p.social).length > 0).length,
          highConfidence: finalPhones.filter(p => p.confidence >= 90).length,
          mediumConfidence: finalPhones.filter(p => p.confidence >= 70 && p.confidence < 90).length,
          lowConfidence: finalPhones.filter(p => p.confidence < 70).length,
        }

        controller.enqueue(encoder.encode(JSON.stringify({
          type: 'complete',
          message: `Phone scraping complete! Found ${finalPhones.length.toLocaleString()} unique phone numbers from ${websitesScraped} websites.`,
          stats,
          phones: finalPhones,
        }) + '\n'))

        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/x-ndjson',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Phone Scraper API error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

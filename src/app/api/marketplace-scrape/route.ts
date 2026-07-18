import { NextRequest, NextResponse } from 'next/server'

const SERPER_API_URL = 'https://google.serper.dev/search'

function extractPhones(text: string): string[] {
  const patterns = [/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g, /(?:\+?\d{1,3}[-.\s]?)?\d{10,13}/g]
  const phones = new Set<string>()
  for (const pat of patterns) {
    const matches = text.match(pat)
    if (matches) for (const m of matches) { const c = m.replace(/[^\d+]/g, ''); if (c.length >= 7 && c.length <= 15) phones.add(c) }
  }
  return Array.from(phones).slice(0, 5)
}

function extractEmails(text: string): string[] {
  const m = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)
  return m ? Array.from(new Set(m)).slice(0, 5) : []
}

function extractPrice(text: string): string {
  const patterns = [
    /₹[\d,.]+(?:\s*(?:Cr|Crore|Lac|Lakh|K))?/gi,
    /Rs\.?\s*[\d,.]+(?:\s*(?:Cr|Crore|Lac|Lakh))?/gi,
    /\$\s*[\d,.]+(?:\s*(?:K|M|B|thousand|million|billion))?/gi,
    /USD\s*[\d,.]+/gi,
    /INR\s*[\d,.]+/gi,
  ]
  for (const pat of patterns) { const m = text.match(pat); if (m) return m[0].trim() }
  return ''
}

function extractDomain(url: string): string { try { return new URL(url).hostname.replace('www.', '') } catch { return '' } }

function extractSocial(text: string): Record<string, string> {
  const s: Record<string, string> = {}
  const p: Record<string, RegExp> = {
    linkedin: /linkedin\.com\/[^\s"'<>]+/i,
    twitter: /(?:twitter\.com|x\.com)\/[^\s"'<>]+/i,
    facebook: /(?:facebook\.com|fb\.com)\/[^\s"'<>]+/i,
    instagram: /instagram\.com\/[^\s"'<>]+/i,
  }
  for (const [k, r] of Object.entries(p)) { const m = text.match(r); if (m) s[k] = m[0] }
  return s
}

function detectLocation(text: string, hintCountry: string, hintCity: string, hintDistrict: string): { city: string; state: string; country: string; district: string } {
  const r = { city: hintCity, state: '', country: hintCountry, district: hintDistrict }
  const countryPatterns: [RegExp, string][] = [
    [/united states|usa|america/i, 'United States'],[/united kingdom|uk|britain|england/i, 'United Kingdom'],
    [/india|bharat/i, 'India'],[/canada/i, 'Canada'],[/australia/i, 'Australia'],
    [/germany/i, 'Germany'],[/uae|dubai/i, 'UAE'],[/singapore/i, 'Singapore'],
  ]
  if (!r.country) { for (const [pat, c] of countryPatterns) { if (pat.test(text)) { r.country = c; break } } }
  if (r.country === 'India' || r.country === '') {
    const sp: [RegExp, string][] = [
      [/maharashtra|mumbai|pune|nashik|nagpur/i, 'Maharashtra'],[/delhi|new delhi/i, 'Delhi'],
      [/karnataka|bangalore|bengaluru/i, 'Karnataka'],[/tamil nadu|chennai|coimbatore/i, 'Tamil Nadu'],
      [/gujarat|ahmedabad|surat|vadodara/i, 'Gujarat'],[/rajasthan|jaipur/i, 'Rajasthan'],
      [/uttar pradesh|lucknow|kanpur|varanasi|noida/i, 'Uttar Pradesh'],[/west bengal|kolkata/i, 'West Bengal'],
      [/telangana|hyderabad/i, 'Telangana'],[/kerala|kochi/i, 'Kerala'],
    ]
    for (const [pat, st] of sp) {
      if (pat.test(text)) { r.state = st; if (!r.city || r.city === 'All') { const m = text.match(pat); if (m) r.city = m[0].trim() }; break }
    }
  }
  return r
}

function buildSearchQueries(tab: string, country: string, city: string, district: string, maxQueries: number): { query: string; source: string }[] {
  const queries: { query: string; source: string }[] = []
  const loc = [district, city, country].filter(l => l && l !== 'All').join(' ')
  const locSuffix = loc ? ` in ${loc}` : ''
  const bases: string[] = []

  if (tab === 'property') {
    bases.push(
      `real estate property for sale${locSuffix}`,`houses apartments for sale${locSuffix}`,
      `flats for sale${locSuffix}`,`villa for sale${locSuffix}`,
      `commercial property for sale${locSuffix}`,`property listing${locSuffix}`,
      `plot for sale${locSuffix}`,`land for sale${locSuffix} real estate`,
      `site:99acres.com property${locSuffix}`,`site:magicbricks.com${locSuffix}`,
      `site:housing.com${locSuffix}`,`site:nobroker.in${locSuffix}`,
      `site:olx.in property${locSuffix}`,`site:makaan.com${locSuffix}`,
      `real estate agents${locSuffix}`,`new projects${locSuffix} real estate`,
      `under construction flats${locSuffix}`,`property dealers${locSuffix}`,
    )
  } else if (tab === 'land') {
    bases.push(
      `agricultural land for sale${locSuffix}`,`plot for sale${locSuffix}`,
      `farm land for sale${locSuffix}`,`empty plot${locSuffix}`,
      `commercial plot for sale${locSuffix}`,`industrial plot${locSuffix}`,
      `residential plot${locSuffix}`,`land rates${locSuffix}`,
      `site:99acres.com land${locSuffix}`,`site:magicbricks.com plot${locSuffix}`,
      `site:landwatch.com${locSuffix}`,`site:landandfarm.com${locSuffix}`,
      `plot dealers${locSuffix}`,`real estate land${locSuffix}`,
    )
  } else if (tab === 'cars') {
    bases.push(
      `used cars for sale${locSuffix}`,`second hand cars${locSuffix}`,
      `used car dealers${locSuffix}`,`certified used cars${locSuffix}`,
      `site:cardekho.com${locSuffix}`,`site:spinny.com${locSuffix}`,
      `site:cars24.com${locSuffix}`,`site:olx.in cars${locSuffix}`,
      `site:carwale.com${locSuffix}`,`site:zigwheels.com${locSuffix}`,
      `site:autotrader.com${locSuffix}`,`site:cars.com${locSuffix}`,
      `luxury cars for sale${locSuffix}`,`budget cars for sale${locSuffix}`,
      `car listing${locSuffix}`,`pre-owned cars${locSuffix}`,
    )
  } else if (tab === 'bikes') {
    bases.push(
      `used bikes for sale${locSuffix}`,`second hand bikes${locSuffix}`,
      `motorcycle for sale${locSuffix}`,`bike dealers${locSuffix}`,
      `site:bikewale.com${locSuffix}`,`site:droom.in bikes${locSuffix}`,
      `site:olx.in bikes${locSuffix}`,`bike listing${locSuffix}`,
      `royal enfield for sale${locSuffix}`,`sports bike for sale${locSuffix}`,
      `scooter for sale${locSuffix}`,`activa honda for sale${locSuffix}`,
      `ktm duke for sale${locSuffix}`,`yamaha for sale${locSuffix}`,
    )
  }

  for (const b of bases) {
    const src = b.match(/site:([^\s]+)/)
    queries.push({ query: b, source: src ? src[1] : 'google' })
  }

  const seen = new Set<string>()
  const unique: { query: string; source: string }[] = []
  for (const q of queries) { if (!seen.has(q.query)) { seen.add(q.query); unique.push(q) } }
  return unique.slice(0, maxQueries)
}

async function searchSerper(query: string, apiKey: string, num: number = 10): Promise<any> {
  const res = await fetch(SERPER_API_URL, {
    method: 'POST',
    headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: query, num: Math.min(num, 10) }),
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`Serper ${res.status}`)
  return res.json()
}

async function processQuery(
  query: string, apiKey: string, tab: string,
  country: string, city: string, district: string,
  seenLinks: Set<string>, seenNames: Set<string>
): Promise<any[]> {
  const results: any[] = []
  try {
    const data = await searchSerper(query, apiKey, 10)
    const now = new Date().toISOString()
    const querySource = query.match(/site:([^\s]+)/)?.[1] || 'google'

    for (const item of (data.organic || [])) {
      const normUrl = item.link?.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '')
      if (normUrl && seenLinks.has(normUrl)) continue
      if (normUrl) seenLinks.add(normUrl)

      const nameKey = `${item.title?.toLowerCase()}_${extractDomain(item.link)}`
      if (seenNames.has(nameKey)) continue
      seenNames.add(nameKey)

      const text = `${item.title} ${item.snippet || ''}`
      const phones = extractPhones(text)
      const emails = extractEmails(text)
      const social = extractSocial(text + ' ' + item.link)
      const loc = detectLocation(text + ' ' + query, country, city, district)
      const price = extractPrice(text)

      results.push({
        id: `mp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: item.title,
        description: item.snippet || '',
        price: price || '',
        phones: phones.join(', '),
        emails: emails.join(', '),
        website: extractDomain(item.link),
        city: loc.city, district: loc.district, state: loc.state, country: loc.country,
        socialLinkedin: social.linkedin || '', socialTwitter: social.twitter || '',
        socialFacebook: social.facebook || '', socialInstagram: social.instagram || '',
        sourceUrl: item.link, source: querySource, scrapedDate: now, tab,
      })
    }
  } catch (e) { console.error(`Query error "${query}":`, e) }
  return results
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tab = 'property', country = '', city = '', district = '', maxResults = 100 } = body

    const apiKey = process.env.SERPER_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'SERPER_API_KEY not configured' }, { status: 500 })

    const queries = buildSearchQueries(tab, country, city, district, Math.ceil(maxResults / 5))
    const NL = '\n'

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const seenLinks = new Set<string>()
        const seenNames = new Set<string>()
        let totalFound = 0
        let queriesProcessed = 0
        const allResults: any[] = []

        controller.enqueue(encoder.encode(JSON.stringify({
          type: 'status',
          message: `Starting ${tab} scrape: ${queries.length} queries for ${country}${city ? ', ' + city : ''}${district ? ', ' + district : ''}...`,
          totalQueries: queries.length, targetCount: maxResults,
        }) + NL))

        for (let i = 0; i < queries.length; i += 3) {
          const batch = queries.slice(i, i + 3)
          const promises = batch.map(async (q) => {
            try {
              const results = await processQuery(q.query, apiKey, tab, country, city, district, seenLinks, seenNames)
              queriesProcessed++
              totalFound += results.length
              allResults.push(...results)
              controller.enqueue(encoder.encode(JSON.stringify({
                type: 'progress', query: q.query, queriesProcessed,
                totalQueries: queries.length, found: totalFound,
                targetCount: maxResults,
                percentComplete: Math.round((queriesProcessed / queries.length) * 100),
                latestResults: results.slice(0, 3),
              }) + NL))
              return results
            } catch (e) { queriesProcessed++; return [] }
          })
          await Promise.all(promises)
          await new Promise(r => setTimeout(r, 400))
          if (totalFound >= maxResults) {
            controller.enqueue(encoder.encode(JSON.stringify({ type: 'status', message: `Target reached! Found ${totalFound} listings.` }) + NL))
            break
          }
        }

        const stats = {
          total: allResults.length,
          withPrice: allResults.filter((r: any) => r.price).length,
          withPhone: allResults.filter((r: any) => r.phones).length,
          withEmail: allResults.filter((r: any) => r.emails).length,
          sources: Array.from(new Set(allResults.map((r: any) => r.source))),
          countries: Array.from(new Set(allResults.map((r: any) => r.country).filter(Boolean))),
          cities: Array.from(new Set(allResults.map((r: any) => r.city).filter(Boolean))),
        }

        controller.enqueue(encoder.encode(JSON.stringify({
          type: 'complete',
          message: `Scraping complete! Found ${totalFound} unique ${tab} listings from ${queriesProcessed} queries.`,
          stats, queriesProcessed, totalQueries: queries.length, allResults,
        }) + NL))
        controller.close()
      },
    })

    return new Response(stream, {
      headers: { 'Content-Type': 'application/x-ndjson', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' },
    })
  } catch (error) {
    console.error('Marketplace scrape API error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

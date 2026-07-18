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
    /USD\s*[\d,.]+/gi, /INR\s*[\d,.]+/gi,
    /€\s*[\d,.]+/gi, /£\s*[\d,.]+/gi,
  ]
  for (const pat of patterns) { const m = text.match(pat); if (m) return m[0].trim() }
  return ''
}
function extractDomain(url: string): string { try { return new URL(url).hostname.replace('www.', '') } catch { return '' } }

function detectLocation(text: string, hintCountry: string, hintCity: string, hintDistrict: string, hintState: string): { city: string; state: string; country: string; district: string } {
  const r = { city: hintCity, state: hintState, country: hintCountry, district: hintDistrict }
  const cp: [RegExp, string][] = [
    [/united states|usa|america/i,'United States'],[/united kingdom|uk|britain|england/i,'United Kingdom'],
    [/india|bharat/i,'India'],[/canada/i,'Canada'],[/australia/i,'Australia'],[/germany/i,'Germany'],
    [/uae|dubai/i,'UAE'],[/singapore/i,'Singapore'],[/brazil/i,'Brazil'],[/mexico/i,'Mexico'],
    [/south africa/i,'South Africa'],[/nigeria/i,'Nigeria'],[/kenya/i,'Kenya'],[/thailand/i,'Thailand'],
    [/france/i,'France'],[/italy/i,'Italy'],[/spain/i,'Spain'],[/japan/i,'Japan'],
    [/south korea/i,'South Korea'],[/saudi arabia/i,'Saudi Arabia'],[/turkey/i,'Turkey'],
    [/egypt/i,'Egypt'],[/israel/i,'Israel'],[/new zealand/i,'New Zealand'],[/ireland/i,'Ireland'],
  ]
  if (!r.country) { for (const [pat, c] of cp) { if (pat.test(text)) { r.country = c; break } } }
  if ((r.country === 'India' || !r.country) && !r.state) {
    const sp: [RegExp, string][] = [
      [/maharashtra|mumbai|pune|nashik|nagpur|aurangabad/i,'Maharashtra'],
      [/delhi|new delhi/i,'Delhi'],
      [/karnataka|bangalore|bengaluru/i,'Karnataka'],
      [/tamil nadu|chennai|coimbatore/i,'Tamil Nadu'],
      [/gujarat|ahmedabad|surat|vadodara|rajkot/i,'Gujarat'],
      [/rajasthan|jaipur|udaipur|jodhpur/i,'Rajasthan'],
      [/uttar pradesh|lucknow|kanpur|agra|varanasi|noida/i,'Uttar Pradesh'],
      [/west bengal|kolkata/i,'West Bengal'],
      [/telangana|hyderabad/i,'Telangana'],
      [/kerala|kochi|thiruvananthapuram/i,'Kerala'],
      [/andhra pradesh|visakhapatnam|vijayawada/i,'Andhra Pradesh'],
      [/bihar|patna/i,'Bihar'],
      [/madhya pradesh|bhopal|indore/i,'Madhya Pradesh'],
      [/punjab|chandigarh|ludhiana|amritsar/i,'Punjab'],
      [/haryana|gurugram|gurgaon/i,'Haryana'],
      [/goa/i,'Goa'],[/odisha|bhubaneswar/i,'Odisha'],
      [/jharkhand|ranchi/i,'Jharkhand'],
      [/chhattisgarh|raipur/i,'Chhattisgarh'],
      [/uttarakhand|dehradun/i,'Uttarakhand'],
      [/himachal pradesh|shimla/i,'Himachal Pradesh'],
      [/assam|guwahati/i,'Assam'],
    ]
    for (const [pat, st] of sp) {
      if (pat.test(text)) { r.state = st; if (!r.city) { const m = text.match(pat); if (m) r.city = m[0].trim() }; break }
    }
  }
  return r
}

function buildPropertyQueries(country: string, city: string, district: string, state: string, customLocation: string): { query: string; source: string }[] {
  const queries: { query: string; source: string }[] = []
  const locParts = [customLocation, district, city, state, country].filter(Boolean)
  const loc = locParts.length > 0 ? ` in ${locParts.join(', ')}` : ''
  const locSite = locParts.length > 0 ? locParts[0] : ''

  // Property listing sites
  const sitePatterns = [
    'site:99acres.com', 'site:magicbricks.com', 'site:housing.com', 'site:nobroker.in',
    'site:olx.in', 'site:makaan.com', 'site:commonfloor.com', 'site:acres99.com',
  ]
  const intlSitePatterns = [
    'site:rightmove.co.uk', 'site:zillow.com', 'site:realtor.com', 'site:realestate.com.au',
    'site:propertyguru.com.sg', 'site:bayut.com', 'site:propertyfinder.ae',
    'site:lamudi.com', 'site:rumah123.com', 'site:dubizzle.com',
  ]
  const isIndia = !country || country === 'India'
  const sites = isIndia ? [...sitePatterns, ...intlSitePatterns.slice(0, 3)] : intlSitePatterns

  const baseTerms = [
    'property for sale', 'houses for sale', 'apartments for sale', 'flats for sale',
    'villa for sale', 'commercial property for sale', 'plot for sale', 'land for sale',
    'real estate listings', 'new projects', 'under construction flats',
    'residential plots', 'agricultural land for sale', 'farm house for sale',
    'shop for sale', 'office space for sale', 'warehouse for sale',
  ]

  for (const term of baseTerms) {
    queries.push({ query: `${term}${loc}`, source: 'google' })
    for (const site of sites.slice(0, 4)) {
      queries.push({ query: `${site} ${term} ${locSite}`, source: site.replace('site:', '') })
    }
  }

  // Also search without site: for broader results
  queries.push({ query: `real estate agents${loc}`, source: 'google' })
  queries.push({ query: `property dealers${loc}`, source: 'google' })
  queries.push({ query: `real estate brokers${loc}`, source: 'google' })

  const seen = new Set<string>()
  const unique: { query: string; source: string }[] = []
  for (const q of queries) { if (!seen.has(q.query)) { seen.add(q.query); unique.push(q) } }
  return unique
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

async function processPropertyQuery(
  query: string, source: string, apiKey: string,
  seenLinks: Set<string>, seenNames: Set<string>,
  country: string, city: string, district: string, state: string
): Promise<any[]> {
  const results: any[] = []
  try {
    const data = await searchSerper(query, apiKey, 10)
    const now = new Date().toISOString()

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
      const loc = detectLocation(text + ' ' + query, country, city, district, state)
      const price = extractPrice(text)

      results.push({
        id: `pl-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        title: item.title,
        description: item.snippet || '',
        price,
        phones: phones.join(', '),
        emails: emails.join(', '),
        website: extractDomain(item.link),
        city: loc.city,
        district: loc.district,
        state: loc.state,
        country: loc.country,
        source,
        sourceUrl: item.link,
        scrapedDate: now,
      })
    }
  } catch (e) { console.error(`Property query error "${query}":`, e) }
  return results
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { country = '', city = '', district = '', state = '', customLocation = '', maxResults = 100000 } = body

    const apiKey = process.env.SERPER_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'SERPER_API_KEY not configured. Set it in .env.local or Vercel env vars.' }, { status: 500 })

    const queries = buildPropertyQueries(country, city, district, state, customLocation)
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
          message: `Starting property lead generation: ${queries.length} queries for ${country || 'worldwide'}${city ? ', ' + city : ''}${district ? ', ' + district : ''}...`,
          totalQueries: queries.length,
          targetCount: maxResults,
        }) + NL))

        for (let i = 0; i < queries.length; i += 3) {
          const batch = queries.slice(i, i + 3)
          const promises = batch.map(async (q) => {
            try {
              const results = await processPropertyQuery(q.query, q.source, apiKey, seenLinks, seenNames, country, city, district, state)
              queriesProcessed++
              totalFound += results.length
              allResults.push(...results)
              controller.enqueue(encoder.encode(JSON.stringify({
                type: 'progress',
                queriesDone: queriesProcessed,
                queriesTotal: queries.length,
                percent: Math.round((queriesProcessed / queries.length) * 100),
                found: totalFound,
                results: results.slice(0, 3),
              }) + NL))
              return results
            } catch (e) { queriesProcessed++; return [] }
          })
          await Promise.all(promises)
          await new Promise(r => setTimeout(r, 400))
          if (totalFound >= maxResults) {
            controller.enqueue(encoder.encode(JSON.stringify({ type: 'status', message: `Target reached! Found ${totalFound} property leads.` }) + NL))
            break
          }
        }

        controller.enqueue(encoder.encode(JSON.stringify({
          type: 'complete',
          total: totalFound,
          allResults,
        }) + NL))
        controller.close()
      },
    })

    return new Response(stream, {
      headers: { 'Content-Type': 'application/x-ndjson', 'Cache-Control': 'no-cache', 'Connection:': 'keep-alive' },
    })
  } catch (error) {
    console.error('Property leads API error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

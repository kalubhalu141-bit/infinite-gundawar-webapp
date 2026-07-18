import { NextRequest, NextResponse } from 'next/server'

const SERPER_API_URL = 'https://google.serper.dev/search'

// ─── Extraction Helpers ───
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
function extractDomain(url: string): string { try { return new URL(url).hostname.replace('www.', '') } catch { return '' } }
function extractSocial(text: string): Record<string, string> {
  const s: Record<string, string> = {}
  const p: Record<string, RegExp> = { linkedin: /linkedin\.com\/[^\s"'<>]+/i, twitter: /(?:twitter\.com|x\.com)\/[^\s"'<>]+/i, facebook: /(?:facebook\.com|fb\.com)\/[^\s"'<>]+/i, instagram: /instagram\.com\/[^\s"'<>]+/i, youtube: /(?:youtube\.com|youtu\.be)\/[^\s"'<>]+/i }
  for (const [k, r] of Object.entries(p)) { const m = text.match(r); if (m) s[k] = m[0] }
  return s
}
function detectLocation(text: string): { city: string; state: string; country: string } {
  const r = { city: '', state: '', country: '' }
  const cp: [RegExp, string][] = [[/united states|usa|america/i,'United States'],[/united kingdom|uk|britain|england/i,'United Kingdom'],[/india|bharat/i,'India'],[/canada/i,'Canada'],[/australia/i,'Australia'],[/germany/i,'Germany'],[/france/i,'France'],[/japan/i,'Japan'],[/china/i,'China'],[/uae|dubai/i,'UAE'],[/singapore/i,'Singapore'],[/brazil/i,'Brazil'],[/mexico/i,'Mexico'],[/south africa/i,'South Africa'],[/nigeria/i,'Nigeria'],[/kenya/i,'Kenya'],[/thailand/i,'Thailand'],[/vietnam/i,'Vietnam'],[/philippines/i,'Philippines'],[/indonesia/i,'Indonesia'],[/malaysia/i,'Malaysia'],[/pakistan/i,'Pakistan'],[/bangladesh/i,'Bangladesh'],[/sri lanka/i,'Sri Lanka'],[/nepal/i,'Nepal'],[/new zealand/i,'New Zealand'],[/south korea/i,'South Korea'],[/turkey/i,'Turkey'],[/saudi arabia/i,'Saudi Arabia'],[/israel/i,'Israel'],[/italy/i,'Italy'],[/spain/i,'Spain'],[/netherlands|holland/i,'Netherlands'],[/sweden/i,'Sweden'],[/norway/i,'Norway'],[/denmark/i,'Denmark'],[/finland/i,'Finland'],[/poland/i,'Poland'],[/russia/i,'Russia'],[/ireland/i,'Ireland'],[/switzerland/i,'Switzerland'],[/belgium/i,'Belgium'],[/austria/i,'Austria'],[/portugal/i,'Portugal'],[/greece/i,'Greece'],[/czech republic/i,'Czech Republic'],[/romania/i,'Romania'],[/hungary/i,'Hungary'],[/ukraine/i,'Ukraine'],[/colombia/i,'Colombia'],[/argentina/i,'Argentina'],[/chile/i,'Chile'],[/peru/i,'Peru'],[/venezuela/i,'Venezuela'],[/egypt/i,'Egypt'],[/morocco/i,'Morocco'],[/tanzania/i,'Tanzania'],[/ethiopia/i,'Ethiopia'],[/ghana/i,'Ghana']]
  for (const [pat, c] of cp) { if (pat.test(text)) { r.country = c; break } }
  if (r.country === 'India' || r.country === '') {
    const sp: [RegExp, string][] = [[/maharashtra|mumbai|pune|nashik|nagpur|aurangabad/i,'Maharashtra'],[/delhi|new delhi/i,'Delhi'],[/karnataka|bangalore|bengaluru/i,'Karnataka'],[/tamil nadu|chennai|coimbatore/i,'Tamil Nadu'],[/gujarat|ahmedabad|surat|vadodara|rajkot/i,'Gujarat'],[/rajasthan|jaipur|udaipur|jodhpur/i,'Rajasthan'],[/uttar pradesh|lucknow|kanpur|agra|varanasi|noida/i,'Uttar Pradesh'],[/west bengal|kolkata/i,'West Bengal'],[/telangana|hyderabad/i,'Telangana'],[/kerala|kochi|thiruvananthapuram/i,'Kerala'],[/andhra pradesh|visakhapatnam/i,'Andhra Pradesh'],[/bihar|patna/i,'Bihar'],[/madhya pradesh|bhopal|indore/i,'Madhya Pradesh'],[/punjab|chandigarh|ludhiana|amritsar/i,'Punjab'],[/haryana|gurugram|gurgaon/i,'Haryana'],[/goa/i,'Goa'],[/odisha|bhubaneswar/i,'Odisha'],[/jharkhand|ranchi/i,'Jharkhand'],[/chhattisgarh|raipur/i,'Chhattisgarh'],[/uttarakhand|dehradun/i,'Uttarakhand'],[/himachal pradesh|shimla/i,'Himachal Pradesh'],[/assam|guwahati/i,'Assam'],[/jammu|kashmir|ladakh|srinagar/i,'Jammu & Kashmir'],[/manipur/i,'Manipur'],[/meghalaya/i,'Meghalaya'],[/mizoram/i,'Mizoram'],[/nagaland/i,'Nagaland'],[/tripura/i,'Tripura'],[/sikkim/i,'Sikkim'],[/arunachal pradesh/i,'Arunachal Pradesh'],[/puducherry|pondicherry/i,'Puducherry']]
    for (const [pat, s] of sp) { if (pat.test(text)) { r.state = s; const m = text.match(pat); if (m) r.city = m[0].trim(); break } }
  }
  return r
}
function detectIndustry(text: string): string {
  const ip: [RegExp, string][] = [[/software|it services|saas|cloud computing/i,'IT & Software'],[/manufacturing|factory|production plant/i,'Manufacturing'],[/healthcare|hospital|medical|pharma|pharmaceutical/i,'Healthcare & Pharma'],[/education|school|college|university|coaching|training/i,'Education'],[/finance|bank|insurance|investment|fintech/i,'Finance & Banking'],[/real estate|property|construction|infrastructure/i,'Real Estate & Construction'],[/retail|e-commerce|shopping|marketplace/i,'Retail & E-commerce'],[/food|restaurant|hotel|hospitality|catering/i,'Food & Hospitality'],[/transport|logistics|shipping|freight|delivery/i,'Transport & Logistics'],[/energy|power|solar|oil|gas|renewable/i,'Energy & Utilities'],[/telecom|telecommunication|5g|broadband/i,'Telecommunications'],[/media|entertainment|news|broadcasting|publishing/i,'Media & Entertainment'],[/agriculture|farming|agri|dairy/i,'Agriculture'],[/textile|garment|fabric|clothing|fashion/i,'Textile & Fashion'],[/auto|automobile|car|vehicle|automotive/i,'Automotive'],[/chemical|petrochemical|polymer/i,'Chemicals'],[/legal|law|attorney|solicitor/i,'Legal'],[/consulting|advisory|professional services/i,'Consulting'],[/beauty|cosmetics|wellness|spa/i,'Beauty & Wellness'],[/sports|fitness|gym/i,'Sports & Fitness'],[/travel|tourism|aviation|airline/i,'Travel & Tourism'],[/mining|metal|steel/i,'Mining & Metals'],[/defense|military|aerospace/i,'Defense & Aerospace'],[/ngo|non-profit|charity|social/i,'Non-Profit'],[/import.export|trading/i,'Import/Export & Trading'],[/digital marketing|seo|advertising|marketing agency/i,'Digital Marketing'],[/interior design|architecture/i,'Interior Design & Architecture'],[/jewelry|jewellery|diamond|gold/i,'Jewelry & Precious Metals'],[/printing|packaging/i,'Printing & Packaging'],[/fmcg|consumer goods/i,'FMCG & Consumer Goods']]
  for (const [pat, ind] of ip) { if (pat.test(text)) return ind }
  return ''
}

// ─── Query Generator for 100K scale ───
function generateQueryVariations(baseQuery: string, category: string, country: string, city: string, state: string, industry: string, targetCount: number): string[] {
  const queries: string[] = []
  const prefixes = ['top', 'best', 'leading', 'top 100', 'top 500', 'list of', 'directory of', 'companies', 'firms', 'businesses', 'providers', 'suppliers', 'manufacturers', 'dealers', 'distributors', 'wholesalers', 'exporters', 'importers', 'traders', 'agents', 'consultants', 'contractors', 'services']
  const suffixes = ['directory', 'list', 'companies', 'firms', 'businesses', 'contact', 'phone number', 'email address', 'website', 'near me', 'in india', 'in usa', 'in uk', 'worldwide', 'global']

  // Location variations
  const locations: string[] = []
  if (country) locations.push(country)
  if (city) locations.push(city)
  if (state) locations.push(state)
  if (locations.length === 0) locations.push('')

  // Generate combinations
  for (const loc of locations) {
    // Base query with location
    const base = loc ? `${baseQuery} in ${loc}` : baseQuery
    queries.push(base)

    // Prefix variations
    for (const prefix of prefixes.slice(0, 8)) {
      queries.push(`${prefix} ${base}`)
    }

    // Suffix variations
    for (const suffix of suffixes.slice(0, 6)) {
      queries.push(`${base} ${suffix}`)
    }

    // Industry-specific
    if (industry) {
      queries.push(`${industry} ${base}`)
      queries.push(`${industry} companies ${loc || 'worldwide'}`)
    }
  }

  // Category-specific query patterns
  if (category === '1') {
    queries.push(`${baseQuery} B2B leads`)
    queries.push(`${baseQuery} business directory`)
    queries.push(`${baseQuery} company database`)
    queries.push(`${baseQuery} contact list`)
  } else if (category === '2') {
    queries.push(`${baseQuery} IndiaMart`)
    queries.push(`${baseQuery} TradeIndia`)
    queries.push(`${baseQuery} JustDial`)
    queries.push(`${baseQuery} Sulekha`)
    queries.push(`${baseQuery} India business directory`)
  } else if (category === '3') {
    queries.push(`site:linkedin.com/in ${baseQuery}`)
    queries.push(`site:linkedin.com/pub ${baseQuery}`)
    queries.push(`${baseQuery} LinkedIn profiles`)
    queries.push(`${baseQuery} professionals directory`)
  } else if (category === '4') {
    queries.push(`site:linkedin.com/in ${baseQuery}`)
    queries.push(`site:twitter.com ${baseQuery}`)
    queries.push(`site:instagram.com ${baseQuery}`)
    queries.push(`${baseQuery} people directory`)
    queries.push(`${baseQuery} contact database`)
  }

  // Deduplicate and limit based on target count
  // Each query can return up to 100 results. For 100K, we need ~1000 queries
  const unique = Array.from(new Set(queries))
  const maxQueries = Math.min(Math.ceil(targetCount / 50), 2000) // 50 avg results per query, max 2000 queries
  return unique.slice(0, maxQueries)
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

// ─── Process Single Query (with pagination) ───
async function processQuery(query: string, apiKey: string, maxResults: number, seenLinks: Set<string>, seenNames: Set<string>, enrichData: boolean): Promise<any[]> {
  const results: any[] = []
  const pagesNeeded = Math.ceil(maxResults / 100)

  for (let page = 1; page <= pagesNeeded; page++) {
    try {
      const data = await searchSerper(query, apiKey, 100, page)
      const now = new Date().toISOString()

      for (const item of (data.organic || [])) {
        const normUrl = item.link?.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '')
        if (normUrl && seenLinks.has(normUrl)) continue
        if (normUrl) seenLinks.add(normUrl)

        const nameKey = `${item.title?.toLowerCase()}_${extractDomain(item.link)}`
        if (seenNames.has(nameKey)) continue
        seenNames.add(nameKey)

        const text = `${item.title} ${item.snippet || ''}`
        let phones = extractPhones(text)
        let emails = extractEmails(text)
        let social = extractSocial(text + ' ' + item.link)

        // Enrich from website if enabled
        if (enrichData && item.link && (phones.length === 0 || emails.length === 0)) {
          try {
            const sr = await fetch(item.link, { signal: AbortSignal.timeout(5000), headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } })
            if (sr.ok) { const html = await sr.text(); if (!phones.length) phones = extractPhones(html); if (!emails.length) emails = extractEmails(html); social = extractSocial(html) }
          } catch { /* skip enrichment */ }
        }

        const loc = detectLocation(text + ' ' + query)
        const ind = detectIndustry(text)

        results.push({
          name: item.title, phone: phones.join(', '), email: emails.join(', '),
          website: extractDomain(item.link), address: '', city: loc.city, state: loc.state, country: loc.country,
          category: '', subCategory: '', industry: ind,
          socialLinkedin: social.linkedin, socialTwitter: social.twitter, socialFacebook: social.facebook, socialInstagram: social.instagram, socialYoutube: social.youtube,
          sourceUrl: item.link, snippet: item.snippet || '', scrapedDate: now,
        })
      }

      // Knowledge Graph
      if (data.knowledgeGraph?.title) {
        const kg = data.knowledgeGraph
        const kgText = `${kg.title} ${kg.description || ''} ${kg.website || ''}`
        const phones = extractPhones(kgText) || extractPhones(JSON.stringify(kg))
        const emails = extractEmails(kgText) || extractEmails(JSON.stringify(kg))
        const social = extractSocial(JSON.stringify(kg))
        const loc = detectLocation(kgText + ' ' + query)
        if (phones.length && !seenNames.has(`${kg.title?.toLowerCase()}_${extractDomain(kg.website || '')}`)) {
          seenNames.add(`${kg.title?.toLowerCase()}_${extractDomain(kg.website || '')}`)
          results.unshift({ name: kg.title || '', phone: phones.join(', '), email: emails.join(', '), website: extractDomain(kg.website || ''), address: kg.address || '', city: loc.city, state: loc.state, country: loc.country, category: '', subCategory: kg.type || '', industry: detectIndustry(kgText), socialLinkedin: social.linkedin, socialTwitter: social.twitter, socialFacebook: social.facebook, socialInstagram: social.instagram, socialYoutube: social.youtube, sourceUrl: kg.website || '', snippet: kg.description || '', scrapedDate: now })
        }
      }

      // Rate limiting: small delay between pages
      await new Promise(r => setTimeout(r, 300))
    } catch (e) {
      console.error(`Page ${page} error for "${query}":`, e)
      break
    }
  }

  return results
}

// ─── Main Handler ───
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, category, targetCount = 100000, country, city, state, industry, enrichData = false, maxConcurrent = 5 } = body

    if (!query) return NextResponse.json({ error: 'Query is required' }, { status: 400 })

    const apiKey = process.env.SERPER_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'SERPER_API_KEY not configured' }, { status: 500 })

    // Generate query variations for 100K scale
    const queries = generateQueryVariations(query, category, country, city, state, industry, targetCount)

    // Use streaming response for real-time progress
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const seenLinks = new Set<string>()
        const seenNames = new Set<string>()
        let totalFound = 0
        let queriesProcessed = 0
        const allResults: any[] = []
        const errors: string[] = []

        // Send initial status
        controller.enqueue(encoder.encode(JSON.stringify({ type: 'status', message: `Starting scrape: ${queries.length} query variations generated for ${targetCount.toLocaleString()} target leads...`, totalQueries: queries.length, targetCount }) + '\n'))

        // Process queries in batches (concurrent)
        for (let i = 0; i < queries.length; i += maxConcurrent) {
          const batch = queries.slice(i, i + maxConcurrent)
          const promises = batch.map(async (q) => {
            try {
              const results = await processQuery(q, apiKey, 100, seenLinks, seenNames, enrichData)
              queriesProcessed++
              totalFound += results.length
              allResults.push(...results)

              // Send progress update
              const progress = {
                type: 'progress',
                query: q,
                queriesProcessed,
                totalQueries: queries.length,
                leadsFound: totalFound,
                targetCount,
                percentComplete: Math.round((queriesProcessed / queries.length) * 100),
                latestResults: results.slice(0, 5), // Send latest 5 results
              }
              controller.enqueue(encoder.encode(JSON.stringify(progress) + '\n'))

              return results
            } catch (e) {
              queriesProcessed++
              errors.push(`${q}: ${e instanceof Error ? e.message : 'error'}`)
              return []
            }
          })

          await Promise.all(promises)

          // Rate limiting between batches
          await new Promise(r => setTimeout(r, 500))

          // Safety: if we have enough results, stop
          if (totalFound >= targetCount) {
            controller.enqueue(encoder.encode(JSON.stringify({ type: 'status', message: `Target reached! Found ${totalFound.toLocaleString()} leads. Stopping...` }) + '\n'))
            break
          }
        }

        // Final summary
        const stats = {
          total: allResults.length,
          withPhone: allResults.filter(r => r.phone).length,
          withEmail: allResults.filter(r => r.email).length,
          withWebsite: allResults.filter(r => r.website).length,
          withSocial: allResults.filter(r => r.socialLinkedin || r.socialTwitter || r.socialFacebook || r.socialInstagram).length,
          withAddress: allResults.filter(r => r.address).length,
          industries: Array.from(new Set(allResults.map(r => r.industry).filter(Boolean))),
          countries: Array.from(new Set(allResults.map(r => r.country).filter(Boolean))),
        }

        controller.enqueue(encoder.encode(JSON.stringify({
          type: 'complete',
          message: `Scraping complete! Found ${totalFound.toLocaleString()} unique leads from ${queriesProcessed} queries.`,
          stats,
          queriesProcessed,
          totalQueries: queries.length,
          errors: errors.slice(0, 10),
          allResults, // Send all results for export
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
    console.error('Scrape API error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

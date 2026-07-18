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
function extractDomain(url: string): string { try { return new URL(url).hostname.replace('www.', '') } catch { return '' } }
function detectLocation(text: string, hintCountry: string, hintCity: string): { city: string; country: string } {
  const r: { city: string; country: string } = { city: hintCity, country: hintCountry }
  const cp: [RegExp, string][] = [
    [/united states|usa|america/i,'United States'],[/united kingdom|uk|britain|england/i,'United Kingdom'],
    [/india|bharat/i,'India'],[/canada/i,'Canada'],[/australia/i,'Australia'],[/germany/i,'Germany'],
    [/france/i,'France'],[/japan/i,'Japan'],[/china/i,'China'],[/uae|dubai/i,'UAE'],[/singapore/i,'Singapore'],
    [/brazil/i,'Brazil'],[/mexico/i,'Mexico'],[/south africa/i,'South Africa'],[/nigeria/i,'Nigeria'],
    [/kenya/i,'Kenya'],[/thailand/i,'Thailand'],[/vietnam/i,'Vietnam'],[/philippines/i,'Philippines'],
    [/indonesia/i,'Indonesia'],[/malaysia/i,'Malaysia'],[/pakistan/i,'Pakistan'],[/bangladesh/i,'Bangladesh'],
    [/sri lanka/i,'Sri Lanka'],[/nepal/i,'Nepal'],[/new zealand/i,'New Zealand'],[/south korea/i,'South Korea'],
    [/turkey/i,'Turkey'],[/saudi arabia/i,'Saudi Arabia'],[/israel/i,'Israel'],[/italy/i,'Italy'],
    [/spain/i,'Spain'],[/netherlands|holland/i,'Netherlands'],[/sweden/i,'Sweden'],[/norway/i,'Norway'],
    [/denmark/i,'Denmark'],[/finland/i,'Finland'],[/poland/i,'Poland'],[/russia/i,'Russia'],
    [/ireland/i,'Ireland'],[/switzerland/i,'Switzerland'],[/belgium/i,'Belgium'],[/austria/i,'Austria'],
    [/portugal/i,'Portugal'],[/greece/i,'Greece'],[/czech republic/i,'Czech Republic'],
    [/romania/i,'Romania'],[/hungary/i,'Hungary'],[/ukraine/i,'Ukraine'],[/colombia/i,'Colombia'],
    [/argentina/i,'Argentina'],[/chile/i,'Chile'],[/peru/i,'Peru'],[/egypt/i,'Egypt'],
    [/morocco/i,'Morocco'],[/tanzania/i,'Tanzania'],[/ethiopia/i,'Ethiopia'],[/ghana/i,'Ghana'],
  ]
  if (!r.country) { for (const [pat, c] of cp) { if (pat.test(text)) { r.country = c; break } } }
  return r
}

function buildCustomQueries(query: string, country: string, city: string, customLocation: string): string[] {
  const queries: string[] = []
  const locParts = [customLocation, city, country].filter(Boolean)
  const loc = locParts.length > 0 ? ` in ${locParts.join(', ')}` : ''

  // Core query variations
  queries.push(`${query}${loc}`)
  queries.push(`${query} directory${loc}`)
  queries.push(`${query} contact${loc}`)
  queries.push(`${query} phone number${loc}`)
  queries.push(`${query} email${loc}`)
  queries.push(`best ${query}${loc}`)
  queries.push(`${query} companies${loc}`)
  queries.push(`${query} businesses${loc}`)
  queries.push(`${query} firms${loc}`)
  queries.push(`${query} services${loc}`)
  queries.push(`${query} providers${loc}`)
  queries.push(`${query} suppliers${loc}`)
  queries.push(`${query} dealers${loc}`)
  queries.push(`${query} near me${loc ? ' ' + locParts[0] : ''}`)

  // Site-specific searches
  const sites = ['site:linkedin.com', 'site:justdial.com', 'site:sulekha.com', 'site:indiamart.com', 'site:yellowpages.com']
  for (const site of sites.slice(0, 3)) {
    queries.push(`${site} ${query}${loc}`)
  }

  return Array.from(new Set(queries))
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

async function processCustomQuery(
  query: string, apiKey: string,
  seenLinks: Set<string>, seenNames: Set<string>,
  country: string, city: string
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
      const loc = detectLocation(text + ' ' + query, country, city)

      results.push({
        id: `cl-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        name: item.title,
        phone: phones.join(', '),
        email: emails.join(', '),
        website: extractDomain(item.link),
        address: '',
        city: loc.city,
        country: loc.country,
        source: 'serper',
        snippet: item.snippet || '',
        scrapedDate: now,
      })
    }

    // Knowledge Graph
    if (data.knowledgeGraph?.title) {
      const kg = data.knowledgeGraph
      const kgText = `${kg.title} ${kg.description || ''} ${kg.website || ''}`
      const phones = extractPhones(kgText) || extractPhones(JSON.stringify(kg))
      const emails = extractEmails(kgText) || extractEmails(JSON.stringify(kg))
      const loc = detectLocation(kgText + ' ' + query, country, city)
      const key = `${kg.title?.toLowerCase()}_${extractDomain(kg.website || '')}`
      if (!seenNames.has(key)) {
        seenNames.add(key)
        results.unshift({
          id: `cl-kg-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
          name: kg.title || '',
          phone: phones.join(', '),
          email: emails.join(', '),
          website: extractDomain(kg.website || ''),
          address: kg.address || '',
          city: loc.city,
          country: loc.country,
          source: 'serper-kg',
          snippet: kg.description || '',
          scrapedDate: now,
        })
      }
    }
  } catch (e) { console.error(`Custom query error "${query}":`, e) }
  return results
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query = '', country = '', city = '', customLocation = '', maxResults = 100000 } = body

    if (!query.trim()) return NextResponse.json({ error: 'Search query is required' }, { status: 400 })

    const apiKey = process.env.SERPER_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'SERPER_API_KEY not configured. Set it in .env.local or Vercel env vars.' }, { status: 500 })

    const queries = buildCustomQueries(query.trim(), country, city, customLocation)
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
          message: `Starting custom search: "${query}" — ${queries.length} query variations...`,
          totalQueries: queries.length,
          targetCount: maxResults,
        }) + NL))

        for (let i = 0; i < queries.length; i += 5) {
          const batch = queries.slice(i, i + 5)
          const promises = batch.map(async (q) => {
            try {
              const results = await processCustomQuery(q, apiKey, seenLinks, seenNames, country, city)
              queriesProcessed++
              totalFound += results.length
              allResults.push(...results)
              controller.enqueue(encoder.encode(JSON.stringify({
                type: 'progress',
                currentQuery: q,
                queriesDone: queriesProcessed,
                queriesTotal: queries.length,
                percent: Math.round((queriesProcessed / queries.length) * 100),
                found: totalFound,
                results: results.slice(0, 5),
              }) + NL))
              return results
            } catch (e) { queriesProcessed++; return [] }
          })
          await Promise.all(promises)
          await new Promise(r => setTimeout(r, 400))
          if (totalFound >= maxResults) {
            controller.enqueue(encoder.encode(JSON.stringify({ type: 'status', message: `Target reached! Found ${totalFound} results.` }) + NL))
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
      headers: { 'Content-Type': 'application/x-ndjson', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' },
    })
  } catch (error) {
    console.error('Custom search API error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

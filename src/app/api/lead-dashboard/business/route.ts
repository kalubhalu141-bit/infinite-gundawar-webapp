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

// ─── Category Query Builder ───
const CATEGORY_QUERIES: Record<string, string[]> = {
  'real-estate': ['real estate agents', 'property dealers', 'real estate brokers', 'property consultants'],
  'doctors': ['doctors', 'physicians', 'medical practitioners', 'clinics'],
  'dentists': ['dentists', 'dental clinics', 'dental surgeons', 'orthodontists'],
  'lawyers': ['lawyers', 'law firms', 'attorneys', 'legal consultants'],
  'accountants': ['accountants', 'chartered accountants', 'CA firms', 'tax consultants'],
  'restaurants': ['restaurants', 'food courts', 'eateries', 'dining'],
  'hotels': ['hotels', 'resorts', 'lodges', 'guest houses'],
  'schools': ['schools', 'CBSE schools', 'ICSE schools', 'international schools'],
  'coaching': ['coaching institutes', 'tution centers', 'training institutes', 'competitive exam coaching'],
  'gyms': ['gyms', 'fitness centers', 'health clubs', 'crossfit'],
  'salons': ['beauty salons', 'hair salons', 'spa', 'beauty parlors'],
  'pharmacies': ['pharmacies', 'medical stores', 'chemists', 'drug stores'],
  'hospitals': ['hospitals', 'multi-specialty hospitals', 'medical centers', 'nursing homes'],
  'automobile': ['automobile dealers', 'car showrooms', 'auto dealers', 'vehicle dealers'],
  'electronics': ['electronics stores', 'mobile shops', 'computer stores', 'gadget shops'],
  'jewelry': ['jewelry stores', 'jewellers', 'gold shops', 'diamond jewellery'],
  'petroleum': ['petrol pumps', 'petrol stations', 'fuel stations', 'CNG stations'],
  'banks': ['banks', 'bank branches', 'ATMs', 'cooperative banks'],
  'insurance': ['insurance agents', 'insurance companies', 'LIC agents', 'policy agents'],
  'travel': ['travel agencies', 'tour operators', 'ticket booking', 'holiday packages'],
  'construction': ['construction companies', 'builders', 'contractors', 'civil contractors'],
  'architects': ['architects', 'architecture firms', 'design consultants'],
  'interior': ['interior designers', 'interior decorators', 'home decor'],
  'event': ['event managers', 'event planners', 'wedding planners', 'party organizers'],
  'catering': ['catering services', 'caterers', 'food catering', 'wedding catering'],
  'printing': ['printing shops', 'xerox shops', 'printing press', 'offset printing'],
  'hardware': ['hardware stores', 'building material', 'construction material', 'paint shops'],
  'furniture': ['furniture stores', 'furniture showrooms', 'home furniture', 'office furniture'],
  'clothing': ['clothing stores', 'textile shops', 'garment shops', 'fashion stores'],
  'footwear': ['footwear stores', 'shoe shops', 'sports shoes', 'branded footwear'],
  'sports': ['sports equipment', 'sports stores', 'sports goods', 'fitness equipment'],
  'books': ['book stores', 'stationery shops', 'library', 'book shops'],
  'music': ['music stores', 'musical instruments', 'music classes', 'guitar shops'],
  'photo': ['photography studios', 'photo studios', 'wedding photographers', 'event photographers'],
  'video': ['video production', 'film production', 'video editing', 'animation studios'],
  'it-services': ['IT services', 'software companies', 'web development', 'app development'],
  'web-design': ['web design', 'SEO services', 'digital marketing', 'web development agency'],
  'logistics': ['logistics companies', 'transport services', 'freight forwarding', 'courier services'],
  'warehouse': ['warehouses', 'storage facilities', 'godown', 'cold storage'],
  'import-export': ['import export', 'trading companies', 'exporters', 'importers'],
  'ayurveda': ['ayurveda centers', 'ayurvedic clinics', 'ayurvedic treatment', 'ayurvedic doctors'],
  'yoga': ['yoga classes', 'yoga studios', 'yoga centers', 'meditation centers'],
  'panchakarma': ['panchakarma centers', 'panchakarma treatment', 'ayurvedic panchakarma'],
  'dairy': ['dairy farms', 'milk dairy', 'dairy products', 'milk suppliers'],
  'agriculture': ['agricultural companies', 'agri services', 'agri consultants', 'farm services'],
  'farming': ['farming equipment', 'agricultural machinery', 'tractor dealers', 'farm tools'],
  'poultry': ['poultry farms', 'poultry feed', 'chicken farms', 'egg suppliers'],
  'fisheries': ['fisheries', 'fish farming', 'aquaculture', 'fish suppliers'],
  'florist': ['florists', 'flower shops', 'flower delivery', 'garden centers'],
  'bakery': ['bakeries', 'cake shops', 'pastry shops', 'bread bakery'],
  'sweet-shop': ['sweet shops', 'mithai shops', 'confectionery', 'sweets store'],
  'grocery': ['grocery stores', 'kirana stores', 'provision stores', 'general stores'],
  'super-market': ['supermarkets', 'hypermarkets', 'mega stores', 'retail chains'],
  'mall': ['shopping malls', 'malls', 'shopping centers', 'retail parks'],
}

function buildBusinessQueries(categories: string[], country: string, city: string, customLocation: string): string[] {
  const queries: string[] = []
  const locParts = [customLocation, city, country].filter(Boolean)
  const loc = locParts.length > 0 ? ` in ${locParts.join(', ')}` : ''
  const locShort = locParts.length > 0 ? ` ${locParts[0]}` : ''

  for (const cat of categories) {
    const terms = CATEGORY_QUERIES[cat] || [cat]
    for (const term of terms) {
      queries.push(`${term}${loc}`)
      queries.push(`best ${term}${loc}`)
      queries.push(`${term} directory${loc}`)
      queries.push(`${term} contact${loc}`)
      queries.push(`${term} phone number${loc}`)
      queries.push(`${term} near${locShort}`)
      queries.push(`top ${term}${loc}`)
      queries.push(`${term} list${loc}`)
    }
  }
  // Deduplicate
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

async function processBusinessQuery(
  query: string, apiKey: string,
  seenLinks: Set<string>, seenNames: Set<string>,
  country: string, city: string, category: string
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
        id: `bl-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        name: item.title,
        phone: phones.join(', '),
        email: emails.join(', '),
        website: extractDomain(item.link),
        address: '',
        city: loc.city,
        country: loc.country,
        category,
        source: 'serper',
        snippet: item.snippet || '',
        scrapedDate: now,
      })
    }

    // Also check knowledge graph
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
          id: `bl-kg-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
          name: kg.title || '',
          phone: phones.join(', '),
          email: emails.join(', '),
          website: extractDomain(kg.website || ''),
          address: kg.address || '',
          city: loc.city,
          country: loc.country,
          category,
          source: 'serper-kg',
          snippet: kg.description || '',
          scrapedDate: now,
        })
      }
    }
  } catch (e) { console.error(`Biz query error "${query}":`, e) }
  return results
}

// ─── Main Handler ───
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { categories = [], country = '', city = '', customLocation = '', maxResults = 100000 } = body

    if (!categories.length) return NextResponse.json({ error: 'At least one category is required' }, { status: 400 })

    const apiKey = process.env.SERPER_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'SERPER_API_KEY not configured. Set it in .env.local or Vercel env vars.' }, { status: 500 })

    const queries = buildBusinessQueries(categories, country, city, customLocation)
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
          message: `Starting business lead generation: ${queries.length} queries for ${categories.length} categories...`,
          totalQueries: queries.length,
          targetCount: maxResults,
        }) + NL))

        // Process in batches of 5 concurrent
        for (let i = 0; i < queries.length; i += 5) {
          const batch = queries.slice(i, i + 5)
          const catForQuery = (q: string) => {
            for (const cat of categories) {
              const terms = CATEGORY_QUERIES[cat] || [cat]
              for (const t of terms) { if (q.includes(t)) return cat }
            }
            return categories[0]
          }
          const promises = batch.map(async (q) => {
            try {
              const results = await processBusinessQuery(q, apiKey, seenLinks, seenNames, country, city, catForQuery(q))
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
            controller.enqueue(encoder.encode(JSON.stringify({ type: 'status', message: `Target reached! Found ${totalFound} leads.` }) + NL))
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
    console.error('Business leads API error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'

interface SearchResult {
  title: string
  url: string
  snippet: string
  type?: string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { query, type = 'general', country = '', city = '', location = '', limit = 8 } = body as {
      query: string
      type?: string
      country?: string
      city?: string
      location?: string
      limit?: number
    }

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    // Build enhanced search query with location
    let searchQuery = query
    if (city) searchQuery += ` in ${city}`
    if (location && !city) searchQuery += ` in ${location}`
    if (country) searchQuery += `, ${country}`

    // Type-specific modifiers
    const typeModifiers: Record<string, string> = {
      business: 'business company contact phone address',
      property: 'property for sale real estate price contact',
      website: 'official website',
      news: 'latest news today',
      hospital: 'hospital clinic doctor contact',
      restaurant: 'restaurant menu reviews address',
      school: 'school college admission fee contact',
      hotel: 'hotel booking price reviews address',
    }
    if (typeModifiers[type]) {
      searchQuery += ` ${typeModifiers[type]}`
    }

    const results = await searchWeb(searchQuery, limit)

    const categorized: SearchResult[] = results.map(r => ({
      ...r,
      type: categorizeResult(r, type),
    }))

    const summary = buildSummary(query, categorized, type)

    return NextResponse.json({
      query,
      searchQuery,
      results: categorized,
      summary,
      total: categorized.length,
    })
  } catch (err: any) {
    return NextResponse.json({ error: 'Search failed', message: err.message }, { status: 500 })
  }
}

async function searchWeb(query: string, limit: number): Promise<SearchResult[]> {
  const serperKey = process.env.SERPER_API_KEY

  if (serperKey) {
    try {
      const res = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: { 'X-API-KEY': serperKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: query, num: limit }),
        signal: AbortSignal.timeout(10000),
      })
      const data = await res.json()
      return (data.organic || []).slice(0, limit).map((r: any) => ({
        title: r.title || '',
        url: r.link || '',
        snippet: r.snippet || '',
      }))
    } catch { /* fallback */ }
  }

  // DuckDuckGo fallback
  try {
    const res = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`,
      { signal: AbortSignal.timeout(8000) }
    )
    const data = await res.json()
    const results: SearchResult[] = []

    if (data.AbstractText) {
      results.push({ title: data.Heading || query, url: data.AbstractURL || '', snippet: data.AbstractText })
    }
    for (const topic of (data.RelatedTopics || []).slice(0, limit - 1)) {
      if (topic.Text) {
        results.push({ title: topic.FirstURL?.split('/').pop()?.replace(/_/g, ' ') || 'Related', url: topic.FirstURL || '', snippet: topic.Text })
      }
      for (const sub of (topic.Topics || []).slice(0, 2)) {
        if (sub.Text) {
          results.push({ title: sub.FirstURL?.split('/').pop()?.replace(/_/g, ' ') || 'Related', url: sub.FirstURL || '', snippet: sub.Text })
        }
      }
    }
    return results.slice(0, limit)
  } catch {
    return []
  }
}

function categorizeResult(r: SearchResult, searchType: string): string {
  const url = r.url.toLowerCase()
  const title = r.title.toLowerCase()

  if (searchType !== 'general') return searchType
  if (url.includes('property') || url.includes('realestate') || url.includes('99acres') || url.includes('magicbricks') || url.includes('housing.com')) return 'property'
  if (url.includes('justdial') || url.includes('indiamart') || url.includes('sulekha') || url.includes('yelp')) return 'business'
  if (url.includes('wikipedia') || url.includes('.gov') || url.includes('.edu')) return 'website'
  if (url.includes('news') || url.includes('times') || url.includes('hindu') || url.includes('bbc')) return 'news'
  return 'general'
}

function buildSummary(query: string, results: SearchResult[], type: string): string {
  if (results.length === 0) {
    return `No results found for "${query}". Try different keywords or check spelling.`
  }
  const top = results[0]
  const typeLabels: Record<string, string> = {
    business: 'businesses', property: 'properties', website: 'websites',
    news: 'news articles', hospital: 'hospitals', restaurant: 'restaurants',
    school: 'schools', hotel: 'hotels', general: 'results',
  }
  const label = typeLabels[type] || 'results'
  let summary = `Found ${results.length} ${label} for "${query}". `
  if (top.snippet) {
    const s = top.snippet.length > 150 ? top.snippet.substring(0, 150) + '...' : top.snippet
    summary += s
  }
  return summary
}

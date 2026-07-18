'use client'
import GoalModeFeatures from '@/components/GoalModeFeatures'

import { useState, useRef, useCallback } from 'react'
import Navbar from '@/components/Navbar'
import PageEnhancements from '@/components/PageEnhancements'
import Footer from '@/components/Footer'

interface PhoneRecord {
  phone: string; type: string; confidence: number; source: string;
  name: string; website: string; emails: string[]; social: Record<string, string>;
}

interface PhoneStats {
  totalPhones: number; international: number; mobile: number; whatsapp: number;
  fromSearch: number; fromWebsites: number; websitesScraped: number;
  withEmail: number; withSocial: number; highConfidence: number; mediumConfidence: number; lowConfidence: number;
}

const COUNTRIES = ['', 'United States', 'United Kingdom', 'India', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'China', 'UAE', 'Singapore', 'Brazil', 'Mexico', 'South Africa', 'Nigeria', 'Kenya', 'Thailand', 'Vietnam', 'Philippines', 'Indonesia', 'Malaysia', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'New Zealand', 'South Korea', 'Turkey', 'Saudi Arabia', 'Israel', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Poland', 'Russia', 'Ireland', 'Switzerland', 'Belgium', 'Austria', 'Portugal', 'Greece', 'Czech Republic', 'Romania', 'Hungary', 'Ukraine', 'Colombia', 'Argentina', 'Chile', 'Peru', 'Venezuela', 'Egypt', 'Morocco', 'Tanzania', 'Ethiopia', 'Ghana']

export default function PhoneScraperPage() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [targetCount, setTargetCount] = useState(5000)
  const [scrapeWebsites, setScrapeWebsites] = useState(true)
  const [maxConcurrent, setMaxConcurrent] = useState(5)

  const [phones, setPhones] = useState<PhoneRecord[]>([])
  const [isScraping, setIsScraping] = useState(false)
  const [progress, setProgress] = useState({ percent: 0, phonesFound: 0, queriesProcessed: 0, totalQueries: 0, targetCount: 0, websitesScraped: 0 })
  const [stats, setStats] = useState<PhoneStats | null>(null)
  const [error, setError] = useState('')
  const [scrapeLog, setScrapeLog] = useState<string[]>([])
  const [showLog, setShowLog] = useState(false)
  const [copied, setCopied] = useState(false)
  const [filterType, setFilterType] = useState('all')
  const [filterSource, setFilterSource] = useState('all')
  const [filterConfidence, setFilterConfidence] = useState('all')
  const [searchFilter, setSearchFilter] = useState('')

  const abortRef = useRef<AbortController | null>(null)

  const handleScrape = async () => {
    if (!query.trim()) { setError('Please enter a search query'); return }

    setIsScraping(true)
    setError('')
    setPhones([])
    setStats(null)
    setScrapeLog([])
    setProgress({ percent: 0, phonesFound: 0, queriesProcessed: 0, totalQueries: 0, targetCount, websitesScraped: 0 })

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch('/api/phone-scraper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          location: location || undefined,
          targetCount,
          scrapeWebsites,
          maxConcurrent,
        }),
        signal: controller.signal,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Scraping failed')
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.trim()) continue
          try {
            const data = JSON.parse(line)
            if (data.type === 'status') {
              setScrapeLog(prev => [...prev.slice(-100), `📢 ${data.message}`])
              if (data.totalQueries) setProgress(p => ({ ...p, totalQueries: data.totalQueries, targetCount: data.targetCount }))
            } else if (data.type === 'progress') {
              setProgress({
                percent: data.percentComplete,
                phonesFound: data.phonesFound,
                queriesProcessed: data.queriesProcessed,
                totalQueries: data.totalQueries,
                targetCount: data.targetCount,
                websitesScraped: data.websitesScraped,
              })
              setScrapeLog(prev => [...prev.slice(-100), `✅ Query ${data.queriesProcessed}/${data.totalQueries}: ${data.phonesFound} phones found`])
              if (data.latestPhones?.length) {
                setPhones(prev => {
                  const existing = new Set(prev.map(p => p.phone))
                  const newPhones = data.latestPhones.filter((p: PhoneRecord) => !existing.has(p.phone))
                  return [...prev, ...newPhones]
                })
              }
            } else if (data.type === 'complete') {
              setStats(data.stats)
              setPhones(data.phones || [])
              setProgress(p => ({ ...p, percent: 100, phonesFound: data.stats?.totalPhones || 0 }))
              setScrapeLog(prev => [...prev.slice(-100), `🎉 COMPLETE: ${data.message}`])
            }
          } catch { /* skip */ }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') setError(err.message)
    } finally {
      setIsScraping(false)
      abortRef.current = null
    }
  }

  const handleStop = () => {
    abortRef.current?.abort()
    setIsScraping(false)
    setScrapeLog(prev => [...prev, '⛔ Scraping stopped by user'])
  }

  // ─── Export ───
  const exportCSV = () => {
    if (!phones.length) return
    const headers = ['Phone', 'Type', 'Confidence', 'Source', 'Name', 'Website', 'Emails', 'LinkedIn', 'Twitter', 'Facebook', 'Instagram', 'WhatsApp']
    const rows = phones.map(p => [
      p.phone, p.type, p.confidence, p.source, p.name, p.website,
      p.emails.join('; '), p.social.linkedin || '', p.social.twitter || '',
      p.social.facebook || '', p.social.instagram || '', p.social.whatsapp || ''
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `phones_${targetCount}_${Date.now()}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const exportJSON = () => {
    if (!phones.length) return
    const blob = new Blob([JSON.stringify(phones, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `phones_${targetCount}_${Date.now()}.json`; a.click()
    URL.revokeObjectURL(url)
  }

  const copyAllPhones = () => {
    const text = phones.map(p => p.phone).join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ─── Filtered Results ───
  const filteredPhones = phones.filter(p => {
    if (filterType !== 'all' && p.type !== filterType) return false
    if (filterSource !== 'all' && p.source !== filterSource) return false
    if (filterConfidence === 'high' && p.confidence < 90) return false
    if (filterConfidence === 'medium' && (p.confidence >= 90 || p.confidence < 70)) return false
    if (filterConfidence === 'low' && p.confidence >= 70) return false
    if (searchFilter) {
      const sf = searchFilter.toLowerCase()
      return p.phone.includes(sf) || p.name?.toLowerCase().includes(sf) || p.website?.toLowerCase().includes(sf)
    }
    return true
  })

  const getConfidenceColor = (c: number) => c >= 90 ? 'text-green-600 bg-green-50' : c >= 70 ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50'
  const getTypeIcon = (t: string) => {
    if (t.includes('whatsapp')) return '💬'
    if (t.includes('mobile') || t.includes('indian')) return '📱'
    if (t.includes('international') || t.includes('country')) return '🌍'
    if (t.includes('us_') || t.includes('uk_')) return '☎️'
    if (t.includes('tollfree')) return '🆓'
    if (t.includes('tel_link')) return '🔗'
    return '📞'
  }

  return (<>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <PageEnhancements />

      {/* Hero */}
      <section className="relative pt-28 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f] to-[#2c5282]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#d4a843] rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#2c5282] rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
            <span className={`w-2 h-2 rounded-full ${isScraping ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
            <span className="text-white/80 text-sm font-medium">{isScraping ? 'Scraping phones...' : 'Phone Number Scraper'}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Phone Number <span className="text-gradient">Extractor</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Extract phone numbers from Google Maps, Google Search, and direct website scraping.
            12+ phone patterns, confidence scoring, real-time streaming.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-6">

        {/* Scraper Panel */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-[#1e3a5f] mb-1.5">What to search</label>
              <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !isScraping && handleScrape()}
                placeholder="e.g., restaurants in Mumbai, plumbers in Delhi, doctors in London"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#d4a843] focus:ring-4 focus:ring-[#d4a843]/10 outline-none transition-all text-gray-800 placeholder-gray-400" />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-sm font-semibold text-[#1e3a5f] mb-1.5">Location</label>
              <select value={location} onChange={e => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#d4a843] outline-none text-gray-800 bg-white">
                {COUNTRIES.map(c => <option key={c} value={c}>{c || 'Any Location'}</option>)}
              </select>
            </div>
            <div className="w-full md:w-40">
              <label className="block text-sm font-semibold text-[#1e3a5f] mb-1.5">Target Phones</label>
              <select value={targetCount} onChange={e => setTargetCount(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#d4a843] outline-none text-gray-800 bg-white">
                <option value={100}>100 phones</option>
                <option value={500}>500 phones</option>
                <option value={1000}>1,000 phones</option>
                <option value={5000}>5,000 phones</option>
                <option value={10000}>10,000 phones</option>
                <option value={50000}>50,000 phones</option>
              </select>
            </div>
          </div>

          {/* Options */}
          <div className="flex flex-wrap gap-2 mb-4">
            <label className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-600 cursor-pointer hover:bg-gray-200">
              <input type="checkbox" checked={scrapeWebsites} onChange={e => setScrapeWebsites(e.target.checked)} className="rounded" />
              🌐 Scrape websites for phones (slower but more results)
            </label>
            <select value={maxConcurrent} onChange={e => setMaxConcurrent(Number(e.target.value))}
              className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-600 border-0">
              <option value={3}>3 concurrent (Safe)</option>
              <option value={5}>5 concurrent (Normal)</option>
              <option value={10}>10 concurrent (Fast)</option>
              <option value={20}>20 concurrent (Aggressive)</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            {!isScraping ? (
              <button onClick={handleScrape}
                className="flex-1 md:flex-none px-8 py-3 bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#1e3a5f]/25 transition-all flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                Extract {targetCount.toLocaleString()} Phone Numbers
              </button>
            ) : (
              <button onClick={handleStop}
                className="flex-1 md:flex-none px-8 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
                Stop Scraping
              </button>
            )}
            <button onClick={() => setShowLog(!showLog)}
              className="px-4 py-3 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition-all text-sm">
              📜 Log ({scrapeLog.length})
            </button>
          </div>

          {error && <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">⚠️ {error}</div>}
        </div>

        {/* Progress */}
        {isScraping && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-[#1e3a5f]">Extracting Phone Numbers...</h3>
                  <p className="text-xs text-gray-500">Query {progress.queriesProcessed}/{progress.totalQueries} • {progress.phonesFound.toLocaleString()} phones • {progress.websitesScraped} sites scraped</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#1e3a5f]">{progress.percent}%</div>
                <div className="text-xs text-gray-500">{progress.phonesFound.toLocaleString()} / {progress.targetCount.toLocaleString()}</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${progress.percent}%` }} />
            </div>
          </div>
        )}

        {/* Log */}
        {showLog && scrapeLog.length > 0 && (
          <div className="bg-gray-900 rounded-2xl shadow-xl p-4 mb-6 max-h-60 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-bold text-sm">Scrape Log</h3>
              <button onClick={() => setScrapeLog([])} className="text-gray-400 text-xs hover:text-white">Clear</button>
            </div>
            {scrapeLog.map((log, i) => <div key={i} className="text-xs text-green-400 font-mono py-0.5">{log}</div>)}
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
            <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center">
              <div className="text-xl font-bold text-[#1e3a5f]">{stats.totalPhones.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Total Phones</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center">
              <div className="text-xl font-bold text-green-600">{stats.highConfidence.toLocaleString()}</div>
              <div className="text-xs text-gray-500">High Confidence</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center">
              <div className="text-xl font-bold text-blue-600">{stats.international.toLocaleString()}</div>
              <div className="text-xs text-gray-500">International</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center">
              <div className="text-xl font-bold text-purple-600">{stats.mobile.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Mobile</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center">
              <div className="text-xl font-bold text-emerald-600">{stats.whatsapp.toLocaleString()}</div>
              <div className="text-xs text-gray-500">WhatsApp</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center">
              <div className="text-xl font-bold text-orange-600">{stats.websitesScraped.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Sites Scraped</div>
            </div>
          </div>
        )}

        {/* Results */}
        {phones.length > 0 && (
          <>
            {/* Toolbar */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 mb-4">
              <div className="flex flex-wrap items-center gap-3">
                <input type="text" value={searchFilter} onChange={e => setSearchFilter(e.target.value)} placeholder="🔍 Search phones..."
                  className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#d4a843]" />
                <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white">
                  <option value="all">All Types</option>
                  <option value="international">International</option>
                  <option value="indian_mobile">Indian Mobile</option>
                  <option value="us_phone">US Phone</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="tollfree">Toll-Free</option>
                  <option value="tel_link">Tel Link</option>
                </select>
                <select value={filterSource} onChange={e => setFilterSource(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white">
                  <option value="all">All Sources</option>
                  <option value="google_search">Google Search</option>
                  <option value="website_scrape">Website Scrape</option>
                </select>
                <select value={filterConfidence} onChange={e => setFilterConfidence(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white">
                  <option value="all">All Confidence</option>
                  <option value="high">High (90%+)</option>
                  <option value="medium">Medium (70-89%)</option>
                  <option value="low">Low (&lt;70%)</option>
                </select>
                <div className="flex gap-2 ml-auto">
                  <button onClick={copyAllPhones} className="px-3 py-2 bg-gray-100 rounded-lg text-xs font-medium hover:bg-gray-200">
                    {copied ? '✅ Copied!' : '📋 Copy Phones'}
                  </button>
                  <button onClick={exportCSV} className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200">📥 CSV</button>
                  <button onClick={exportJSON} className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200">📥 JSON</button>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-400">Showing {filteredPhones.length.toLocaleString()} of {phones.length.toLocaleString()} phone numbers</div>
            </div>

            {/* Phone Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-6">
              {filteredPhones.slice(0, 200).map((p, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-lg transition-all group">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getTypeIcon(p.type)}</span>
                      <a href={`tel:${p.phone}`} className="font-bold text-[#1e3a5f] text-sm hover:underline">{p.phone}</a>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${getConfidenceColor(p.confidence)}`}>{p.confidence}%</span>
                  </div>
                  {p.name && <p className="text-xs text-gray-600 truncate mb-1" title={p.name}>{p.name}</p>}
                  {p.website && <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline block truncate">{p.website}</a>}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">{p.type}</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">{p.source === 'google_search' ? '🔍 Google' : '🌐 Website'}</span>
                  </div>
                  {(p.emails.length > 0 || Object.keys(p.social).length > 0) && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      {p.emails.length > 0 && <div className="text-xs text-gray-500 truncate">📧 {p.emails[0]}</div>}
                      <div className="flex gap-1 mt-1">
                        {p.social.linkedin && <a href={p.social.linkedin} target="_blank" rel="noopener noreferrer" className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center text-xs font-bold text-blue-600">in</a>}
                        {p.social.twitter && <a href={p.social.twitter} target="_blank" rel="noopener noreferrer" className="w-5 h-5 bg-sky-100 rounded flex items-center justify-center text-xs font-bold text-sky-600">X</a>}
                        {p.social.facebook && <a href={p.social.facebook} target="_blank" rel="noopener noreferrer" className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center text-xs font-bold text-indigo-600">f</a>}
                        {p.social.instagram && <a href={p.social.instagram} target="_blank" rel="noopener noreferrer" className="w-5 h-5 bg-pink-100 rounded flex items-center justify-center text-xs font-bold text-pink-600">ig</a>}
                        {p.social.whatsapp && <a href={p.social.whatsapp} target="_blank" rel="noopener noreferrer" className="w-5 h-5 bg-green-100 rounded flex items-center justify-center text-xs font-bold text-green-600">W</a>}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {filteredPhones.length > 200 && <div className="text-center text-sm text-gray-400 mb-6">Showing first 200 of {filteredPhones.length.toLocaleString()}. Export to see all.</div>}
          </>
        )}

        {/* Empty State */}
        {!isScraping && phones.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📞</span>
            </div>
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">Phone Number Extractor</h3>
            <p className="text-gray-500 max-w-lg mx-auto mb-6">Extract phone numbers from Google Maps, Google Search, and direct website scraping. 12+ phone patterns with confidence scoring.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
              <div className="p-3 bg-white rounded-xl border border-gray-100 text-center"><div className="text-2xl mb-1">🗺️</div><div className="text-xs font-semibold text-[#1e3a5f]">Google Maps</div></div>
              <div className="p-3 bg-white rounded-xl border border-gray-100 text-center"><div className="text-2xl mb-1">🔍</div><div className="text-xs font-semibold text-[#1e3a5f]">Google Search</div></div>
              <div className="p-3 bg-white rounded-xl border border-gray-100 text-center"><div className="text-2xl mb-1">🌐</div><div className="text-xs font-semibold text-[#1e3a5f]">Website Scrape</div></div>
              <div className="p-3 bg-white rounded-xl border border-gray-100 text-center"><div className="text-2xl mb-1">📊</div><div className="text-xs font-semibold text-[#1e3a5f]">Confidence Score</div></div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
    <GoalModeFeatures page="phone-scraper" />
  </>
  )
}

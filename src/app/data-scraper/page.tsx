'use client'
import GoalModeFeatures from '@/components/GoalModeFeatures'

import { useState, useCallback, useRef } from 'react'
import Navbar from '@/components/Navbar'
import PageEnhancements from '@/components/PageEnhancements'
import Footer from '@/components/Footer'
import { FEATURE_REGISTRY, getFeatureCountByCategory } from '@/lib/feature-registry'
import { getUpdateLog, getTodaysFeatures } from '@/lib/auto-update'

interface ScrapedRecord {
  name: string; phone: string; email: string; website: string; address: string;
  city: string; state: string; country: string; category: string; subCategory: string;
  industry: string; socialLinkedin: string; socialTwitter: string; socialFacebook: string;
  socialInstagram: string; socialYoutube: string; sourceUrl: string; snippet: string; scrapedDate: string;
  confidence?: number; type?: string;
}

const CATEGORIES = [
  { id: '1', name: 'All Business Leads Worldwide', icon: '🌍' },
  { id: '2', name: 'All Business in India', icon: '🇮🇳' },
  { id: '3', name: 'Professionals & Students', icon: '👥' },
  { id: '4', name: 'People Worldwide', icon: '🌐' },
]

const COUNTRIES = ['', 'United States', 'United Kingdom', 'India', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'China', 'UAE', 'Singapore', 'Brazil', 'Mexico', 'South Africa', 'Nigeria', 'Kenya', 'Thailand', 'Vietnam', 'Philippines', 'Indonesia', 'Malaysia', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'New Zealand', 'South Korea', 'Turkey', 'Saudi Arabia', 'Israel', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Poland', 'Russia', 'Ireland', 'Switzerland', 'Belgium', 'Austria', 'Portugal', 'Greece', 'Czech Republic', 'Romania', 'Hungary', 'Ukraine', 'Colombia', 'Argentina', 'Chile', 'Peru', 'Venezuela', 'Egypt', 'Morocco', 'Tanzania', 'Ethiopia', 'Ghana']

export default function ScraperDashboard() {
  // ─── State ───
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scrape' | 'phones' | 'emails' | 'social' | 'history' | 'updates'>('dashboard')
  const [selectedCategory, setSelectedCategory] = useState('1')
  const [query, setQuery] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [targetCount, setTargetCount] = useState(100000)
  const [scrapeWebsites, setScrapeWebsites] = useState(true)
  const [maxConcurrent, setMaxConcurrent] = useState(5)

  const [results, setResults] = useState<ScrapedRecord[]>([])
  const [isScraping, setIsScraping] = useState(false)
  const [progress, setProgress] = useState({ percent: 0, found: 0, queriesProcessed: 0, totalQueries: 0, targetCount: 0, websitesScraped: 0 })
  const [stats, setStats] = useState<any>(null)
  const [error, setError] = useState('')
  const [scrapeLog, setScrapeLog] = useState<string[]>([])
  const [showLog, setShowLog] = useState(false)
  const [copied, setCopied] = useState(false)
  const [searchFilter, setSearchFilter] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'analytics'>('table')

  const abortRef = useRef<AbortController | null>(null)

  // ─── Feature Registry ───
  const featureCounts = getFeatureCountByCategory()
  const updateLog = getUpdateLog()
  const todaysFeatures = getTodaysFeatures()

  // ─── Scrape Handler ───
  const handleScrape = useCallback(async () => {
    if (!query.trim()) { setError('Please enter a search query'); return }

    setIsScraping(true)
    setError('')
    setResults([])
    setStats(null)
    setScrapeLog([])
    setProgress({ percent: 0, found: 0, queriesProcessed: 0, totalQueries: 0, targetCount, websitesScraped: 0 })

    const controller = new AbortController()
    abortRef.current = controller

    const endpoint = activeTab === 'phones' ? '/api/phone-scraper' : '/api/scrape'

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          category: selectedCategory,
          targetCount,
          country: country || undefined,
          city: city || undefined,
          scrapeWebsites,
          maxConcurrent,
          location: country || city || undefined,
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
                found: data.leadsFound || data.phonesFound || 0,
                queriesProcessed: data.queriesProcessed,
                totalQueries: data.totalQueries,
                targetCount: data.targetCount,
                websitesScraped: data.websitesScraped || 0,
              })
              setScrapeLog(prev => [...prev.slice(-100), `✅ Query ${data.queriesProcessed}/${data.totalQueries}: ${data.leadsFound || data.phonesFound} found`])
              const newResults = data.latestResults || data.latestPhones || []
              if (newResults.length) {
                setResults(prev => {
                  const existing = new Set(prev.map(r => r.sourceUrl || r.phone))
                  const filtered = newResults.filter((r: any) => !existing.has(r.sourceUrl || r.phone))
                  return [...prev, ...filtered]
                })
              }
            } else if (data.type === 'complete') {
              setStats(data.stats)
              setResults(data.allResults || data.phones || [])
              setProgress(p => ({ ...p, percent: 100, found: data.stats?.total || data.stats?.totalPhones || 0 }))
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
  }, [query, selectedCategory, targetCount, country, city, scrapeWebsites, maxConcurrent, activeTab])

  const handleStop = () => {
    abortRef.current?.abort()
    setIsScraping(false)
    setScrapeLog(prev => [...prev, '⛔ Scraping stopped by user'])
  }

  // ─── Export ───
  const exportCSV = () => {
    if (!results.length) return
    const headers = ['Name', 'Phone', 'Email', 'Website', 'City', 'State', 'Country', 'Industry', 'Source URL', 'Scraped Date']
    const rows = results.map(r => headers.map(h => `"${(r[h.toLowerCase().replace(' ', '') as keyof ScrapedRecord] || '').toString().replace(/"/g, '""')}"`).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `scraper_${Date.now()}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const exportJSON = () => {
    if (!results.length) return
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `scraper_${Date.now()}.json`; a.click()
    URL.revokeObjectURL(url)
  }

  const copyAll = () => {
    const text = results.map(r => [r.name, r.phone, r.email, r.website, r.sourceUrl].filter(Boolean).join(' | ')).join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ─── Filtered Results ───
  const filteredResults = results
    .filter(r => {
      if (!searchFilter) return true
      const sf = searchFilter.toLowerCase()
      return r.name?.toLowerCase().includes(sf) || r.website?.toLowerCase().includes(sf) || r.email?.toLowerCase().includes(sf) || r.country?.toLowerCase().includes(sf) || r.phone?.toLowerCase().includes(sf)
    })
    .sort((a, b) => {
      const av = (a[sortBy as keyof ScrapedRecord] || '').toString()
      const bv = (b[sortBy as keyof ScrapedRecord] || '').toString()
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })

  // ─── Tabs ───
  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'scrape', label: '🔍 Data Scraper', icon: '🔍' },
    { id: 'phones', label: '📞 Phone Scraper', icon: '📞' },
    { id: 'emails', label: '📧 Email Scraper', icon: '📧' },
    { id: 'social', label: '👥 Social Scraper', icon: '👥' },
    { id: 'history', label: '📜 History', icon: '📜' },
    { id: 'updates', label: '🆕 Updates', icon: '🆕' },
  ]

  return (<>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <PageEnhancements />

      {/* Hero */}
      <section className="relative pt-24 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f] to-[#2c5282]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#d4a843] rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#2c5282] rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 mb-3">
                <span className={`w-2 h-2 rounded-full ${isScraping ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
                <span className="text-white/80 text-xs font-medium">{isScraping ? 'Scraping...' : `${FEATURE_REGISTRY.length} Tools Active`}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                Scraping <span className="text-gradient">Command Center</span>
              </h1>
              <p className="text-sm text-white/60">All-in-one data extraction platform • Auto-updates daily • 100K+ leads per scrape</p>
            </div>
            <div className="hidden md:flex gap-3">
              <div className="text-center px-4 py-2 bg-white/10 rounded-xl">
                <div className="text-xl font-bold text-white">{results.length.toLocaleString()}</div>
                <div className="text-xs text-white/50">Total Leads</div>
              </div>
              <div className="text-center px-4 py-2 bg-white/10 rounded-xl">
                <div className="text-xl font-bold text-white">{FEATURE_REGISTRY.length}</div>
                <div className="text-xs text-white/50">Tools</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-2">

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl p-1.5 shadow-lg border border-gray-100 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[100px] px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${activeTab === tab.id ? 'bg-[#1e3a5f] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── Dashboard Tab ─── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Feature Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {FEATURE_REGISTRY.filter(f => f.enabled).map(feature => (
                <div key={feature.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => {
                    if (feature.category === 'phone') setActiveTab('phones')
                    else if (feature.category === 'email') setActiveTab('emails')
                    else if (feature.category === 'social') setActiveTab('social')
                    else setActiveTab('scrape')
                  }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{feature.icon}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${feature.speed === 'fast' ? 'bg-green-100 text-green-700' : feature.speed === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {feature.speed}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#1e3a5f] text-sm mb-1">{feature.name}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2">{feature.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-300">v{feature.version}</span>
                    <span className="text-xs text-gray-300">{(feature.maxResults / 1000).toFixed(0)}K max</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
                <div className="text-2xl font-bold text-[#1e3a5f]">{FEATURE_REGISTRY.filter(f => f.enabled).length}</div>
                <div className="text-xs text-gray-500">Active Tools</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
                <div className="text-2xl font-bold text-green-600">{results.length.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Total Leads Scraped</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
                <div className="text-2xl font-bold text-blue-600">{Object.keys(featureCounts).length}</div>
                <div className="text-xs text-gray-500">Categories</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
                <div className="text-2xl font-bold text-purple-600">{todaysFeatures.length}</div>
                <div className="text-xs text-gray-500">New This Week</div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-bold text-[#1e3a5f] mb-4">Tools by Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(featureCounts).map(([cat, count]) => (
                  <div key={cat} className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-[#1e3a5f]">{count}</div>
                    <div className="text-xs text-gray-500 capitalize">{cat}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Scraper Tabs (Scrape, Phones, Emails, Social) ─── */}
        {(activeTab === 'scrape' || activeTab === 'phones' || activeTab === 'emails' || activeTab === 'social') && (
          <div className="space-y-6">
            {/* Scraper Panel */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{activeTab === 'phones' ? '📞' : activeTab === 'emails' ? '📧' : activeTab === 'social' ? '👥' : '🔍'}</span>
                <div>
                  <h2 className="font-bold text-[#1e3a5f]">{activeTab === 'phones' ? 'Phone Number Extractor' : activeTab === 'emails' ? 'Email Address Extractor' : activeTab === 'social' ? 'Social Media Scraper' : 'Data Scraper'}</h2>
                  <p className="text-xs text-gray-400">{activeTab === 'phones' ? 'Extract phone numbers from Google, Maps, and websites' : activeTab === 'emails' ? 'Extract email addresses from websites and directories' : activeTab === 'social' ? 'Scrape LinkedIn, Instagram, Facebook, Twitter profiles' : 'Extract business leads and contact data'}</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-[#1e3a5f] mb-1.5">Search Query</label>
                  <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !isScraping && handleScrape()}
                    placeholder={activeTab === 'phones' ? 'e.g., restaurants in Mumbai phone number' : activeTab === 'emails' ? 'e.g., software companies in USA email' : activeTab === 'social' ? 'e.g., software engineers LinkedIn India' : 'e.g., software companies in United States'}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#d4a843] focus:ring-4 focus:ring-[#d4a843]/10 outline-none transition-all text-gray-800 placeholder-gray-400" />
                </div>
                <div className="w-full md:w-40">
                  <label className="block text-sm font-semibold text-[#1e3a5f] mb-1.5">Location</label>
                  <select value={country} onChange={e => setCountry(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none text-gray-800 bg-white">
                    {COUNTRIES.map(c => <option key={c} value={c}>{c || 'Any Location'}</option>)}
                  </select>
                </div>
                <div className="w-full md:w-40">
                  <label className="block text-sm font-semibold text-[#1e3a5f] mb-1.5">Target</label>
                  <select value={targetCount} onChange={e => setTargetCount(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none text-gray-800 bg-white">
                    <option value={1000}>1,000</option>
                    <option value={5000}>5,000</option>
                    <option value={10000}>10,000</option>
                    <option value={50000}>50,000</option>
                    <option value={100000}>100,000</option>
                    <option value={500000}>500,000</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <label className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={scrapeWebsites} onChange={e => setScrapeWebsites(e.target.checked)} className="rounded" />
                  🌐 Deep scrape websites
                </label>
                <select value={maxConcurrent} onChange={e => setMaxConcurrent(Number(e.target.value))} className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-600 border-0">
                  <option value={3}>3 concurrent</option>
                  <option value={5}>5 concurrent</option>
                  <option value={10}>10 concurrent</option>
                  <option value={20}>20 concurrent</option>
                </select>
              </div>

              <div className="flex gap-3">
                {!isScraping ? (
                  <button onClick={handleScrape}
                    className="flex-1 md:flex-none px-8 py-3 bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Scrape {targetCount.toLocaleString()} {activeTab === 'phones' ? 'Phones' : activeTab === 'emails' ? 'Emails' : 'Leads'}
                  </button>
                ) : (
                  <button onClick={handleStop}
                    className="flex-1 md:flex-none px-8 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
                    Stop
                  </button>
                )}
                <button onClick={() => setShowLog(!showLog)} className="px-4 py-3 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 text-sm">📜 Log</button>
              </div>
              {error && <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">⚠️ {error}</div>}
            </div>

            {/* Progress */}
            {isScraping && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-[#1e3a5f]">Scraping in Progress...</h3>
                    <p className="text-xs text-gray-500">Query {progress.queriesProcessed}/{progress.totalQueries} • {progress.found.toLocaleString()} found • {progress.websitesScraped} sites scraped</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#1e3a5f]">{progress.percent}%</div>
                    <div className="text-xs text-gray-500">{progress.found.toLocaleString()} / {progress.targetCount.toLocaleString()}</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#1e3a5f] to-[#d4a843] rounded-full transition-all duration-500" style={{ width: `${progress.percent}%` }} />
                </div>
              </div>
            )}

            {/* Log */}
            {showLog && scrapeLog.length > 0 && (
              <div className="bg-gray-900 rounded-2xl shadow-xl p-4 max-h-48 overflow-y-auto">
                {scrapeLog.map((log, i) => <div key={i} className="text-xs text-green-400 font-mono py-0.5">{log}</div>)}
              </div>
            )}

            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
                  <div className="text-lg font-bold text-[#1e3a5f]">{(stats.total || stats.totalPhones || 0).toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
                <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
                  <div className="text-lg font-bold text-green-600">{(stats.withPhone || stats.highConfidence || 0).toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Phones</div>
                </div>
                <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
                  <div className="text-lg font-bold text-blue-600">{(stats.withEmail || 0).toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Emails</div>
                </div>
                <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
                  <div className="text-lg font-bold text-purple-600">{(stats.withWebsite || 0).toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Websites</div>
                </div>
                <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
                  <div className="text-lg font-bold text-pink-600">{(stats.withSocial || 0).toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Social</div>
                </div>
                <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
                  <div className="text-lg font-bold text-orange-600">{stats.websitesScraped || 0}</div>
                  <div className="text-xs text-gray-500">Sites</div>
                </div>
              </div>
            )}

            {/* Results */}
            {results.length > 0 && (
              <div>
                {/* Toolbar */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 mb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <input type="text" value={searchFilter} onChange={e => setSearchFilter(e.target.value)} placeholder="🔍 Filter..." className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#d4a843]" />
                    <div className="flex gap-2 ml-auto">
                      <button onClick={copyAll} className="px-3 py-2 bg-gray-100 rounded-lg text-xs font-medium hover:bg-gray-200">{copied ? '✅ Copied!' : '📋 Copy'}</button>
                      <button onClick={exportCSV} className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200">📥 CSV</button>
                      <button onClick={exportJSON} className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200">📥 JSON</button>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">Showing {filteredResults.length.toLocaleString()} of {results.length.toLocaleString()}</div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5282]">
                          <th className="px-3 py-2 text-left text-xs font-semibold text-white">#</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-white">Name</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-white">Phone</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-white">Email</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-white">Website</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-white">Location</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-white">Social</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredResults.slice(0, 500).map((r, i) => (
                          <tr key={i} className={`hover:bg-blue-50/50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                            <td className="px-3 py-2 text-xs text-gray-400 font-mono">{i + 1}</td>
                            <td className="px-3 py-2 text-sm font-semibold text-[#1e3a5f] max-w-[200px] truncate">{r.name}</td>
                            <td className="px-3 py-2 text-xs">{r.phone ? <a href={`tel:${r.phone.replace(/[^\d+]/g, '')}`} className="text-green-600 hover:underline">{r.phone}</a> : '—'}</td>
                            <td className="px-3 py-2 text-xs">{r.email ? <a href={`mailto:${r.email}`} className="text-blue-600 hover:underline block max-w-[150px] truncate">{r.email}</a> : '—'}</td>
                            <td className="px-3 py-2 text-xs">{r.website ? <a href={`https://${r.website}`} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline block max-w-[150px] truncate">{r.website}</a> : '—'}</td>
                            <td className="px-3 py-2 text-xs text-gray-600">{[r.city, r.state, r.country].filter(Boolean).join(', ') || '—'}</td>
                            <td className="px-3 py-2">
                              <div className="flex gap-1">
                                {r.socialLinkedin && <a href={r.socialLinkedin} target="_blank" rel="noopener noreferrer" className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center text-xs font-bold text-blue-600">in</a>}
                                {r.socialTwitter && <a href={r.socialTwitter} target="_blank" rel="noopener noreferrer" className="w-6 h-6 bg-sky-100 rounded flex items-center justify-center text-xs font-bold text-sky-600">X</a>}
                                {r.socialFacebook && <a href={r.socialFacebook} target="_blank" rel="noopener noreferrer" className="w-6 h-6 bg-indigo-100 rounded flex items-center justify-center text-xs font-bold text-indigo-600">f</a>}
                                {r.socialInstagram && <a href={r.socialInstagram} target="_blank" rel="noopener noreferrer" className="w-6 h-6 bg-pink-100 rounded flex items-center justify-center text-xs font-bold text-pink-600">ig</a>}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredResults.length > 500 && <div className="p-4 text-center text-sm text-gray-400">Showing first 500 of {filteredResults.length.toLocaleString()}. Export to see all.</div>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── History Tab ─── */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 className="font-bold text-[#1e3a5f] mb-4">📜 Scraping History</h2>
            <p className="text-sm text-gray-500 mb-4">Total leads scraped this session: <span className="font-bold text-[#1e3a5f]">{results.length.toLocaleString()}</span></p>
            {results.length > 0 ? (
              <div className="space-y-2">
                {results.slice(0, 50).map((r, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-400 font-mono w-8">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-[#1e3a5f] truncate">{r.name}</div>
                      <div className="text-xs text-gray-400 truncate">{[r.phone, r.email, r.website].filter(Boolean).join(' • ')}</div>
                    </div>
                    <span className="text-xs text-gray-300">{r.scrapedDate?.split('T')[0]}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">No scraping history yet. Start scraping to see results here.</div>
            )}
          </div>
        )}

        {/* ─── Updates Tab ─── */}
        {activeTab === 'updates' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h2 className="font-bold text-[#1e3a5f] mb-2">🆕 Auto-Update System</h2>
              <p className="text-sm text-gray-500 mb-4">New scraping tools are added daily. The system automatically enables new features.</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{FEATURE_REGISTRY.filter(f => f.enabled).length}</div>
                  <div className="text-xs text-green-700">Active Tools</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{todaysFeatures.length}</div>
                  <div className="text-xs text-blue-700">Added This Week</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{Object.keys(featureCounts).length}</div>
                  <div className="text-xs text-purple-700">Categories</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">Daily</div>
                  <div className="text-xs text-orange-700">Update Frequency</div>
                </div>
              </div>

              <h3 className="font-bold text-[#1e3a5f] mb-3">Recent Updates</h3>
              <div className="space-y-2">
                {updateLog.slice(-10).reverse().map((log, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-xl">{log.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-[#1e3a5f]">{log.feature}</div>
                      <div className="text-xs text-gray-400">Added: {log.date}</div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Active</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coming Soon */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="font-bold text-[#1e3a5f] mb-3">🔮 Coming Soon</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['AI-Powered Lead Scoring', 'Real-time Verification', 'API Access', 'Webhook Notifications', 'Custom Scraping Rules', 'Multi-language Support', 'Proxy Rotation', 'CAPTCHA Solving', 'Image OCR Contacts', 'Voice Number Verification'].map((feature, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="text-sm font-semibold text-gray-600">{feature}</div>
                    <div className="text-xs text-gray-400 mt-1">Coming {i + 1} days</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
    <GoalModeFeatures page="data-scraper" />
  </>
  )
}

'use client'
import GoalModeFeatures from '@/components/GoalModeFeatures'
import PageEnhancements from '@/components/PageEnhancements'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { trendingBots, botCategories, TrendingBot } from '@/data/trending-bots'
import PageHead from '@/components/PageHead'


export default function TrendingBotsPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showTrendingOnly, setShowTrendingOnly] = useState(false)
  const [sortBy, setSortBy] = useState<'rating' | 'trending' | 'growth'>('trending')

  const filteredBots = useMemo(() => {
    let bots = [...trendingBots]

    if (activeCategory !== 'all') {
      bots = bots.filter(b => b.category === activeCategory)
    }

    if (showTrendingOnly) {
      bots = bots.filter(b => b.trending)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      bots = bots.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.tags.some(tag => tag.toLowerCase().includes(q)) ||
        b.useCase.toLowerCase().includes(q)
      )
    }

    if (sortBy === 'rating') bots.sort((a, b) => b.rating - a.rating)
    else if (sortBy === 'trending') {
      bots.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0) || b.rating - a.rating)
    } else {
      bots.sort((a, b) => {
        const numA = parseFloat(a.growth.replace(/[^0-9.]/g, ''))
        const numB = parseFloat(b.growth.replace(/[^0-9.]/g, ''))
        return numB - numA
      })
    }

    return bots
  }, [activeCategory, searchQuery, showTrendingOnly, sortBy])

  const trendingCount = trendingBots.filter(b => b.trending).length
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <>
      <PageEnhancements />

        {/* Cinematic Video Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        </div>


      {/* Cartoon Video Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      </div>

      <PageHead
        title="Trending AI Bots 2025 — Daily Updated AI Bot Rankings | Infinite Gundawar"
        description="Discover the hottest trending AI bots updated daily. ChatGPT, Claude, Gemini, and 70+ more AI bots ranked by growth, rating, and daily users."
        keywords={["trending AI bots", "best AI bots 2025", "AI bot rankings", "ChatGPT", "Claude AI", "Gemini", "AI chatbot trends", "new AI bots"]}
      />

      {/* Hero */}
      <section className="relative pt-28 pb-16 bg-gradient-to-br from-[#0f172a] via-[#1a1a2e] to-[#16213e] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-[150px]" />
          <div className="absolute top-40 right-1/3 w-64 h-64 bg-pink-500 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-purple-300 mb-6 border border-white/10">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              Updated Daily • {today}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">AI Bots</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              The hottest AI bots ranked by growth, users, and innovation. Updated every 24 hours with the latest trending AI.
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search AI bots... (e.g. chatbot, coding, marketing)"
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 text-lg"
              />
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{trendingBots.length}+</div>
                <div className="text-sm text-gray-400">AI Bots</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{trendingCount}</div>
                <div className="text-sm text-gray-400">Trending Now</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{botCategories.length - 1}</div>
                <div className="text-sm text-gray-400">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400">24h</div>
                <div className="text-sm text-gray-400">Refresh</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 md:top-20 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 overflow-x-auto">
              <div className="flex gap-2 pb-1">
                {botCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      activeCategory === cat.id
                        ? 'bg-[#1a1a2e] text-white shadow-lg shadow-purple-500/20'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setShowTrendingOnly(!showTrendingOnly)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  showTrendingOnly
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🔥 Trending
              </button>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as 'rating' | 'trending' | 'growth')}
                className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600 focus:outline-none cursor-pointer"
              >
                <option value="trending">Sort: Trending</option>
                <option value="rating">Sort: Top Rated</option>
                <option value="growth">Sort: Fastest Growing</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Bots Grid */}
      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredBots.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No bots found</h3>
              <p className="text-gray-500">Try a different search or category</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-semibold text-gray-700">{filteredBots.length}</span> bots
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBots.map(bot => (
                  <BotCard key={bot.id} bot={bot} />
                ))}
              </div>
    <GoalModeFeatures page="trending-bots" />
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Need a Custom AI Bot for Your Business?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            We build intelligent AI chatbots, automation bots, and custom AI solutions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/ai-tools" className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
              🛠️ Browse AI Tools
            </Link>
            <Link href="/contact" className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-all">
              📞 Get Custom AI Bot
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function BotCard({ bot }: { bot: TrendingBot }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300 ${expanded ? 'ring-2 ring-purple-500/20' : ''}`}>
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={bot.image}
          alt={bot.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {bot.trending && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
            🔥 Trending
          </div>
        )}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
          ⭐ {bot.rating}
        </div>
        <div className="absolute bottom-3 left-3">
          <h3 className="text-xl font-bold text-white">{bot.name}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{bot.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {bot.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-purple-50 text-purple-600 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span className="flex items-center gap-1">👥 {bot.dailyUsers}</span>
          <span className="flex items-center gap-1">💰 {bot.pricing}</span>
        </div>
        <div className="flex items-center justify-between text-xs mb-4">
          <span className="text-emerald-600 font-medium">📈 {bot.growth}</span>
          <span className="text-gray-400">Since {bot.launchDate}</span>
        </div>

        {/* Expanded */}
        {expanded && (
          <div className="mb-4 space-y-3">
            <div className="p-3 bg-purple-50 rounded-xl">
              <p className="text-xs font-semibold text-purple-700 mb-1">Use Case:</p>
              <p className="text-xs text-purple-600">{bot.useCase}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs font-semibold text-gray-700 mb-1">Platform:</p>
              <p className="text-xs text-gray-600">{bot.platform}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs font-semibold text-gray-700 mb-2">Key Features:</p>
              <ul className="space-y-1">
                {bot.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <a
            href={bot.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 bg-[#1a1a2e] text-white text-sm font-medium rounded-xl text-center hover:bg-[#2d2d4a] transition-colors"
          >
            Try Bot →
          </a>
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
          >
            {expanded ? 'Less' : 'More'}
          </button>
        </div>
      </div>
    </div>
  )
}
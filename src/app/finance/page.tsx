'use client'
import GoalModeFeatures from '@/components/GoalModeFeatures'

import { useState, useEffect, useCallback } from 'react'
import Navbar from '@/components/Navbar'
import PageEnhancements from '@/components/PageEnhancements'
import SectionTip from '@/components/SectionTip'
import Footer from '@/components/Footer'
import FinanceCalculators from '@/components/FinanceCalculators'

/* ─── Types ─── */
interface StockSymbol {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

interface NewsItem {
  title: string
  source: string
  time: string
  url: string
  category: string
}

interface CryptoItem {
  name: string
  symbol: string
  price: number
  change24h: number
  marketCap: string
}

interface HackTip {
  id: number
  title: string
  description: string
  category: string
  icon: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
}

/* ─── Live Clock ─── */
function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="font-mono text-sm text-gray-500">
      {time.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
      {' '}
      {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  )
}

/* ─── Stock Ticker ─── */
function StockTicker() {
  const [stocks, setStocks] = useState<StockSymbol[]>([
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2456.30, change: 32.15, changePercent: 1.33 },
    { symbol: 'TCS', name: 'Tata Consultancy', price: 3891.50, change: -45.20, changePercent: -1.15 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1678.90, change: 18.40, changePercent: 1.11 },
    { symbol: 'INFY', name: 'Infosys Ltd', price: 1523.75, change: 12.60, changePercent: 0.83 },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1124.30, change: -8.90, changePercent: -0.79 },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: 2345.60, change: 15.80, changePercent: 0.68 },
    { symbol: 'SBIN', name: 'State Bank of India', price: 612.45, change: 9.30, changePercent: 1.54 },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1287.50, change: -12.40, changePercent: -0.95 },
    { symbol: 'ITC', name: 'ITC Limited', price: 432.15, change: 5.60, changePercent: 1.31 },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', price: 1789.20, change: 22.10, changePercent: 1.25 },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(s => {
        const fluctuation = (Math.random() - 0.5) * 8
        const newPrice = +(s.price + fluctuation).toFixed(2)
        const newChange = +(newPrice - (s.price - s.change)).toFixed(2)
        const newPercent = +((newChange / (s.price - s.change)) * 100).toFixed(2)
        return { ...s, price: newPrice, change: newChange, changePercent: newPercent }
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="overflow-hidden">
      <div className="flex gap-6 animate-[scroll_30s_linear_infinite]">
        {[...stocks, ...stocks].map((s, i) => (
          <div key={`${s.symbol}-${i}`} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 whitespace-nowrap shadow-sm">
            <span className="font-bold text-sm text-[#1e3a5f]">{s.symbol}</span>
            <span className="font-mono text-sm font-semibold">₹{s.price.toLocaleString('en-IN')}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.change >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {s.change >= 0 ? '+' : ''}{s.changePercent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Market Indices ─── */
function MarketIndices() {
  const [indices, setIndices] = useState([
    { name: 'NIFTY 50', value: 22456.80, change: 187.30, changePercent: 0.84 },
    { name: 'SENSEX', value: 73892.45, change: 542.10, changePercent: 0.74 },
    { name: 'BANK NIFTY', value: 48234.60, change: -123.40, changePercent: -0.26 },
    { name: 'NIFTY IT', value: 34567.20, change: 234.50, changePercent: 0.68 },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setIndices(prev => prev.map(idx => {
        const fluctuation = (Math.random() - 0.5) * 50
        const newVal = +(idx.value + fluctuation).toFixed(2)
        const newCh = +(newVal - (idx.value - idx.change)).toFixed(2)
        const newPct = +((newCh / (idx.value - idx.change)) * 100).toFixed(2)
        return { ...idx, value: newVal, change: newCh, changePercent: newPct }
      }))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {indices.map(idx => (
        <div key={idx.name} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs text-gray-500 font-medium mb-1">{idx.name}</p>
          <p className="text-xl font-bold text-[#0f172a] font-mono">{idx.value.toLocaleString('en-IN')}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-sm font-semibold ${idx.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {idx.change >= 0 ? '▲' : '▼'} {Math.abs(idx.change).toFixed(2)}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${idx.change >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {idx.change >= 0 ? '+' : ''}{idx.changePercent}%
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Crypto Prices ─── */
function CryptoPrices() {
  const [crypto, setCrypto] = useState<CryptoItem[]>([
    { name: 'Bitcoin', symbol: 'BTC', price: 5842300, change24h: 2.34, marketCap: '₹115.2L Cr' },
    { name: 'Ethereum', symbol: 'ETH', price: 312450, change24h: -1.23, marketCap: '₹37.6L Cr' },
    { name: 'Solana', symbol: 'SOL', price: 12890, change24h: 5.67, marketCap: '₹5.8L Cr' },
    { name: 'Cardano', symbol: 'ADA', price: 42.30, change24h: -0.89, marketCap: '₹1.5L Cr' },
    { name: 'Polygon', symbol: 'MATIC', price: 68.45, change24h: 3.21, marketCap: '₹64,200 Cr' },
    { name: 'Ripple', symbol: 'XRP', price: 48.90, change24h: 1.45, marketCap: '₹2.6L Cr' },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setCrypto(prev => prev.map(c => {
        const pct = (Math.random() - 0.5) * 0.5
        return { ...c, price: +(c.price * (1 + pct / 100)).toFixed(2), change24h: +(c.change24h + (Math.random() - 0.5) * 0.3).toFixed(2) }
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {crypto.map(c => (
        <div key={c.symbol} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#2c5282] flex items-center justify-center text-white font-bold text-xs">
                {c.symbol.slice(0, 2)}
              </div>
              <div>
                <h4 className="font-semibold text-[#0f172a] text-sm">{c.name}</h4>
                <p className="text-xs text-gray-400">{c.symbol}</p>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${c.change24h >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {c.change24h >= 0 ? '+' : ''}{c.change24h}%
            </span>
          </div>
          <p className="text-lg font-bold text-[#0f172a] font-mono">₹{c.price.toLocaleString('en-IN')}</p>
          <p className="text-xs text-gray-400 mt-1">Mkt Cap: {c.marketCap}</p>
        </div>
      ))}
    </div>
  )
}

/* ─── Business News ─── */
function BusinessNews() {
  const [news, setNews] = useState<NewsItem[]>([
    { title: 'RBI keeps repo rate unchanged at 6.5% for 7th consecutive time', source: 'Economic Times', time: '2h ago', url: '#', category: 'Policy' },
    { title: 'India GDP growth projected at 7.2% for FY25 by IMF', source: 'LiveMint', time: '3h ago', url: '#', category: 'Economy' },
    { title: 'Nifty 50 hits new all-time high, crosses 22,500 mark', source: 'MoneyControl', time: '4h ago', url: '#', category: 'Markets' },
    { title: 'SEBI introduces new framework for startup IPOs', source: 'Business Standard', time: '5h ago', url: '#', category: 'Regulation' },
    { title: 'India\'s forex reserves rise to $642 billion', source: 'Reuters', time: '6h ago', url: '#', category: 'Economy' },
    { title: 'Digital lending grows 32% YoY, crosses ₹4 lakh crore', source: 'Inc42', time: '7h ago', url: '#', category: 'Fintech' },
    { title: 'Infrastructure spending to get ₹11.11 lakh crore boost in FY25', source: 'Financial Express', time: '8h ago', url: '#', category: 'Infrastructure' },
    { title: 'Gold prices surge past ₹73,000 per 10 grams amid global uncertainty', source: 'CNBC TV18', time: '9h ago', url: '#', category: 'Commodities' },
  ])

  const [visibleNews, setVisibleNews] = useState(4)
  const loadMore = () => setVisibleNews(prev => Math.min(prev + 4, news.length))

  return (
    <div className="space-y-4">
      {news.slice(0, visibleNews).map((item, i) => (
        <a key={i} href={item.url} className="block bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-[#1e3a5f]/20 transition-all group">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f]">{item.category}</span>
                <span className="text-xs text-gray-400">{item.source} · {item.time}</span>
              </div>
              <h4 className="text-sm font-medium text-[#0f172a] group-hover:text-[#1e3a5f] transition-colors leading-snug">{item.title}</h4>
            </div>
            <svg className="w-4 h-4 text-gray-300 group-hover:text-[#1e3a5f] transition-colors flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
        </a>
      ))}
      {visibleNews < news.length && (
        <button onClick={loadMore} className="w-full py-3 text-sm font-medium text-[#1e3a5f] bg-[#1e3a5f]/5 rounded-xl hover:bg-[#1e3a5f]/10 transition-colors">
          Load More News →
        </button>
      )}
    </div>
  )
}

/* ─── Investment Hacks ─── */
function InvestmentHacks() {
  const hacks: HackTip[] = [
    { id: 1, title: 'SIP — Start Small, Grow Big', description: 'Invest as little as ₹500/month in mutual funds via SIP. Over 10 years at 12% CAGR, ₹500/month becomes ₹1.16 lakh. Use the power of compounding — your money earns returns, and those returns earn returns.', category: 'Mutual Funds', icon: '📈', difficulty: 'Beginner' },
    { id: 2, title: 'Emergency Fund First', description: 'Before investing, build an emergency fund covering 6 months of expenses. Keep it in a liquid fund or high-yield savings account (7%+ interest). This prevents you from breaking investments during emergencies.', category: 'Planning', icon: '🛡️', difficulty: 'Beginner' },
    { id: 3, title: 'Tax Harvesting with ELSS', description: 'Invest ₹1.5 lakh/year in ELSS funds to save up to ₹46,800 in tax (30% bracket). ELSS has the shortest lock-in (3 years) among 80C options and historically delivers 12-15% returns.', category: 'Tax Saving', icon: '💰', difficulty: 'Beginner' },
    { id: 4, title: 'Index Fund — The Lazy Wealth Builder', description: 'Instead of picking individual stocks, invest in Nifty 50 index funds. They mirror the top 50 companies, have low expense ratios (0.1-0.2%), and historically beat 80% of actively managed funds over 10+ years.', category: 'Equity', icon: '🎯', difficulty: 'Beginner' },
    { id: 5, title: 'Asset Allocation by Age', description: 'A simple rule: (100 - your age) % in equity, rest in debt. At 30, keep 70% equity, 30% debt. At 50, shift to 50-50. This balances growth potential with risk management as you age.', category: 'Strategy', icon: '⚖️', difficulty: 'Intermediate' },
    { id: 6, title: 'PPF — The Risk-Free 15-Year Wealth Lock', description: 'Public Provident Fund gives 7.1% tax-free interest with EEE status (Exempt-Exempt-Exempt). Invest ₹1.5 lakh/year for 15 years → ₹40.6 lakh maturity. Extend in 5-year blocks for decades of guaranteed returns.', category: 'Fixed Income', icon: '🏦', difficulty: 'Beginner' },
    { id: 7, title: 'Rebalance Portfolio Quarterly', description: 'Every 3 months, check if your asset allocation has drifted. If equity went from 70% to 80% due to market gains, sell some equity and buy debt. This forces you to "buy low, sell high" automatically.', category: 'Strategy', icon: '🔄', difficulty: 'Intermediate' },
    { id: 8, title: 'NPS Tier I — Extra ₹50K Tax Saving', description: 'Beyond 80C\'s ₹1.5L, invest ₹50,000 more in NPS Tier I for additional tax deduction under 80CCD(1B). At 60, 60% is tax-free. Choose auto-allocation for age-based rebalancing.', category: 'Tax Saving', icon: '📋', difficulty: 'Intermediate' },
    { id: 9, title: 'Gold Bonds Over Physical Gold', description: 'Sovereign Gold Bonds (SGBs) give 2.5% annual interest + gold price appreciation. No making charges, no storage risk, no purity issues. 8-year tenure with exit option after 5 years. Tax-free on maturity.', category: 'Gold', icon: '🥇', difficulty: 'Intermediate' },
    { id: 10, title: 'Start a Side Business with ₹10,000', description: 'Use the "lean startup" approach: start a service business (consulting, tutoring, digital marketing) with minimal investment. Reinvest 50% of profits. A ₹10K/month side income invested at 12% for 20 years = ₹12.4 lakh.', category: 'Business', icon: '🚀', difficulty: 'Advanced' },
    { id: 11, title: 'FD Laddering for Liquidity + Returns', description: 'Instead of one ₹5L FD, split into 5 FDs of ₹1L each with 1, 2, 3, 4, 5 year tenures. Every year one matures — reinvest at the highest rate. You get liquidity every year AND better average returns.', category: 'Fixed Income', icon: '🪜', difficulty: 'Beginner' },
    { id: 12, title: 'Track Every Rupee — The 50/30/20 Rule', description: '50% of income → Needs (rent, food, bills). 30% → Wants (entertainment, dining). 20% → Savings & Investments. Use apps like Walnut or Money Manager to track. Most people who build wealth start here.', category: 'Planning', icon: '📊', difficulty: 'Beginner' },
  ]

  const [filter, setFilter] = useState('All')
  const categories = ['All', 'Mutual Funds', 'Tax Saving', 'Equity', 'Strategy', 'Fixed Income', 'Gold', 'Business', 'Planning']
  const filtered = filter === 'All' ? hacks : hacks.filter(h => h.category === filter)

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filter === cat ? 'bg-[#1e3a5f] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map(hack => (
          <div key={hack.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">{hack.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-[#0f172a] text-sm">{hack.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#d4a843]/10 text-[#d4a843] font-medium">{hack.category}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${hack.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-600' : hack.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
                    {hack.difficulty}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{hack.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Currency Exchange ─── */
function CurrencyExchange() {
  const [rates, setRates] = useState([
    { from: 'USD', to: 'INR', rate: 83.45, flag: '🇺🇸' },
    { from: 'EUR', to: 'INR', rate: 90.12, flag: '🇪🇺' },
    { from: 'GBP', to: 'INR', rate: 105.67, flag: '🇬🇧' },
    { from: 'AED', to: 'INR', rate: 22.71, flag: '🇦🇪' },
    { from: 'SGD', to: 'INR', rate: 61.89, flag: '🇸🇬' },
    { from: 'JPY', to: 'INR', rate: 0.54, flag: '🇯🇵' },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setRates(prev => prev.map(r => ({ ...r, rate: +(r.rate + (Math.random() - 0.5) * 0.1).toFixed(2) })))
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {rates.map(r => (
        <div key={r.from} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
          <span className="text-2xl">{r.flag}</span>
          <p className="text-xs text-gray-500 mt-1">{r.from}/INR</p>
          <p className="text-lg font-bold text-[#0f172a] font-mono">₹{r.rate}</p>
        </div>
      ))}
    </div>
  )
}

/* ─── Commodity Prices ─── */
function CommodityPrices() {
  const [commodities, setCommodities] = useState([
    { name: 'Gold (10g)', price: 73450, change: 320, unit: '₹/10g', icon: '🥇' },
    { name: 'Silver (1kg)', price: 82340, change: -450, unit: '₹/kg', icon: '🥈' },
    { name: 'Crude Oil', price: 6780, change: 85, unit: '₹/barrel', icon: '🛢️' },
    { name: 'Natural Gas', price: 185, change: -3.2, unit: '₹/MMBtu', icon: '🔥' },
    { name: 'Wheat (100kg)', price: 2650, change: 12, unit: '₹/100kg', icon: '🌾' },
    { name: 'Cotton (1 bale)', price: 56200, change: -340, unit: '₹/bale', icon: '🧵' },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setCommodities(prev => prev.map(c => ({ ...c, price: +(c.price + (Math.random() - 0.5) * c.price * 0.002).toFixed(0) })))
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {commodities.map(c => (
        <div key={c.name} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{c.icon}</span>
            <p className="text-xs text-gray-500 font-medium">{c.name}</p>
          </div>
          <p className="text-lg font-bold text-[#0f172a] font-mono">{c.price.toLocaleString('en-IN')}</p>
          <p className="text-xs text-gray-400">{c.unit}</p>
          <span className={`text-xs font-medium ${c.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {c.change >= 0 ? '+' : ''}{c.change}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ─── Main Finance Page ─── */
export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<'market' | 'crypto' | 'calculators' | 'hacks' | 'news'>('market')

  const tabs = [
    { id: 'market' as const, label: '📊 Live Markets', count: null },
    { id: 'crypto' as const, label: '₿ Crypto', count: null },
    { id: 'calculators' as const, label: '🧮 Calculators', count: '8 Tools' },
    { id: 'hacks' as const, label: '💡 Investment Hacks', count: '12 Tips' },
    { id: 'news' as const, label: '📰 Business News', count: null },
  ]

  return (<>
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <PageEnhancements />
      <SectionTip topic="finance" />

      {/* Hero Banner */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-[15%] w-40 h-40 bg-[#d4a843] rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-[10%] w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[#d4a843] text-xs font-medium mb-3">
                🔴 LIVE DATA
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Finance & Investment Hub
              </h1>
              <p className="text-white/60 text-sm">Live market data, crypto prices, business news & investment hacks — updated in real-time</p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <LiveClock />
            </div>
          </div>
        </div>
      </section>

      {/* Live Stock Ticker */}
      <div className="bg-white border-b border-gray-100 py-3 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StockTicker />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Market Indices */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-[#0f172a] mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center text-sm">📈</span>
            Indian Market Indices
          </h2>
          <MarketIndices />
        </div>

        {/* Currency & Commodities */}
        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          <div>
            <h2 className="text-lg font-bold text-[#0f172a] mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center text-sm">💱</span>
              Currency Exchange (Live)
            </h2>
            <CurrencyExchange />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0f172a] mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center text-sm">🏪</span>
              Commodity Prices (Live)
            </h2>
            <CommodityPrices />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 p-1.5 bg-gray-100 rounded-2xl">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white text-[#1e3a5f] shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab.label}
              {tab.count && <span className="ml-1 text-xs text-[#d4a843]">({tab.count})</span>}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'market' && (
          <div>
            <h2 className="text-lg font-bold text-[#0f172a] mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center text-sm">🏛️</span>
              Top NSE Stocks (Live Simulation)
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Symbol</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Company</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Price (₹)</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Change</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">% Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2456.30, change: 32.15, pct: 1.33 },
                      { symbol: 'TCS', name: 'Tata Consultancy', price: 3891.50, change: -45.20, pct: -1.15 },
                      { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1678.90, change: 18.40, pct: 1.11 },
                      { symbol: 'INFY', name: 'Infosys Ltd', price: 1523.75, change: 12.60, pct: 0.83 },
                      { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1124.30, change: -8.90, pct: -0.79 },
                      { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: 2345.60, change: 15.80, pct: 0.68 },
                      { symbol: 'SBIN', name: 'State Bank of India', price: 612.45, change: 9.30, pct: 1.54 },
                      { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1287.50, change: -12.40, pct: -0.95 },
                      { symbol: 'ITC', name: 'ITC Limited', price: 432.15, change: 5.60, pct: 1.31 },
                      { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', price: 1789.20, change: 22.10, pct: 1.25 },
                    ].map(s => (
                      <tr key={s.symbol} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 font-bold text-sm text-[#1e3a5f]">{s.symbol}</td>
                        <td className="px-6 py-3 text-sm text-gray-600">{s.name}</td>
                        <td className="px-6 py-3 text-right font-mono text-sm font-semibold text-[#0f172a]">₹{s.price.toLocaleString('en-IN')}</td>
                        <td className={`px-6 py-3 text-right font-mono text-sm font-medium ${s.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {s.change >= 0 ? '+' : ''}{s.change}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${s.pct >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            {s.pct >= 0 ? '+' : ''}{s.pct}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'crypto' && (
          <div>
            <h2 className="text-lg font-bold text-[#0f172a] mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center text-sm">₿</span>
              Cryptocurrency Prices (Live)
            </h2>
            <CryptoPrices />
          </div>
        )}

        {activeTab === 'calculators' && (
          <div>
            <h2 className="text-lg font-bold text-[#0f172a] mb-2 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center text-sm">🧮</span>
              Financial Calculators
            </h2>
            <p className="text-sm text-gray-500 mb-6">Plan your investments and loans with our comprehensive calculator suite</p>
            <FinanceCalculators />
          </div>
        )}

        {activeTab === 'hacks' && (
          <div>
            <h2 className="text-lg font-bold text-[#0f172a] mb-2 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center text-sm">💡</span>
              Investment Hacks & Tips
            </h2>
            <p className="text-sm text-gray-500 mb-6">Actionable strategies to grow your wealth — from beginner to advanced</p>
            <InvestmentHacks />
          </div>
        )}

        {activeTab === 'news' && (
          <div>
            <h2 className="text-lg font-bold text-[#0f172a] mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center text-sm">📰</span>
              Latest Business News
            </h2>
            <BusinessNews />
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-amber-800 text-sm mb-1">Disclaimer</h4>
              <p className="text-xs text-amber-700 leading-relaxed">
                The financial data displayed on this page is for <strong>educational and informational purposes only</strong>. Stock prices, crypto rates, and market indices are simulated/approximate and may not reflect real-time market data. 
                Always consult a SEBI-registered financial advisor before making investment decisions. Past performance does not guarantee future results. 
                Infinite Gundawar Business Private Limited is not a registered investment advisor.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
    <GoalModeFeatures page="finance" />
  </>
  )
}

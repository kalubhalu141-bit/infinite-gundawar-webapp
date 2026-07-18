'use client'
import GoalModeFeatures from '@/components/GoalModeFeatures'
import { useState, useRef, useCallback } from 'react'
import Navbar from '@/components/Navbar'
import PageEnhancements from '@/components/PageEnhancements'
import Footer from '@/components/Footer'
import PageHead from '@/components/PageHead'


const COUNTRIES = [
  'India','United States','United Kingdom','UAE','Canada','Australia','Germany',
  'Singapore','Saudi Arabia','Japan','South Korea','China','France','Italy',
  'Spain','Netherlands','Brazil','Mexico','Thailand','Philippines','Indonesia',
  'Malaysia','Pakistan','Bangladesh','Sri Lanka','Nepal','Egypt','Nigeria',
  'Kenya','South Africa','Ghana','Turkey','Israel','Russia','Poland','Sweden',
  'Norway','Denmark','Finland','Switzerland','Belgium','Austria','Portugal',
  'Greece','Czech Republic','Romania','Hungary','Colombia','Argentina',
  'Chile','Peru','Morocco','Tanzania','Ethiopia','New Zealand','Ireland',
  'Vietnam','Cambodia','Myanmar','Ukraine','Croatia','Serbia','Bulgaria',
  'Slovakia','Slovenia','Lithuania','Latvia','Estonia','Iceland','Luxembourg',
  'Jamaica','Trinidad','Fiji','Mauritius','Seychelles','Madagascar',
]

const CITIES: Record<string, string[]> = {
  India: ['Mumbai','Delhi','Bangalore','Hyderabad','Chennai','Kolkata','Pune','Ahmedabad','Jaipur','Lucknow','Chandigarh','Indore','Bhopal','Nagpur','Kochi','Coimbatore','Visakhapatnam','Surat','Vadodara','Rajkot','Nashik','Patna','Ranchi','Raipur','Guwahati','Bhubaneswar','Dehradun','Shimla','Gangtok','Panaji','Puducherry','Varanasi','Agra','Amritsar','Jodhpur','Udaipur','Goa','Mysore','Mangalore','Gwalior','Jabalpur','Guntur','Nellore','Tirupati','Warangal','Nizamabad','Kurnool','Kakinada','Eluru','Anantapur','Ongole','Srikakulam','Vijayawada','Amaravati'],
  'United States': ['New York','Los Angeles','Chicago','Houston','Phoenix','Philadelphia','San Antonio','San Diego','Dallas','San Jose','Austin','Jacksonville','Fort Worth','Columbus','Charlotte','San Francisco','Indianapolis','Seattle','Denver','Washington DC','Boston','Nashville','Detroit','Portland','Las Vegas','Memphis','Baltimore','Milwaukee','Atlanta','Miami','Minneapolis','Tampa','New Orleans'],
  'United Kingdom': ['London','Manchester','Birmingham','Leeds','Glasgow','Liverpool','Edinburgh','Bristol','Cardiff','Belfast','Sheffield','Nottingham','Newcastle','Leicester','Brighton','Oxford','Cambridge'],
  UAE: ['Dubai','Abu Dhabi','Sharjah','Ajman','Ras Al Khaimah','Fujairah'],
  Canada: ['Toronto','Vancouver','Montreal','Calgary','Edmonton','Ottawa','Winnipeg','Hamilton','Victoria','Halifax'],
  Australia: ['Sydney','Melbourne','Brisbane','Perth','Adelaide','Gold Coast','Canberra','Hobart','Darwin'],
  Germany: ['Berlin','Munich','Hamburg','Frankfurt','Cologne','Stuttgart','Dusseldorf','Leipzig'],
  Singapore: ['Singapore'],
  Brazil: ['Sao Paulo','Rio de Janeiro','Brasilia','Salvador','Fortaleza','Belo Horizonte'],
  Mexico: ['Mexico City','Guadalajara','Monterrey','Puebla','Cancun','Tijuana'],
  'Saudi Arabia': ['Riyadh','Jeddah','Mecca','Medina','Dammam'],
  France: ['Paris','Marseille','Lyon','Toulouse','Nice','Nantes'],
  Italy: ['Rome','Milan','Naples','Turin','Palermo','Genoa'],
  Spain: ['Madrid','Barcelona','Valencia','Seville','Bilbao'],
  Japan: ['Tokyo','Osaka','Kyoto','Yokohama','Nagoya','Sapporo'],
  'South Korea': ['Seoul','Busan','Incheon','Daegu'],
  Nigeria: ['Lagos','Abuja','Kano','Ibadan','Port Harcourt'],
  'South Africa': ['Johannesburg','Cape Town','Durban','Pretoria'],
  Thailand: ['Bangkok','Chiang Mai','Phuket','Pattaya'],
  Philippines: ['Manila','Cebu','Davao','Quezon City'],
  Indonesia: ['Jakarta','Surabaya','Bandung','Medan'],
  Malaysia: ['Kuala Lumpur','George Town','Johor Bahru'],
  Turkey: ['Istanbul','Ankara','Izmir','Bursa'],
  Israel: ['Tel Aviv','Jerusalem','Haifa'],
  Egypt: ['Cairo','Alexandria','Giza'],
  Kenya: ['Nairobi','Mombasa'],
  Argentina: ['Buenos Aires','Cordoba','Rosario'],
  Peru: ['Lima','Arequipa'],
  Colombia: ['Bogota','Medellin','Cali'],
}

const BUSINESS_CATEGORIES = [
  { id: 'real-estate', label: 'Real Estate Agents' },
  { id: 'doctors', label: 'Doctors & Clinics' },
  { id: 'dentists', label: 'Dentists' },
  { id: 'lawyers', label: 'Lawyers & Law Firms' },
  { id: 'accountants', label: 'Accountants & CA' },
  { id: 'restaurants', label: 'Restaurants' },
  { id: 'hotels', label: 'Hotels & Resorts' },
  { id: 'schools', label: 'Schools & Colleges' },
  { id: 'coaching', label: 'Coaching Institutes' },
  { id: 'gyms', label: 'Gyms & Fitness' },
  { id: 'salons', label: 'Salons & Beauty' },
  { id: 'pharmacies', label: 'Pharmacies' },
  { id: 'hospitals', label: 'Hospitals' },
  { id: 'automobile', label: 'Automobile Dealers' },
  { id: 'electronics', label: 'Electronics Stores' },
  { id: 'jewelry', label: 'Jewelry Stores' },
  { id: 'petroleum', label: 'Petrol Pumps' },
  { id: 'banks', label: 'Banks & ATMs' },
  { id: 'insurance', label: 'Insurance Agents' },
  { id: 'travel', label: 'Travel Agencies' },
  { id: 'construction', label: 'Construction Companies' },
  { id: 'architects', label: 'Architects' },
  { id: 'interior', label: 'Interior Designers' },
  { id: 'event', label: 'Event Managers' },
  { id: 'catering', label: 'Catering Services' },
  { id: 'printing', label: 'Printing & Xerox' },
  { id: 'hardware', label: 'Hardware Stores' },
  { id: 'furniture', label: 'Furniture Stores' },
  { id: 'clothing', label: 'Clothing & Textiles' },
  { id: 'footwear', label: 'Footwear Stores' },
  { id: 'sports', label: 'Sports Equipment' },
  { id: 'books', label: 'Book Stores' },
  { id: 'music', label: 'Music & Instruments' },
  { id: 'photo', label: 'Photography Studios' },
  { id: 'video', label: 'Video Production' },
  { id: 'it-services', label: 'IT Services' },
  { id: 'web-design', label: 'Web Design & SEO' },
  { id: 'logistics', label: 'Logistics & Transport' },
  { id: 'warehouse', label: 'Warehouses' },
  { id: 'import-export', label: 'Import/Export' },
  { id: 'ayurveda', label: 'Ayurveda Centers' },
  { id: 'yoga', label: 'Yoga Studios' },
  { id: 'panchakarma', label: 'Panchakarma Centers' },
  { id: 'dairy', label: 'Dairy Farms' },
  { id: 'agriculture', label: 'Agricultural' },
  { id: 'farming', label: 'Farming Equipment' },
  { id: 'poultry', label: 'Poultry Farms' },
  { id: 'fisheries', label: 'Fisheries' },
  { id: 'florist', label: 'Florists' },
  { id: 'bakery', label: 'Bakeries' },
  { id: 'sweet-shop', label: 'Sweet Shops' },
  { id: 'grocery', label: 'Grocery Stores' },
  { id: 'super-market', label: 'Super Markets' },
  { id: 'mall', label: 'Shopping Malls' },
]

const TABS = [
  { id: 'business', label: 'Business Leads' },
  { id: 'property', label: 'Property for Sale' },
  { id: 'custom', label: 'Custom Search' },
]

interface Lead {
  id: string
  name: string
  phone: string
  email: string
  website: string
  address: string
  city: string
  country: string
  category: string
  source: string
  snippet: string
  scrapedDate: string
  [key: string]: any
}

interface PropertyLead {
  id: string
  title: string
  description: string
  price: string
  phones: string
  emails: string
  website: string
  city: string
  district: string
  state: string
  country: string
  source: string
  sourceUrl: string
  scrapedDate: string
}

export default function LeadDashboardPage() {
  const [activeTab, setActiveTab] = useState('business')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [customLocation, setCustomLocation] = useState('')

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [businessLeads, setBusinessLeads] = useState<Lead[]>([])
  const [businessSearching, setBusinessSearching] = useState(false)
  const [businessProgress, setBusinessProgress] = useState({ percent: 0, found: 0, currentQuery: '', queriesDone: 0, queriesTotal: 0 })
  const [businessError, setBusinessError] = useState('')
  const [businessSearched, setBusinessSearched] = useState(false)

  const [propertyLeads, setPropertyLeads] = useState<PropertyLead[]>([])
  const [propertySearching, setPropertySearching] = useState(false)
  const [propertyProgress, setPropertyProgress] = useState({ percent: 0, found: 0, queriesDone: 0, queriesTotal: 0 })
  const [propertyError, setPropertyError] = useState('')
  const [propertySearched, setPropertySearched] = useState(false)
  const [useDistrict, setUseDistrict] = useState(false)
  const [districtInput, setDistrictInput] = useState('')
  const [stateInput, setStateInput] = useState('')

  const [customQuery, setCustomQuery] = useState('')
  const [customLeads, setCustomLeads] = useState<Lead[]>([])
  const [customSearching, setCustomSearching] = useState(false)
  const [customProgress, setCustomProgress] = useState({ percent: 0, found: 0, queriesDone: 0, queriesTotal: 0 })
  const [customError, setCustomError] = useState('')
  const [customSearched, setCustomSearched] = useState(false)

  const abortRef = useRef<AbortController | null>(null)

  const availableCities = country ? (CITIES[country] || []) : []

  const handleCountryChange = (c: string) => {
    setCountry(c)
    setCity('')
  }

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
  }

  const searchBusinessLeads = useCallback(async () => {
    if (selectedCategories.length === 0) { setBusinessError('Select at least one category'); return }
    setBusinessSearching(true)
    setBusinessError('')
    setBusinessLeads([])
    setBusinessSearched(true)
    setBusinessProgress({ percent: 0, found: 0, currentQuery: '', queriesDone: 0, queriesTotal: 0 })
    const controller = new AbortController()
    abortRef.current = controller
    try {
      const res = await fetch('/api/lead-dashboard/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: selectedCategories, country: country || undefined, city: city || undefined, customLocation: customLocation || undefined }),
        signal: controller.signal,
      })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || `HTTP ${res.status}`) }
      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response stream')
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
            if (data.type === 'progress') {
              setBusinessProgress({ percent: data.percent || 0, found: data.found || 0, currentQuery: data.currentQuery || '', queriesDone: data.queriesDone || 0, queriesTotal: data.queriesTotal || 0 })
              if (data.results) { setBusinessLeads(prev => { const ex = new Set(prev.map(l => l.id)); return [...prev, ...data.results.filter((r: Lead) => !ex.has(r.id))] }) }
            } else if (data.type === 'complete') {
              setBusinessProgress(p => ({ ...p, percent: 100, found: data.total || 0 }))
              if (data.allResults) setBusinessLeads(data.allResults)
            } else if (data.type === 'error') { throw new Error(data.message) }
          } catch { /* skip */ }
        }
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') setBusinessError(err?.message || 'Search failed')
    } finally { setBusinessSearching(false); abortRef.current = null }
  }, [selectedCategories, country, city, customLocation])

  const searchPropertyLeads = useCallback(async () => {
    setPropertySearching(true)
    setPropertyError('')
    setPropertyLeads([])
    setPropertySearched(true)
    setPropertyProgress({ percent: 0, found: 0, queriesDone: 0, queriesTotal: 0 })
    const controller = new AbortController()
    abortRef.current = controller
    try {
      const res = await fetch('/api/lead-dashboard/property', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: country || undefined, city: city || undefined, district: useDistrict ? districtInput : undefined, state: useDistrict ? stateInput : undefined, customLocation: customLocation || undefined }),
        signal: controller.signal,
      })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || `HTTP ${res.status}`) }
      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response stream')
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
            if (data.type === 'progress') {
              setPropertyProgress({ percent: data.percent || 0, found: data.found || 0, queriesDone: data.queriesDone || 0, queriesTotal: data.queriesTotal || 0 })
              if (data.results) { setPropertyLeads(prev => { const ex = new Set(prev.map(l => l.id)); return [...prev, ...data.results.filter((r: PropertyLead) => !ex.has(r.id))] }) }
            } else if (data.type === 'complete') {
              setPropertyProgress(p => ({ ...p, percent: 100, found: data.total || 0 }))
              if (data.allResults) setPropertyLeads(data.allResults)
            }
          } catch { /* skip */ }
        }
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') setPropertyError(err?.message || 'Search failed')
    } finally { setPropertySearching(false); abortRef.current = null }
  }, [country, city, customLocation, useDistrict, districtInput, stateInput])

  const searchCustom = useCallback(async () => {
    if (!customQuery.trim()) { setCustomError('Enter a search query'); return }
    setCustomSearching(true)
    setCustomError('')
    setCustomLeads([])
    setCustomSearched(true)
    setCustomProgress({ percent: 0, found: 0, queriesDone: 0, queriesTotal: 0 })
    const controller = new AbortController()
    abortRef.current = controller
    try {
      const res = await fetch('/api/lead-dashboard/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: customQuery, country: country || undefined, city: city || undefined, customLocation: customLocation || undefined }),
        signal: controller.signal,
      })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || `HTTP ${res.status}`) }
      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response stream')
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
            if (data.type === 'progress') {
              setCustomProgress({ percent: data.percent || 0, found: data.found || 0, queriesDone: data.queriesDone || 0, queriesTotal: data.queriesTotal || 0 })
              if (data.results) { setCustomLeads(prev => { const ex = new Set(prev.map(l => l.id)); return [...prev, ...data.results.filter((r: Lead) => !ex.has(r.id))] }) }
            } else if (data.type === 'complete') {
              setCustomProgress(p => ({ ...p, percent: 100, found: data.total || 0 }))
              if (data.allResults) setCustomLeads(data.allResults)
            }
          } catch { /* skip */ }
        }
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') setCustomError(err?.message || 'Search failed')
    } finally { setCustomSearching(false); abortRef.current = null }
  }, [customQuery, country, city, customLocation])

  const handleStop = () => {
    abortRef.current?.abort()
    setBusinessSearching(false)
    setPropertySearching(false)
    setCustomSearching(false)
  }

  const exportCSV = (leads: any[], filename: string) => {
    if (!leads.length) return
    const keys = Object.keys(leads[0])
    const escape = (v: any) => `"${String(v || '').replace(/"/g, '""')}"`
    const rows = leads.map(l => keys.map(k => escape(l[k])).join(','))
    const csv = [keys.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `${filename}-${Date.now()}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const exportJSON = (leads: any[], filename: string) => {
    if (!leads.length) return
    const blob = new Blob([JSON.stringify(leads, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `${filename}-${Date.now()}.json`; a.click()
    URL.revokeObjectURL(url)
  }

  const isSearching = businessSearching || propertySearching || customSearching

  const currentProgress = activeTab === 'business' ? businessProgress : activeTab === 'property' ? propertyProgress : customProgress

  return (<>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <PageEnhancements />

        {/* Cinematic Video Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        </div>


        {/* Cartoon Video Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        </div>

      <PageHead
        title="Lead Dashboard - Business Leads, Property Leads & Custom Search"
        description="Comprehensive lead generation dashboard with business leads, property leads, and custom search. Generate 100,000+ qualified leads from any country, city, or location. Real-time lead scraping, export to CSV/JSON, and multi-category business lead generation."
        keywords={['lead generation dashboard', 'lead management software', 'business leads India', 'property leads', 'CRM leads', 'lead generation tool', 'sales pipeline management', 'lead scoring', 'business analytics dashboard', 'customer acquisition', 'B2B lead generation', 'real estate leads India', 'custom lead search', 'lead export CSV', 'qualified leads', 'lead generation software', 'sales prospecting', 'lead capture', 'lead tracking', 'multi-country leads', 'business contact database', 'lead generation automation', 'sales leads India', 'marketing leads', 'lead nurturing']}
        ogImage="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop"
        canonical="https://infinite-gundawar-webapp.vercel.app/lead-dashboard"
      />

      {/* Cinematic Hero Image */}
      <div className="relative w-full h-[300px] md:h-[420px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&h=600&fit=crop" alt="Business Analytics Dashboard" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      <section className="relative pt-24 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f] to-[#2c5282]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#d4a843] rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#2c5282] rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-6">
            <span className="inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-full text-[#d4a843] text-sm font-medium mb-2">
              Global Lead Generation Dashboard
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Lead Scraper Dashboard</h1>
            <p className="text-white/60 text-sm">Generate 100,000+ business & property leads from any country, city, or location</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-white text-[#1e3a5f] shadow-lg' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-5 border border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <select value={country} onChange={e => handleCountryChange(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#d4a843] outline-none text-gray-800 bg-white">
                <option value="">All Countries</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={city} onChange={e => setCity(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#d4a843] outline-none text-gray-800 bg-white">
                <option value="">All Cities</option>
                {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="text" value={customLocation} onChange={e => setCustomLocation(e.target.value)}
                placeholder="Or type any location..."
                className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#d4a843] outline-none text-gray-800 bg-white" />
              {isSearching ? (
                <button onClick={handleStop}
                  className="px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all flex items-center justify-center gap-2">
                  Stop All
                </button>
              ) : (
                <button onClick={activeTab === 'business' ? searchBusinessLeads : activeTab === 'property' ? searchPropertyLeads : searchCustom}
                  className="px-6 py-3 bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  Generate Leads
                </button>
              )}
            </div>

            {activeTab === 'business' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-700">Select Business Categories ({selectedCategories.length} selected)</h3>
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedCategories(BUSINESS_CATEGORIES.map(c => c.id))}
                      className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">Select All</button>
                    <button onClick={() => setSelectedCategories([])}
                      className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">Clear</button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 bg-gray-50 rounded-xl">
                  {BUSINESS_CATEGORIES.map(cat => (
                    <button key={cat.id} onClick={() => toggleCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCategories.includes(cat.id) ? 'bg-[#1e3a5f] text-white shadow' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#d4a843]'}`}>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'property' && (
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input type="checkbox" checked={useDistrict} onChange={e => setUseDistrict(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300" />
                    Use State & District (India)
                  </label>
                </div>
                {useDistrict && (
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <input type="text" value={stateInput} onChange={e => setStateInput(e.target.value)}
                      placeholder="State (e.g., Maharashtra)" className="px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-[#d4a843] outline-none text-sm" />
                    <input type="text" value={districtInput} onChange={e => setDistrictInput(e.target.value)}
                      placeholder="District (e.g., Pune)" className="px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-[#d4a843] outline-none text-sm" />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'custom' && (
              <input type="text" value={customQuery} onChange={e => setCustomQuery(e.target.value)}
                placeholder="Enter anything: pet shops in Tokyo, wedding planners in Dubai, poultry farms in Brazil..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#d4a843] outline-none text-gray-800 bg-white" />
            )}

            {isSearching && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1 text-sm text-gray-600">
                  <span>Found {currentProgress.found} leads</span>
                  <span>{currentProgress.percent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#1e3a5f] to-[#d4a843] rounded-full transition-all duration-500"
                    style={{ width: `${currentProgress.percent}%` }} />
                </div>
                {businessProgress.currentQuery && (
                  <p className="text-xs text-gray-400 mt-1 truncate">{businessProgress.currentQuery}</p>
                )}
              </div>
            )}

            {businessError && <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{businessError}</div>}
            {propertyError && <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{propertyError}</div>}
            {customError && <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{customError}</div>}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {activeTab === 'business' && businessSearched && (
          <>
            {businessLeads.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#1e3a5f]">Business Leads ({businessLeads.length.toLocaleString()})</h2>
                  <div className="flex gap-2">
                    <button onClick={() => exportCSV(businessLeads, 'business-leads')} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200">CSV</button>
                    <button onClick={() => exportJSON(businessLeads, 'business-leads')} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200">JSON</button>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] text-white">
                          <th className="px-4 py-3 text-left font-semibold">#</th>
                          <th className="px-4 py-3 text-left font-semibold">Business Name</th>
                          <th className="px-4 py-3 text-left font-semibold">Category</th>
                          <th className="px-4 py-3 text-left font-semibold">Phone</th>
                          <th className="px-4 py-3 text-left font-semibold">Email</th>
                          <th className="px-4 py-3 text-left font-semibold">Website</th>
                          <th className="px-4 py-3 text-left font-semibold">City</th>
                          <th className="px-4 py-3 text-left font-semibold">Country</th>
                          <th className="px-4 py-3 text-left font-semibold">Source</th>
                        </tr>
                      </thead>
                      <tbody>
                        {businessLeads.slice(0, 500).map((lead, i) => (
                          <tr key={lead.id} className={`border-b border-gray-50 hover:bg-blue-50/50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                            <td className="px-4 py-2.5 text-gray-400 text-xs">{i + 1}</td>
                            <td className="px-4 py-2.5 font-medium text-[#1e3a5f] max-w-[200px] truncate">{lead.name}</td>
                            <td className="px-4 py-2.5"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">{lead.category}</span></td>
                            <td className="px-4 py-2.5 text-green-700 font-mono text-xs">{lead.phone || '-'}</td>
                            <td className="px-4 py-2.5 text-blue-600 text-xs max-w-[180px] truncate">{lead.email || '-'}</td>
                            <td className="px-4 py-2.5 text-blue-500 text-xs max-w-[180px] truncate">{lead.website ? <a href={lead.website} target="_blank" rel="noopener noreferrer" className="hover:underline">{lead.website}</a> : '-'}</td>
                            <td className="px-4 py-2.5 text-gray-600">{lead.city || '-'}</td>
                            <td className="px-4 py-2.5 text-gray-600">{lead.country || '-'}</td>
                            <td className="px-4 py-2.5 text-gray-400 text-xs">{lead.source}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {businessLeads.length > 500 && (
                    <div className="p-4 text-center text-sm text-gray-500 bg-gray-50 border-t">
                      Showing first 500 of {businessLeads.length.toLocaleString()} leads. Export to see all.
                    </div>
                  )}
                </div>
              </>
            )}
            {!businessSearching && businessLeads.length === 0 && businessSearched && (
              <div className="text-center py-16"><div className="text-6xl mb-4">?</div><h3 className="text-xl font-bold text-[#1e3a5f] mb-2">No Business Leads Found</h3><p className="text-gray-500">Try different categories or broaden your location.</p></div>
            )}
            {!businessSearched && (
              <div className="text-center py-16"><div className="text-6xl mb-4">?</div><h3 className="text-xl font-bold text-[#1e3a5f] mb-2">Select Categories & Generate Leads</h3><p className="text-gray-500 max-w-lg mx-auto">Choose one or more business categories above, set your target location, and click Generate Leads.</p></div>
            )}
          </>
        )}

        {activeTab === 'property' && propertySearched && (
          <>
            {propertyLeads.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#1e3a5f]">Property Leads ({propertyLeads.length.toLocaleString()})</h2>
                  <div className="flex gap-2">
                    <button onClick={() => exportCSV(propertyLeads, 'property-leads')} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200">CSV</button>
                    <button onClick={() => exportJSON(propertyLeads, 'property-leads')} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200">JSON</button>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {propertyLeads.map(r => (
                    <div key={r.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="p-4">
                        <h3 className="font-semibold text-[#1e3a5f] text-sm line-clamp-2 mb-1">{r.title}</h3>
                        {r.price && <p className="text-lg font-bold text-emerald-600 mb-1">{r.price}</p>}
                        {r.description && <p className="text-xs text-gray-500 mb-2 line-clamp-2">{r.description}</p>}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {[r.city, r.district, r.state, r.country].filter(Boolean).map((loc, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{loc}</span>
                          ))}
                        </div>
                        {r.phones && <p className="text-xs text-gray-600 mb-1">{r.phones}</p>}
                        {r.emails && <p className="text-xs text-gray-600 mb-1 truncate">{r.emails}</p>}
                        {r.website && <p className="text-xs text-blue-500 mb-2 truncate">{r.website}</p>}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <span className="text-xs text-gray-400">{r.source}</span>
                          <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer"
                            className="text-xs px-3 py-1.5 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2c5282]">View</a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {!propertySearching && propertyLeads.length === 0 && propertySearched && (
              <div className="text-center py-16"><div className="text-6xl mb-4">?</div><h3 className="text-xl font-bold text-[#1e3a5f] mb-2">No Properties Found</h3><p className="text-gray-500">Try a different location or broaden your search.</p></div>
            )}
            {!propertySearched && (
              <div className="text-center py-16"><div className="text-6xl mb-4">?</div><h3 className="text-xl font-bold text-[#1e3a5f] mb-2">Search Properties for Sale</h3><p className="text-gray-500 max-w-lg mx-auto">Select a country, city, or type any location to find properties, land, and real estate leads.</p></div>
            )}
          </>
        )}

        {activeTab === 'custom' && customSearched && (
          <>
            {customLeads.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#1e3a5f]">Custom Results ({customLeads.length.toLocaleString()})</h2>
                  <div className="flex gap-2">
                    <button onClick={() => exportCSV(customLeads, 'custom-leads')} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200">CSV</button>
                    <button onClick={() => exportJSON(customLeads, 'custom-leads')} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200">JSON</button>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] text-white">
                          <th className="px-4 py-3 text-left font-semibold">#</th>
                          <th className="px-4 py-3 text-left font-semibold">Name</th>
                          <th className="px-4 py-3 text-left font-semibold">Phone</th>
                          <th className="px-4 py-3 text-left font-semibold">Email</th>
                          <th className="px-4 py-3 text-left font-semibold">Website</th>
                          <th className="px-4 py-3 text-left font-semibold">Location</th>
                          <th className="px-4 py-3 text-left font-semibold">Snippet</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customLeads.slice(0, 500).map((lead, i) => (
                          <tr key={lead.id} className={`border-b border-gray-50 hover:bg-blue-50/50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                            <td className="px-4 py-2.5 text-gray-400 text-xs">{i + 1}</td>
                            <td className="px-4 py-2.5 font-medium text-[#1e3a5f] max-w-[200px] truncate">{lead.name}</td>
                            <td className="px-4 py-2.5 text-green-700 font-mono text-xs">{lead.phone || '-'}</td>
                            <td className="px-4 py-2.5 text-blue-600 text-xs max-w-[180px] truncate">{lead.email || '-'}</td>
                            <td className="px-4 py-2.5 text-blue-500 text-xs max-w-[180px] truncate">{lead.website ? <a href={lead.website} target="_blank" rel="noopener noreferrer" className="hover:underline">{lead.website}</a> : '-'}</td>
                            <td className="px-4 py-2.5 text-gray-600 text-xs">{[lead.city, lead.country].filter(Boolean).join(', ') || '-'}</td>
                            <td className="px-4 py-2.5 text-gray-500 text-xs max-w-[300px] truncate">{lead.snippet || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {customLeads.length > 500 && (
                    <div className="p-4 text-center text-sm text-gray-500 bg-gray-50 border-t">
                      Showing first 500 of {customLeads.length.toLocaleString()} results. Export to see all.
                    </div>
                  )}
                </div>
              </>
            )}
            {!customSearching && customLeads.length === 0 && customSearched && (
              <div className="text-center py-16"><div className="text-6xl mb-4">?</div><h3 className="text-xl font-bold text-[#1e3a5f] mb-2">No Results Found</h3><p className="text-gray-500">Try a different search query.</p></div>
            )}
            {!customSearched && (
              <div className="text-center py-16"><div className="text-6xl mb-4">?</div><h3 className="text-xl font-bold text-[#1e3a5f] mb-2">Custom Lead Search</h3><p className="text-gray-500 max-w-lg mx-auto">Type anything and generate targeted leads from any location worldwide.</p></div>
            )}
          </>
        )}

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
            <div className="text-3xl font-bold text-[#1e3a5f]">{businessLeads.length.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">Business Leads</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
            <div className="text-3xl font-bold text-emerald-600">{propertyLeads.length.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">Property Leads</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
            <div className="text-3xl font-bold text-purple-600">{customLeads.length.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">Custom Results</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
            <div className="text-3xl font-bold text-[#d4a843]">{(businessLeads.length + propertyLeads.length + customLeads.length).toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">Total Leads</div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    <GoalModeFeatures page="lead-dashboard" />
  </>
  )
}
'use client'

import { useState, useRef, useCallback } from 'react'

interface DoctorRecord {
  name: string
  phones: { phone: string; type: string; confidence: number }[]
  emails: string[]
  address: string
  website: string
  snippet: string
  specialty: string
  scrapedDate: string
}

const SPECIALTIES = [
  { id: 'general', name: 'General Ayurveda', icon: '🌿' },
  { id: 'panchakarma', name: 'Panchakarma', icon: '💆' },
  { id: 'skin', name: 'Skin / Dermatology', icon: '🧴' },
  { id: 'ortho', name: 'Ortho / Bone', icon: '🦴' },
  { id: 'neuro', name: 'Neuro / Brain', icon: '🧠' },
  { id: 'digestive', name: 'Digestive', icon: '🫄' },
  { id: 'women', name: 'Women\'s Health', icon: '👩' },
  { id: 'child', name: 'Child Care', icon: '👶' },
  { id: 'mental', name: 'Mental Health', icon: '🧘' },
  { id: 'diabetes', name: 'Diabetes', icon: '💉' },
  { id: 'heart', name: 'Heart / Cardio', icon: '❤️' },
  { id: 'kidney', name: 'Kidney', icon: '🫘' },
  { id: 'liver', name: 'Liver', icon: '🫁' },
  { id: 'arthritis', name: 'Arthritis', icon: '🦵' },
  { id: 'asthma', name: 'Asthma / Respiratory', icon: '🌬️' },
  { id: 'cancer', name: 'Cancer Support', icon: '🎗️' },
]

const INDIAN_CITIES = ['', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Chandigarh', 'Guwahati', 'Solapur', 'Hubli', 'Mysore', 'Tiruchirappalli', 'Bareilly', 'Aligarh', 'Tiruppur', 'Moradabad', 'Jalandhar', 'Bhubaneswar', 'Salem', 'Warangal', 'Guntur', 'Bhiwandi', 'Saharanpur', 'Gorakhpur', 'Bikaner', 'Amravati', 'Noida', 'Jamshedpur', 'Bhilai', 'Cuttack', 'Firozabad', 'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol', 'Rourkela', 'Nanded', 'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar', 'Ujjain', 'Loni', 'Siliguri', 'Jhansi', 'Ulhasnagar', 'Jammu', 'Sangli', 'Mangalore', 'Erode', 'Belgaum', 'Ambattur', 'Tirunelveli', 'Malegaon', 'Gaya', 'Jalgaon', 'Udaipur', 'Maheshtula', 'Davanagere', 'Kozhikode', 'Kurnool']

const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'UAE', 'Singapore', 'Malaysia', 'South Africa', 'Kenya', 'Nepal', 'Sri Lanka', 'Bangladesh', 'Mauritius', 'Fiji', 'Trinidad', 'Guyana', 'Suriname', 'South Korea', 'Japan', 'Thailand', 'Indonesia', 'Philippines', 'Brazil', 'Argentina', 'Mexico']

export default function AyurvedaDoctorScraper({}: {}) {
  const [specialty, setSpecialty] = useState('general')
  const [location, setLocation] = useState('')
  const [country, setCountry] = useState('India')
  const [targetCount, setTargetCount] = useState(10000)
  const [doctors, setDoctors] = useState<DoctorRecord[]>([])
  const [isScraping, setIsScraping] = useState(false)
  const [progress, setProgress] = useState({ percent: 0, doctorsFound: 0, queriesProcessed: 0, totalQueries: 0 })
  const [stats, setStats] = useState<any>(null)
  const [error, setError] = useState('')
  const [searchFilter, setSearchFilter] = useState('')
  const abortRef = useRef<AbortController | null>(null)

  const handleScrape = useCallback(async () => {
    setIsScraping(true)
    setError('')
    setDoctors([])
    setStats(null)
    setProgress({ percent: 0, doctorsFound: 0, queriesProcessed: 0, totalQueries: 0 })

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch('/api/ayurveda-doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ specialty, location: location || undefined, country, targetCount }),
        signal: controller.signal,
      })

      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed') }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response')
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
              setProgress({ percent: data.percentComplete, doctorsFound: data.doctorsFound, queriesProcessed: data.queriesProcessed, totalQueries: data.totalQueries })
              if (data.latestDoctors?.length) {
                setDoctors(prev => {
                  const existing = new Set(prev.map(d => d.website))
                  return [...prev, ...data.latestDoctors.filter((d: DoctorRecord) => !existing.has(d.website))]
                })
              }
            } else if (data.type === 'complete') {
              setStats(data.stats)
              setDoctors(data.doctors || [])
              setProgress(p => ({ ...p, percent: 100, doctorsFound: data.stats?.total || 0 }))
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
  }, [specialty, location, country, targetCount])

  const handleStop = () => { abortRef.current?.abort(); setIsScraping(false) }

  const exportCSV = () => {
    if (!doctors.length) return
    const headers = ['Name', 'Phone', 'Email', 'Address', 'Website', 'Specialty']
    const rows = doctors.map(d => [d.name, d.phones.map(p => p.phone).join('; '), d.emails.join('; '), d.address, d.website, d.specialty].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `ayurveda_doctors_${Date.now()}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const filteredDoctors = doctors.filter(d => {
    if (!searchFilter) return true
    const sf = searchFilter.toLowerCase()
    return d.name?.toLowerCase().includes(sf) || d.address?.toLowerCase().includes(sf) || d.phones.some(p => p.phone.includes(sf))
  })

  return (
    <section className="py-16 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-100 rounded-full px-4 py-2 mb-4">
            <span className="text-lg">🩺</span>
            <span className="text-emerald-700 text-sm font-bold">Ayurveda Doctor Finder</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-3">
            Find Ayurveda Doctors <span className="text-emerald-600">Worldwide</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Search and extract phone numbers, addresses, and contact details of Ayurveda doctors, clinics, and hospitals.
            Specialized in India + 25+ countries. 10,000+ doctors per scrape.
          </p>
        </div>

        {/* Scraper Panel */}
        <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-[#1e3a5f] mb-1.5">Specialty</label>
              <select value={specialty} onChange={e => setSpecialty(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-400 outline-none text-gray-800 bg-white">
                {SPECIALTIES.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1e3a5f] mb-1.5">City (India)</label>
              <select value={location} onChange={e => setLocation(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-400 outline-none text-gray-800 bg-white">
                {INDIAN_CITIES.map(c => <option key={c} value={c}>{c || 'Any City'}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1e3a5f] mb-1.5">Country</label>
              <select value={country} onChange={e => setCountry(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-400 outline-none text-gray-800 bg-white">
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1e3a5f] mb-1.5">Target Doctors</label>
              <select value={targetCount} onChange={e => setTargetCount(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-400 outline-none text-gray-800 bg-white">
                <option value={1000}>1,000 doctors</option>
                <option value={5000}>5,000 doctors</option>
                <option value={10000}>10,000 doctors</option>
                <option value={50000}>50,000 doctors</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            {!isScraping ? (
              <button onClick={handleScrape} className="flex-1 md:flex-none px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <span>🩺</span> Find {targetCount.toLocaleString()} Ayurveda Doctors
              </button>
            ) : (
              <button onClick={handleStop} className="flex-1 md:flex-none px-8 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" /></svg> Stop
              </button>
            )}
            {doctors.length > 0 && <button onClick={exportCSV} className="px-4 py-3 bg-green-100 text-green-700 font-medium rounded-xl hover:bg-green-200 text-sm">📥 Export CSV ({doctors.length})</button>}
          </div>
          {error && <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">⚠️ {error}</div>}
        </div>

        {/* Progress */}
        {isScraping && (
          <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-3">
              <div><h3 className="font-bold text-[#1e3a5f]">Searching Ayurveda Doctors...</h3><p className="text-xs text-gray-500">Query {progress.queriesProcessed}/{progress.totalQueries} • {progress.doctorsFound.toLocaleString()} doctors found</p></div>
              <div className="text-right"><div className="text-2xl font-bold text-emerald-600">{progress.percent}%</div></div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500" style={{ width: `${progress.percent}%` }} />
            </div>
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
            <div className="bg-white rounded-xl p-3 border border-emerald-100 text-center"><div className="text-xl font-bold text-[#1e3a5f]">{stats.total.toLocaleString()}</div><div className="text-xs text-gray-500">Total Doctors</div></div>
            <div className="bg-white rounded-xl p-3 border border-emerald-100 text-center"><div className="text-xl font-bold text-green-600">{stats.withPhone.toLocaleString()}</div><div className="text-xs text-gray-500">With Phone</div></div>
            <div className="bg-white rounded-xl p-3 border border-emerald-100 text-center"><div className="text-xl font-bold text-blue-600">{stats.withEmail.toLocaleString()}</div><div className="text-xs text-gray-500">With Email</div></div>
            <div className="bg-white rounded-xl p-3 border border-emerald-100 text-center"><div className="text-xl font-bold text-purple-600">{stats.withAddress.toLocaleString()}</div><div className="text-xs text-gray-500">With Address</div></div>
            <div className="bg-white rounded-xl p-3 border border-emerald-100 text-center"><div className="text-xl font-bold text-orange-600">{stats.indiaDoctors.toLocaleString()}</div><div className="text-xs text-gray-500">India</div></div>
            <div className="bg-white rounded-xl p-3 border border-emerald-100 text-center"><div className="text-xl font-bold text-teal-600">{stats.internationalDoctors.toLocaleString()}</div><div className="text-xs text-gray-500">International</div></div>
          </div>
        )}

        {/* Results */}
        {doctors.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <input type="text" value={searchFilter} onChange={e => setSearchFilter(e.target.value)} placeholder="🔍 Search doctors..." className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-emerald-400" />
              <span className="text-sm text-gray-400">{filteredDoctors.length} doctors</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDoctors.slice(0, 100).map((d, i) => (
                <div key={i} className="bg-white rounded-xl border border-emerald-100 p-5 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-[#1e3a5f] text-sm flex-1">{d.name}</h4>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-xs font-medium ml-2">{d.specialty}</span>
                  </div>
                  {d.phones.length > 0 && (
                    <div className="space-y-1 mb-2">
                      {d.phones.slice(0, 3).map((p, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <a href={`tel:${p.phone}`} className="text-sm text-green-600 hover:underline font-medium">📞 {p.phone}</a>
                          <span className="text-xs text-gray-300">{p.confidence}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {d.address && <p className="text-xs text-gray-500 mb-1">📍 {d.address}</p>}
                  {d.emails.length > 0 && <p className="text-xs text-blue-500 mb-1">📧 {d.emails[0]}</p>}
                  {d.website && <a href={d.website} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-500 hover:underline block truncate">🌐 {d.website}</a>}
                </div>
              ))}
            </div>
            {filteredDoctors.length > 100 && <div className="text-center text-sm text-gray-400 mt-4">Showing first 100 of {filteredDoctors.length}. Export to see all.</div>}
          </div>
        )}
      </div>
    </section>
  )
}

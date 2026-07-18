'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { DISEASES } from '@/lib/disease-database'
import { translateEnToHi, deviceType } from '@/lib/onDeviceAI'

interface Doctor {
  name: string
  phones: { phone: string; type: string; confidence: number }[]
  emails: string[]
  address: string
  city?: string
  state?: string
  district?: string
  country?: string
  website: string
  snippet: string
  specialty: string
  source: string
  scrapedDate: string
}

// Map common symptom words -> a specialty to pre-filter the directory (on-device AI routing).
const SYMPTOM_TO_SPECIALTY: [RegExp, string][] = [
  [/skin|acne|eczema|rash/, 'skin'],
  [/joint|arthritis|bone|knee|spine|back pain/, 'ortho'],
  [/anx|stress|depress|sleep|insomnia|mental/, 'mental'],
  [/sugar|diabet|thirst|urine/, 'diabetes'],
  [/stomach|digestion|acidity|constipat|ibs/, 'digestive'],
  [/pressure|bp|heart/, 'heart'],
  [/child|baby|pediatric|infant/, 'child'],
  [/pregnan|fertilit|women|gynec/, 'women'],
  [/cancer|tumor/, 'cancer'],
  [/asthma|breath|lung/, 'asthma'],
  [/liver|jaundic/, 'liver'],
  [/kidney/, 'kidney'],
  [/neuro|migraine|paralys|brain/, 'neuro'],
]

function routeSpecialty(text: string): string | null {
  const t = text.toLowerCase()
  for (const [re, spec] of SYMPTOM_TO_SPECIALTY) if (re.test(t)) return spec
  return null
}

const SPECIALTIES = ['general','panchakarma','skin','ortho','neuro','digestive','women','child','mental','diabetes','heart','kidney','liver','cancer','arthritis','asthma']

export default function DoctorsPage() {
  const [country, setCountry] = useState('India')
  const [state, setState] = useState('')
  const [district, setDistrict] = useState('')
  const [city, setCity] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [q, setQ] = useState('')
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [stats, setStats] = useState<any>(null)
  const [facets, setFacets] = useState<any>(null)
  const [totalIndexed, setTotalIndexed] = useState(0)
  const [loading, setLoading] = useState(false)
  const [scraping, setScraping] = useState(false)
  const [scrapeMsg, setScrapeMsg] = useState('')
  const [aiHint, setAiHint] = useState<string | null>(null)
  const [lang, setLang] = useState<'en' | 'hi'>('en')
  const device = deviceType()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (country) params.set('country', country)
      if (state) params.set('state', state)
      if (district) params.set('district', district)
      if (city) params.set('city', city)
      if (specialty) params.set('specialty', specialty)
      if (q) params.set('q', q)
      params.set('facets', '1')
      params.set('limit', '60')
      const res = await fetch(`/api/doctors?${params.toString()}`)
      const data = await res.json()
      setDoctors(data.doctors || [])
      setStats(data.stats)
      setFacets(data.facets)
      setTotalIndexed(data.stats?.total || 0)
    } catch { /* ignore */ }
    setLoading(false)
  }, [country, state, district, city, specialty, q])

  useEffect(() => { load() }, [load])

  // AI: route a symptom/query to a specialty (on-device, offline)
  const onSearch = async () => {
    setAiHint(null)
    let query = q
    if (lang === 'hi' && query.trim()) {
      try { query = await translateEnToHi(query) } catch { /* keep original */ }
    }
    const spec = routeSpecialty(query)
    if (spec && !specialty) { setSpecialty(spec); setAiHint(`🤖 AI routed your query to "${spec}" specialty.`) }
    else if (spec) setAiHint(`🤖 AI detected "${spec}" from your query.`)
    load()
  }

  const scrapeMore = async () => {
    setScraping(true); setScrapeMsg('Starting live search for real doctors…')
    try {
      const res = await fetch('/api/ayurveda-doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ specialty: specialty || 'general', location: city || state || 'India', country: country || 'India', targetCount: 500 }),
      })
      const reader = res.body?.getReader()
      const dec = new TextDecoder()
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const lines = dec.decode(value).split('\n').filter(Boolean)
          for (const line of lines) {
            try {
              const ev = JSON.parse(line)
              if (ev.type === 'progress') setScrapeMsg(`Found ${ev.doctorsFound}… (${ev.percentComplete}%)`)
              if (ev.type === 'complete') { setScrapeMsg(ev.message); setTotalIndexed(ev.indexedTotal || 0) }
            } catch { /* ignore */ }
          }
        }
      }
      await load()
    } catch (e) { setScrapeMsg('Search failed — check network / API key.') }
    setScraping(false)
  }

  const states = useMemo(() => (facets?.states || []), [facets])
  const cities = useMemo(() => (facets?.cities || []), [facets])

  return (
    <div className="min-h-screen bg-aurora-x">
      <Navbar />
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-[#d4a843] text-sm font-medium mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
            🩺 Doctors Directory · Real data, gathered live · Free on-device AI search
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 leading-tight">
            Find <span className="text-gradient text-glow">Doctors</span> Across India
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Search real Ayurvedic doctors by location and specialty. Data is gathered from live web search
            and accumulates in our index — <b className="text-white">{totalIndexed.toLocaleString()}</b> real doctors indexed so far.
          </p>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-3xl p-5 glow-gold mb-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Select label="Country" value={country} onChange={setCountry} options={['India', ...((facets?.countries || []).filter((c: string) => c !== 'India'))]} />
            <Select label="State" value={state} onChange={setState} options={['', ...states]} />
            <Select label="District" value={district} onChange={setDistrict} options={['', ...(facets?.states?.includes(state) ? [] : [])]} placeholder="(optional)" />
            <Select label="City" value={city} onChange={setCity} options={['', ...cities]} placeholder="(optional)" />
            <Select label="Specialty" value={specialty} onChange={setSpecialty} options={['', ...SPECIALTIES]} placeholder="All specialties" />
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-[#1e3a5f] mb-1">Search</label>
              <div className="flex gap-2">
                <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && onSearch()}
                  placeholder="symptoms, name, area…" className="flex-1 px-3 py-2 rounded-xl border border-gray-200 bg-white/80 outline-none focus:border-[#d4a843] text-sm text-[#0f172a]" />
                <button onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')} className="px-2 py-1 rounded-lg bg-[#1e3a5f]/10 text-xs font-semibold text-[#1e3a5f]">{lang === 'en' ? 'EN' : 'हि'}</button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button onClick={onSearch} className="btn-ai">🔍 Search</button>
            <button onClick={scrapeMore} disabled={scraping} className="btn-ghost-ai disabled:opacity-50">
              {scraping ? '⏳ Searching live…' : '➕ Find more real doctors'}
            </button>
            {aiHint && <span className="text-xs text-[#d4a843] font-medium">{aiHint}</span>}
          </div>
          {scrapeMsg && <p className="text-xs text-white/60 mt-2">{scrapeMsg}</p>}
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <Stat n={stats.indexed?.toLocaleString() ?? totalIndexed.toLocaleString()} l="Matching doctors" />
            <Stat n={(stats.withPhone ?? 0).toLocaleString()} l="With contact" />
            <Stat n={(states.length || 0).toLocaleString()} l="States covered" />
            <Stat n={(cities.length || 0).toLocaleString()} l="Cities covered" />
          </div>
        )}

        {/* Results */}
        {loading ? (
          <p className="text-center text-white/60 py-10">Loading…</p>
        ) : doctors.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center text-[#1e3a5f]">
            No doctors indexed yet for this filter. Click <b>“Find more real doctors”</b> to gather live data for
            {city || state || 'India'}.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {doctors.map((d, i) => (
              <article key={i} className="glass-card rounded-2xl p-5 glow-navy">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-[#0f172a] text-lg leading-tight">{d.name}</h3>
                    <p className="text-xs text-[#2c5282] font-medium mt-0.5">🌿 {d.specialty}</p>
                  </div>
                  {d.city && <span className="text-[10px] px-2 py-1 rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f] whitespace-nowrap">{d.city}{d.state ? `, ${d.state}` : ''}</span>}
                </div>
                {d.address && <p className="text-xs text-[#1e3a5f]/70 mt-2">📍 {d.address}</p>}
                {d.phones?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {d.phones.slice(0, 2).map((p, j) => (
                      <a key={j} href={`tel:${p.phone}`} className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 font-semibold">📞 {p.phone}</a>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-3 mt-3 text-xs">
                  {d.website && <a href={d.website} target="_blank" rel="noreferrer" className="text-[#d4a843] font-semibold hover:underline">🌐 Website</a>}
                  {d.emails?.[0] && <a href={`mailto:${d.emails[0]}`} className="text-[#2c5282] hover:underline">✉️ {d.emails[0]}</a>}
                </div>
                <p className="text-[10px] text-[#1e3a5f]/40 mt-2">source: {d.source} · {new Date(d.scrapedDate).toLocaleDateString()}</p>
              </article>
            ))}
          </div>
        )}

        <p className="text-center text-[11px] text-white/40 pt-8">
          Doctors are gathered from public web sources via live search. Always verify credentials with the
          practitioner and the relevant medical council before consulting. This directory is for discovery only.
        </p>
      </main>
      <Footer />
    </div>
  )
}

function Select({ label, value, onChange, options, placeholder }: { label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder?: string }) {
  return (
    <div className="flex flex-col">
      <label className="text-xs font-semibold text-[#1e3a5f] mb-1">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="px-3 py-2 rounded-xl border border-gray-200 bg-white/80 outline-none focus:border-[#d4a843] text-sm text-[#0f172a]">
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o} value={o}>{o || '—'}</option>)}
      </select>
    </div>
  )
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-2xl glass p-4 text-center">
      <div className="text-2xl font-extrabold text-[#d4a843] text-glow">{n}</div>
      <div className="text-[#1e3a5f]/70 text-xs mt-1">{l}</div>
    </div>
  )
}

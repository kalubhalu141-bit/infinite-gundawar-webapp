// ─────────────────────────────────────────────────────────────────────────────
//  doctor-index.ts — persistent, real doctor index for the Infinite Gundawar
//  Doctors Directory.
//
//  Doctors are gathered from LIVE Google search (Serper) via the
//  /api/ayurveda-doctors scraper and appended here so the dataset ACCUMULATES
//  across searches (real data only — never fabricated). The directory reads
//  from this index with full location + specialty + text filtering.
//
//  NOTE: this file is generated data. It is gitignored (see .gitignore).
//  Counts are always the ACTUAL number of real records gathered — we never
//  pad or invent doctors.
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'fs'
import path from 'path'

export interface Doctor {
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

const DATA_DIR = path.join(process.cwd(), 'data')
const INDEX_FILE = path.join(DATA_DIR, 'doctors-index.json')

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

export function loadDoctors(): Doctor[] {
  try {
    if (!fs.existsSync(INDEX_FILE)) return []
    const raw = fs.readFileSync(INDEX_FILE, 'utf8')
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

function keyOf(d: Doctor): string {
  return `${d.name.toLowerCase().trim()}|${d.website?.toLowerCase().trim() || d.phones[0]?.phone || ''}`
}

// Append new doctors, dedupe by name+website, merge phone numbers.
export function appendDoctors(incoming: Doctor[]): { added: number; total: number } {
  ensureDir()
  const existing = loadDoctors()
  const map = new Map<string, Doctor>()
  for (const d of existing) map.set(keyOf(d), d)

  let added = 0
  for (const d of incoming) {
    const k = keyOf(d)
    const cur = map.get(k)
    if (!cur) {
      map.set(k, normalize(d))
      added++
    } else {
      // merge phones
      const have = new Set(cur.phones.map(p => p.phone))
      for (const p of d.phones) if (!have.has(p.phone)) { cur.phones.push(p); have.add(p.phone) }
      if (!cur.address && d.address) cur.address = d.address
      if (cur.emails.length === 0 && d.emails.length) cur.emails = d.emails
    }
  }

  const all = Array.from(map.values())
  fs.writeFileSync(INDEX_FILE, JSON.stringify(all, null, 0))
  return { added, total: all.length }
}

// Best-effort location parse from address / snippet text.
function normalize(d: Doctor): Doctor {
  const text = `${d.address || ''} ${d.snippet || ''}`.toLowerCase()
  const states = ['maharashtra','delhi','karnataka','tamil nadu','telangana','gujarat','rajasthan','uttar pradesh','west bengal','kerala','punjab','haryana','madhya pradesh','bihar','odisha','jharkhand','chhattisgarh','assam','goa','uttarakhand','himachal pradesh','jammu']
  const foundState = states.find(s => text.includes(s))
  const cityMatch = text.match(/\b(pune|mumbai|delhi|bangalore|bengaluru|hyderabad|chennai|kolkata|ahmedabad|jaipur|lucknow|kanpur|nagpur|nashik|aurangabad|indore|bhopal|patna|ranchi|raipur|gurgaon|gurugram|noida|ghaziabad|surat|vadodara|coimbatore|kochi|thiruvananthapuram|visakhapatnam|vijayawada|madurai|meerut|agra|varanasi|thane|navi mumbai|gwalior|jabalpur|amritsar|ludhiana|chandigarh|rajkot|mysore|mysuru|trivandrum)\b/g)
  return {
    ...d,
    country: d.country || (text.includes('india') || foundState ? 'India' : undefined),
    state: d.state || (foundState ? foundState.charAt(0).toUpperCase() + foundState.slice(1) : undefined),
    city: d.city || (cityMatch ? cityMatch[0].charAt(0).toUpperCase() + cityMatch[0].slice(1) : undefined),
  }
}

export interface DoctorQuery {
  country?: string
  state?: string
  district?: string
  city?: string
  specialty?: string
  q?: string
  limit?: number
  offset?: number
}

export function searchDoctors(q: DoctorQuery): { doctors: Doctor[]; total: number; stats: any } {
  let all = loadDoctors()
  const total = all.length

  if (q.country) all = all.filter(d => (d.country || '').toLowerCase().includes(q.country!.toLowerCase()))
  if (q.state) all = all.filter(d => (d.state || '').toLowerCase().includes(q.state!.toLowerCase()))
  if (q.district) all = all.filter(d => (d.district || '').toLowerCase().includes(q.district!.toLowerCase()))
  if (q.city) all = all.filter(d => (d.city || '').toLowerCase().includes(q.city!.toLowerCase()))
  if (q.specialty) all = all.filter(d => (d.specialty || '').toLowerCase().includes(q.specialty!.toLowerCase()))
  if (q.q) {
    const t = q.q.toLowerCase()
    all = all.filter(d =>
      (d.name || '').toLowerCase().includes(t) ||
      (d.address || '').toLowerCase().includes(t) ||
      (d.snippet || '').toLowerCase().includes(t) ||
      (d.specialty || '').toLowerCase().includes(t) ||
      (d.city || '').toLowerCase().includes(t) ||
      (d.state || '').toLowerCase().includes(t)
    )
  }

  // Sort: most phones / most complete first
  all = all.sort((a, b) => (b.phones?.length || 0) - (a.phones?.length || 0))

  const offset = q.offset || 0
  const limit = q.limit || 50
  const page = all.slice(offset, offset + limit)

  const stats = {
    total,
    indexed: all.length,
    withPhone: all.filter(d => (d.phones?.length || 0) > 0).length,
    byCountry: countBy(all, d => d.country),
    byState: countBy(all, d => d.state),
    byCity: countBy(all, d => d.city),
    bySpecialty: countBy(all, d => d.specialty),
  }

  return { doctors: page, total: all.length, stats }
}

function countBy(arr: Doctor[], fn: (d: Doctor) => string | undefined): Record<string, number> {
  const m: Record<string, number> = {}
  for (const d of arr) {
    const k = fn(d)
    if (k) m[k] = (m[k] || 0) + 1
  }
  return m
}

export function getFacets(): { states: string[]; cities: string[]; specialties: string[]; countries: string[] } {
  const all = loadDoctors()
  return {
    countries: uniq(all.map(d => d.country).filter(Boolean) as string[]),
    states: uniq(all.map(d => d.state).filter(Boolean) as string[]),
    cities: uniq(all.map(d => d.city).filter(Boolean) as string[]),
    specialties: uniq(all.map(d => d.specialty).filter(Boolean) as string[]),
  }
}

function uniq(arr: string[]): string[] {
  return Array.from(new Set(arr)).sort()
}

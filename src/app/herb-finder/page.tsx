'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { HERBS, CATEGORIES } from '@/lib/herbs-real'

export interface Herb {
  id: string
  name: string
  sanskrit: string
  botanical: string
  family: string
  partsUsed: string[]
  emoji: string
  image: string
  benefits: string[]
  uses: string[]
  dosage: string
  precautions: string
  dosha: string
  category: string
}

// ── Free on-device AI herb recommender ──────────────────────────────────────
// Pure offline TF-IDF-ish scoring: matches a symptom/condition query to herbs
// by benefits + uses. No network, no API keys.
function recommendHerbs(query: string, top = 6): { herb: Herb; score: number }[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  const qt = q.split(/[^a-z]+/).filter(w => w.length > 2)
  const scored = HERBS.map(h => {
    const hay = `${h.name} ${h.sanskrit} ${h.benefits.join(' ')} ${h.uses.join(' ')} ${h.category}`.toLowerCase()
    let score = 0
    for (const w of qt) if (hay.includes(w)) score += 2
    // softer: any word overlap in benefits/uses
    for (const b of h.benefits) if (b.toLowerCase().includes(q)) score += 1
    for (const u of h.uses) if (u.toLowerCase().includes(q)) score += 1
    return { herb: h, score }
  }).filter(s => s.score > 0)
  return scored.sort((a, b) => b.score - a.score).slice(0, top)
}

export default function HerbFinderPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedHerb, setSelectedHerb] = useState<Herb | null>(null)
  const [aiMode, setAiMode] = useState(false)

  const aiResults = useMemo(() => (aiMode ? recommendHerbs(search) : []), [aiMode, search])

  const baseFiltered = useMemo(() => {
    if (search.trim()) {
      const t = search.toLowerCase()
      return HERBS.filter(h =>
        h.name.toLowerCase().includes(t) ||
        h.sanskrit.toLowerCase().includes(t) ||
        h.botanical.toLowerCase().includes(t) ||
        h.benefits.some(b => b.toLowerCase().includes(t)) ||
        h.uses.some(u => u.toLowerCase().includes(t)),
      )
    }
    if (selectedCategory) return HERBS.filter(h => h.category === selectedCategory)
    return HERBS
  }, [search, selectedCategory])

  const displayList = aiMode && search.trim() ? aiResults.map(r => r.herb) : baseFiltered

  return (<>
    <div className="min-h-screen bg-aurora-x">
      <Navbar />
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        {/* Hero */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-[#d4a843] text-sm font-medium mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
            🌿 Herb Intelligence · {HERBS.length} real herbs · Free on-device AI recommender
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 leading-tight">
            Ayurvedic <span className="text-gradient text-glow">Herb Finder</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Explore <b className="text-white">{HERBS.length}</b> verified Ayurvedic herbs with botanical names,
            benefits, and dosha effects. Or describe a symptom and let the on-device AI recommend matching herbs — no API keys, fully private.
          </p>
        </div>

        {/* Search bar */}
        <div className="glass-card rounded-3xl p-5 glow-gold mb-6">
          <div className="relative max-w-2xl mx-auto">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search herbs by name, Sanskrit, condition — or describe a symptom…"
              className="w-full px-6 py-4 pl-14 rounded-2xl border-2 border-gray-200 text-lg focus:outline-none focus:ring-4 focus:ring-[#d4a843]/30 focus:border-[#d4a843] shadow-lg bg-white"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
          </div>
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={() => setAiMode(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!aiMode ? 'bg-[#1e3a5f] text-white' : 'bg-white/80 text-[#1e3a5f] border border-gray-200'}`}
            >📚 Browse</button>
            <button
              onClick={() => setAiMode(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${aiMode ? 'bg-[#d4a843] text-[#1e3a5f]' : 'bg-white/80 text-[#1e3a5f] border border-gray-200'}`}
            >🤖 AI Recommend</button>
            {search && aiMode && (
              <span className="text-xs text-[#d4a843]">{aiResults.length} herb match(es)</span>
            )}
          </div>
        </div>

        {/* Categories */}
        {!search && !aiMode && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${!selectedCategory ? 'bg-[#1e3a5f] text-white' : 'bg-white/80 text-[#1e3a5f] border border-gray-200'}`}>
              All ({HERBS.length})
            </button>
            {CATEGORIES.map(cat => {
              const count = HERBS.filter(h => h.category === cat.id).length
              if (!count) return null
              return (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${selectedCategory === cat.id ? 'bg-[#1e3a5f] text-white' : 'bg-white/80 text-[#1e3a5f] border border-gray-200'}`}>
                  {cat.emoji} {cat.name} ({count})
                </button>
              )
            })}
          </div>
        )}

        {aiMode && search.trim() && aiResults.length === 0 && (
          <div className="text-center text-white/60 py-8">No herbs matched that symptom yet — try a simpler term (e.g. "sleep", "digestion", "skin").</div>
        )}

        {/* Herb grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayList.map(herb => (
            <button key={herb.id} onClick={() => setSelectedHerb(herb)}
              className="text-left bg-white/95 rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100 hover:border-[#d4a843] group">
              <div className="relative h-40 overflow-hidden bg-emerald-50">
                <img src={herb.image} alt={herb.name} loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/400x300/16a34a/ffffff?text=${encodeURIComponent(herb.name)}` }} />
                <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full text-xs font-bold text-[#1e3a5f]">{herb.emoji} {herb.category}</div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[#0f172a] text-lg leading-tight">{herb.name}</h3>
                <p className="text-xs text-gray-500 italic mb-2">{herb.botanical}</p>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{herb.benefits.slice(0, 3).join(' • ')}</p>
                <span className="text-xs px-2 py-1 bg-[#1e3a5f]/10 text-[#1e3a5f] rounded-full">Dosha: {herb.dosha.split('.').slice(0, 1).join('')}</span>
              </div>
            </button>
          ))}
        </div>

        {displayList.length === 0 && (
          <div className="text-center py-16 text-white/60">
            <span className="text-6xl block mb-4">🌿</span>
            <p>No herbs found. Try another search or category.</p>
          </div>
        )}

        <div className="mt-12 p-6 glass-card max-w-3xl mx-auto text-center">
          <p className="text-sm text-[#1e3a5f]">
            ⚠️ <strong>Disclaimer:</strong> Herb information is for educational purposes only. Consult a qualified
            Ayurvedic practitioner before starting any herbal treatment.
          </p>
        </div>
      </main>

      {selectedHerb && <HerbDetailModal herb={selectedHerb} onClose={() => setSelectedHerb(null)} />}
      <Footer />
    </div>
  </>)
}

function HerbDetailModal({ herb, onClose }: { herb: Herb; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="relative h-56 bg-emerald-50">
          <img src={herb.image} alt={herb.name} className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/800x400/16a34a/ffffff?text=${encodeURIComponent(herb.name)}` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-xl shadow-lg">×</button>
          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="text-3xl font-extrabold text-white">{herb.emoji} {herb.name}</h2>
            <p className="text-white/80 italic">{herb.sanskrit} — {herb.botanical}</p>
            <p className="text-white/60 text-sm">Family: {herb.family} · Parts: {herb.partsUsed.join(', ')}</p>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div className="bg-[#f0f7ff] rounded-xl p-4 border border-[#cfe0f5]">
            <p className="text-sm font-bold text-[#1e3a5f]">⚖️ Dosha Effect</p>
            <p className="text-sm text-[#2c5282] mt-1">{herb.dosha}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-[#1e3a5f] mb-2">✅ Benefits</p>
            <div className="flex flex-wrap gap-2">{herb.benefits.map((b, i) => <span key={i} className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">{b}</span>)}</div>
          </div>
          <div>
            <p className="text-sm font-bold text-[#1e3a5f] mb-2">🏥 Used For</p>
            <div className="flex flex-wrap gap-2">{herb.uses.map((u, i) => <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{u}</span>)}</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <p className="text-sm font-bold text-amber-800">💊 Dosage</p>
            <p className="text-sm text-amber-700 mt-1">{herb.dosage}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <p className="text-sm font-bold text-red-800">⚠️ Precautions</p>
            <p className="text-sm text-red-700 mt-1">{herb.precautions}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

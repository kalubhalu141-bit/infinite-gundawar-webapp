'use client'
import GoalModeFeatures from '@/components/GoalModeFeatures'
import PageEnhancements from '@/components/PageEnhancements'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import HERBS_DEFAULT, { CATEGORIES } from '@/lib/herbs'
const HERBS = HERBS_DEFAULT

export default function HerbFinderPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedHerb, setSelectedHerb] = useState<typeof HERBS[0] | null>(null)
  const [liveResults, setLiveResults] = useState<typeof HERBS[0][]>([])
  const [liveTotal, setLiveTotal] = useState(0)
  const [searching, setSearching] = useState(false)

  // Normalize a simple 100k-dataset herb into the page's rich Herb shape.
  const norm = (h: any): typeof HERBS[0] => ({
    ...HERBS[0],
    id: h.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || Math.random().toString(36).slice(2),
    name: h.name,
    sanskrit: h.sanskrit || '',
    botanical: h.family || '',
    family: h.family || '',
    partsUsed: (h.partsUsed || '').split(',').map((s: string) => s.trim()).filter(Boolean),
    emoji: '🌿',
    category: (h.dosha || '').split(' ')[0].replace(/[^a-zA-Z]/g, '') || 'herb',
    classicalUses: (h.benefits as string[]) || [],
    image: h.image,
    dosage: h.dosage || '',
    precautions: h.precautions || '',
    dosha: h.dosha || '',
  })

  // Live search across the 100,000-herb database (debounced).
  useEffect(() => {
    const term = search.trim()
    if (!term) { setLiveResults([]); setLiveTotal(0); return }
    setSearching(true)
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/herbs?q=${encodeURIComponent(term)}&limit=60`)
        const d = await r.json()
        if (d.ok) {
          setLiveResults((d.results || []).map(norm))
          setLiveTotal(d.total || 0)
        }
      } catch { /* offline fallback: curated set only */ }
      setSearching(false)
    }, 250)
    return () => clearTimeout(t)
  }, [search])

  const baseFiltered = search.trim()
    ? [...HERBS.filter(h =>
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.sanskrit.toLowerCase().includes(search.toLowerCase()) ||
        h.botanical.toLowerCase().includes(search.toLowerCase()) ||
        (h.classicalUses || []).some(c => c.toLowerCase().includes(search.toLowerCase()))), ...liveResults]
    : selectedCategory
      ? HERBS.filter(h => h.category === selectedCategory)
      : HERBS
  // de-dupe by name
  const seen = new Set<string>()
  const filtered = baseFiltered.filter(h => { if (seen.has(h.name)) return false; seen.add(h.name); return true })

  return (<>
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50">
      <PageEnhancements />

        {/* Cinematic Video Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        </div>


      {/* Cartoon Video Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      </div>

      {/* Hero */}
      <div className="relative bg-gradient-to-r from-green-800 to-emerald-700 text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="max-w-7xl mx-auto px-4 py-16 relative">
          <Link href="/health" className="inline-block text-green-200 hover:text-white text-sm mb-4">← Back to Health Hub</Link>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">🌿 Ayurvedic Herb Finder</h1>
          <p className="text-green-200 text-lg max-w-2xl">Complete encyclopedia of <strong>100,000+</strong> Ayurvedic herbs &amp; treatments — the largest free database on the web. Search by name, Sanskrit, condition, or benefit below.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setSelectedCategory(null); }}
            placeholder="Search herbs by name, Sanskrit, botanical, or condition..."
            className="w-full px-6 py-4 pl-14 rounded-2xl border-2 border-green-300 text-lg focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 shadow-lg bg-white"
          />
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
          {search && (
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm text-green-600 font-medium">
              {filtered.length} shown{searching ? '…' : ''}{liveTotal > 0 ? ` · ${liveTotal.toLocaleString()} in 100k DB` : ''}
            </span>
          )}
        </div>

        {/* Categories */}
        {!search && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                !selectedCategory ? 'bg-green-700 text-white shadow-lg' : 'bg-white text-green-800 border border-green-300 hover:bg-green-50'
              }`}
            >
              All Herbs ({HERBS.length})
            </button>
            {CATEGORIES.map(cat => {
              const count = HERBS.filter(h => h.category === cat.id).length
              if (count === 0) return null
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    selectedCategory === cat.id ? 'bg-green-700 text-white shadow-lg' : 'bg-white text-green-800 border border-green-300 hover:bg-green-50'
                  }`}
                >
                  {cat.emoji} {cat.name} ({count})
                </button>
              )
            })}
          </div>
        )}

        {/* Herb Detail Modal */}
        {selectedHerb && <HerbDetailModal herb={selectedHerb} onClose={() => setSelectedHerb(null)} />}

        {/* Herb Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(herb => (
            <button
              key={herb.id}
              onClick={() => setSelectedHerb(herb)}
              className="text-left bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-green-100 hover:border-green-300 group cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={herb.image}
                  alt={herb.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/400x300/16a34a/ffffff?text=${encodeURIComponent(herb.name)}` }}
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-green-800">
                  {herb.emoji} {herb.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-green-800 text-lg leading-tight">{herb.name}</h3>
                <p className="text-xs text-gray-500 italic mb-2">{herb.botanical}</p>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{herb.classicalUses.slice(0, 3).join(' • ')}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Dosha: {herb.dosha.split('.')[0]}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">🌿</span>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No herbs found</h3>
            <p className="text-gray-500">Try a different search term or category.</p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-amber-50 rounded-2xl border border-amber-200 max-w-3xl mx-auto">
          <p className="text-sm text-amber-800 text-center">
            ⚠️ <strong>Disclaimer:</strong> This herb information is for educational purposes only. Always consult a qualified Ayurvedic practitioner before starting any herbal treatment. Some herbs may interact with medications.
          </p>
        </div>
      </div>
    </div>
    <GoalModeFeatures page="herb-finder" />
  </>
  )
}

// Herb detail modal
function HerbDetailModal({ herb, onClose }: { herb: typeof HERBS[0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Image header */}
        <div className="relative h-64">
          <img src={herb.image} alt={herb.name}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/800x400/16a34a/ffffff?text=${encodeURIComponent(herb.name)}` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-xl hover:bg-white cursor-pointer shadow-lg">×</button>
          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="text-3xl font-extrabold text-white">{herb.emoji} {herb.name}</h2>
            <p className="text-white/80 italic">{herb.sanskrit} — {herb.botanical}</p>
            <p className="text-white/60 text-sm">Family: {herb.family} | Parts: {herb.partsUsed.join(', ')}</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Dosha */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <p className="text-sm font-bold text-green-800">⚖️ Dosha Effect</p>
            <p className="text-sm text-green-700 mt-1">{herb.dosha}</p>
          </div>

          {/* Benefits */}
          <div>
            <p className="text-sm font-bold text-green-800 mb-2">✅ Key Benefits</p>
            <div className="flex flex-wrap gap-2">
              {herb.classicalUses.map((b, i) => (
                <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">{b}</span>
              ))}
            </div>
          </div>

          {/* Used For */}
          <div>
            <p className="text-sm font-bold text-green-800 mb-2">🏥 Classical Uses</p>
            <div className="flex flex-wrap gap-2">
              {herb.classicalUses.map((u, i) => (
                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{u}</span>
              ))}
            </div>
          </div>

          {/* Formulations */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <p className="text-sm font-bold text-amber-800">📋 Classical Formulations</p>
            <p className="text-sm text-amber-700 mt-1">{herb.formulations.slice(0, 5).join(', ')}</p>
          </div>

          {/* Precautions */}
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <p className="text-sm font-bold text-red-800">⚠️ Precautions</p>
            <p className="text-sm text-red-700 mt-1">{herb.precautions}</p>
          </div>

          <p className="text-xs text-gray-400 italic text-center pt-2">
            ⚠️ This information is for educational purposes. Consult a qualified Ayurvedic practitioner before use.
          </p>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { DISEASES, Disease } from '@/lib/disease-database'
import { HERBS, getHerbById, searchHerbs } from '@/lib/herbs-real'

// Symptom checker that matches user symptoms to conditions
function findConditions(symptoms: string[]): { disease: Disease; matchCount: number; matchPercent: number }[] {
  const input = symptoms.map(s => s.toLowerCase().trim()).filter(Boolean)
  if (input.length === 0) return []

  const results = DISEASES.map(disease => {
    let matchCount = 0
    const allSymptoms = [
      ...disease.commonSymptoms,
      ...disease.name.toLowerCase().split(' '),
      ...disease.category.toLowerCase().split(' '),
      ...disease.description.toLowerCase().split(' ').filter(w => w.length > 4),
    ]

    for (const inp of input) {
      for (const sym of allSymptoms) {
        if (sym.includes(inp) || inp.includes(sym)) {
          matchCount++
          break
        }
      }
    }

    return {
      disease,
      matchCount,
      matchPercent: Math.round((matchCount / input.length) * 100),
    }
  })

  return results
    .filter(r => r.matchPercent >= 30)
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, 5)
}

const COMMON_SYMPTOMS = [
  'Stress', 'Anxiety', 'Insomnia', 'Fatigue', 'Weight gain', 'Joint pain',
  'Hair fall', 'Diabetes', 'High BP', 'Indigestion', 'Cold', 'Cough',
  'Acne', 'Skin rash', 'Acidity', 'Bloating', 'Constipation',
  'Irregular periods', 'Low immunity', 'Headache', 'Back pain',
]

export default function AIDoctorBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<'welcome' | 'symptoms' | 'results'>('welcome')
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [customSymptom, setCustomSymptom] = useState('')
  const [results, setResults] = useState<{ disease: Disease; matchCount: number; matchPercent: number }[]>([])
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null)
  const [messages, setMessages] = useState<{ from: 'bot' | 'user'; text: string }[]>([
    { from: 'bot', text: '🙏 Namaste! I am your AI Ayurveda Doctor. I will analyze your symptoms and suggest natural remedies, herbs, and lifestyle changes.\n\nDISCLAIMER: This is not a substitute for professional medical advice. Always consult a qualified doctor for serious conditions.' }
  ])

  const addSymptom = (s: string) => {
    if (!selectedSymptoms.includes(s)) {
      setSelectedSymptoms(prev => [...prev, s])
    }
    setCustomSymptom('')
  }

  const removeSymptom = (s: string) => {
    setSelectedSymptoms(prev => prev.filter(x => x !== s))
  }

  const analyzeSymptoms = () => {
    if (selectedSymptoms.length === 0) return
    const r = findConditions(selectedSymptoms)
    setResults(r)
    setStep('results')
    setMessages(prev => [...prev, {
      from: 'user' as const,
      text: `My symptoms: ${selectedSymptoms.join(', ')}`
    }])
    if (r.length > 0) {
      setMessages(prev => [...prev, {
        from: 'bot' as const,
        text: `Based on your symptoms, here are the most likely conditions. Click any to see detailed Ayurvedic treatment plan with herbs, diet, and yoga.`
      }])
    } else {
      setMessages(prev => [...prev, {
        from: 'bot' as const,
        text: `I couldn't find a strong match for these specific symptoms. Please try with more common symptoms, or consult an Ayurvedic doctor for a personalized consultation.`
      }])
    }
  }

  const resetChat = () => {
    setStep('welcome')
    setSelectedSymptoms([])
    setCustomSymptom('')
    setResults([])
    setSelectedDisease(null)
    setMessages([{
      from: 'bot',
      text: '🙏 Namaste! I am your AI Ayurveda Doctor. Select your symptoms to get started.\n\nDISCLAIMER: Not a substitute for professional medical advice.'
    }])
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-emerald-700 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
        title="AI Ayurveda Doctor"
      >
        <span className="text-3xl">🩺</span>
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[420px] max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-green-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 text-white p-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🩺</span>
          <div>
            <h3 className="font-bold text-lg leading-tight">AI Ayurveda Doctor</h3>
            <p className="text-green-200 text-xs">Symptom Checker & Herb Prescriber</p>
          </div>
        </div>
        <button onClick={() => { setIsOpen(false); resetChat(); }} className="text-white/80 hover:text-white text-2xl cursor-pointer">×</button>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-green-50/30" style={{ maxHeight: 'calc(85vh - 200px)' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.from === 'user'
                ? 'bg-green-700 text-white rounded-br-md'
                : 'bg-white border border-green-200 text-gray-800 rounded-bl-md shadow-sm'
            }`}>
              {msg.text.split('\n').map((line, j) => <p key={j} className={j > 0 ? 'mt-1' : ''}>{line}</p>)}
            </div>
          </div>
        ))}

        {/* Symptom selection */}
        {step === 'welcome' && (
          <div className="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
            <p className="text-sm font-semibold text-green-800 mb-3">Select your symptoms:</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {COMMON_SYMPTOMS.map(s => (
                <button
                  key={s}
                  onClick={() => addSymptom(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    selectedSymptoms.includes(s)
                      ? 'bg-green-700 text-white'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {selectedSymptoms.includes(s) ? '✓ ' : ''}{s}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customSymptom}
                onChange={e => setCustomSymptom(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && customSymptom.trim()) addSymptom(customSymptom.trim()); }}
                placeholder="Type custom symptom..."
                className="flex-1 px-3 py-2 border border-green-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button onClick={() => { if (customSymptom.trim()) addSymptom(customSymptom.trim()); }} className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm cursor-pointer hover:bg-green-700">+</button>
            </div>

            {selectedSymptoms.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-600 mb-2">Selected ({selectedSymptoms.length}):</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSymptoms.map(s => (
                    <span key={s} className="inline-flex items-center gap-1 px-2 py-1 bg-green-700 text-white rounded-full text-xs">
                      {s}
                      <button onClick={() => removeSymptom(s)} className="hover:text-red-200 cursor-pointer">×</button>
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => { setStep('symptoms'); analyzeSymptoms(); }}
                  className="mt-3 w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-sm hover:from-green-700 hover:to-emerald-700 cursor-pointer transition-all"
                >
                  🔍 Analyze Symptoms
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {step === 'results' && !selectedDisease && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 font-medium">
              {results.length} condition{results.length !== 1 ? 's' : ''} matched your symptoms:
            </p>
            {results.map(({ disease, matchPercent }) => (
              <button
                key={disease.id}
                onClick={() => setSelectedDisease(disease)}
                className="w-full text-left p-3 bg-white rounded-xl border border-green-200 hover:border-green-500 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-green-800">{disease.name}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    matchPercent >= 70 ? 'bg-green-100 text-green-700' :
                    matchPercent >= 50 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {matchPercent}% match
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{disease.description.slice(0, 120)}...</p>
                <p className="text-xs text-green-600 mt-1">💊 {disease.herbs.length} herbs • 🏠 {disease.homeRemedies.length} remedies</p>
              </button>
            ))}
            <button onClick={resetChat} className="w-full py-2 text-green-600 text-sm font-medium cursor-pointer hover:text-green-800">
              ← Check different symptoms
            </button>
          </div>
        )}

        {/* Disease detail view */}
        {selectedDisease && <DiseaseDetail disease={selectedDisease} onBack={() => setSelectedDisease(null)} />}
      </div>
    </div>
  )
}

// Disease detail card
function DiseaseDetail({ disease, onBack }: { disease: Disease; onBack: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-green-200 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 text-white p-4">
        <button onClick={onBack} className="text-green-200 text-xs mb-2 cursor-pointer hover:text-white">← Back to results</button>
        <h4 className="font-bold text-lg">{disease.name}</h4>
        <p className="text-green-200 text-xs mt-1">{disease.category}</p>
        {disease.severity === 'serious' && (
          <span className="inline-block mt-2 px-2 py-0.5 bg-red-500 text-white rounded text-xs font-bold">⚠️ See a Doctor</span>
        )}
        {disease.severity === 'moderate' && (
          <span className="inline-block mt-2 px-2 py-0.5 bg-yellow-500 text-white rounded text-xs font-bold">⚡ Moderate</span>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Ayurvedic View */}
        <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
          <p className="text-xs font-bold text-amber-800 mb-1">📜 Ayurvedic View</p>
          <p className="text-xs text-amber-900 leading-relaxed">{disease.ayurvedicView}</p>
        </div>

        {/* Herbs */}
        <div>
          <p className="text-sm font-bold text-green-800 mb-2">🌿 Recommended Herbs</p>
          <div className="space-y-2">
            {disease.herbs.map((h, i) => {
              const herbInfo = getHerbById(h.herbId)
              return (
                <div key={i} className="flex gap-3 p-2 bg-green-50 rounded-lg">
                  {herbInfo && (
                    <img src={herbInfo.image} alt={h.name}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-green-200"
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/100x100/16a34a/ffffff?text=${encodeURIComponent(h.name.slice(0, 2))}` }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-green-800">{h.name}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{h.why}</p>
                    <p className="text-xs text-green-600 mt-0.5 font-medium">📋 {h.dosage}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Home Remedies */}
        <div>
          <p className="text-sm font-bold text-green-800 mb-2">🏠 Home Remedies</p>
          <ul className="space-y-1.5">
            {disease.homeRemedies.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                <span className="text-green-500 mt-0.5">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Diet */}
        <div>
          <p className="text-sm font-bold text-green-800 mb-2">🥗 Diet Guidelines</p>
          <ul className="space-y-1.5">
            {disease.diet.map((d, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                <span className="text-orange-500 mt-0.5">•</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Yoga */}
        <div>
          <p className="text-sm font-bold text-green-800 mb-2">🧘 Yoga & Lifestyle</p>
          <div className="flex flex-wrap gap-1.5">
            {disease.yogaTherapy.map((y, i) => (
              <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">{y}</span>
            ))}
          </div>
          <ul className="mt-2 space-y-1">
            {disease.lifestyle.map((l, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Red Flags */}
        {disease.redFlags.length > 0 && (
          <div className="bg-red-50 rounded-lg p-3 border border-red-200">
            <p className="text-xs font-bold text-red-800 mb-1">🚨 See a Doctor Immediately If:</p>
            <ul className="space-y-1">
              {disease.redFlags.map((f, i) => (
                <li key={i} className="text-xs text-red-700">• {f}</li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-xs text-gray-400 italic text-center pt-2 border-t">
          ⚠️ This is general Ayurvedic guidance only. Not a substitute for professional medical diagnosis.
        </p>
      </div>
    </div>
  )
}

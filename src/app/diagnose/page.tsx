'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { DISEASES, type Disease } from '@/lib/disease-database'
import { HERBS } from '@/lib/herbs-real'

/* ───────────────────────────────────────────────────────────────────────────
   AI DIAGNOSE — free, on-device symptom checker.
   • Pure offline matching (TF keyword overlap) against a REAL disease database.
   • No API keys, nothing leaves the browser. Runs entirely client-side.
   • Educational wellness tool — NOT a medical device. Disclaimers enforced.
   ─────────────────────────────────────────────────────────────────────────── */

function tokenize(s: string): string[] {
  return s.toLowerCase().replace(/[^a-z\sऀ-ॿ]/g, '').split(/\s+/).filter(Boolean)
}

// Score a disease by overlap between user tokens and its symptom vocabulary.
function scoreDisease(d: Disease, tokens: string[], raw: string): number {
  const rawL = raw.toLowerCase()
  let score = 0
  const matched: string[] = []
  for (const sym of d.commonSymptoms) {
    const symL = sym.toLowerCase()
    if (rawL.includes(symL)) { score += 3; matched.push(sym); continue }
    // token-level partial match (e.g. "head" matches "headache")
    if (tokens.some(t => symL.includes(t) && t.length > 2) || symL.split(' ').some(w => tokens.includes(w))) {
      score += 1.5; matched.push(sym)
    }
  }
  return score
}

const QUICK = ['fever', 'cough', 'stress', 'anxiety', 'insomnia', 'joint pain', 'digestion', 'diabetes', 'skin', 'cold', 'headache', 'low immunity']

const SEVERITY_STYLE: Record<string, string> = {
  mild: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
  moderate: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
  serious: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
}

export default function DiagnosePage() {
  const [input, setInput] = useState('')
  const [ran, setRan] = useState(false)

  const results = useMemo(() => {
    const tokens = tokenize(input)
    if (tokens.length === 0) return []
    return DISEASES
      .map(d => ({ d, score: scoreDisease(d, tokens, input) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
  }, [input])

  const herbById = useMemo(() => Object.fromEntries(HERBS.map(h => [h.id, h])), [])

  return (
    <div className="min-h-screen bg-aurora-x">
      <Navbar />
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-[#d4a843] text-sm font-medium mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
            🩺 AI Symptom Checker · 100% On-Device · Private
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 leading-tight">
            AI <span className="text-gradient text-glow">Diagnose</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Describe how you feel. Our free on-device AI matches your symptoms against a real
            Ayurvedic condition database — instantly, privately, no keys.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="glass rounded-2xl p-4 mb-8 border border-amber-400/30">
          <p className="text-xs text-amber-200/90 leading-relaxed">
            ⚠️ <b>Educational wellness tool only — not a medical diagnosis.</b> This does not replace a
            qualified doctor. Always consult a physician for symptoms, especially serious or persistent ones.
            In an emergency, call your local emergency number.
          </p>
        </div>

        {/* Input */}
        <div className="glass-card rounded-3xl p-5 sm:p-7 glow-gold">
          <label className="block text-sm font-semibold text-[#1e3a5f] mb-2">What symptoms are you experiencing?</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={4}
            placeholder="e.g. I have been feeling anxious, cannot sleep well, and very tired for two weeks…"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/80 outline-none focus:border-[#d4a843] focus:ring-2 focus:ring-[#d4a843]/30 resize-none text-[#0f172a]"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {QUICK.map(q => (
              <button key={q} onClick={() => setInput(prev => prev ? `${prev}, ${q}` : q)}
                className="text-xs px-3 py-1.5 rounded-full bg-[#1e3a5f]/5 hover:bg-[#d4a843]/15 border border-[#1e3a5f]/10 text-[#1e3a5f] transition-colors">
                + {q}
              </button>
            ))}
          </div>
          <button
            onClick={() => setRan(true)}
            disabled={!input.trim()}
            className="btn-ai mt-4 w-full sm:w-auto disabled:opacity-40"
          >
            🔍 Analyze Symptoms (on-device)
          </button>
        </div>

        {/* Results */}
        {ran && (
          <div className="mt-10 space-y-5">
            {results.length === 0 ? (
              <div className="glass-card rounded-2xl p-8 text-center text-[#1e3a5f]">
                No strong match found in the database. Try describing symptoms in plain language
                (e.g. "fever and cough", "joint pain and fatigue"). For any health concern, please consult a doctor.
              </div>
            ) : (
              results.map(({ d, score }) => (
                <article key={d.id} className="glass-card rounded-3xl p-6 glow-navy">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h2 className="text-xl font-bold text-[#0f172a]">{d.name}</h2>
                      <p className="text-xs text-[#1e3a5f]/60 uppercase tracking-wide">{d.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${SEVERITY_STYLE[d.severity]}`}>
                        {d.severity}
                      </span>
                      <span className="text-[10px] text-[#1e3a5f]/50">match {Math.round(score)}</span>
                    </div>
                  </div>

                  <p className="text-sm text-[#1e3a5f]/80 mt-3">{d.description}</p>
                  <p className="text-xs text-[#2c5282] mt-2 italic">🪔 Ayurvedic view: {d.ayurvedicView}</p>

                  {/* Herbs */}
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-[#1e3a5f] mb-2">🌿 Recommended herbs</h3>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {d.herbs.map(h => {
                        const hb = herbById[h.herbId]
                        return (
                          <div key={h.name} className="flex items-start gap-2 p-3 rounded-xl bg-white/70 border border-gray-100">
                            <span className="text-xl">{hb?.emoji ?? '🌿'}</span>
                            <div>
                              <p className="text-sm font-semibold text-[#0f172a]">{h.name}</p>
                              <p className="text-xs text-[#1e3a5f]/70">{h.why}</p>
                              <p className="text-[11px] text-[#2c5282] mt-0.5">💊 {h.dosage}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <Link href="/ayurveda" className="inline-block mt-2 text-xs text-[#d4a843] font-semibold hover:underline">Browse the full herb library →</Link>
                  </div>

                  {/* Remedies / diet / yoga */}
                  <div className="grid sm:grid-cols-3 gap-3 mt-4 text-xs text-[#1e3a5f]/80">
                    <div className="p-3 rounded-xl bg-white/60">
                      <p className="font-semibold mb-1">🏠 Home remedies</p>
                      <ul className="list-disc pl-4 space-y-0.5">{d.homeRemedies.slice(0, 3).map(r => <li key={r}>{r}</li>)}</ul>
                    </div>
                    <div className="p-3 rounded-xl bg-white/60">
                      <p className="font-semibold mb-1">🍽️ Diet</p>
                      <ul className="list-disc pl-4 space-y-0.5">{d.diet.slice(0, 3).map(r => <li key={r}>{r}</li>)}</ul>
                    </div>
                    <div className="p-3 rounded-xl bg-white/60">
                      <p className="font-semibold mb-1">🧘 Yoga & lifestyle</p>
                      <ul className="list-disc pl-4 space-y-0.5">{d.yogaTherapy.slice(0, 2).concat(d.lifestyle.slice(0, 1)).map(r => <li key={r}>{r}</li>)}</ul>
                    </div>
                  </div>

                  {/* Red flags */}
                  {d.redFlags.length > 0 && (
                    <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-400/30">
                      <p className="text-xs font-semibold text-rose-600 mb-1">🚩 Seek urgent care if:</p>
                      <p className="text-xs text-rose-700/80">{d.redFlags.join(' · ')}</p>
                    </div>
                  )}
                  <p className="text-[11px] text-[#1e3a5f]/60 mt-3">👨‍⚕️ {d.seeDoctorIf}</p>
                </article>
              ))
            )}

            <p className="text-center text-[11px] text-white/50 pt-2">
              Powered by Infinite AI · matching runs privately in your browser · data from the Infinite Gundawar Ayurveda database
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

'use client'

import { useState } from 'react'
import { embed, ODAI_MODELS } from '@/lib/onDeviceAI'

function cosine(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0
  const n = Math.min(a.length, b.length)
  for (let i = 0; i < n; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i] }
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0
}

/**
 * SemanticCompare — FREE meaning-similarity between two texts.
 * Embeds both with all-MiniLM and reports cosine similarity (0–1).
 */
export default function SemanticCompare() {
  const [a, setA] = useState('A fast red sports car zoomed down the highway.')
  const [b, setB] = useState('A quick crimson racecar sped along the freeway.')
  const [score, setScore] = useState<number | null>(null)
  const [status, setStatus] = useState('Ready')
  const [busy, setBusy] = useState(false)

  async function compare() {
    if (!a.trim() || !b.trim()) return
    setBusy(true)
    setStatus('Embedding both texts (on-device)…')
    setScore(null)
    try {
      const [va, vb] = await Promise.all([embed(a), embed(b)])
      const s = cosine(va, vb)
      setScore(s)
      setStatus(s > 0.7 ? 'Strong semantic match.' : s > 0.4 ? 'Related but different.' : 'Different meaning.')
    } catch (e: any) {
      setStatus('Error: ' + (e?.message || String(e)))
    } finally {
      setBusy(false)
    }
  }

  const pct = score == null ? 0 : Math.round(score * 100)
  const hue = score == null ? 200 : Math.round(score * 120) // red→green

  return (
    <div className="glass" style={{ padding: 22 }}>
      <h3 style={{ marginTop: 0 }}>🔗 Semantic Compare (free)</h3>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>
        Meaning-similarity of two texts via {ODAI_MODELS.embed.split('/')[1]} embeddings.
      </p>
      <textarea value={a} onChange={(e) => setA(e.target.value)} rows={3}
        style={{ width: '100%', marginTop: 8, padding: '11px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', color: 'var(--text)', fontFamily: 'inherit', resize: 'vertical' }} />
      <textarea value={b} onChange={(e) => setB(e.target.value)} rows={3}
        style={{ width: '100%', marginTop: 8, padding: '11px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', color: 'var(--text)', fontFamily: 'inherit', resize: 'vertical' }} />
      <button className="btn-primary" onClick={compare} disabled={busy} style={{ marginTop: 8 }}>{busy ? 'Comparing…' : 'Compare Meaning'}</button>
      <div style={{ fontSize: 12, color: 'var(--gold)', marginTop: 8 }}>{status}</div>

      {score != null && (
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span>Similarity</span>
            <b style={{ color: `hsl(${hue} 70% 55%)` }}>{pct}%</b>
          </div>
          <div style={{ height: 12, borderRadius: 8, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginTop: 6 }}>
            <div style={{ width: `${pct}%`, height: '100%', background: `hsl(${hue} 70% 50%)`, transition: 'width .4s' }} />
          </div>
        </div>
      )}
    </div>
  )
}

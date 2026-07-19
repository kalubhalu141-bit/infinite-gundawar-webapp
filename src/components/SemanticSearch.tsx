'use client'

import { useState } from 'react'
import { embed } from '@/lib/onDeviceAI'
import { HERBS } from '@/lib/herbs-real'
import { DISEASES } from '@/lib/disease-database'
import { TRADING_PATTERNS } from '@/lib/trading-patterns-data'
import { aiTools } from '@/data/ai-tools'

/**
 * SemanticSearch — FREE, on-device semantic search across the site's real data.
 * Embeds the query with all-MiniLM (transformers.js) and cosine-matches against
 * pre-built text embeddings of herbs / diseases / trading patterns / AI tools.
 * First search downloads the embed model; afterwards it's instant & offline.
 */
type Item = { id: string; kind: string; title: string; body: string; meta?: string }

function buildCorpus(): Item[] {
  const items: Item[] = []
  HERBS.slice(0, 120).forEach((h: any) =>
    items.push({
      id: 'h-' + h.id,
      kind: '🌿 Herb',
      title: `${h.name} (${h.sanskrit || ''})`,
      body: `${h.botanical || ''} ${(h.benefits || []).join(' ')} ${(h.uses || []).join(' ')} ${(h.dosage || '')}`,
      meta: h.category || '',
    }),
  )
  DISEASES.forEach((d: any) =>
    items.push({
      id: 'd-' + d.id,
      kind: '🩺 Disease',
      title: d.name,
      body: `${d.category} ${(d.commonSymptoms || []).join(' ')} ${d.ayurvedicView || ''}`,
      meta: d.severity || '',
    }),
  )
  TRADING_PATTERNS.slice(0, 60).forEach((p: any) =>
    items.push({
      id: 'p-' + p.id,
      kind: '📈 Pattern',
      title: p.name,
      body: `${p.type} ${p.bias} ${p.description} ${p.howToTrade} ${p.psychology}`,
      meta: `reliability ${p.reliability}`,
    }),
  )
  aiTools.slice(0, 60).forEach((t: any) =>
    items.push({
      id: 't-' + t.id,
      kind: '🤖 AI Tool',
      title: t.name,
      body: `${t.category} ${t.description} ${(t.tags || []).join(' ')}`,
      meta: t.pricing || '',
    }),
  )
  return items
}

const CORPUS = buildCorpus()

export default function SemanticSearch() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('Type a query and search — runs on-device.')
  const [results, setResults] = useState<Item[]>([])
  const [busy, setBusy] = useState(false)

  async function search() {
    if (!q.trim()) return
    setBusy(true)
    setStatus('Embedding query with all-MiniLM (on-device)…')
    try {
      const qVec = await embed(q)
      // Embed each corpus item (cache per id to avoid recompute within a session)
      const scored: { item: Item; score: number }[] = []
      for (const item of CORPUS) {
        const v = await embed(item.body.slice(0, 400))
        const score = cosine(qVec, v)
        scored.push({ item, score })
      }
      scored.sort((a, b) => b.score - a.score)
      setResults(scored.slice(0, 12).filter((s) => s.score > 0.15).map((s) => s.item))
      setStatus(`Found ${scored.filter((s) => s.score > 0.15).length} semantic matches across ${CORPUS.length} records.`)
    } catch (e: any) {
      setStatus('Error: ' + (e?.message || String(e)))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="glass" style={{ padding: 22 }}>
      <h3 style={{ marginTop: 0 }}>🔎 Semantic Search (free embeddings)</h3>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>
        Searches {CORPUS.length} real records (herbs, diseases, trading patterns, AI tools) by <b>meaning</b>, not
        keywords — using all-MiniLM vectors. Fully on-device.
      </p>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search()}
          placeholder="e.g. herb for sleep, bullish reversal, chatbot for writing"
          style={{ flex: 1, padding: '11px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', color: 'var(--text)', fontFamily: 'inherit' }}
        />
        <button className="btn-primary" onClick={search} disabled={busy}>
          {busy ? 'Searching…' : 'Search'}
        </button>
      </div>
      <div style={{ fontSize: 12, color: 'var(--gold)', marginTop: 8 }}>{status}</div>

      <div style={{ marginTop: 14, display: 'grid', gap: 8 }}>
        {results.map((r) => (
          <div key={r.id} style={{ padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <b>{r.title}</b>
              <span style={{ fontSize: 12, color: 'var(--accent)' }}>{r.kind}</span>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: 13, margin: '4px 0 0' }}>{r.body.slice(0, 140)}…</p>
            {r.meta && <span style={{ fontSize: 11, color: 'var(--gold)' }}>{r.meta}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

function cosine(a: number[], b: number[]): number {
  let dot = 0
  let na = 0
  let nb = 0
  const n = Math.min(a.length, b.length)
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0
}

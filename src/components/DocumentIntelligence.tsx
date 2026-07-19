'use client'

import { useState } from 'react'
import { summarize, extractEntities, ODAI_MODELS } from '@/lib/onDeviceAI'
import { extractKeywords } from '@/lib/clientML'

/**
 * DocumentIntelligence — FREE chained document analysis. One paste runs three
 * on-device models: BART summarizer + TF-IDF keyword extractor + BERT-NER,
 * giving a full structured read of any text. No server, no keys.
 */
export default function DocumentIntelligence() {
  const [doc, setDoc] = useState(
    'Infinite Gundawar Business Private Limited, headquartered in Maharashtra, India, delivers infrastructure, import/export trading, coaching, and digital marketing. Founder Niraj Gundawar leads a team operating across Tokyo, Berlin and Dubai. The firm is RERA registered and GST compliant, emphasizing privacy-first on-device AI for its clients.',
  )
  const [summary, setSummary] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])
  const [entities, setEntities] = useState<{ entity: string; type: string }[]>([])
  const [status, setStatus] = useState('Ready')
  const [busy, setBusy] = useState(false)

  async function analyze() {
    if (!doc.trim()) return
    setBusy(true)
    setStatus('Running BART summarizer (on-device)…')
    setSummary(''); setKeywords([]); setEntities([])
    try {
      const [sum, kws, ents] = await Promise.all([
        summarize(doc),
        Promise.resolve(extractKeywords(doc, 8)),
        extractEntities(doc),
      ])
      setSummary(sum)
      setKeywords(kws)
      setEntities(ents.map((e) => ({ entity: e.entity, type: e.type })))
      setStatus('Analysis complete.')
    } catch (e: any) {
      setStatus('Error: ' + (e?.message || String(e)))
    } finally {
      setBusy(false)
    }
  }

  const COLORS: Record<string, string> = { PER: '#38bdf8', ORG: '#d4a843', LOC: '#34d399', MISC: '#a78bfa' }

  return (
    <div className="glass" style={{ padding: 22 }}>
      <h3 style={{ marginTop: 0 }}>🧠 Document Intelligence (free, chained)</h3>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>
        Summary: {ODAI_MODELS.summarize.split('/')[1]} · Keywords: TF-IDF · Entities: {ODAI_MODELS.ner.split('/')[1]} — all on-device.
      </p>
      <textarea
        value={doc}
        onChange={(e) => setDoc(e.target.value)}
        rows={5}
        style={{ width: '100%', marginTop: 8, padding: '11px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', color: 'var(--text)', fontFamily: 'inherit', resize: 'vertical' }}
      />
      <button className="btn-primary" onClick={analyze} disabled={busy} style={{ marginTop: 8 }}>{busy ? 'Analyzing…' : 'Analyze Document'}</button>
      <div style={{ fontSize: 12, color: 'var(--gold)', marginTop: 8 }}>{status}</div>

      {summary && (
        <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: 'rgba(56,189,248,0.08)' }}>
          <b>📝 Summary</b>
          <p style={{ margin: '6px 0 0' }}>{summary}</p>
        </div>
      )}
      {keywords.length > 0 && (
        <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {keywords.map((k, i) => (
            <span key={i} style={{ padding: '4px 9px', borderRadius: 16, background: 'rgba(212,168,67,0.14)', border: '1px solid var(--line)', fontSize: 12 }}>#{k}</span>
          ))}
        </div>
      )}
      {entities.length > 0 && (
        <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {entities.map((e, i) => (
            <span key={i} style={{ padding: '4px 9px', borderRadius: 16, background: (COLORS[e.type] || '#888') + '22', border: `1px solid ${COLORS[e.type] || '#888'}`, fontSize: 12 }}>
              <b style={{ color: COLORS[e.type] || '#fff' }}>{e.entity}</b> <span style={{ color: 'var(--muted)' }}>{e.type}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

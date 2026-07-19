'use client'

import { useState } from 'react'
import { extractEntities, deviceType, isOnDeviceSupported, ODAI_MODELS } from '@/lib/onDeviceAI'

const COLORS: Record<string, string> = {
  PER: '#38bdf8',
  ORG: '#d4a843',
  LOC: '#34d399',
  MISC: '#a78bfa',
}

/**
 * EntityExtractor — FREE Named Entity Recognition (Xenova/bert-base-NER).
 * Extracts Person / Organization / Location / Misc spans, on-device.
 */
export default function EntityExtractor() {
  const [text, setText] = useState(
    'Niraj Gundawar founded Infinite Gundawar Business Private Limited in Maharashtra, India. The company trades with partners in Tokyo and Berlin.',
  )
  const [ents, setEnts] = useState<{ entity: string; type: string; score: number }[]>([])
  const [status, setStatus] = useState('Ready')
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState('')

  async function run() {
    if (!text.trim()) return
    setBusy(true)
    setStatus('Loading BERT-NER (on-device)…')
    setProgress('')
    setEnts([])
    try {
      const res = await extractEntities(text, (p: any) => {
        if (p?.status === 'progress') setProgress(`${Math.round((p.progress || 0) * 100)}%`)
      })
      setEnts(res)
      setStatus(`Extracted ${res.length} entities.`)
    } catch (e: any) {
      setStatus('Error: ' + (e?.message || String(e)))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="glass" style={{ padding: 22 }}>
      <h3 style={{ marginTop: 0 }}>🏷️ Entity Extractor (free NER)</h3>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>
        BERT-NER finds people, organizations, locations &amp; misc. — fully on-device. Model: {ODAI_MODELS.ner.split('/')[1]}
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        style={{ width: '100%', marginTop: 10, padding: '11px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', color: 'var(--text)', fontFamily: 'inherit', resize: 'vertical' }}
      />
      <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center' }}>
        <button className="btn-primary" onClick={run} disabled={busy}>{busy ? 'Analyzing…' : 'Extract Entities'}</button>
        {progress && <span style={{ fontSize: 12, color: 'var(--gold)' }}>{progress}</span>}
      </div>
      <div style={{ fontSize: 12, color: 'var(--gold)', marginTop: 8 }}>{status}</div>

      {ents.length > 0 && (
        <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {ents.map((e, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 20, background: (COLORS[e.type] || '#888') + '22', border: `1px solid ${COLORS[e.type] || '#888'}` }}>
              <b style={{ color: COLORS[e.type] || '#fff' }}>{e.entity}</b>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>{e.type} {Math.round(e.score * 100)}%</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

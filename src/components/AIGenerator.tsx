'use client'

import { useState } from 'react'
import { generateText, fillMask, ODAI_MODELS } from '@/lib/onDeviceAI'

/**
 * AIGenerator — FREE causal-LM text generation (DistilGPT2) + fill-mask (BERT).
 * Both run entirely on-device. Great for brainstorming taglines, product blurbs,
 * or completing masked business sentences.
 */
export default function AIGenerator() {
  const [prompt, setPrompt] = useState('Infinite Gundawar is a company that builds')
  const [gen, setGen] = useState('')
  const [mask, setMask] = useState('Our infrastructure projects are [MASK] and reliable.')
  const [maskOut, setMaskOut] = useState<{ sequence: string; score: number }[]>([])
  const [status, setStatus] = useState('Ready')
  const [busy, setBusy] = useState(false)

  async function runGen() {
    setBusy(true)
    setStatus('Generating with DistilGPT2 (on-device)…')
    setGen('')
    try {
      const t = await generateText(prompt, 60)
      setGen(t)
      setStatus('Done.')
    } catch (e: any) {
      setStatus('Error: ' + (e?.message || String(e)))
    } finally {
      setBusy(false)
    }
  }

  async function runMask() {
    setBusy(true)
    setStatus('Fill-mask with BERT (on-device)…')
    setMaskOut([])
    try {
      const r = await fillMask(mask)
      setMaskOut(r)
      setStatus(`Top ${r.length} completions.`)
    } catch (e: any) {
      setStatus('Error: ' + (e?.message || String(e)))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="glass" style={{ padding: 22 }}>
      <h3 style={{ marginTop: 0 }}>✍️ AI Text Studio (free)</h3>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>
        Causal generation: {ODAI_MODELS.generate.split('/')[1]} · Fill-mask: {ODAI_MODELS.fillMask.split('/')[1]}
      </p>

      <label style={{ fontSize: 13, color: 'var(--muted)' }}>Generate text</label>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={2}
        style={{ width: '100%', marginTop: 4, padding: '11px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', color: 'var(--text)', fontFamily: 'inherit', resize: 'vertical' }}
      />
      <button className="btn-primary" onClick={runGen} disabled={busy} style={{ marginTop: 8 }}>{busy ? 'Generating…' : 'Generate'}</button>
      {gen && (
        <div style={{ marginTop: 10, padding: 12, borderRadius: 10, background: 'rgba(56,189,248,0.08)', whiteSpace: 'pre-wrap', fontSize: 14 }}>{gen}</div>
      )}

      <hr style={{ borderColor: 'var(--line)', margin: '18px 0' }} />

      <label style={{ fontSize: 13, color: 'var(--muted)' }}>Fill the [MASK]</label>
      <input
        value={mask}
        onChange={(e) => setMask(e.target.value)}
        style={{ width: '100%', marginTop: 4, padding: '11px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', color: 'var(--text)', fontFamily: 'inherit' }}
      />
      <button className="btn-ghost" onClick={runMask} disabled={busy} style={{ marginTop: 8 }}>Complete</button>
      {maskOut.length > 0 && (
        <div style={{ marginTop: 10, display: 'grid', gap: 6 }}>
          {maskOut.map((m, i) => (
            <div key={i} style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(212,168,67,0.10)', fontSize: 13 }}>
              {m.sequence} <span style={{ color: 'var(--gold)' }}>{Math.round(m.score * 100)}%</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ fontSize: 12, color: 'var(--gold)', marginTop: 8 }}>{status}</div>
    </div>
  )
}

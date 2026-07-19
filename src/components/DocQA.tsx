'use client'

import { useState, useRef } from 'react'
import { answerQuestion, textToSpeech, ODAI_MODELS } from '@/lib/onDeviceAI'

/**
 * DocQA — FREE document question-answering. Paste/upload text, then ask
 * questions — DistilBERT-SQuAD extracts the answer span on-device.
 * No upload to any server; everything runs in the browser.
 */
export default function DocQA() {
  const [doc, setDoc] = useState(
    'Infinite Gundawar Business Private Limited is incorporated under the Companies Act, 2013 and registered in Maharashtra, India. The company operates across infrastructure, import/export trading, coaching and education, and digital marketing. It is RERA registered and GST compliant. The headquarters are in Maharashtra and the firm trades with partners in Tokyo, Berlin and Dubai.',
  )
  const [fileText, setFileText] = useState('')
  const [q, setQ] = useState('Where is the company registered?')
  const [answer, setAnswer] = useState<{ answer: string; score: number } | null>(null)
  const [status, setStatus] = useState('Ready')
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.name.endsWith('.txt')) {
      const r = new FileReader()
      r.onload = () => {
        setDoc(String(r.result || ''))
        setFileText(f.name)
        setStatus(`Loaded ${f.name}`)
      }
      r.readAsText(f)
    } else {
      // For non-txt, just note it (we can't extract text client-side without libs)
      setFileText(f.name + ' (paste its text below to analyze)')
    }
  }

  async function ask() {
    if (!doc.trim() || !q.trim()) return
    setBusy(true)
    setStatus('Loading SQuAD QA model (on-device)…')
    setProgress('')
    setAnswer(null)
    try {
      const res = await answerQuestion(q, doc, (p: any) => {
        if (p?.status === 'progress') setProgress(`${Math.round((p.progress || 0) * 100)}%`)
      })
      setAnswer(res)
      setStatus('Answered.')
    } catch (e: any) {
      setStatus('Error: ' + (e?.message || String(e)))
    } finally {
      setBusy(false)
    }
  }

  async function speak() {
    if (!answer?.answer) return
    try {
      const blob = await textToSpeech(answer.answer)
      const url = URL.createObjectURL(blob)
      new Audio(url).play()
    } catch {}
  }

  return (
    <div className="glass" style={{ padding: 22 }}>
      <h3 style={{ marginTop: 0 }}>📄 Document Q&amp;A (free SQuAD)</h3>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>
        Ask questions of any pasted text. Model: {ODAI_MODELS.qa.split('/')[1]} — fully on-device.
      </p>
      <input ref={fileRef} type="file" accept=".txt" onChange={onFile} style={{ marginTop: 8 }} />
      {fileText && <div style={{ fontSize: 12, color: 'var(--gold)' }}>{fileText}</div>}
      <textarea
        value={doc}
        onChange={(e) => setDoc(e.target.value)}
        rows={5}
        style={{ width: '100%', marginTop: 8, padding: '11px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', color: 'var(--text)', fontFamily: 'inherit', resize: 'vertical' }}
      />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && ask()}
          placeholder="Ask a question about the text…"
          style={{ flex: 1, padding: '11px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', color: 'var(--text)', fontFamily: 'inherit' }}
        />
        <button className="btn-primary" onClick={ask} disabled={busy}>{busy ? 'Thinking…' : 'Ask'}</button>
      </div>
      {progress && <span style={{ fontSize: 12, color: 'var(--gold)' }}>{progress}</span>}
      <div style={{ fontSize: 12, color: 'var(--gold)', marginTop: 6 }}>{status}</div>

      {answer && (
        <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: 'rgba(56,189,248,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <b>Answer:</b> <span style={{ fontSize: 12, color: 'var(--accent)' }}>{Math.round(answer.score * 100)}% confidence</span>
          </div>
          <p style={{ margin: '6px 0 0' }}>{answer.answer}</p>
          <button className="btn-ghost" onClick={speak} style={{ marginTop: 8 }}>🔊 Speak</button>
        </div>
      )}
    </div>
  )
}

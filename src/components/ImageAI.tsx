'use client'

import { useState, useRef } from 'react'
import { captionImage, classifyImage, ODAI_MODELS } from '@/lib/onDeviceAI'

/**
 * ImageAI — FREE on-device vision. Upload an image → ViT-GPT2 captions it and
 * ViT zero-shot classifies it against your own labels. No upload to any server.
 */
export default function ImageAI() {
  const [imgUrl, setImgUrl] = useState<string | null>(null)
  const [blob, setBlob] = useState<Blob | null>(null)
  const [caption, setCaption] = useState('')
  const [classes, setClasses] = useState<{ label: string; score: number }[]>([])
  const [labels, setLabels] = useState('business, nature, people, technology, food')
  const [status, setStatus] = useState('Upload an image to begin.')
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const url = URL.createObjectURL(f)
    setImgUrl(url)
    setBlob(f)
    setCaption('')
    setClasses([])
    setStatus('Image loaded. Click a button below.')
  }

  async function runCaption() {
    if (!blob) return
    setBusy(true)
    setStatus('Captioning with ViT-GPT2 (on-device)…')
    try {
      const c = await captionImage(blob)
      setCaption(c)
      setStatus('Caption ready.')
    } catch (e: any) {
      setStatus('Error: ' + (e?.message || String(e)))
    } finally {
      setBusy(false)
    }
  }

  async function classify() {
    if (!blob) return
    setBusy(true)
    setStatus('Classifying with ViT (on-device)…')
    try {
      const ls = labels.split(',').map((s) => s.trim()).filter(Boolean)
      const r = await classifyImage(blob, ls)
      setClasses(r)
      setStatus(`Classified across ${ls.length} labels.`)
    } catch (e: any) {
      setStatus('Error: ' + (e?.message || String(e)))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="glass" style={{ padding: 22 }}>
      <h3 style={{ marginTop: 0 }}>🖼️ Vision AI (free, on-device)</h3>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>
        Caption: {ODAI_MODELS.imageCaption.split('/')[1]} · Classify: {ODAI_MODELS.imageClassify.split('/')[1]}
      </p>

      <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ marginTop: 10 }} />
      {imgUrl && <img src={imgUrl} alt="upload" style={{ width: '100%', maxHeight: 240, objectFit: 'contain', marginTop: 10, borderRadius: 10, border: '1px solid var(--line)' }} />}

      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
        <button className="btn-primary" onClick={runCaption} disabled={!blob || busy}>📝 Caption</button>
        <button className="btn-ghost" onClick={classify} disabled={!blob || busy}>🏷️ Classify</button>
      </div>

      <div style={{ marginTop: 8 }}>
        <input
          value={labels}
          onChange={(e) => setLabels(e.target.value)}
          placeholder="comma-separated labels"
          style={{ width: '100%', padding: '9px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', color: 'var(--text)', fontFamily: 'inherit', fontSize: 13 }}
        />
      </div>

      <div style={{ fontSize: 12, color: 'var(--gold)', marginTop: 8 }}>{status}</div>

      {caption && (
        <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: 'rgba(56,189,248,0.08)' }}>
          <b>Caption:</b> {caption}
        </div>
      )}
      {classes.length > 0 && (
        <div style={{ marginTop: 10, display: 'grid', gap: 6 }}>
          {classes.map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, background: 'rgba(52,211,153,0.08)', fontSize: 13 }}>
              <span>{c.label}</span>
              <span style={{ color: 'var(--accent)' }}>{Math.round(c.score * 100)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

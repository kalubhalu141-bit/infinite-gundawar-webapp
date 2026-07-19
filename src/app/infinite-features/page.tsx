'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import VoiceChat from '@/components/VoiceChat'
import SemanticSearch from '@/components/SemanticSearch'
import { ODAI_MODELS } from '@/lib/onDeviceAI'
import { getTodaysFeatures } from '@/lib/auto-update'
import { FEATURE_REGISTRY, getFeatureCountByCategory } from '@/lib/feature-registry'

export default function InfiniteFeaturesPage() {
  const [daily, setDaily] = useState<any[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [modelStatus, setModelStatus] = useState<Record<string, string>>({})

  useEffect(() => {
    try { setDaily(getTodaysFeatures()) } catch {}
    try { setCounts(getFeatureCountByCategory()) } catch {}
    // Snapshot which free models are registered (loaded lazily on first use)
    const m: Record<string, string> = {}
    Object.entries(ODAI_MODELS).forEach(([k, v]) => {
      m[k] = v.split('/')[1]
    })
    setModelStatus(m)
  }, [])

  const freeModelIds = Object.values(ODAI_MODELS)

  return (
    <section className="section-pad">
      <div className="container-x">
        <div className="eyebrow">Infinite AI · 100% Free · Zero Keys</div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', margin: '12px 0 6px' }}>
          Infinite <span className="text-gradient">Features</span>
        </h1>
        <p style={{ color: 'var(--muted)', maxWidth: 760, fontSize: 18, lineHeight: 1.6 }}>
          Every capability below runs on FREE models — Hugging Face transformers.js in your browser (WebGPU/WASM),
          with offline rule-based fallbacks. No API keys, no server bills, your data never leaves the device.
        </p>

        {/* Model registry */}
        <div className="glass" style={{ padding: 22, marginTop: 24 }}>
          <h3 style={{ marginTop: 0 }}>🧠 Free On-Device Model Registry</h3>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>{freeModelIds.length} verified ONNX models, loaded on demand from CDN.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10, marginTop: 12 }}>
            {Object.entries(modelStatus).map(([k, v]) => (
              <div key={k} style={{ padding: 10, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--line)' }}>
                <div style={{ fontSize: 12, color: 'var(--gold)' }}>{k}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'monospace' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* New free-AI features */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 22 }}>
          <VoiceChat />
          <SemanticSearch />
        </div>

        {/* Daily auto-features from registry (the "infinite" growth engine) */}
        <div className="glass" style={{ padding: 22, marginTop: 22 }}>
          <h3 style={{ marginTop: 0 }}>♾️ Today's Auto-Features</h3>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>
            Driven by <code>feature-registry.ts</code> + <code>auto-update.ts</code> — the site grows new capabilities daily.
            {Object.keys(counts).length > 0 && ` (${FEATURE_REGISTRY.length} features registered across ${Object.keys(counts).length} categories)`}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, marginTop: 12 }}>
            {(daily.length ? daily : FEATURE_REGISTRY.slice(0, 6)).map((f: any, i) => (
              <div key={i} style={{ padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--line)' }}>
                <div style={{ fontSize: 22 }}>{f.icon || '⚡'}</div>
                <b style={{ fontSize: 15 }}>{f.name || f.title || 'Feature'}</b>
                <p style={{ color: 'var(--muted)', fontSize: 13, margin: '4px 0 0' }}>{f.description || f.hint || ''}</p>
                {f.category && <span style={{ fontSize: 11, color: 'var(--accent)' }}>{f.category}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Links to all free-AI surfaces */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 24 }}>
          <Link href="/infinite-ai" className="btn-primary">Open full AI Suite →</Link>
          <Link href="/ai-studio" className="btn-ghost">AI Studio</Link>
          <Link href="/ayurveda" className="btn-ghost">Ayurveda AI</Link>
          <Link href="/three-experience" className="btn-ghost">3D Experience</Link>
        </div>
      </div>
    </section>
  )
}

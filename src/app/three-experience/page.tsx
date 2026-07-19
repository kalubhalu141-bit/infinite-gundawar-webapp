'use client'

import { useState } from 'react'
import ThreeHero from '@/components/three/ThreeHero'
import PillarsScene, { Pillar } from '@/components/three/PillarsScene'

const PILLARS: Pillar[] = [
  { id: 'infra', title: 'Infrastructure & Real Estate', color: 0xd4a843, blurb: 'Developers, builders, promoters, contractors, town planners, surveyors and property agents.' },
  { id: 'trade', title: 'Import / Export Trading', color: 0x2c82d4, blurb: 'Consumer goods, electronics, industrial, agricultural, technology and lifestyle products worldwide.' },
  { id: 'education', title: 'Coaching & Education', color: 0x818cf8, blurb: 'Skill development, certification, competitive exam prep and coaching classes.' },
  { id: 'digital', title: 'Digital Marketing', color: 0x34d399, blurb: 'Campaigns, branding and promotional activities that amplify brands.' },
]

export default function ThreeExperiencePage() {
  const [selected, setSelected] = useState<string | null>(null)
  const active = PILLARS.find((p) => p.id === selected)

  return (
    <>
      {/* Full-bleed 3D hero */}
      <section style={{ position: 'relative', height: '70vh', minHeight: 460, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <ThreeHero />
        <div className="container-x" style={{ position: 'relative', zIndex: 2 }}>
          <div className="eyebrow" style={{ color: 'var(--accent)' }}>WebGL · three.js</div>
          <h1 style={{ fontSize: 'clamp(34px,6vw,64px)', fontWeight: 800, margin: '10px 0', maxWidth: 720 }}>
            The 3D <span className="text-gradient">Infinite Gundawar</span> Universe
          </h1>
          <p style={{ color: 'var(--muted)', maxWidth: 560, fontSize: 18 }}>
            A real-time WebGL experience of the business group — rendered in your browser with three.js. No plugins, no GPU required beyond what you already have.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x">
          <div className="eyebrow">Interactive</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', margin: '10px 0 6px' }}>Four Pillars, One Ecosystem</h2>
          <p style={{ color: 'var(--muted)', maxWidth: 620 }}>
            Drag to orbit the model · click a pillar to highlight it. Built with three.js BoxGeometry, real-time lighting and raycaster-based picking.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,0.9fr)', gap: 22, marginTop: 24, alignItems: 'stretch' }}>
            <div className="glass" style={{ position: 'relative', height: 480, overflow: 'hidden', borderRadius: 18 }}>
              <PillarsScene pillars={PILLARS} selectedId={selected} onSelect={setSelected} />
            </div>
            <div className="glass" style={{ padding: 26, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {active ? (
                <>
                  <div className="eyebrow">Selected</div>
                  <h3 style={{ fontSize: 24, margin: '8px 0 12px' }}>{active.title}</h3>
                  <p style={{ color: 'var(--muted)', lineHeight: 1.65 }}>{active.blurb}</p>
                </>
              ) : (
                <>
                  <div className="eyebrow">Tap a pillar</div>
                  <h3 style={{ fontSize: 24, margin: '8px 0 12px' }}>Interactive 3D Model</h3>
                  <ul style={{ color: 'var(--muted)', lineHeight: 1.9, paddingLeft: 18 }}>
                    {PILLARS.map((p) => (
                      <li key={p.id}>
                        <button onClick={() => setSelected(p.id)} style={{ background: 'transparent', border: 'none', color: 'var(--gold)', cursor: 'pointer', font: 'inherit', fontSize: 15 }}>{p.title}</button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          <div className="glass" style={{ padding: 28, marginTop: 24, background: 'rgba(44,130,212,0.10)' }}>
            <h3 style={{ marginTop: 0 }}>Why three.js?</h3>
            <p style={{ color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
              The same free, on-device philosophy as the AI Studio: no paid 3D services, no API keys. The globe and
              pillars run entirely client-side, with a WebGPU/WASM-safe fallback and full reduced-motion support.
              Combined with the free transformers.js AI on this site, the entire experience is zero-cost to run.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

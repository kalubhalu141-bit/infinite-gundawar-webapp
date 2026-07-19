'use client'

import { useMemo, useState } from 'react'
import { materials, origins, categories } from '@/lib/interior-materials-data'

export default function InteriorPage() {
  const [origin, setOrigin] = useState('All')
  const [cat, setCat] = useState('All')

  const filtered = useMemo(
    () =>
      materials.filter(
        (m) => (origin === 'All' || m.origin === origin) && (cat === 'All' || m.category === cat),
      ),
    [origin, cat],
  )

  const catList = useMemo(() => ['All', ...Array.from(new Set(materials.map((m) => m.category)))], [])

  return (
    <section className="section-pad">
      <div className="container-x">
        <div className="eyebrow">From the Archive</div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', margin: '12px 0 6px' }}>
          Interior <span className="gold-text">Materials Catalog</span>
        </h1>
        <p style={{ color: 'var(--muted)', maxWidth: 720, fontSize: 18 }}>
          {materials.length} wholesale materials with verified suppliers, origins and MOQs — imported from the
          Infinite Gundawar archive.
        </p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 20 }}>
          {origins.map((o) => (
            <button key={o} onClick={() => setOrigin(o)} className="btn-ghost" style={{ padding: '6px 14px', fontSize: 13, borderColor: origin === o ? 'var(--gold)' : 'var(--line)' }}>{o}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
          {catList.map((c) => (
            <button key={c} onClick={() => setCat(c)} className="btn-ghost" style={{ padding: '6px 14px', fontSize: 13, background: cat === c ? 'linear-gradient(90deg,var(--gold),var(--gold-2))' : 'transparent', color: cat === c ? '#1a1205' : 'var(--text)', borderColor: cat === c ? 'transparent' : 'var(--line)' }}>{c}</button>
          ))}
        </div>

        <div style={{ color: 'var(--muted)', fontSize: 13, margin: '14px 0' }}>{filtered.length} materials</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map((m) => (
            <div key={m.id} className="glass" style={{ padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h4 style={{ margin: 0, fontSize: 16 }}>{m.name}</h4>
                <span style={{ fontSize: 11, color: 'var(--accent)' }}>{m.origin}</span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: 13, margin: '6px 0' }}>{m.category} · {m.subcategory}</p>
              <p style={{ color: 'var(--muted)', fontSize: 13, margin: '0 0 8px' }}>{m.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)' }}>
                <span style={{ color: 'var(--gold)' }}>{m.priceRange}</span>
                <span>MOQ: {m.moq}</span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: 12, margin: '8px 0 0' }}>{m.supplier} ({m.supplierType}) · {m.location}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

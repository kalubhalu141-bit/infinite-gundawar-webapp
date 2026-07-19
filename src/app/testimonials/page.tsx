'use client'

import { useEffect, useState } from 'react'
import { TESTIMONIALS, getTodaysTestimonials } from '@/lib/daily-content'

export default function TestimonialsPage() {
  const [featured, setFeatured] = useState<any[]>([])
  useEffect(() => {
    try { setFeatured(getTodaysTestimonials()) } catch { setFeatured(TESTIMONIALS.slice(0, 3)) }
  }, [])

  return (
    <section className="section-pad">
      <div className="container-x">
        <div className="eyebrow">From the Archive</div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', margin: '12px 0 6px' }}>
          Client <span className="gold-text">Testimonials</span>
        </h1>
        <p style={{ color: 'var(--muted)', maxWidth: 720, fontSize: 18 }}>
          {TESTIMONIALS.length} testimonials carried over from the Infinite Gundawar archive.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18, marginTop: 28 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="glass" style={{ padding: 24 }}>
              <div style={{ fontSize: 28, color: 'var(--gold)' }}>{'★'.repeat(t.rating)}</div>
              <p style={{ lineHeight: 1.6, marginTop: 10 }}>“{t.text}”</p>
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 26 }}>{t.avatar}</span>
                <div>
                  <div style={{ fontWeight: 600 }}>{t.name}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 13 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

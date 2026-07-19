'use client'

import { FREE_TOOLS, DAILY_TIPS, getTodaysTip, getTodaysOffer } from '@/lib/daily-content'
import { useEffect, useState } from 'react'

export default function ToolsPage() {
  const [tip, setTip] = useState<any>(null)
  const [offer, setOffer] = useState<any>(null)
  useEffect(() => {
    try { setTip(getTodaysTip()) } catch {}
    try { setOffer(getTodaysOffer()) } catch {}
  }, [])

  return (
    <section className="section-pad">
      <div className="container-x">
        <div className="eyebrow">From the Archive</div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', margin: '12px 0 6px' }}>
          Free <span className="gold-text">Business Tools</span>
        </h1>
        <p style={{ color: 'var(--muted)', maxWidth: 720, fontSize: 18 }}>
          {FREE_TOOLS.length} free utilities imported from the Infinite Gundawar content archive.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginTop: 28 }}>
          {FREE_TOOLS.map((t, i) => (
            <div key={i} className="glass" style={{ padding: 22 }}>
              <div style={{ fontSize: 30 }}>{t.icon}</div>
              <h4 style={{ margin: '10px 0 6px' }}>{t.title}</h4>
              <p style={{ color: 'var(--muted)', fontSize: 13, margin: '0 0 10px' }}>{t.desc}</p>
              <span style={{ color: 'var(--gold)', fontSize: 12, fontWeight: 600 }}>{t.value}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 30 }}>
          <div className="glass" style={{ padding: 24 }}>
            <h3 style={{ marginTop: 0, color: 'var(--gold)' }}>💡 Tip of the day</h3>
            <p style={{ color: 'var(--muted)' }}>{tip ? `${tip.tip}` : 'Loading…'}</p>
          </div>
          <div className="glass" style={{ padding: 24 }}>
            <h3 style={{ marginTop: 0, color: 'var(--gold)' }}>🎁 Special offer</h3>
            <p style={{ color: 'var(--muted)' }}>{offer ? `${offer.title} — ${offer.desc}` : 'Loading…'}</p>
          </div>
        </div>

        <div className="glass" style={{ padding: 24, marginTop: 22 }}>
          <h3 style={{ marginTop: 0, color: 'var(--gold)' }}>Daily Tips Library</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {DAILY_TIPS.map((d, i) => (
              <div key={i} style={{ padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--line)' }}>
                <span style={{ fontSize: 18 }}>{d.icon}</span> <b style={{ fontSize: 13 }}>{d.category}</b>
                <p style={{ color: 'var(--muted)', fontSize: 13, margin: '6px 0 0' }}>{d.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

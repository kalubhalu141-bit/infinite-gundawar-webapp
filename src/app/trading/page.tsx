'use client'

import { useMemo, useState } from 'react'
import { TRADING_PATTERNS } from '@/lib/trading-patterns-data'
import { TRADING_TIPS } from '@/lib/trading-tips-data'

export default function TradingPage() {
  const [tab, setTab] = useState<'patterns' | 'tips'>('patterns')
  const [risk, setRisk] = useState('All')

  const patterns = useMemo(
    () => (risk === 'All' ? TRADING_PATTERNS : TRADING_PATTERNS.filter((p) => p.reliability === risk)),
    [risk],
  )

  return (
    <section className="section-pad">
      <div className="container-x">
        <div className="eyebrow">From the Archive</div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', margin: '12px 0 6px' }}>
          Trading <span className="gold-text">Patterns &amp; Tips</span>
        </h1>
        <p style={{ color: 'var(--muted)', maxWidth: 720, fontSize: 18 }}>
          {TRADING_PATTERNS.length} chart patterns and {TRADING_TIPS.length} professional tips — imported from the
          Infinite Gundawar content archive.
        </p>

        <div style={{ display: 'flex', gap: 10, marginTop: 22, flexWrap: 'wrap' }}>
          <button className="btn-ghost" onClick={() => setTab('patterns')} style={tabBtn(tab === 'patterns')}>Patterns</button>
          <button className="btn-ghost" onClick={() => setTab('tips')} style={tabBtn(tab === 'tips')}>Tips</button>
        </div>

        {tab === 'patterns' && (
          <>
            <div style={{ display: 'flex', gap: 8, margin: '16px 0 4px', flexWrap: 'wrap' }}>
              {['All', 'High', 'Medium', 'Low'].map((r) => (
                <button key={r} onClick={() => setRisk(r)} className="btn-ghost" style={{ padding: '6px 14px', fontSize: 13, borderColor: risk === r ? 'var(--gold)' : 'var(--line)' }}>{r}</button>
              ))}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 12 }}>{patterns.length} patterns</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {patterns.map((p) => (
                <div key={p.id} className="glass" style={{ padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 style={{ margin: 0, fontSize: 16 }}>{p.name}</h4>
                    <span style={{ fontSize: 12, color: p.bias === 'Bullish' ? '#34d399' : p.bias === 'Bearish' ? '#ff8080' : 'var(--accent)' }}>{p.bias}</span>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: 13, margin: '8px 0' }}>{p.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)' }}>
                    <span>Reliability: {p.reliability}</span>
                    <span style={{ color: 'var(--gold)' }}>Success: {p.successRate}%</span>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: 12, margin: '8px 0 0' }}><b style={{ color: 'var(--text)' }}>Trade:</b> {p.howToTrade}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'tips' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginTop: 18 }}>
            {TRADING_TIPS.map((t) => (
              <div key={t.id} className="glass" style={{ padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 22 }}>{t.icon}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>{t.difficulty}</span>
                </div>
                <h4 style={{ margin: '8px 0 6px', fontSize: 16 }}>{t.title}</h4>
                <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0 }}>{t.content}</p>
                <p style={{ color: 'var(--gold)', fontSize: 12, margin: '8px 0 0' }}>💡 {t.proTip}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function tabBtn(active: boolean): React.CSSProperties {
  return { padding: '8px 18px', background: active ? 'linear-gradient(90deg,var(--gold),var(--gold-2))' : 'transparent', color: active ? '#1a1205' : 'var(--text)', borderColor: active ? 'transparent' : 'var(--line)' }
}

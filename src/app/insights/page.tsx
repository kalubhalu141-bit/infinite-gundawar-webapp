'use client'

import { useEffect, useState } from 'react'

interface Edu { id: string; field: string; role: string; country: string; avgSalaryUSD: number; demand: string; topUnis: string; remote: boolean }
interface Strat { id: string; name: string; expectedRoi: number; horizon: string; risk: string; minInvest: number; tagline: string; updated: string }
interface Calc { id: string; name: string; category: string; city: string; estimatedResult: number; popularity: number; free: boolean }

export default function InsightsPage() {
  const [edu, setEdu] = useState<Edu[]>([])
  const [strat, setStrat] = useState<Strat[]>([])
  const [calc, setCalc] = useState<Calc[]>([])
  const [tab, setTab] = useState<'careers' | 'invest' | 'finance'>('careers')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const [a, b, c] = await Promise.all([
          fetch('/api/education').then((r) => r.json()),
          fetch('/api/investments').then((r) => r.json()),
          fetch('/api/finance').then((r) => r.json()),
        ])
        if (!alive) return
        setEdu(a.data ?? [])
        setStrat(b.data ?? [])
        setCalc(c.data ?? [])
      } catch (e) {
        // leave empty
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [])

  const TABS: { id: typeof tab; label: string; count: number }[] = [
    { id: 'careers', label: `Careers (${edu.length})`, count: edu.length },
    { id: 'invest', label: `Investments (${strat.length})`, count: strat.length },
    { id: 'finance', label: `Calculators (${calc.length})`, count: calc.length },
  ]

  return (
    <section className="section-pad">
      <div className="container-x">
        <div className="eyebrow">Real Data</div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', margin: '12px 0 10px' }}>
          Insights from <span className="gold-text">live datasets</span>
        </h1>
        <p style={{ color: 'var(--muted)', maxWidth: 720, fontSize: 18 }}>
          Real records carried over from the Infinite Gundawar content archive — global careers, investment
          strategies and free finance calculators. Counts shown are the actual record counts.
        </p>

        <div style={{ display: 'flex', gap: 10, marginTop: 28, flexWrap: 'wrap' }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="btn-ghost"
              style={{
                padding: '8px 18px',
                background: tab === t.id ? 'linear-gradient(90deg,var(--gold),var(--gold-2))' : 'transparent',
                color: tab === t.id ? '#1a1205' : 'var(--text)',
                borderColor: tab === t.id ? 'transparent' : 'var(--line)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading && <p style={{ color: 'var(--muted)', marginTop: 24 }}>Loading real data…</p>}

        {!loading && tab === 'careers' && (
          <Grid>
            {edu.slice(0, 60).map((r) => (
              <Card key={r.id}>
                <div className="eyebrow" style={{ fontSize: 11 }}>{r.field}</div>
                <h4 style={{ margin: '6px 0' }}>{r.role}</h4>
                <p style={{ color: 'var(--muted)', fontSize: 13, margin: '4px 0' }}>{r.country} · {r.topUnis}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 13 }}>
                  <span style={{ color: 'var(--gold)' }}>${r.avgSalaryUSD.toLocaleString()}</span>
                  <span style={{ color: 'var(--accent)' }}>{r.demand}{r.remote ? ' · remote' : ''}</span>
                </div>
              </Card>
            ))}
          </Grid>
        )}

        {!loading && tab === 'invest' && (
          <Grid>
            {strat.slice(0, 60).map((r) => (
              <Card key={r.id}>
                <h4 style={{ margin: '0 0 6px' }}>{r.name}</h4>
                <p style={{ color: 'var(--muted)', fontSize: 13, margin: '4px 0' }}>{r.horizon} · {r.risk} risk</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 13 }}>
                  <span style={{ color: 'var(--gold)' }}>ROI {r.expectedRoi}%</span>
                  <span style={{ color: 'var(--accent)' }}>min ₹{r.minInvest.toLocaleString()}</span>
                </div>
                <p style={{ color: 'var(--muted)', fontSize: 12, margin: '8px 0 0' }}>{r.tagline}</p>
              </Card>
            ))}
          </Grid>
        )}

        {!loading && tab === 'finance' && (
          <Grid>
            {calc.slice(0, 80).map((r) => (
              <Card key={r.id}>
                <h4 style={{ margin: '0 0 6px' }}>{r.name}</h4>
                <p style={{ color: 'var(--muted)', fontSize: 13, margin: '4px 0' }}>{r.category} · {r.city}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 13 }}>
                  <span style={{ color: 'var(--gold)' }}>₹{r.estimatedResult.toLocaleString()}</span>
                  <span style={{ color: 'var(--accent)' }}>🔥 {r.popularity.toLocaleString()}</span>
                </div>
              </Card>
            ))}
          </Grid>
        )}
      </div>
    </section>
  )
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 16,
        marginTop: 28,
      }}
    >
      {children}
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="glass" style={{ padding: 18 }}>{children}</div>
}

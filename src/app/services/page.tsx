import Link from 'next/link'
import { SERVICES } from '@/lib/company'

export const metadata = {
  title: 'Services — Infinite Gundawar',
  description: 'Infrastructure & Real Estate, Import/Export Trading, Coaching & Education, and Digital Marketing services.',
}

export default function ServicesPage() {
  return (
    <section className="section-pad">
      <div className="container-x">
        <div className="eyebrow">What We Do</div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', margin: '12px 0 10px' }}>
          Four verticals, <span className="gold-text">one ecosystem</span>
        </h1>
        <p style={{ color: 'var(--muted)', maxWidth: 720, fontSize: 18 }}>
          Infinite Gundawar operates across the full value chain — from building physical infrastructure to
          opening global trade routes, upskilling talent and amplifying brands digitally.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginTop: 40 }}>
          {SERVICES.map((s) => (
            <div
              key={s.id}
              className="glass"
              style={{ padding: 30, borderTop: `3px solid ${s.color}` }}
            >
              <h3 style={{ marginTop: 0, fontSize: 24 }}>{s.title}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                {s.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: 13,
                      padding: '6px 12px',
                      borderRadius: 999,
                      border: '1px solid var(--line)',
                      color: 'var(--muted)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="glass" style={{ padding: 40, marginTop: 30, textAlign: 'center', background: 'linear-gradient(120deg, rgba(56,189,248,0.08), rgba(255,179,71,0.08))' }}>
          <h3 style={{ marginTop: 0 }}>Have a project in mind?</h3>
          <p style={{ color: 'var(--muted)' }}>Tell us which vertical fits — we’ll connect you with the right team.</p>
          <Link href="/contact" className="btn-primary">Start a conversation →</Link>
        </div>
      </div>
    </section>
  )
}

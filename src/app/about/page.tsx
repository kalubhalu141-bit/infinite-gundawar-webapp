import Link from 'next/link'
import { COMPANY, TIMELINE, STATS } from '@/lib/company'

export const metadata = {
  title: 'About — Infinite Gundawar',
  description: 'Company overview, vision, mission and leadership of Infinite Gundawar Business Private Limited.',
}

export default function AboutPage() {
  return (
    <section className="section-pad">
      <div className="container-x">
        <div className="eyebrow">About Us</div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', margin: '12px 0 10px' }}>
          A corporate group rooted in <span className="gold-text">Maharashtra</span>
        </h1>
        <p style={{ color: 'var(--muted)', maxWidth: 720, fontSize: 18, lineHeight: 1.65 }}>
          {COMPANY.name} is a diversified business group headquartered in {COMPANY.location}. Registered with
          {COMPANY.shareCapital}, the company operates four aligned verticals that together form a single
          growth ecosystem for partners, communities and clients.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, margin: '40px 0' }}>
          {STATS.map((s) => (
            <div key={s.label} className="glass" style={{ padding: 22, textAlign: 'center' }}>
              <div className="gold-text" style={{ fontSize: 30, fontWeight: 800 }}>{s.value}</div>
              <div style={{ color: 'var(--muted)', marginTop: 6, fontSize: 14 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginTop: 10 }}>
          <div className="glass" style={{ padding: 30 }}>
            <h3 style={{ marginTop: 0, color: 'var(--gold)' }}>Vision</h3>
            <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>{COMPANY.vision}</p>
          </div>
          <div className="glass" style={{ padding: 30 }}>
            <h3 style={{ marginTop: 0, color: 'var(--gold)' }}>Mission</h3>
            <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>{COMPANY.mission}</p>
          </div>
        </div>

        <div className="glass" style={{ padding: 30, marginTop: 22 }}>
          <h3 style={{ marginTop: 0, color: 'var(--gold)' }}>Leadership</h3>
          <p style={{ color: 'var(--text)', fontSize: 17 }}>
            <b>{COMPANY.director}</b> — Director, {COMPANY.name}
          </p>
          <p style={{ color: 'var(--muted)' }}>Gadchiroli, Maharashtra, India</p>
        </div>

        <div style={{ marginTop: 34 }}>
          <div className="eyebrow">Our Story</div>
          <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
            {TIMELINE.map((t) => (
              <div key={t.year} className="glass" style={{ padding: 22, borderLeft: '3px solid var(--gold)' }}>
                <div className="gold-text" style={{ fontWeight: 700 }}>{t.year}</div>
                <p style={{ color: 'var(--muted)', margin: '6px 0 0' }}>{t.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 36 }}>
          <Link href="/services" className="btn-primary">See our services →</Link>
        </div>
      </div>
    </section>
  )
}

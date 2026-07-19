'use client'

import { useState } from 'react'
import { COMPANY } from '@/lib/company'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', vertical: 'Infrastructure', message: '' })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    // Frontend-only: Netlify/Formspree-style handler placeholder.
    setSent(true)
  }

  return (
    <section className="section-pad">
      <div className="container-x" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, alignItems: 'start' }}>
        <div>
          <div className="eyebrow">Contact Us</div>
          <h1 style={{ fontSize: 'clamp(30px,5vw,52px)', margin: '12px 0 10px' }}>
            Let’s build <span className="gold-text">together</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 17, lineHeight: 1.65 }}>
            Reach {COMPANY.short} for infrastructure, trade, education or digital marketing partnerships.
          </p>

          <div style={{ marginTop: 24, display: 'grid', gap: 14 }}>
            <div className="glass" style={{ padding: 18 }}>
              <div className="eyebrow" style={{ fontSize: 11 }}>Head Office</div>
              <p style={{ margin: '6px 0 0', color: 'var(--text)' }}>{COMPANY.location}</p>
            </div>
            <div className="glass" style={{ padding: 18 }}>
              <div className="eyebrow" style={{ fontSize: 11 }}>Email</div>
              <p style={{ margin: '6px 0 0', color: 'var(--text)' }}>contact@infinitegundawar.com</p>
            </div>
            <div className="glass" style={{ padding: 18 }}>
              <div className="eyebrow" style={{ fontSize: 11 }}>Director</div>
              <p style={{ margin: '6px 0 0', color: 'var(--text)' }}>{COMPANY.director}</p>
            </div>
          </div>

          {/* Google Maps embed (public, no key) */}
          <iframe
            title="Gadchiroli, Maharashtra"
            src="https://www.google.com/maps?q=Gadchiroli,Maharashtra,India&output=embed"
            style={{ width: '100%', height: 220, border: '1px solid var(--line)', borderRadius: 14, marginTop: 18 }}
            loading="lazy"
          />
        </div>

        <div className="glass" style={{ padding: 28 }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <div style={{ fontSize: 40 }}>✅</div>
              <h3 style={{ marginTop: 10 }}>Message ready</h3>
              <p style={{ color: 'var(--muted)' }}>
                Thanks, {form.name || 'there'}! This demo form is frontend-only — wire it to Formspree/email to deliver.
              </p>
              <button className="btn-ghost" onClick={() => setSent(false)}>Send another</button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <label style={lbl}>Name</label>
              <input required style={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />

              <label style={lbl}>Email</label>
              <input required type="email" style={inp} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />

              <label style={lbl}>Vertical</label>
              <select style={inp} value={form.vertical} onChange={(e) => setForm({ ...form, vertical: e.target.value })}>
                <option>Infrastructure</option>
                <option>Import/Export Trade</option>
                <option>Coaching & Education</option>
                <option>Digital Marketing</option>
              </select>

              <label style={lbl}>Message</label>
              <textarea required rows={4} style={{ ...inp, resize: 'vertical' }} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" />

              <button className="btn-primary" type="submit" style={{ marginTop: 8 }}>Send message →</button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

const lbl: React.CSSProperties = { display: 'block', color: 'var(--muted)', fontSize: 13, margin: '14px 0 6px' }
const inp: React.CSSProperties = {
  width: '100%',
  padding: '11px 13px',
  borderRadius: 10,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid var(--line)',
  color: 'var(--text)',
  fontSize: 15,
  outline: 'none',
  fontFamily: 'inherit',
}

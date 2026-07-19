import { COMPANY } from '@/lib/company'

export const metadata = {
  title: 'Portfolio — Infinite Gundawar',
  description: 'Showcase of infrastructure, trade, education and digital projects by Infinite Gundawar.',
}

const PROJECTS = [
  {
    title: 'Infrastructure & Real Estate',
    sub: 'Builders · Promoters · Town Planners',
    body: 'End-to-end development — from surveying and planning to construction and property services across Maharashtra.',
    img: '/252.png',
  },
  {
    title: 'Import / Export Trade',
    sub: 'Electronics · Agri · Lifestyle',
    body: 'Connecting verified Indian suppliers with global buyers across consumer goods, electronics, industrial and lifestyle categories.',
    img: '/251.jpeg',
  },
  {
    title: 'Coaching & Education',
    sub: 'Skills · Certification · Exams',
    body: 'Coaching classes, skill-development programs and professional certification pathways for Maharashtra’s youth.',
    img: '/logo-full.png',
  },
  {
    title: 'Digital Marketing',
    sub: 'Campaigns · Branding · Analytics',
    body: 'Data-driven campaigns and branding that put partner businesses in front of the right audience.',
    img: '/252.png',
  },
]

export default function PortfolioPage() {
  return (
    <section className="section-pad">
      <div className="container-x">
        <div className="eyebrow">Portfolio</div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', margin: '12px 0 10px' }}>
          Work across our <span className="gold-text">four pillars</span>
        </h1>
        <p style={{ color: 'var(--muted)', maxWidth: 700, fontSize: 18 }}>
          A snapshot of the domains {COMPANY.short} operates in. Each vertical is a live, growing practice.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginTop: 40 }}>
          {PROJECTS.map((p) => (
            <div key={p.title} className="glass" style={{ overflow: 'hidden' }}>
              <div style={{ height: 200, background: '#0b1120', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.img}
                  alt={p.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.92 }}
                />
              </div>
              <div style={{ padding: 24 }}>
                <div className="eyebrow" style={{ fontSize: 11 }}>{p.sub}</div>
                <h3 style={{ margin: '8px 0 10px', fontSize: 22 }}>{p.title}</h3>
                <p style={{ color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

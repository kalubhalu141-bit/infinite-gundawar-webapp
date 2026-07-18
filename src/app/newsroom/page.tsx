'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import PageEnhancements from '@/components/PageEnhancements'
import Footer from '@/components/Footer'
import AnimatedSection from '@/components/AnimatedSection'

/* ───────────────────────────────────────────────────────────────────────────
   NEWSROOM — press releases & company announcements.
   Content is structured from the company's verified profile & milestones.
   No fabricated quotes, statistics, or third-party endorsements.
   ─────────────────────────────────────────────────────────────────────────── */

type PR = {
  date: string
  tag: string
  title: string
  body: string
  milestone?: boolean
}

const PRESS: PR[] = [
  {
    date: '2026-06-15',
    tag: 'Product',
    title: 'Infinite Gundawar launches Infinite AI — a free, on-device AI suite',
    body:
      'Infinite Gundawar Business Private Limited introduced the Infinite AI suite: 14+ AI tools (sentiment, translation, semantic search, summarization, voice) that run entirely in the user\'s browser via WebGPU/WASM. No API keys, no cost, and client data never leaves the device. The suite searches the company\'s own real datasets — 320+ Ayurvedic herbs, 73+ trading patterns, and a disease database.',
    milestone: true,
  },
  {
    date: '2026-03-10',
    tag: 'AI & Innovation',
    title: 'Company opens an AI & Innovation Lab across its service verticals',
    body:
      'Building on its multi-service model, Infinite Gundawar added an AI & Innovation function to bring free on-device tooling to infrastructure, trade, wellness, finance and education clients. The lab ships practical tools rather than demos, with a privacy-first architecture.',
  },
  {
    date: '2025-11-02',
    tag: 'Wellness',
    title: 'Ayurveda & wellness division expands its digital herb knowledge base',
    body:
      'The Ayurveda division indexed 320+ real herbs with benefits, dosage and precautions, making the collection searchable by meaning through the on-device semantic engine. The data is sourced from public Ayurvedic references and is provided for informational purposes only.',
  },
  {
    date: '2025-08-20',
    tag: 'Trade',
    title: 'Import/Export trading network reaches 15+ countries',
    body:
      'Infinite Gundawar\'s trading division extended its buyer and supplier network across 15+ countries spanning consumer goods, electronics, industrial products, agricultural commodities, technology and fashion, supported by in-house logistics and trade-finance documentation.',
  },
  {
    date: '2025-05-18',
    tag: 'Education',
    title: 'Education & coaching vertical adds digital skills programs',
    body:
      'The education division launched practical coaching in competitive-exam preparation, digital marketing, web development, trading and Ayurveda studies, with a focus on employable skills and certification.',
  },
  {
    date: '2024-09-30',
    tag: 'Infrastructure',
    title: 'Real estate & infrastructure division delivers RERA-compliant projects',
    body:
      'The infrastructure and real estate division continued delivery of residential and commercial projects, townships and BOT contracts across Maharashtra, registered under the Maharashtra Real Estate Regulatory Authority (RERA) and compliant with GST and the Companies Act, 2013.',
  },
  {
    date: '2023-04-12',
    tag: 'Company',
    title: 'Infinite Gundawar Business Private Limited incorporated in Maharashtra',
    body:
      'The company was incorporated under the Companies Act, 2013, with a mandate to operate as an integrated multi-service group spanning infrastructure, real estate, import/export trading, Ayurveda & wellness, finance & trading education, education/coaching, interior design, digital marketing and AI tools.',
    milestone: true,
  },
]

const TAGS = ['All', ...Array.from(new Set(PRESS.map(p => p.tag)))]

export default function NewsroomPage() {
  const [tag, setTag] = useState('All')
  const filtered = PRESS.filter(p => tag === 'All' || p.tag === tag)
  const latest = PRESS[0]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PageEnhancements />
      <section className="bg-gradient-to-br from-[#0f172a] to-[#1e3a5f] text-white py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="inline-block px-4 py-2 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-cyan-300 text-sm font-medium mb-5">📰 Newsroom</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Press & Company Announcements</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Milestones, product launches and updates from across the Infinite Gundawar group.</p>
        </div>
      </section>

      {/* Featured / latest */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <AnimatedSection>
          <div className="rounded-3xl bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] text-white p-8 sm:p-10">
            <div className="text-xs uppercase tracking-widest text-cyan-300 mb-2">Latest · {latest.date}</div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">{latest.title}</h2>
            <p className="text-white/80 leading-relaxed">{latest.body}</p>
          </div>
        </AnimatedSection>
      </section>

      {/* Filters */}
      <section className="max-w-5xl mx-auto px-4 pb-4 flex flex-wrap gap-2">
        {TAGS.map(t => (
          <button key={t} onClick={() => setTag(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${tag === t ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {t}
          </button>
        ))}
      </section>

      {/* List */}
      <section className="max-w-5xl mx-auto px-4 pb-20 grid gap-4">
        {filtered.map((p, i) => (
          <AnimatedSection key={p.title} delay={i * 60}>
            <article className="rounded-2xl border border-gray-100 p-6 hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#d4a843]/15 text-[#a07c1f]">{p.tag}</span>
                <span className="text-xs text-gray-400">{p.date}</span>
                {p.milestone && <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">★ Milestone</span>}
              </div>
              <h3 className="text-lg font-bold text-[#0f172a] mb-2">{p.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{p.body}</p>
            </article>
          </AnimatedSection>
        ))}
      </section>

      {/* Media contact */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h3 className="text-xl font-bold text-[#0f172a] mb-2">Media & Partnership Inquiries</h3>
          <p className="text-gray-600 text-sm mb-4">For press, partnership or speaking requests, reach the Infinite Gundawar team.</p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <a href="mailto:talenthebhai123@gmail.com" className="px-4 py-2 bg-[#1e3a5f] text-white rounded-xl">✉️ talenthebhai123@gmail.com</a>
            <a href="tel:+917972140672" className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[#1e3a5f] font-medium">📞 +91 79721 40672</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

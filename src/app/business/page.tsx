'use client'
import GoalModeFeatures from '@/components/GoalModeFeatures'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import PageEnhancements from '@/components/PageEnhancements'
import Footer from '@/components/Footer'
import PageHead from '@/components/PageHead'


const BUSINESS_SECTIONS = [
  {
    title: '🏢 Start Your Business in India',
    items: [
      { name: 'Sole Proprietorship', desc: 'Simplest. No registration needed. Use PAN. Good for freelancers, small shops.', cost: '₹0-5,000', time: '1 day' },
      { name: 'Partnership Firm', desc: '2+ partners. Register with Registrar of Firms. Partnership deed required.', cost: '₹5,000-15,000', time: '7-15 days' },
      { name: 'LLP (Limited Liability Partnership)', desc: 'Best for professionals. Limited liability. Register at mca.gov.in.', cost: '₹5,000-10,000', time: '10-15 days' },
      { name: 'Private Limited Company', desc: 'Best for startups seeking investment. 2 directors min. MCA registration.', cost: '₹8,000-15,000', time: '15-20 days' },
      { name: 'One Person Company (OPC)', desc: 'Single director company. Limited liability. Good for solo founders.', cost: '₹7,000-12,000', time: '10-15 days' },
      { name: 'Startup India Registration', desc: 'Get DPIIT recognition. Tax benefits, easier compliance. Free at startupindia.gov.in.', cost: 'Free', time: '1 day' },
    ]
  },
  {
    title: '📋 Essential Registrations & Licenses',
    items: [
      { name: 'GST Registration', desc: 'Mandatory if turnover >₹20 lakh (₹10 lakh for NE states). Online at gst.gov.in.', cost: 'Free', time: '7-15 days' },
      { name: 'MSME/Udyam Registration', desc: 'Free. Get priority lending, tax benefits, tender preferences. udyamregistration.gov.in.', cost: 'Free', time: '1 day' },
      { name: 'FSSAI License', desc: 'Mandatory for food business. Basic (turnover <₹12L), State (₹12L-₹20Cr), Central (>₹20Cr).', cost: '₹100-7,500/year', time: '30-60 days' },
      { name: 'Shop & Establishment Act', desc: 'State-level registration. Required for all businesses with employees.', cost: '₹500-5,000', time: '7-15 days' },
      { name: 'Professional Tax', desc: 'State-level tax on income. Applicable in Maharashtra, Karnataka, WB, etc.', cost: '₹2,500/year max', time: '7 days' },
      { name: 'IEC (Import Export Code)', desc: 'Required for import/export. Apply at dgft.gov.in. Linked to PAN.', cost: '₹500', time: '7-10 days' },
      { name: 'Trade License', desc: 'Municipal corporation license for trading businesses. State-specific process.', cost: '₹2,000-25,000', time: '15-30 days' },
    ]
  },
  {
    title: '📣 Free Marketing Strategies',
    items: [
      { name: 'Google My Business', desc: 'Free listing on Google Maps. Essential for local businesses. Add photos, reviews, posts.', cost: 'Free' },
      { name: 'WhatsApp Business', desc: 'Free app. Catalog, auto-replies, labels. Best for Indian small businesses.', cost: 'Free' },
      { name: 'Instagram Reels', desc: 'Short videos get 10x reach. Post daily. Use trending audio. Show your work.', cost: 'Free' },
      { name: 'SEO (Google Ranking)', desc: 'Write blog posts. Use keywords. Get backlinks. Long-term free traffic.', cost: 'Free' },
      { name: 'Email Marketing', desc: 'Collect customer emails. Send offers, updates. Use free Mailchimp (500 contacts).', cost: 'Free' },
      { name: 'YouTube Channel', desc: 'How-to videos, customer testimonials, behind-the-scenes. Builds trust.', cost: 'Free' },
      { name: 'Referral Program', desc: 'Offer discount for referrals. Cheapest customer acquisition. Word of mouth.', cost: 'Free' },
      { name: 'Facebook/Instagram Ads', desc: 'Start with ₹200/day. Target by location, age, interests. Scale what works.', cost: '₹6,000/month min' },
    ]
  },
  {
    title: '💰 Government Schemes for Business',
    items: [
      { name: 'MUDRA Loan', desc: 'Loans up to ₹10 lakh for small businesses. No collateral. Apply at any bank.', scheme: 'Pradhan Mantri MUDRA Yojana' },
      { name: 'Stand-Up India', desc: '₹10 lakh to ₹1 crore for SC/ST/women entrepreneurs. 75% of project cost.', scheme: 'Stand-Up India Scheme' },
      { name: 'CGTMSE', desc: 'Collateral-free loans up to ₹5 crore for MSMEs. Credit guarantee by govt.', scheme: 'Credit Guarantee Scheme' },
      { name: 'PMKVY (Skill Training)', desc: 'Free skill training + certification. For youth 15-45 years.', scheme: 'Pradhan Mantri Kaushal Vikas Yojana' },
      { name: 'ASPIRE', desc: 'Incubation support for rural and innovative startups. Up to ₹10 lakh grant.', scheme: 'ASPIRE Scheme' },
      { name: 'Digital India', desc: 'Free digital infrastructure, UPI, e-gov services for businesses.', scheme: 'Digital India Programme' },
    ]
  },
]

const BUSINESS_TOOLS = [
  { name: 'Invoice Generator', desc: 'Create GST-compliant invoices. Free at Zoho Invoice, Refrens.', icon: '🧾' },
  { name: 'GST Filing', desc: 'File GST returns. Free at ClearTax, Zoho Books.', icon: '📋' },
  { name: 'Accounting', desc: 'Free: Zoho Books (₹0 for turnover <₹50L), Wave, GnuCash.', icon: '📊' },
  { name: 'Payroll', desc: 'Free: Zoho Payroll, GreytHR for small teams.', icon: '💸' },
  { name: 'Project Management', desc: 'Free: Trello, Asana, Notion, Clickup.', icon: '📌' },
  { name: 'CRM', desc: 'Free: HubSpot CRM (unlimited), Zoho CRM (3 users).', icon: '🤝' },
  { name: 'Design', desc: 'Free: Canva, Figma (3 files), Photopea (Photoshop alternative).', icon: '🎨' },
  { name: 'Website Builder', desc: 'Free: Carrd, Google Sites, WordPress.com.', icon: '🌐' },
]

/* ─── Infinite Tools Catalog + Free Mentorship ─── */
function InfiniteTools() {
  const [data, setData] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [cats, setCats] = useState<string[]>([])
  const [cat, setCat] = useState('')
  useEffect(() => {
    fetch('/api/business-tools?limit=60').then(r => r.json()).then(d => { if (d.ok) { setData(d.results); setTotal(d.total); setCats(d.categories) } }).catch(() => {})
  }, [])
  useEffect(() => {
    fetch(`/api/business-tools?${cat ? `category=${cat}&` : ''}limit=60`).then(r => r.json()).then(d => { if (d.ok) setData(d.results) }).catch(() => {})
  }, [cat])
  return (
    <section className="py-16 bg-gradient-to-br from-[#0f172a] to-[#1e3a5f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">🛠️ Infinite Business Tools — Free Forever</h2>
          <p className="text-blue-200 text-sm mt-1">{total} tools · every tool free · book a free mentorship call</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button onClick={() => setCat('')} className={`px-4 py-2 rounded-full text-sm font-medium ${!cat ? 'bg-emerald-500 text-white' : 'bg-white/10 text-blue-100'}`}>All</button>
          {cats.map(c => <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-full text-sm font-medium ${cat === c ? 'bg-emerald-500 text-white' : 'bg-white/10 text-blue-100'}`}>{c}</button>)}
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.map(t => (
            <div key={t.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-emerald-400/40 transition-colors">
              <div className="flex items-center justify-between mb-2"><span className="text-2xl">{t.icon}</span>{t.mentorship && <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-full">Mentorship</span>}</div>
              <h3 className="font-bold text-white text-sm">{t.name}</h3>
              <p className="text-blue-200 text-xs mt-1 mb-3">{t.category}</p>
              {t.mentorship
                ? <a href={t.callBooking} className="inline-block w-full text-center py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold">📞 Free Call</a>
                : <span className="inline-block w-full text-center py-2 bg-white/10 text-blue-100 rounded-xl text-xs font-semibold">Free to use</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function BusinessPage() {
  return (
    <>
      <PageHead
        title="Business Hub — Start Business India, GST, MSME, Marketing, Government Schemes"
        description="Complete business guide for India: Company registration (Pvt Ltd, LLP, OPC), GST registration, MSME/Udyam, FSSAI, IEC. Free marketing strategies, government schemes (MUDRA, Stand-Up India), free business tools."
        keywords={[
          'start business India', 'company registration India', 'GST registration',
          'MSME registration', 'Udyam registration', 'FSSAI license',
          'import export code IEC', 'MUDRA loan', 'Stand Up India scheme',
          'free marketing strategies', 'small business ideas India',
          'startup India registration', 'business plan template',
          'free business tools India', 'government schemes for business',
        ]}
        canonical="/business"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Business Hub — Start & Grow Business in India',
          url: 'https://infinite-gundawar-webapp.vercel.app/business',
        }}
      />
      <Navbar />
      <PageEnhancements />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50/30 to-zinc-50/30">

        {/* Cinematic Video Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        </div>


        {/* Cartoon Video Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        </div>

        {/* Hero */}
        <section className="py-20 bg-gradient-to-r from-slate-800 to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"><div className="absolute top-10 right-10 w-64 h-64 bg-amber-400 rounded-full blur-3xl"/></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <span className="inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-full text-amber-200 text-sm font-medium mb-4">Complete Business Toolkit — Free Resources</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              <span className="text-amber-400">Business</span> Hub — Start & Grow
            </h1>
            <p className="text-lg text-gray-300/80 max-w-2xl mx-auto">
              Company registration, GST, licenses, marketing strategies, government schemes, free tools — everything to start and grow your business in India.
            </p>
          </div>
        </section>

        {/* Business Sections */}
        {BUSINESS_SECTIONS.map(section => (
          <section key={section.title} className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-6">{section.title}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.items.map(item => (
                  <div key={item.name} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-[#0f172a] mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.desc}</p>
                    <div className="flex gap-3 text-xs">
                      {'cost' in item && <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full font-medium">💰 {item.cost}</span>}
                      {'time' in item && <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">⏱️ {item.time}</span>}
                      {'scheme' in item && <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-full font-medium">🏛️ {item.scheme}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Free Tools */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#0f172a] mb-6 text-center">🛠️ Free Business Tools</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {BUSINESS_TOOLS.map(tool => (
                <div key={tool.name} className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                  <div className="text-2xl mb-2">{tool.icon}</div>
                  <h3 className="font-bold text-sm text-[#0f172a] mb-1">{tool.name}</h3>
                  <p className="text-xs text-gray-500">{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Infinite Tools Catalog + Free Mentorship ─── */}
        <InfiniteTools />
      </main>
      <Footer />
    <GoalModeFeatures page="business" />
    </>
  )
}
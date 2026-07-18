'use client'
import GoalModeFeatures from '@/components/GoalModeFeatures'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import PageEnhancements from '@/components/PageEnhancements'
import Footer from '@/components/Footer'
import PageHead from '@/components/PageHead'


const EDUCATION_SECTIONS = [
  {
    title: '📚 Free Online Learning Platforms',
    items: [
      { name: 'NPTEL (IIT/IISC)', desc: 'Free courses from IITs. Get certificates. Best for engineering, science, management.', url: 'nptel.ac.in' },
      { name: 'SWAYAM (Govt of India)', desc: 'Free courses from Class 9 to Post-Graduation. UGC recognized certificates.', url: 'swayam.gov.in' },
      { name: 'Khan Academy', desc: 'Free world-class education for anyone. Math, Science, Economics, Computing.', url: 'khanacademy.org' },
      { name: 'Coursera (Financial Aid)', desc: 'Courses from Stanford, Yale, Google. Apply for 100% financial aid.', url: 'coursera.org' },
      { name: 'edX (Audit Free)', desc: 'MIT, Harvard, IIT courses. Free to audit, pay only for certificate.', url: 'edx.org' },
      { name: 'Google Digital Garage', desc: 'Free digital marketing certificate. Google certified. 40 hours.', url: 'learndigital.withgoogle.com' },
      { name: 'Microsoft Learn', desc: 'Free Azure, AI, Data Science courses. Microsoft certified.', url: 'learn.microsoft.com' },
      { name: 'AWS Skill Builder', desc: 'Free cloud computing courses. AWS certification prep.', url: 'skillbuilder.aws' },
    ]
  },
  {
    title: '🎯 Competitive Exam Preparation',
    items: [
      { name: 'UPSC (Civil Services)', desc: 'Free: NCERT books, Yojana magazine, PIB, Rajya Sabha TV. Coaching optional.', resources: 'ncert.nic.in, pib.gov.in' },
      { name: 'SSC CGL/CHSL', desc: 'Free: Previous papers, Oliveboard, Testbook, Adda247 YouTube.', resources: 'ssc.nic.in' },
      { name: 'Banking (IBPS/SBI)', desc: 'Free: Oliveboard mock tests, Adda247, Gradeup YouTube.', resources: 'ibps.in' },
      { name: 'JEE/NEET', desc: 'Free: Physics Wallah, Unacademy free lectures, NCERT.', resources: 'jeemain.nta.nic.in' },
      { name: 'CAT/MBA', desc: 'Free: Cracku, 2IIM YouTube, previous papers.', resources: 'iimcat.ac.in' },
      { name: 'GATE', desc: 'Free: NPTEL, GATE Overflow, previous papers.', url: 'gate.iitsystem.ac.in' },
      { name: 'CDSE/AFCAT/NDA', desc: 'Free: SSB Crack, previous papers, join Telegram groups.', resources: 'upsc.gov.in' },
    ]
  },
  {
    title: '💼 Career Development Skills',
    items: [
      { name: 'Communication Skills', desc: 'Join Toastmasters (₹5000/year). Practice daily. Most important career skill.' },
      { name: 'Excel & Data Analysis', desc: 'Free on YouTube (Leila Gharani, ExcelIsEssential). Learn VLOOKUP, Pivot, Power Query.' },
      { name: 'Python Programming', desc: 'Free: CS50 (Harvard), Automate the Boring Stuff, freeCodeCamp.' },
      { name: 'Digital Marketing', desc: 'Free: Google Digital Garage, HubSpot Academy, Meta Blueprint.' },
      { name: 'AI & ChatGPT Skills', desc: 'Free: OpenAI docs, Prompt Engineering Guide, AI for Everyone (Andrew Ng).' },
      { name: 'English Speaking', desc: 'Free: BBC Learning English, English with Lucy (YouTube), practice with friends.' },
      { name: 'Resume Writing', desc: 'Use our free templates. One page, action verbs, quantify achievements.' },
      { name: 'Interview Skills', desc: 'STAR method for answers. Research company. Practice mock interviews.' },
    ]
  },
  {
    title: '🎓 Scholarships & Financial Aid',
    items: [
      { name: 'National Scholarship Portal', desc: 'Central + State scholarships. Apply at scholarships.gov.in. ₹10,000-₹50,000/year.', url: 'scholarships.gov.in' },
      { name: 'PM Vidyalaxmi', desc: 'Education loan up to ₹7.5 lakh with 3% interest subvention for meritorious students.', url: 'vidyalakshmi.co.in' },
      { name: 'AICTE Pragati (Girls)', desc: '₹50,000/year for girls in technical education. 10,000 scholarships.', url: 'aicte-india.org' },
      { name: 'Central Sector Scheme', desc: '₹20,000/year for college students with family income <₹4.5 lakh.', url: 'scholarships.gov.in' },
      { name: 'Google Scholarships', desc: 'Google Career Certificates with financial aid. ₹500/month on Coursera.', url: 'grow.google' },
    ]
  },
]

const CAREER_PATHS = [
  { field: 'Government Jobs', icon: '🏛️', salary: '₹4-25 LPA', growth: 'Very High Security', exams: 'UPSC, SSC, Banking, Railways, State PSC' },
  { field: 'IT / Software', icon: '💻', salary: '₹3-50+ LPA', growth: 'Very High Demand', exams: 'None — Skills matter' },
  { field: 'Data Science / AI', icon: '🤖', salary: '₹6-60+ LPA', growth: 'Fastest Growing', exams: 'None — Portfolio matters' },
  { field: 'Digital Marketing', icon: '📱', salary: '₹3-20 LPA', growth: 'High Demand', exams: 'Google/Meta certifications' },
  { field: 'Finance / CA / CFA', icon: '💰', salary: '₹6-1 Cr+', growth: 'Very High Pay', exams: 'CA, CFA, MBA Finance' },
  { field: 'Healthcare / Doctor', icon: '⚕️', salary: '₹8-1 Cr+', growth: 'Recession Proof', exams: 'NEET, AIIMS' },
  { field: 'Civil Services (IAS/IPS)', icon: '🎖️', salary: '₹15-30 LPA + perks', growth: 'Highest Prestige', exams: 'UPSC CSE' },
  { field: 'Entrepreneurship', icon: '🚀', salary: 'Unlimited', growth: 'High Risk/Reward', exams: 'None — Execution matters' },
]

/* ─── Worldwide AI Careers & Education (live feed) ─── */
function WorldCareers() {
  const [data, setData] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [field, setField] = useState('')
  const [country, setCountry] = useState('')
  const [fields, setFields] = useState<string[]>([])
  const [countries, setCountries] = useState<string[]>([])
  useEffect(() => {
    fetch('/api/education-careers?limit=30').then(r => r.json()).then(d => { if (d.ok) { setData(d.results); setTotal(d.total); setFields(d.fields); setCountries(d.countries) } }).catch(() => {})
  }, [])
  useEffect(() => {
    const t = setTimeout(() => {
      fetch(`/api/education-careers?${field ? `field=${encodeURIComponent(field)}&` : ''}${country ? `country=${encodeURIComponent(country)}&` : ''}limit=30`).then(r => r.json()).then(d => { if (d.ok) { setData(d.results); setTotal(d.total) } }).catch(() => {})
    }, 250)
    return () => clearTimeout(t)
  }, [field, country])
  return (
    <section className="py-16 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">🌍 AI &amp; Careers Worldwide — Live Feed</h2>
        <p className="text-blue-200 text-center text-sm mb-8">{total} roles across {countries.length} countries · which skill pays where</p>
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <select value={field} onChange={e => setField(e.target.value)} className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white">
            <option value="">All Fields</option>
            {fields.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <select value={country} onChange={e => setCountry(e.target.value)} className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white">
            <option value="">All Countries</option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map(e => (
            <div key={e.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-blue-400/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{e.remote ? '🌐' : '🏢'}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${e.demand === 'Very High' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'}`}>{e.demand}</span>
              </div>
              <h3 className="font-bold text-white text-sm">{e.role}</h3>
              <p className="text-blue-200 text-xs mt-1">{e.field} · {e.country}</p>
              <p className="text-emerald-400 font-bold mt-2">${e.avgSalaryUSD.toLocaleString()} <span className="text-xs text-blue-300 font-normal">avg</span></p>
              <p className="text-blue-200 text-xs mt-1">🎓 {e.topUnis}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function EducationPage() {
  return (
    <>
      <PageHead
        title="Education Hub — Free Courses, Career Guidance, Scholarships, Exam Prep India"
        description="Free education resources: NPTEL, SWAYAM, Khan Academy, Google certificates. Career guidance, competitive exam prep (UPSC, SSC, Banking, JEE), scholarships, resume tips. Best career paths in India 2026."
        keywords={[
          'free online courses India', 'NPTEL courses', 'SWAYAM courses',
          'career guidance India', 'UPSC preparation free', 'SSC exam preparation',
          'scholarships India 2026', 'best career options after 12th',
          'free Google certificate', 'digital marketing course free',
          'resume writing tips', 'interview preparation India',
          'best government jobs India', 'IT career roadmap',
        ]}
        canonical="/education"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'LearningResource',
          name: 'Education & Career Hub India',
          url: 'https://infinite-gundawar-webapp.vercel.app/education',
          educationalLevel: 'All Levels',
          inLanguage: ['en', 'hi'],
        }}
      />
      <Navbar />
      <PageEnhancements />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-violet-50/30">

        {/* Cinematic Video Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        </div>


        {/* Cartoon Video Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        </div>

        {/* Hero */}
        <section className="py-20 bg-gradient-to-r from-blue-800 to-indigo-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"><div className="absolute top-10 right-10 w-64 h-64 bg-blue-400 rounded-full blur-3xl"/></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <span className="inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-full text-blue-200 text-sm font-medium mb-4">100% Free Resources — No Sign-up Required</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              <span className="text-blue-400">Education</span> Hub — Learn & Grow
            </h1>
            <p className="text-lg text-blue-100/80 max-w-2xl mx-auto">
              Free courses from IITs, career guidance, exam prep, scholarships — everything you need to build a successful career in India.
            </p>
          </div>
        </section>

        {/* Career Paths */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#0f172a] mb-8 text-center">🎯 Best Career Paths in India (2026)</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CAREER_PATHS.map(path => (
                <div key={path.field} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                  <div className="text-3xl mb-2">{path.icon}</div>
                  <h3 className="font-bold text-[#0f172a] mb-2">{path.field}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Salary</span><span className="font-semibold text-green-700">{path.salary}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Growth</span><span className="text-xs">{path.growth}</span></div>
                    <p className="text-xs text-gray-500 mt-2">Exams: {path.exams}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education Sections */}
        {EDUCATION_SECTIONS.map(section => (
          <section key={section.title} className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-6">{section.title}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.items.map(item => (
                  <div key={item.name} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-[#0f172a] mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.desc}</p>
                    {'url' in item && item.url && <p className="text-xs text-blue-600 font-medium">🌐 {item.url}</p>}
                    {'resources' in item && item.resources && <p className="text-xs text-blue-600 font-medium">📎 {item.resources}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* ─── Worldwide AI Careers & Education (live feed) ─── */}
        <WorldCareers />
      </main>
      <Footer />
    <GoalModeFeatures page="education" />
    </>
  )
}
'use client'
import GoalModeFeatures from '@/components/GoalModeFeatures'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import PageEnhancements from '@/components/PageEnhancements'
import Footer from '@/components/Footer'
import PageHead from '@/components/PageHead'


const KIT_ITEMS = [
  { icon: '📋', title: 'Business Registration Checklist', desc: 'Step-by-step guide to register your business in India — LLP, Pvt Ltd, Partnership, or Sole Proprietorship' },
  { icon: '💰', title: 'Financial Planning Templates', desc: 'Excel-ready templates for cash flow, P&L, balance sheet, and break-even analysis' },
  { icon: '📈', title: 'Marketing Plan Framework', desc: 'Complete marketing strategy template with budget allocation, channels, and KPIs' },
  { icon: '⚖️', title: 'Legal Compliance Guide', desc: 'GST, MSME, Shop & Establishment, FSSAI — know exactly what licenses you need' },
  { icon: '📧', title: '50+ Cold Email Templates', desc: 'Ready-to-send email templates for B2B outreach, follow-ups, and closing deals' },
  { icon: '🎯', title: 'Sales Pitch Deck Outline', desc: '10-slide pitch deck structure that investors and clients love' },
  { icon: '📱', title: 'Social Media Content Calendar', desc: '30-day content plan for Instagram, LinkedIn, and Facebook' },
  { icon: '🤝', title: 'Vendor & Client Agreement Templates', desc: 'Professional contract templates you can customize for your business' },
  { icon: '🧾', title: 'GST & Tax Planning Guide', desc: 'Understand GST slabs, input tax credit, and save money legally' },
  { icon: '👥', title: 'Hiring & HR Checklist', desc: 'From job posting to onboarding — complete HR process for small businesses' },
]

const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow',
  'Surat', 'Nagpur', 'Indore', 'Bhopal', 'Patna', 'Vadodara', 'Coimbatore', 'Kochi', 'Visakhapatnam', 'Agra',
  'Nashik', 'Rajkot', 'Varanasi', 'Kanpur', 'Ludhiana', 'Madurai', 'Meerut', 'Thane', 'Allahabad', 'Other'
]

/* ─── Everyday Free Stuff (live feed) ─── */
function LiveFreeKit() {
  const [data, setData] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [cats, setCats] = useState<string[]>([])
  const [cat, setCat] = useState('')
  useEffect(() => {
    fetch('/api/free-kit?limit=30').then(r => r.json()).then(d => { if (d.ok) { setData(d.results); setTotal(d.total); setCats(d.categories) } }).catch(() => {})
  }, [])
  useEffect(() => {
    fetch(`/api/free-kit?${cat ? `category=${cat}&` : ''}limit=30`).then(r => r.json()).then(d => { if (d.ok) setData(d.results) }).catch(() => {})
  }, [cat])
  return (
    <section className="px-4 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">🎁 Everyday Free Stuff — New Every Day</h2>
          <p className="text-slate-400 text-sm mt-1">{total} free drops · templates, guides, tools · all ₹0</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button onClick={() => setCat('')} className={`px-4 py-2 rounded-full text-sm font-medium ${!cat ? 'bg-indigo-600 text-white' : 'bg-white/10 text-slate-300'}`}>All</button>
          {cats.map(c => <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-full text-sm font-medium ${cat === c ? 'bg-indigo-600 text-white' : 'bg-white/10 text-slate-300'}`}>{c}</button>)}
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.map(k => (
            <div key={k.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-indigo-400/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs px-2 py-1 rounded-full ${k.tag === 'Free Today' ? 'bg-emerald-500/20 text-emerald-300' : k.tag === 'Expiring Soon' ? 'bg-red-500/20 text-red-300' : 'bg-indigo-500/20 text-indigo-300'}`}>{k.tag}</span>
                <span className="text-xs text-slate-400">{k.day}</span>
              </div>
              <h3 className="font-bold text-white text-sm">{k.title}</h3>
              <p className="text-slate-400 text-xs mt-1 mb-3">{k.category} · value ₹{k.valueINR.toLocaleString('en-IN')} · {k.claimed.toLocaleString()} claimed</p>
              <a href="https://wa.me/917972140672?text=Claim%20free%20kit" className="inline-block w-full text-center py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold">Claim Free</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function FreeBusinessKitPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', city: '', interests: [] as string[], message: '', website: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'verified'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Check for verification redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('verified') === 'true') {
      setStatus('verified')
    }
    if (params.get('error')) {
      setStatus('error')
      const errMap: Record<string, string> = {
        invalid: 'Invalid or expired verification link. Please sign up again.',
        server: 'Server error. Please try again later.',
      }
      setErrorMsg(errMap[params.get('error') || ''] || 'Something went wrong.')
    }
  }, [])

  const validate = () => {
    const errors: Record<string, string> = {}
    if (!formData.name.trim() || formData.name.trim().length < 2) errors.name = 'Please enter your full name'
    if (!formData.email.trim()) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) errors.email = 'Please enter a valid email'
    if (formData.phone && !/^[\d\s+\-()]{7,15}$/.test(formData.phone.trim())) errors.phone = 'Please enter a valid phone number'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', phone: '', company: '', city: '', interests: [], message: '', website: '' })
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please check your connection and try again.')
    }
  }

  const handleDownload = () => {
    window.open('/downloads/business-starter-kit.pdf', '_blank')
  }

  return (
    <>
      <Navbar />
      <PageEnhancements />

        {/* Cinematic Video Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        </div>


        {/* Cartoon Video Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        </div>

      <PageHead
        title="Free Business Starter Kit — Download Templates & Guides"
        description="Download our free Business Starter Kit with 10+ essential templates, checklists, and guides to start your business in India. Includes GST registration guide, company registration, business plan template, marketing templates, invoice templates, and startup checklist."
        keywords={['free business starter kit', 'business templates free download', 'startup checklist India', 'business plan template free', 'GST registration guide', 'company registration India', 'MSME registration', 'marketing templates free', 'invoice template India', 'startup guide India', 'how to start a business in India', 'business ideas India', 'small business tips', 'entrepreneurship guide', 'free business tools', 'business checklist template', 'pitch deck template', 'financial projection template', 'LLP registration India', 'GST filing guide']}
        ogImage="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=630&fit=crop"
        canonical="https://infinite-gundawar-webapp.vercel.app/free-business-kit"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        {/* Hero */}
        <section className="relative pt-28 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-1.5 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-sm font-medium mb-6">
              100% Free — No Credit Card Required
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              The Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Business Starter Kit</span> for Indian Entrepreneurs
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
              10 professional templates, checklists, and guides — everything you need to start, run, and grow your business in India. Join 500+ entrepreneurs who already downloaded.
            </p>
          </div>
        </section>

        {/* Verified Success — Show Download */}
        {status === 'verified' && (
          <section className="px-4 pb-16">
            <div className="max-w-2xl mx-auto bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
              <p className="text-green-300 mb-6">Your Business Starter Kit is ready to download.</p>
              <button
                onClick={handleDownload}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg shadow-green-500/25"
              >
                📥 Download Business Starter Kit (PDF)
              </button>
              <p className="text-slate-400 text-sm mt-4">A copy has also been sent to your email.</p>
            </div>
          </section>
        )}

        {/* Form + Kit Items */}
        {status !== 'verified' && (
          <section className="px-4 pb-20">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
              {/* Left — What's Inside */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">What's Inside the Kit</h2>
                <div className="space-y-3">
                  {KIT_ITEMS.map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                      <span className="text-2xl flex-shrink-0">{item.icon}</span>
                      <div>
                        <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                        <p className="text-slate-400 text-xs mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Form */}
              <div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 sticky top-24">
                  {status === 'success' ? (
                    <div className="text-center py-8">
                      <div className="text-5xl mb-4">📧</div>
                      <h3 className="text-xl font-bold text-white mb-2">Check Your Email!</h3>
                      <p className="text-slate-300 mb-4">
                        We've sent a verification link to <strong className="text-white">{formData.email || 'your email'}</strong>.
                      </p>
                      <p className="text-slate-400 text-sm">
                        Click the link in the email to verify your address and download your kit.
                        <br />Check your spam folder if you don't see it in 2 minutes.
                      </p>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold text-white mb-1">Get Your Free Kit</h2>
                      <p className="text-slate-400 text-sm mb-6">Fill in your details. We'll email you the download link.</p>

                      {status === 'error' && errorMsg && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
                          {errorMsg}
                        </div>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Honeypot — hidden from real users */}
                        <input
                          type="text"
                          name="website"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          className="hidden"
                          tabIndex={-1}
                          autoComplete="off"
                          aria-hidden="true"
                        />

                        <div>
                          <label className="block text-slate-300 text-sm font-medium mb-1">Full Name *</label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Rajesh Kumar"
                            className={`w-full px-4 py-3 bg-white/5 border ${fieldErrors.name ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
                          />
                          {fieldErrors.name && <p className="text-red-400 text-xs mt-1">{fieldErrors.name}</p>}
                        </div>

                        <div>
                          <label className="block text-slate-300 text-sm font-medium mb-1">Email Address *</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="e.g. rajesh@mybusiness.com"
                            className={`w-full px-4 py-3 bg-white/5 border ${fieldErrors.email ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
                          />
                          {fieldErrors.email && <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-300 text-sm font-medium mb-1">Phone</label>
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="+91 98765 43210"
                              className={`w-full px-4 py-3 bg-white/5 border ${fieldErrors.phone ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
                            />
                            {fieldErrors.phone && <p className="text-red-400 text-xs mt-1">{fieldErrors.phone}</p>}
                          </div>
                          <div>
                            <label className="block text-slate-300 text-sm font-medium mb-1">City</label>
                            <select
                              value={formData.city}
                              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            >
                              <option value="" className="bg-slate-800">Select city</option>
                              {CITIES.map(c => <option key={c} value={c} className="bg-slate-800">{c}</option>)}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-300 text-sm font-medium mb-1">Company / Business Name</label>
                          <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            placeholder="e.g. Rajesh Enterprises (optional)"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 text-sm font-medium mb-2">I'm interested in:</label>
                          <div className="flex flex-wrap gap-2">
                            {['Starting a business', 'Marketing & Sales', 'Funding & Investment', 'Legal & Compliance', 'AI Tools', 'Export Business'].map(interest => (
                              <button
                                key={interest}
                                type="button"
                                onClick={() => {
                                  const current = formData.interests
                                  setFormData({
                                    ...formData,
                                    interests: current.includes(interest)
                                      ? current.filter(i => i !== interest)
                                      : [...current, interest]
                                  })
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                  formData.interests.includes(interest)
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                                }`}
                              >
                                {interest}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={status === 'loading'}
                          className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl text-lg hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
                        >
                          {status === 'loading' ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                              Sending...
                            </span>
                          ) : '📦 Get My Free Kit'}
                        </button>

                        <p className="text-slate-500 text-xs text-center">
                          We respect your privacy. No spam, ever. Unsubscribe anytime.
                          <br />By submitting, you agree to our terms and privacy policy.
                        </p>
                      </form>
    <GoalModeFeatures page="free-business-kit" />
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Social Proof */}
        <section className="px-4 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-slate-400 text-sm mb-6">Trusted by entrepreneurs across India</p>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'].map(city => (
                <div key={city} className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 text-xs text-center">
                  📍 {city}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Everyday Free Stuff (live feed) ─── */}
        <LiveFreeKit />
      </div>
      <Footer />
    </>
  )
}
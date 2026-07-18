'use client'
import GoalModeFeatures from '@/components/GoalModeFeatures'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import PageEnhancements from '@/components/PageEnhancements'
import Footer from '@/components/Footer'
import PageHead from '@/components/PageHead'


/* ─── EMI Calculator ─── */
function EMICalculator() {
  const [p, setP] = useState('2500000')
  const [r, setR] = useState('8.5')
  const [t, setT] = useState('20')
  const [res, setRes] = useState<{emi:number;total:number;interest:number}|null>(null)
  const calc = () => {
    const principal = parseFloat(p), rate = parseFloat(r)/12/100, n = parseFloat(t)*12
    if (principal<=0||rate<=0||n<=0) return
    const emi = (principal*rate*Math.pow(1+rate,n))/(Math.pow(1+rate,n)-1)
    setRes({emi,total:emi*n,interest:emi*n-principal})
  }
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="font-bold text-lg mb-4">🏠 Home Loan EMI</h3>
      <div className="space-y-3">
        <div><label className="text-xs text-gray-500 block mb-1">Loan Amount (₹)</label><input type="number" value={p} onChange={e=>setP(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"/></div>
        <div><label className="text-xs text-gray-500 block mb-1">Rate (% p.a.)</label><input type="number" step="0.1" value={r} onChange={e=>setR(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"/></div>
        <div><label className="text-xs text-gray-500 block mb-1">Tenure (Years)</label><input type="number" value={t} onChange={e=>setT(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"/></div>
        <button onClick={calc} className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700">Calculate</button>
        {res && <div className="p-3 bg-blue-50 rounded-xl space-y-1 text-sm"><div className="flex justify-between"><span className="text-gray-600">EMI</span><span className="font-bold text-blue-700">₹{Math.round(res.emi).toLocaleString('en-IN')}</span></div><div className="flex justify-between"><span className="text-gray-600">Total</span><span className="font-bold">₹{Math.round(res.total).toLocaleString('en-IN')}</span></div><div className="flex justify-between"><span className="text-gray-600">Interest</span><span className="font-bold text-red-600">₹{Math.round(res.interest).toLocaleString('en-IN')}</span></div></div>}
      </div>
    </div>
  )
}

/* ─── SIP Calculator ─── */
function SIPCalc() {
  const [m, setM] = useState('5000')
  const [r, setR] = useState('12')
  const [y, setY] = useState('10')
  const [res, setRes] = useState<{inv:number;ret:number;tot:number}|null>(null)
  const calc = () => {
    const monthly = parseFloat(m), rate = parseFloat(r)/12/100, n = parseFloat(y)*12
    if (monthly<=0||rate<=0||n<=0) return
    const total = monthly*((Math.pow(1+rate,n)-1)/rate)*(1+rate)
    setRes({inv:monthly*n,ret:total-monthly*n,tot:total})
  }
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="font-bold text-lg mb-4">📈 SIP Returns</h3>
      <div className="space-y-3">
        <div><label className="text-xs text-gray-500 block mb-1">Monthly SIP (₹)</label><input type="number" value={m} onChange={e=>setM(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500/20"/></div>
        <div><label className="text-xs text-gray-500 block mb-1">Return (% p.a.)</label><input type="number" step="0.5" value={r} onChange={e=>setR(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500/20"/></div>
        <div><label className="text-xs text-gray-500 block mb-1">Years</label><input type="number" value={y} onChange={e=>setY(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500/20"/></div>
        <button onClick={calc} className="w-full py-2.5 bg-purple-600 text-white font-semibold rounded-xl text-sm hover:bg-purple-700">Calculate</button>
        {res && <div className="p-3 bg-purple-50 rounded-xl space-y-1 text-sm"><div className="flex justify-between"><span className="text-gray-600">Invested</span><span className="font-bold">₹{Math.round(res.inv).toLocaleString('en-IN')}</span></div><div className="flex justify-between"><span className="text-gray-600">Gains</span><span className="font-bold text-purple-700">₹{Math.round(res.ret).toLocaleString('en-IN')}</span></div><div className="flex justify-between border-t border-purple-200 pt-1"><span className="font-medium">Total</span><span className="font-bold text-purple-800">₹{Math.round(res.tot).toLocaleString('en-IN')}</span></div></div>}
      </div>
    </div>
  )
}

/* ─── FD Calculator ─── */
function FDCalc() {
  const [p, setP] = useState('100000')
  const [r, setR] = useState('7')
  const [t, setT] = useState('5')
  const [res, setRes] = useState<{mat:number;int:number}|null>(null)
  const calc = () => {
    const principal = parseFloat(p), rate = parseFloat(r)/100, years = parseFloat(t)
    if (principal<=0||rate<=0||years<=0) return
    const mat = principal*Math.pow(1+rate,years)
    setRes({mat,int:mat-principal})
  }
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="font-bold text-lg mb-4">💰 FD Returns</h3>
      <div className="space-y-3">
        <div><label className="text-xs text-gray-500 block mb-1">Deposit (₹)</label><input type="number" value={p} onChange={e=>setP(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/20"/></div>
        <div><label className="text-xs text-gray-500 block mb-1">Rate (% p.a.)</label><input type="number" step="0.1" value={r} onChange={e=>setR(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/20"/></div>
        <div><label className="text-xs text-gray-500 block mb-1">Years</label><input type="number" value={t} onChange={e=>setT(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/20"/></div>
        <button onClick={calc} className="w-full py-2.5 bg-teal-600 text-white font-semibold rounded-xl text-sm hover:bg-teal-700">Calculate</button>
        {res && <div className="p-3 bg-teal-50 rounded-xl space-y-1 text-sm"><div className="flex justify-between"><span className="text-gray-600">Interest</span><span className="font-bold text-teal-700">₹{Math.round(res.int).toLocaleString('en-IN')}</span></div><div className="flex justify-between border-t border-teal-200 pt-1"><span className="font-medium">Maturity</span><span className="font-bold text-teal-800">₹{Math.round(res.mat).toLocaleString('en-IN')}</span></div></div>}
      </div>
    </div>
  )
}

/* ─── PPF Calculator ─── */
function PPFCalc() {
  const [y, setY] = useState('150000')
  const [t, setT] = useState('15')
  const res = (() => {
    const deposit = parseFloat(y), n = parseFloat(t), r = 0.071
    if (deposit<=0||n<=0) return null
    let total = 0
    for (let i=0;i<n;i++) { total+=deposit; total*=(1+r) }
    return {inv:deposit*n,int:total-deposit*n,tot:total}
  })()
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="font-bold text-lg mb-4">🏦 PPF Calculator</h3>
      <div className="space-y-3">
        <div><label className="text-xs text-gray-500 block mb-1">Yearly Deposit (₹)</label><input type="number" value={y} onChange={e=>setY(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20"/></div>
        <div><label className="text-xs text-gray-500 block mb-1">Years (min 15)</label><input type="number" value={t} onChange={e=>setT(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20"/></div>
        {res && <div className="p-3 bg-orange-50 rounded-xl space-y-1 text-sm"><p className="text-xs text-orange-600 mb-1">Rate: 7.1% p.a.</p><div className="flex justify-between"><span className="text-gray-600">Invested</span><span className="font-bold">₹{Math.round(res.inv).toLocaleString('en-IN')}</span></div><div className="flex justify-between"><span className="text-gray-600">Interest</span><span className="font-bold text-orange-700">₹{Math.round(res.int).toLocaleString('en-IN')}</span></div><div className="flex justify-between border-t border-orange-200 pt-1"><span className="font-medium">Maturity</span><span className="font-bold text-orange-800">₹{Math.round(res.tot).toLocaleString('en-IN')}</span></div></div>}
      </div>
    </div>
  )
}

/* ─── Tax Calculator (New FY 2025-26) ─── */
function TaxCalc() {
  const [income, setIncome] = useState('1200000')
  const res = (() => {
    const inc = parseFloat(income)
    if (inc<=0) return null
    // New tax regime FY 2025-26
    let tax = 0
    if (inc<=400000) tax = 0
    else if (inc<=800000) tax = (inc-400000)*0.05
    else if (inc<=1200000) tax = 20000+(inc-800000)*0.10
    else if (inc<=1600000) tax = 60000+(inc-1200000)*0.15
    else if (inc<=2000000) tax = 120000+(inc-1600000)*0.20
    else if (inc<=2400000) tax = 200000+(inc-2000000)*0.25
    else tax = 300000+(inc-2400000)*0.30
    const cess = tax*0.04
    return {tax:tax+cess,effective:((tax+cess)/inc*100)}
  })()
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="font-bold text-lg mb-4">📋 Income Tax (New Regime FY 25-26)</h3>
      <div className="space-y-3">
        <div><label className="text-xs text-gray-500 block mb-1">Annual Income (₹)</label><input type="number" value={income} onChange={e=>setIncome(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500/20"/></div>
        {res && <div className="p-3 bg-red-50 rounded-xl space-y-1 text-sm"><div className="flex justify-between"><span className="text-gray-600">Tax Payable</span><span className="font-bold text-red-700">₹{Math.round(res.tax).toLocaleString('en-IN')}</span></div><div className="flex justify-between"><span className="text-gray-600">Effective Rate</span><span className="font-bold">{res.effective.toFixed(1)}%</span></div><p className="text-xs text-gray-500 mt-2">* Includes 4% cess. Standard deduction ₹75,000 included.</p></div>}
      </div>
    </div>
  )
}

/* ─── ROI Calculator ─── */
function ROICalc() {
  const [inv, setInv] = useState('50000')
  const [ret, setRet] = useState('75000')
  const res = (() => {
    const i = parseFloat(inv), r = parseFloat(ret)
    if (i<=0) return null
    return {roi:((r-i)/i)*100,profit:r-i}
  })()
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="font-bold text-lg mb-4">📊 ROI Calculator</h3>
      <div className="space-y-3">
        <div><label className="text-xs text-gray-500 block mb-1">Investment (₹)</label><input type="number" value={inv} onChange={e=>setInv(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"/></div>
        <div><label className="text-xs text-gray-500 block mb-1">Return (₹)</label><input type="number" value={ret} onChange={e=>setRet(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"/></div>
        {res && <div className="p-3 bg-indigo-50 rounded-xl space-y-1 text-sm"><div className="flex justify-between"><span className="text-gray-600">Profit</span><span className={`font-bold ${res.profit>=0?'text-green-700':'text-red-600'}`}>{res.profit>=0?'+':''}₹{Math.round(res.profit).toLocaleString('en-IN')}</span></div><div className="flex justify-between"><span className="text-gray-600">ROI</span><span className={`font-bold ${res.roi>=0?'text-indigo-800':'text-red-600'}`}>{res.roi.toFixed(1)}%</span></div></div>}
      </div>
    </div>
  )
}

/* ─── LIVE High-ROI Investment Strategies feed (daily) ─── */
function LiveStrategies() {
  const [data, setData] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [risk, setRisk] = useState('')
  useEffect(() => {
    fetch(`/api/investment-strategies?sort=roi${risk ? `&risk=${risk}` : ''}`)
      .then(r => r.json()).then(d => { if (d.ok) { setData(d.results); setTotal(d.total) } }).catch(() => {})
  }, [risk])
  return (
    <section className="py-16 bg-gradient-to-br from-indigo-950 via-[#0f172a] to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-medium mb-2">🔴 LIVE · Daily High-ROI Opportunities</span>
            <h2 className="text-3xl font-bold text-white">Investment Strategies with Huge ROI</h2>
            <p className="text-indigo-200 text-sm mt-1">{total} curated strategies · updated daily · free</p>
          </div>
          <div className="flex gap-2">
            {['', 'Low', 'Medium', 'High'].map(r => (
              <button key={r} onClick={() => setRisk(r)} className={`px-4 py-2 rounded-full text-sm font-medium ${risk === r ? 'bg-emerald-500 text-white' : 'bg-white/10 text-indigo-100 hover:bg-white/20'}`}>{r || 'All'}</button>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.map(s => (
            <div key={s.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-emerald-400/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-white text-sm leading-tight">{s.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${s.risk === 'High' ? 'bg-red-500/20 text-red-300' : s.risk === 'Medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>{s.risk}</span>
              </div>
              <p className="text-emerald-400 font-bold text-2xl mb-1">{s.expectedRoi}% <span className="text-xs text-indigo-300 font-normal">ROI</span></p>
              <p className="text-indigo-200 text-xs mb-3">{s.horizon} · min ₹{(s.minInvest / 1000).toFixed(0)}k · {s.tagline}</p>
              <a href="https://wa.me/917972140672?text=Interested%20in%20investment%20strategy" className="inline-block w-full text-center py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold">Get Free Consult</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── 10,000+ Finance Calculators Hub ─── */
function CalculatorHub() {
  const [data, setData] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [cats, setCats] = useState<string[]>([])
  const [cat, setCat] = useState('')
  const [q, setQ] = useState('')
  const [count, setCount] = useState(0)
  useEffect(() => {
    fetch('/api/finance-calculators?limit=30').then(r => r.json()).then(d => { if (d.ok) { setData(d.results); setTotal(d.total); setCats(d.categories); setCount(d.count) } }).catch(() => {})
  }, [])
  useEffect(() => {
    const t = setTimeout(() => {
      fetch(`/api/finance-calculators?${cat ? `category=${cat}&` : ''}${q ? `q=${encodeURIComponent(q)}&` : ''}limit=30`).then(r => r.json()).then(d => { if (d.ok) { setData(d.results); setTotal(d.total) } }).catch(() => {})
    }, 250)
    return () => clearTimeout(t)
  }, [cat, q])
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#0f172a] mb-2 text-center">🧮 {count.toLocaleString()}+ Free Finance Calculators</h2>
        <p className="text-gray-500 text-center mb-8">EMI, SIP, tax, retirement, ROI, FIRE & more — every calculator, free forever.</p>
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search calculators (SIP, GST, EMI…)" className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
          <select value={cat} onChange={e => setCat(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm">
            <option value="">All Categories</option>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <p className="text-sm text-gray-500 mb-4">{total.toLocaleString()} results</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {data.map(c => (
            <div key={c.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-indigo-300 transition-colors">
              <h3 className="font-semibold text-sm text-[#0f172a] mb-1">{c.name}</h3>
              <p className="text-xs text-gray-500 mb-2">{c.category} · {c.city}</p>
              <p className="text-xs text-indigo-600 font-bold">~₹{Math.round(c.estimatedResult).toLocaleString('en-IN')}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const INVESTMENT_OPTIONS = [
  { name: 'Mutual Funds (SIP)', returnRange: '12-15%', risk: 'Medium', lockIn: 'None (ELSS: 3 yrs)', tax: 'LTCG >₹1.25L @12.5%', icon: '📈', color: 'bg-purple-50 border-purple-200' },
  { name: 'PPF', returnRange: '7.1%', risk: 'Very Low', lockIn: '15 years', tax: 'Fully exempt (EEE)', icon: '🏦', color: 'bg-orange-50 border-orange-200' },
  { name: 'Fixed Deposit', returnRange: '6-8.5%', risk: 'Very Low', lockIn: '7 days to 10 yrs', tax: 'Interest taxable', icon: '💰', color: 'bg-teal-50 border-teal-200' },
  { name: 'NPS', returnRange: '9-12%', risk: 'Low-Medium', lockIn: 'Till 60 years', tax: 'Extra ₹50K Sec 80CCD(1B)', icon: '🏛️', color: 'bg-blue-50 border-blue-200' },
  { name: 'Stocks (Direct)', returnRange: '15-25%', risk: 'High', lockIn: 'None', tax: 'STCG 20%, LTCG 12.5%', icon: '📊', color: 'bg-green-50 border-green-200' },
  { name: 'Gold (Sovereign Bond)', returnRange: '2.5%+gold', risk: 'Low', lockIn: '8 yrs (exit after 5)', tax: 'LTCG 12.5% (indexation)', icon: '🥇', color: 'bg-yellow-50 border-yellow-200' },
  { name: 'Real Estate', returnRange: '8-12%', risk: 'Medium', lockIn: 'Illiquid', tax: 'LTCG 12.5% (indexation)', icon: '🏠', color: 'bg-red-50 border-red-200' },
  { name: 'NCD / Bonds', returnRange: '7-10%', risk: 'Low-Medium', lockIn: '1-10 yrs', tax: 'As per slab', icon: '📜', color: 'bg-gray-50 border-gray-200' },
]

export default function InvestmentPage() {
  return (
    <>
      <PageHead
        title="Investment & Wealth Hub — SIP, FD, PPF, Tax Calculator, Best Investments India"
        description="Free investment calculators: SIP, FD, PPF, EMI, Income Tax. Compare best investment options in India — mutual funds, stocks, gold, NPS, real estate. New tax regime FY 2025-26 calculator."
        keywords={[
          'best investment India 2026', 'SIP calculator', 'mutual fund returns',
          'PPF calculator', 'FD calculator', 'income tax calculator India',
          'new tax regime FY 2025-26', 'NPS calculator', 'gold investment India',
          'real estate investment India', 'stock market for beginners',
          'tax saving investments 80C', 'ELSS mutual fund',
          'wealth building tips India', 'financial planning India',
        ]}
        canonical="/investment"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Investment & Wealth Calculators India',
          url: 'https://infinite-gundawar-webapp.vercel.app/investment',
          applicationCategory: 'FinanceApplication',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        }}
      />
      <Navbar />
      <PageEnhancements />
      <main className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50/30 to-orange-50/30">

        {/* Cinematic Video Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        </div>


        {/* Cartoon Video Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        </div>

        {/* Hero */}
        <section className="py-20 bg-gradient-to-r from-amber-800 to-yellow-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"><div className="absolute top-10 right-10 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"/></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <span className="inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-full text-yellow-200 text-sm font-medium mb-4">Free Calculators — New Tax Regime FY 2025-26</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              <span className="text-yellow-400">Wealth</span> Hub — Investment & Tax
            </h1>
            <p className="text-lg text-amber-100/80 max-w-2xl mx-auto">
              Free calculators, best investment options, tax planning — everything you need to build wealth in India.
            </p>
          </div>
        </section>

        {/* Calculators */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#0f172a] mb-8 text-center">💰 Free Financial Calculators</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <EMICalculator />
              <SIPCalc />
              <FDCalc />
              <PPFCalc />
              <TaxCalc />
              <ROICalc />
            </div>
          </div>
        </section>

        {/* Investment Options Comparison */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#0f172a] mb-8 text-center">📊 Best Investment Options in India (2026)</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {INVESTMENT_OPTIONS.map(opt => (
                <div key={opt.name} className={`rounded-2xl p-5 border ${opt.color}`}>
                  <div className="text-2xl mb-2">{opt.icon}</div>
                  <h3 className="font-bold text-[#0f172a] mb-2">{opt.name}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Return</span><span className="font-semibold text-green-700">{opt.returnRange}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Risk</span><span className="font-semibold">{opt.risk}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Lock-in</span><span className="text-xs">{opt.lockIn}</span></div>
                    <p className="text-xs text-gray-500 mt-2">Tax: {opt.tax}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Wealth Building Guide */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#0f172a] mb-8 text-center">📚 Wealth Building Guide for Indians</h2>
            <div className="prose prose-gray max-w-none">
              <h3 className="text-xl font-semibold text-[#0f172a] mt-6 mb-3">1. Emergency Fund First</h3>
              <p className="text-gray-600 mb-4">Before investing, build an emergency fund of 6-12 months expenses in a liquid FD or savings account. This is your financial safety net.</p>
              <h3 className="text-xl font-semibold text-[#0f172a] mt-6 mb-3">2. Start SIP in Index Funds</h3>
              <p className="text-gray-600 mb-4">For beginners, Nifty 50 Index Fund SIP is the best start. Historical returns 12-14% over 10+ years. Start with as low as ₹500/month.</p>
              <h3 className="text-xl font-semibold text-[#0f172a] mt-6 mb-3">3. Max Out Tax Saving (Sec 80C)</h3>
              <p className="text-gray-600 mb-4">Use full ₹1.5 lakh limit: PPF (₹1.5L), ELSS mutual funds (₹1.5L), NPS additional ₹50K under 80CCD(1B). Total tax saving up to ₹2 lakh.</p>
              <h3 className="text-xl font-semibold text-[#0f172a] mt-6 mb-3">4. Health Insurance is Must</h3>
              <p className="text-gray-600 mb-4">Get ₹10-25 lakh health insurance before age 30. Premium is lowest when you are young. One hospitalization can wipe out years of savings.</p>
              <h3 className="text-xl font-semibold text-[#0f172a] mt-6 mb-3">5. Don't Time the Market</h3>
              <p className="text-gray-600 mb-4">SIP works because of rupee cost averaging. Stay invested for 10+ years. The best time to start investing was yesterday. The second best time is today.</p>
            </div>
          </div>
        </section>

        {/* ─── LIVE High-ROI Investment Strategies (daily feed) ─── */}
        <LiveStrategies />

        {/* ─── 10,000+ Finance Calculators ─── */}
        <CalculatorHub />
      </main>
      <Footer />
    <GoalModeFeatures page="investment" />
    </>
  )
}
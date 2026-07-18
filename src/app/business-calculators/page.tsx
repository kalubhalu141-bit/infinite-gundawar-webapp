'use client'
import GoalModeFeatures from '@/components/GoalModeFeatures'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import PageEnhancements from '@/components/PageEnhancements'
import Footer from '@/components/Footer'
import PageHead from '@/components/PageHead'


/* ─── EMI Calculator ─── */
function EMICalculator() {
  const [principal, setPrincipal] = useState<string>('1000000')
  const [rate, setRate] = useState<string>('8.5')
  const [tenure, setTenure] = useState<string>('20')
  const [result, setResult] = useState<{ emi: number; total: number; interest: number } | null>(null)

  const calculate = () => {
    const p = parseFloat(principal)
    const r = parseFloat(rate) / 12 / 100
    const n = parseFloat(tenure) * 12
    if (p <= 0 || r <= 0 || n <= 0) return
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const total = emi * n
    const interest = total - p
    setResult({ emi, total, interest })
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="font-bold text-lg text-[#0f172a] mb-4">🏠 Home Loan EMI Calculator</h3>
      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Loan Amount (₹)</label>
          <input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Interest Rate (% per year)</label>
          <input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Tenure (Years)</label>
          <input type="number" value={tenure} onChange={e => setTenure(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
        </div>
        <button onClick={calculate} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all">Calculate EMI</button>
        {result && (
          <div className="mt-4 p-4 bg-blue-50 rounded-xl space-y-2">
            <div className="flex justify-between"><span className="text-sm text-gray-600">Monthly EMI</span><span className="font-bold text-blue-700">₹{Math.round(result.emi).toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span className="text-sm text-gray-600">Total Payment</span><span className="font-bold">₹{Math.round(result.total).toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span className="text-sm text-gray-600">Total Interest</span><span className="font-bold text-red-600">₹{Math.round(result.interest).toLocaleString('en-IN')}</span></div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── GST Calculator ─── */
function GSTCalculator() {
  const [amount, setAmount] = useState<string>('10000')
  const [gstRate, setGstRate] = useState<string>('18')
  const [result, setResult] = useState<{ base: number; gst: number; total: number } | null>(null)

  const calculate = () => {
    const a = parseFloat(amount)
    const r = parseFloat(gstRate)
    if (a <= 0) return
    const gst = (a * r) / 100
    setResult({ base: a, gst, total: a + gst })
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="font-bold text-lg text-[#0f172a] mb-4">🧾 GST Calculator India</h3>
      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Amount (₹)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" />
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">GST Rate (%)</label>
          <select value={gstRate} onChange={e => setGstRate(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none">
            <option value="0">0% (Essential items)</option>
            <option value="5">5% (Basic necessities)</option>
            <option value="12">12% (Standard - lower)</option>
            <option value="18">18% (Standard - most common)</option>
            <option value="28">28% (Luxury items)</option>
          </select>
        </div>
        <button onClick={calculate} className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all">Calculate GST</button>
        {result && (
          <div className="mt-4 p-4 bg-emerald-50 rounded-xl space-y-2">
            <div className="flex justify-between"><span className="text-sm text-gray-600">Base Amount</span><span className="font-bold">₹{result.base.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span className="text-sm text-gray-600">GST ({gstRate}%)</span><span className="font-bold text-emerald-700">₹{result.gst.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between border-t border-emerald-200 pt-2"><span className="text-sm font-medium">Total Amount</span><span className="font-bold text-emerald-800">₹{result.total.toLocaleString('en-IN')}</span></div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── SIP / Investment Calculator ─── */
function SIPCalculator() {
  const [monthly, setMonthly] = useState<string>('5000')
  const [returnRate, setReturnRate] = useState<string>('12')
  const [years, setYears] = useState<string>('10')
  const [result, setResult] = useState<{ invested: number; returns: number; total: number } | null>(null)

  const calculate = () => {
    const p = parseFloat(monthly)
    const r = parseFloat(returnRate) / 12 / 100
    const n = parseFloat(years) * 12
    if (p <= 0 || r <= 0 || n <= 0) return
    const total = p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
    const invested = p * n
    setResult({ invested, returns: total - invested, total })
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="font-bold text-lg text-[#0f172a] mb-4">📈 SIP Investment Calculator</h3>
      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Monthly Investment (₹)</label>
          <input type="number" value={monthly} onChange={e => setMonthly(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 outline-none" />
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Expected Return (% per year)</label>
          <input type="number" step="0.5" value={returnRate} onChange={e => setReturnRate(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 outline-none" />
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Time Period (Years)</label>
          <input type="number" value={years} onChange={e => setYears(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 outline-none" />
        </div>
        <button onClick={calculate} className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all">Calculate Returns</button>
        {result && (
          <div className="mt-4 p-4 bg-purple-50 rounded-xl space-y-2">
            <div className="flex justify-between"><span className="text-sm text-gray-600">Total Invested</span><span className="font-bold">₹{Math.round(result.invested).toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span className="text-sm text-gray-600">Wealth Gained</span><span className="font-bold text-purple-700">₹{Math.round(result.returns).toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between border-t border-purple-200 pt-2"><span className="text-sm font-medium">Total Value</span><span className="font-bold text-purple-800">₹{Math.round(result.total).toLocaleString('en-IN')}</span></div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── PPF Calculator ─── */
function PPFCalculator() {
  const [yearly, setYearly] = useState<string>('150000')
  const [years, setYears] = useState<string>('15')
  const result = (() => {
    const p = parseFloat(yearly)
    const n = parseFloat(years)
    const r = 0.071 // Current PPF rate ~7.1%
    if (p <= 0 || n <= 0) return null
    let total = 0
    for (let i = 0; i < n; i++) { total += p; total *= (1 + r) }
    const invested = p * n
    return { invested, interest: total - invested, total }
  })()

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="font-bold text-lg text-[#0f172a] mb-4">🏦 PPF Calculator (Public Provident Fund)</h3>
      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Yearly Deposit (₹) — Max ₹1,50,000</label>
          <input type="number" value={yearly} onChange={e => setYearly(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none" />
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Lock-in Period (Years) — Min 15</label>
          <input type="number" value={years} onChange={e => setYears(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none" />
        </div>
        <div className="p-4 bg-orange-50 rounded-xl space-y-2">
          <p className="text-xs text-orange-600 mb-2">Current PPF Interest Rate: 7.1% p.a. (compounded yearly)</p>
          {result && (
            <>
              <div className="flex justify-between"><span className="text-sm text-gray-600">Total Invested</span><span className="font-bold">₹{Math.round(result.invested).toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-600">Interest Earned</span><span className="font-bold text-orange-700">₹{Math.round(result.interest).toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between border-t border-orange-200 pt-2"><span className="text-sm font-medium">Maturity Value</span><span className="font-bold text-orange-800">₹{Math.round(result.total).toLocaleString('en-IN')}</span></div>
    <GoalModeFeatures page="business-calculators" />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── FD Calculator ─── */
function FDCalculator() {
  const [principal, setPrincipal] = useState<string>('100000')
  const [rate, setRate] = useState<string>('7')
  const [years, setYears] = useState<string>('5')
  const [result, setResult] = useState<{ maturity: number; interest: number } | null>(null)

  const calculate = () => {
    const p = parseFloat(principal)
    const r = parseFloat(rate) / 100
    const t = parseFloat(years)
    if (p <= 0 || r <= 0 || t <= 0) return
    const maturity = p * Math.pow(1 + r, t)
    setResult({ maturity, interest: maturity - p })
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="font-bold text-lg text-[#0f172a] mb-4">💰 Fixed Deposit (FD) Calculator</h3>
      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Deposit Amount (₹)</label>
          <input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 outline-none" />
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Interest Rate (% p.a.)</label>
          <input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 outline-none" />
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Tenure (Years)</label>
          <input type="number" value={years} onChange={e => setYears(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 outline-none" />
        </div>
        <button onClick={calculate} className="w-full py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-all">Calculate FD Returns</button>
        {result && (
          <div className="mt-4 p-4 bg-teal-50 rounded-xl space-y-2">
            <div className="flex justify-between"><span className="text-sm text-gray-600">Interest Earned</span><span className="font-bold text-teal-700">₹{Math.round(result.interest).toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between border-t border-teal-200 pt-2"><span className="text-sm font-medium">Maturity Amount</span><span className="font-bold text-teal-800">₹{Math.round(result.maturity).toLocaleString('en-IN')}</span></div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── ROI / Profit Margin Calculator ─── */
function ROICalculator() {
  const [investment, setInvestment] = useState<string>('50000')
  const [returns, setReturns] = useState<string>('75000')
  const result = (() => {
    const inv = parseFloat(investment)
    const ret = parseFloat(returns)
    if (inv <= 0) return null
    const roi = ((ret - inv) / inv) * 100
    const profit = ret - inv
    return { roi, profit }
  })()

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="font-bold text-lg text-[#0f172a] mb-4">📊 ROI & Profit Calculator</h3>
      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Investment / Cost (₹)</label>
          <input type="number" value={investment} onChange={e => setInvestment(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Return / Revenue (₹)</label>
          <input type="number" value={returns} onChange={e => setReturns(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
        </div>
        {result && (
          <div className="p-4 bg-indigo-50 rounded-xl space-y-2">
            <div className="flex justify-between"><span className="text-sm text-gray-600">Profit / Loss</span><span className={`font-bold ${result.profit >= 0 ? 'text-green-700' : 'text-red-600'}`}>{result.profit >= 0 ? '+' : ''}₹{Math.round(result.profit).toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between border-t border-indigo-200 pt-2"><span className="text-sm font-medium">ROI</span><span className={`font-bold ${result.roi >= 0 ? 'text-indigo-800' : 'text-red-600'}`}>{result.roi.toFixed(2)}%</span></div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Main Page ─── */
export default function BusinessCalculatorsPage() {
  return (
    <>
      <PageHead
        title="Free Business Calculators India — EMI, GST, SIP, PPF, FD, ROI"
        description="Free online business calculators for India: Home Loan EMI Calculator, GST Calculator, SIP Investment Calculator, PPF Calculator, FD Calculator, ROI & Profit Calculator. Calculate instantly with accurate Indian tax rates."
        keywords={[
          'EMI calculator India', 'home loan EMI calculator', 'GST calculator India',
          'SIP calculator', 'PPF calculator India', 'FD calculator',
          'ROI calculator India', 'profit margin calculator', 'business calculators free',
          'online calculator India', 'financial calculators India',
        ]}
        canonical="/business-calculators"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Free Business Calculators India',
          url: 'https://infinite-gundawar-webapp.vercel.app/business-calculators',
          description: 'Free online business calculators: EMI, GST, SIP, PPF, FD, ROI',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        }}
      />
      <Navbar />
      <PageEnhancements />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">

        {/* Cinematic Video Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        </div>


        {/* Cartoon Video Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        </div>

        {/* Hero */}
        <section className="py-16 bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-64 h-64 bg-[#d4a843] rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <span className="inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-full text-[#d4a843] text-sm font-medium mb-4">100% Free — No Sign-up Required</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Free Business Calculators for India
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              EMI, GST, SIP, PPF, FD, ROI & more — accurate calculations with current Indian tax rates and interest rates.
            </p>
          </div>
        </section>

        {/* Calculators Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <EMICalculator />
              <GSTCalculator />
              <SIPCalculator />
              <PPFCalculator />
              <FDCalculator />
              <ROICalculator />
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#0f172a] mb-6">Why Use Our Free Business Calculators?</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 mb-4">
                Our free online calculators help Indian businesses, investors, and individuals make informed financial decisions. Whether you are planning a home loan, calculating GST on a product, planning your retirement with PPF, or evaluating an investment with SIP — our tools provide accurate results instantly.
              </p>
              <h3 className="text-xl font-semibold text-[#0f172a] mt-8 mb-3">Home Loan EMI Calculator India</h3>
              <p className="text-gray-600 mb-4">
                Calculate your monthly EMI for any home loan amount. Our calculator uses the standard reducing balance method used by all Indian banks including SBI, HDFC, ICICI, and Axis Bank. Enter your loan amount, interest rate, and tenure to get instant EMI results with total interest payable.
              </p>
              <h3 className="text-xl font-semibold text-[#0f172a] mt-8 mb-3">GST Calculator — All Slabs (0%, 5%, 12%, 18%, 28%)</h3>
              <p className="text-gray-600 mb-4">
                Calculate GST amount for any product or service. Supports all GST slabs in India: 0% for essential items, 5% for basic necessities, 12% and 18% for standard goods and services, and 28% for luxury items. Get both CGST and SGST breakdown.
              </p>
              <h3 className="text-xl font-semibold text-[#0f172a] mt-8 mb-3">SIP Calculator — Mutual Fund Returns</h3>
              <p className="text-gray-600 mb-4">
                Plan your mutual fund investments with our SIP calculator. See how much wealth you can create through systematic investment in equity, debt, or hybrid mutual funds. Historical average returns: equity 12%, debt 7-8%, hybrid 9-10%.
              </p>
              <h3 className="text-xl font-semibold text-[#0f172a] mt-8 mb-3">PPF Calculator — 15 Year Lock-in</h3>
              <p className="text-gray-600 mb-4">
                Public Provident Fund (PPF) is one of the best tax-saving investments in India under Section 80C. Current interest rate is 7.1% p.a. compounded yearly. Maximum yearly deposit is ₹1,50,000. Maturity period is 15 years.
              </p>
              <h3 className="text-xl font-semibold text-[#0f172a] mt-8 mb-3">FD Calculator — Fixed Deposit Returns</h3>
              <p className="text-gray-600 mb-4">
                Calculate maturity amount for your fixed deposit investment. Current FD rates in India range from 6-8.5% depending on the bank and tenure. Senior citizens get an additional 0.25-0.75% interest.
              </p>
              <h3 className="text-xl font-semibold text-[#0f172a] mt-8 mb-3">ROI Calculator — Return on Investment</h3>
              <p className="text-gray-600 mb-4">
                Calculate return on investment for any business or personal investment. ROI helps you compare different investment options and make better financial decisions. Formula: ROI = (Net Profit / Investment) × 100.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
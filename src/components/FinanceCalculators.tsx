'use client'
import { useState } from 'react'

/* ─── SIP Calculator ─── */
function SIPCalculator() {
  const [monthly, setMonthly] = useState(5000)
  const [rate, setRate] = useState(12)
  const [years, setYears] = useState(10)
  const n = years * 12
  const r = rate / 100 / 12
  const futureValue = r > 0 ? monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : monthly * n
  const invested = monthly * n
  const returns = futureValue - invested

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h4 className="font-bold text-[#0f172a] mb-4 flex items-center gap-2">📈 SIP Calculator</h4>
      <div className="space-y-4 mb-4">
        <div>
          <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Monthly Investment</span><span className="font-bold text-[#1e3a5f]">₹{monthly.toLocaleString('en-IN')}</span></div>
          <input type="range" min="500" max="100000" step="500" value={monthly} onChange={e => setMonthly(+e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a5f]" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Expected Return Rate</span><span className="font-bold text-[#1e3a5f]">{rate}% p.a.</span></div>
          <input type="range" min="6" max="20" step="0.5" value={rate} onChange={e => setRate(+e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a5f]" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Investment Period</span><span className="font-bold text-[#1e3a5f]">{years} years</span></div>
          <input type="range" min="1" max="30" step="1" value={years} onChange={e => setYears(+e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a5f]" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-50 rounded-xl p-3 text-center"><p className="text-xs text-gray-500">Invested</p><p className="font-bold text-sm">₹{Math.round(invested).toLocaleString('en-IN')}</p></div>
        <div className="bg-emerald-50 rounded-xl p-3 text-center"><p className="text-xs text-emerald-600">Returns</p><p className="font-bold text-sm text-emerald-700">₹{Math.round(returns).toLocaleString('en-IN')}</p></div>
        <div className="bg-[#1e3a5f]/5 rounded-xl p-3 text-center"><p className="text-xs text-[#1e3a5f]">Total Value</p><p className="font-bold text-sm text-[#1e3a5f]">₹{Math.round(futureValue).toLocaleString('en-IN')}</p></div>
      </div>
    </div>
  )
}

/* ─── EMI Calculator ─── */
function EMICalculator() {
  const [principal, setPrincipal] = useState(500000)
  const [rate, setRate] = useState(8.5)
  const [years, setYears] = useState(5)
  const n = years * 12
  const r = rate / 100 / 12
  const emi = r > 0 ? (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : principal / n
  const totalPayment = emi * n
  const totalInterest = totalPayment - principal

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h4 className="font-bold text-[#0f172a] mb-4 flex items-center gap-2">🏠 EMI Calculator</h4>
      <div className="space-y-4 mb-4">
        <div>
          <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Loan Amount</span><span className="font-bold text-[#1e3a5f]">₹{principal.toLocaleString('en-IN')}</span></div>
          <input type="range" min="100000" max="10000000" step="50000" value={principal} onChange={e => setPrincipal(+e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a5f]" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Interest Rate</span><span className="font-bold text-[#1e3a5f]">{rate}% p.a.</span></div>
          <input type="range" min="5" max="15" step="0.1" value={rate} onChange={e => setRate(+e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a5f]" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Loan Tenure</span><span className="font-bold text-[#1e3a5f]">{years} years</span></div>
          <input type="range" min="1" max="30" step="1" value={years} onChange={e => setYears(+e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a5f]" />
        </div>
      </div>
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] rounded-xl p-4 text-white text-center mb-3">
        <p className="text-xs text-white/70">Monthly EMI</p>
        <p className="text-2xl font-bold">₹{Math.round(emi).toLocaleString('en-IN')}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-red-50 rounded-xl p-3 text-center"><p className="text-xs text-red-500">Total Interest</p><p className="font-bold text-sm text-red-700">₹{Math.round(totalInterest).toLocaleString('en-IN')}</p></div>
        <div className="bg-gray-50 rounded-xl p-3 text-center"><p className="text-xs text-gray-500">Total Payment</p><p className="font-bold text-sm">₹{Math.round(totalPayment).toLocaleString('en-IN')}</p></div>
      </div>
    </div>
  )
}

/* ─── FD Calculator ─── */
function FDCalculator() {
  const [principal, setPrincipal] = useState(100000)
  const [rate, setRate] = useState(7)
  const [years, setYears] = useState(5)
  const [compounding, setCompounding] = useState(4)
  const n = compounding
  const t = years
  const amount = principal * Math.pow(1 + rate / (100 * n), n * t)
  const interest = amount - principal

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h4 className="font-bold text-[#0f172a] mb-4 flex items-center gap-2">🏦 FD Calculator</h4>
      <div className="space-y-4 mb-4">
        <div>
          <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Deposit Amount</span><span className="font-bold text-[#1e3a5f]">₹{principal.toLocaleString('en-IN')}</span></div>
          <input type="range" min="10000" max="5000000" step="10000" value={principal} onChange={e => setPrincipal(+e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a5f]" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Interest Rate</span><span className="font-bold text-[#1e3a5f]">{rate}% p.a.</span></div>
          <input type="range" min="3" max="9" step="0.25" value={rate} onChange={e => setRate(+e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a5f]" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Tenure</span><span className="font-bold text-[#1e3a5f]">{years} years</span></div>
          <input type="range" min="1" max="10" step="1" value={years} onChange={e => setYears(+e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a5f]" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Compounding</label>
          <select value={compounding} onChange={e => setCompounding(+e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm">
            <option value={1}>Yearly</option>
            <option value={2}>Half-Yearly</option>
            <option value={4}>Quarterly</option>
            <option value={12}>Monthly</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-50 rounded-xl p-3 text-center"><p className="text-xs text-gray-500">Principal</p><p className="font-bold text-sm">₹{principal.toLocaleString('en-IN')}</p></div>
        <div className="bg-emerald-50 rounded-xl p-3 text-center"><p className="text-xs text-emerald-600">Interest</p><p className="font-bold text-sm text-emerald-700">₹{Math.round(interest).toLocaleString('en-IN')}</p></div>
        <div className="bg-[#1e3a5f]/5 rounded-xl p-3 text-center"><p className="text-xs text-[#1e3a5f]">Maturity</p><p className="font-bold text-sm text-[#1e3a5f]">₹{Math.round(amount).toLocaleString('en-IN')}</p></div>
      </div>
    </div>
  )
}

/* ─── RD Calculator ─── */
function RDCalculator() {
  const [monthly, setMonthly] = useState(2000)
  const [rate, setRate] = useState(6.5)
  const [years, setYears] = useState(3)
  const n = years * 12
  const r = rate / 100 / 12
  const amount = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
  const invested = monthly * n
  const interest = amount - invested

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h4 className="font-bold text-[#0f172a] mb-4 flex items-center gap-2">💰 RD Calculator</h4>
      <div className="space-y-4 mb-4">
        <div>
          <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Monthly Deposit</span><span className="font-bold text-[#1e3a5f]">₹{monthly.toLocaleString('en-IN')}</span></div>
          <input type="range" min="500" max="50000" step="500" value={monthly} onChange={e => setMonthly(+e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a5f]" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Interest Rate</span><span className="font-bold text-[#1e3a5f]">{rate}% p.a.</span></div>
          <input type="range" min="4" max="8" step="0.25" value={rate} onChange={e => setRate(+e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a5f]" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Tenure</span><span className="font-bold text-[#1e3a5f]">{years} years</span></div>
          <input type="range" min="1" max="10" step="1" value={years} onChange={e => setYears(+e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a5f]" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-50 rounded-xl p-3 text-center"><p className="text-xs text-gray-500">Deposited</p><p className="font-bold text-sm">₹{invested.toLocaleString('en-IN')}</p></div>
        <div className="bg-emerald-50 rounded-xl p-3 text-center"><p className="text-xs text-emerald-600">Interest</p><p className="font-bold text-sm text-emerald-700">₹{Math.round(interest).toLocaleString('en-IN')}</p></div>
        <div className="bg-[#1e3a5f]/5 rounded-xl p-3 text-center"><p className="text-xs text-[#1e3a5f]">Maturity</p><p className="font-bold text-sm text-[#1e3a5f]">₹{Math.round(amount).toLocaleString('en-IN')}</p></div>
      </div>
    </div>
  )
}

/* ─── Compound Interest Calculator ─── */
function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(100000)
  const [rate, setRate] = useState(10)
  const [years, setYears] = useState(10)
  const [compounding, setCompounding] = useState(1)
  const amount = principal * Math.pow(1 + rate / (100 * compounding), compounding * years)
  const interest = amount - principal

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h4 className="font-bold text-[#0f172a] mb-4 flex items-center gap-2">🔄 Compound Interest</h4>
      <div className="space-y-4 mb-4">
        <div>
          <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Principal</span><span className="font-bold text-[#1e3a5f]">₹{principal.toLocaleString('en-IN')}</span></div>
          <input type="range" min="10000" max="10000000" step="10000" value={principal} onChange={e => setPrincipal(+e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a5f]" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Rate</span><span className="font-bold text-[#1e3a5f]">{rate}%</span></div>
          <input type="range" min="1" max="20" step="0.5" value={rate} onChange={e => setRate(+e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a5f]" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Time</span><span className="font-bold text-[#1e3a5f]">{years} years</span></div>
          <input type="range" min="1" max="40" step="1" value={years} onChange={e => setYears(+e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a5f]" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Compounding</label>
          <select value={compounding} onChange={e => setCompounding(+e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm">
            <option value={1}>Annually</option>
            <option value={2}>Half-Yearly</option>
            <option value={4}>Quarterly</option>
            <option value={12}>Monthly</option>
            <option value={365}>Daily</option>
          </select>
        </div>
      </div>
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-4 text-white text-center">
        <p className="text-xs text-white/70">Final Amount</p>
        <p className="text-2xl font-bold">₹{Math.round(amount).toLocaleString('en-IN')}</p>
        <p className="text-xs text-white/70 mt-1">Interest Earned: ₹{Math.round(interest).toLocaleString('en-IN')}</p>
      </div>
    </div>
  )
}

/* ─── Retirement Calculator ─── */
function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(25)
  const [retireAge, setRetireAge] = useState(60)
  const [monthlyNeed, setMonthlyNeed] = useState(50000)
  const [inflation, setInflation] = useState(6)
  const [returnRate, setReturnRate] = useState(10)
  const yearsToRetire = retireAge - currentAge
  const futureMonthly = monthlyNeed * Math.pow(1 + inflation / 100, yearsToRetire)
  const corpus = (futureMonthly * 12 * 25) // 25x annual expense
  const r = returnRate / 100 / 12
  const n = yearsToRetire * 12
  const monthlySIP = r > 0 ? (corpus * r) / (Math.pow(1 + r, n) - 1) : corpus / n

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h4 className="font-bold text-[#0f172a] mb-4 flex items-center gap-2">🏖️ Retirement Planning</h4>
      <div className="space-y-4 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Current Age</span><span className="font-bold">{currentAge}</span></div>
            <input type="range" min="18" max="55" value={currentAge} onChange={e => setCurrentAge(+e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a5f]" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Retire At</span><span className="font-bold">{retireAge}</span></div>
            <input type="range" min={currentAge + 5} max="70" value={retireAge} onChange={e => setRetireAge(+e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a5f]" />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Monthly Need (Today)</span><span className="font-bold">₹{monthlyNeed.toLocaleString('en-IN')}</span></div>
          <input type="range" min="10000" max="500000" step="5000" value={monthlyNeed} onChange={e => setMonthlyNeed(+e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a5f]" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Inflation</span><span className="font-bold">{inflation}%</span></div>
            <input type="range" min="3" max="10" step="0.5" value={inflation} onChange={e => setInflation(+e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a5f]" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Return Rate</span><span className="font-bold">{returnRate}%</span></div>
            <input type="range" min="6" max="15" step="0.5" value={returnRate} onChange={e => setReturnRate(+e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a5f]" />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-4 text-white text-center mb-3">
        <p className="text-xs text-white/70">Retirement Corpus Needed</p>
        <p className="text-xl font-bold">₹{Math.round(corpus).toLocaleString('en-IN')}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 rounded-xl p-3 text-center"><p className="text-xs text-blue-600">Monthly SIP Required</p><p className="font-bold text-sm text-blue-800">₹{Math.round(monthlySIP).toLocaleString('en-IN')}</p></div>
        <div className="bg-gray-50 rounded-xl p-3 text-center"><p className="text-xs text-gray-500">Future Monthly Need</p><p className="font-bold text-sm">₹{Math.round(futureMonthly).toLocaleString('en-IN')}</p></div>
      </div>
    </div>
  )
}

/* ─── GST Calculator ──️ */
function GSTCalculator() {
  const [amount, setAmount] = useState(10000)
  const [gstRate, setGstRate] = useState(18)
  const gstAmount = amount * gstRate / 100
  const total = amount + gstAmount
  const cgst = gstAmount / 2
  const sgst = gstAmount / 2

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h4 className="font-bold text-[#0f172a] mb-4 flex items-center gap-2">🧾 GST Calculator</h4>
      <div className="space-y-4 mb-4">
        <div>
          <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Base Amount</span><span className="font-bold text-[#1e3a5f]">₹{amount.toLocaleString('en-IN')}</span></div>
          <input type="range" min="100" max="1000000" step="100" value={amount} onChange={e => setAmount(+e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a5f]" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">GST Rate</label>
          <div className="flex gap-2">
            {[5, 12, 18, 28].map(r => (
              <button key={r} onClick={() => setGstRate(r)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${gstRate === r ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {r}%
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] rounded-xl p-4 text-white text-center mb-3">
        <p className="text-xs text-white/70">Total (Incl. GST)</p>
        <p className="text-2xl font-bold">₹{total.toLocaleString('en-IN')}</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-50 rounded-lg p-2 text-center"><p className="text-[10px] text-gray-500">CGST</p><p className="font-bold text-xs">₹{cgst.toLocaleString('en-IN')}</p></div>
        <div className="bg-gray-50 rounded-lg p-2 text-center"><p className="text-[10px] text-gray-500">SGST</p><p className="font-bold text-xs">₹{sgst.toLocaleString('en-IN')}</p></div>
        <div className="bg-emerald-50 rounded-lg p-2 text-center"><p className="text-[10px] text-emerald-600">GST Total</p><p className="font-bold text-xs text-emerald-700">₹{gstAmount.toLocaleString('en-IN')}</p></div>
      </div>
    </div>
  )
}

/* ─── Main Export ─── */
export default function FinanceCalculators() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <SIPCalculator />
      <EMICalculator />
      <FDCalculator />
      <RDCalculator />
      <CompoundInterestCalculator />
      <RetirementCalculator />
      <div className="md:col-span-2">
        <GSTCalculator />
      </div>
    </div>
  )
}

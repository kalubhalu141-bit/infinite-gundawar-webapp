'use client'

import { useState } from 'react'

/* ─── Types ─── */
interface FinanceStrategy {
  id: number
  title: string
  tagline: string
  description: string
  howItWorks: string[]
  pros: string[]
  cons: string[]
  bestFor: string
  example: string
  icon: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  potentialSaving: string
}

/* ─── Comprehensive Finance Strategies Data ─── */
const STRATEGIES: FinanceStrategy[] = [
  {
    id: 1,
    title: 'House Hacking',
    tagline: 'Live free, let tenants pay your mortgage',
    description: 'Buy a multi-unit property (duplex, triplex, or 4-unit), live in one unit, and rent out the others. The rental income from tenants covers most or all of your mortgage. This is the #1 strategy recommended by BiggerPockets as the best way to start real estate investing with minimal cash.',
    howItWorks: [
      'Find a 2-4 unit property in your target area',
      'Live in one unit, rent the others at market rate',
      'Rental income covers 70-100% of your mortgage',
      'Build equity while living nearly rent-free',
      'After 1-2 years, move out and rent ALL units for positive cash flow',
    ],
    pros: ['Live with near-zero housing costs', 'Qualify for owner-occupied financing (3-5% down)', 'Learn landlording with low risk', 'Build wealth from day one'],
    cons: ['Must share property with tenants', 'Limited privacy', 'Maintenance responsibilities while living there', 'Need to find good tenants quickly'],
    bestFor: 'First-time buyers, 20-35 age group, anyone with limited savings',
    example: 'Buy a ₹60L duplex with 10% down (₹6L). Rent the other unit for ₹25K/month. Your ₹35K EMI drops to just ₹10K out of pocket. After 2 years, rent BOTH units and move out — you now have ₹50K/month income on a ₹35K EMI.',
    icon: '🏘️',
    category: 'Property Strategy',
    difficulty: 'Beginner',
    potentialSaving: 'Save 60-100% of housing costs',
  },
  {
    id: 2,
    title: 'BRRRR Method',
    tagline: 'Buy, Rehab, Rent, Refinance, Repeat — Infinite returns',
    description: ' pioneered by BiggerPockets, BRRRR is a systematic approach to build a rental portfolio with minimal capital. You force appreciation through renovation, then refinance to pull your money back out and repeat the process.',
    howItWorks: [
      'Buy an undervalued/distressed property below market value (70-80% of ARV)',
      'Rehab/renovate to increase property value significantly',
      'Rent it out at market rate to establish cash flow',
      'Do a cash-out refinance at the new higher appraised value',
      'Use the refinance cash to buy the next property — repeat!',
    ],
    pros: ['Recycle your capital infinitely', 'Force appreciation through renovation', 'Build a large portfolio fast', 'Each property can fund the next purchase'],
    cons: ['Requires renovation knowledge/cash', 'Refinance depends on appraisal', 'Market timing risk', 'More complex than standard buying'],
    bestFor: 'Experienced investors, handy people, those with ₹10-20L capital to start',
    example: 'Buy distressed property for ₹30L + ₹8L rehab = ₹38L total. Post-rehab value: ₹55L. Refinance at 70% LTV = ₹38.5L loan. You get your ₹38L back + ₹50K extra. Rent covers EMI. Now buy the next one.',
    icon: '🔄',
    category: 'Property Strategy',
    difficulty: 'Advanced',
    potentialSaving: 'Infinite ROI — recycle capital',
  },
  {
    id: 3,
    title: 'Seller Financing (Owner Will Carry)',
    tagline: 'Buy without a bank — let the seller be your bank',
    description: 'Instead of getting a bank loan, the seller acts as the bank. You make a down payment directly to the seller and pay them monthly installments. This is extremely powerful when sellers want to avoid capital gains tax by spreading income over years.',
    howItWorks: [
      'Find a motivated seller (retired, relocating, inherited property)',
      'Negotiate: lower interest rate than bank (4-7% vs 8-9%)',
      'Smaller down payment (5-20% instead of 20-30%)',
      'Pay seller directly each month',
      'Often no credit check or income verification needed',
    ],
    pros: ['Lower interest rates than banks', 'Flexible terms negotiable', 'Faster closing (days, not months)', 'Available when banks reject you'],
    cons: ['Seller may want larger down payment', 'Due-on-sale clause risk', 'Harder to find willing sellers', 'Seller could foreclose if you miss payments'],
    bestFor: 'Self-employed, credit-challenged buyers, unique properties banks won\'t finance',
    example: 'Seller wants ₹50L for their flat. You pay ₹10L down, they carry ₹40L at 6% over 15 years (₹33,715/month EMI vs ₹38,200 at 8.5% bank rate). You save ₹4,485/month = ₹8+ lakh over the loan.',
    icon: '🤝',
    category: 'Financing',
    difficulty: 'Intermediate',
    potentialSaving: 'Save 2-4% on interest rates',
  },
  {
    id: 4,
    title: 'Rent-to-Own (Lease Option)',
    tagline: 'Rent now, lock in the price, buy later',
    description: 'You sign a lease with an option to buy at a predetermined price. A portion of your monthly rent goes toward the down payment. Ideal when you can\'t afford to buy NOW but will be able to in 1-3 years. You lock in today\'s price even if the market goes up.',
    howItWorks: [
      'Sign a 1-3 year lease with purchase option agreement',
      'Pay an option fee (1-5% of purchase price) — credited to your down payment',
      'Pay above-market rent — excess goes toward your down payment',
      'Lock in the purchase price TODAY',
      'At end of lease: exercise option and buy, or walk away (lose option fee)',
    ],
    pros: ['Lock in today\'s price before appreciation', 'Build down payment through rent credits', 'Test the property/neighborhood before buying', 'Time to fix credit or save more'],
    cons: ['Non-refundable option fee if you don\'t buy', 'Above-market rent payments', 'Seller could sell to someone else if terms violated', 'Property could depreciate'],
    bestFor: 'Those 1-2 years away from qualifying, credit repair needed, saving for down payment',
    example: 'Property worth ₹60L today. You lock in ₹60L price for 3 years. Pay ₹3L option fee + ₹5K/month extra rent = ₹4.8L total credited. If property goes to ₹75L in 3 years, you saved ₹15L. Buy at ₹60L with ₹4.8L already paid.',
    icon: '🔑',
    category: 'Financing',
    difficulty: 'Intermediate',
    potentialSaving: 'Lock in price before appreciation',
  },
  {
    id: 5,
    title: 'Subject-To Deal',
    tagline: 'Take over seller\'s existing mortgage payments',
    description: 'Instead of getting a new loan, you take over the seller\'s existing mortgage payments. The loan stays in the seller\'s name, but you get the property. This works best when sellers have low-interest mortgages from years ago and are desperate to sell quickly.',
    howItWorks: [
      'Find a seller with an existing low-interest mortgage',
      'Take over their payments "subject to" the existing loan',
      'You pay their EMI directly each month',
      'Get title/deed transferred to your name',
      'Seller\'s name stays on loan but you own the property',
    ],
    pros: ['Take over 3-4% interest rates from years ago', 'No new loan application or closing costs', 'Extremely fast closing', 'Available for distressed sellers'],
    cons: ['Due-on-sale clause technically allows bank to call loan', 'Seller\'s name remains on loan', 'Complex legal structure', 'Not all mortgages are assumable'],
    bestFor: 'Advanced investors, distressed seller situations, low-rate environments',
    example: 'Seller has ₹40L remaining on their mortgage at 7% (old rate). Current market rate is 9.5%. Their EMI is ₹26,580 vs new loan would be ₹33,540. You save ₹6,960/month = ₹12.5L+ over 15 years just from the rate difference.',
    icon: '📋',
    category: 'Advanced Strategy',
    difficulty: 'Advanced',
    potentialSaving: 'Save 2-4% on interest vs market rates',
  },
  {
    id: 6,
    title: 'ADU Strategy (Granny Flat)',
    tagline: 'Build a rental unit in your backyard or basement',
    description: 'Add an Accessory Dwelling Unit (ADU) to your existing property — a small independent unit in the backyard, basement, or garage conversion. Rent it out for passive income. Many cities are now relaxing ADU rules to address housing shortages.',
    howItWorks: [
      'Check local ADU/zoning regulations (increasingly relaxed)',
      'Build a 300-800 sq ft unit in backyard or convert basement/garage',
      'Costs ₹8-20L depending on type and location',
      'Rent it out at ₹10-30K/month depending on city',
      'Rental income covers your EMI AND builds separate equity',
    ],
    pros: ['Massive rental income from your existing property', 'Increases main property value by 20-30%', 'Housing for family members option', 'Separation from main house for privacy'],
    cons: ['High upfront construction cost', 'Zoning/permitting challenges', 'HOA restrictions may apply', 'Utilities setup needed'],
    bestFor: 'Homeowners with extra land/basement, long-term holders',
    example: 'Spend ₹12L building an ADU in Pune. Rent it for ₹18K/month = ₹2.16L/year. Your property value increases by ₹15-20L. ROI: 18% annually just from rent alone, not counting appreciation.',
    icon: '🏗️',
    category: 'Property Strategy',
    difficulty: 'Intermediate',
    potentialSaving: 'Generate ₹1-3L/year passive income',
  },
  {
    id: 7,
    title: 'Wholesaling (Zero Capital Strategy)',
    tagline: 'Find deals, assign contracts, earn ₹2-10L per deal',
    description: 'Find distressed properties, get them under contract at below-market prices, and assign/sell that contract to an investor for a fee. Zero capital needed — just hustle and market knowledge. The fastest way to earn in real estate without owning property.',
    howItWorks: [
      'Find motivated sellers (distressed,Inherited, urgent relocation)',
      'Get property under contract at 60-70% of market value',
      'Find a cash buyer/investor who wants the deal',
      'Assign your contract to them for ₹2-10L assignment fee',
      'Close quickly — turn over in 2-4 weeks',
    ],
    pros: ['Zero capital required', 'Can earn ₹2-10L per deal', 'No credit check, no loan needed', 'Learn the market deeply'],
    cons: ['Requires strong negotiation skills', 'Need buyer network', 'Time-intensive prospecting', 'Some states have wholesaling restrictions'],
    bestFor: 'Hustlers, sales people, those with zero capital but high energy',
    example: 'Find a distressed seller wanting ₹40L for a ₹55L property. Assign contract to investor for ₹44L. Your assignment fee: ₹4L. Do 2 deals/month = ₹8L/month. Zero rupees invested.',
    icon: '⚡',
    category: 'Zero Capital',
    difficulty: 'Intermediate',
    potentialSaving: 'Earn ₹5-50L/year with zero investment',
  },
  {
    id: 8,
    title: 'Home Equity Loan / Loan Against Property',
    tagline: 'Use your existing property to fund the next one',
    description: 'If you already own a property that has appreciated, take a loan against its current value (up to 70-80% LTV). Use that cash as down payment for your next property. This is how experienced investors scale their portfolio without selling existing assets.',
    howItWorks: [
      'Get your property re-appraised at current market value',
      'Apply for Loan Against Property (LAP) at 70-80% of current value',
      'LAP interest rates are lower than personal loans (8.5-11%)',
      'Use LAP funds as down payment for next property',
      'Rental from new property covers LAP EMI + new property EMI',
    ],
    pros: ['Lower interest than personal loans (8.5-11% vs 15-24%)', 'Keep your existing property while scaling', 'Tax-deductible if used for investment', 'Quick disbursement (3-7 days)'],
    cons: ['Your existing property is collateral (risk of loss)', 'EMI burden increases significantly', 'Property value drop could trigger margin call', 'Processing fees 1-2%'],
    bestFor: 'Existing property owners with significant equity, portfolio builders',
    example: 'Your ₹50L flat is now worth ₹80L. Take LAP at 70% = ₹56L. Use ₹15L as down payment for a ₹75L second property. Rent from both properties covers both EMIs. You now own ₹1.55Cr in property with minimal cash out of pocket.',
    icon: '💎',
    category: 'Leverage',
    difficulty: 'Intermediate',
    potentialSaving: 'Scale portfolio 3-5x faster',
  },
  {
    id: 9,
    title: 'Co-Living / Room Rental Strategy',
    tagline: 'Rent by the room, not by the unit — 40-70% more income',
    description: 'Instead of renting a 3BHK to one family for ₹25K, rent individual rooms to working professionals/students for ₹10-12K each = ₹30-36K total. This strategy works extremely well in IT hubs, college towns, and metro cities.',
    howItWorks: [
      'Buy/rent a 3-4 BHK property in a high-demand area',
      'Furnish each room with bed, wardrobe, desk',
      'Rent rooms individually to professionals/students',
      'Provide WiFi, cleaning, basic amenities as premium',
      'Total income is 40-70% higher than single-tenant rent',
    ],
    pros: ['40-70% higher rental income', 'Lower vacancy risk (one empty room ≠ full vacancy)', 'Works in any market', 'Can charge premium for furnished rooms'],
    cons: ['More management intensive', 'Tenant conflicts possible', 'Higher furnishing costs', 'Some cities have co-living regulations'],
    bestFor: 'Properties near IT parks, colleges, hospitals, metro stations',
    example: '3BHK in Bangalore IT corridor: Single tenant = ₹28K/month. Room-by-room: 3 rooms × ₹12K = ₹36K/month. Extra ₹8K/month = ₹96K/year extra. Over 10 years = ₹9.6L additional income from the SAME property.',
    icon: '🛏️',
    category: 'Rental Optimization',
    difficulty: 'Beginner',
    potentialSaving: '40-70% more rental income',
  },
  {
    id: 10,
    title: 'Tax-Free Property Exchange (1031 Exchange)',
    tagline: 'Sell and buy property WITHOUT paying capital gains tax',
    description: 'In the US (and similar structures exist in India under Section 54/54F), you can sell an investment property and reinvest the proceeds into a "like-kind" property WITHOUT paying capital gains tax. This lets you upgrade properties tax-free, building wealth exponentially.',
    howItWorks: [
      'Sell your investment property',
      'Within 45 days: identify replacement property',
      'Within 180 days: close on replacement property',
      'Reinvest ALL proceeds into the new property',
      'Pay ZERO capital gains tax on the sale',
      'Repeat every time you upgrade — legally defer tax forever',
    ],
    pros: ['Defer capital gains tax indefinitely', 'Upgrade to better properties tax-free', 'Build a massive portfolio without tax drag', 'Upon death, heirs get stepped-up basis (potentially zero tax)'],
    cons: ['Strict 45/180 day deadlines', 'Must reinvest ALL proceeds', 'Only for investment properties (not primary residence in India)', 'Complex paperwork'],
    bestFor: 'Investors with ₹50L+ gains, portfolio upgraders',
    example: 'Bought property for ₹30L, now worth ₹70L. Capital gain = ₹40L. Without 1031: pay 20% tax = ₹8L lost. With 1031: reinvest full ₹70L into a bigger property. That ₹8L stays invested and compounds for decades.',
    icon: '📊',
    category: 'Tax Strategy',
    difficulty: 'Advanced',
    potentialSaving: 'Save 15-30% in capital gains tax',
  },
  {
    id: 11,
    title: 'Seller Concessions & Negotiation Hacks',
    tagline: 'Get the seller to pay YOUR closing costs',
    description: 'Instead of negotiating only on price, negotiate for seller concessions — where the seller pays your closing costs, repairs, or even gives you a credit. In buyer\'s markets, sellers often prefer giving concessions over reducing price.',
    howItWorks: [
      'In your offer, request 2-3% seller concession for closing costs',
      'Seller keeps their asking price (ego preserved) but gives you credit',
      'Use the credit for: closing costs, rate buydowns, repairs',
      'Net effect: you pay less out of pocket',
      'Also negotiate: free furnishings, parking, maintenance deposits',
    ],
    pros: ['Reduce out-of-pocket costs by ₹2-5L', 'Seller keeps asking price (win-win)', 'Can include repairs in negotiation', 'Works in any market condition'],
    cons: ['Seller may reject or counter', 'Concession limits based on loan type', 'May need to offer higher price to compensate', 'Not all lenders allow large concessions'],
    bestFor: 'Every buyer — this should be standard practice',
    example: 'Property price: ₹60L. You offer ₹60L with 3% seller concession (₹1.8L). Seller gets their price, you get ₹1.8L toward closing costs. Your out-of-pocket drops from ₹5L to ₹3.2L. Same price, but you save ₹1.8L.',
    icon: '🎯',
    category: 'Negotiation',
    difficulty: 'Beginner',
    potentialSaving: 'Save ₹1-5L on closing costs',
  },
  {
    id: 12,
    title: 'Fractional Ownership & REITs',
    tagline: 'Own premium properties with just ₹10-25L',
    description: 'Instead of buying one full property, invest in fractional ownership of commercial real estate (office buildings, warehouses, malls) through platforms like Strata, hBits, or REITs. Earn rental income + appreciation without the hassle of being a landlord.',
    howItWorks: [
      'Choose a commercial property on a fractional platform',
      'Buy shares starting from ₹10-25L',
      'Earn quarterly rental income distributions',
      'Property appreciates over time — your shares gain value',
      'Sell shares on secondary market when you want to exit',
    ],
    pros: ['Own premium commercial real estate cheaply', 'No landlord headaches', 'Professional management', 'Diversify across multiple properties'],
    cons: ['Lower control over the property', 'Platform fees (1-2% annually)', 'Liquidity can be limited', 'Returns depend on platform quality'],
    bestFor: 'Passive investors, those with ₹10-50L, NRI investors',
    example: 'Invest ₹15L in a warehouse fractional ownership earning 8-10% annual rental yield = ₹1.2-1.5L/year passive income. Property appreciates 5-7%/year. Total return: 13-17% annually with zero landlord work.',
    icon: '📈',
    category: 'Passive Investing',
    difficulty: 'Beginner',
    potentialSaving: 'Earn 13-17% with zero effort',
  },
  {
    id: 13,
    title: 'Land Banking Strategy',
    tagline: 'Buy land on the outskirts NOW, sell when the city reaches it',
    description: 'Identify the direction a city is growing, buy agricultural or undeveloped land on the outskirts at ₹500-2000/sq ft, hold for 5-10 years, and sell when infrastructure (highway, metro, IT park) reaches that area. Returns of 3-10x are common in India\'s rapidly growing cities.',
    howItWorks: [
      'Study city master plans and infrastructure projects',
      'Identify upcoming corridors (new highways, metro extensions, airports)',
      'Buy land 5-15 km beyond current city limits',
      'Hold for 5-15 years as city expands',
      'Sell to developers at 3-10x your purchase price',
    ],
    pros: ['Extremely high returns (3-10x)', 'Low holding cost (no EMI if bought outright)', 'No maintenance or tenant issues', 'Scarcity — land is finite'],
    cons: ['Illiquid — hard to sell quickly', 'No rental income during holding period', 'Zoning/title risks in rural areas', 'Requires patience and research'],
    bestFor: 'Patient investors with ₹5-20L, those who study urban planning',
    example: 'Buy 2000 sq ft land near upcoming Pune ring road at ₹800/sq ft = ₹16L. Hold 7 years. After ring road completion, land value: ₹4,000/sq ft = ₹80L. Profit: ₹64L on ₹16L investment = 4x return. Annualized: ~22%.',
    icon: '🗺️',
    category: 'Land Strategy',
    difficulty: 'Intermediate',
    potentialSaving: '3-10x returns over 5-15 years',
  },
  {
    id: 14,
    title: 'EMI Optimization — Prepayment Strategy',
    tagline: 'One extra EMI per year saves ₹10-20L over loan tenure',
    description: 'Instead of investing extra money elsewhere, prepay your home loan. One extra EMI per year (13 instead of 12) can reduce your loan tenure by 4-6 years and save lakhs in interest. This is the highest "guaranteed return" you can get.',
    howItWorks: [
      'Pay one extra EMI per year (use bonus, tax refunds, etc.)',
      'The entire extra payment goes to principal reduction',
      'Reduces total interest dramatically',
      'Loan closes 4-6 years early',
      'Guaranteed "return" equal to your loan interest rate',
    ],
    pros: ['Guaranteed return = your loan interest rate (8-9%)', 'Reduces loan tenure by 4-6 years', 'Saves ₹10-20L in interest on a ₹50L loan', 'No risk, no market dependency'],
    cons: ['Reduces liquidity (money locked in property)', 'No tax benefit if you prepay fully', 'Opportunity cost if investments earn more', 'Some banks charge prepayment penalty'],
    bestFor: 'Everyone with a home loan — this is the #1 wealth hack',
    example: '₹50L home loan at 8.5% for 20 years. Total interest: ₹54L. Pay one extra EMI/year (₹43,587). Loan finishes in 15.5 years instead of 20. Interest saved: ₹18.5L. That\'s a guaranteed 8.5% return — better than most FDs.',
    icon: '💰',
    category: 'Loan Optimization',
    difficulty: 'Beginner',
    potentialSaving: 'Save ₹10-25L in interest',
  },
  {
    id: 15,
    title: 'Vacation Rental / Airbnb Arbitrage',
    tagline: 'Rent a property, list it on Airbnb, pocket the difference',
    description: 'Rent a furnished apartment on a long-term lease, then sublease it on Airbnb/Booking.com at daily rates. The difference between your monthly rent and Airbnb income is pure profit. Works best in tourist destinations, metro cities, and near hospitals/IT parks.',
    howItWorks: [
      'Rent a well-located 1-2 BHK on long-term lease (₹15-25K/month)',
      'Furnish it nicely (₹1-2L one-time investment)',
      'List on Airbnb, Booking.com, MakeMyTrip',
      'Charge ₹2,000-4,000/night (₹60-120K/month)',
      'After expenses: net profit of ₹30-70K/month per unit',
    ],
    pros: ['No property purchase needed', 'High monthly cash flow', 'Scale to multiple units', 'Can start with just ₹3-5L'],
    cons: ['Requires active management/cleaning', 'Seasonal demand fluctuations', 'Some landlords prohibit subleasing', 'Platform fees 15-20%'],
    bestFor: 'Entrepreneurs in tourist/metro cities, side income seekers',
    example: 'Rent a ₹50L apartment for ₹22K/month. Furnish for ₹1.5L. List on Airbnb at ₹2,500/night. 70% occupancy = 21 nights × ₹2,500 = ₹52,500/month. After rent (₹22K) + cleaning (₹8K) + platform fee (₹8K) = net profit ₹14,500/month. Scale to 5 units = ₹72,500/month.',
    icon: '✈️',
    category: 'Rental Optimization',
    difficulty: 'Intermediate',
    potentialSaving: 'Earn ₹15-70K/month per unit',
  },
  {
    id: 16,
    title: 'Joint Venture (JV) Partnership',
    tagline: 'Partner with someone who has money, you bring the deal',
    description: 'Find a property deal, partner with someone who has capital but no time. You handle everything (finding, negotiating, managing), they provide the money. Split profits 50/50 or 60/40. This is how most institutional real estate works — you can do it at individual level too.',
    howItWorks: [
      'Find an undervalued property deal',
      'Create a partnership agreement (who puts money, who manages)',
      'Partner provides capital, you manage the investment',
      'Split rental income and appreciation profits',
      'Formalize with a simple partnership deed',
    ],
    pros: ['Access to larger deals with less capital', 'Leverage partner\'s experience/money', 'Risk sharing', 'Can do bigger projects (plots, commercial)'],
    cons: ['Profit sharing (you don\'t keep 100%)', 'Potential partner disputes', 'Need clear legal agreement', 'Trust is critical'],
    bestFor: 'Deal finders with limited capital, first-time commercial investors',
    example: 'You find a ₹1Cr commercial shop available for ₹80L (distressed). Partner puts ₹80L, you manage tenant finding and maintenance. Rent: ₹60K/month = ₹7.2L/year. Split 50/50: you earn ₹3.6L/year for zero capital invested. Partner earns 4.5% yield + appreciation.',
    icon: '🤝',
    category: 'Partnership',
    difficulty: 'Intermediate',
    potentialSaving: 'Earn without using your own capital',
  },
]

const CATEGORIES = ['All', 'Property Strategy', 'Financing', 'Zero Capital', 'Rental Optimization', 'Tax Strategy', 'Passive Investing', 'Land Strategy', 'Loan Optimization', 'Negotiation', 'Partnership', 'Leverage', 'Advanced Strategy']

const DIFFICULTY_COLORS = {
  Beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
  Advanced: 'bg-red-50 text-red-700 border-red-200',
}

export default function CreativeFinanceTips() {
  const [filter, setFilter] = useState('All')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [showCalculator, setShowCalculator] = useState(false)

  const filtered = filter === 'All' ? STRATEGIES : STRATEGIES.filter(s => s.category === filter)
  const expanded = STRATEGIES.find(s => s.id === expandedId)

  return (
    <section className="mt-16">
      {/* Section Header */}
      <div className="text-center mb-10">
        <span className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-full text-emerald-700 text-sm font-semibold mb-3">
          💡 Deep Research: Creative Finance Tips & Strategies
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1e3a5f] mb-3">
          16 Proven Strategies to Buy Property with Less Money
        </h2>
        <p className="text-gray-500 max-w-3xl mx-auto text-sm leading-relaxed">
          Deep-researched creative financing strategies used by successful real estate investors worldwide.
          From house hacking to BRRRR, seller financing to land banking — these methods can help you
          buy property with 50-100% less capital than traditional methods.
        </p>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 text-white text-center">
          <div className="text-2xl font-bold">16</div>
          <div className="text-xs text-white/80">Strategies</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 text-white text-center">
          <div className="text-2xl font-bold">₹0</div>
          <div className="text-xs text-white/80">Minimum Capital</div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 text-white text-center">
          <div className="text-2xl font-bold">10x</div>
          <div className="text-xs text-white/80">Max ROI Potential</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-4 text-white text-center">
          <div className="text-2xl font-bold">3</div>
          <div className="text-xs text-white/80">Difficulty Levels</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => { setFilter(cat); setExpandedId(null) }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
              filter === cat
                ? 'bg-[#1e3a5f] text-white border-[#1e3a5f] shadow-md'
                : 'bg-white text-gray-600 border-gray-200 hover:border-[#1e3a5f]/30 hover:text-[#1e3a5f]'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Strategy Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(strategy => (
          <div key={strategy.id}
            className={`bg-white rounded-2xl border-2 overflow-hidden transition-all cursor-pointer group ${
              expandedId === strategy.id
                ? 'border-[#1e3a5f] shadow-xl ring-2 ring-[#1e3a5f]/20'
                : 'border-gray-100 hover:border-[#1e3a5f]/30 hover:shadow-lg'
            }`}
            onClick={() => setExpandedId(expandedId === strategy.id ? null : strategy.id)}
          >
            {/* Card Header */}
            <div className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl flex-shrink-0">{strategy.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#1e3a5f] text-base leading-tight">{strategy.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 italic">{strategy.tagline}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${DIFFICULTY_COLORS[strategy.difficulty]}`}>
                  {strategy.difficulty}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#1e3a5f]/5 text-[#1e3a5f] font-medium">
                  {strategy.category}
                </span>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{strategy.description}</p>

              {/* Potential Saving Badge */}
              <div className="mt-3 px-3 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                <p className="text-xs font-semibold text-emerald-700">💰 {strategy.potentialSaving}</p>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedId === strategy.id && (
              <div className="border-t border-gray-100 bg-gray-50/50">
                {/* How It Works */}
                <div className="p-5">
                  <h4 className="font-bold text-[#1e3a5f] text-sm mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#1e3a5f] text-white text-xs flex items-center justify-center">?</span>
                    How It Works
                  </h4>
                  <ol className="space-y-2">
                    {strategy.howItWorks.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="w-5 h-5 rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Pros & Cons */}
                <div className="px-5 pb-4 grid sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-emerald-700 text-xs mb-2">✅ PROS</h4>
                    <ul className="space-y-1.5">
                      {strategy.pros.map((pro, i) => (
                        <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                          <span className="text-emerald-500 mt-0.5">•</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-red-600 text-xs mb-2">⚠️ CONS</h4>
                    <ul className="space-y-1.5">
                      {strategy.cons.map((con, i) => (
                        <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                          <span className="text-red-400 mt-0.5">•</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Best For */}
                <div className="px-5 pb-4">
                  <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                    <p className="text-xs font-semibold text-blue-700 mb-1">👤 Best For:</p>
                    <p className="text-xs text-blue-600">{strategy.bestFor}</p>
                  </div>
                </div>

                {/* Real Example */}
                <div className="px-5 pb-5">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                    <p className="text-xs font-bold text-amber-800 mb-2 flex items-center gap-1.5">
                      📊 Real-World Example
                    </p>
                    <p className="text-xs text-amber-900 leading-relaxed">{strategy.example}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Expand/Collapse Indicator */}
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-center">
              <span className="text-xs text-gray-400 group-hover:text-[#1e3a5f] transition-colors">
                {expandedId === strategy.id ? '▲ Collapse' : '▼ Click to expand'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] rounded-2xl p-8 text-center text-white">
        <h3 className="text-xl font-bold mb-2">🎯 Which Strategy is Right for You?</h3>
        <p className="text-white/70 text-sm mb-4 max-w-2xl mx-auto">
          Start with Beginner strategies if you're new. Most successful investors combine 2-3 strategies.
          The best strategy is the one you actually execute.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <div className="px-4 py-2 bg-white/10 rounded-xl text-sm">
            🟢 <strong>Beginner:</strong> House Hacking, Co-Living, EMI Optimization
          </div>
          <div className="px-4 py-2 bg-white/10 rounded-xl text-sm">
            🟡 <strong>Intermediate:</strong> Seller Financing, Rent-to-Own, ADU, Wholesaling
          </div>
          <div className="px-4 py-2 bg-white/10 rounded-xl text-sm">
            🔴 <strong>Advanced:</strong> BRRRR, Subject-To, 1031 Exchange
          </div>
        </div>
      </div>
    </section>
  )
}

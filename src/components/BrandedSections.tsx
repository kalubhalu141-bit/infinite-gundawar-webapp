'use client'

import { getTodaysTestimonials, getTodaysTip, getTodaysOffer, getDailyStats, CUSTOMER_BENEFITS, FREE_TOOLS } from '@/lib/daily-content'

// ─── Branded Header Section ───
export function BrandedHeader({ title, subtitle, icon }: { title: string; subtitle: string; icon?: string }) {
  return (
    <section className="relative pt-28 pb-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f] to-[#2c5282]" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#d4a843] rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#2c5282] rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-4">
          <img src="/logo.png" alt="Infinite Gundawar" className="h-14 md:h-16 object-contain" />
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 mb-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/80 text-xs font-medium">Infinite Gundawar Business Pvt. Ltd.</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{icon && <span className="mr-2">{icon}</span>}{title}</h1>
            <p className="text-white/60 text-sm mt-1">{subtitle}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Stats Bar ───
export function StatsBar() {
  const stats = getDailyStats()
  return (
    <div className="bg-white border-b border-gray-100 py-3">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-green-500 font-bold">📊</span>
            <span className="text-gray-500">Leads Scraped:</span>
            <span className="font-bold text-[#1e3a5f]">{(stats.leadsScraped / 1000000).toFixed(1)}M+</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-blue-500 font-bold">📧</span>
            <span className="text-gray-500">Emails Sent:</span>
            <span className="font-bold text-[#1e3a5f]">{(stats.emailsSent / 1000000).toFixed(1)}M+</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-purple-500 font-bold">📞</span>
            <span className="text-gray-500">Phones Extracted:</span>
            <span className="font-bold text-[#1e3a5f]">{(stats.phonesExtracted / 1000000).toFixed(1)}M+</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-orange-500 font-bold">🌍</span>
            <span className="text-gray-500">Countries:</span>
            <span className="font-bold text-[#1e3a5f]">{stats.countriesCovered}+</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-pink-500 font-bold">👥</span>
            <span className="text-gray-500">Happy Customers:</span>
            <span className="font-bold text-[#1e3a5f]">{stats.happyCustomers.toLocaleString()}+</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-teal-500 font-bold">✅</span>
            <span className="text-gray-500">Accuracy:</span>
            <span className="font-bold text-[#1e3a5f]">{stats.dataAccuracy}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Customer Testimonials ───
export function TestimonialsSection() {
  const testimonials = getTodaysTestimonials()
  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-2 bg-[#1e3a5f]/10 text-[#1e3a5f] rounded-full text-sm font-medium mb-3">💬 Customer Love</span>
          <h2 className="text-3xl font-bold text-[#1e3a5f] mb-2">What Our Customers Say</h2>
          <p className="text-gray-500">Trusted by 12,500+ businesses worldwide</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1e3a5f] to-[#2c5282] rounded-full flex items-center justify-center text-2xl">{t.avatar}</div>
                <div>
                  <h4 className="font-bold text-[#1e3a5f] text-sm">{t.name}</h4>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: t.rating }).map((_, j) => <span key={j} className="text-yellow-400 text-sm">⭐</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Customer Benefits ───
export function BenefitsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-3">🎯 Why Choose Us</span>
          <h2 className="text-3xl font-bold text-[#1e3a5f] mb-2">Benefits That Matter</h2>
          <p className="text-gray-500">Everything you need to grow your business</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CUSTOMER_BENEFITS.map((b, i) => (
            <div key={i} className="p-5 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-gray-100 hover:shadow-lg transition-all text-center">
              <div className="text-3xl mb-2">{b.icon}</div>
              <h3 className="font-bold text-[#1e3a5f] text-sm mb-1">{b.title}</h3>
              <p className="text-xs text-gray-500 mb-2">{b.desc}</p>
              <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-bold">{b.savings}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Free Tools Section ───
export function FreeToolsSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-[#1e3a5f] to-[#2c5282]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-2 bg-white/10 text-[#d4a843] rounded-full text-sm font-medium mb-3">🎁 100% Free</span>
          <h2 className="text-3xl font-bold text-white mb-2">Free Tools for You</h2>
          <p className="text-white/60">No signup required. Use anytime, anywhere.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FREE_TOOLS.map((t, i) => (
            <a key={i} href={t.link} className="p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all text-center group">
              <div className="text-3xl mb-2">{t.icon}</div>
              <h3 className="font-bold text-white text-sm mb-1">{t.title}</h3>
              <p className="text-xs text-white/60 mb-2">{t.desc}</p>
              <span className="inline-block px-2 py-0.5 bg-[#d4a843] text-[#1e3a5f] rounded text-xs font-bold">{t.value}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Daily Tip & Offer ───
export function DailyTipOffer() {
  const tip = getTodaysTip() as any
  const offer = getTodaysOffer() as any
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{tip.icon}</span>
            <span className="text-xs font-bold text-blue-600 uppercase">{tip.category} Tip</span>
          </div>
          <p className="text-sm text-gray-700">{tip.tip}</p>
        </div>
        <div className="p-4 bg-gradient-to-r from-[#d4a843]/10 to-[#d4a843]/5 rounded-xl border border-[#d4a843]/20">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-[#d4a843] uppercase">{offer.title}</span>
            <span className="px-2 py-0.5 bg-[#d4a843] text-white rounded text-xs font-bold">{offer.discount}</span>
          </div>
          <p className="text-sm text-gray-700 mb-2">{offer.desc}</p>
          <div className="flex items-center justify-between">
            <code className="px-2 py-0.5 bg-white rounded text-xs font-mono text-[#1e3a5f] font-bold">{offer.code}</code>
            <span className="text-xs text-gray-400">Valid {offer.validDays} days</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Trust Badges ───
export function TrustBadges() {
  return (
    <div className="py-8 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-8 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔒</span>
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <span>GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🛡️</span>
            <span>Data Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <span>99.9% Uptime</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🌍</span>
            <span>195+ Countries</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">📞</span>
            <span>24/7 Support</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">💰</span>
            <span>Money Back Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── CTA Section ───
export function CTASection({ title, desc, primaryBtn, secondaryBtn }: { title: string; desc: string; primaryBtn: { text: string; href: string }; secondaryBtn?: { text: string; href: string } }) {
  return (
    <section className="py-16 bg-gradient-to-r from-[#1e3a5f] to-[#2c5282]">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <img src="/logo.png" alt="Infinite Gundawar" className="h-16 object-contain mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-white mb-3">{title}</h2>
        <p className="text-white/70 mb-8 max-w-2xl mx-auto">{desc}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href={primaryBtn.href} className="px-8 py-4 gradient-accent text-[#1e3a5f] font-bold rounded-xl hover:shadow-lg hover:shadow-[#d4a843]/30 transition-all">
            {primaryBtn.text}
          </a>
          {secondaryBtn && (
            <a href={secondaryBtn.href} className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all">
              {secondaryBtn.text}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

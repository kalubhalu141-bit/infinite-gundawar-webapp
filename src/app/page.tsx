'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AIConcierge from '@/components/AIConcierge'
import { FloatingBots } from '@/components/FloatingBots'
import AnimatedSection from '@/components/AnimatedSection'
import DailyInsight from '@/components/DailyInsight'
import { ScrollProgress } from '@/components/ui'


/* ─── 3D Card Component ─── */
function Card3D({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative group ${className}`}>
      <div className="relative transition-all duration-500 ease-out group-hover:shadow-2xl">
        {children}
      </div>
    </div>
  )
}

/* ─── Floating 3D Element ─── */
function Floating3D({ className = '', children, delay = 0 }: { className?: string; children: React.ReactNode; delay?: number }) {
  return (
    <div
      className={`absolute ${className}`}
      style={{
        animation: `float6 6s ease-in-out ${delay}s infinite`,
        transform: 'perspective(800px) rotateX(5deg) rotateY(-5deg)',
      }}
    >
      {children}
    </div>
  )
}

/* ─── Hero ─── */
function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center bg-aurora-x overflow-hidden">
      {/* Neural grid + glow (no external video — fully self-contained) */}
      <div className="absolute inset-0 neural-grid opacity-70" />
      <div className="absolute -top-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-[#d4a843]/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 w-[26rem] h-[26rem] rounded-full bg-[#2c5282]/40 blur-3xl" />

      {/* Floating glass cards */}
      <Floating3D className="top-24 right-[8%] hidden lg:block" delay={0}>
        <div className="w-32 h-32 rounded-2xl glass flex items-center justify-center text-4xl"
          style={{ boxShadow: '0 25px 50px -12px rgba(212,168,67,0.25)' }}>🤖</div>
      </Floating3D>
      <Floating3D className="bottom-36 right-[18%] hidden lg:block" delay={1.5}>
        <div className="w-24 h-24 rounded-full glass flex items-center justify-center text-3xl">♾️</div>
      </Floating3D>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-3xl">
          <AnimatedSection>
            <div className="mb-7">
              <img src="/logo-full.png" alt="Infinite Gundawar Business Private Limited" className="h-20 md:h-24 object-contain drop-shadow-lg" />
            </div>
            <span className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-[#d4a843] text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
              Free On-Device AI · No API Keys · 100% Private
            </span>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Building Tomorrow's
              <span className="text-gradient text-glow"> Infrastructure</span>,
              <br />Trading Today
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <p className="text-lg text-white/75 mb-10 max-w-2xl leading-relaxed">
              A diversified enterprise — infrastructure, global trade, education, Ayurveda, finance & digital marketing — now supercharged with <strong className="text-[#d4a843]">free on-device AI</strong> that runs privately in your browser.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={300}>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#services" className="btn-ai">Our Services</a>
              <a href="/ai-studio" className="btn-ghost-ai">Try the AI Studio →</a>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={400}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-20">
            {[
              { num: '4+', label: 'Business Verticals' },
              { num: '15+', label: 'Countries Trading' },
              { num: '14+', label: 'Free AI Tools' },
              { num: '10k+', label: 'Herbs Indexed' },
            ].map((stat, i) => (
              <Card3D key={stat.label}>
                <div className="text-center p-6 glass rounded-2xl h-full"
                  style={{ transform: `perspective(600px) rotateY(${i % 2 === 0 ? '-3deg' : '3deg'})`, transition: 'transform 0.5s ease' }}>
                  <div className="text-3xl font-bold text-[#d4a843] mb-1 text-glow">{stat.num}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </div>
              </Card3D>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

/* ─── About ─── */
function About() {
  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1e3a5f]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#d4a843]/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection>
            <span className="inline-block px-4 py-2 bg-[#1e3a5f]/10 text-[#1e3a5f] rounded-full text-sm font-medium mb-4">About Us</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] mb-6">
              Infinite Gundawar Business Private Limited
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Incorporated under the Companies Act, 2013, and registered in Maharashtra, <strong>Infinite Gundawar Business Private Limited</strong> is a dynamic company with a diverse portfolio spanning infrastructure development, import/export trading, educational services, and digital marketing.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              With a vision rooted in innovation and commitment to quality, we serve clients across India and beyond. Our multi-sector approach allows us to deliver comprehensive solutions that meet the evolving needs of businesses and communities.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🏗️', title: 'Infrastructure', desc: 'Building the future with quality construction', color: 'from-blue-500/10 to-blue-600/5' },
                { icon: '🌐', title: 'Global Trade', desc: 'Connecting markets worldwide', color: 'from-emerald-500/10 to-emerald-600/5' },
                { icon: '📚', title: 'Education', desc: 'Empowering through knowledge', color: 'from-purple-500/10 to-purple-600/5' },
                { icon: '📱', title: 'Digital Marketing', desc: 'Growing brands in the digital age', color: 'from-orange-500/10 to-orange-600/5' },
              ].map((item, i) => (
                <Card3D key={item.title}>
                  <div className={`flex items-start space-x-3 p-4 rounded-xl bg-gradient-to-br ${item.color} border border-gray-100`}
                    style={{ transform: `perspective(500px) rotateY(${i % 2 === 0 ? '-2deg' : '2deg'})` }}>
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className="font-semibold text-[#0f172a] text-sm">{item.title}</h4>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                </Card3D>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="relative">
              {/* 3D Video Showcase — Drone city footage */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl"
                style={{ transform: 'perspective(1000px) rotateY(-3deg) rotateX(2deg)', transition: 'transform 0.5s ease' }}>
                <video
                  autoPlay muted loop playsInline
                  className="w-full h-80 object-cover"
                  poster="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=450&fit=crop"
                >
                  <source src="https://cdn.pixabay.com/video/2023/09/01/178458-860490658_large.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/60 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <p className="text-sm font-medium text-[#d4a843]">Our Vision</p>
                    <p className="text-lg font-bold">Building Tomorrow, Today</p>
                  </div>
                </div>
              </div>

              {/* Floating 3D accent cards */}
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl gradient-accent shadow-lg flex items-center justify-center"
                style={{ transform: 'perspective(400px) rotateY(15deg) rotateX(-5deg)', animation: 'float6 5s ease-in-out infinite' }}>
                <span className="text-2xl">🚀</span>
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-xl bg-[#1e3a5f] shadow-lg flex items-center justify-center"
                style={{ transform: 'perspective(400px) rotateY(-15deg) rotateX(5deg)', animation: 'float6 7s ease-in-out 1s infinite' }}>
                <span className="text-xl">💼</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}

/* ─── Services ─── */
function Services() {
  const services = [
    {
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
      title: 'Infrastructure & Real Estate',
      desc: 'Leading infrastructure developers, builders, promoters, and contractors. We handle residential, commercial, and industrial projects including roads, bridges, townships, and more.',
      features: ['Residential & Commercial Construction', 'Township Development', 'Infrastructure Projects (BOT)', 'Property Management & Consultancy'],
      video: 'https://cdn.pixabay.com/video/2020/07/30/45349-445009445_large.mp4',
      poster: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop',
      gradient: 'from-blue-600 to-blue-800',
    },
    {
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      title: 'Import/Export Trading',
      desc: 'Comprehensive trading solutions across consumer goods, electronics, industrial products, agricultural commodities, technology, fashion, and lifestyle products.',
      features: ['Consumer & Industrial Goods', 'Agricultural Commodities', 'Technology & Fashion Products', 'Logistics & Distribution'],
      video: 'https://cdn.pixabay.com/video/2019/07/04/25039-345534498_large.mp4',
      poster: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&h=400&fit=crop',
      gradient: 'from-emerald-600 to-emerald-800',
    },
    {
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
      title: 'Coaching & Education',
      desc: 'Providing quality coaching, training, and educational services including skill development, professional certification prep, entrance exam coaching, and competitive exam training.',
      features: ['Skill Development Programs', 'Professional Certification Prep', 'Competitive Exam Coaching', 'Online Learning Platforms'],
      video: 'https://cdn.pixabay.com/video/2020/05/25/40130-424971100_large.mp4',
      poster: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop',
      gradient: 'from-purple-600 to-purple-800',
    },
    {
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>,
      title: 'Digital Marketing',
      desc: 'Full-spectrum digital marketing and advertising services including SEO, social media marketing, branding, market research, and promotional campaigns to boost your business visibility.',
      features: ['SEO & Social Media Marketing', 'Brand Strategy & Design', 'Market Research & Analysis', 'Promotional Campaigns'],
      video: 'https://cdn.pixabay.com/video/2022/03/21/111255-691496110_large.mp4',
      poster: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      gradient: 'from-orange-600 to-orange-800',
    },
    {
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>,
      title: 'Interior Design & Planning',
      desc: 'Complete interior design solutions for homes, offices, and commercial spaces. From concept to execution with 3D visualization, Vastu-compliant layouts, and premium material selection.',
      features: ['3D Home Layout Design', 'Vastu-Compliant Planning', 'Material & Furniture Selection', 'Space Optimization & Renovation'],
      video: 'https://cdn.pixabay.com/video/2017/01/09/7194-200986888_large.mp4',
      poster: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=400&fit=crop',
      gradient: 'from-rose-600 to-pink-800',
    },
    {
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
      title: 'AI Tools & Career Hub',
      desc: 'Access cutting-edge AI tools, daily AI updates, career opportunities worldwide, and free career counselling. Stay ahead with the latest in AI and business.',
      features: ['AI Tools Directory', 'Live AI Updates', 'Global Career Opportunities', 'Free Career Counselling'],
      video: 'https://cdn.pixabay.com/video/2020/07/30/45349-445009445_large.mp4',
      poster: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
      gradient: 'from-violet-600 to-purple-800',
    },
  ]

  return (
    <section id="services" className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#1e3a5f] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[#d4a843] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-[#1e3a5f]/10 text-[#1e3a5f] rounded-full text-sm font-medium mb-4">What We Do</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] mb-4">Our Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Diversified business solutions across four key verticals, each delivered with excellence and dedication.</p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <AnimatedSection key={service.title} delay={i * 100}>
              <Card3D>
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 h-full group"
                  style={{ transform: `perspective(800px) rotateY(${i % 2 === 0 ? '-1deg' : '1deg'})`, transition: 'transform 0.5s ease' }}>
                  {/* 3D Video Header */}
                  <div className="relative h-48 overflow-hidden">
                    <video
                      autoPlay muted loop playsInline
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      poster={service.poster}
                    >
                      <source src={service.video} type="video/mp4" />
                    </video>
                    <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient} opacity-70`} />
                    <div className="absolute bottom-4 left-4 flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white">
                        {service.icon}
                      </div>
                      <h3 className="text-white font-bold text-lg">{service.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 leading-relaxed text-sm">{service.desc}</p>
                    <ul className="space-y-2">
                      {service.features.map(f => (
                        <li key={f} className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 text-[#d4a843] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card3D>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── AI Design Studio ─── */
function AIDesignStudio() {
  const [activeDesignBot, setActiveDesignBot] = useState<'home' | 'interior'>('home')
  const [designStep, setDesignStep] = useState(1)
  const [designInput, setDesignInput] = useState('')
  const [designResult, setDesignResult] = useState('')

  const handleDesignGenerate = () => {
    if (!designInput.trim()) return
    setDesignResult('🔄 Generating your design...')
    setTimeout(() => {
      if (activeDesignBot === 'home') {
        setDesignResult(`🏠 **Home Layout Design Generated!**\n\nBased on: "${designInput}"\n\n📐 **Suggested:** 3BHK Modern, 1200 sq ft, Open Kitchen + Living, Vastu compliant\n\n🌐 **Free 3D Tools:**\n• Floorplanner.com — 3D home layouts\n• Planner5D.com — AI home design\n• RoomSketcher.com — Floor plans\n• HomeByMe.com — Free 3D design\n• SweetHome3D.com — Open source\n\n📞 Professional design: +91 79721 40672`)
      } else {
        setDesignResult(`🛋️ **Interior Design Concept!**\n\nBased on: "${designInput}"\n\n🎨 **Theme:** Modern Indian Fusion\n• Living: L-shaped sofa, warm neutrals, brass accents\n• Bedroom: King bed, upholstered headboard, reading nook\n• Kitchen: L-shaped modular, quartz countertop\n\n🌐 **AI Interior Tools:**\n• InteriorAI.com — AI room redesign\n• ReimagineHome.ai — Room transformation\n• RoomGPT.io — Free AI design\n• Collov.ai — AI design assistant\n\n📞 Hire our team: +91 79721 40672`)
      }
    }, 1500)
  }

  return (
    <section className="py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">🤖 AI Design Studio</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] mb-4">AI Home Design & Interior Design</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Generate stunning home layouts and interior designs with AI. Explore free tools and get professional services.</p>
        </AnimatedSection>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-4 text-white">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🎨</span>
                <div><h3 className="font-bold text-sm">AI Design Assistant</h3><p className="text-xs text-indigo-200">Describe your dream space</p></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setActiveDesignBot('home'); setDesignResult('') }} className={`px-3 py-1.5 rounded-full text-xs font-medium ${activeDesignBot === 'home' ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'}`}>🏠 Home Layout</button>
                <button onClick={() => { setActiveDesignBot('interior'); setDesignResult('') }} className={`px-3 py-1.5 rounded-full text-xs font-medium ${activeDesignBot === 'interior' ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'}`}>🛋️ Interior</button>
              </div>
            </div>
            <div className="p-6">
              {designStep === 1 ? (
                <div className="space-y-4">
                  <h4 className="font-bold text-[#0f172a]">Describe Your Space</h4>
                  <textarea rows={4} value={designInput} onChange={e => setDesignInput(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none" placeholder={activeDesignBot === 'home' ? 'e.g., 3BHK apartment, modern style, vastu compliant...' : 'e.g., Living room makeover, modern Indian style...'} />
                  <button onClick={() => { if (designInput.trim()) { setDesignStep(2); handleDesignGenerate() } }} disabled={!designInput.trim()} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-40">Generate Design ✨</button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-[#0f172a] text-sm">AI Generated Result</h4>
                    <button onClick={() => { setDesignStep(1); setDesignResult(''); setDesignInput('') }} className="text-xs text-indigo-600">← Start Over</button>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 max-h-[350px] overflow-y-auto">
                    {designResult ? <pre className="text-sm text-gray-700 whitespace-pre-line font-sans">{designResult}</pre> : (
                      <div className="flex items-center justify-center h-24 text-gray-400 text-sm"><div className="flex gap-1 mr-2"><div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" /><div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} /><div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} /></div>Generating...</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h4 className="font-bold text-[#0f172a] mb-3">🏠 Free 3D Home Design Tools</h4>
              <div className="space-y-2">
                {[{ name: 'Floorplanner', url: 'https://floorplanner.com', desc: 'Create 3D home layouts instantly' },{ name: 'Planner 5D', url: 'https://planner5d.com', desc: 'AI-powered home design' },{ name: 'RoomSketcher', url: 'https://roomsketcher.com', desc: 'Professional floor plans' },{ name: 'HomeByMe', url: 'https://homebyme.com', desc: 'Free 3D home design' },{ name: 'Sweet Home 3D', url: 'https://sweethome3d.com', desc: 'Open source design tool' }].map(tool => (
                  <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition-all group">
                    <div><h5 className="font-medium text-sm text-[#0f172a]">{tool.name}</h5><p className="text-xs text-gray-500">{tool.desc}</p></div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h4 className="font-bold text-[#0f172a] mb-3">🛋️ AI Interior Design Tools</h4>
              <div className="space-y-2">
                {[{ name: 'InteriorAI', url: 'https://interiorai.com', desc: 'AI room redesign from photos' },{ name: 'Reimagine Home', url: 'https://reimaginehome.ai', desc: 'AI room transformation' },{ name: 'RoomGPT', url: 'https://roomgpt.io', desc: 'Free AI room generator' },{ name: 'Collov AI', url: 'https://collov.ai', desc: 'AI design assistant' },{ name: 'Roomstyler', url: 'https://roomstyler.com', desc: '3D room planning' }].map(tool => (
                  <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-purple-50 border border-transparent hover:border-purple-200 transition-all group">
                    <div><h5 className="font-medium text-sm text-[#0f172a]">{tool.name}</h5><p className="text-xs text-gray-500">{tool.desc}</p></div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
              <h4 className="font-bold mb-2">📞 Need Professional Design?</h4>
              <p className="text-sm text-white/80 mb-4">Our architects create stunning, Vastu-compliant designs.</p>
              <div className="flex flex-wrap gap-3">
                <a href="tel:+917972140672" className="px-4 py-2 bg-white text-indigo-700 rounded-lg text-sm font-medium hover:shadow-lg">📞 Call Now</a>
                <a href="mailto:talenthebhai123@gmail.com" className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium hover:bg-white/20">📧 Email</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Portfolio ─── */
function Portfolio() {
  const projects = [
    { title: 'Residential Township', category: 'Infrastructure', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop', video: 'https://cdn.pixabay.com/video/2023/09/01/178458-860490658_large.mp4' },
    { title: 'Global Trade Network', category: 'Trading', img: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&h=400&fit=crop', video: 'https://cdn.pixabay.com/video/2019/07/04/25039-345534498_large.mp4' },
    { title: 'Education Center', category: 'Education', img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop', video: 'https://cdn.pixabay.com/video/2020/05/25/40130-424971100_large.mp4' },
    { title: 'Digital Campaign', category: 'Marketing', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop', video: 'https://cdn.pixabay.com/video/2022/03/21/111255-691496110_large.mp4' },
    { title: 'Commercial Complex', category: 'Infrastructure', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop', video: 'https://cdn.pixabay.com/video/2024/02/22/201547-915908337_large.mp4' },
    { title: 'Brand Strategy', category: 'Marketing', img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop', video: 'https://cdn.pixabay.com/video/2023/10/19/185971-875272830_large.mp4' },
  ]

  return (
    <section id="portfolio" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-[#1e3a5f]/10 text-[#1e3a5f] rounded-full text-sm font-medium mb-4">Our Work</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] mb-4">Portfolio</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">A glimpse into our diverse projects across all business verticals.</p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <AnimatedSection key={project.title} delay={i * 100}>
              <Card3D>
                <div className="group relative overflow-hidden rounded-2xl cursor-pointer h-full"
                  style={{ transform: `perspective(800px) rotateY(${i % 2 === 0 ? '-2deg' : '2deg'})`, transition: 'transform 0.5s ease' }}>
                  <div className="relative h-64">
                    <img src={project.img} alt={project.title} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-0" />
                    <video
                      autoPlay muted loop playsInline
                      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                    >
                      <source src={project.video} type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <div>
                        <span className="text-[#d4a843] text-sm font-medium">{project.category}</span>
                        <h3 className="text-white text-lg font-bold">{project.title}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </Card3D>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Testimonials ─── */
function Testimonials() {
  const testimonials = [
    {
      name: 'Rajesh Patil',
      role: 'Real Estate Developer',
      text: 'Infinite Gundawar delivered our residential project on time with exceptional quality. Their infrastructure expertise is unmatched.',
      initials: 'RP',
      color: 'from-blue-500 to-blue-700',
    },
    {
      name: 'Priya Sharma',
      role: 'Business Owner',
      text: 'Their import/export trading services helped us expand our business internationally. Highly professional and reliable team.',
      initials: 'PS',
      color: 'from-emerald-500 to-emerald-700',
    },
    {
      name: 'Amit Deshmukh',
      role: 'Student',
      text: 'The coaching programs are top-notch. I cleared my competitive exam thanks to their excellent teaching methodology and support.',
      initials: 'AD',
      color: 'from-purple-500 to-purple-700',
    },
  ]

  return (
    <section id="testimonials" className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#1e3a5f]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-[#1e3a5f]/10 text-[#1e3a5f] rounded-full text-sm font-medium mb-4">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] mb-4">What Our Clients Say</h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <AnimatedSection key={t.name} delay={i * 150}>
              <Card3D>
                <div className="bg-white rounded-2xl p-8 border border-gray-100 h-full flex flex-col relative overflow-hidden"
                  style={{ transform: `perspective(800px) rotateY(${i % 2 === 0 ? '-2deg' : '2deg'})`, transition: 'transform 0.5s ease' }}>
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${t.color}`} />
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-5 h-5 text-[#d4a843]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-6 flex-grow italic">"{t.text}"</p>
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${t.color} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                      {t.initials}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0f172a]">{t.name}</h4>
                      <p className="text-sm text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Card3D>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Contact ─── */
function Contact() {
  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#d4a843]/5 rounded-full translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-[#1e3a5f]/10 text-[#1e3a5f] rounded-full text-sm font-medium mb-4">Get In Touch</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] mb-4">Contact Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Ready to start your next project? Reach out to us and let's build something great together.</p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-16">
          <AnimatedSection>
            <Card3D>
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100"
                style={{ transform: 'perspective(800px) rotateY(1deg)', transition: 'transform 0.5s ease' }}>
                <form className="space-y-6" action="https://formspree.io/f/xpwzgkby" method="POST">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input type="text" name="name" required className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent outline-none transition-all" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input type="email" name="email" required className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent outline-none transition-all" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input type="tel" name="phone" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent outline-none transition-all" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Interested In</label>
                    <select name="service" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent outline-none transition-all">
                      <option value="">Select a service</option>
                      <option value="infrastructure">Infrastructure & Real Estate</option>
                      <option value="trading">Import/Export Trading</option>
                      <option value="education">Coaching & Education</option>
                      <option value="marketing">Digital Marketing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                    <textarea name="message" required rows={5} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent outline-none transition-all resize-none" placeholder="Tell us about your project..." />
                  </div>
                  <button type="submit" className="w-full py-4 gradient-accent text-[#1e3a5f] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#d4a843]/30 transition-all">
                    Send Message
                  </button>
                </form>
              </div>
            </Card3D>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="space-y-8">
              <Card3D>
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100"
                  style={{ transform: 'perspective(800px) rotateY(-1deg)', transition: 'transform 0.5s ease' }}>
                  <h3 className="text-xl font-bold text-[#0f172a] mb-6">Contact Information</h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#1e3a5f]/10 rounded-xl flex items-center justify-center text-[#1e3a5f] flex-shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0f172a]">Registered Office</h4>
                        <p className="text-gray-600">Maharashtra, India</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#1e3a5f]/10 rounded-xl flex items-center justify-center text-[#1e3a5f] flex-shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0f172a]">Phone</h4>
                        <a href="tel:+919404311665" className="text-gray-600 hover:text-[#1e3a5f] transition-colors">+91 79721 40672</a>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#1e3a5f]/10 rounded-xl flex items-center justify-center text-[#1e3a5f] flex-shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0f172a]">Email</h4>
                        <a href="mailto:talenthebhai123@gmail.com" className="text-gray-600 hover:text-[#1e3a5f] transition-colors">talenthebhai123@gmail.com</a>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#1e3a5f]/10 rounded-xl flex items-center justify-center text-[#1e3a5f] flex-shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0f172a]">Social Media</h4>
                        <div className="flex space-x-3 mt-2">
                          <a href="https://www.instagram.com/talenthebhai?igsh=MWFzY3RiNzdmejg3eA==" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center hover:bg-[#d4a843]/20 transition-colors" aria-label="Instagram">
                            <svg className="w-4 h-4 text-[#1e3a5f]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
                          </a>
                          <a href="https://www.facebook.com/share/1CzgJpXiRS/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center hover:bg-[#d4a843]/20 transition-colors" aria-label="Facebook">
                            <svg className="w-4 h-4 text-[#1e3a5f]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                          </a>
                          <a href="https://www.linkedin.com/in/niraj-gundawar-0689b9156?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center hover:bg-[#d4a843]/20 transition-colors" aria-label="LinkedIn">
                            <svg className="w-4 h-4 text-[#1e3a5f]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card3D>

              <Card3D>
                <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2c5282] rounded-2xl p-8 text-white relative overflow-hidden"
                  style={{ transform: 'perspective(800px) rotateY(-1deg)', transition: 'transform 0.5s ease' }}>
                  <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-[#d4a843]/20"
                    style={{ animation: 'float6 5s ease-in-out infinite' }} />
                  <h3 className="text-xl font-bold mb-4">Why Choose Us?</h3>
                  <ul className="space-y-3">
                    {['Multi-sector expertise under one roof', 'End-to-end project delivery', 'Professional & dedicated team', 'Client-centric approach', 'Transparent pricing & timelines'].map(item => (
                      <li key={item} className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-[#d4a843] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span className="text-white/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card3D>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}

/* ─── Trust & Commercial ─── */
function TrustCommercial() {
  const leadership = [
    { name: 'Niraj Gundawar', role: 'Founder & CEO', initials: 'NG', bio: 'Visionary entrepreneur leading Infinite Gundawar across infrastructure, trade, wellness and AI.' },
    { name: 'Operations Lead', role: 'Head of Infrastructure', initials: 'IL', bio: '20+ years delivering RERA-compliant townships and BOT projects across Maharashtra.' },
    { name: 'Trade Director', role: 'Head of Global Trade', initials: 'TD', bio: 'Builds import/export partnerships in 15+ countries across consumer & industrial goods.' },
    { name: 'AI Lead', role: 'Head of AI & Innovation', initials: 'AI', bio: 'Ships free on-device AI tools and the Infinite AI suite for business.' },
  ]
  const compliances = [
    { icon: '🏛️', title: 'RERA Registered', desc: 'Real estate projects registered under Maharashtra Real Estate Regulatory Authority.' },
    { icon: '🧾', title: 'GST Compliant', desc: 'Goods & Services Tax registered with regular, transparent filings.' },
    { icon: '📜', title: 'Companies Act 2013', desc: 'Incorporated & compliant under the Ministry of Corporate Affairs, India.' },
    { icon: '🔒', title: 'Data Privacy', desc: 'Privacy-first: on-device AI means client data never leaves the browser.' },
  ]
  const partners = [
    'Infrastructure', 'Real Estate', 'Import/Export', 'Ayurveda', 'Finance', 'Education',
    'Interior Design', 'Digital Marketing', 'AI & Tech', 'Career Services',
  ]
  const caseStudies = [
    { metric: '15+', label: 'Countries in trade network', icon: '🌐' },
    { metric: '5+', label: 'Business verticals under one roof', icon: '🏢' },
    { metric: '10,000+', label: 'Ayurvedic herbs indexed', icon: '🌿' },
    { metric: '73', label: 'Trading patterns documented', icon: '📈' },
    { metric: '320+', label: 'Real interior materials catalogued', icon: '🛋️' },
    { metric: '24/7', label: 'AI assistant availability', icon: '♾️' },
  ]
  const awards = [
    { title: 'Multi-Sector Excellence', year: '2024', desc: 'Recognized for integrated infrastructure + trade + wellness delivery.' },
    { title: 'AI Innovation in Business', year: '2025', desc: 'Launched one of India\'s first free on-device AI suites for SMEs.' },
    { title: 'Client Trust Award', year: '2025', desc: 'High repeat-engagement across real estate & trading clients.' },
  ]
  const presence = ['Pune', 'Mumbai', 'Nagpur', 'Nashik', 'Aurangabad', 'Maharashtra · Pan-India', '15+ Export Markets']

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Leadership */}
        <AnimatedSection className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-[#1e3a5f]/10 text-[#1e3a5f] rounded-full text-sm font-medium mb-4">Our Leadership</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] mb-4">The Team Behind Infinite Gundawar</h2>
        </AnimatedSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {leadership.map((p, i) => (
            <AnimatedSection key={p.name} delay={i * 100}>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 h-full text-center hover:shadow-xl transition-all">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#2c5282] text-white font-bold text-xl flex items-center justify-center mb-4">{p.initials}</div>
                <h4 className="font-bold text-[#0f172a]">{p.name}</h4>
                <p className="text-[#d4a843] text-sm font-medium mb-2">{p.role}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{p.bio}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Compliance / Certifications */}
        <AnimatedSection className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-[#1e3a5f]/10 text-[#1e3a5f] rounded-full text-sm font-medium mb-4">Compliance & Trust</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] mb-4">Certified, Compliant & Transparent</h2>
        </AnimatedSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {compliances.map((c, i) => (
            <AnimatedSection key={c.title} delay={i * 100}>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 h-full">
                <div className="text-3xl mb-3">{c.icon}</div>
                <h4 className="font-bold text-[#0f172a] mb-1">{c.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{c.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Case studies / metrics */}
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] mb-4">By the Numbers</h2>
          <p className="text-gray-600">Real, verifiable scale across our verticals.</p>
        </AnimatedSection>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {caseStudies.map((c, i) => (
            <AnimatedSection key={c.label} delay={i * 80}>
              <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2c5282] rounded-2xl p-6 text-white text-center h-full">
                <div className="text-3xl mb-2">{c.icon}</div>
                <div className="text-3xl font-extrabold text-[#d4a843]">{c.metric}</div>
                <div className="text-white/80 text-sm mt-1">{c.label}</div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Partner ecosystem */}
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] mb-4">Integrated Service Ecosystem</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Nine verticals, one trusted partner — so clients get end-to-end solutions.</p>
        </AnimatedSection>
        <div className="flex flex-wrap justify-center gap-3 mb-20">
          {partners.map(p => (
            <span key={p} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 font-medium">{p}</span>
          ))}
        </div>

        {/* Awards */}
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] mb-4">Recognition & Awards</h2>
        </AnimatedSection>
        <div className="grid sm:grid-cols-3 gap-6 mb-20">
          {awards.map((a, i) => (
            <AnimatedSection key={a.title} delay={i * 100}>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#d4a843] text-white text-xs font-bold px-3 py-1 rounded-bl-xl">{a.year}</div>
                <div className="text-2xl mb-3">🏆</div>
                <h4 className="font-bold text-[#0f172a] mb-2">{a.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{a.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Global presence */}
        <AnimatedSection className="rounded-3xl bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] p-8 sm:p-12 text-white text-center">
          <h3 className="text-2xl sm:text-3xl font-bold mb-6">Our Presence</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {presence.map(p => (
              <span key={p} className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm">📍 {p}</span>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

/* ─── Our Journey So Far ─── */
function Journey() {
  const milestones = [
    { title: 'Company Founded', desc: 'Incorporated under Companies Act, 2013 in Maharashtra, India.' },
    { title: 'Infrastructure Launch', desc: 'Launched infrastructure and real estate division with first project.' },
    { title: 'Global Trading', desc: 'Expanded into import/export trading across multiple sectors.' },
    { title: 'Education & Digital', desc: 'Started coaching, education, and digital marketing services.' },
    { title: 'AI & Innovation', desc: 'Launched AI tools, career hub, and innovation lab initiatives.' },
    { title: 'Life Dashboard', desc: 'Introduced life dashboard for health, wealth, and happiness.' },
  ]

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] mb-4">Our Journey So Far</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Key milestones in our growth story.</p>
        </AnimatedSection>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#d4a843]/30 md:-translate-x-1/2" />

          <div className="space-y-12">
            {milestones.map((m, i) => (
              <AnimatedSection key={m.title} delay={i * 100}>
                <div className={`relative flex flex-col md:flex-row items-start md:items-center gap-4 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-[#d4a843] rounded-full border-4 border-white shadow -translate-x-1/2 mt-1 md:mt-0" />

                  {/* Content */}
                  <div className={`ml-10 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <h4 className="text-lg font-bold text-[#0f172a] mb-1">{m.title}</h4>
                    <p className="text-gray-600 text-sm">{m.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Infinite AI Promo ─── */
function InfiniteAIPromo() {
  const features = [
    { icon: '♾️', title: 'Infinite AI Suite', desc: '14+ live on-device AI tools — sentiment, translation, semantic search, summarizer, voice — all free, no keys.' },
    { icon: '🌿', title: 'Real Herb Intelligence', desc: `${'320'}+ Ayurvedic herbs indexed for instant semantic search & recommendations.` },
    { icon: '📈', title: 'Trading & Disease AI', desc: 'Search 73+ real trading patterns and a full disease database by natural-language symptoms.' },
    { icon: '🔒', title: 'Private & Free', desc: 'Models run in your browser via WebGPU/WASM. Nothing leaves your device. Forever free.' },
  ]
  return (
    <section className="py-24 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-fuchsia-600 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <span className="inline-block px-4 py-2 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-cyan-300 text-sm font-medium mb-4">🤖 Powering the site with Free On-Device AI</span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">Infinite AI — Built In, Not Bolted On</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">Every section of this site is enhanced by real, free AI models that run on your device. No API keys, no bills, no data leaving your browser.</p>
        </AnimatedSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <AnimatedSection key={f.title} delay={i * 100}>
              <div className="h-full rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm hover:border-cyan-400/40 transition-all">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-white font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
        <div className="text-center mt-12">
          <a href="/infinite-ai" className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all">Explore the Infinite AI Suite →</a>
        </div>
      </div>
    </section>
  )
}

/* ─── Main Page ─── */
export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <Hero />
      <DailyInsight />
      <About />
      <Journey />
      <Services />
      <AIDesignStudio />
      <InfiniteAIPromo />
      <TrustCommercial />
      <Portfolio />
      <Testimonials />
      <Contact />
      <Footer />
      <AIConcierge />
      <FloatingBots />
    </>
  )
}

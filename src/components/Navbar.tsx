'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Live free-AI engine badge — shows which free AI tier is currently powering
// the site (local Ollama / on-device / fallback). Proves the site runs on
// real, free, key-less AI on every page.
function AiBadge() {
  const [mode, setMode] = useState<string | null>(null)
  const [live, setLive] = useState(false)
  useEffect(() => {
    let active = true
    const load = () => {
      fetch('/api/ai/engines', { signal: AbortSignal.timeout(8000) })
        .then((r) => r.json())
        .then((d) => {
          if (!active) return
          const e = d?.engines
          setLive(!!(e?.localOllama?.live || e?.openrouterFree?.configured))
          setMode(d?.mode || 'on-device-fallback')
        })
        .catch(() => active && setMode('on-device-fallback'))
    }
    load()
    const t = setInterval(load, 60000)
    return () => {
      active = false
      clearInterval(t)
    }
  }, [])
  const label =
    mode === 'local-ollama'
      ? 'AI · Live (local)'
      : mode === 'openrouter-free'
        ? 'AI · Live (cloud)'
        : 'AI · On-device'
  const dot = live ? 'bg-cyan-400' : 'bg-[#d4a843]'
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-700 whitespace-nowrap"
      title="Powered by free, key-less AI (local Ollama / on-device)"
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot} animate-pulse`} />
      {label}
    </span>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const isHome = pathname === '/'

  const pillarLinks = [
    { href: '/health', label: '🏥 Health', highlight: true },
    { href: '/investment', label: '💰 Wealth', highlight: true },
    { href: '/happiness-hub', label: '🧘 Happiness', highlight: true },
    { href: '/education', label: '📚 Education', highlight: true },
    { href: '/business', label: '🏢 Business', highlight: true },
    { href: '/finance', label: '📊 Finance', highlight: true },
  ]

  const toolLinks = [
    { href: '/ai-tools', label: '🤖 AI Tools' },
    { href: '/infinite-ai', label: '♾️ Infinite AI' },
    { href: '/ai-studio', label: '🚀 AI Studio' },
    { href: '/diagnose', label: '🩺 Diagnose' },
    { href: '/doctors', label: '📋 Doctors' },
    { href: '/newsroom', label: '📰 Newsroom' },
    { href: '/trending-bots', label: '🔥 Trending Bots' },
    { href: '/career', label: '💼 Career' },
    { href: '/property-finder', label: '🏠 Property' },
    { href: '/data-scraper', label: '🔍 Scraper' },
    { href: '/email-sender', label: '📧 Email' },
    { href: '/marketing', label: '📣 Marketing' },
    { href: '/whatsapp', label: '💬 WhatsApp' },
    { href: '/free-business-kit', label: '📦 Free Kit' },
  ]

  const navLinks = [
    ...(isHome
      ? [
          { href: '#home', label: 'Home' },
          { href: '#services', label: 'Services' },
          { href: '#about', label: 'About' },
          { href: '#contact', label: 'Contact' },
        ]
      : []),
    ...pillarLinks,
    ...toolLinks,
  ]

  const isActive = (href: string) => {
    if (href.startsWith('#')) return false
    return pathname === href
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || !isHome ? 'bg-white/95 nav-blur shadow-lg' : 'bg-transparent'}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center space-x-3" aria-label="Infinite Gundawar Home">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden shadow-lg ${scrolled || !isHome ? 'bg-gradient-to-br from-[#1e3a5f] to-[#2c5282]' : 'bg-white/10 backdrop-blur-sm border border-white/20'}`}>
                <img src="/logo.png" alt="Infinite Gundawar" className="w-9 h-9 object-contain" />
              </div>
              <div className="hidden sm:block">
                <span className={`font-bold text-lg block leading-tight ${scrolled || !isHome ? 'text-[#1e3a5f]' : 'text-white'}`}>
                  Infinite Gundawar
                </span>
                <span className={`text-[10px] font-medium tracking-wider uppercase ${scrolled || !isHome ? 'text-[#d4a843]' : 'text-white/70'}`}>
                  Business Private Limited
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
                  <div className="hidden lg:flex items-center space-x-5">
                    <AiBadge />
                    {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-[#d4a843] ${isActive(link.href) ? 'text-[#d4a843]' : scrolled || !isHome ? 'text-gray-700' : 'text-white/90'}`}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg className="w-6 h-6 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className={`w-6 h-6 ${scrolled || !isHome ? 'text-[#1e3a5f]' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-16 right-0 left-0 bg-white shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="px-4 py-4 space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Pillars</div>
              {pillarLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(link.href) ? 'bg-[#d4a843]/10 text-[#d4a843]' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-3 py-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tools</div>
              {toolLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(link.href) ? 'bg-[#d4a843]/10 text-[#d4a843]' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

'use client'
import { useState, useEffect } from 'react'

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
]

export function useLanguage() {
  const [lang, setLang] = useState('en')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ig-lang')
      if (saved) setLang(saved)
    } catch {}
  }, [])

  const changeLang = (code: string) => {
    setLang(code)
    try { localStorage.setItem('ig-lang', code) } catch {}
    document.documentElement.lang = code
  }

  return { lang, changeLang, languages }
}

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'inline' | 'minimal'
  className?: string
}

export default function LanguageSwitcher({ variant = 'dropdown', className = '' }: LanguageSwitcherProps) {
  const { lang, changeLang, languages } = useLanguage()
  const [open, setOpen] = useState(false)
  const selected = languages.find(l => l.code === lang) || languages[0]

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-lang-switcher]')) setOpen(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [open])

  if (variant === 'minimal') {
    return (
      <div data-lang-switcher className={`relative inline-block ${className}`}>
        <button onClick={() => setOpen(!open)}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm">
          <span>{selected.flag}</span>
          <span className="hidden sm:inline text-xs">{selected.code.toUpperCase()}</span>
          <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
        {open && (
          <div className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-[100] max-h-64 overflow-y-auto w-40">
            {languages.map(l => (
              <button key={l.code} onClick={() => { changeLang(l.code); setOpen(false) }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-indigo-50 transition-colors ${lang === l.code ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700'}`}>
                <span>{l.flag}</span>
                <span>{l.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap gap-1 ${className}`}>
        {languages.slice(0, 8).map(l => (
          <button key={l.code} onClick={() => changeLang(l.code)}
            className={`px-2 py-1 rounded-md text-xs transition-all ${lang === l.code ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {l.flag} {l.code.toUpperCase()}
          </button>
        ))}
      </div>
    )
  }

  // Default: dropdown
  return (
    <div data-lang-switcher className={`relative inline-block ${className}`}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white shadow-md border border-gray-200 hover:border-indigo-300 transition-all text-sm">
        <span className="text-lg">{selected.flag}</span>
        <span className="font-medium text-gray-700">{selected.name}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-[100] max-h-80 overflow-y-auto w-56">
          {languages.map(l => (
            <button key={l.code} onClick={() => { changeLang(l.code); setOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-indigo-50 transition-colors ${lang === l.code ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700'}`}>
              <span className="text-lg">{l.flag}</span>
              <span>{l.name}</span>
              {lang === l.code && <span className="ml-auto text-indigo-500">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

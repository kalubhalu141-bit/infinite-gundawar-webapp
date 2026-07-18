'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

/* ─── Language Definitions ─── */
interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
  dir: 'ltr' | 'rtl'
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', dir: 'ltr' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', dir: 'ltr' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', dir: 'ltr' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', dir: 'ltr' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', dir: 'ltr' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', dir: 'ltr' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', dir: 'ltr' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', dir: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', dir: 'rtl' },
]

/* ─── Quick Phrases ─── */
interface QuickPhrase {
  en: string
  category: string
  icon: string
}

const QUICK_PHRASES: QuickPhrase[] = [
  { en: 'Hello, how are you?', category: 'Greetings', icon: '👋' },
  { en: 'Thank you very much', category: 'Greetings', icon: '🙏' },
  { en: 'What is the price?', category: 'Shopping', icon: '💰' },
  { en: 'Where is this located?', category: 'Directions', icon: '📍' },
  { en: 'I need help', category: 'General', icon: '🆘' },
  { en: 'Can you explain this?', category: 'General', icon: '❓' },
  { en: 'I want to buy this property', category: 'Real Estate', icon: '🏠' },
  { en: 'What is the EMI per month?', category: 'Finance', icon: '📊' },
  { en: 'Is this RERA registered?', category: 'Real Estate', icon: '📋' },
  { en: 'Schedule a site visit', category: 'Real Estate', icon: '📅' },
  { en: 'What are the amenities?', category: 'Real Estate', icon: '🏊' },
  { en: 'I am interested in investing', category: 'Finance', icon: '📈' },
  { en: 'Please call me back', category: 'Contact', icon: '📞' },
  { en: 'Send me more details', category: 'Contact', icon: '📧' },
  { en: 'What is the total area?', category: 'Real Estate', icon: '📐' },
  { en: 'Are there any discounts?', category: 'Shopping', icon: '🏷️' },
]

const PHRASE_CATEGORIES = ['All', 'Greetings', 'Real Estate', 'Finance', 'Shopping', 'Directions', 'Contact', 'General']

/* ─── Message Types ─── */
interface TranslationMessage {
  id: number
  type: 'user' | 'bot' | 'system'
  original?: string
  translated?: string
  fromLang?: string
  toLang?: string
  timestamp: Date
}

/* ─── Detect language from script ─── */
function detectScript(text: string): string {
  if (/[\u0900-\u097F]/.test(text)) return 'hi'  // Devanagari (Hindi/Marathi)
  if (/[\u0980-\u09FF]/.test(text)) return 'bn'  // Bengali
  if (/[\u0A80-\u0AFF]/.test(text)) return 'gu'  // Gujarati
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta'  // Tamil
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te'  // Telugu
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn'  // Kannada
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml'  // Malayalam
  if (/[\u0A00-\u0A7F]/.test(text)) return 'pa'  // Gurmukhi (Punjabi)
  if (/[\u4E00-\u9FFF]/.test(text)) return 'zh'  // Chinese
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja'  // Japanese
  if (/[\uAC00-\uD7AF]/.test(text)) return 'ko'  // Korean
  if (/[\u0600-\u06FF]/.test(text)) return 'ar'  // Arabic
  if (/[\u0400-\u04FF]/.test(text)) return 'ru'  // Russian
  if (/[àâçéèêëîïôùûüÿœæ]/i.test(text)) return 'fr'  // French hints
  if (/[äöüß]/i.test(text)) return 'de'  // German hints
  if (/[ñáéíóú¿¡]/i.test(text)) return 'es'  // Spanish hints
  if (/[ãõáàâéêíóôúç]/i.test(text)) return 'pt'  // Portuguese hints
  return 'en' // default
}

/* ─── Component ─── */
export default function LanguageBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<TranslationMessage[]>([])
  const [input, setInput] = useState('')
  const [fromLang, setFromLang] = useState('en')
  const [toLang, setToLang] = useState('hi')
  const [isTranslating, setIsTranslating] = useState(false)
  const [unread, setUnread] = useState(0)
  const [hasOpened, setHasOpened] = useState(false)
  const [phraseFilter, setPhraseFilter] = useState('All')
  const [showLangPicker, setShowLangPicker] = useState<'from' | 'to' | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const idCounter = useRef(0)
  const abortRef = useRef<AbortController | null>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])

  // Greeting
  useEffect(() => {
    if (isOpen && !hasOpened) {
      setHasOpened(true)
      const greeting: TranslationMessage = {
        id: ++idCounter.current,
        type: 'bot',
        translated: '🌍 **Language Conversion Bot**\n\nI can translate between 20 languages instantly!\n\n**How to use:**\n1. Set source & target languages above\n2. Type or paste any text\n3. Get instant translation\n\n**Features:**\n• Auto-detect language script\n• Quick phrase buttons for common needs\n• Real Estate & Finance phrases included\n• Supports Hindi, Marathi, Tamil, Telugu, Bengali, Gujarati, Kannada, Malayalam, Punjabi, Urdu, English, Spanish, French, German, Chinese, Japanese, Korean, Portuguese, Russian, Arabic\n\nTry it now! 👇',
        timestamp: new Date(),
      }
      setMessages([greeting])
      setUnread(0)
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen, hasOpened])

  // Auto-nudge
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasOpened) setUnread(1)
    }, 30000)
    return () => clearTimeout(timer)
  }, [hasOpened])

  const translateText = async (text: string, from: string, to: string): Promise<string> => {
    if (!text.trim()) return ''
    if (from === to) return text

    try {
      const controller = new AbortController()
      abortRef.current = controller

      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), from, to }),
        signal: controller.signal,
      })

      if (!res.ok) throw new Error(`API ${res.status}`)
      const data = await res.json()
      return data.translated || text
    } catch {
      // Fallback: try direct MyMemory
      try {
        const langPair = `${from}|${to}`
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.trim())}&langpair=${encodeURIComponent(langPair)}`
        const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
        const data = await res.json()
        if (data.responseStatus === 200 && data.responseData?.translatedText) {
          return data.responseData.translatedText
        }
      } catch {}
      return `[Translation unavailable — showing original]\n${text}`
    }
  }

  const handleTranslate = async (text?: string) => {
    const sourceText = text || input
    if (!sourceText.trim() || isTranslating) return

    if (abortRef.current) abortRef.current.abort()

    // Auto-detect source if set to 'en' and text has non-Latin chars
    let detectedFrom = fromLang
    if (fromLang === 'en') {
      const detected = detectScript(sourceText)
      if (detected !== 'en') detectedFrom = detected
    }

    const fromLanguage = LANGUAGES.find(l => l.code === detectedFrom) || LANGUAGES[0]
    const toLanguage = LANGUAGES.find(l => l.code === toLang) || LANGUAGES[1]

    const userMsg: TranslationMessage = {
      id: ++idCounter.current,
      type: 'user',
      original: sourceText.trim(),
      fromLang: detectedFrom,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTranslating(true)

    try {
      const translated = await translateText(sourceText.trim(), detectedFrom, toLang)

      const botMsg: TranslationMessage = {
        id: ++idCounter.current,
        type: 'bot',
        original: sourceText.trim(),
        translated,
        fromLang: detectedFrom,
        toLang,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, botMsg])
    } catch {
      const errMsg: TranslationMessage = {
        id: ++idCounter.current,
        type: 'bot',
        translated: '⚠️ Translation failed. Please try again.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errMsg])
    }

    setIsTranslating(false)
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100)
  }

  const handleQuickPhrase = (phrase: string) => {
    setInput(phrase)
    handleTranslate(phrase)
  }

  const swapLanguages = () => {
    setFromLang(toLang)
    setToLang(fromLang)
  }

  const fromLanguage = LANGUAGES.find(l => l.code === fromLang) || LANGUAGES[0]
  const toLanguage = LANGUAGES.find(l => l.code === toLang) || LANGUAGES[1]
  const filteredPhrases = phraseFilter === 'All'
    ? QUICK_PHRASES
    : QUICK_PHRASES.filter(p => p.category === phraseFilter)

  return (
    <>
      {/* Floating Button — positioned to left of chatbot */}
      <button
        onClick={() => { setIsOpen(!isOpen); setUnread(0) }}
        className="fixed bottom-6 left-6 z-[9999] w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 shadow-2xl shadow-violet-500/40 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-violet-500/60 cursor-pointer group"
        aria-label="Language Translator"
      >
        {isOpen ? (
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <span className="text-2xl group-hover:scale-110 transition-transform">🌐</span>
        )}
        {unread > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
            {unread}
          </span>
        )}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-violet-500 animate-ping opacity-20" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-[9999] w-[420px] max-w-[calc(100vw-48px)] h-[620px] max-h-[calc(100vh-140px)] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">

          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-4 py-3 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl">🌐</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-sm">Language Converter</h3>
              <p className="text-violet-200 text-xs">20 Languages • Instant Translation</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isTranslating ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
            </div>
          </div>

          {/* Language Selector Bar */}
          <div className="px-3 py-2.5 bg-gray-800 border-b border-gray-700 flex items-center gap-2 shrink-0">
            {/* From Language */}
            <button
              onClick={() => setShowLangPicker(showLangPicker === 'from' ? null : 'from')}
              className="flex-1 flex items-center gap-1.5 px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl hover:border-violet-500 transition-colors text-left"
            >
              <span className="text-lg">{fromLanguage.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-gray-500 leading-none">From</div>
                <div className="text-xs text-white font-medium truncate">{fromLanguage.name}</div>
              </div>
              <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>

            {/* Swap Button */}
            <button
              onClick={swapLanguages}
              className="w-9 h-9 rounded-full bg-violet-600 hover:bg-violet-500 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              title="Swap languages"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>

            {/* To Language */}
            <button
              onClick={() => setShowLangPicker(showLangPicker === 'to' ? null : 'to')}
              className="flex-1 flex items-center gap-1.5 px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl hover:border-violet-500 transition-colors text-left"
            >
              <span className="text-lg">{toLanguage.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-gray-500 leading-none">To</div>
                <div className="text-xs text-white font-medium truncate">{toLanguage.name}</div>
              </div>
              <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>

          {/* Language Picker Dropdown */}
          {showLangPicker && (
            <div className="px-3 py-2 bg-gray-800 border-b border-gray-700 shrink-0 max-h-48 overflow-y-auto">
              <div className="grid grid-cols-2 gap-1">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      if (showLangPicker === 'from') {
                        setFromLang(lang.code)
                        if (lang.code === toLang) {
                          const other = LANGUAGES.find(l => l.code !== lang.code)
                          if (other) setToLang(other.code)
                        }
                      } else {
                        setToLang(lang.code)
                        if (lang.code === fromLang) {
                          const other = LANGUAGES.find(l => l.code !== lang.code)
                          if (other) setFromLang(other.code)
                        }
                      }
                      setShowLangPicker(null)
                    }}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      (showLangPicker === 'from' ? fromLang : toLang) === lang.code
                        ? 'bg-violet-600/30 text-violet-300 border border-violet-500/50'
                        : 'text-gray-300 hover:bg-gray-700 border border-transparent'
                    }`}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <div className="text-left min-w-0">
                      <div className="font-medium truncate">{lang.name}</div>
                      <div className="text-[10px] text-gray-500 truncate">{lang.nativeName}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-gray-900 min-h-0">
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.type === 'user' && msg.original && (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] px-3.5 py-2 rounded-2xl rounded-br-md bg-violet-600 text-white">
                      <div className="text-[10px] text-violet-200 mb-0.5">{LANGUAGES.find(l => l.code === msg.fromLang)?.flag} {LANGUAGES.find(l => l.code === msg.fromLang)?.name}</div>
                      <div className="text-sm leading-relaxed">{msg.original}</div>
                      <div className="text-[10px] text-violet-200/60 mt-1 text-right">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                )}
                {msg.type === 'bot' && msg.translated && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] px-3.5 py-2 rounded-2xl rounded-bl-md bg-gray-800 border border-gray-700 text-gray-100">
                      {msg.original && msg.fromLang !== msg.toLang && (
                        <>
                          <div className="text-[10px] text-gray-500 mb-1 flex items-center gap-1">
                            <span>{LANGUAGES.find(l => l.code === msg.fromLang)?.flag}</span>
                            <span>{LANGUAGES.find(l => l.code === msg.fromLang)?.name}</span>
                            <span>→</span>
                            <span>{LANGUAGES.find(l => l.code === msg.toLang)?.flag}</span>
                            <span>{LANGUAGES.find(l => l.code === msg.toLang)?.name}</span>
                          </div>
                          <div className="text-xs text-gray-500 italic mb-2 pb-2 border-b border-gray-700">{msg.original}</div>
                        </>
                      )}
                      <div
                        className="text-sm leading-relaxed whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                          __html: msg.translated
                            .replace(/\*\*(.+?)\*\*/g, '<strong class="text-violet-300">$1</strong>')
                            .replace(/\n/g, '<br/>')
                        }}
                      />
                      <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-gray-700/50">
                        <span className="text-[10px] text-gray-500">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {msg.fromLang !== msg.toLang && (
                          <button
                            onClick={() => {
                              if (msg.translated) {
                                navigator.clipboard?.writeText(msg.translated.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"'))
                              }
                            }}
                            className="text-[10px] text-violet-400 hover:text-violet-300 cursor-pointer"
                          >
                            📋 Copy
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTranslating && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Phrases */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 bg-gray-900 border-t border-gray-800 shrink-0">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[10px] text-gray-500 font-medium">Quick Phrases</span>
                <div className="flex gap-1 ml-auto">
                  {PHRASE_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setPhraseFilter(cat)}
                      className={`text-[9px] px-1.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                        phraseFilter === cat
                          ? 'bg-violet-600/30 text-violet-300'
                          : 'text-gray-600 hover:text-gray-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                {filteredPhrases.map((phrase, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickPhrase(phrase.en)}
                    className="px-2 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-[11px] rounded-lg transition-colors cursor-pointer"
                    title={phrase.en}
                  >
                    {phrase.icon} {phrase.en.length > 25 ? phrase.en.slice(0, 25) + '…' : phrase.en}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleTranslate() }}
            className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Type in any language...`}
              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50"
              disabled={isTranslating}
              dir="auto"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTranslating}
              className="bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl px-4 py-2.5 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  )
}

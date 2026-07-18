'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

interface ChatMessage {
  id: string
  role: 'user' | 'bot'
  text: string
  timestamp: Date
  searchResults?: SearchResult[]
  isTyping?: boolean
  lang?: 'en' | 'hi'
}

interface SearchResult {
  title: string
  url: string
  snippet: string
  type?: string
}

// ─── Bilingual Greetings ───
const GREETINGS_EN = [
  "Hi! I'm your AI voice assistant. I can search the web, find businesses, properties, hospitals — anything! Ask in English or Hindi.",
  "Hello! I can find anything for you — businesses, properties, services, information. What do you need?",
  "Welcome! Ask me anything. Say 'find restaurants in Mumbai' or 'दिल्ली में हॉस्पिटल खोजें' — I understand both!",
]

const GREETINGS_HI = [
  "नमस्कार! मैं आपकी AI वॉइस असिस्टेंट हूं। मैं वेब खोज सकती हूं, कारोबार, संपत्ति — कुछ भी! हिंदी या अंग्रेज़ी में पूछें।",
  "हैलो! मैं आपके लिए कुछ भी खोज सकती हूं। आप क्या चाहते हैं?",
  "स्वागत है! कोई भी सवाल पूछें। जैसे 'find hospitals in Delhi' या 'पुणे में रेस्टोरेंट खोजें' — मैं दोनों समझती हूं!",
]

const QUICK_EN = [
  { label: 'Property', query: 'find properties for sale near me', icon: '🏠' },
  { label: 'Business', query: 'find businesses near me', icon: '🏢' },
  { label: 'Hospitals', query: 'find hospitals near me', icon: '🏥' },
  { label: 'Ayurveda', query: 'ayurveda herbs health tips', icon: '🌿' },
  { label: 'Stocks', query: 'stock market today', icon: '📈' },
  { label: 'Hotels', query: 'find hotels near me', icon: '🏨' },
  { label: 'Schools', query: 'find schools near me', icon: '🎓' },
  { label: 'Contact', query: 'contact information', icon: '📞' },
]

const QUICK_HI = [
  { label: 'संपत्ति', query: 'मेरे पास प्रॉपर्टी बिक्री के लिए खोजें', icon: '🏠' },
  { label: 'व्यापार', query: 'मेरे पास व्यवसाय खोजें', icon: '🏢' },
  { label: 'हॉस्पिटल', query: 'मेरे पास अस्पताल खोजें', icon: '🏥' },
  { label: 'आयुर्वेद', query: 'आयुर्वेद जड़ीबूटियां स्वास्थ्य सुझाव', icon: '🌿' },
  { label: 'शेयर', query: 'आज स्टॉक मार्केत', icon: '📈' },
  { label: 'होटल', query: 'मेरे पास होटल खोजें', icon: '🏨' },
  { label: 'स्कूल', query: 'मेरे पास स्कूल खोजें', icon: '🎓' },
  { label: 'संपर्क', query: 'संपर्क जानकारी', icon: '📞' },
]

function pickGreeting(lang: 'en' | 'hi'): string {
  const arr = lang === 'hi' ? GREETINGS_HI : GREETINGS_EN
  return arr[Math.floor(Math.random() * arr.length)]
}

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function detectLang(text: string): 'en' | 'hi' {
  const hindiChars = text.match(/[\u0900-\u097F]/g)?.length || 0
  const total = text.replace(/\s/g, '').length
  return total > 0 && hindiChars / total > 0.3 ? 'hi' : 'en'
}

// Strip markdown for voice output
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/\n+/g, '. ')
    .replace(/•/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export default function VoiceBot() {
  const [active, setActive] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [listening, setListening] = useState(false)
  const [pulse, setPulse] = useState(false)
  const [lang, setLang] = useState<'en' | 'hi'>('en')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [textInput, setTextInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [interimText, setInterimText] = useState('')

  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const speakRef = useRef<((text: string, l?: 'en' | 'hi') => void) | null>(null)
  const langRef = useRef(lang)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => { langRef.current = lang }, [lang])

  useEffect(() => {
    if (typeof window !== 'undefined') synthRef.current = window.speechSynthesis
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ─── Speak ───
  const speak = useCallback((text: string, speakLang?: 'en' | 'hi') => {
    if (!synthRef.current) return
    synthRef.current.cancel()
    const cleanText = stripMarkdown(text)
    // Limit voice output to ~300 chars for natural feel
    const voiceText = cleanText.length > 400 ? cleanText.substring(0, 400) + '...' : cleanText
    const utter = new SpeechSynthesisUtterance(voiceText)
    const l = speakLang || langRef.current
    utter.rate = l === 'hi' ? 0.85 : 0.95
    utter.pitch = 1.0
    utter.volume = 1.0
    const voices = synthRef.current.getVoices()
    const target = l === 'hi' ? 'hi' : 'en'
    const voice = voices.find((v: SpeechSynthesisVoice) => v.lang.startsWith(target) && v.lang.includes('IN'))
      || voices.find((v: SpeechSynthesisVoice) => v.lang.startsWith(target))
      || voices.find((v: SpeechSynthesisVoice) => v.lang.startsWith('en'))
    if (voice) utter.voice = voice
    utter.onstart = () => setSpeaking(true)
    utter.onend = () => setSpeaking(false)
    utter.onerror = () => setSpeaking(false)
    synthRef.current.speak(utter)
  }, [])

  speakRef.current = speak

  // ─── AI Chat (uses unified chatbot API) ───
  const handleUserMessage = useCallback(async (text: string) => {
    const detectedLang = detectLang(text)
    if (detectedLang === 'hi' && langRef.current === 'en') {
      setLang('hi')
    }

    setMessages(prev => [...prev, { id: genId(), role: 'user', text, timestamp: new Date() }])
    setIsProcessing(true)
    const typingId = genId()
    setMessages(prev => [...prev, { id: typingId, role: 'bot', text: '', timestamp: new Date(), isTyping: true }])

    try {
      const controller = new AbortController()
      abortRef.current = controller

      // Use the unified chatbot API (same as SmartChatbot)
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          page: typeof window !== 'undefined' ? window.location.pathname : '/',
          history: messages.slice(-8).map(m => ({
            role: m.role === 'bot' ? 'assistant' : 'user',
            content: m.text,
          })),
        }),
        signal: controller.signal,
      })

      if (!res.ok) throw new Error(`API ${res.status}`)

      const data = await res.json()
      const response = data.response || (detectedLang === 'hi' ? 'मैं आपकी मदद के लिए यहां हूं!' : "I'm here to help!")

      setMessages(prev => prev.filter(m => m.id !== typingId))
      const botMsg: ChatMessage = {
        id: genId(),
        role: 'bot',
        text: response,
        timestamp: new Date(),
        searchResults: data.searchResults,
        lang: detectedLang,
      }
      setMessages(prev => [...prev, botMsg])

      // Auto-speak the response
      if (speakRef.current) {
        speakRef.current(response, detectedLang)
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return
      setMessages(prev => prev.filter(m => m.id !== typingId))
      const errMsg = detectedLang === 'hi'
        ? 'क्षमा करें, कनेक्शन में समस्या है। कृपया दोबारा कोशिश करें।'
        : 'Sorry, connection issue. Please try again.'
      setMessages(prev => [...prev, { id: genId(), role: 'bot', text: errMsg, timestamp: new Date(), lang: detectedLang }])
    }

    setIsProcessing(false)
  }, [messages])

  // ─── Voice Recognition ───
  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.lang = langRef.current === 'hi' ? 'hi-IN' : 'en-IN'
    recognition.interimResults = true
    recognition.continuous = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setListening(true)
      setPulse(true)
      setInterimText('')
    }

    recognition.onresult = (event: any) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript
        if (event.results[i].isFinal) final += t
        else interim += t
      }
      setInterimText(interim)
      if (final.trim()) {
        handleUserMessage(final.trim())
      }
    }

    recognition.onerror = () => {
      setListening(false)
      setPulse(false)
      setInterimText('')
    }

    recognition.onend = () => {
      setListening(false)
      setPulse(false)
      setInterimText('')
    }

    recognition.start()
  }, [handleUserMessage])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setListening(false)
    setPulse(false)
  }, [])

  // ─── Text Submit ───
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (textInput.trim() && !isProcessing) {
      handleUserMessage(textInput.trim())
      setTextInput('')
    }
  }

  // ─── Quick Action ───
  const handleQuickAction = (query: string) => {
    handleUserMessage(query)
  }

  // ─── Auto-greet ───
  useEffect(() => {
    if (active && messages.length === 0) {
      const gLang = lang
      const greeting = pickGreeting(gLang)
      setMessages([{ id: genId(), role: 'bot', text: greeting, timestamp: new Date(), lang: gLang }])
      setTimeout(() => {
        if (speakRef.current) speakRef.current(greeting, gLang)
      }, 500)
    }
  }, [active])

  const quickActions = lang === 'hi' ? QUICK_HI : QUICK_EN

  return (
    <div className="fixed bottom-24 right-6 z-[9998]">
      {/* Toggle Button */}
      <button
        onClick={() => setActive(!active)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 cursor-pointer ${
          active
            ? 'bg-gradient-to-br from-purple-600 to-indigo-700 shadow-purple-500/40 scale-110'
            : 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-purple-500/30 hover:scale-110'
        }`}
        aria-label="Voice Assistant"
      >
        {speaking ? (
          <div className="flex items-center gap-0.5">
            {[1,2,3,4].map(i => (
              <span key={i} className="w-1 bg-white rounded-full animate-pulse" style={{
                height: `${8 + Math.random() * 10}px`,
                animationDelay: `${i * 100}ms`,
                animationDuration: '0.4s',
              }} />
            ))}
          </div>
        ) : listening ? (
          <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center animate-pulse">
            <div className="w-3 h-3 bg-red-400 rounded-full" />
          </div>
        ) : (
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
          </svg>
        )}
        {pulse && <span className="absolute inset-0 rounded-full bg-purple-500 animate-ping opacity-20" />}
      </button>

      {/* Chat Panel */}
      {active && (
        <div className="absolute bottom-16 right-0 w-[380px] max-w-[calc(100vw-48px)] h-[520px] max-h-[calc(100vh-200px)] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-4 py-3 flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-lg">🎙️</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-sm">Voice Assistant</h3>
              <p className="text-purple-200 text-xs">
                {speaking ? '🔊 Speaking...' : listening ? '🎤 Listening...' : isProcessing ? '✨ Thinking...' : 'Tap mic or type'}
              </p>
            </div>
            <button
              onClick={() => { setLang(lang === 'en' ? 'hi' : 'en') }}
              className="px-2 py-1 bg-white/20 rounded text-white text-xs font-medium hover:bg-white/30 transition-colors"
            >
              {lang === 'en' ? 'हिं' : 'EN'}
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-900 min-h-0">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.isTyping ? (
                  <div className="bg-gray-800 border border-gray-700 px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                ) : (
                  <div className={`max-w-[88%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white rounded-br-md'
                      : 'bg-gray-800 text-gray-100 border border-gray-700 rounded-bl-md'
                  }`}>
                    <div className="whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.text) }} />
                    {msg.searchResults && msg.searchResults.length > 0 && (
                      <div className="mt-1.5 pt-1.5 border-t border-gray-600">
                        {msg.searchResults.slice(0, 2).map((r, i) => (
                          <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                            className="block text-[10px] text-purple-400 hover:text-purple-300 truncate">
                            📎 {r.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {interimText && (
              <div className="flex justify-end">
                <div className="bg-purple-800/50 text-purple-200 px-3 py-2 rounded-2xl rounded-br-md text-sm italic max-w-[88%]">
                  {interimText}...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 bg-gray-900 border-t border-gray-800 shrink-0">
              <div className="flex flex-wrap gap-1">
                {quickActions.map((a) => (
                  <button key={a.label} onClick={() => handleQuickAction(a.query)}
                    className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-[11px] rounded-full transition-colors cursor-pointer">
                    {a.icon} {a.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-2 bg-gray-800 border-t border-gray-700 shrink-0">
            <form onSubmit={handleTextSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={lang === 'hi' ? 'टाइप करें या बोलें...' : 'Type or speak...'}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                disabled={isProcessing}
              />
              <button
                type="button"
                onMouseDown={startListening}
                onMouseUp={stopListening}
                onTouchStart={startListening}
                onTouchEnd={stopListening}
                className={`rounded-xl px-3 py-2 transition-colors cursor-pointer ${
                  listening ? 'bg-red-500 text-white animate-pulse' : 'bg-purple-600 hover:bg-purple-500 text-white'
                }`}
              >
                🎤
              </button>
              <button
                type="submit"
                disabled={!textInput.trim() || isProcessing}
                className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 text-white rounded-xl px-3 py-2 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                ➤
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function formatMarkdown(text: string): string {
  if (!text) return ''
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
}

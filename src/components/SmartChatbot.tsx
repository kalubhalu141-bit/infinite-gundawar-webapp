'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// Typed handle for the browser-side free AI engine (public/ai.js)
interface IGLocalState { loaded: boolean; loading: boolean; available: boolean; error: string | null; modelId: string }
interface IGAI {
  state: IGLocalState
  initLocal: () => Promise<IGLocalState>
  localChat: (prompt: string, system?: string) => Promise<{ text: string; source: string }>
  summarize: (text: string) => Promise<string>
  translate: (text: string, target: string) => Promise<string>
}
declare global {
  interface Window { IG_AI?: IGAI }
}

// Free-model options surfaced in the UI (subset of the 12 free models on the server)
const FREE_MODEL_CHOICES = [
  { id: 'google/gemma-4-31b-it:free', label: 'Gemma 4 31B' },
  { id: 'nousresearch/hermes-3-llama-3.1-405b:free', label: 'Hermes 405B' },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', label: 'Llama 70B' },
  { id: 'openai/gpt-oss-120b:free', label: 'GPT-OSS 120B' },
  { id: 'qwen/qwen3-coder:free', label: 'Qwen3 Coder' },
  { id: 'meta-llama/llama-3.2-3b-instruct:free', label: 'Llama 3B (fast)' },
]

interface Message {
  id: number
  role: 'user' | 'bot' | 'system'
  text: string
  timestamp: Date
  searchResults?: {title: string; url: string; snippet: string}[]
}

interface QuickAction {
  label: string
  icon: string
  message: string
  page?: string
}

// ─── Page-aware quick actions ───
const getQuickActions = (page?: string): QuickAction[] => {
  // Page-specific actions
  if (page?.includes('/finance')) return [
    { label: '📈 Trading Patterns', icon: '📈', message: 'Show me all trading patterns available' },
    { label: '💹 Stock Guide', icon: '💹', message: 'What stocks should I invest in right now?' },
    { label: '📊 Technical Analysis', icon: '📊', message: 'Explain technical analysis basics' },
    { label: '🏦 Contact Finance Team', icon: '🏦', message: 'How do I contact the finance team?' },
  ]
  if (page?.includes('/ayurveda')) return [
    { label: '🌿 Top Herbs', icon: '🌿', message: 'What are the most popular ayurvedic herbs?' },
    { label: '🧘 Dosha Test', icon: '🧘', message: 'How do I know my dosha type?' },
    { label: '💪 Immunity', icon: '💪', message: 'Best herbs for immunity boosting' },
    { label: '📞 Book Consultation', icon: '📞', message: 'How do I book an ayurvedic consultation?' },
  ]
  if (page?.includes('/career')) return [
    { label: '💼 Open Jobs', icon: '💼', message: 'What positions are currently open?' },
    { label: '📝 Apply', icon: '📝', message: 'How do I apply for a job?' },
    { label: '💰 Salary', icon: '💰', message: 'What is the salary range?' },
    { label: '📧 Send Resume', icon: '📧', message: 'Where should I send my resume?' },
  ]
  if (page?.includes('/property') || page?.includes('/real')) return [
    { label: '🏠 Available Properties', icon: '🏠', message: 'What properties are available?' },
    { label: '📍 Locations', icon: '📍', message: 'In which cities do you have properties?' },
    { label: '💰 Pricing', icon: '💰', message: 'What is the price range for properties?' },
    { label: '📋 RERA Info', icon: '📋', message: 'Are your projects RERA registered?' },
  ]
  if (page?.includes('/ai-tools')) return [
    { label: '🤖 AI Directory', icon: '🤖', message: 'What AI tools do you have on the website?' },
    { label: '🔍 Web Search', icon: '🔍', message: 'Can you search the web for me?' },
    { label: '📊 Lead Gen', icon: '📊', message: 'Tell me about lead generation tools' },
    { label: '📧 Email Tools', icon: '📧', message: 'What email tools are available?' },
  ]
  if (page?.includes('/interior')) return [
    { label: '🏠 Design Services', icon: '🏠', message: 'What interior design services do you offer?' },
    { label: '🧱 Materials', icon: '🧱', message: 'What wholesale materials are available?' },
    { label: '💡 Consultation', icon: '💡', message: 'How do I book a design consultation?' },
  ]

  // Default / home page actions
  return [
    { label: '🏗️ Infrastructure', icon: '🏗️', message: 'Tell me about your infrastructure and construction services' },
    { label: '🏠 Real Estate', icon: '🏠', message: 'What real estate projects do you have?' },
    { label: '📈 Finance & Trading', icon: '📈', message: 'Tell me about finance and trading services' },
    { label: '🌿 Ayurveda', icon: '🌿', message: 'Tell me about your ayurveda services' },
    { label: '💼 Careers', icon: '💼', message: 'What career opportunities are available?' },
    { label: '🌐 Page Guide', icon: '🌐', message: 'What pages are on this website?' },
    { label: '📞 Contact Us', icon: '📞', message: 'How can I contact Infinite Gundawar?' },
  ]
}

// ─── Detect current page from URL ───
function getCurrentPage(): string {
  if (typeof window === 'undefined') return '/'
  return window.location.pathname
}

// ─── Detect language ───
function detectLang(text: string): 'en' | 'hi' {
  const hindiChars = text.match(/[\u0900-\u097F]/g)?.length || 0
  const total = text.replace(/\s/g, '').length
  return total > 0 && hindiChars / total > 0.3 ? 'hi' : 'en'
}

export default function SmartChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [unread, setUnread] = useState(0)
  const [hasGreeted, setHasGreeted] = useState(false)
  const [quickActions, setQuickActions] = useState<QuickAction[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [engineStatus, setEngineStatus] = useState<string>('checking…')
  const [selectedModel, setSelectedModel] = useState<string>('google/gemma-4-31b-it:free')
  const [localAiStatus, setLocalAiStatus] = useState<string>('idle')
  const [showTools, setShowTools] = useState(false)
  const [toolBusy, setToolBusy] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const idCounter = useRef(0)
  const abortRef = useRef<AbortController | null>(null)
  const pageRef = useRef('/')

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])

  // Detect page and update quick actions
  useEffect(() => {
    const page = getCurrentPage()
    pageRef.current = page
    setQuickActions(getQuickActions(page))
  }, [isOpen])

  // Fetch engine status + init browser-local AI (no key) when chat opens
  useEffect(() => {
    if (!isOpen) return
    fetch('/api/ai').then(r => r.json()).then(d => {
      const e = d?.engine
      if (e?.hasKey) setEngineStatus(`🌐 ${e.freeModelCount} free LLMs`)
      else setEngineStatus('🧠 Local KB + browser AI')
    }).catch(() => setEngineStatus('🧠 Offline'))

    // Kick off browser-local model load (non-blocking)
    const ig = window.IG_AI
    if (ig && !ig.state.loaded && !ig.state.loading) {
      setLocalAiStatus('loading…')
      ig.initLocal().then((st) => {
        setLocalAiStatus(st.available ? '✅ on-device' : '⚠️ unavailable')
      }).catch(() => setLocalAiStatus('⚠️ unavailable'))
    } else if (ig) {
      setLocalAiStatus(ig.state.available ? '✅ on-device' : (ig.state.loading ? 'loading…' : '⚠️ unavailable'))
    }
  }, [isOpen])

  // Greeting on first open
  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setHasGreeted(true)
      const page = pageRef.current
      const isHindi = false // default greeting in English
      const greeting: Message = {
        id: ++idCounter.current,
        role: 'bot',
        text: "👋 Welcome to **Infinite Gundawar**! I'm your AI assistant.\n\nI can help you with:\n• 🏗️ Infrastructure & Construction\n• 🏠 Real Estate & Properties\n• 📈 Finance & Trading\n• 🌿 Ayurveda & Wellness\n• 💼 Career Opportunities\n• 🌐 Any questions about our services\n\n🌍 I can also **search the web** for anything you need!\n\nHow can I help you today?",
        timestamp: new Date(),
      }
      setMessages([greeting])
      setUnread(0)
      if (inputRef.current) inputRef.current.focus()
    }
  }, [isOpen, hasGreeted])

  // Auto-open nudge after 20s
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasGreeted) setUnread(1)
    }, 20000)
    return () => clearTimeout(timer)
  }, [hasGreeted])

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return

    // Cancel any ongoing stream
    if (abortRef.current) abortRef.current.abort()

    const userMsg: Message = {
      id: ++idCounter.current,
      role: 'user',
      text: text.trim(),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)
    setIsStreaming(true)

    // Create streaming bot message
    const botId = ++idCounter.current
    const botMsg: Message = {
      id: botId,
      role: 'bot',
      text: '',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, botMsg])

    try {
      const controller = new AbortController()
      abortRef.current = controller

      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          page: pageRef.current,
          model: selectedModel,
          history: messages.slice(-10).map(m => ({
            role: m.role === 'bot' ? 'assistant' : m.role,
            content: m.text,
          })),
        }),
        signal: controller.signal,
      })

      if (!res.ok) throw new Error(`API ${res.status}`)

      // Handle streaming or JSON response
      const contentType = res.headers.get('content-type') || ''

      if (contentType.includes('text/event-stream')) {
        // Streaming response
        const reader = res.body?.getReader()
        const decoder = new TextDecoder()
        let fullText = ''

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n')
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') break
                try {
                  const parsed = JSON.parse(data)
                  const delta = parsed.choices?.[0]?.delta?.content || ''
                  fullText += delta
                  setMessages(prev =>
                    prev.map(m => m.id === botId ? { ...m, text: fullText } : m)
                  )
                } catch {}
              }
            }
          }
        }
        setIsStreaming(false)
      } else {
        // JSON response (non-streaming fallback)
        const data = await res.json()
        setMessages(prev =>
          prev.map(m => m.id === botId ? {
            ...m,
            text: data.response || "I'm having trouble. Please try again.",
            searchResults: data.searchResults,
          } : m)
        )
        setIsStreaming(false)
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return
      setMessages(prev =>
        prev.map(m => m.id === botId ? {
          ...m,
          text: "Sorry, I'm having trouble connecting right now. Please try again or call 📞 +91 79721 40672",
        } : m)
      )
      setIsStreaming(false)
    }

    setIsTyping(false)
    if (isOpen && inputRef.current) inputRef.current.focus()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleQuickAction = (message: string) => {
    sendMessage(message)
  }

  // ── AI Tools (all free) ──
  const runTool = async (tool: 'summarize' | 'translate' | 'classify' | 'sentiment') => {
    setToolBusy(tool)
    try {
      const ig = window.IG_AI
      if (tool === 'summarize') {
        const pageText = document.body.innerText.slice(0, 3000)
        let result = ''
        if (ig?.state?.available) result = (await ig.summarize(pageText)) || ''
        if (!result) {
          const r = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task: 'summarize', text: pageText }) })
          result = (await r.json()).result || ''
        }
        pushToolResult('📝 Page Summary', result)
      } else if (tool === 'translate') {
        const sel = (window.getSelection()?.toString() || document.body.innerText.slice(0, 1500))
        let result = ''
        if (ig?.state?.available) result = (await ig.translate(sel, 'hi')) || ''
        if (!result) {
          const r = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task: 'translate', text: sel, target: 'hi' }) })
          result = (await r.json()).result || ''
        }
        pushToolResult('🌐 Hindi Translation', result)
      } else if (tool === 'classify') {
        const r = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: 'classify', text: input || 'general enquiry' }) })
        const d = await r.json(); pushToolResult('🏷️ Intent', d.result || 'other')
      } else if (tool === 'sentiment') {
        const r = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: 'sentiment', text: input || 'great service' }) })
        const d = await r.json(); pushToolResult('💡 Sentiment', d.result || 'neutral')
      }
    } catch {
      pushToolResult('⚠️ Tool', 'Could not complete. Try again or add OPENROUTER_API_KEY.')
    }
    setToolBusy(null)
  }

  const pushToolResult = (title: string, text: string) => {
    const id = ++idCounter.current
    setMessages(prev => [...prev, {
      id,
      role: 'bot',
      text: `**${title}**\n\n${text}`,
      timestamp: new Date(),
    }])
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => { setIsOpen(!isOpen); setUnread(0) }}
        className="fixed bottom-6 right-6 z-[9999] w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 shadow-2xl shadow-emerald-500/40 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-emerald-500/60 cursor-pointer group"
        aria-label="AI Assistant"
      >
        {isOpen ? (
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-white group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        )}
        {unread > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
            {unread}
          </span>
        )}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[9999] w-[400px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-140px)] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-5 py-3 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-sm">Infinite Gundawar AI</h3>
              <p className="text-emerald-100 text-xs truncate">
                {isStreaming ? '✨ Thinking...' : `Always here to help • ${engineStatus}`}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-yellow-400 animate-pulse' : 'bg-green-400 animate-pulse'}`} />
              <span className="text-emerald-200 text-[10px] uppercase font-medium">
                {isStreaming ? 'AI' : 'ON'}
              </span>
            </div>
          </div>

          {/* Engine + model bar */}
          <div className="bg-gray-800/60 px-3 py-2 flex items-center gap-2 shrink-0 border-b border-gray-700">
            <span className="text-[10px] text-emerald-300 whitespace-nowrap">🧠 {localAiStatus}</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="flex-1 min-w-0 bg-gray-900 border border-gray-700 rounded-lg text-[11px] text-emerald-200 px-2 py-1 focus:outline-none focus:border-emerald-500"
              title="Choose a FREE AI model"
            >
              {FREE_MODEL_CHOICES.map((m) => (
                <option key={m.id} value={m.id}>{m.label} · free</option>
              ))}
            </select>
            <button
              onClick={() => setShowTools(!showTools)}
              className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 rounded-lg text-[11px] text-white transition-colors cursor-pointer"
              title="AI Tools"
            >🛠️</button>
          </div>

          {/* AI Tools panel */}
          {showTools && (
            <div className="bg-gray-900 px-3 py-2 border-b border-gray-800 shrink-0">
              <p className="text-[10px] text-gray-500 mb-1.5 font-medium">Free AI Tools</p>
              <div className="flex flex-wrap gap-1.5">
                <button onClick={() => runTool('summarize')} disabled={toolBusy==='summarize'}
                  className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs rounded-lg cursor-pointer disabled:opacity-50">📝 Summarize page</button>
                <button onClick={() => runTool('translate')} disabled={toolBusy==='translate'}
                  className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs rounded-lg cursor-pointer disabled:opacity-50">🌐 → Hindi</button>
                <button onClick={() => runTool('classify')} disabled={toolBusy==='classify'}
                  className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs rounded-lg cursor-pointer disabled:opacity-50">🏷️ Intent</button>
                <button onClick={() => runTool('sentiment')} disabled={toolBusy==='sentiment'}
                  className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs rounded-lg cursor-pointer disabled:opacity-50">💡 Sentiment</button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-900 min-h-0">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-md'
                    : 'bg-gray-800 text-gray-100 border border-gray-700 rounded-bl-md'
                }`}>
                  <div className="whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.text) }} />

                  {/* Search results links */}
                  {msg.searchResults && msg.searchResults.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-600">
                      <p className="text-[10px] text-gray-400 mb-1 font-medium">📎 Sources:</p>
                      {msg.searchResults.slice(0, 3).map((r, i) => (
                        <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                          className="block text-[11px] text-emerald-400 hover:text-emerald-300 truncate mb-0.5">
                          {i + 1}. {r.title}
                        </a>
                      ))}
                    </div>
                  )}

                  <div className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-emerald-200' : 'text-gray-500'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {msg.searchResults && <span className="ml-1 text-blue-400">• 🔍 Web Search</span>}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && !isStreaming && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && quickActions.length > 0 && (
            <div className="px-4 py-2 bg-gray-900 border-t border-gray-800 shrink-0">
              <p className="text-[10px] text-gray-500 mb-1.5 font-medium">Quick Actions</p>
              <div className="flex flex-wrap gap-1.5">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action.message)}
                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs rounded-full transition-colors cursor-pointer"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2 shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything... (English or हिंदी)"
              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl px-4 py-2.5 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  )
}

function formatMarkdown(text: string): string {
  if (!text) return ''
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-700 px-1 rounded text-emerald-300 text-xs">$1</code>')
    .replace(/\\n/g, '<br/>')
    .replace(/\n/g, '<br/>')
}

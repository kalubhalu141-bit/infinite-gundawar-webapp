'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: number
  role: 'user' | 'bot'
  text: string
  timestamp: Date
}

interface ScraperBotConfig {
  id: string
  name: string
  icon: string
  gradient: string
  description: string
  expertise: string[]
  suggestions: string[]
  queryTemplates: string[]
  responses: Record<string, string>
}

const scraperBots: ScraperBotConfig[] = [
  {
    id: 'business-worldwide',
    name: 'LeadBot',
    icon: '🌍',
    gradient: 'from-blue-600 to-indigo-700',
    description: 'Business Leads Worldwide',
    expertise: ['Company directories', 'B2B leads', 'Manufacturers', 'Suppliers', 'Service providers', 'Wholesale dealers'],
    suggestions: [
      'Find software companies in USA',
      'Find manufacturers in Germany',
      'Find suppliers in China',
      'Find wholesale dealers in UAE',
    ],
    queryTemplates: [
      '{business_type} companies in {country}',
      '{business_type} manufacturers in {country}',
      '{business_type} suppliers in {country}',
      'top {business_type} in {country}',
      '{business_type} directory {country}',
    ],
    responses: {
      'software companies': 'I\'ll help you find software companies worldwide! 🌍\n\n**Try these queries:**\n• "software companies in United States"\n• "software companies in United Kingdom"\n• "software companies in Germany"\n• "software companies in Japan"\n\n**Tips:**\n✅ Add the country name for specific results\n✅ Use "top" or "best" for ranked lists\n✅ Add "directory" for directory-style results\n\nSelect **Category 1** and enter your query to start scraping!',
      'manufacturers': 'Great choice for finding manufacturers! 🏭\n\n**Popular manufacturer searches:**\n• "textile manufacturers in India"\n• "electronics manufacturers in China"\n• "auto parts manufacturers in Germany"\n• "pharmaceutical manufacturers in USA"\n\n**Pro tips:**\n✅ Specify the industry + country\n✅ Use "wholesale manufacturers" for B2B leads\n✅ Add "ISO certified" for quality manufacturers\n\nSelect **Category 1** and enter your query!',
      'suppliers': 'Finding suppliers is key for sourcing! 📦\n\n**Effective supplier queries:**\n• "raw material suppliers in India"\n• "electronics suppliers in China"\n• "food suppliers in UAE"\n• "construction material suppliers in USA"\n\n**Tips:**\n✅ Be specific about the product/material\n✅ Add "bulk" or "wholesale" for volume suppliers\n✅ Include country for local sourcing\n\nSelect **Category 1** to start scraping suppliers!',
      'default': 'Hello! I\'m **LeadBot** 🌍, your Business Leads expert.\n\nI help you find **business leads worldwide**:\n• Companies & Manufacturers\n• Suppliers & Distributors\n• Service Providers\n• Wholesale Dealers\n\n**How to use:**\n1️⃣ Select **Category 1** (Business Worldwide)\n2️⃣ Tell me what you\'re looking for\n3️⃣ I\'ll suggest the best search query\n4️⃣ Click "Scrape Data" to extract!\n\nWhat kind of businesses are you looking for?'
    }
  },
  {
    id: 'business-india',
    name: 'IndiaBizBot',
    icon: '🇮🇳',
    gradient: 'from-orange-500 to-red-600',
    description: 'Indian Business Directory',
    expertise: ['Indian companies', 'Local businesses', 'Dealers & distributors', 'Retail shops', 'Service providers', 'Startups'],
    suggestions: [
      'Find IT companies in Mumbai',
      'Find dealers in Delhi',
      'Find manufacturers in Gujarat',
      'Find startups in Bangalore',
    ],
    queryTemplates: [
      '{business_type} in {city} India',
      '{business_type} dealers in {city}',
      '{business_type} manufacturers in {state}',
      'top {business_type} companies in India',
      '{business_type} directory India',
    ],
    responses: {
      'it companies': 'Perfect! India has a massive IT sector! 💻\n\n**Top IT company queries:**\n• "IT companies in Mumbai India"\n• "IT companies in Bangalore India"\n• "IT companies in Hyderabad India"\n• "IT companies in Pune India"\n• "software companies in Chennai India"\n\n**Pro tips:**\n✅ Specify the city for local results\n✅ Add "startup" for emerging companies\n✅ Use "top" or "best" for ranked lists\n✅ Include "MNC" for multinational companies\n\nSelect **Category 2** and enter your query!',
      'dealers': 'Finding dealers is great for distribution! 🏪\n\n**Dealer search queries:**\n• "electronic dealers in Delhi India"\n• "auto parts dealers in Mumbai India"\n• "textile dealers in Surat India"\n• "food distributors in Chennai India"\n\n**Tips:**\n✅ Specify product type + city\n✅ Use "authorized dealers" for official channels\n✅ Add "wholesale dealers" for bulk pricing\n\nSelect **Category 2** to start scraping dealers!',
      'manufacturers': 'India is a manufacturing powerhouse! 🏭\n\n**Manufacturer queries:**\n• "textile manufacturers in Gujarat India"\n• "pharmaceutical manufacturers in Hyderabad India"\n• "auto parts manufacturers in Pune India"\n• "food processing manufacturers in India"\n\n**Tips:**\n✅ Specify industry + state/city\n✅ Add "export" for export-oriented units\n✅ Use "MSME" for small/medium manufacturers\n\nSelect **Category 2** to find manufacturers!',
      'default': 'Hello! I\'m **IndiaBizBot** 🇮🇳, your Indian Business expert.\n\nI help you find **businesses across India**:\n• Companies & Startups\n• Dealers & Distributors\n• Manufacturers & Suppliers\n• Local Service Providers\n\n**How to use:**\n1️⃣ Select **Category 2** (Business India)\n2️⃣ Tell me what you need\n3️⃣ I\'ll suggest the best query\n4️⃣ Click "Scrape Data" to extract!\n\nWhat kind of Indian businesses are you looking for?'
    }
  },
  {
    id: 'professionals',
    name: 'ProBot',
    icon: '👥',
    gradient: 'from-purple-600 to-pink-600',
    description: 'Professionals & Students',
    expertise: ['LinkedIn profiles', 'Industry experts', 'Freelancers', 'Students', 'Researchers', 'Consultants'],
    suggestions: [
      'Find software engineers in India',
      'Find doctors in USA',
      'Find students in UK',
      'Find freelancers worldwide',
    ],
    queryTemplates: [
      '{profession} in {country}',
      '{profession} professionals in {city}',
      '{profession} experts in {country}',
      'top {profession} in {industry}',
      '{profession} LinkedIn profiles {country}',
    ],
    responses: {
      'software engineers': 'Great choice! Software engineers are in high demand! 💻\n\n**Search queries:**\n• "software engineers in India"\n• "software engineers in United States"\n• "full stack developers in UK"\n• "Python developers in Germany"\n\n**Tips:**\n✅ Specify the technology/stack\n✅ Add "senior" or "lead" for experienced professionals\n✅ Include city for local talent\n✅ Use "LinkedIn" for professional profiles\n\nSelect **Category 3** and enter your query!',
      'doctors': 'Finding medical professionals! 🏥\n\n**Doctor search queries:**\n• "cardiologists in India"\n• "surgeons in United States"\n• "pediatricians in UK"\n• "dermatologists in Australia"\n\n**Tips:**\n✅ Specify the specialization\n✅ Add city/state for local results\n✅ Use "consultant" for senior doctors\n✅ Include "hospital" for institutional doctors\n\nSelect **Category 3** to find medical professionals!',
      'students': 'Finding students for research or recruitment! 🎓\n\n**Student search queries:**\n• "engineering students in India"\n• "MBA students in UK"\n• "medical students in USA"\n• "PhD students in Germany"\n\n**Tips:**\n✅ Specify the field of study\n✅ Add university name for specific results\n✅ Use "graduating" for final-year students\n✅ Include "scholarship" for funding-related searches\n\nSelect **Category 3** to find students!',
      'default': 'Hello! I\'m **ProBot** 👥, your Professionals & Students expert.\n\nI help you find **people across India & world**:\n• Industry Professionals\n• LinkedIn Profiles\n• Freelancers & Consultants\n• Students & Researchers\n\n**How to use:**\n1️⃣ Select **Category 3** (Professionals/Students)\n2️⃣ Tell me who you\'re looking for\n3️⃣ I\'ll suggest the best query\n4️⃣ Click "Scrape Data" to extract!\n\nWhat kind of professionals are you looking for?'
    }
  },
  {
    id: 'people-worldwide',
    name: 'PeopleBot',
    icon: '🌐',
    gradient: 'from-teal-500 to-cyan-600',
    description: 'People Worldwide',
    expertise: ['Public profiles', 'Social media', 'Contact directories', 'Personal websites', 'Professional networks'],
    suggestions: [
      'Find business professionals in UK',
      'Find entrepreneurs in USA',
      'Find artists in France',
      'Find investors in Singapore',
    ],
    queryTemplates: [
      '{person_type} in {country}',
      '{person_type} contacts in {city}',
      '{person_type} directory {country}',
      'find {person_type} in {industry}',
      '{person_type} profiles {country}',
    ],
    responses: {
      'business professionals': 'Finding business professionals globally! 💼\n\n**Search queries:**\n• "business professionals in United Kingdom"\n• "entrepreneurs in United States"\n• "CEOs in Singapore"\n• "startup founders in India"\n\n**Tips:**\n✅ Specify the role/title\n✅ Add industry for targeted results\n✅ Use "LinkedIn" for professional profiles\n✅ Include city for local networking\n\nSelect **Category 4** and enter your query!',
      'entrepreneurs': 'Finding entrepreneurs for networking! 🚀\n\n**Entrepreneur queries:**\n• "tech entrepreneurs in USA"\n• "startup founders in India"\n• "women entrepreneurs in UK"\n• "social entrepreneurs in Australia"\n\n**Tips:**\n✅ Specify the industry/sector\n✅ Add "startup" for new ventures\n✅ Use "serial entrepreneur" for experienced founders\n✅ Include city for local ecosystem\n\nSelect **Category 4** to find entrepreneurs!',
      'investors': 'Finding investors for funding! 💰\n\n**Investor queries:**\n• "angel investors in India"\n• "venture capitalists in USA"\n• "investors in Singapore"\n• "private equity investors in UK"\n\n**Tips:**\n✅ Specify investment type (angel, VC, PE)\n✅ Add industry focus for relevant investors\n✅ Use "active investors" for currently investing\n✅ Include city for local investor networks\n\nSelect **Category 4** to find investors!',
      'default': 'Hello! I\'m **PeopleBot** 🌐, your People Search expert.\n\nI help you find **people worldwide**:\n• Business Professionals\n• Entrepreneurs & Founders\n• Investors & Mentors\n• Artists & Creators\n\n**How to use:**\n1️⃣ Select **Category 4** (People Worldwide)\n2️⃣ Tell me who you\'re looking for\n3️⃣ I\'ll suggest the best query\n4️⃣ Click "Scrape Data" to extract!\n\nWhat kind of people are you looking for?'
    }
  },
]

interface DataScraperBotProps {
  onQuerySelect: (query: string, category: string) => void
  activeCategory: string
}

export default function DataScraperBot({ onQuerySelect, activeCategory }: DataScraperBotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeBot, setActiveBot] = useState<ScraperBotConfig>(scraperBots[0])
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-switch bot based on active category
  useEffect(() => {
    const botMap: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3 }
    const idx = botMap[activeCategory] || 0
    setActiveBot(scraperBots[idx])
  }, [activeCategory])

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      const greeting = activeBot.responses['default'] || `Hello! I'm ${activeBot.name}. How can I help you find data?`
      setMessages([{
        id: 1,
        role: 'bot',
        text: greeting,
        timestamp: new Date(),
      }])
    }
  }, [activeBot, messages.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      text: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setShowSuggestions(false)
    setIsTyping(true)

    // Find matching response
    const lowerInput = input.toLowerCase()
    let responseText = activeBot.responses['default']

    for (const [key, response] of Object.entries(activeBot.responses)) {
      if (key !== 'default' && lowerInput.includes(key)) {
        responseText = response
        break
      }
    }

    // If no keyword match, generate a helpful response
    if (responseText === activeBot.responses['default'] && !lowerInput.includes('default')) {
      const catNames: Record<string, string> = {
        '1': 'Category 1 (Business Worldwide)',
        '2': 'Category 2 (Business India)',
        '3': 'Category 3 (Professionals/Students)',
        '4': 'Category 4 (People Worldwide)',
      }
      const catName = catNames[activeCategory] || 'the selected category'

      responseText = `Great! Let me help you scrape data for "${input}" 🔍\n\n**Suggested search query:**\n\`\`\`\n${input}\n\`\`\`\n\n**Steps:**\n1️⃣ Make sure **${catName}** is selected\n2️⃣ Enter this query in the search box\n3️⃣ Click **"Scrape Data"**\n\n**Pro tips:**\n✅ Be specific about location (city/country)\n✅ Add industry keywords for better results\n✅ Use "top" or "best" for ranked lists\n✅ Try different query variations for more data\n\nWant me to suggest a more specific query?`
    }

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'bot',
        text: responseText,
        timestamp: new Date(),
      }])
      setIsTyping(false)
    }, 800)
  }

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion)
    setShowSuggestions(false)

    // Auto-submit the suggestion
    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      text: suggestion,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)

    // Find matching response
    const lowerInput = suggestion.toLowerCase()
    let responseText = activeBot.responses['default']
    for (const [key, response] of Object.entries(activeBot.responses)) {
      if (key !== 'default' && lowerInput.includes(key)) {
        responseText = response
        break
      }
    }

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'bot',
        text: responseText,
        timestamp: new Date(),
      }])
      setIsTyping(false)
    }, 600)
  }

  const handleQuickQuery = (query: string) => {
    onQuerySelect(query, activeCategory)
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-[#1e3a5f] to-[#2c5282] rounded-full shadow-2xl shadow-[#1e3a5f]/30 flex items-center justify-center hover:scale-110 transition-transform group"
      >
        <span className="text-2xl">{activeBot.icon}</span>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-[#1e3a5f] text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {activeBot.name} — Click to chat
        </div>
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${activeBot.gradient} p-4 text-white`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">
              {activeBot.icon}
            </div>
            <div>
              <h3 className="font-bold text-sm">{activeBot.name}</h3>
              <p className="text-xs text-white/70">{activeBot.description}</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Bot Selector Tabs */}
        <div className="flex gap-1.5">
          {scraperBots.map(bot => (
            <button
              key={bot.id}
              onClick={() => {
                setActiveBot(bot)
                setMessages([{
                  id: Date.now(),
                  role: 'bot',
                  text: bot.responses['default'],
                  timestamp: new Date(),
                }])
                setShowSuggestions(true)
              }}
              className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeBot.id === bot.id
                  ? 'bg-white/25 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/15'
              }`}
            >
              {bot.icon} {bot.name}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Query Templates */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-500 mb-2">⚡ Quick Queries (click to use):</p>
        <div className="flex flex-wrap gap-1.5">
          {activeBot.queryTemplates.slice(0, 4).map((template, i) => (
            <button
              key={i}
              onClick={() => handleQuickQuery(template.replace(/\{(\w+)\}/g, (_, key) => {
                const defaults: Record<string, string> = {
                  business_type: 'software',
                  country: 'United States',
                  city: 'Mumbai',
                  state: 'Maharashtra',
                  profession: 'software engineer',
                  person_type: 'business professional',
                  industry: 'technology',
                }
                return defaults[key] || key
              }))}
              className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 hover:border-[#1e3a5f]/30 hover:bg-[#1e3a5f]/5 transition-all"
            >
              {template.replace(/\{(\w+)\}/g, (_, key) => {
                const defaults: Record<string, string> = {
                  business_type: 'software',
                  country: 'US',
                  city: 'Mumbai',
                  state: 'MH',
                  profession: 'engineer',
                  person_type: 'professional',
                  industry: 'tech',
                }
                return defaults[key] || key
              })}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[300px]">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-1' : ''}`}>
              {msg.role === 'bot' && (
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs">{activeBot.icon}</span>
                  <span className="text-xs font-medium text-gray-500">{activeBot.name}</span>
                </div>
              )}
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-[#1e3a5f] text-white rounded-br-md'
                  : 'bg-gray-100 text-gray-700 rounded-bl-md'
              }`}>
                {msg.text}
              </div>
              <p className={`text-[10px] text-gray-400 mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Suggestions */}
        {showSuggestions && messages.length <= 2 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-400 font-medium">💡 Suggested questions:</p>
            {activeBot.suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSuggestion(s)}
                className="w-full text-left px-4 py-2.5 bg-white rounded-xl border border-gray-100 text-sm text-gray-600 hover:border-[#1e3a5f]/30 hover:bg-[#1e3a5f]/5 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`Ask ${activeBot.name.replace('Bot', '')} for query suggestions...`}
            className="flex-1 px-4 py-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 border border-gray-100 focus:border-[#1e3a5f]/30 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
              input.trim()
                ? `bg-gradient-to-r ${activeBot.gradient} text-white shadow-lg`
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}

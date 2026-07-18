'use client'
import GoalModeFeatures from '@/components/GoalModeFeatures'
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import PageEnhancements from '@/components/PageEnhancements'
import OnDevicePanel from '@/components/OnDevicePanel'
import Footer from '@/components/Footer'

const aiTools = [
  { name: 'ChatGPT', category: 'Chatbot', url: 'https://chat.openai.com', description: 'AI chatbot by OpenAI for conversation, writing, coding, and analysis', pricing: 'Free / $20/mo', rating: 4.9 },
  { name: 'Claude AI', category: 'Chatbot', url: 'https://claude.ai', description: 'Anthropic\'s AI assistant — excellent for long-form content and coding', pricing: 'Free / $20/mo', rating: 4.8 },
  { name: 'Gemini', category: 'Chatbot', url: 'https://gemini.google.com', description: 'Google\'s AI — integrated with Google Workspace, real-time web access', pricing: 'Free', rating: 4.7 },
  { name: 'Microsoft Copilot', category: 'Chatbot', url: 'https://copilot.microsoft.com', description: 'Microsoft\'s AI — integrated with Office 365 and Windows', pricing: 'Free / $20/mo', rating: 4.6 },
  { name: 'Midjourney', category: 'Image Gen', url: 'https://midjourney.com', description: 'AI image generator — photorealistic and artistic image creation', pricing: '$10-60/mo', rating: 4.9 },
  { name: 'DALL-E 3', category: 'Image Gen', url: 'https://openai.com/dall-e-3', description: 'OpenAI\'s image generator — integrated with ChatGPT Plus', pricing: '$20/mo', rating: 4.7 },
  { name: 'Stable Diffusion', category: 'Image Gen', url: 'https://stablediffusionweb.com', description: 'Open-source AI image generation — runs locally or cloud', pricing: 'Free / $9/mo', rating: 4.5 },
  { name: 'Leonardo AI', category: 'Image Gen', url: 'https://leonardo.ai', description: 'AI art generation with fine-tuned models for game assets, concepts', pricing: 'Free / $10/mo', rating: 4.6 },
  { name: 'Runway ML', category: 'Video Gen', url: 'https://runwayml.com', description: 'AI video generation — text to video, video editing with AI', pricing: 'Free / $15/mo', rating: 4.5 },
  { name: 'Pika Labs', category: 'Video Gen', url: 'https://pika.art', description: 'AI video generation platform — create videos from text/images', pricing: 'Free / $10/mo', rating: 4.4 },
  { name: 'Synthesia', category: 'Video Gen', url: 'https://synthesia.io', description: 'AI avatar video creation — create videos with AI presenters', pricing: '$22/mo', rating: 4.5 },
  { name: 'ElevenLabs', category: 'Audio/Voice', url: 'https://elevenlabs.io', description: 'AI voice cloning and text-to-speech — ultra-realistic voices', pricing: 'Free / $5/mo', rating: 4.8 },
  { name: 'Murf AI', category: 'Audio/Voice', url: 'https://murf.ai', description: 'AI voiceover generator — 120+ voices in 20+ languages', pricing: 'Free / $19/mo', rating: 4.5 },
  { name: 'GitHub Copilot', category: 'Coding', url: 'https://github.com/features/copilot', description: 'AI code completion — autocomplete for 10+ programming languages', pricing: '$10/mo', rating: 4.8 },
  { name: 'Replit AI', category: 'Coding', url: 'https://replit.com/ai', description: 'AI-powered coding environment — build and deploy with AI', pricing: 'Free / $10/mo', rating: 4.4 },
  { name: 'Cursor AI', category: 'Coding', url: 'https://cursor.sh', description: 'AI-first code editor — GPT-4 powered coding assistant', pricing: '$20/mo', rating: 4.7 },
  { name: 'Notion AI', category: 'Productivity', url: 'https://notion.so/product/ai', description: 'AI writing assistant integrated with Notion workspace', pricing: '$10/mo', rating: 4.6 },
  { name: 'Grammarly GO', category: 'Productivity', url: 'https://grammarly.com', description: 'AI writing assistant — grammar, tone, and style improvements', pricing: 'Free / $12/mo', rating: 4.7 },
  { name: 'Canva AI', category: 'Design', url: 'https://canva.com', description: 'AI design tools — Magic Design, text to image, background remover', pricing: 'Free / $12/mo', rating: 4.8 },
  { name: 'Figma AI', category: 'Design', url: 'https://figma.com', description: 'AI features in Figma — auto-layout, design suggestions, code gen', pricing: 'Free / $12/mo', rating: 4.7 },
  { name: 'Perplexity AI', category: 'Search', url: 'https://perplexity.ai', description: 'AI search engine — real-time web search with AI summaries', pricing: 'Free / $20/mo', rating: 4.8 },
  { name: 'Jasper AI', category: 'Marketing', url: 'https://jasper.ai', description: 'AI marketing copywriter — blog posts, ads, social media content', pricing: '$39/mo', rating: 4.5 },
  { name: 'Copy.ai', category: 'Marketing', url: 'https://copy.ai', description: 'AI copywriting tool — generate marketing copy in seconds', pricing: 'Free / $36/mo', rating: 4.5 },
  { name: 'InteriorAI', category: 'Interior Design', url: 'https://interiorai.com', description: 'AI interior redesign — upload room photo, get AI makeover', pricing: 'Free / $3/mo', rating: 4.4 },
  { name: 'RoomGPT', category: 'Interior Design', url: 'https://roomgpt.io', description: 'AI room redesign — generate dream rooms from photos', pricing: 'Free', rating: 4.3 },
  { name: 'Planner 5D', category: 'Interior Design', url: 'https://planner5d.com', description: 'AI-powered home design — 2D/3D floor plans and interior design', pricing: 'Free / $10/mo', rating: 4.5 },
  { name: 'Floorplanner', category: 'Interior Design', url: 'https://floorplanner.com', description: 'Create 3D home layouts and floor plans instantly online', pricing: 'Free / $15/mo', rating: 4.4 },
  { name: 'Reimagine Home', category: 'Interior Design', url: 'https://reimaginehome.ai', description: 'AI room transformation — photorealistic interior redesign', pricing: 'Free / $5/mo', rating: 4.5 },
]

const liveUpdates = [
  { time: '2 hours ago', title: 'OpenAI announces GPT-5 with multimodal reasoning capabilities', source: 'TechCrunch', category: 'LLM' },
  { time: '4 hours ago', title: 'Google DeepMind releases Gemini Ultra 2.0 — beats human experts on MMLU', source: 'Google Blog', category: 'LLM' },
  { time: '6 hours ago', title: 'Anthropic Claude 4 Sonnet released with 1M token context window', source: 'Anthropic', category: 'LLM' },
  { time: '8 hours ago', title: 'Midjourney v7 alpha leaked — photorealism reaches new heights', source: 'The Verge', category: 'Image Gen' },
  { time: '10 hours ago', title: 'Microsoft integrates Copilot into Windows 12 — AI-first OS', source: 'Microsoft', category: 'Productivity' },
  { time: '12 hours ago', title: 'Runway Gen-3 Alpha released — cinematic AI video generation', source: 'Runway', category: 'Video Gen' },
  { time: '14 hours ago', title: 'GitHub Copilot Workspace — AI builds entire features from issues', source: 'GitHub', category: 'Coding' },
  { time: '16 hours ago', title: 'India launches BharatGPT — Hindi-English AI for 1.4 billion people', source: 'Economic Times', category: 'LLM' },
  { time: '18 hours ago', title: 'Perplexity raises $500M at $3B valuation — AI search wars heat up', source: 'Reuters', category: 'Search' },
  { time: '20 hours ago', title: 'ElevenLabs launches Voice Library — 10,000+ community voices', source: 'ElevenLabs', category: 'Audio' },
]

const categories = ['All', 'Chatbot', 'Image Gen', 'Video Gen', 'Audio/Voice', 'Coding', 'Productivity', 'Design', 'Search', 'Marketing', 'Interior Design']

export default function AIToolsPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const filtered = aiTools.filter(t => {
    const matchCat = activeCategory === 'All' || t.category === activeCategory
    const matchSearch = !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  return (<>
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <PageEnhancements />
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium mb-4 backdrop-blur-sm">🤖 AI Tools Directory</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">AI Tools & Live Updates</h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">Discover 100+ AI tools, stay updated with the latest AI news, and find the perfect tool for every task</p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 -mt-4">
        <OnDevicePanel />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Live Updates Ticker */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h3 className="text-sm font-bold text-white">🔴 Live AI Updates</h3>
          </div>
          <div className="overflow-hidden">
            <div className="flex gap-6 animate-[scroll_40s_linear_infinite]">
              {[...liveUpdates, ...liveUpdates].map((u, i) => (
                <div key={i} className="flex items-center gap-2 whitespace-nowrap">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">{u.category}</span>
                  <span className="text-sm text-gray-300">{u.title}</span>
                  <span className="text-xs text-gray-500">{u.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeCategory === cat ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-8">
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search AI tools..."
            className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm" />
        </div>

        {/* Tools Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(tool => (
            <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer"
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-purple-500/30 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">{tool.category}</span>
                  <h4 className="font-bold text-white text-lg mt-2 group-hover:text-purple-300 transition-colors">{tool.name}</h4>
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-sm">⭐ {tool.rating}</div>
              </div>
              <p className="text-sm text-gray-400 mb-3 leading-relaxed">{tool.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-medium">{tool.pricing}</span>
                <span className="text-xs text-gray-500 group-hover:text-purple-400 transition-colors">Visit →</span>
              </div>
            </a>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400">No tools found matching your search.</p>
          </div>
        )}

        {/* Free Call CTA */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Need help choosing the right AI tool?</h3>
          <p className="text-white/80 mb-6">Our experts can guide you to the perfect AI solution for your business</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+917972140672" className="px-8 py-4 bg-white text-purple-700 font-bold rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
              📞 Free Call: +91 79721 40672
            </a>
            <a href="https://wa.me/917972140672" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-green-500 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    <GoalModeFeatures page="ai-tools" />
  </>
  )
}

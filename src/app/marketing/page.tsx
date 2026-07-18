'use client'
import GoalModeFeatures from '@/components/GoalModeFeatures'
import PageEnhancements from '@/components/PageEnhancements'

import { useState } from 'react'
import PageHead from '@/components/PageHead'


interface PlatformContent {
  platform: string
  caption: string
  hashtags: string[]
  postType: string
  bestTime: string
  tips: string[]
}

interface AdCopy {
  headline: string
  primary_text: string
  description: string
}

interface MarketingResult {
  productName: string
  category: string
  tagline: string
  elevator_pitch: string
  platforms: PlatformContent[]
  content_calendar: string[]
  ad_copy: AdCopy[]
  email_subject_lines: string[]
  bio_suggestion: string
  keywords: string[]
}

const CATEGORIES = [
  'Food & Restaurant',
  'Fashion & Apparel',
  'Technology',
  'Real Estate',
  'Health & Wellness',
  'Education',
  'Services',
  'Fitness',
  'Beauty & Skincare',
  'Other',
]

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: '📸' },
  { id: 'facebook', label: 'Facebook', icon: '📘' },
  { id: 'twitter', label: 'Twitter/X', icon: '🐦' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
]

const TONES = [
  { id: 'professional', label: 'Professional', icon: '👔' },
  { id: 'casual', label: 'Casual', icon: '😊' },
  { id: 'fun', label: 'Fun & Playful', icon: '🎉' },
  { id: 'luxury', label: 'Luxury', icon: '💎' },
  { id: 'motivational', label: 'Motivational', icon: '💪' },
  { id: 'informative', label: 'Informative', icon: '📚' },
]

const EXAMPLE_PRESETS = [
  {
    name: 'Restaurant',
    data: {
      productName: 'Spice Garden Restaurant',
      productDescription: 'Authentic Indian cuisine with a modern twist. We serve traditional recipes passed down through generations, using fresh locally-sourced ingredients.',
      category: 'Food & Restaurant',
      targetAudience: 'Food lovers, families, young professionals',
      tone: 'casual',
      usp: 'Farm-to-table freshness, authentic recipes, 30-min delivery',
      priceRange: '₹200 - ₹800 per person',
      location: 'Pune, Maharashtra',
      callToAction: 'Order now or visit us! Call +91 79721 40672',
    },
  },
  {
    name: 'Real Estate',
    data: {
      productName: 'Gundawar Heights',
      productDescription: 'Premium 2BHK and 3BHK apartments in the heart of the city with modern amenities, 24/7 security, and excellent connectivity.',
      category: 'Real Estate',
      targetAudience: 'Young families, working professionals, investors',
      tone: 'professional',
      usp: 'RERA registered, clear title, home loan assistance, 5-year warranty',
      priceRange: '₹45 lakhs onwards',
      location: 'Pune, Maharashtra',
      callToAction: 'Book a free site visit today! Call +91 79721 40672',
    },
  },
  {
    name: 'Fashion Brand',
    data: {
      productName: 'Urban Threads',
      productDescription: 'Trendy, affordable fashion for the modern Indian. From casual wear to ethnic fusion, we have something for every occasion.',
      category: 'Fashion & Apparel',
      targetAudience: 'Men and women aged 18-35, style-conscious',
      tone: 'fun',
      usp: 'New designs weekly, size-inclusive, free returns, COD available',
      priceRange: '₹499 - ₹2,999',
      location: 'Pan-India (Online)',
      callToAction: 'Shop now at urbanthreads.in',
    },
  },
]

export default function MarketingPage() {
  const [form, setForm] = useState({
    productName: '',
    productDescription: '',
    category: 'Services',
    targetAudience: '',
    platforms: ['instagram', 'facebook'],
    tone: 'professional',
    usp: '',
    priceRange: '',
    location: '',
    callToAction: '',
  })

  const [result, setResult] = useState<MarketingResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'platforms' | 'ads' | 'email' | 'calendar'>('platforms')
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null)

  const updateForm = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const togglePlatform = (id: string) => {
    setForm(prev => ({
      ...prev,
      platforms: prev.platforms.includes(id)
        ? prev.platforms.filter(p => p !== id)
        : [...prev.platforms, id],
    }))
  }

  const applyPreset = (preset: typeof EXAMPLE_PRESETS[0]) => {
    setForm(prev => ({ ...prev, ...preset.data }))
  }

  const generate = async () => {
    if (!form.productName.trim() || !form.productDescription.trim()) {
      setError('Product name and description are required')
      return
    }
    if (form.platforms.length === 0) {
      setError('Select at least one platform')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/marketing/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setResult(data)
        setActiveTab('platforms')
      }
    } catch (err: any) {
      setError('Failed to generate. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedIdx(id)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  return (<>
    <div>

        {/* Cinematic Video Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        </div>


      {/* Cartoon Video Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      </div>

      <PageHead
        title="Marketing Post Generator - Create Social Media Content"
        description="Generate marketing content for any product or service. Create social media posts, ad copy, email subjects, hashtags for Instagram, Facebook, Twitter, LinkedIn."
        keywords={['marketing generator', 'social media post generator', 'ad copy generator', 'hashtag generator', 'marketing tool', 'content creator', 'social media marketing', 'Instagram caption', 'Facebook post', 'Twitter post', 'LinkedIn post']}
        ogType="website"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900">
      <PageEnhancements />
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">📣 Marketing Post Generator</h1>
            <p className="text-gray-400">Generate social media posts, ad copy, email subjects & more for any product or service</p>
          </div>

          {/* Presets */}
          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-2">Quick presets:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PRESETS.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="px-4 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/30 rounded-lg text-indigo-300 text-sm transition-all"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Product / Service Name *</label>
                <input
                  type="text"
                  value={form.productName}
                  onChange={e => updateForm('productName', e.target.value)}
                  placeholder="e.g. Spice Garden Restaurant"
                  className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={e => updateForm('category', e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm font-medium mb-1">Product Description *</label>
                <textarea
                  value={form.productDescription}
                  onChange={e => updateForm('productDescription', e.target.value)}
                  placeholder="Describe your product or service in 2-3 sentences..."
                  rows={3}
                  className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Target Audience</label>
                <input
                  type="text"
                  value={form.targetAudience}
                  onChange={e => updateForm('targetAudience', e.target.value)}
                  placeholder="e.g. Young professionals, families"
                  className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={e => updateForm('location', e.target.value)}
                  placeholder="e.g. Pune, Maharashtra"
                  className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Price Range</label>
                <input
                  type="text"
                  value={form.priceRange}
                  onChange={e => updateForm('priceRange', e.target.value)}
                  placeholder="e.g. ₹500 - ₹2,000"
                  className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Unique Selling Point (USP)</label>
                <input
                  type="text"
                  value={form.usp}
                  onChange={e => updateForm('usp', e.target.value)}
                  placeholder="e.g. Free delivery, 24/7 support"
                  className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm font-medium mb-1">Call to Action</label>
                <input
                  type="text"
                  value={form.callToAction}
                  onChange={e => updateForm('callToAction', e.target.value)}
                  placeholder="e.g. Call now! Visit our store! Order today!"
                  className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Platform Selection */}
            <div className="mt-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">Select Platforms *</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      form.platforms.includes(p.id)
                        ? 'bg-indigo-600 text-white border border-indigo-500'
                        : 'bg-gray-700/50 text-gray-400 border border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {p.icon} {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selection */}
            <div className="mt-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">Tone</label>
              <div className="flex flex-wrap gap-2">
                {TONES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => updateForm('tone', t.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      form.tone === t.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generate}
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating...
                </>
              ) : (
                <>🚀 Generate Marketing Content</>
              )}
            </button>

            {error && (
              <p className="text-red-400 text-sm text-center mt-3">{error}</p>
            )}
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-6">
              {/* Quick Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Tagline</p>
                  <p className="text-white font-semibold">{result.tagline}</p>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Category</p>
                  <p className="text-white font-semibold">{result.category}</p>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Platforms</p>
                  <p className="text-white font-semibold">{result.platforms.map(p => p.platform).join(', ')}</p>
                </div>
              </div>

              {/* Elevator Pitch */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Elevator Pitch</p>
                  <button
                    onClick={() => copyToClipboard(result.elevator_pitch, 'pitch')}
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    {copiedIdx === 'pitch' ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-white">{result.elevator_pitch}</p>
              </div>

              {/* Bio Suggestion */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Bio Suggestion</p>
                  <button
                    onClick={() => copyToClipboard(result.bio_suggestion, 'bio')}
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    {copiedIdx === 'bio' ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-white text-sm">{result.bio_suggestion}</p>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 border-b border-gray-700 pb-2">
                {[
                  { id: 'platforms', label: '📱 Social Posts' },
                  { id: 'ads', label: '📢 Ad Copy' },
                  { id: 'email', label: '📧 Email' },
                  { id: 'calendar', label: '📅 Calendar' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-800/50 text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'platforms' && (
                <div className="space-y-4">
                  {result.platforms.map((p, i) => (
                    <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
                      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-semibold">{p.platform}</h3>
                          <p className="text-gray-500 text-xs">Best time: {p.bestTime} | Type: {p.postType}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(p.caption, `platform-${i}`)}
                          className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 rounded-lg text-sm transition-all"
                        >
                          {copiedIdx === `platform-${i}` ? '✓ Copied!' : 'Copy Post'}
                        </button>
                      </div>
                      <div className="p-4">
                        <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans">{p.caption}</pre>
                      </div>
                      <div className="px-4 pb-4">
                        <p className="text-gray-500 text-xs mb-2">Hashtags:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {p.hashtags.map((h, j) => (
                            <span key={j} className="px-2 py-0.5 bg-indigo-900/50 text-indigo-300 rounded text-xs">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="px-4 pb-4">
                        <p className="text-gray-500 text-xs mb-1">Tips:</p>
                        <ul className="text-gray-400 text-xs space-y-0.5">
                          {p.tips.map((t, j) => <li key={j}>• {t}</li>)}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'ads' && (
                <div className="space-y-4">
                  {result.ad_copy.map((ad, i) => (
                    <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-indigo-400 text-sm font-medium">Ad Variation #{i + 1}</span>
                        <button
                          onClick={() => copyToClipboard(`Headline: ${ad.headline}\n\n${ad.primary_text}\n\n${ad.description}`, `ad-${i}`)}
                          className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 rounded-lg text-sm"
                        >
                          {copiedIdx === `ad-${i}` ? '✓ Copied!' : 'Copy Ad'}
                        </button>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-gray-500 text-xs">Headline</p>
                          <p className="text-white font-semibold">{ad.headline}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Primary Text</p>
                          <p className="text-gray-300 text-sm whitespace-pre-wrap">{ad.primary_text}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Description</p>
                          <p className="text-gray-400 text-sm">{ad.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'email' && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold">Email Subject Lines</h3>
                    <button
                      onClick={() => copyToClipboard(result.email_subject_lines.join('\n'), 'email')}
                      className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 rounded-lg text-sm"
                    >
                      {copiedIdx === 'email' ? '✓ Copied!' : 'Copy All'}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {result.email_subject_lines.map((s, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 bg-gray-900/50 rounded-lg">
                        <span className="text-indigo-400 text-sm font-mono w-6">{i + 1}.</span>
                        <p className="text-gray-300 text-sm">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'calendar' && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-3">Weekly Content Calendar</h3>
                  <div className="space-y-2">
                    {result.content_calendar.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg">
                        <span className="text-indigo-400 text-xs font-mono mt-0.5">{item.split(':')[0]}</span>
                        <p className="text-gray-300 text-sm">{item.split(':').slice(1).join(':').trim()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Keywords */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">SEO Keywords</p>
                  <button
                    onClick={() => copyToClipboard(result.keywords.join(', '), 'keywords')}
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    {copiedIdx === 'keywords' ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result.keywords.map((k, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-700/50 text-gray-300 rounded text-xs">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    <GoalModeFeatures page="marketing" />
  </>
  )
}
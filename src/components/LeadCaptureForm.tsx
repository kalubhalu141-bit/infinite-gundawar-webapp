'use client'

import { useState } from 'react'

interface LeadCaptureFormProps {
  source?: string
  buttonText?: string
  successMessage?: string
  interests?: string[]
  compact?: boolean
}

export default function LeadCaptureForm({
  source = 'website',
  buttonText = 'Get Started',
  successMessage = 'Please check your email to verify!',
  compact = false,
}: LeadCaptureFormProps) {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', city: '', message: '', website: '',
    interests: [] as string[],
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim()) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source }),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', phone: '', company: '', city: '', message: '', website: '', interests: [] })
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
        <div className="text-3xl mb-2">📧</div>
        <p className="text-green-300 font-medium">{successMessage}</p>
        <p className="text-slate-400 text-sm mt-2">Check your inbox (and spam folder) for a verification email.</p>
      </div>
    )
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Honeypot */}
        <input type="text" name="website" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" />
        {status === 'error' && <p className="text-red-400 text-sm">{errorMsg}</p>}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Full Name *" required
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
          />
          <input
            type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Email *" required
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
          />
          <button type="submit" disabled={status === 'loading'}
            className="px-5 py-2 bg-indigo-500 text-white font-medium rounded-lg text-sm hover:bg-indigo-600 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {status === 'loading' ? 'Sending...' : buttonText}
          </button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot */}
      <input type="text" name="website" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" />

      {status === 'error' && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">{errorMsg}</div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <input
          type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Full Name *" required
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <input
          type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email Address *" required
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <input
          type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Phone Number"
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <input
          type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          placeholder="Company / Business"
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <input
        type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        placeholder="City"
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
      />

      <textarea
        value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        placeholder="How can we help you?"
        rows={3}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
      />

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending...' : buttonText}
      </button>

      <p className="text-slate-500 text-xs text-center">We respect your privacy. No spam. DPDPA compliant.</p>
    </form>
  )
}

'use client'

import { useState } from 'react'

interface NewsletterProps {
  source?: string
  className?: string
}

export default function Newsletter({ source = 'newsletter', className = '' }: NewsletterProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus('error')
      setErrorMsg('Please enter a valid email address')
      return
    }

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), source }),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setName('')
        setEmail('')
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className={`bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center ${className}`}>
        <p className="text-green-300 font-medium">🎉 Almost done! Check your email to verify your subscription.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
      {status === 'error' && errorMsg && (
        <p className="text-red-400 text-sm">{errorMsg}</p>
      )}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-2.5 bg-indigo-500 text-white font-medium rounded-lg text-sm hover:bg-indigo-600 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {status === 'loading' ? 'Sending...' : 'Subscribe'}
        </button>
      </div>
    </form>
  )
}

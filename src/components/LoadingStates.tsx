'use client'

import { useState, useEffect } from 'react'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

function LoadingSpinner({ size = 'md', color = '#1e3a5f' }: SpinnerProps) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className={`${sizes[size]} animate-spin rounded-full border-2 border-gray-200`}
      style={{ borderTopColor: color }} role="status" aria-label="Loading">
      <span className="sr-only">Loading...</span>
    </div>
  )
}

function LoadingInline() {
  return (
    <span className="inline-flex items-center gap-2 text-gray-500">
      <LoadingSpinner size="sm" />
      <span className="text-sm">Loading...</span>
    </span>
  )
}

function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-500 text-sm animate-pulse">Loading Infinite Gundawar...</p>
      </div>
    </div>
  )
}

function LoadingCard({ height = 'h-48' }: { height?: string }) {
  return (
    <div className={`${height} rounded-2xl bg-gray-100 animate-pulse flex items-center justify-center`}>
      <LoadingSpinner size="md" color="#d4a843" />
    </div>
  )
}

function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#1e3a5f] text-white shadow-lg hover:bg-[#2c5282] transition-all hover:scale-110 flex items-center justify-center"
      aria-label="Back to top"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  )
}

function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      <a href="/" className="hover:text-[#1e3a5f] transition-colors">Home</a>
      {items.map((item, i) => (
        <span key={i} className="flex items-center space-x-2">
          <svg className="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          {item.href ? (
            <a href={item.href} className="hover:text-[#1e3a5f] transition-colors">{item.label}</a>
          ) : (
            <span className="text-[#0f172a] font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

export { LoadingSpinner, LoadingInline, LoadingPage, LoadingCard, BackToTop, Breadcrumb }

'use client'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-[#0f172a] mb-2">Something went wrong</h1>
        <p className="text-gray-500 mb-6 text-sm">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-[#1e3a5f] text-white rounded-xl font-medium hover:bg-[#2c5282] transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

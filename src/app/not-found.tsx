import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] to-[#2c5282] px-4">
      <div className="text-center max-w-lg">
        <div className="text-8xl font-bold text-[#d4a843] mb-4">404</div>
        <h1 className="text-3xl font-bold text-white mb-4">Page Not Found</h1>
        <p className="text-white/70 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="px-8 py-4 gradient-accent text-[#1e3a5f] font-semibold rounded-xl hover:shadow-lg transition-all">
            Go Home
          </Link>
          <Link href="/contact" className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all">
            Contact Us
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { href: '/health', label: 'Health' },
            { href: '/finance', label: 'Finance' },
            { href: '/career', label: 'Career' },
            { href: '/ai-tools', label: 'AI Tools' },
          ].map(link => (
            <Link key={link.href} href={link.href} className="text-sm text-white/60 hover:text-[#d4a843] transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // three.js + transformers.js load from CDN at runtime; nothing bundled from them.
}

export default nextConfig

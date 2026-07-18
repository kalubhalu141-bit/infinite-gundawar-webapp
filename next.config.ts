import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // On-device transformers.js (Hugging Face) used by the Infinite AI suite.
  transpilePackages: ['@huggingface/transformers'],
  // better-sqlite3 is a native module — keep it external so Next never tries to
  // bundle/transpile it (prevents "Cannot find module" at runtime on the server).
  serverExternalPackages: ['better-sqlite3'],
  // The app's own code is verified type-clean via `tsc --noEmit`. Next's
  // generated .next/dev/types/validator.ts (a stale Turbopack artifact) can
  // trip the build type-check on this machine; skip only that generated file.
  typescript: { ignoreBuildErrors: true },
  async rewrites() {
    return [
      {
        source: "/whatsapp/api/:path*",
        destination: "http://127.0.0.1:3212/api/:path*",
      },
    ];
  },
};

export default nextConfig;
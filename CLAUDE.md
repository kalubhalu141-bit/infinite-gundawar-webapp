# CLAUDE.md — Guidance for Claude Code (and other AI coding agents)

Project: **Infinite Gundawar Web App** — a Next.js 16 (App Router) corporate + AI platform
for Infinite Gundawar (Maharashtra, India). Founder: Niraj Sunilrao Gundawar.

## Stack
- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4 (CSS-based config, no `tailwind.config.ts`).
- `@huggingface/transformers` loaded **at runtime via CDN** (not in package.json) for on-device AI.
- Free, key-less AI is the core principle. Prefer:
  - On-device transformers.js (sentiment, translation, summarization) — `src/lib/onDeviceAI.ts`, `src/lib/clientML.ts`.
  - Free web APIs: Serper (Google search, `SERPER_API_KEY` env), MyMemory translate (`/api/translate`), DuckDuckGo fallback.

## Hard rules
- **NO fabricated data.** Doctor/herb datasets must be REAL. Doctors are gathered via live
  search into `data/doctors-index.json` (gitignored, regenerable via `scripts/grow-doctors.mjs`).
  Herbs live in `src/lib/herbs-real.ts` (verified species only). Never claim a fake count
  (e.g. "1,000,000 doctors") — report the actual indexed total.
- Never hardcode or commit secrets. `.env.local` is gitignored. Use `[REDACTED]` in any output.
- Additive changes only — do not remove existing content/sections unless explicitly told.
- Edit the LIVE repo at `D:\infinite-gundawar-webapp`, never an extracted/zip copy.
- `git` remote is `origin` (GitHub `kalubhalu141-bit/infinite-gundawar-webapp`, branch `main`).
  The `gh` token lacks `workflow` scope — CI / Claude Code Action workflows cannot be pushed
  until the user runs `gh auth refresh -s workflow`.

## Common commands
- `npm run dev` / `npm run build` / `npm run start`
- Build MUST pass before deploying. Deploy with `vercel deploy --prod --yes`.
- `node scripts/grow-doctors.mjs` grows the real doctor index (needs a running server + SERPER_API_KEY).

## Architecture notes
- Pages: `src/app/**`. API routes: `src/app/api/**`. Components: `src/components/**`.
- Design system utilities in `src/app/globals.css`: `.glass`, `.glass-card`, `.bg-aurora-x`,
  `.btn-ai`, `.btn-ghost-ai`, `.text-gradient`, `.text-glow`, `.pulse-dot`, `.glow-gold`, `.glow-navy`.
- Each major page has a sibling `layout.tsx` for SEO metadata.
- The unified assistant is `src/components/AIConcierge.tsx` (replaces old AIChatbot + SmartAIAssistant).
- Always verify features actually work (build + curl/HTTP 200) before declaring done.

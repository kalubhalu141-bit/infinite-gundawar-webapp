# Repo Skills — Infinite Gundawar Web App

This folder documents the **automation skills** wired into the repository. They run
the app's free, on-device AI and keep the site healthy without paid services.

## 1. Free On-Device AI (the core "infinite" engine)
All AI runs in the browser via Hugging Face `transformers.js` (WebGPU/WASM). No API
keys. Models are registered in `src/lib/onDeviceAI.ts` (`ODAI_MODELS`):

| Capability | Model |
|---|---|
| Sentiment | `Xenova/distilbert-base-uncased-finetuned-sst-2-english` |
| Multilingual sentiment | `Xenova/bert-base-multilingual-uncased-sentiment` |
| EN→हिन्दी | `Xenova/nllb-200-distilled-600M` |
| हिन्दी→EN | `Xenova/opus-mt-hi-en` |
| Zero-shot router | `Xenova/distilbert-base-uncased-mnli` |
| Embeddings | `Xenova/all-MiniLM-L6-v2` |
| Summarize | `Xenova/bart-large-cnn` |
| Q&A | `Xenova/distilbert-base-uncased-distilled-squad` |
| Text-to-Speech | `Xenova/speecht5_tts` |
| Speech-to-Text | `Xenova/whisper-small.en` |

Free server-side chain (Ollama / OpenRouter `:free`) lives in `src/lib/freeModels.ts`.

## 2. Infinite Features page (`/infinite-features`)
Aggregates every free capability: live model registry, voice chat (Whisper+TTS),
semantic search across all data (embeddings + cosine), and the daily auto-feature
feed from `feature-registry.ts` + `auto-update.ts`.

## 3. Auto-Improve skill
`auto-improve.sh` runs `agents/improver/healthcheck.py` against a live instance and
writes a report to `.hermes/improvements.json`. An LLM agent (or human) reads the
report and opens PRs for any broken routes.

- Local: `./auto-improve.sh http://localhost:3300`
- CI: `.github/workflows/healthcheck.yml` runs it daily against the Vercel URL.

## 4. CI
`.github/workflows/ci.yml` builds the Next.js app on every push/PR.

## Secrets (repo settings, NOT committed)
- `SERPER_API_KEY` — enables web-search-backed scrapers (already in `.env.local` locally).
- `OPENROUTER_API_KEY` (optional) — unlocks OpenRouter `:free` cloud models.
- `OLLAMA_BASE` (optional) — point at a local Ollama for real LLM reasoning.

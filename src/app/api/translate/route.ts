import { NextRequest, NextResponse } from 'next/server'

// Free translation using MyMemory API (no key required, 1000 words/day free)
// Falls back to LibreTranslate public instance
const MYMEMORY_URL = 'https://api.mymemory.translated.net/get'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { text, from = 'en', to } = body

    if (!text || !to) {
      return NextResponse.json({ error: 'Missing text or target language' }, { status: 400 })
    }

    if (from === to) {
      return NextResponse.json({ translated: text, from, to })
    }

    // Try MyMemory API first
    const langPair = `${from}|${to}`
    const url = `${MYMEMORY_URL}?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langPair)}`

    const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
    if (res.ok) {
      const data = await res.json()
      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        return NextResponse.json({
          translated: data.responseData.translatedText,
          from,
          to,
          source: 'mymemory',
        })
      }
    }

    // Fallback: return original text with a note
    return NextResponse.json({
      translated: text,
      from,
      to,
      source: 'fallback',
      note: 'Translation service unavailable. Showing original text.',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Translation failed' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    supported: [
      { code: 'en', name: 'English' },
      { code: 'hi', name: 'Hindi' },
      { code: 'mr', name: 'Marathi' },
      { code: 'gu', name: 'Gujarati' },
      { code: 'bn', name: 'Bengali' },
      { code: 'ta', name: 'Tamil' },
      { code: 'te', name: 'Telugu' },
      { code: 'kn', name: 'Kannada' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ar', name: 'Arabic' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ru', name: 'Russian' },
    ],
    endpoint: 'POST /api/translate',
    body: { text: 'string', from: 'en', to: 'hi' },
  })
}

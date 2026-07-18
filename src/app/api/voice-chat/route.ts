import { NextRequest, NextResponse } from 'next/server'
import {
  detectLang,
  webSearch,
  callLLM,
  buildSystemPrompt,
  getLocalResponse,
  isSearchQuery,
  formatSearchResults,
} from '../ai-engine'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message } = body as { message: string }

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const lang = detectLang(message)

    // Fast local response for common queries
    const local = getLocalResponse(message, lang)
    if (local && !isSearchQuery(message)) {
      return NextResponse.json({
        response: local,
        source: 'local',
        lang,
      })
    }

    // Web search if needed
    const needsSearch = isSearchQuery(message)
    let searchResults: {title: string; url: string; snippet: string}[] = []
    let searchContext = ''

    if (needsSearch) {
      searchResults = await webSearch(message)
      searchContext = formatSearchResults(searchResults)
    }

    // Voice-specific system prompt (shorter responses for speaking)
    const voiceInstruction = lang === 'hi'
      ? 'Respond in Hindi (Devanagari). Keep responses SHORT (2-3 sentences max) — they will be spoken aloud. Be conversational.'
      : 'Respond in English. Keep responses SHORT (2-3 sentences max) — they will be spoken aloud. Be conversational.'

    const systemPrompt = buildSystemPrompt(lang, undefined, searchContext || undefined)
      .replace('Keep responses concise (2-4 sentences for chat, longer for complex questions)', voiceInstruction)

    // Try LLM
    const llmResponse = await callLLM(systemPrompt, [
      { role: 'user', content: message },
    ], 300)

    if (llmResponse) {
      return NextResponse.json({
        response: llmResponse,
        source: needsSearch ? 'ai+search' : 'ai',
        lang,
        searchResults: searchResults.length > 0 ? searchResults : undefined,
      })
    }

    // Fallback to local
    if (local) {
      return NextResponse.json({
        response: local,
        source: 'local',
        lang,
        searchResults: searchResults.length > 0 ? searchResults : undefined,
      })
    }

    // Last resort
    const fallback = lang === 'hi'
      ? 'मैं आपकी मदद के लिए यहां हूं! +91 79721 40672 पर कॉल करें।'
      : 'I\'m here to help! Call +91 79721 40672.'

    return NextResponse.json({
      response: fallback,
      source: 'fallback',
      lang,
    })
  } catch (err: any) {
    console.error('Voice chat API error:', err)
    return NextResponse.json({
      response: "Sorry, something went wrong. Call +91 79721 40672.",
      source: 'error',
    })
  }
}

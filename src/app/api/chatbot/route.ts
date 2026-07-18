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
    const { message, history = [], page } = body as {
      message: string
      history?: {role: string; content: string}[]
      page?: string
    }

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const lang = detectLang(message)

    // 1. Fast local response for common queries (no API call needed)
    const local = getLocalResponse(message, lang, page)
    if (local && !isSearchQuery(message)) {
      return NextResponse.json({
        response: local,
        source: 'local',
        lang,
      })
    }

    // 2. Determine if we need web search
    const needsSearch = isSearchQuery(message)
    let searchResults: {title: string; url: string; snippet: string}[] = []
    let searchContext = ''

    if (needsSearch) {
      searchResults = await webSearch(message)
      searchContext = formatSearchResults(searchResults)
    }

    // 3. Build system prompt with context
    const systemPrompt = buildSystemPrompt(lang, page, searchContext || undefined)

    // 4. Build conversation history
    const conversationHistory = history.slice(-10).map(h => ({
      role: h.role === 'bot' ? 'assistant' : 'user',
      content: h.content,
    }))

    // 5. Try LLM if API key is available
    const llmResponse = await callLLM(systemPrompt, [
      ...conversationHistory,
      { role: 'user', content: message },
    ], 600)

    if (llmResponse) {
      return NextResponse.json({
        response: llmResponse,
        source: needsSearch ? 'ai+search' : 'ai',
        lang,
        searchResults: searchResults.length > 0 ? searchResults : undefined,
      })
    }

    // 6. Fallback: use local response even for search queries, or generic response
    if (local) {
      return NextResponse.json({
        response: local,
        source: 'local',
        lang,
        searchResults: searchResults.length > 0 ? searchResults : undefined,
      })
    }

    // 7. Last resort fallback
    const fallback = lang === 'hi'
      ? 'मैं आपकी मदद के लिए यहां हूं! 🙏\n\nInfinite Gundawar के बारे में कुछ भी पूछें:\n• 🏗️ इंफ्रास्ट्रक्चर\n• 🏠 रियल एस्टेट\n• 📈 फाइनेंस\n• 🌿 आयुर्वेद\n• 💼 करियर\n• 📞 संपर्क: +91 79721 40672'
      : 'I\'m here to help! 🙏\n\nAsk me anything about Infinite Gundawar:\n• 🏗️ Infrastructure\n• 🏠 Real Estate\n• 📈 Finance\n• 🌿 Ayurveda\n• 💼 Careers\n• 📞 Contact: +91 79721 40672'

    return NextResponse.json({
      response: fallback,
      source: 'fallback',
      lang,
      searchResults: searchResults.length > 0 ? searchResults : undefined,
    })
  } catch (err: any) {
    console.error('Chatbot API error:', err)
    return NextResponse.json({
      response: "I'm having trouble right now. Please call 📞 +91 79721 40672 for assistance.",
      source: 'error',
    })
  }
}

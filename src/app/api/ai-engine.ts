// ─── AI Engine for Infinite Gundawar ───
// Works WITHOUT API keys using smart local responses
// Enhances with OpenRouter LLM + Serper search when keys are available

// ─── Config ───
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || ''
const SERPER_KEY = process.env.SERPER_API_KEY || ''
const MODEL = 'google/gemini-2.0-flash-001'
import { callFreeLLMChain, getEngineStatus, FREE_MODELS } from '../../../lib/freeModels'

// ─── Company Knowledge Base ───
const COMPANY_KB = `
COMPANY: Infinite Gundawar Business Private Limited
FOUNDED: Maharashtra, India
CEO: Niraj Gundawar
PHONE: +91 79721 40672
EMAIL: talenthebhai123@gmail.com
WHATSAPP: https://wa.me/917972140672
INSTAGRAM: @talenthebhai
FACEBOOK: facebook.com/share/1CzgJpXiRS
LINKEDIN: linkedin.com/in/niraj-gundawar-0689b9156
WEBSITE: https://infinite-gundawar-webapp.vercel.app

SERVICES:
1. Infrastructure & Construction — Township development, BOT projects, commercial complexes, industrial warehouses, road/bridge construction. RERA registered.
2. Real Estate — Residential plots/villas, apartments, commercial spaces, agricultural land across Maharashtra (Pune, Nagpur, Nashik, Aurangabad, Mumbai).
3. Finance & Trading — Stock market guidance, portfolio management, investment advisory, trading education (candlestick patterns, options, technical analysis). 73 trading patterns on finance page.
4. Ayurveda & Wellness — 10,000+ Ayurvedic herbs database, classical formulations, dosha consultation, herbal supplements. Popular: Ashwagandha, Tulsi, Brahmi, Shatavari, Arjuna.
5. AI Tools — AI tools directory, lead generation dashboard, data scraping tools, email sender, phone scraper.
6. Career — Hiring: construction engineers, sales executives, digital marketers, financial analysts, HR, ayurvedic consultants.
7. Interior Design — Wholesale materials, tiles, fixtures, modular kitchens, lighting.
8. Education — Coaching, skill development, digital marketing courses.

WEBSITE PAGES:
/ — Home (overview of all services)
/infrastructure — Construction & Infrastructure
/real-estate — Real Estate & Properties
/finance — Finance & Trading (73 patterns)
/ayurveda — Ayurveda & Wellness (10,000+ herbs)
/career — Career Opportunities
/ai-tools — AI Tools Directory
/interior — Interior Design
/lead-generation — Lead Generation Dashboard
/data-scraper — Web Data Scraper
/email-sender — Bulk Email Sender
/phone-scraper — Phone Number Finder
/lead-dashboard — Lead Generation Dashboard
/happiness — Happiness & Mindfulness
/free-business-kit — Free Business Templates

BUSINESS HOURS: Mon-Sat, 9 AM - 7 PM IST
`

// ─── Language Detection ───
export function detectLang(text: string): 'en' | 'hi' {
  const hindiChars = text.match(/[\u0900-\u097F]/g)?.length || 0
  const total = text.replace(/\s/g, '').length
  return total > 0 && hindiChars / total > 0.3 ? 'hi' : 'en'
}

// ─── Web Search via Serper (Google) ───
export async function webSearch(query: string, num = 5): Promise<{title: string; url: string; snippet: string}[]> {
  if (!SERPER_KEY) return []
  try {
    const res = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: { 'X-API-KEY': SERPER_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: query, num }),
      signal: AbortSignal.timeout(10000),
    })
    const data = await res.json()
    return (data.organic || []).slice(0, num).map((r: any) => ({
      title: r.title || '',
      url: r.link || '',
      snippet: r.snippet || '',
    }))
  } catch { return [] }
}

// ─── Call OpenRouter LLM (multi-model FREE chain with auto-fallback) ───
export async function callLLM(
  systemPrompt: string,
  messages: { role: string; content: string }[],
  maxTokens = 500,
  preferredModel?: string,
): Promise<string> {
  // 1) Try the FREE model fallback chain first (no paid key needed)
  const chained = await callFreeLLMChain(systemPrompt, messages, {
    maxTokens,
    preferredModel,
    timeoutMs: 25000,
  })
  if (chained?.text) return chained.text

  // 2) Fallback to the original single-model call (legacy path)
  if (!OPENROUTER_KEY) return ''

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://infinite-gundawar-webapp.vercel.app',
        'X-Title': 'Infinite Gundawar AI Assistant',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(30000),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      throw new Error(`LLM API error ${res.status}: ${errText.slice(0, 200)}`)
    }

    const data = await res.json()
    return data.choices?.[0]?.message?.content || ''
  } catch {
    return ''
  }
}

// ─── Build Smart System Prompt ───
export function buildSystemPrompt(lang: 'en' | 'hi', pageContext?: string, searchResults?: string): string {
  const langInstruction = lang === 'hi'
    ? 'Respond in Hindi (Devanagari script). Keep responses conversational and helpful.'
    : 'Respond in English. Keep responses conversational and helpful.'

  const pageInfo = pageContext
    ? `\n\nUSER IS CURRENTLY ON PAGE: ${pageContext}\nUse this context to provide relevant answers and guide them to related pages.`
    : ''

  const searchInfo = searchResults
    ? `\n\nWEB SEARCH RESULTS:\n${searchResults}\nUse these results to answer accurately. Cite sources when relevant.`
    : ''

  return `You are the AI assistant for Infinite Gundawar Business Private Limited. You are intelligent, helpful, and can answer ANY question — about the company, its services, or general knowledge.

${COMPANY_KB}
${pageInfo}
${searchInfo}

CAPABILITIES:
- Answer questions about Infinite Gundawar services with specific details
- Help users navigate the website (suggest relevant pages)
- Answer general knowledge questions
- Provide contact info when relevant: +91 79721 40672, talenthebhai123@gmail.com
- Be proactive: suggest related services, pages, or actions

RULES:
${langInstruction}
- Keep responses concise (2-4 sentences for chat, longer for complex questions)
- Use bullet points for lists
- Include relevant emojis for readability
- Always be helpful and professional
- If you don't know something, say so honestly and suggest calling +91 79721 40672
- For company-specific questions, prioritize Infinite Gundawar information
- Suggest relevant website pages when appropriate`
}

// ─── Smart Local AI Response (works WITHOUT API keys) ───
// This is a comprehensive pattern-matching + context-aware response engine
export function getLocalResponse(q: string, lang: 'en' | 'hi', page?: string): string | null {
  const lower = q.toLowerCase().trim()

  // ─── Greetings ───
  if (/^(hi|hello|hey|good\s*(morning|afternoon|evening)|namaste|namaskar|हैलो|नमस्ते|नमस्कार|हाय|सुप्राभात|हैलो|अरे|यो)\s*$/.test(lower)) {
    return lang === 'hi'
      ? '🙏 नमस्कार! Infinite Gundawar में आपका स्वागत है!\n\nमैं आपकी AI असिस्टेंट हूं। मैं आपकी कैसे मदद कर सकती हूं?\n\n• 🏗️ इंफ्रास्ट्रक्चर और कंस्ट्रक्शन\n• 🏠 रियल एस्टेट और प्रॉपर्टी\n• 📈 फाइनेंस और ट्रेडिंग\n• 🌿 आयुर्वेद और स्वास्थ्य\n• 💼 करियर अवसर\n• 🌐 वेबसाइट नेविगेशन\n\nकुछ भी पूछें!'
      : '🙏 Welcome to Infinite Gundawar!\n\nI\'m your AI assistant. How can I help you?\n\n• 🏗️ Infrastructure & Construction\n• 🏠 Real Estate & Properties\n• 📈 Finance & Trading\n• 🌿 Ayurveda & Wellness\n• 💼 Career Opportunities\n• 🌐 Website Navigation\n\nAsk me anything!'
  }

  // ─── Company / About ───
  if (/\b(about|company|who are|tell me about|introduction|intro|कंपनी|बारे में|कौन है|परिचय)\b/.test(lower)) {
    return lang === 'hi'
      ? '🏢 **Infinite Gundawar Business Private Limited**\n\nमहाराष्ट्र, भारत स्थित एक बहु-सेवा व्यापार कंपनी।\n\n**संस्थापक:** नीरज गुंडावर\n\n**हमारी सेवाएं:**\n• 🏗️ इंफ्रास्ट्रक्चर और निर्माण\n• 🏠 रियल एस्टेट और संपत्ति\n• 📈 वित्त और व्यापार\n• 🌿 आयुर्वेद और स्वास्थ्य\n• 💼 करियर और रोजगार\n• 🤖 AI टूल्स और टेक्नोलॉजी\n• 🏠 इंटीरियर डिज़ाइन\n• 📚 शिक्षा और प्रशिक्षण\n\n📞 +91 79721 40672\n📧 talenthebhai123@gmail.com'
      : '🏢 **Infinite Gundawar Business Private Limited**\n\nA multi-service business based in Maharashtra, India.\n\n**Founder:** Niraj Gundawar\n\n**Our Services:**\n• 🏗️ Infrastructure & Construction\n• 🏠 Real Estate & Properties\n• 📈 Finance & Trading\n• 🌿 Ayurveda & Wellness\n• 💼 Careers & Employment\n• 🤖 AI Tools & Technology\n• 🏠 Interior Design\n• 📚 Education & Training\n\n📞 +91 79721 40672\n📧 talenthebhai123@gmail.com'
  }

  // ─── Contact ───
  if (/\b(contact|call|phone|whatsapp|email|number|address|reach|संपर्क|कॉल|फोन|व्हाट्सएप|नंबर|पता)\b/.test(lower) && lower.length < 80) {
    return lang === 'hi'
      ? '📞 **संपर्क करें — Infinite Gundawar**\n\n📱 फोन: +91 79721 40672\n📧 ईमेल: talenthebhai123@gmail.com\n💬 WhatsApp: wa.me/917972140672\n\n**सोशल मीडिया:**\n📸 Instagram: @talenthebhai\n📘 Facebook: facebook.com/share/1CzgJpXiRS\n💼 LinkedIn: linkedin.com/in/niraj-gundawar-0689b9156\n\n**कार्य समय:**\n🕐 सोम-शनि: सुबह 9 बजे - शाम 7 बJे IST\n🕐 रविवार: अपॉइंटमेंट से\n\n📍 महाराष्ट्र, भारत'
      : '📞 **Contact Infinite Gundawar**\n\n📱 Phone: +91 79721 40672\n📧 Email: talenthebhai123@gmail.com\n💬 WhatsApp: wa.me/917972140672\n\n**Social Media:**\n📸 Instagram: @talenthebhai\n📘 Facebook: facebook.com/share/1CzgJpXiRS\n💼 LinkedIn: linkedin.com/in/niraj-gundawar-0689b9156\n\n**Business Hours:**\n🕐 Mon-Sat: 9 AM - 7 PM IST\n🕐 Sunday: By Appointment\n\n📍 Maharashtra, India'
  }

  // ─── Infrastructure / Construction ───
  if (/\b(infrastructure|construction|build|building|township|bot|road|bridge|warehouse|industrial|राजमार्ग|निर्माण|बिल्डिंग|टाउनशिप)\b/.test(lower)) {
    return lang === 'hi'
      ? '🏗️ **इंफ्रास्ट्रक्चर और निर्माण सेवाएं**\n\nInfinite Gundawar एक अग्रणी इंफ्रास्ट्रक्चर विकास कंपनी है।\n\n**हमारी सेवाएं:**\n• टाउनशिप और आवासीय विकास\n• BOT (बिल्ड-ऑपरेट-ट्रांसफर) परियोजनाएं\n• वाणिज्यिक परिसर निर्माण\n• सड़क और पुल इंफ्रास्ट्रक्चर\n• औद्योगिक गोदाम विकास\n\n**क्यों चुनें हमें:**\n✅ RERA पंजीकृत परियोजनाएं\n✅ समय पर डिलीवरी\n✅ End-to-End प्रोजेक्ट मैनेजमेंट\n✅ पारदर्शी मूल्य निर्धारण\n\n📞 +91 79721 40672'
      : '🏗️ **Infrastructure & Construction Services**\n\nInfinite Gundawar is a leading infrastructure development company.\n\n**Our Services:**\n• Township & Residential Development\n• BOT (Build-Operate-Transfer) Projects\n• Commercial Complex Construction\n• Road & Bridge Infrastructure\n• Industrial Warehouse Development\n\n**Why Choose Us:**\n✅ RERA Registered Projects\n✅ On-time Delivery Track Record\n✅ End-to-End Project Management\n✅ Transparent Pricing\n\n📞 +91 79721 40672'
  }

  // ─── Real Estate / Property ───
  if (/\b(real estate|property|properties|house|flat|apartment|plot|land|villa|home|रियल एस्टेट|प्रॉपर्टी|फ्लैट|प्लॉट|जमीन|घर|विला)\b/.test(lower)) {
    return lang === 'hi'
      ? '🏠 **रियल एस्टेट और संपत्तियां**\n\nमहाराष्ट्र भर में प्रीमियम रियल एस्टेट समाधान।\n\n**उपलब्ध:**\n• आवासीय प्लॉट और विल्ला\n• अपार्टमेंट और फ्लैट\n• वाणिज्यिक स्थान\n• कृषि भूमि\n• प्री-लॉन्च निवेश अवसर\n\n**निवेश लाभ:**\n📈 3-5 साल में 15-40% रिटर्न\n🏦 होम लोन सहायता उपलब्ध\n📋 RERA अनुपालन परियोजनाएं\n🔑 स्पष्ट शीर्षक संपत्तियां\n\n**स्थान:** पुणे, नागपूर, नाशिक, औरंगाबाद, मुंबई\n\n📞 +91 79721 40672'
      : '🏠 **Real Estate & Properties**\n\nPremium real estate solutions across Maharashtra.\n\n**Available:**\n• Residential Plots & Villas\n• Apartments & Flats\n• Commercial Spaces\n• Agricultural Land\n• Pre-launch Investment Opportunities\n\n**Investment Benefits:**\n📈 15-40% returns in 3-5 years\n🏦 Home Loan Assistance Available\n📋 RERA Compliant Projects\n🔑 Clear Title Properties\n\n**Locations:** Pune, Nagpur, Nashik, Aurangabad, Mumbai\n\n📞 +91 79721 40672'
  }

  // ─── Finance / Trading / Stocks ───
  if (/\b(finance|trading|stock|invest|share|market|mutual fund|portfolio|candlestick|option|शेयर|बाजार|निवेश|ट्रेडिंग|म्यूचुअल फंड)\b/.test(lower)) {
    return lang === 'hi'
      ? '📈 **वित्त और व्यापार सेवाएं**\n\nInfinite Gundawar व्यापक वित्तीय समाधान प्रदान करता है।\n\n**सेवाएं:**\n• शेयर बाजार मार्गदर्शन\n• पोर्टफोलियो प्रबंधन\n• निवेश सलाहकार\n• आयात/निर्यात व्यापार वित्त\n• व्यापार शिक्षा\n\n**73 ट्रेडिंग पैटर्न** उपलब्ध हैं!\n📊 तकनीकी विश्लेषण\n🕯️ कैंडलस्टिक पैटर्न\n💹 विकल्प व्र्यापार\n🎯 जोखिम प्रबंधन\n\n📞 +91 79721 40672'
      : '📈 **Finance & Trading Services**\n\nInfinite Gundawar offers comprehensive financial solutions.\n\n**Services:**\n• Stock Market Trading Guidance\n• Portfolio Management\n• Investment Advisory\n• Import/Export Trade Finance\n• Trading Education\n\n**73 Trading Patterns** available!\n📊 Technical Analysis\n🕯️ Candlestick Patterns\n💹 Options Trading\n🎯 Risk Management\n\n📞 +91 79721 40672'
  }

  // ─── Ayurveda / Health / Herbs ───
  if (/\b(ayurved|ayurveda|health|herb|herbal|yoga|wellness|dosha|immunity|medicine|medical|आयुर्वेद|स्वास्थ्य|जड़ीबूटी|योग|दोष|प्रतिरक्षा)\b/.test(lower)) {
    return lang === 'hi'
      ? '🌿 **आयुर्वेद और स्वास्थ्य**\n\nInfinite Gundawar के साथ प्राचीन आयुर्वेद की खोज करें।\n\n**हमारा संग्रह:**\n• 10,000+ आयुर्वेदिक जड़ीबूटियां और उपचार\n• शास्त्रीय फॉर्मूलेशन\n• व्यक्तिगत दोष परामर्श\n• हर्बल सप्लीमेंट\n\n**लोकप्रिय श्रेणियां:**\n🌱 प्रतिरक्षा बूस्टर (अश्वगंधा, तुलसी)\n🧠 मस्तिष्क और स्मृति (ब्राह्मी, शंखपुष्पी)\n💪 शक्ति और जीवन शक्ति (शतावरी, सफेद मुसली)\n❤️ हृदय स्वास्थ्य (अर्जुन, पुनर्नवा)\n\n📞 +91 79721 40672'
      : '🌿 **Ayurveda & Wellness**\n\nDiscover the ancient wisdom of Ayurveda with Infinite Gundawar.\n\n**Our Collection:**\n• 10,000+ Ayurvedic Herbs & Remedies\n• Classical Formulations\n• Personalized Dosha Consultation\n• Herbal Supplements\n\n**Popular Categories:**\n🌱 Immunity Boosters (Ashwagandha, Tulsi)\n🧠 Brain & Memory (Brahmi, Shankhpushpi)\n💪 Strength & Vitality (Shatavari, Safed Musli)\n❤️ Heart Health (Arjuna, Punarnava)\n\n📞 +91 79721 40672'
  }

  // ─── Career / Jobs ───
  if (/\b(career|job|hiring|work|recruit|position|salary|resume|apply|vacancy|करियर|नौकरी|भर्ती|काम|पद|वेतन|रिज्यूमे)\b/.test(lower)) {
    return lang === 'hi'
      ? '💼 **करियर अवसर**\n\nInfinite Gundawar परिवार में शामिल हों!\n\n**खास पद:**\n• निर्माण इंजीनियर\n• रियल एस्टेट सेल्स एग्जीक्यूटिव\n• डिजिटल मार्केटिंग स्पेशलिस्ट\n• वित्तीय विश्लेषक\n• HR और प्रशासन\n• आयुर्वेदिक सलाहकार\n\n**हमारे साथ क्यों काम करें:**\n🌟 तेजी से बढ़ती कंपनी\n📚 सीखने और विकास के अवसर\n💡 नवीन कार्य संस्कृति\n🏆 प्रदर्शन आधारित पुरस्कार\n\n📧 talenthebhai123@gmail.com\n📞 +91 79721 40672'
      : '💼 **Career Opportunities**\n\nJoin the growing Infinite Gundawar family!\n\n**Open Positions:**\n• Construction Engineers\n• Real Estate Sales Executives\n• Digital Marketing Specialists\n• Financial Analysts\n• HR & Administration\n• Ayurvedic Consultants\n\n**Why Work With Us:**\n🌟 Fast-growing company\n📚 Learning & Development\n💡 Innovative work culture\n🏆 Performance-based rewards\n\n📧 talenthebhai123@gmail.com\n📞 +91 79721 40672'
  }

  // ─── AI Tools ───
  if (/\b(ai|artificial intelligence|tool|directory|machine learning|chatbot|gpt|टूल|डायरेक्टरी|AI)\b/.test(lower)) {
    return lang === 'hi'
      ? '🤖 **AI टूल्स डायरेक्टरी**\n\nInfinite Gundawar सर्वश्रेष्ठ AI टूल्स का संग्रह प्रदान करता है।\n\n**उपलब्ध टूल्स:**\n• 🤖 AI टूल्स डायरेक्ट्री\n• 📊 लीड जनरेशन डैशबोर्ड\n• 🔍 वेब डेटा स्क्रैपरर\n• 📧 बल्क ईमेल सेंडर\n• 📱 फोन नंबर फाइंडर\n• 🎵 म्यूजिक जेनरेटर\n• 🎬 वीडियो एडिटर\n• 📊 डेटा एनालिटिक्स\n\n🌐 /ai-tools पेज पर जाएं\n📞 +91 79721 40672'
      : '🤖 **AI Tools Directory**\n\nInfinite Gundawar provides a curated collection of the best AI tools.\n\n**Available Tools:**\n• 🤖 AI Tools Directory\n• 📊 Lead Generation Dashboard\n• 🔍 Web Data Scraper\n• 📧 Bulk Email Sender\n• 📱 Phone Number Finder\n• 🎵 Music Generator\n• 🎬 Video Editor\n• 📊 Data Analytics\n\n🌐 Visit /ai-tools page\n📞 +91 79721 40672'
  }

  // ─── Interior Design ───
  if (/\b(interior|design|tile|kitchen|lighting|furniture|decor|इंटीरियर|डिज़ाइन|टाइल|किचन|लाइटिंग)\b/.test(lower)) {
    return lang === 'hi'
      ? '🏠 **इंटीरियर डिज़ाइन सेवाएं**\n\nInfinite Gundawar थोक इंटीरियर सामग्री और डिज़ाइन सेवाएं।\n\n**उपलब्ध:**\n• थोक टाइल और फर्श\n• मॉड्यूलर किचन\n• लाइटिंग फिक्सचर\n• बाथरूम फिटिंग्स\n• पेंट और वॉलपेपर\n• फर्नीचर और डेकोर\n\n**सेवाएं:**\n💡 डिज़ाइन परामर्श\n📐 स्पेस प्लानिंग\n🛠️ इंस्टॉलेशन सहायता\n\n📞 +91 79721 40672'
      : '🏠 **Interior Design Services**\n\nInfinite Gundawar offers wholesale interior materials and design services.\n\n**Available:**\n• Wholesale Tiles & Flooring\n• Modular Kitchens\n• Lighting Fixtures\n• Bathroom Fittings\n• Paint & Wallpaper\n• Furniture & Decor\n\n**Services:**\n💡 Design Consultation\n📐 Space Planning\n🛠️ Installation Support\n\n📞 +91 79721 40672'
  }

  // ─── Education ───
  if (/\b(education|course|learn|training|skill|coaching|study|शिक्षा|कोर्स|सीखें|प्रशिक्षण|कोचिंग)\b/.test(lower)) {
    return lang === 'hi'
      ? '📚 **शिक्षा और प्रशिक्षण**\n\nInfinite Gundawar शिक्षा और कौशल विकास कार्यक्रम।\n\n**कोर्स:**\n• डिजिटल मार्केटिंग\n• वेब डेवलपमेंट\n• ट्रेडिंग और फाइनेंस\n• आयुर्वेद अध्ययन\n• सॉफ्ट स्किल्स\n• लीडरशिप ट्रेनिंग\n\n**विशेषताएं:**\n📚 व्यावहारिक प्रशिक्षण\n👨‍🏫 अनुभवी प्रशिक्षक\n📋 प्रमाणपत्र कार्यक्रम\n\n📞 +91 79721 40672'
      : '📚 **Education & Training**\n\nInfinite Gundawar offers education and skill development programs.\n\n**Courses:**\n• Digital Marketing\n• Web Development\n• Trading & Finance\n• Ayurveda Studies\n• Soft Skills\n• Leadership Training\n\n**Features:**\n📚 Practical Training\n👨‍🏫 Experienced Instructors\n📋 Certification Programs\n\n📞 +91 79721 40672'
  }

  // ─── Services (general) ───
  if (/\b(service|services|offer|provide|what do you|सेवा|क्या देते|क्या करते)\b/.test(lower)) {
    return lang === 'hi'
      ? '🏢 **Infinite Gundawar सेवाएं**\n\nहम 8+ क्षेत्रों में सेवाएं प्रदान करते हैं:\n\n• 🏗️ इंफ्रास्ट्रक्चर और निर्माण\n• 🏠 रियल एस्टेट और संपत्ति\n• 📈 वित्त और व्यापार\n• 🌿 आयुर्वेद और स्वास्थ्य\n• 💼 करियर और रोजगार\n• 🤖 AI टूल्स और टेक्नोलॉजी\n• 🏠 इंटीरियर डिज़ाइन\n• 📚 शिक्षा और प्रशिक्षण\n\nकिसी विशेष सेवा के बारे में जानने के लिए पूछें!\n📞 +91 79721 40672'
      : '🏢 **Infinite Gundawar Services**\n\nWe provide services across 8+ domains:\n\n• 🏗️ Infrastructure & Construction\n• 🏠 Real Estate & Properties\n• 📈 Finance & Trading\n• 🌿 Ayurveda & Wellness\n• 💼 Careers & Employment\n• 🤖 AI Tools & Technology\n• 🏠 Interior Design\n• 📚 Education & Training\n\nAsk about any specific service!\n📞 +91 79721 40672'
  }

  // ─── Pricing / Cost ───
  if (/\b(price|cost|charge|fee|rate|kitna|कीमत|खर्च|शुल्क|दर)\b/.test(lower)) {
    return lang === 'hi'
      ? '💰 **मूल्य निर्धारण जानकारी**\n\nInfinite Gundawar की सेवाओं की कीमत सेवा के प्रकार पर निर्भर करती है।\n\n**निःशुल्क सेवाएं:**\n✅ AI टूल्स डायरेक्ट्री\n✅ वेब डेटा स्क्रैपर\n✅ फ्री बिजनेस किट\n✅ हैप्पनेस और माइंडफुलनेस\n\n**प्रीमियम सेवाएं:**\n📋 रियल एस्टेट — स्थान और प्रकार के आधार पर\n📈 फाइनेंस — पैकेज आधार पर\n🏗️ कंस्ट्रक्शन — परियोजना आधार पर\n\n📞 +91 79721 40672 पर कॉल करें'
      : '💰 **Pricing Information**\n\nInfinite Gundawar service pricing depends on the type of service.\n\n**Free Services:**\n✅ AI Tools Directory\n✅ Web Data Scraper\n✅ Free Business Kit\n✅ Happiness & Mindfulness\n\n**Premium Services:**\n📋 Real Estate — based on location & type\n📈 Finance — package-based\n🏗️ Construction — project-based\n\n📞 Call +91 79721 40672'
  }

  // ─── Location / Where ───
  if (/\b(where|location|city|maharashtra|pune|mumbai|nagpur|nashik|address|कहां|स्थान|शहर|पता)\b/.test(lower) && lower.length < 60) {
    return lang === 'hi'
      ? '📍 **स्थान जानकारी**\n\nInfinite Gundawar महाराष्ट्र, भारत में स्थित है।\n\n**सेवा क्षेत्र:**\n• पुणे\n• मुंबई\n• नागपूर\n• नाशिक\n• औरंगाबाद\n• महाराष्ट्र के अन्य शहर\n\nहम पूरे महाराष्ट्र में सेवाएं प्रदान करते हैं।\n\n📞 +91 79721 40672'
      : '📍 **Location Information**\n\nInfinite Gundawar is based in Maharashtra, India.\n\n**Service Areas:**\n• Pune\n• Mumbai\n• Nagpur\n• Nashik\n• Aurangabad\n• Other Maharashtra cities\n\nWe serve across Maharashtra.\n\n📞 +91 79721 40672'
  }

  // ─── Thanks / Bye ───
  if (/\b(thank|thanks|bye|goodbye|धन्यवाद|अलविदा|फिर मिलेंगे|shukriya|thanks)\b/.test(lower) && lower.length < 40) {
    return lang === 'hi'
      ? '🙏 आपका धन्यवाद!\n\nकोई और सवाल हो तो पूछें।\n📞 +91 79721 40672\n\nआपका दिन शुभ हो! ✨'
      : '🙏 You\'re welcome!\n\nAsk anything else or call +91 79721 40672.\n\nHave a great day! ✨'
  }

  // ─── Help ───
  if (/^(help|menu|options|what can|मदद|मेन्यू|विकल्प)\b/.test(lower)) {
    return lang === 'hi'
      ? '🤖 **मैं आपकी कैसे मदद कर सकती हूं?**\n\n• 🏗️ **इंफ्रास्ट्रक्चर** — निर्माण सेवाओं के बारे में पूछें\n• 🏠 **रियल एस्टेट** — संपत्तियों के बारे में पूछें\n• 📈 **फाइनेंस** — शेयर बाजार, निवेश\n• 🌿 **आयुर्वेद** — जड़ीबूटियां, स्वास्थ्य\n• 💼 **करियर** — नौकरी, भर्ती\n• 📞 **संपर्क** — फोन, ईमेल, पता\n• 💰 **मूल्य** — कीमत, शुल्क\n• 📍 **स्थान** — शहर, क्षेत्र\n\nया कोई भी सवाल पूछें!'
      : '🤖 **How can I help you?**\n\n• 🏗️ **Infrastructure** — ask about construction\n• 🏠 **Real Estate** — ask about properties\n• 📈 **Finance** — stocks, investing\n• 🌿 **Ayurveda** — herbs, health\n• 💼 **Career** — jobs, hiring\n• 📞 **Contact** — phone, email, address\n• 💰 **Pricing** — costs, fees\n• 📍 **Location** — cities, areas\n\nOr ask me anything!'
  }

  // ─── Website / Pages ───
  if (/\b(website|page|navigate|go to|link|वेबसाइट|पेज|लिंक)\b/.test(lower)) {
    return lang === 'hi'
      ? '🌐 **वेबसाइट पेज**\n\nInfinite Gundawar वेबसाइट पर ये पेज हैं:\n\n• 🏠 / — होम (सभी सेवाओं का अवलोकन)\n• 🏗️ /infrastructure — इंफ्रास्ट्रक्चर\n• 🏠 /real-estate — रियल एस्टेट\n• 📈 /finance — फाइनेंस (73 पैटर्न)\n• 🌿 /ayurveda — आयुर्वेद (10,000+ जड़ीबूटियां)\n• 💼 /career — करियर\n• 🤖 /ai-tools — AI टूल्स\n• 🏠 /interior — इंटीरियर डिज़ाइन\n• 📊 /lead-generation — लीड जनरेशन\n• 🔍 /data-scraper — वेब स्क्रैपर\n• 📧 /email-sender — ईमेल सेंडर\n• 📱 /phone-scraper — फोन फाइंडर\n• 😊 /happiness — खुशी और माइंडफुलनेस\n• 📋 /free-business-kit — फ्री बिजनेस किट\n\nकिसी पेज पर जाने के लिए पूछें!'
      : '🌐 **Website Pages**\n\nInfinite Gundawar website has these pages:\n\n• 🏠 / — Home (overview)\n• 🏗️ /infrastructure — Infrastructure\n• 🏠 /real-estate — Real Estate\n• 📈 /finance — Finance (73 patterns)\n• 🌿 /ayurveda — Ayurveda (10,000+ herbs)\n• 💼 /career — Careers\n• 🤖 /ai-tools — AI Tools\n• 🏠 /interior — Interior Design\n• 📊 /lead-generation — Lead Generation\n• 🔍 /data-scraper — Web Scraper\n• 📧 /email-sender — Email Sender\n• 📱 /phone-scraper — Phone Finder\n• 😊 /happiness — Happiness & Mindfulness\n• 📋 /free-business-kit — Free Business Kit\n\nAsk to navigate to any page!'
  }

  // ─── Page-aware contextual responses ───
  if (page) {
    if (page.includes('/finance') && /\b(pattern|patterns|candlestick|technical|analysis|chart)\b/.test(lower)) {
      return lang === 'hi'
        ? '📈 **73 ट्रेडिंग पैटर्न**\n\nफाइनेंस पेज पर **73 ट्रेडिंग पैटर्न** उपलब्ध हैं!\n\nइनमें शामिल हैं:\n• 🕯️ कैंडलस्टिक पैटर्न (हजारों)\n• 📊 चार्ट पैटर्न\n• 📈 ट्रेंड पैटर्न\n• 🔄 रिवर्सल पैटर्न\n• मोमबत्ती संयोजन\n\nये पैटर्न शेयर बाजार व्यापार में मदद करते हैं।\n\n📞 +91 79721 40672'
        : '📈 **73 Trading Patterns**\n\nThe finance page has **73 trading patterns** available!\n\nIncludes:\n• 🕯️ Candlestick Patterns (thousands)\n• 📊 Chart Patterns\n• 📈 Trend Patterns\n• 🔄 Reversal Patterns\n• Candle Combinations\n\nThese patterns help in stock market trading.\n\n📞 +91 79721 40672'
    }

    if (page.includes('/ayurveda') && /\b(herb|herbs|medicine|remedy|remedies|जड़ीबूटी|दवा|उपचार)\b/.test(lower)) {
      return lang === 'hi'
        ? '🌿 **10,000+ आयुर्वेदिक जड़ीबूटियां**\n\nआयुर्वेद पेज पर **10,000+ जड़ीबूटियां** उपलब्ध हैं!\n\n**लोकप्रिय:**\n• अश्वगंधा — तनाव और ऊर्जा\n• तुलसी — प्रतिरक्षा\n• ब्राह्मी — मस्तिष्क और स्मृति\n• शतावरी — महिला स्वास्थ्य\n• अर्जुन — हृदय स्वास्थ्य\n• पुनर्नवा — किडनी स्वास्थ्य\n\n📞 +91 79721 40672'
        : '🌿 **10,000+ Ayurvedic Herbs**\n\nThe Ayurveda page has **10,000+ herbs** available!\n\n**Popular:**\n• Ashwagandha — stress & energy\n• Tulsi — immunity\n• Brahmi — brain & memory\n• Shatavari — women\'s health\n• Arjuna — heart health\n• Punarnava — kidney health\n\n📞 +91 79721 40672'
    }
  }

  return null // No local match — will use LLM or fallback
}

// ─── Offline intent classification (no key needed) ───
const INTENT_KEYWORDS: Record<string, RegExp> = {
  infrastructure: /\b(infrastructure|construction|build|building|township|bot|road|bridge|warehouse|industrial|निर्माण|बिल्डिंग|टाउनशिप)\b/i,
  'real-estate': /\b(real estate|property|properties|house|flat|apartment|plot|land|villa|home|रियल एस्टेट|प्रॉपर्टी|फ्लैट|प्लॉट|जमीन|घर|विला)\b/i,
  finance: /\b(finance|trading|stock|invest|share|market|mutual fund|portfolio|candlestick|option|शेयर|बाजार|निवेश|ट्रेडिंग|म्यूचुअल फंड)\b/i,
  ayurveda: /\b(ayurved|ayurveda|health|herb|herbal|yoga|wellness|dosha|immunity|medicine|आयुर्वेद|स्वास्थ्य|जड़ीबूटी|योग|दोष|प्रतिरक्षा)\b/i,
  career: /\b(career|job|hiring|work|recruit|position|salary|resume|apply|vacancy|करियर|नौकरी|भर्ती|काम|पद|वेतन|रिज्यूमे)\b/i,
  'ai-tools': /\b(ai|artificial intelligence|tool|directory|machine learning|chatbot|gpt|टूल|डायरेक्टरी)\b/i,
  interior: /\b(interior|design|tile|kitchen|lighting|furniture|decor|इंटीरियर|डिज़ाइन|टाइल|किचन|लाइटिंग)\b/i,
  education: /\b(education|course|learn|training|skill|coaching|study|शिक्षा|कोर्स|सीखें|प्रशिक्षण|कोचिंग)\b/i,
}
export function classifyIntent(text: string): string {
  for (const [cat, re] of Object.entries(INTENT_KEYWORDS)) {
    if (re.test(text)) return cat
  }
  return 'other'
}

// ─── Offline sentiment (no key needed) ───
export function detectSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const lower = text.toLowerCase()
  const pos = /\b(good|great|excellent|love|happy|thanks|thank you|amazing|best|awesome|wonderful|nice|helpful|बढ़िया|अच्छा|धन्यवाद|खुश|शानदार)\b/i
  const neg = /\b(bad|terrible|worst|hate|angry|poor|awful|broken|slow|error|problem|issue|complaint|बुरा|खराब|गुस्सा|शिकायत)\b/i
  if (pos.test(lower) && !neg.test(lower)) return 'positive'
  if (neg.test(lower)) return 'negative'
  return 'neutral'
}

export function translateOffline(text: string, target: string): string {
  // Lightweight offline EN<->HI phrase map for the most common business phrases
  const map: Record<string, string> = {
    'hello': 'नमस्ते', 'welcome': 'स्वागत है', 'thank you': 'धन्यवाद',
    'contact': 'संपर्क', 'call': 'कॉल', 'property': 'संपत्ति', 'investment': 'निवेश',
    'herb': 'जड़ीबूटी', 'service': 'सेवा', 'company': 'कंपनी',
  }
  if (target === 'hi') {
    let out = text
    for (const [en, hi] of Object.entries(map)) {
      out = out.replace(new RegExp(`\\b${en}\\b`, 'gi'), hi)
    }
    return out
  }
  return text
}

// ─── Detect if user wants web search ───
export function isSearchQuery(q: string): boolean {
  const lower = q.toLowerCase()
  return /^(search|find|look\s*for|browse|google|खोज|ढूंढ|ढूंढो|खोजो)/i.test(lower) ||
    /\b(near me|nearby|in \w+ city|latest|today|news|weather|price of|cost of|how to|what is|who is|where is)\b/i.test(lower)
}

// ─── Format search results for LLM ───
export function formatSearchResults(results: {title: string; url: string; snippet: string}[]): string {
  if (results.length === 0) return 'No search results found.'
  return results.map((r, i) =>
    `[${i + 1}] ${r.title}\nURL: ${r.url}\n${r.snippet}`
  ).join('\n\n')
}

// ─── Re-export free-model helpers for the /api/ai router ───
export { getEngineStatus, FREE_MODELS, callFreeLLMChain }

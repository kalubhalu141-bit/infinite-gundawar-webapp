'use client'

import { useState, useRef } from 'react'
import { textToSpeech, ODAI_MODELS } from '@/lib/onDeviceAI'
import { IntentClassifier } from '@/lib/clientML'

const SAMPLES = [
  { text: 'i need construction and real estate help', label: 'Infrastructure' },
  { text: 'how to start import export business', label: 'Trading' },
  { text: 'ashwagandha benefits for stress', label: 'Ayurveda' },
  { text: 'best mutual funds and tax saving', label: 'Finance' },
  { text: 'job opening for sales in nagpur', label: 'Career' },
  { text: 'digital marketing seo for my brand', label: 'Marketing' },
  { text: 'interior design for my home', label: 'Interior' },
  { text: 'free ai tools you provide', label: 'AI' },
]

const KB: Record<string, string> = {
  Infrastructure: 'Infinite Gundawar develops infrastructure & real estate across Maharashtra — residential, commercial and industrial projects.',
  Trading: 'Our Import/Export vertical connects Indian suppliers with global buyers across electronics, agriculture, fashion and more.',
  Ayurveda: 'We index real Ayurvedic herbs and diseases. Try the Herb Finder or Diagnose pages for free on-device guidance.',
  Finance: 'We offer finance calculators and investment insights — visit /finance and /investment.',
  Career: 'Our Coaching & Education vertical offers skill development, certification and competitive exam prep.',
  Marketing: 'Infinite Gundawar runs data-driven digital marketing — campaigns, branding and analytics.',
  Interior: 'We provide AI-powered interior design with 3D visualization and Vastu-compliant layouts.',
  AI: 'Our free on-device AI suite runs entirely in your browser — sentiment, translation, NER, vision, voice and more. Visit /free-ai-lab.',
}

/**
 * FreeAIChat — a 100% FREE, fully offline chatbot. Routes intent with a TF-IDF
 * KNN classifier (clientML) and replies from a local knowledge base, then speaks
 * the answer with SpeechT5. No server, no keys.
 */
export default function FreeAIChat() {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Namaste! I am the free, on-device assistant for Infinite Gundawar. Ask about our business, Ayurveda, or AI.' },
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const clf = useRef(new IntentClassifier(SAMPLES))

  function reply(q: string): string {
    const top = clf.current.classify(q)[0]
    const intent = top?.label ?? 'AI'
    return KB[intent] || 'I am a free on-device assistant for Infinite Gundawar — infrastructure, trade, education, Ayurveda and digital marketing. How can I help?'
  }

  async function send() {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    setBusy(true)
    const botText = reply(userMsg)
    setMessages((m) => [...m, { role: 'user', text: userMsg }, { role: 'bot', text: botText }])
    try {
      const blob = await textToSpeech(botText)
      const url = URL.createObjectURL(blob)
      new Audio(url).play()
    } catch {}
    setBusy(false)
  }

  return (
    <div className="glass" style={{ padding: 22 }}>
      <h3 style={{ marginTop: 0 }}>💬 Free AI Chat (offline)</h3>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>
        Intent routing (TF-IDF KNN) + SpeechT5 voice. Zero server. TTS: {ODAI_MODELS.tts.split('/')[1]}
      </p>
      <div style={{ marginTop: 12, maxHeight: 240, overflowY: 'auto', display: 'grid', gap: 8 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth: '82%', padding: '9px 13px', borderRadius: 12, fontSize: 14, background: m.role === 'user' ? 'rgba(212,168,67,0.18)' : 'rgba(56,189,248,0.12)', border: '1px solid var(--line)' }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Type a message…"
          style={{ flex: 1, padding: '11px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', color: 'var(--text)', fontFamily: 'inherit' }}
        />
        <button className="btn-primary" onClick={send} disabled={busy}>{busy ? '…' : 'Send'}</button>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import {
  deviceType,
  isOnDeviceSupported,
  analyzeSentiment,
  translateEnToHi,
  summarize,
  answerQuestion,
  textToSpeech,
  ODAI_MODELS,
} from '@/lib/onDeviceAI'

type Mode = 'sentiment' | 'translate' | 'summarize' | 'qa' | 'tts'

export default function AIStudio() {
  const [mode, setMode] = useState<Mode>('sentiment')
  const [supported, setSupported] = useState<boolean | null>(null)
  const [device, setDevice] = useState<string>('')
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('Idle')
  const [result, setResult] = useState<string>('')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [input, setInput] = useState(
    'Infinite Gundawar is building world-class infrastructure and empowering rural Maharashtra through education and trade.',
  )
  const [context, setContext] = useState(
    'Infinite Gundawar Business Private Limited operates across Infrastructure & Real Estate, Import/Export Trading, Coaching & Education, and Digital Marketing from Gadchiroli, Maharashtra. The company focuses on inclusive growth and skill development.',
  )
  const [question, setQuestion] = useState('What sectors does Infinite Gundawar operate in?')

  useEffect(() => {
    setSupported(isOnDeviceSupported())
    setDevice(deviceType())
  }, [])

  const onProgress = (p: any) => {
    if (p && typeof p.progress === 'number') setProgress(Math.round(p.progress * 100))
    if (p && p.status) setStatus(p.status)
  }

  async function run() {
    if (!supported) return
    setBusy(true)
    setProgress(0)
    setResult('')
    setStatus('Loading model…')
    try {
      if (mode === 'sentiment') {
        const r = await analyzeSentiment(input, onProgress)
        setResult(`Sentiment: ${r.label}  (confidence ${(r.score * 100).toFixed(1)}%)`)
      } else if (mode === 'translate') {
        const hi = await translateEnToHi(input, onProgress)
        setResult(hi || '(no output)')
      } else if (mode === 'summarize') {
        const s = await summarize(input, onProgress)
        setResult(s || '(no output)')
      } else if (mode === 'qa') {
        const a = await answerQuestion(question, context, onProgress)
        setResult(`Answer: ${a.answer}  (score ${(a.score * 100).toFixed(1)}%)`)
      } else if (mode === 'tts') {
        const blob = await textToSpeech(input, onProgress)
        const url = URL.createObjectURL(blob)
        if (audioRef.current) {
          audioRef.current.src = url
          audioRef.current.play()
        }
        setResult('Spoken! (SpeechT5 — free on-device text-to-speech)')
      }
      setStatus('Ready')
    } catch (e: any) {
      setStatus('Error: ' + (e?.message || String(e)))
    } finally {
      setBusy(false)
    }
  }

  const MODELS: Record<Mode, string> = {
    sentiment: ODAI_MODELS.sentiment,
    translate: ODAI_MODELS.translateEnHi,
    summarize: ODAI_MODELS.summarize,
    qa: ODAI_MODELS.qa,
    tts: ODAI_MODELS.tts,
  }

  return (
    <div className="glass" style={{ padding: 26 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
        {(['sentiment', 'translate', 'summarize', 'qa', 'tts'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className="btn-ghost"
            style={{
              padding: '8px 16px',
              background: mode === m ? 'linear-gradient(90deg,var(--gold),var(--gold-2))' : 'transparent',
              color: mode === m ? '#1a1205' : 'var(--text)',
              borderColor: mode === m ? 'transparent' : 'var(--line)',
            }}
          >
            {m === 'sentiment'
              ? 'Sentiment'
              : m === 'translate'
                ? 'EN → हिन्दी'
                : m === 'summarize'
                  ? 'Summarize'
                  : m === 'qa'
                    ? 'Ask (Q&A)'
                    : 'Speak (TTS)'}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14 }}>
        Device: <b style={{ color: 'var(--text)' }}>{device || 'detecting…'}</b> · Model:{' '}
        <code style={{ color: 'var(--gold)' }}>{MODELS[mode]}</code>
        {!supported && <span style={{ color: '#ff8080' }}> · not supported in this browser</span>}
      </div>

      {(mode === 'sentiment' || mode === 'translate' || mode === 'summarize' || mode === 'tts') && (
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          style={taStyle}
          placeholder="Type text…"
        />
      )}

      {mode === 'qa' && (
        <>
          <input value={question} onChange={(e) => setQuestion(e.target.value)} style={inpStyle} placeholder="Your question" />
          <textarea value={context} onChange={(e) => setContext(e.target.value)} rows={4} style={taStyle} placeholder="Context to read" />
        </>
      )}

      <div style={{ margin: '16px 0' }}>
        <div className="ai-progress-track">
          <div className="ai-progress-fill" style={{ width: `${busy ? Math.max(progress, 8) : 0}%` }} />
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>{status}</div>
      </div>

      <button className="btn-primary" onClick={run} disabled={busy || !supported}>
        {busy ? 'Running on-device…' : 'Run free on-device AI'}
      </button>

      {result && (
        <div
          style={{
            marginTop: 18,
            padding: 16,
            borderRadius: 12,
            background: 'rgba(56,189,248,0.08)',
            border: '1px solid var(--line)',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.6,
          }}
        >
          {result}
        </div>
      )}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  )
}

const inpStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 12,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid var(--line)',
  color: 'var(--text)',
  fontSize: 15,
  marginBottom: 12,
  outline: 'none',
}

const taStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 12,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid var(--line)',
  color: 'var(--text)',
  fontSize: 15,
  resize: 'vertical',
  marginBottom: 12,
  outline: 'none',
  fontFamily: 'inherit',
}

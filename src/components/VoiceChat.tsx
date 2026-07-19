'use client'

import { useEffect, useRef, useState } from 'react'
import {
  speechToText,
  textToSpeech,
  deviceType,
  isOnDeviceSupported,
  getPipeline,
  ODAI_MODELS,
} from '@/lib/onDeviceAI'

/**
 * VoiceChat — 100% FREE, fully offline voice assistant.
 * Record (mic) → Whisper ASR (on-device) → rule-based free response → SpeechT5 TTS (on-device).
 * No API keys, no network for the AI. Mic + audio playback need a user gesture.
 */
export default function VoiceChat() {
  const [device, setDevice] = useState('')
  const [supported, setSupported] = useState<boolean | null>(null)
  const [listening, setListening] = useState(false)
  const [busy, setBusy] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [reply, setReply] = useState('')
  const [status, setStatus] = useState('Idle')
  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setDevice(deviceType())
    setSupported(isOnDeviceSupported())
  }, [])

  async function startRec() {
    if (!supported) return
    setTranscript('')
    setReply('')
    setStatus('Requesting mic…')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      chunksRef.current = []
      mr.ondataavailable = (e) => chunksRef.current.push(e.data)
      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setStatus('Transcribing with Whisper (on-device)…')
        setBusy(true)
        try {
          const text = await speechToText(blob)
          setTranscript(text || '(no speech detected)')
          const answer = localReply(text || '')
          setReply(answer)
          setStatus('Speaking (SpeechT5, on-device)…')
          const audioBlob = await textToSpeech(answer)
          const url = URL.createObjectURL(audioBlob)
          if (audioRef.current) {
            audioRef.current.src = url
            await audioRef.current.play()
          }
          setStatus('Ready')
        } catch (e: any) {
          setStatus('Error: ' + (e?.message || String(e)))
        } finally {
          setBusy(false)
          stream.getTracks().forEach((t) => t.stop())
        }
      }
      mediaRef.current = mr
      mr.start()
      setListening(true)
      setStatus('Listening… click stop when done')
    } catch (e: any) {
      setStatus('Mic error: ' + (e?.message || String(e)))
    }
  }

  function stopRec() {
    mediaRef.current?.stop()
    setListening(false)
  }

  // Tiny free, offline intent→response router (no model needed).
  function localReply(q: string): string {
    const t = q.toLowerCase()
    if (/infrastructure|real estate|build|construction|property/.test(t))
      return 'Infinite Gundawar develops infrastructure and real estate across Maharashtra — residential, commercial and industrial projects. How can we help with your project?'
    if (/import|export|trade|china|global/.test(t))
      return 'Our Import/Export trading vertical connects Indian suppliers with global buyers across electronics, agriculture, fashion and more.'
    if (/ayurveda|herb|health|disease|stress/.test(t))
      return 'We index real Ayurvedic herbs and diseases. Try the Herb Finder or Diagnose pages for free, on-device guidance.'
    if (/course|coaching|education|exam|skill/.test(t))
      return 'Our Coaching & Education vertical offers skill development, certification and competitive exam prep.'
    if (/marketing|seo|brand|digital/.test(t))
      return 'Infinite Gundawar runs data-driven digital marketing — campaigns, branding and analytics.'
    if (/hello|hi|hey|namaste/.test(t))
      return 'Namaste! I am the free, on-device voice assistant for Infinite Gundawar. Ask me about our business, Ayurveda, or AI.'
    return 'I am a free on-device assistant for Infinite Gundawar — infrastructure, trade, education, Ayurveda and digital marketing. Tell me what you need.'
  }

  return (
    <div className="glass" style={{ padding: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>🎙️ Voice Chat (free, offline)</h3>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>device: {device || '…'}</span>
      </div>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>
        Whisper speech-to-text + SpeechT5 voice — runs entirely in your browser. No keys, no server.
      </p>

      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        {!listening ? (
          <button className="btn-primary" onClick={startRec} disabled={!supported || busy}>
            🎤 Start talking
          </button>
        ) : (
          <button className="btn-ghost" onClick={stopRec} style={{ borderColor: 'var(--gold)' }}>
            ⏹ Stop
          </button>
        )}
      </div>

      <div style={{ marginTop: 14, fontSize: 13, color: 'var(--gold)' }}>{status}</div>

      {transcript && (
        <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: 'rgba(56,189,248,0.08)' }}>
          <b>You said:</b> {transcript}
        </div>
      )}
      {reply && (
        <div style={{ marginTop: 10, padding: 12, borderRadius: 10, background: 'rgba(212,168,67,0.10)' }}>
          <b>Assistant:</b> {reply}
        </div>
      )}
      <audio ref={audioRef} style={{ display: 'none' }} />
      <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 10 }}>
        Models: {ODAI_MODELS.asr.split('/')[1]} · {ODAI_MODELS.tts.split('/')[1]}
      </p>
    </div>
  )
}

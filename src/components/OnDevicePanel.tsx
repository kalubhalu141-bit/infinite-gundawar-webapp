// src/components/OnDevicePanel.tsx — visible, usable FREE on-device AI widgets.
// Real transformers.js models run IN THE BROWSER (WebGPU/WASM), zero API key.
// Three tools: Sentiment, EN↔HI Translate, Summarize. Each degrades gracefully
// if the model can't load (shows a clear status, never a broken UI).
'use client'
import { useState } from 'react'
import {
  analyzeSentiment,
  translateEnToHi,
  translateHiToEn,
  summarize,
  type ODTask,
} from '@/lib/onDeviceAI'

type Tool = 'sentiment' | 'translate' | 'summarize'

export default function OnDevicePanel() {
  const [tool, setTool] = useState<Tool>('sentiment')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState<'idle' | 'working' | 'ready' | 'error'>('idle')
  const [statusMsg, setStatusMsg] = useState('')

  const run = async () => {
    if (!input.trim()) return
    setStatus('working')
    setStatusMsg('Loading free on-device model…')
    setOutput('')
    try {
      let res = ''
      if (tool === 'sentiment') {
        const r = await analyzeSentiment(input)
        res = `Sentiment: ${r.label}  (confidence ${(r.score * 100).toFixed(1)}%)`
      } else if (tool === 'translate') {
        // crude script detection: Devanagari => HI->EN else EN->HI
        const isHi = /[०-९ॠ-ॿ]/.test(input)
        res = isHi ? await translateHiToEn(input) : await translateEnToHi(input)
      } else {
        res = await summarize(input)
      }
      setOutput(res || '(no result)')
      setStatus('ready')
      setStatusMsg('')
    } catch (e: any) {
      setStatus('error')
      setStatusMsg('On-device model unavailable (offline or unsupported browser).')
    }
  }

  const toolMeta: Record<Tool, { label: string; placeholder: string; icon: string }> = {
    sentiment: { label: 'Sentiment', placeholder: 'Type a review or sentence…', icon: '😊' },
    translate: { label: 'Translate EN↔HI', placeholder: 'Type in English or Hindi…', icon: '🌐' },
    summarize: { label: 'Summarize', placeholder: 'Paste a paragraph to summarize…', icon: '📝' },
  }

  return (
    <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> Free On-Device AI · no key
        </span>
        <div className="flex gap-1.5">
          {(Object.keys(toolMeta) as Tool[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTool(t); setOutput(''); setStatus('idle'); setStatusMsg('') }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                tool === t ? 'bg-cyan-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {toolMeta[t].icon} {toolMeta[t].label}
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
        placeholder={toolMeta[tool].placeholder}
        className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-cyan-500/40 resize-none"
      />

      <div className="flex items-center gap-3 mt-3">
        <button
          onClick={run}
          disabled={status === 'working' || !input.trim()}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-fuchsia-600 text-white font-semibold text-sm disabled:opacity-40 hover:shadow-lg hover:shadow-cyan-500/30 transition"
        >
          {status === 'working' ? 'Working…' : 'Run on my device'}
        </button>
        {status === 'error' && <span className="text-xs text-amber-300">{statusMsg}</span>}
      </div>

      {output && (
        <div className="mt-4 p-4 rounded-xl bg-black/30 border border-white/10">
          <p className="text-sm text-white/90 whitespace-pre-line">{output}</p>
          <p className="text-[11px] text-white/40 mt-2">Processed locally in your browser via transformers.js — nothing sent to a server.</p>
        </div>
      )}
    </div>
  )
}

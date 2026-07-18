/* ─────────────────────────────────────────────────────────────
   Infinite Gundawar — Browser-side FREE AI engine (no API key)
   Uses HuggingFace transformers.js loaded from CDN.
   Runs a small local LLM (Qwen2.5-0.6B) entirely in the browser
   via WebGPU/WASM. This means instant, private, KEY-FREE responses
   for every page. Falls back gracefully if WebGPU is unavailable.
   ───────────────────────────────────────────────────────────── */
(function () {
  window.IG_AI = window.IG_AI || {}
  const IG = window.IG_AI

  IG.state = {
    loaded: false,
    loading: false,
    available: false,
    error: null,
    modelId: 'onnx-community/Qwen2.5-0.6B-Instruct',
    engine: 'browser-local',
  }

  // Lazy-load the transformers.js UMD bundle from CDN (no bundler needed)
  function loadTransformers() {
    return new Promise((resolve, reject) => {
      if (window.transformers) return resolve(window.transformers)
      const s = document.createElement('script')
      s.src = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.1/dist/transformers.min.js'
      s.onload = () => resolve(window.transformers)
      s.onerror = () => reject(new Error('CDN load failed'))
      document.head.appendChild(s)
    })
  }

  let generator = null

  IG.initLocal = async function () {
    if (IG.state.loaded || IG.state.loading) return IG.state
    IG.state.loading = true
    try {
      const transformers = await loadTransformers()
      const { pipeline, env } = transformers
      env.allowLocalModels = false
      // Prefer WebGPU; transformers.js auto-falls back to WASM
      const device = (navigator.gpu) ? 'webgpu' : 'wasm'
      generator = await pipeline('text-generation', IG.state.modelId, {
        device,
        dtype: device === 'webgpu' ? 'q4f16' : 'q4',
      })
      IG.state.loaded = true
      IG.state.available = true
      IG.state.loading = false
      return IG.state
    } catch (e) {
      IG.state.loading = false
      IG.state.error = String(e && e.message || e)
      IG.state.available = false
      return IG.state
    }
  }

  // Generate a short local reply. Returns { text, source }
  IG.localChat = async function (prompt, system) {
    if (!IG.state.available) {
      // Try to init (non-blocking best-effort)
      const st = await IG.initLocal()
      if (!st.available) return { text: '', source: 'unavailable' }
    }
    try {
      const messages = [
        { role: 'system', content: system || 'You are a helpful assistant for Infinite Gundawar Business Private Limited.' },
        { role: 'user', content: prompt },
      ]
      const out = await generator(messages, {
        max_new_tokens: 220,
        do_sample: false,
        temperature: 0.7,
      })
      const text = out?.[0]?.generated_text?.at(-1)?.content || ''
      return { text: text.trim(), source: 'browser-local' }
    } catch (e) {
      return { text: '', source: 'error' }
    }
  }

  IG.status = function () { return IG.state }

  // ── Convenience: per-section AI tools (all free) ──
  IG.translate = async function (text, target) {
    const sys = `Translate the following into ${target === 'hi' ? 'Hindi (Devanagari)' : 'English'}. Output only the translation.`
    const r = await IG.localChat(text, sys)
    if (r.text) return r.text
    // fallback to server free endpoint
    try {
      const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'translate', text, target }) })
      const d = await res.json(); return d.result || text
    } catch { return text }
  }

  IG.summarize = async function (text) {
    const r = await IG.localChat(text, 'Summarize in 3-5 concise bullet points.')
    if (r.text) return r.text
    try {
      const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'summarize', text }) })
      const d = await res.json(); return d.result || text
    } catch { return text }
  }
})()

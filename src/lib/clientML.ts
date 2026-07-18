// ─────────────────────────────────────────────────────────────────────────────
//  clientML.ts — pure client-side ML · ZERO network · ZERO models to download
//
//  Used as the INSTANT, ALWAYS-WORKING fallback for on-device AI features when
//  the transformers.js models are still downloading (or the CDN is unreachable).
//  Everything here runs synchronously in the browser with no dependencies.
//  ─────────────────────────────────────────────────────────────────────────────

'use client'

/* ── Tokenizer (lightweight, English+Hinglish aware) ── */
export function tokenize(text: string): string[] {
  return (text.toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean))
}

const STOP = new Set([
  'the','a','an','and','or','but','if','then','else','of','to','in','on','for','with','at','by','from',
  'is','are','was','were','be','been','being','this','that','these','those','it','its','as','we','you','your',
  'i','me','my','our','they','he','she','his','her','their','what','which','who','how','why','when','where',
  'hai','hain','ka','ki','ke','ko','mein','main','se','aur','ya','ek','do','teen','mera','hamara','aap','kya',
  'है','का','की','के','में','से','और','एक','आप','क्या','मेरा','हमारा',
])

export function cleanTokens(text: string): string[] {
  return tokenize(text).filter(t => t.length > 1 && !STOP.has(t))
}

/* ── TF-IDF ── */
export function tfidf(docs: string[]): { matrix: number[][]; vocab: string[] } {
  const tokenized = docs.map(cleanTokens)
  const vocabSet = new Set<string>()
  tokenized.forEach(ts => ts.forEach(t => vocabSet.add(t)))
  const vocab = Array.from(vocabSet)
  const idf = new Array(vocab.length).fill(0)
  const N = docs.length

  tokenized.forEach(ts => {
    const seen = new Set(ts)
    seen.forEach(t => {
      const idx = vocab.indexOf(t)
      if (idx >= 0) idf[idx] += 1
    })
  })
  for (let i = 0; i < idf.length; i++) {
    idf[i] = Math.log((1 + N) / (1 + idf[i])) + 1
  }

  const matrix = tokenized.map(ts => {
    const tf = new Array(vocab.length).fill(0)
    ts.forEach(t => { const idx = vocab.indexOf(t); if (idx >= 0) tf[idx] += 1 })
    const len = ts.length || 1
    return tf.map((f, i) => (f / len) * idf[i])
  })

  return { matrix, vocab }
}

/* ── Cosine similarity ── */
export function cosine(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length)
  let dot = 0, na = 0, nb = 0
  for (let i = 0; i < n; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i] }
  if (na === 0 || nb === 0) return 0
  return dot / (Math.sqrt(na) * Math.sqrt(nb))
}

/* ── Build a TF-IDF index of labeled intents for semantic routing ── */
export interface IntentSample { text: string; label: string }

export class IntentClassifier {
  private samples: IntentSample[]
  private matrix!: number[][]
  private vocab!: string[]

  constructor(samples: IntentSample[]) {
    this.samples = samples
    const { matrix, vocab } = tfidf(samples.map(s => s.text))
    this.matrix = matrix
    this.vocab = vocab
  }

  private vectorize(text: string): number[] {
    const ts = cleanTokens(text)
    const len = ts.length || 1
    const v = new Array(this.vocab.length).fill(0)
    ts.forEach(t => { const idx = this.vocab.indexOf(t); if (idx >= 0) v[idx] += 1 })
    return v.map(f => f / len)
  }

  classify(text: string, k = 3): { label: string; score: number }[] {
    const vec = this.vectorize(text)
    const scored = this.samples.map((s, i) => ({
      label: s.label,
      score: cosine(vec, this.matrix[i]),
    }))
    scored.sort((a, b) => b.score - a.score)
    // normalize top-k into a pseudo-probability
    const top = scored.slice(0, k)
    const sum = top.reduce((a, b) => a + Math.max(b.score, 0), 0) || 1
    return top.map(t => ({ label: t.label, score: Math.max(t.score, 0) / sum }))
  }
}

/* ── A small, REAL KNN sentiment lexicon (VADER-style valence, EN + Hinglish) ── */
const POSITIVE = new Set([
  'good','great','excellent','love','happy','best','awesome','amazing','nice','helpful','wonderful','super','fantastic',
  'बढ़िया','अच्छा','शानदार','पसंद','खुश','badhiya','achha','best','love',
])
const NEGATIVE = new Set([
  'bad','terrible','worst','hate','angry','poor','awful','broken','slow','error','problem','issue','complaint','sad','fail',
  'बुरा','खराब','गुस्सा','शिकायत','दुखी','dukhi','kharaab','gussa','bad','worst',
])
const NEGATORS = new Set(['not','no','never','na','mat','नहीं','मत','ना'])
const INTENSIFIERS = new Set(['very','really','too','so','extremely','बहुत','बहुत','ekdam','zyada'])

export function lexiconSentiment(text: string): { label: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'; score: number } {
  const toks = cleanTokens(text)
  let score = 0
  let hits = 0
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i]
    let val = 0
    if (POSITIVE.has(t)) val = 1
    else if (NEGATIVE.has(t)) val = -1
    if (val !== 0) {
      if (i > 0 && NEGATORS.has(toks[i - 1])) val *= -0.9
      if (i > 0 && INTENSIFIERS.has(toks[i - 1])) val *= 1.4
      score += val
      hits++
    }
  }
  if (hits === 0) return { label: 'NEUTRAL', score: 0 }
  const norm = Math.max(-1, Math.min(1, score / Math.max(hits, 1)))
  const label = norm > 0.15 ? 'POSITIVE' : norm < -0.15 ? 'NEGATIVE' : 'NEUTRAL'
  return { label, score: Math.abs(norm) }
}

/* ── Lightweight EN↔HI phrase translation (offline, deterministic) ── */
const EN_HI: Record<string, string> = {
  'hello':'नमस्ते','welcome':'स्वागत','thank you':'धन्यवाद','thanks':'धन्यवाद','please':'कृपया',
  'property':'संपत्ति','investment':'निवेश','herb':'जड़ीबूटी','company':'कंपनी','service':'सेवा',
  'contact':'संपर्क','call':'कॉल','infrastructure':'इन्फ्रास्ट्रक्चर','business':'व्यवसाय','health':'स्वास्थ्य',
  'money':'पैसा','house':'घर','land':'जमीन','trade':'व्यापार','education':'शिक्षा','ai':'एआई',
}
const HI_EN: Record<string, string> = Object.fromEntries(Object.entries(EN_HI).map(([e, h]) => [h, e]))

export function translateOffline(text: string, target: 'hi' | 'en'): string {
  const map = target === 'hi' ? EN_HI : HI_EN
  const tokens = text.split(/(\s+)/)
  return tokens.map(tok => {
    const key = tok.toLowerCase().replace(/[.,!?;:]/g, '')
    return map[key] ? (tok[0] === tok[0]?.toUpperCase() ? map[key][0].toUpperCase() + map[key].slice(1) : map[key]) : tok
  }).join('')
}

/* ── Summarize without a model: sentence-rank extractive (TextRank-ish) ── */
export function extractiveSummary(text: string, sentences = 3): string {
  const sents = text.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.length > 20)
  if (sents.length <= sentences) return sents.join(' ')
  const { matrix } = tfidf(sents)
  const scores = sents.map((_, i) => {
    let s = 0
    for (let j = 0; j < sents.length; j++) if (j !== i) s += cosine(matrix[i], matrix[j])
    return s
  })
  const order = scores.map((s, i) => [s, i] as [number, number]).sort((a, b) => b[0] - a[0])
  const top = order.slice(0, sentences).map(([, i]) => i).sort((a, b) => a - b)
  return top.map(i => sents[i]).join(' ')
}

/* ── Keyword / phrase extraction (TF-IDF top terms) ── */
export function extractKeywords(text: string, k = 6): string[] {
  const { matrix, vocab } = tfidf([text])
  const row = matrix[0]
  return row.map((v, i) => [v, vocab[i]] as [number, string])
    .filter(([v]) => v > 0)
    .sort((a, b) => b[0] - a[0])
    .slice(0, k)
    .map(([, t]) => t)
}

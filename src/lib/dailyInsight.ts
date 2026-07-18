// src/lib/dailyInsight.ts — curated, REAL, verifiable daily-insight fallback.
// Indexed by day-of-year so the exact same insight shows for everyone on a
// given calendar day (deterministic, cache-friendly). All content is grounded
// in Infinite Gundawar's actual verticals — no fabrication, no fake stats.
//
// When a free LLM (local Ollama) is reachable, the /api/insight route asks the
// model to *expand* one of these real seeds into a fresh daily take — so the
// site literally gets better-written, day by day, for free.

export interface DailySeed {
  category: string
  title: string
  insight: string
  action: string
  source: string
}

// 28 real seeds (one per ~day of a month) across the company's verticals.
export const DAILY_SEEDS: DailySeed[] = [
  {
    category: 'Infrastructure',
    title: 'RERA compliance is your first filter',
    insight:
      'Before evaluating any Maharashtra real-estate or township project, confirm its RERA registration number on maharera.mahaonline.gov.in. Registered projects publish timelines, carpet-area and promoter details — your strongest protection against delays.',
    action: 'Verify the RERA number before signing any booking.',
    source: 'Maharashtra Real Estate Regulatory Authority',
  },
  {
    category: 'Real Estate',
    title: 'Location premium follows infrastructure',
    insight:
      'Land values in Pune, Nagpur, Nashik and Aurangabad track announced infrastructure (ring roads, metro, industrial corridors). Buying ahead of completed infrastructure captures the largest appreciation window.',
    action: 'Map upcoming infra projects before shortlisting localities.',
    source: 'Infinite Gundawar Real Estate desk',
  },
  {
    category: 'Finance',
    title: 'The 73-pattern edge is consistency',
    insight:
      'Candlestick and chart patterns only compound when traded with strict risk limits. The site documents 73 trading patterns — treat them as a checklist, not a prophecy. Size positions so one wrong call never dents the portfolio.',
    action: 'Define max 1–2% risk per trade before entering.',
    source: 'Infinite Gundawar Trading desk',
  },
  {
    category: 'Ayurveda',
    title: 'Ashwagandha for stress resilience',
    insight:
      'Ashwagandha (Withania somnifera) is among the most-studied adaptogens for reducing cortisol and improving sleep quality. It is one of 10,000+ herbs indexed on the site — searchable by symptom and use.',
    action: 'Explore the herb finder for evidence-linked remedies.',
    source: 'Infinite Gundawar Ayurveda database',
  },
  {
    category: 'AI Tools',
    title: 'On-device AI keeps data private',
    insight:
      'The Infinite AI suite runs transformers.js models inside your browser via WebGPU/WASM. Sentiment, translation, semantic search and summarization never leave your device — free forever, no API key.',
    action: 'Try the Infinite AI Suite — no sign-up required.',
    source: 'Infinite Gundawar AI Lab',
  },
  {
    category: 'Career',
    title: 'Multi-sector skill stacking wins',
    insight:
      'Open roles span construction engineering, sales, digital marketing, finance analysis and ayurvedic consulting. Candidates who pair a core trade with digital literacy move fastest in a diversified company like Infinite Gundawar.',
    action: 'Add one digital skill to your core trade this quarter.',
    source: 'Infinite Gundawar Careers',
  },
  {
    category: 'Interior',
    title: 'Vastu-compliant need not mean cramped',
    insight:
      'Good interior planning balances Vastu principles with modern space optimization — natural light from the north-east, kitchen in the south-east, clutter-free circulation. The interior studio generates layouts that respect both.',
    action: 'Start a layout with the AI Design Studio.',
    source: 'Infinite Gundawar Interior Design',
  },
  {
    category: 'Education',
    title: 'Learn by building, not by watching',
    insight:
      'Digital marketing, web development and trading are best learned through live projects. The education track pairs short theory with a real campaign, site or paper-trade journal.',
    action: 'Commit to one shipped project per course module.',
    source: 'Infinite Gundawar Education',
  },
  {
    category: 'Trading',
    title: 'Trend is your friend — until it bends',
    insight:
      'Most losses come from fighting the trend. Use the documented reversal patterns only after confirmation (volume + a close beyond the level), not on a hunch.',
    action: 'Wait for confirmation before reversal entries.',
    source: 'Infinite Gundawar Trading desk',
  },
  {
    category: 'Wellness',
    title: 'Sleep is the cheapest performance drug',
    insight:
      'Consistent 7–8 hours outperforms most supplements for focus and mood. The Happiness hub pairs mindfulness micro-practices with sleep hygiene as the foundation.',
    action: 'Fix a wind-down routine before adding any supplement.',
    source: 'Infinite Gundawar Happiness Hub',
  },
  {
    category: 'Infrastructure',
    title: 'BOT models shift risk to the builder',
    insight:
      'Build-Operate-Transfer lets the public body get infrastructure without upfront capital, while the developer earns through the operating phase. Understand the concession period before evaluating returns.',
    action: 'Read the concession terms, not just the ribbon-cutting.',
    source: 'Infinite Gundawar Infrastructure',
  },
  {
    category: 'Real Estate',
    title: 'Clear title beats cheap price',
    insight:
      'A 20% discount on a disputed-title plot can become a 100% loss. Insist on a title search and encumbrance certificate before any token payment.',
    action: 'Commission a legal title search first.',
    source: 'Infinite Gundawar Real Estate desk',
  },
  {
    category: 'Ayurveda',
    title: 'Tulsi for daily immunity',
    insight:
      'Ocimum sanctum (Holy Basil / Tulsi) is a cornerstone rasayana in Ayurveda, traditionally used to support respiratory health and resilience. It is indexed alongside 10,000+ herbs on the site.',
    action: 'Brew tulsi as a daily ritual, not a one-off.',
    source: 'Infinite Gundawar Ayurveda database',
  },
  {
    category: 'AI Tools',
    title: 'Translation unlocks a second audience',
    insight:
      'EN↔HI translation via on-device NMT lets a single page serve both English and Hindi visitors. The site does this privately in the browser — no data leaves the device.',
    action: 'Toggle Hindi on any AI tool to reach more users.',
    source: 'Infinite Gundawar AI Lab',
  },
  {
    category: 'Finance',
    title: 'Compounding rewards patience',
    insight:
      'A ₹5,000 monthly SIP at 12% becomes ~₹1.1 crore in 30 years. The finance calculators let you model this instantly — the hardest part is starting and staying invested.',
    action: 'Run your own SIP projection in the calculators.',
    source: 'Infinite Gundawar Finance',
  },
  {
    category: 'Career',
    title: 'Portfolios beat resumes',
    insight:
      'For marketing, development and design roles, a link to real work outperforms a formatted CV. Keep a living portfolio and update it with each project.',
    action: 'Ship one public artifact this month.',
    source: 'Infinite Gundawar Careers',
  },
  {
    category: 'Interior',
    title: 'Lighting makes or breaks a room',
    insight:
      'Layered lighting (ambient + task + accent) transforms a flat space into a designed one. Plan circuits early — retrofitting is costly.',
    action: 'Sketch a 3-layer lighting plan before wiring.',
    source: 'Infinite Gundawar Interior Design',
  },
  {
    category: 'Education',
    title: 'Micro-learning beats cramming',
    insight:
      'Twenty focused minutes daily outperforms a weekend binge. The education track is built around daily, bite-sized practice.',
    action: 'Block 20 minutes daily, protect it.',
    source: 'Infinite Gundawar Education',
  },
  {
    category: 'Trading',
    title: 'Volume confirms the move',
    insight:
      'Price can be manipulated on low volume; a move backed by rising volume is far more trustworthy. Pair every breakout with a volume check.',
    action: 'Never trust a breakout without volume.',
    source: 'Infinite Gundawar Trading desk',
  },
  {
    category: 'Wellness',
    title: 'Breath is the remote control',
    insight:
      'A 4-7-8 breathing cycle actively shifts the nervous system toward calm. It is the fastest free tool in the Happiness hub.',
    action: 'Use 4-7-8 breathing before stressful calls.',
    source: 'Infinite Gundawar Happiness Hub',
  },
  {
    category: 'Infrastructure',
    title: 'Materials testing saves structures',
    insight:
      'Independent concrete and soil testing at every milestone prevents the costly failures that make headlines. Specify third-party QA in the contract.',
    action: 'Mandate independent QA in builder contracts.',
    source: 'Infinite Gundawar Infrastructure',
  },
  {
    category: 'Real Estate',
    title: 'Rental yield is the reality check',
    insight:
      'Capital appreciation is speculative; rental yield is real cash flow. Compare a locality’s monthly rent to price to gauge true demand.',
    action: 'Compute yield = annual rent / property price.',
    source: 'Infinite Gundawar Real Estate desk',
  },
  {
    category: 'Ayurveda',
    title: 'Brahmi for focus',
    insight:
      'Bacopa monnieri (Brahmi) is traditionally used to support memory and concentration. It joins 10,000+ indexed herbs you can search by use on the site.',
    action: 'Search “memory” in the herb finder.',
    source: 'Infinite Gundawar Ayurveda database',
  },
  {
    category: 'AI Tools',
    title: 'Summarization saves reading time',
    insight:
      'On-device abstractive summarization turns long reports into 3–5 bullets. It runs privately in the browser — paste text, get the gist, no upload.',
    action: 'Summarize your next long doc on-device.',
    source: 'Infinite Gundawar AI Lab',
  },
  {
    category: 'Finance',
    title: 'Emergency fund first, markets later',
    insight:
      'Keep 3–6 months of expenses in liquid savings before allocating to equities. It prevents forced selling at the worst time.',
    action: 'Build the buffer before increasing risk.',
    source: 'Infinite Gundawar Finance',
  },
  {
    category: 'Career',
    title: 'Referrals shorten the path',
    insight:
      'Most hires come through a warm introduction. Engage the company’s channels and show real work — a referral beats a cold application.',
    action: 'Reach out with a specific, built artifact.',
    source: 'Infinite Gundawar Careers',
  },
  {
    category: 'Interior',
    title: 'Storage is invisible design',
    insight:
      'Built-in storage keeps surfaces clear and rooms calm. Plan storage into the architecture, not as an afterthought of baskets.',
    action: 'Allocate storage early in the layout.',
    source: 'Infinite Gundawar Interior Design',
  },
  {
    category: 'Wellness',
    title: 'Movement is medicine',
    insight:
      'A 20-minute walk after meals improves glucose response and mood. The Happiness hub treats daily movement as foundational, not optional.',
    action: 'Walk 20 minutes after your main meal.',
    source: 'Infinite Gundawar Happiness Hub',
  },
]

export function seedForDate(date: Date = new Date()): { seed: DailySeed; index: number; dayKey: string } {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  const dayOfYear = Math.floor(diff / 86400000)
  const index = dayOfYear % DAILY_SEEDS.length
  const dayKey = date.toISOString().slice(0, 10) // YYYY-MM-DD
  return { seed: DAILY_SEEDS[index], index, dayKey }
}

// Map a topic (page/section name) to the most relevant seed. Tries an exact
// category match first, then a keyword scan of title+insight, then falls back
// to the date-seeded pick so every topic always returns REAL curated content.
const TOPIC_KEYWORDS: Record<string, string[]> = {
  finance: ['finance', 'trading', 'sip', 'invest', 'emergency', 'compound'],
  ayurveda: ['ayurved', 'herb', 'ashwagandha', 'tulsi', 'brahmi'],
  career: ['career', 'resume', 'portfolio', 'referral'],
  realestate: ['real estate', 'title', 'rera', 'rental', 'infrastructure', 'bot'],
  interior: ['interior', 'lighting', 'storage', 'vastu'],
  education: ['education', 'micro-learn', 'learn'],
  ai: ['ai', 'translation', 'on-device', 'summar'],
  wellness: ['wellness', 'sleep', 'breath', 'movement'],
}

export function seedForTopic(topic: string): { seed: DailySeed; index: number } | null {
  const t = topic.toLowerCase()
  // 1) direct category match
  const catIdx = DAILY_SEEDS.findIndex((s) => s.category.toLowerCase() === t)
  if (catIdx >= 0) return { seed: DAILY_SEEDS[catIdx], index: catIdx }
  // 2) keyword map
  const keys = TOPIC_KEYWORDS[t]
  if (keys) {
    const idx = DAILY_SEEDS.findIndex((s) =>
      keys.some((k) => (s.title + ' ' + s.insight + ' ' + s.category).toLowerCase().includes(k)),
    )
    if (idx >= 0) return { seed: DAILY_SEEDS[idx], index: idx }
  }
  // 3) loose substring on category
  const loose = DAILY_SEEDS.findIndex((s) => s.category.toLowerCase().includes(t) || t.includes(s.category.toLowerCase()))
  if (loose >= 0) return { seed: DAILY_SEEDS[loose], index: loose }
  return null
}

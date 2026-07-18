// Batch grower: calls the existing /api/ayurveda-doctors scraper across many
// real Indian states + specialties to accumulate REAL doctors into the index.
// Real data only (via live Google search). Run: node scripts/grow-doctors.mjs
const BASE = process.env.BASE || 'http://localhost:3300'
const STATES = ['Maharashtra','Delhi','Karnataka','Tamil Nadu','Telangana','Gujarat','Rajasthan','Uttar Pradesh','West Bengal','Kerala','Punjab','Haryana','Madhya Pradesh','Bihar','Odisha','Uttarakhand','Himachal Pradesh','Assam','Goa','Jharkhand']
const SPECIALTIES = ['general','panchakarma','skin','ortho','neuro','digestive','women','child','mental','diabetes','heart','kidney','liver','cancer','arthritis','asthma']
const sleep = ms => new Promise(r => setTimeout(r, ms))
async function scrape(specialty, state) {
  const res = await fetch(`${BASE}/api/ayurveda-doctors`, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ specialty, location: state, country: 'India', targetCount: 120 }),
  })
  if (!res.body) return 0
  const reader = res.body.getReader(); const dec = new TextDecoder(); let buf=''; let total=0
  while (true) {
    const {done,value} = await reader.read(); if (done) break
    buf += dec.decode(value)
    const lines = buf.split('\n'); buf = lines.pop()||''
    for (const line of lines) { try { const ev = JSON.parse(line); if (ev.type==='complete') total = ev.indexedTotal||total } catch{} }
  }
  return total
}
;(async () => {
  let n=0
  for (const state of STATES) {
    // 3 specialties per state keeps it bounded + real
    for (const sp of ['general','panchakarma','skin']) {
      try { const t = await scrape(sp, state); n = t; console.log(`✓ ${state}/${sp} -> indexed total: ${t}`) }
      catch (e) { console.log(`✗ ${state}/${sp}: ${e.message}`) }
      await sleep(800) // be polite to the API
    }
  }
  console.log(`\nDONE. Real doctors indexed: ${n}`)
})()

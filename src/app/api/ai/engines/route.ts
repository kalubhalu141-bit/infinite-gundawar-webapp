import { NextResponse } from 'next/server'
import { getEngineStatus } from '../../../../lib/freeModels'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Live diagnostic probe (debug) — tells us what the SERVER process sees.
  let diag: any = { tried: false }
  try {
    diag.tried = true
    const t0 = Date.now()
    const r = await fetch('http://127.0.0.1:11434/api/tags', { signal: AbortSignal.timeout(5000) })
    diag.status = r.status
    if (r.ok) {
      const d = (await r.json()) as any
      diag.modelCount = (d.models || []).length
    }
    diag.ms = Date.now() - t0
  } catch (e: any) {
    diag.error = e?.message || String(e)
    diag.stack = e?.stack?.split('\n').slice(0, 3)
  }

  const e = getEngineStatus()
  return NextResponse.json({
    ok: true,
    diagnostic: diag,
    engines: {
      localOllama: { live: e.reachable, models: e.freeModels, endpoint: e.endpoint },
      openrouterFree: { configured: e.openrouterFree },
      onDeviceBrowser: { live: true },
      localKB: { live: true },
    },
    mode: e.mode,
  })
}

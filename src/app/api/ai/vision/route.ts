// ─────────────────────────────────────────────────────────────────────────────
//  /api/ai/vision — FREE multimodal image understanding via local Ollama
//  (Gemma 4 / Qwen 3.5 / Ministral 3). No key, no cloud. Upload an image and
//  get a real description. This is a new "Infinite AI" capability.
//  ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { callOllamaVision } from '../../../../lib/freeModels'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData().catch(() => null)
    if (!form) return NextResponse.json({ ok: false, error: 'Expected multipart form-data' }, { status: 400 })

    const file = form.get('image') as File | null
    const prompt = (form.get('prompt') as string) || 'Describe this image in detail for a business context. Mention any products, text, brands, people, or settings you see.'
    const model = (form.get('model') as string) || 'gemma4:latest'

    if (!file) return NextResponse.json({ ok: false, error: 'image field is required' }, { status: 400 })

    const buf = Buffer.from(await file.arrayBuffer())
    const base64 = buf.toString('base64')

    const description = await callOllamaVision(prompt, base64, model, 45000)
    return NextResponse.json({ ok: true, description, model, source: 'ollama' })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err), source: 'ollama' }, { status: 500 })
  }
}

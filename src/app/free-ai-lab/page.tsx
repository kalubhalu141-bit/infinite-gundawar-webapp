'use client'

import Navbar from '@/components/Navbar'
import PageEnhancements from '@/components/PageEnhancements'
import Footer from '@/components/Footer'
import EntityExtractor from '@/components/EntityExtractor'
import AIGenerator from '@/components/AIGenerator'
import ImageAI from '@/components/ImageAI'
import VoiceChat from '@/components/VoiceChat'
import SemanticSearch from '@/components/SemanticSearch'

export default function FreeAILabPage() {
  return (
    <>
      <Navbar />
      <PageEnhancements />
      <section className="section-pad">
        <div className="container-x">
          <div className="eyebrow">Free AI Lab · 100% On-Device · Zero Keys</div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', margin: '12px 0 6px' }}>
            The <span className="text-gradient">Free AI Lab</span>
          </h1>
          <p style={{ color: 'var(--muted)', maxWidth: 760, fontSize: 18, lineHeight: 1.6 }}>
            A playground of every FREE model bundled in this app — all running in your browser via
            transformers.js (WebGPU/WASM). No API keys, no server, your data never leaves the device.
            New this round: <b>NER</b>, <b>text generation</b>, <b>fill-mask</b>, and <b>vision AI</b> (caption + classify).
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 18, marginTop: 24 }}>
            <EntityExtractor />
            <AIGenerator />
            <ImageAI />
            <VoiceChat />
            <SemanticSearch />
          </div>

          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 22 }}>
            First use of a model downloads its ONNX weights from the Hugging Face CDN (cached afterwards).
            Models: bert-base-NER, distilgpt2, bert-base-uncased, vit-gpt2-image-captioning, vit-base-patch16-224,
            plus the 10 core models on the <a href="/infinite-features" style={{ color: 'var(--accent)' }}>Infinite Features</a> page.
          </p>
        </div>
      </section>
      <Footer />
    </>
  )
}

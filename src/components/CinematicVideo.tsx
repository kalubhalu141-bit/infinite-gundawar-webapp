'use client'

import { useEffect, useRef } from 'react'

const THEMES: Record<string, { colors: string[]; label: string }> = {
  ai: { colors: ['#7c3aed', '#3b82f6', '#06b6d4'], label: 'AI Neural Network' },
  business: { colors: ['#f59e0b', '#ef4444', '#f97316'], label: 'Business Growth' },
  finance: { colors: ['#10b981', '#059669', '#34d399'], label: 'Financial Markets' },
  property: { colors: ['#3b82f6', '#06b6d4', '#0ea5e9'], label: 'Real Estate 3D' },
  interior: { colors: ['#a855f7', '#ec4899', '#f472b6'], label: 'Interior Design' },
  health: { colors: ['#ef4444', '#f43f5e', '#fb7185'], label: 'Health & Wellness' },
  education: { colors: ['#6366f1', '#8b5cf6', '#a78bfa'], label: 'Education' },
  marketing: { colors: ['#f97316', '#eab308', '#fbbf24'], label: 'Marketing' },
  career: { colors: ['#0ea5e9', '#06b6d4', '#22d3ee'], label: 'Career Growth' },
  happiness: { colors: ['#fbbf24', '#f59e0b', '#f97316'], label: 'Happiness' },
  ayurveda: { colors: ['#22c55e', '#84cc16', '#a3e635'], label: 'Ayurveda' },
  herb: { colors: ['#16a34a', '#22c55e', '#4ade80'], label: 'Herb Garden' },
  investment: { colors: ['#0d9488', '#14b8a6', '#2dd4bf'], label: 'Investment' },
  default: { colors: ['#3b82f6', '#8b5cf6', '#06b6d4'], label: 'Innovation' },
}

export default function CinematicVideo({ theme = 'default' }: { theme?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const config = THEMES[theme] || THEMES.default

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let w = 0
    let h = 0

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (!rect) return
      w = canvas.width = rect.width
      h = canvas.height = rect.height
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: { x: number; y: number; z: number; vx: number; vy: number; vz: number; size: number; color: string }[] = []
    const count = 80
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 500 + 100,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 3 + 1,
        color: config.colors[i % config.colors.length],
      })
    }

    const shapes: { x: number; y: number; z: number; rot: number; rotSpeed: number; size: number }[] = []
    for (let i = 0; i < 6; i++) {
      shapes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 400 + 200,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        size: Math.random() * 40 + 20,
      })
    }

    const project = (x: number, y: number, z: number) => {
      const fov = 500
      const scale = fov / (fov + z)
      return { x: (x - w / 2) * scale + w / 2, y: (y - h / 2) * scale + h / 2, scale }
    }

    const drawCube = (cx: number, cy: number, cz: number, size: number, rot: number) => {
      const s = size / 2
      const vertices = [
        [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
        [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s],
      ]
      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
      ]
      const projected = vertices.map(([vx, vy, vz]) => {
        const rx = vx * Math.cos(rot) - vz * Math.sin(rot)
        const rz = vx * Math.sin(rot) + vz * Math.cos(rot)
        const ry = vy * Math.cos(rot * 0.7) - rz * Math.sin(rot * 0.7)
        const rz2 = vy * Math.sin(rot * 0.7) + rz * Math.cos(rot * 0.7)
        return project(cx + rx, cy + ry, cz + rz2)
      })
      ctx.strokeStyle = config.colors[0] + '60'
      ctx.lineWidth = 1
      edges.forEach(([a, b]) => {
        ctx.beginPath()
        ctx.moveTo(projected[a].x, projected[a].y)
        ctx.lineTo(projected[b].x, projected[b].y)
        ctx.stroke()
      })
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.15)'
      ctx.fillRect(0, 0, w, h)

      ctx.strokeStyle = config.colors[1] + '15'
      ctx.lineWidth = 0.5
      const gridSize = 60
      const time = Date.now() * 0.0003
      for (let x = 0; x < w; x += gridSize) {
        const offset = Math.sin(time + x * 0.01) * 10
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x + offset, h)
        ctx.stroke()
      }
      for (let y = 0; y < h; y += gridSize) {
        const offset = Math.cos(time + y * 0.01) * 10
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y + offset)
        ctx.stroke()
      }

      shapes.forEach(shape => {
        shape.rot += shape.rotSpeed
        shape.z -= 0.5
        if (shape.z < 50) { shape.z = 500; shape.x = Math.random() * w; shape.y = Math.random() * h }
        const p = project(shape.x, shape.y, shape.z)
        drawCube(shape.x, shape.y, shape.z, shape.size * p.scale, shape.rot)
      })

      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.z += p.vz
        if (p.z < 50) p.z = 600
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0
        const proj = project(p.x, p.y, p.z)
        const alpha = Math.max(0.2, 1 - p.z / 600)
        ctx.beginPath()
        ctx.arc(proj.x, proj.y, p.size * proj.scale, 0, Math.PI * 2)
        ctx.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, '0')
        ctx.fill()
      })

      ctx.strokeStyle = config.colors[0] + '20'
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            const pi = project(particles[i].x, particles[i].y, particles[i].z)
            const pj = project(particles[j].x, particles[j].y, particles[j].z)
            ctx.beginPath()
            ctx.moveTo(pi.x, pi.y)
            ctx.lineTo(pj.x, pj.y)
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(animate)
    }

    animate()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [theme])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/80" />
      <div className="absolute bottom-4 right-4 text-xs text-white/30 font-mono tracking-wider">
        3D • {config.label}
      </div>
    </div>
  )
}

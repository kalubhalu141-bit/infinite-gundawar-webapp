'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export interface Pillar {
  id: string
  title: string
  color: number
  blurb: string
}

interface Props {
  pillars: Pillar[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export default function PillarsScene({ pillars, selectedId, onSelect }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const prefersReduced =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = mount.clientWidth || 1
    let height = mount.clientHeight || 1

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000)
    camera.position.set(0, 1.5, 11)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    mount.appendChild(renderer.domElement)
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.cursor = 'grab'

    scene.add(new THREE.AmbientLight(0xffffff, 0.65))
    const p1 = new THREE.PointLight(0xffb347, 2.4, 200); p1.position.set(8, 10, 10); scene.add(p1)
    const p2 = new THREE.PointLight(0x38bdf8, 1.8, 200); p2.position.set(-10, 4, 8); scene.add(p2)

    // makeLabel helper (string-built above to avoid SSR issues)
    const makeLabel = (text: string, hex: string) => {
      const c = document.createElement('canvas')
      c.width = 512; c.height = 256
      const ctx = c.getContext('2d')!
      ctx.clearRect(0, 0, c.width, c.height)
      ctx.font = 'bold 44px ui-sans-serif, system-ui, sans-serif'
      ctx.fillStyle = hex
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const words = text.split(' ')
      const lines: string[] = []
      let line = ''
      for (const w of words) {
        if ((line + ' ' + w).trim().length > 14) { lines.push(line.trim()); line = w }
        else line = (line + ' ' + w).trim()
      }
      if (line) lines.push(line)
      lines.forEach((ln, i) => ctx.fillText(ln, 256, 128 + (i - (lines.length - 1) / 2) * 52))
      const tex = new THREE.CanvasTexture(c)
      tex.anisotropy = 4
      return tex
    }

    const group = new THREE.Group()
    scene.add(group)

    const radius = 4.4
    const meshes: THREE.Mesh[] = []
    pillars.forEach((p, i) => {
      const angle = (i / pillars.length) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius

      const h = 2.6 + (i % 2) * 0.6
      const geo = new THREE.BoxGeometry(2.4, h, 0.5)
      const mat = new THREE.MeshStandardMaterial({
        color: p.color,
        emissive: p.color,
        emissiveIntensity: 0.35,
        metalness: 0.5,
        roughness: 0.3,
        transparent: true,
        opacity: 0.92,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(x, 0, z)
      mesh.lookAt(0, 0, 0)
      mesh.userData = { id: p.id, baseY: 0, index: i }
      group.add(mesh)
      meshes.push(mesh)

      // label plane in front
      const labelTex = makeLabel(p.title, '#ffffff')
      const labelMat = new THREE.MeshBasicMaterial({ map: labelTex, transparent: true })
      const label = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.2), labelMat)
      label.position.set(x, h / 2 + 0.9, z)
      label.lookAt(0, h / 2 + 0.9, 0)
      group.add(label)
    })

    // pointer interaction
    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    let downPos: { x: number; y: number } | null = null

    const onDown = (e: PointerEvent) => { downPos = { x: e.clientX, y: e.clientY } }
    const onUp = (e: PointerEvent) => {
      if (!downPos) return
      const moved = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y)
      downPos = null
      if (moved > 6) return // it was a drag
      const rect = renderer.domElement.getBoundingClientRect()
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(ndc, camera)
      const hit = raycaster.intersectObjects(meshes, false)[0]
      if (hit) onSelectRef.current(hit.object.userData.id as string)
    }
    renderer.domElement.addEventListener('pointerdown', onDown)
    renderer.domElement.addEventListener('pointerup', onUp)

    // drag to rotate
    let dragging = false
    let lastX = 0
    const onPDragStart = (e: PointerEvent) => { dragging = true; lastX = e.clientX; renderer.domElement.style.cursor = 'grabbing' }
    const onPDragMove = (e: PointerEvent) => { if (dragging) { group.rotation.y += (e.clientX - lastX) * 0.005; lastX = e.clientX } }
    const onPDragEnd = () => { dragging = false; renderer.domElement.style.cursor = 'grab' }
    renderer.domElement.addEventListener('pointerdown', onPDragStart)
    window.addEventListener('pointermove', onPDragMove)
    window.addEventListener('pointerup', onPDragEnd)

    const onResize = () => {
      if (!mount) return
      width = mount.clientWidth || 1
      height = mount.clientHeight || 1
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', onResize)

    let raf = 0
    const clock = new THREE.Clock()
    const renderFrame = () => {
      const t = clock.getElapsedTime()
      if (!dragging && !prefersReduced) group.rotation.y += 0.0022
      // selection emphasis
      meshes.forEach((m) => {
        const isSel = m.userData.id === selectedIdRef.current
        const target = isSel ? 1.18 : 1
        m.scale.lerp(new THREE.Vector3(target, target, target), 0.08)
        const mat = m.material as THREE.MeshStandardMaterial
        const targetEm = isSel ? 0.85 : 0.35
        mat.emissiveIntensity += (targetEm - mat.emissiveIntensity) * 0.08
      })
      camera.position.y = 1.5 + Math.sin(t * 0.3) * 0.25
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
    }

    // keep selectedId in a ref for the render loop
    const selectedIdRef = { current: selectedId }
    const selectedIdRaf = setInterval(() => { selectedIdRef.current = selectedId }, 100)

    if (prefersReduced) renderFrame()
    else {
      const loop = () => { renderFrame(); raf = requestAnimationFrame(loop) }
      loop()
    }

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(selectedIdRaf)
      window.removeEventListener('pointermove', onPDragMove)
      window.removeEventListener('pointerup', onPDragEnd)
      window.removeEventListener('resize', onResize)
      meshes.forEach((m) => {
        m.geometry.dispose()
        ;(m.material as THREE.Material).dispose()
      })
      group.traverse((o) => {
        const mesh = o as THREE.Mesh
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshBasicMaterial
          if (mat.map) mat.map.dispose()
        }
      })
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [pillars])

  return <div ref={mountRef} aria-hidden="true" style={{ position: 'absolute', inset: 0 }} />
}

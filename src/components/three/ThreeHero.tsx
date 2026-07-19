'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * ThreeHero — a self-contained 3D hero scene.
 * - Wireframe "infinite" icosahedron globe (gold) rotating slowly.
 * - Inner glowing solid sphere (cyan).
 * - Floating particle starfield.
 * - Mouse parallax. Reduced-motion safe (renders a single static frame).
 * Runs only in the browser; cleans up WebGL + listeners on unmount.
 */
export default function ThreeHero() {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = mount.clientWidth || 1
    let height = mount.clientHeight || 1

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
    camera.position.set(0, 0, 6)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    mount.appendChild(renderer.domElement)
    renderer.domElement.style.display = 'block'

    // ── Lights ──
    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const key = new THREE.PointLight(0xffb347, 2.2, 100)
    key.position.set(6, 6, 8)
    scene.add(key)
    const fill = new THREE.PointLight(0x38bdf8, 1.8, 100)
    fill.position.set(-8, -4, 6)
    scene.add(fill)

    // ── Inner solid glowing sphere ──
    const coreGeo = new THREE.IcosahedronGeometry(1.55, 4)
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0b1120,
      emissive: 0x123a52,
      emissiveIntensity: 0.9,
      metalness: 0.6,
      roughness: 0.25,
    })
    const core = new THREE.Mesh(coreGeo, coreMat)
    scene.add(core)

    // ── Outer wireframe globe (the "infinite" shell) ──
    const shellGeo = new THREE.IcosahedronGeometry(2.35, 2)
    const shellMat = new THREE.MeshBasicMaterial({ color: 0xffb347, wireframe: true, transparent: true, opacity: 0.55 })
    const shell = new THREE.Mesh(shellGeo, shellMat)
    scene.add(shell)

    // ── Particle starfield ──
    const COUNT = 1400
    const positions = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const r = 7 + Math.random() * 26
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const pMat = new THREE.PointsMaterial({ color: 0x9fd8ff, size: 0.07, transparent: true, opacity: 0.8 })
    const stars = new THREE.Points(pGeo, pMat)
    scene.add(stars)

    // ── Mouse parallax ──
    const mouse = { x: 0, y: 0 }
    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    if (!prefersReduced) window.addEventListener('mousemove', onMove)

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
      shell.rotation.y = t * 0.12
      shell.rotation.x = t * 0.05
      core.rotation.y = -t * 0.18
      stars.rotation.y = t * 0.02
      // parallax
      const tx = mouse.x * 0.5
      const ty = -mouse.y * 0.4
      camera.position.x += (tx - camera.position.x) * 0.04
      camera.position.y += (ty - camera.position.y) * 0.04
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
    }

    if (prefersReduced) {
      renderFrame()
    } else {
      const loop = () => {
        renderFrame()
        raf = requestAnimationFrame(loop)
      }
      loop()
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      coreGeo.dispose()
      coreMat.dispose()
      shellGeo.dispose()
      shellMat.dispose()
      pGeo.dispose()
      pMat.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
    />
  )
}

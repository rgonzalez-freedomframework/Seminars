'use client'

import React, { useEffect, useRef } from 'react'

type ExecutiveBackgroundProps = {
  className?: string
}

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
}

const MAX_DPR = 1.2
const MOBILE_BREAKPOINT = 768

export const ExecutiveBackground: React.FC<ExecutiveBackgroundProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []
    let width = 0
    let height = 0
    let t = 0
    let baseGradient: CanvasGradient | null = null
    let lastTime = typeof performance !== 'undefined' ? performance.now() : 0
    let lastRenderTime = lastTime

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const isMobile = () =>
      typeof window !== 'undefined' &&
      (window.innerWidth || 0) < MOBILE_BREAKPOINT

    const resizeCanvas = () => {
      const parent = canvas.parentElement
      const rect = parent?.getBoundingClientRect() || canvas.getBoundingClientRect()

      width = rect.width
      height = rect.height

      const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, MAX_DPR)

      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      initScene()
    }

    const initScene = () => {
      const mobile = isMobile()

      // Node count for the molecular/network effect
      const particleCount = mobile ? 16 : 32

      particles = []

      // Initialize nodes (particles) with slow drift
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (mobile ? 0.04 : 0.06),
          vy: (Math.random() - 0.5) * (mobile ? 0.04 : 0.06),
          radius: (mobile ? 1.2 : 1.6) + Math.random() * (mobile ? 0.8 : 1.2),
          alpha: 0.3 + Math.random() * 0.4,
        })
      }
    }

    const drawStaticGradient = () => {
      ctx.clearRect(0, 0, width, height)

      if (!baseGradient) {
        baseGradient = ctx.createLinearGradient(0, 0, width, height)
        baseGradient.addColorStop(0, 'rgba(10, 25, 47, 0.95)')
        baseGradient.addColorStop(0.5, 'rgba(15, 36, 77, 0.8)')
        baseGradient.addColorStop(1, 'rgba(3, 16, 36, 0.95)')
      }

      ctx.fillStyle = baseGradient
      ctx.fillRect(0, 0, width, height)
    }

    const updateParticles = (delta: number) => {
      const driftFactor = isMobile() ? 0.4 : 0.6
      for (const p of particles) {
        p.x += p.vx * delta * 60 * driftFactor
        p.y += p.vy * delta * 60 * driftFactor

        if (p.x < -20) p.x = width + 20
        if (p.x > width + 20) p.x = -20
        if (p.y < -20) p.y = height + 20
        if (p.y > height + 20) p.y = -20
      }
    }

    const drawParticles = () => {
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'

      for (const p of particles) {
        // Soft outer glow
        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.radius * 6,
        )
        gradient.addColorStop(0, 'rgba(252, 211, 77, 0.85)') // gold core
        gradient.addColorStop(0.4, 'rgba(252, 211, 77, 0.35)')
        gradient.addColorStop(1, 'rgba(15, 23, 42, 0)')

        ctx.globalAlpha = p.alpha
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2)
        ctx.fill()

        // Solid inner node
        ctx.globalAlpha = 0.9
        ctx.fillStyle = '#facc15'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 1.2, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
      ctx.restore()
    }

    const updateLines = (delta: number) => {
      // Time parameter for subtle breathing in the network
      t += delta * 0.25
    }

    const drawLines = () => {
      ctx.save()
      ctx.lineWidth = 1
      ctx.lineCap = 'round'
      ctx.globalCompositeOperation = 'screen'

      const maxDistance = Math.min(width, height) * 0.22
      const mobile = isMobile()

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p1.x + Math.sin(t * 0.5 + i * 0.3) * 4 - (p2.x + Math.sin(t * 0.5 + j * 0.3) * 4)
          const dy = p1.y + Math.cos(t * 0.4 + i * 0.3) * 4 - (p2.y + Math.cos(t * 0.4 + j * 0.3) * 4)
          const distSq = dx * dx + dy * dy

          if (distSq > maxDistance * maxDistance) continue

          const dist = Math.sqrt(distSq)
          const strength = 1 - dist / maxDistance
          const alpha = (mobile ? 0.28 : 0.4) * strength

          ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.stroke()
        }
      }

      ctx.restore()
    }

    const render = () => {
      const now = typeof performance !== 'undefined' ? performance.now() : 0
      const delta = Math.min((now - lastTime) / 1000, 0.05) || 0.016
      lastTime = now

      // Soft cap FPS to reduce work on slower devices
      const frameInterval = 1000 / 28 // ~28 FPS
      if (now - lastRenderTime < frameInterval) {
        animationFrameId = window.requestAnimationFrame(render)
        return
      }
      lastRenderTime = now

      ctx.clearRect(0, 0, width, height)

      // Base navy gradient background (reused for performance)
      if (!baseGradient) {
        baseGradient = ctx.createLinearGradient(0, 0, width, height)
        baseGradient.addColorStop(0, 'rgba(4, 18, 40, 1)')
        baseGradient.addColorStop(0.5, 'rgba(12, 32, 70, 0.95)')
        baseGradient.addColorStop(1, 'rgba(2, 10, 24, 1)')
      }
      ctx.fillStyle = baseGradient
      ctx.fillRect(0, 0, width, height)

      updateParticles(delta)
      drawParticles()

      updateLines(delta)
      drawLines()

      animationFrameId = window.requestAnimationFrame(render)
    }

    resizeCanvas()

    if (prefersReducedMotion) {
      drawStaticGradient()
      return () => {
        // nothing to clean beyond default
      }
    }

    const handleResize = () => {
      resizeCanvas()
    }

    window.addEventListener('resize', handleResize)
    animationFrameId = window.requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  const wrapperClassName = className
    ? `${className} pointer-events-none`
    : 'absolute inset-0 pointer-events-none'

  return (
    <div className={wrapperClassName} aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}

export default ExecutiveBackground

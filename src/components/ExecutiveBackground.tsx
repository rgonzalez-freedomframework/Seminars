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
  pulseOffset: number // For staggered pulsing effect
}

const MAX_DPR = 1.2
const MOBILE_BREAKPOINT = 768

export const ExecutiveBackground: React.FC<ExecutiveBackgroundProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      console.log('ExecutiveBackground: No canvas ref')
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.log('ExecutiveBackground: No context')
      return
    }

    console.log('ExecutiveBackground: Initializing animation')
    
    // Immediately fill with warm greige background
    ctx.fillStyle = '#F6F7F4'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

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
    
    console.log('ExecutiveBackground: Prefers reduced motion:', prefersReducedMotion)

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

      // Node count for organic network effect
      const particleCount = mobile ? 16 : 32

      particles = []

      console.log('ExecutiveBackground: Creating', particleCount, 'particles')

      // Initialize nodes with slow drift and staggered pulse timing
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (mobile ? 0.5 : 0.8),
          vy: (Math.random() - 0.5) * (mobile ? 0.5 : 0.8),
          radius: (mobile ? 1.2 : 1.6) + Math.random() * (mobile ? 0.8 : 1.2),
          alpha: 0.3 + Math.random() * 0.4,
          pulseOffset: i * 0.4, // Staggered pulsing
        })
      }
      
      console.log('ExecutiveBackground: Particles created:', particles.length)
    }

    const drawStaticGradient = () => {
      ctx.clearRect(0, 0, width, height)

      if (!baseGradient) {
        baseGradient = ctx.createLinearGradient(0, 0, width, height)
        baseGradient.addColorStop(0, '#F6F7F4')
        baseGradient.addColorStop(0.5, '#F5F6F3')
        baseGradient.addColorStop(1, '#F7F8F5')
      }

      ctx.fillStyle = baseGradient
      ctx.fillRect(0, 0, width, height)
    }

    const updateParticles = (delta: number) => {
      const driftFactor = isMobile() ? 2.5 : 3.0
      for (const p of particles) {
        p.x += p.vx * delta * 60 * driftFactor
        p.y += p.vy * delta * 60 * driftFactor

        // Wrap around edges
        if (p.x < -20) p.x = width + 20
        if (p.x > width + 20) p.x = -20
        if (p.y < -20) p.y = height + 20
        if (p.y > height + 20) p.y = -20
      }
    }

    const drawParticles = () => {
      ctx.save()
      ctx.globalCompositeOperation = 'source-over'

      for (const p of particles) {
        // Enhanced pulsing effect - more pronounced and smooth
        const pulse = Math.sin(t * 1.5 + p.pulseOffset) * 0.5 + 0.5 // 0 to 1
        const pulseScale = 1 + pulse * 0.35 // Scale from 1.0 to 1.35
        const pulseAlpha = 0.15 + pulse * 0.15 // Alpha variation
        
        // Soft outer glow with warm graphite - pulsing
        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.radius * 7 * pulseScale,
        )
        gradient.addColorStop(0, `rgba(40, 38, 34, ${0.22 + pulseAlpha})`)
        gradient.addColorStop(0.4, `rgba(40, 38, 34, ${0.11 + pulseAlpha * 0.5})`)
        gradient.addColorStop(1, 'rgba(40, 38, 34, 0)')

        ctx.globalAlpha = p.alpha
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 4 * pulseScale, 0, Math.PI * 2)
        ctx.fill()

        // Solid inner node with warm graphite - also pulsing
        ctx.globalAlpha = 1
        ctx.fillStyle = `rgba(40, 38, 34, ${0.35 + pulse * 0.15})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 1.4 * pulseScale, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
      ctx.restore()
    }

    const updateLines = (delta: number) => {
      // Time parameter for pulsing animation
      t += delta * 0.8
    }

    const drawLines = () => {
      ctx.save()
      ctx.lineWidth = 1
      ctx.lineCap = 'round'
      ctx.globalCompositeOperation = 'source-over'

      const maxDistance = Math.min(width, height) * 0.22
      const mobile = isMobile()

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distSq = dx * dx + dy * dy

          if (distSq > maxDistance * maxDistance) continue

          const dist = Math.sqrt(distSq)
          const strength = 1 - dist / maxDistance
          const alpha = (mobile ? 0.12 : 0.15) * strength

          ctx.strokeStyle = `rgba(40, 38, 34, ${alpha})`
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

      // Increase FPS for smoother animation
      const frameInterval = 1000 / 45 // ~45 FPS
      if (now - lastRenderTime < frameInterval) {
        animationFrameId = window.requestAnimationFrame(render)
        return
      }
      lastRenderTime = now

      ctx.clearRect(0, 0, width, height)

      // Base warm greige gradient background (reused for performance)
      if (!baseGradient) {
        baseGradient = ctx.createLinearGradient(0, 0, width, height)
        baseGradient.addColorStop(0, '#F6F7F4')
        baseGradient.addColorStop(0.5, '#F5F6F3')
        baseGradient.addColorStop(1, '#F7F8F5')
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
      console.log('ExecutiveBackground: Using static gradient (reduced motion)')
      drawStaticGradient()
      return () => {
        // nothing to clean beyond default
      }
    }

    console.log('ExecutiveBackground: Starting animation loop')

    const handleResize = () => {
      resizeCanvas()
    }

    window.addEventListener('resize', handleResize)
    animationFrameId = window.requestAnimationFrame(render)

    return () => {
      console.log('ExecutiveBackground: Cleaning up')
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
    <div className={wrapperClassName} aria-hidden="true" style={{ backgroundColor: '#F6F7F4' }}>
      <canvas ref={canvasRef} className="h-full w-full" style={{ backgroundColor: '#F6F7F4' }} />
    </div>
  )
}

export default ExecutiveBackground

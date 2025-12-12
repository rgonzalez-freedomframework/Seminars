'use client'

import React, { useEffect, useRef } from 'react'

type ExecutiveBackgroundProps = {
  className?: string
}

type Particle = {
  x: number
  y: number
  baseX: number // Grid anchor point X
  baseY: number // Grid anchor point Y
  vx: number
  vy: number
  radius: number
  alpha: number
  pulseOffset: number // For staggered pulsing
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

      // Structured grid layout for framework feel
      const cols = mobile ? 4 : 6
      const rows = mobile ? 5 : 6
      const particleCount = cols * rows

      particles = []

      console.log('ExecutiveBackground: Creating structured grid:', cols, 'x', rows, '=', particleCount, 'particles')

      // Create particles in grid pattern with slight randomization
      const paddingX = width * 0.1
      const paddingY = height * 0.1
      const gridWidth = width - paddingX * 2
      const gridHeight = height - paddingY * 2
      const cellWidth = gridWidth / (cols - 1)
      const cellHeight = gridHeight / (rows - 1)

      let index = 0
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const baseX = paddingX + col * cellWidth
          const baseY = paddingY + row * cellHeight
          
          // Add subtle randomness to grid positions
          const offsetX = (Math.random() - 0.5) * cellWidth * 0.15
          const offsetY = (Math.random() - 0.5) * cellHeight * 0.15

          particles.push({
            x: baseX + offsetX,
            y: baseY + offsetY,
            baseX: baseX,
            baseY: baseY,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            radius: (mobile ? 1.2 : 1.6) + Math.random() * (mobile ? 0.6 : 1.0),
            alpha: 0.3 + Math.random() * 0.3,
            pulseOffset: index * 0.3,
          })
          index++
        }
      }
      
      console.log('ExecutiveBackground: Grid particles created:', particles.length)
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
      // Gentle oscillation around grid anchor points
      const oscillationRadius = isMobile() ? 15 : 20
      const returnForce = 0.05 // Pulls particles back to grid position
      
      for (const p of particles) {
        // Calculate distance from base position
        const dx = p.x - p.baseX
        const dy = p.y - p.baseY
        
        // Apply gentle spring force back to grid position
        p.vx -= dx * returnForce
        p.vy -= dy * returnForce
        
        // Apply damping to prevent too much movement
        p.vx *= 0.95
        p.vy *= 0.95
        
        // Update position with constrained movement
        p.x += p.vx
        p.y += p.vy
        
        // Constrain to oscillation radius around base position
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > oscillationRadius) {
          const angle = Math.atan2(dy, dx)
          p.x = p.baseX + Math.cos(angle) * oscillationRadius
          p.y = p.baseY + Math.sin(angle) * oscillationRadius
        }
      }
    }

    const drawParticles = () => {
      ctx.save()
      ctx.globalCompositeOperation = 'source-over'

      for (const p of particles) {
        // Gentle pulsing effect for framework nodes
        const pulseScale = 1 + Math.sin(t + p.pulseOffset) * 0.15
        
        // Soft outer glow with warm graphite
        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.radius * 6 * pulseScale,
        )
        gradient.addColorStop(0, 'rgba(40, 38, 34, 0.18)')
        gradient.addColorStop(0.4, 'rgba(40, 38, 34, 0.09)')
        gradient.addColorStop(1, 'rgba(40, 38, 34, 0)')

        ctx.globalAlpha = p.alpha
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 3.5 * pulseScale, 0, Math.PI * 2)
        ctx.fill()

        // Solid inner node with warm graphite
        ctx.globalAlpha = 1
        ctx.fillStyle = 'rgba(40, 38, 34, 0.3)'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 1.2 * pulseScale, 0, Math.PI * 2)
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
      ctx.globalCompositeOperation = 'source-over'

      // Draw structured pathways between nearby grid neighbors
      const maxDistance = Math.min(width, height) * 0.25
      const mobile = isMobile()

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          
          // Use base grid positions for connection logic (more structured)
          const baseDistSq = (p1.baseX - p2.baseX) ** 2 + (p1.baseY - p2.baseY) ** 2
          
          // Only connect nearby grid neighbors for framework pattern
          if (baseDistSq > maxDistance * maxDistance) continue

          // Use actual positions for drawing
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const strength = 1 - dist / maxDistance
          
          // Subtle pulsing on connections
          const pulseAlpha = 0.7 + Math.sin(t * 0.6 + (i + j) * 0.2) * 0.3
          const alpha = (mobile ? 0.14 : 0.17) * strength * pulseAlpha

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

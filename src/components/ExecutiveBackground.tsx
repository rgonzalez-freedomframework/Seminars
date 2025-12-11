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

type FlowLine = {
  x: number
  speedX: number
  amplitude: number
  phase: number
  alpha: number
}

const MAX_DPR = 1.5
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
    let lines: FlowLine[] = []
    let width = 0
    let height = 0
    let t = 0
    let lastTime = typeof performance !== 'undefined' ? performance.now() : 0

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

      const particleCount = mobile ? 12 : 28
      const lineCount = mobile ? 2 : 4

      particles = []
      lines = []

      // Initialize particles
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (mobile ? 0.08 : 0.12),
          vy: (Math.random() - 0.5) * (mobile ? 0.08 : 0.12),
          radius: Math.random() * 1.2 + 0.6,
          alpha: Math.random() * 0.35 + 0.15,
        })
      }

      // Initialize flow lines
      for (let i = 0; i < lineCount; i++) {
        const baseX = (width / lineCount) * i + (width / lineCount) * 0.5
        lines.push({
          x: baseX + (Math.random() - 0.5) * (width * 0.1),
          speedX: (Math.random() - 0.5) * (mobile ? 0.02 : 0.04),
          amplitude: (mobile ? 12 : 20) + Math.random() * (mobile ? 8 : 15),
          phase: Math.random() * Math.PI * 2,
          alpha: 0.08 + Math.random() * 0.08,
        })
      }
    }

    const drawStaticGradient = () => {
      ctx.clearRect(0, 0, width, height)

      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, 'rgba(10, 25, 47, 0.95)')
      gradient.addColorStop(0.5, 'rgba(15, 36, 77, 0.8)')
      gradient.addColorStop(1, 'rgba(3, 16, 36, 0.95)')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
    }

    const updateParticles = (delta: number) => {
      for (const p of particles) {
        p.x += p.vx * delta * 60
        p.y += p.vy * delta * 60

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
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4)
        gradient.addColorStop(0, `rgba(173, 201, 255, ${p.alpha})`)
        gradient.addColorStop(1, 'rgba(173, 201, 255, 0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    }

    const updateLines = (delta: number) => {
      const baseSpeedFactor = isMobile() ? 0.6 : 1
      for (const line of lines) {
        line.x += line.speedX * delta * 60 * baseSpeedFactor

        const margin = width * 0.2
        if (line.x < -margin) line.x = width + margin
        if (line.x > width + margin) line.x = -margin
      }

      t += delta * 0.4
    }

    const drawLines = () => {
      ctx.save()
      ctx.lineWidth = 1.2
      ctx.lineCap = 'round'
      ctx.globalCompositeOperation = 'screen'

      for (const line of lines) {
        const waveOffset = Math.sin(t + line.phase) * line.amplitude
        const x = line.x + waveOffset

        const topY = -height * 0.2
        const bottomY = height * 1.2
        const ctrlOffsetX = line.amplitude * 0.4

        const gradient = ctx.createLinearGradient(x - 40, topY, x + 40, bottomY)
        gradient.addColorStop(0, `rgba(99, 179, 237, ${line.alpha})`)
        gradient.addColorStop(0.5, `rgba(56, 189, 248, ${line.alpha * 1.4})`)
        gradient.addColorStop(1, `rgba(30, 64, 175, ${line.alpha})`)

        ctx.strokeStyle = gradient
        ctx.beginPath()
        ctx.moveTo(x, topY)
        ctx.bezierCurveTo(
          x + ctrlOffsetX,
          height * 0.25,
          x - ctrlOffsetX,
          height * 0.75,
          x,
          bottomY,
        )
        ctx.stroke()
      }

      ctx.restore()
    }

    const render = () => {
      const now = typeof performance !== 'undefined' ? performance.now() : 0
      const delta = Math.min((now - lastTime) / 1000, 0.05) || 0.016
      lastTime = now

      ctx.clearRect(0, 0, width, height)

      // Base navy gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, 'rgba(4, 18, 40, 1)')
      gradient.addColorStop(0.5, 'rgba(12, 32, 70, 0.95)')
      gradient.addColorStop(1, 'rgba(2, 10, 24, 1)')
      ctx.fillStyle = gradient
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

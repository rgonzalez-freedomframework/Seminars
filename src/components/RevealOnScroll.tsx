'use client'

import React, { useEffect, useRef, useState } from 'react'

type RevealOnScrollProps = {
  children: React.ReactNode
  className?: string
  /** Additional delay (ms) before revealing once in view */
  delay?: number
  /** IntersectionObserver threshold, default ~15% */
  threshold?: number
  /** If true, adds a very subtle glow when revealed */
  glow?: boolean
}

export function RevealOnScroll({
  children,
  className = '',
  delay = 0,
  threshold = 0.15,
  glow = false,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) {
      setIsVisible(true)
      return
    }

    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return
    }

    let timeoutId: number | undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target !== node) return

          if (glow) {
            // In glow mode, toggle visibility based on viewport presence
            setIsVisible(entry.isIntersecting)
          } else if (entry.isIntersecting) {
            // Non-glow mode: one-time reveal with optional delay
            if (delay > 0) {
              timeoutId = window.setTimeout(() => setIsVisible(true), delay)
            } else {
              setIsVisible(true)
            }
            observer.disconnect()
          }
        })
      },
      { threshold },
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [delay, threshold, glow])

  const baseClasses = glow
    ? 'transition-all duration-700 ease-out'
    : 'transition-all duration-700 ease-out will-change-transform will-change-opacity'

  const visibilityClasses = glow
    ? ''
    : isVisible
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 translate-y-4'

  const glowClasses = glow && isVisible ? 'drop-shadow-[0_18px_55px_rgba(29,42,56,0.28)]' : ''

  const combined = [baseClasses, visibilityClasses, glowClasses, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={ref} className={combined}>
      {children}
    </div>
  )
}

export default RevealOnScroll

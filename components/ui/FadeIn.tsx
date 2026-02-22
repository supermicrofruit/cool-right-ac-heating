'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'

interface FadeInProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
  className?: string
}

const directionStyles = {
  up: 'translate-y-6',
  down: '-translate-y-6',
  left: 'translate-x-6',
  right: '-translate-x-6',
  none: '',
}

function useFadeIn(delay: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Check prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay * 1000)
          } else {
            setIsVisible(true)
          }
          observer.unobserve(el)
        }
      },
      { rootMargin: '-40px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return { ref, isVisible }
}

export default function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.5,
  className,
}: FadeInProps) {
  const { ref, isVisible } = useFadeIn(delay)

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${isVisible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${directionStyles[direction]}`} ${className || ''}`}
      style={{ transitionDuration: `${duration}s` }}
    >
      {children}
    </div>
  )
}

export function FadeInStagger({
  children,
  index,
  direction = 'up',
  className,
}: {
  children: ReactNode
  index: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  className?: string
}) {
  const { ref, isVisible } = useFadeIn(index * 0.08)

  return (
    <div
      ref={ref}
      className={`transition-all duration-[400ms] ease-out ${isVisible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${directionStyles[direction]}`} ${className || ''}`}
    >
      {children}
    </div>
  )
}

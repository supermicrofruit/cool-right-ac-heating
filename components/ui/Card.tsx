'use client'

import { HTMLAttributes, forwardRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  variant?: 'elevated' | 'bordered' | 'flat' | 'glass' | 'glass-light' | 'glass-frosted' | 'auto'
}

// Card style classes based on variant
const cardStyleClasses = {
  elevated: 'bg-white shadow-md border-0',
  bordered: 'bg-white border-2 border-slate-200 shadow-none',
  flat: 'bg-slate-50 border-0 shadow-none',
  glass: 'bg-white/70 backdrop-blur-md border border-white/20 shadow-lg',
  'glass-light': 'bg-white/50 backdrop-blur-sm border border-white/30 shadow-md',
  'glass-frosted': 'bg-white/30 backdrop-blur-lg border border-white/20 shadow-xl',
}

// Get card style from localStorage or DOM
function getCardStyle(): string {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('foundlio-design')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.cardStyle) return parsed.cardStyle
      }
    } catch (e) {
      // Ignore parse errors
    }
    // Fallback to data attribute
    return document.documentElement.dataset.cardStyle || 'elevated'
  }
  return 'elevated'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, padding = 'md', variant = 'auto', children, ...props }, ref) => {
    const [currentStyle, setCurrentStyle] = useState<string>('elevated')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      setMounted(true)
      if (variant === 'auto') {
        setCurrentStyle(getCardStyle())

        // Listen for storage changes (cross-tab) and custom event (same-tab)
        const handleStorage = () => setCurrentStyle(getCardStyle())
        const handleThemeChange = () => setCurrentStyle(getCardStyle())
        window.addEventListener('storage', handleStorage)
        window.addEventListener('foundlio-theme-change', handleThemeChange)
        return () => {
          window.removeEventListener('storage', handleStorage)
          window.removeEventListener('foundlio-theme-change', handleThemeChange)
        }
      }
    }, [variant])

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }

    // Use specified variant or auto-detected style
    const styleKey = variant === 'auto' ? currentStyle : variant
    const baseStyle = cardStyleClasses[styleKey as keyof typeof cardStyleClasses] || cardStyleClasses.elevated

    return (
      <div
        ref={ref}
        className={cn(
          baseStyle,
          'rounded-[var(--radius-card,var(--radius))]',
          hover && 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card

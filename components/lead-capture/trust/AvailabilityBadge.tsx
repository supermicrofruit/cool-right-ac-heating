'use client'

import { useState, useEffect } from 'react'
import { Users, Clock, Zap } from 'lucide-react'

interface AvailabilityBadgeProps {
  variant?: 'technicians' | 'response' | 'slots' | 'live'
  accentColor?: string
  className?: string
}

export default function AvailabilityBadge({
  variant = 'technicians',
  accentColor = '#00509d',
  className = '',
}: AvailabilityBadgeProps) {
  const [count, setCount] = useState(3)
  const [isLive, setIsLive] = useState(true)

  // Simulate live updates
  useEffect(() => {
    if (variant === 'live') {
      const interval = setInterval(() => {
        setCount(prev => {
          const change = Math.random() > 0.5 ? 1 : -1
          return Math.max(1, Math.min(5, prev + change))
        })
      }, 30000) // Update every 30 seconds
      return () => clearInterval(interval)
    }
  }, [variant])

  const badges = {
    technicians: {
      icon: Users,
      text: `${count} technicians available in your area`,
      color: '#22c55e',
    },
    response: {
      icon: Clock,
      text: 'Average response time: 12 minutes',
      color: accentColor,
    },
    slots: {
      icon: Zap,
      text: `Only ${count} appointment slots left today`,
      color: '#f97316',
    },
    live: {
      icon: Users,
      text: `${count} people viewing this page`,
      color: '#8b5cf6',
    },
  }

  const badge = badges[variant]
  const Icon = badge.icon

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${className}`}
      style={{ backgroundColor: `${badge.color}15`, color: badge.color }}
    >
      <span className="relative flex h-2 w-2">
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
          style={{ backgroundColor: badge.color }}
        />
        <span
          className="relative inline-flex rounded-full h-2 w-2"
          style={{ backgroundColor: badge.color }}
        />
      </span>
      <Icon className="h-4 w-4" />
      <span>{badge.text}</span>
    </div>
  )
}

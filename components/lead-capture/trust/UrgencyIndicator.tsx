'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Clock, TrendingUp, Calendar } from 'lucide-react'

interface UrgencyIndicatorProps {
  variant?: 'countdown' | 'demand' | 'seasonal' | 'limited'
  accentColor?: string
  className?: string
}

export default function UrgencyIndicator({
  variant = 'countdown',
  accentColor = '#00509d',
  className = '',
}: UrgencyIndicatorProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 })
  const [demandLevel, setDemandLevel] = useState(85)

  // Countdown timer
  useEffect(() => {
    if (variant === 'countdown') {
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          let { hours, minutes, seconds } = prev
          seconds--
          if (seconds < 0) {
            seconds = 59
            minutes--
          }
          if (minutes < 0) {
            minutes = 59
            hours--
          }
          if (hours < 0) {
            hours = 2
            minutes = 45
            seconds = 30
          }
          return { hours, minutes, seconds }
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [variant])

  if (variant === 'countdown') {
    return (
      <div className={`bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4 ${className}`}>
        <div className="flex items-center gap-3 mb-2">
          <Clock className="h-5 w-5" />
          <span className="font-semibold">Same-Day Service Discount Ends In:</span>
        </div>
        <div className="flex gap-3 justify-center">
          <div className="bg-white/20 rounded-lg px-4 py-2 text-center">
            <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="text-xs opacity-80">Hours</div>
          </div>
          <div className="bg-white/20 rounded-lg px-4 py-2 text-center">
            <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="text-xs opacity-80">Minutes</div>
          </div>
          <div className="bg-white/20 rounded-lg px-4 py-2 text-center">
            <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="text-xs opacity-80">Seconds</div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'demand') {
    return (
      <div className={`bg-slate-50 border border-slate-200 rounded-xl p-4 ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            <span className="font-medium text-slate-900">High Demand Alert</span>
          </div>
          <span className="text-sm font-bold text-orange-500">{demandLevel}%</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${demandLevel}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Technician availability is limited today. Book now to secure your spot.
        </p>
      </div>
    )
  }

  if (variant === 'seasonal') {
    const month = new Date().getMonth()
    const isSummer = month >= 4 && month <= 8

    return (
      <div
        className={`rounded-xl p-4 ${className} ${isSummer ? 'bg-amber-50' : 'bg-primary/10'}`}
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className={`h-5 w-5 ${isSummer ? 'text-amber-600' : 'text-primary'}`} />
          <div>
            <p className={`font-semibold ${isSummer ? 'text-amber-800' : 'text-foreground'}`}>
              {isSummer ? 'Peak Summer Season' : 'Heating Season Alert'}
            </p>
            <p className={`text-sm ${isSummer ? 'text-amber-700' : 'text-primary'}`}>
              {isSummer
                ? 'AC repair calls are up 300%. Don\'t wait until it breaks!'
                : 'Schedule your heating tune-up before the rush.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'limited') {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-xl p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <Calendar className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="font-semibold text-red-800">Only 3 Slots Left Today</p>
            <p className="text-sm text-red-600">Next available: Tomorrow 2:00 PM</p>
          </div>
        </div>
      </div>
    )
  }

  return null
}

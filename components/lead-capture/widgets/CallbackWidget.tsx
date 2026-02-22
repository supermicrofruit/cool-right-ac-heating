'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, X, Clock, CheckCircle, ArrowRight } from 'lucide-react'

interface CallbackWidgetProps {
  accentColor?: string
  callbackTime?: number // minutes
  position?: 'bottom-right' | 'bottom-left'
  delayShow?: number // milliseconds to delay showing
  onSubmit?: (phone: string) => void
}

export default function CallbackWidget({
  accentColor = '#00509d',
  callbackTime = 2,
  position = 'bottom-right',
  delayShow = 3000,
  onSubmit,
}: CallbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [phone, setPhone] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(callbackTime * 60)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delayShow)
    return () => clearTimeout(timer)
  }, [delayShow])

  useEffect(() => {
    if (isSubmitted && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(c => c - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isSubmitted, countdown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (onSubmit) {
      onSubmit(phone)
    }
    setIsSubmitted(true)
    setIsLoading(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const positionClasses = position === 'bottom-right'
    ? 'right-6 bottom-6'
    : 'left-6 bottom-6'

  if (!isVisible) return null

  return (
    <>
      {/* Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className={`fixed ${positionClasses} z-50 flex items-center gap-3 px-5 py-3 text-white font-medium rounded-full shadow-lg transition-colors`}
            style={{ backgroundColor: accentColor }}
          >
            <div className="relative">
              <Phone className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <span>We'll call you in {callbackTime} min</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Widget Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed ${positionClasses} z-50 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden`}
          >
            {/* Header */}
            <div className="p-4 text-white" style={{ backgroundColor: accentColor }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Request Callback</p>
                    <p className="text-sm text-white/80">We call you in {callbackTime} minutes</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {isSubmitted ? (
                <div className="text-center py-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${accentColor}15` }}
                  >
                    <CheckCircle className="h-8 w-8" style={{ color: accentColor }} />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-1">We're calling you!</h4>
                  <p className="text-sm text-slate-600 mb-4">
                    Expect a call at <span className="font-medium">{phone}</span>
                  </p>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-center gap-2 text-slate-600">
                      <Clock className="h-5 w-5" style={{ color: accentColor }} />
                      <span className="text-2xl font-bold" style={{ color: accentColor }}>
                        {formatTime(countdown)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Estimated wait time</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Your phone number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-lg"
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !phone}
                    className="w-full py-3 text-white font-semibold rounded-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                    style={{ backgroundColor: accentColor }}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Call Me Now
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>

                  <p className="text-xs text-slate-500 text-center mt-3">
                    Free callback • No obligation • Available 24/7
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, MessageCircle, X, Clock } from 'lucide-react'

interface StickyCallButtonProps {
  phone?: string
  phoneDisplay?: string
  accentColor?: string
  showAfterScroll?: number // pixels
  variant?: 'simple' | 'expanded' | 'dual' // simple = just call, expanded = call + text, dual = call + form
  businessHours?: { start: number; end: number } // 24h format
  urgencyText?: string
}

export default function StickyCallButton({
  phone = '+16025552665',
  phoneDisplay = '(602) 555-2665',
  accentColor = '#00509d',
  showAfterScroll = 300,
  variant = 'expanded',
  businessHours = { start: 7, end: 20 },
  urgencyText,
}: StickyCallButtonProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isBusinessHours, setIsBusinessHours] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768)

    const checkBusinessHours = () => {
      const hour = new Date().getHours()
      setIsBusinessHours(hour >= businessHours.start && hour < businessHours.end)
    }
    checkBusinessHours()

    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfterScroll)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial position

    return () => window.removeEventListener('scroll', handleScroll)
  }, [showAfterScroll, businessHours])

  // Only show on mobile (checked after mount to avoid hydration mismatch)
  if (!isMobile) {
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          {/* Urgency Banner */}
          {urgencyText && (
            <div
              className="text-center py-2 text-sm font-medium text-white"
              style={{ backgroundColor: '#f97316' }}
            >
              {urgencyText}
            </div>
          )}

          {/* Main Button Area */}
          <div className="bg-white border-t border-slate-200 shadow-lg safe-area-bottom">
            {variant === 'simple' && (
              <a
                href={`tel:${phone}`}
                className="flex items-center justify-center gap-3 py-4 text-white font-semibold"
                style={{ backgroundColor: accentColor }}
              >
                <Phone className="h-6 w-6" />
                <span className="text-lg">Call Now: {phoneDisplay}</span>
              </a>
            )}

            {variant === 'expanded' && (
              <div className="p-3">
                {/* Status indicator */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${isBusinessHours ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className="text-xs text-slate-600">
                    {isBusinessHours ? 'Technicians available now' : 'Leave a message - we\'ll call back'}
                  </span>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`tel:${phone}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 text-white font-semibold rounded-lg"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Phone className="h-5 w-5" />
                    Call Now
                  </a>
                  <a
                    href={`sms:${phone}`}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 text-slate-700 font-semibold rounded-lg"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Text
                  </a>
                </div>
              </div>
            )}

            {variant === 'dual' && (
              <div className="p-3">
                {!isExpanded ? (
                  <div className="flex gap-3">
                    <a
                      href={`tel:${phone}`}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 text-white font-semibold rounded-lg"
                      style={{ backgroundColor: accentColor }}
                    >
                      <Phone className="h-5 w-5" />
                      <span>{phoneDisplay}</span>
                    </a>
                    <button
                      onClick={() => setIsExpanded(true)}
                      className="flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white font-semibold rounded-lg"
                    >
                      <Clock className="h-5 w-5" />
                      Schedule
                    </button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-slate-900">Request Callback</span>
                      <button
                        onClick={() => setIsExpanded(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100"
                      >
                        <X className="h-4 w-4 text-slate-600" />
                      </button>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="tel"
                        placeholder="Your phone number"
                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-base"
                      />
                      <button
                        className="px-6 py-3 text-white font-semibold rounded-lg"
                        style={{ backgroundColor: accentColor }}
                      >
                        Submit
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 text-center">
                      We'll call you within 15 minutes
                    </p>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

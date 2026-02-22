'use client'

import { useState, useEffect } from 'react'
import { Phone, MessageCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import businessData from '@/data/business.json'

/**
 * Mobile Sticky Footer CTA
 *
 * Research-backed design:
 * - 75% of users touch screens with thumb only
 * - Bottom-of-screen CTAs are in the "thumb zone"
 * - Sticky bottom buttons outperform header CTAs on mobile
 * - Min tap target: 48x48px (we use 56px for easy tapping)
 * - Phone calls convert 10-15x better than forms
 *
 * Shows only on mobile/tablet after user scrolls past hero
 */

const { features } = businessData

export default function StickyMobileCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if user previously dismissed
    try {
      const dismissed = sessionStorage.getItem('sticky-cta-dismissed')
      if (dismissed === 'true') {
        setIsDismissed(true)
        return
      }
    } catch {
      // Ignore storage errors
    }

    let rafId = 0
    const handleScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        const shouldShow = window.scrollY > 300
        setIsVisible(shouldShow && !isDismissed)
        rafId = 0
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [isDismissed])

  const handleDismiss = () => {
    setIsDismissed(true)
    try {
      sessionStorage.setItem('sticky-cta-dismissed', 'true')
    } catch {
      // Ignore storage errors
    }
  }

  // Don't render on server or if dismissed
  if (!mounted || isDismissed) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
        >
          {/* Safe area padding for devices with home indicator */}
          <div className="bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
            <div className="px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <div className="flex items-center gap-3">
                {/* Primary: Call Now - takes most space */}
                <a
                  href={`tel:${businessData.phoneRaw}`}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white font-bold rounded-lg shadow-lg active:scale-[0.98] transition-transform"
                  style={{ minHeight: '56px' }} // Larger than 48px for easy tapping
                >
                  <Phone className="h-5 w-5" />
                  <span>Call Now</span>
                </a>

                {/* Secondary: Text/Message */}
                <a
                  href={`sms:${businessData.phoneRaw}`}
                  className="flex items-center justify-center w-14 h-14 bg-gray-100 text-gray-700 rounded-lg active:scale-[0.98] transition-transform"
                  aria-label="Send text message"
                >
                  <MessageCircle className="h-6 w-6" />
                </a>

                {/* Dismiss button */}
                <button
                  onClick={handleDismiss}
                  className="flex items-center justify-center w-11 h-11 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Trust line */}
              <p className="text-center text-xs text-gray-500 mt-2">
                {features.emergencyBadge ? '24/7 Emergency Service Available' : 'Fast Response Guaranteed'}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

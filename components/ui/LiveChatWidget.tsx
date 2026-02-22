'use client'

import { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useVisualEffects } from '@/lib/gradientPresets'

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const effects = useVisualEffects()
  const useGradient = effects.gradientStyle !== 'none'

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 text-white rounded-full shadow-lg flex items-center justify-center transition-colors hidden md:flex ${
          useGradient ? 'bg-gradient-theme hover:opacity-90' : 'bg-primary hover:bg-primary-hover'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden hidden md:block"
          >
            {/* Header */}
            <div className={`text-white p-4 ${useGradient ? 'bg-gradient-theme' : 'bg-primary'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Chat with us</p>
                  <p className="text-xs text-white/80">We typically reply in minutes</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Close chat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="h-64 p-4 bg-slate-50">
              <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%]">
                <p className="text-sm text-slate-700">
                  Hi! How can we help you today? Ask us about our HVAC services or request a free estimate.
                </p>
                <p className="text-xs text-slate-400 mt-1">Just now</p>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  className={`w-10 h-10 text-white rounded-full flex items-center justify-center transition-colors ${
                    useGradient ? 'bg-gradient-theme hover:opacity-90' : 'bg-primary hover:bg-primary-hover'
                  }`}
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-slate-400 text-center mt-2">
                Or call us at (602) 555-2665
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

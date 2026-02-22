'use client'

import { useState, useEffect } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Review {
  name: string
  rating: number
  text: string
  service: string
  date: string
  avatar?: string
}

interface ReviewsNearFormProps {
  variant?: 'carousel' | 'stack' | 'single' | 'mini'
  accentColor?: string
  reviews?: Review[]
  autoRotate?: boolean
  className?: string
}

const defaultReviews: Review[] = [
  {
    name: 'Sarah M.',
    rating: 5,
    text: 'Came out within an hour of my call. Fixed my AC before the heat became unbearable. Highly recommend!',
    service: 'AC Repair',
    date: '2 days ago',
  },
  {
    name: 'Mike R.',
    rating: 5,
    text: 'Best HVAC company I\'ve ever used. Fair pricing, no surprises, and the tech explained everything.',
    service: 'AC Installation',
    date: '1 week ago',
  },
  {
    name: 'Jennifer L.',
    rating: 5,
    text: 'Fast, professional, and affordable. They saved me $500 compared to another quote I got.',
    service: 'Heating Repair',
    date: '3 days ago',
  },
  {
    name: 'David K.',
    rating: 5,
    text: 'Called at 10pm for an emergency and they had someone here by midnight. Lifesavers!',
    service: 'Emergency Service',
    date: '5 days ago',
  },
]

export default function ReviewsNearForm({
  variant = 'carousel',
  accentColor = '#00509d',
  reviews = defaultReviews,
  autoRotate = true,
  className = '',
}: ReviewsNearFormProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (autoRotate && (variant === 'carousel' || variant === 'single')) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % reviews.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [autoRotate, variant, reviews.length])

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}
        />
      ))}
    </div>
  )

  if (variant === 'mini') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex -space-x-2">
          {reviews.slice(0, 3).map((_, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-medium text-slate-600"
            >
              {reviews[i].name.charAt(0)}
            </div>
          ))}
        </div>
        <div>
          <div className="flex items-center gap-1">
            {renderStars(5)}
            <span className="text-sm font-semibold text-slate-900 ml-1">4.9</span>
          </div>
          <p className="text-xs text-slate-500">Based on 847+ reviews</p>
        </div>
      </div>
    )
  }

  if (variant === 'single') {
    const review = reviews[currentIndex]
    return (
      <div className={`bg-slate-50 rounded-xl p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <Quote className="h-6 w-6 text-slate-300 flex-shrink-0 mt-1" />
          <div>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-slate-700 mb-2"
              >
                "{review.text}"
              </motion.p>
            </AnimatePresence>
            <div className="flex items-center gap-2">
              {renderStars(review.rating)}
              <span className="text-sm font-medium text-slate-900">— {review.name}</span>
              <span className="text-xs text-slate-400">{review.date}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'stack') {
    return (
      <div className={`space-y-3 ${className}`}>
        {reviews.slice(0, 3).map((review, index) => (
          <div key={index} className="bg-white rounded-lg border border-slate-100 p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{review.name}</p>
                  <p className="text-xs text-slate-500">{review.service}</p>
                </div>
              </div>
              {renderStars(review.rating)}
            </div>
            <p className="text-sm text-slate-600 line-clamp-2">"{review.text}"</p>
          </div>
        ))}
      </div>
    )
  }

  // Carousel variant (default)
  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {renderStars(5)}
          <span className="text-sm font-semibold text-slate-900">4.9 out of 5</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentIndex(prev => (prev - 1 + reviews.length) % reviews.length)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-slate-600" />
          </button>
          <button
            onClick={() => setCurrentIndex(prev => (prev + 1) % reviews.length)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-slate-600" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm"
          >
            <p className="text-slate-700 mb-3">"{reviews[currentIndex].text}"</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  {reviews[currentIndex].name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{reviews[currentIndex].name}</p>
                  <p className="text-xs text-slate-500">{reviews[currentIndex].service}</p>
                </div>
              </div>
              <span className="text-xs text-slate-400">{reviews[currentIndex].date}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-1.5 mt-3">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-slate-900' : 'bg-slate-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

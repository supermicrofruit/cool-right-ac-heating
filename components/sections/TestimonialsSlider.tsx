'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Container from '@/components/ui/Container'
import MeshBackground from '@/components/ui/MeshBackground'
import FadeIn, { FadeInStagger } from '@/components/ui/FadeIn'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import TestimonialCard from './TestimonialCard'
import testimonialsData from '@/data/testimonials.json'
import { getTestimonialsSectionContent } from '@/lib/content'
import { useVisualEffects } from '@/lib/gradientPresets'
import { useContentSwap, useVerticalTestimonials } from '@/lib/useVerticalContent'
import themeData from '@/data/theme.json'

const testimonialsContent = getTestimonialsSectionContent()

// Type for testimonial items used across variants
type Testimonial = (typeof testimonialsData.testimonials)[number]

export type TestimonialsStyle = 'carousel' | 'grid' | 'featured' | 'minimal' | 'wall'

function useTestimonialsStyle(): TestimonialsStyle {
  const [style, setStyle] = useState<TestimonialsStyle>(
    ((themeData as any).testimonialsStyle as TestimonialsStyle) || 'carousel'
  )

  useEffect(() => {
    function update() {
      try {
        const saved = localStorage.getItem('foundlio-design')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.testimonialsStyle) {
            setStyle(parsed.testimonialsStyle)
            return
          }
        }
      } catch {}
      setStyle(((themeData as any).testimonialsStyle as TestimonialsStyle) || 'carousel')
    }
    update()
    window.addEventListener('foundlio-theme-change', update)
    return () => window.removeEventListener('foundlio-theme-change', update)
  }, [])

  return style
}

/* ── Shared: Header + Platform Badges ── */

function SectionHeader({ swap }: { swap: (t: string) => string }) {
  return (
    <FadeIn>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            {swap(testimonialsContent.title)}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {swap(testimonialsContent.subtitle)}
          </p>
        </div>
        <div className="mt-6 md:mt-0 flex items-center space-x-4">
          <div className="text-right">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              <span className="font-semibold text-foreground">{(testimonialsData as any).summary?.averageRating || '5.0'}</span> out of 5 ({(testimonialsData as any).summary?.totalReviews || testimonialsData.testimonials.length}+ reviews)
            </p>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

function PlatformBadges() {
  const platforms = (testimonialsData as any).summary?.platforms || []
  if (platforms.length === 0) return null

  return (
    <FadeIn delay={0.25}>
      <div className="flex flex-wrap justify-center gap-4 mt-10">
        {platforms.map((platform: any) => (
          <div
            key={platform.name}
            className="flex items-center space-x-2 px-4 py-2 bg-card rounded-lg border border-border"
          >
            <span className="text-sm font-medium text-muted-foreground">{platform.name}</span>
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              <span className="text-sm text-muted-foreground">{platform.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </FadeIn>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'
          }`}
        />
      ))}
    </div>
  )
}

/* ── Carousel: 3-card slider with dots (default) ── */

function CarouselVariant({ testimonials }: { testimonials: Testimonial[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 3
  const totalPages = Math.ceil(testimonials.length / itemsPerPage)

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % totalPages)
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)

  const currentTestimonials = testimonials.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  )

  return (
    <FadeIn delay={0.15}>
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-3 gap-6"
          >
            {currentTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </motion.div>
        </AnimatePresence>

        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-8 space-x-4">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-card border border-border text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex space-x-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-card border border-border text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Next testimonials"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </FadeIn>
  )
}

/* ── Grid: Static 3-column grid ── */

function GridVariant({ testimonials: allTestimonials }: { testimonials: Testimonial[] }) {
  const testimonials = allTestimonials.slice(0, 6)

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {testimonials.map((testimonial, index) => (
        <FadeInStagger key={testimonial.id} index={index}>
          <TestimonialCard testimonial={testimonial} />
        </FadeInStagger>
      ))}
    </div>
  )
}

/* ── Featured: 1 large + 2 stacked ── */

function FeaturedVariant({ testimonials }: { testimonials: Testimonial[] }) {
  const featured = testimonials[0]
  const side = testimonials.slice(1, 3)

  return (
    <FadeIn delay={0.15}>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Large featured card */}
        <Card className="flex flex-col justify-between" padding="lg">
          <div>
            <Quote className="h-10 w-10 text-primary/20 mb-4" />
            <p className="text-lg text-foreground leading-relaxed mb-6">
              &ldquo;{featured.text}&rdquo;
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <StarRating rating={featured.rating} />
              <p className="font-semibold text-foreground mt-2">{featured.name}</p>
              <p className="text-sm text-muted-foreground">{featured.location}</p>
            </div>
            <Badge variant="blue" size="sm">{featured.service}</Badge>
          </div>
        </Card>

        {/* 2 stacked smaller cards */}
        <div className="flex flex-col gap-6">
          {side.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </FadeIn>
  )
}

/* ── Minimal: No cards, just quotes with dividers ── */

function MinimalVariant({ testimonials: allTestimonials }: { testimonials: Testimonial[] }) {
  const testimonials = allTestimonials.slice(0, 4)

  return (
    <FadeIn delay={0.15}>
      <div className="max-w-3xl mx-auto divide-y divide-border">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="py-8 first:pt-0 last:pb-0">
            <StarRating rating={testimonial.rating} />
            <p className="text-lg text-foreground mt-4 leading-relaxed">
              &ldquo;{testimonial.text}&rdquo;
            </p>
            <div className="flex items-center gap-2 mt-4">
              <p className="font-medium text-foreground">{testimonial.name}</p>
              <span className="text-muted-foreground">&middot;</span>
              <p className="text-sm text-muted-foreground">{testimonial.location}</p>
            </div>
          </div>
        ))}
      </div>
    </FadeIn>
  )
}

/* ── Wall: Masonry-style staggered card wall ── */

function WallVariant({ testimonials }: { testimonials: Testimonial[] }) {
  const col1 = testimonials.filter((_, i) => i % 3 === 0)
  const col2 = testimonials.filter((_, i) => i % 3 === 1)
  const col3 = testimonials.filter((_, i) => i % 3 === 2)

  const renderCol = (items: typeof testimonials, offset: number) => (
    <div className="space-y-4">
      {items.map((testimonial, index) => (
        <FadeInStagger key={testimonial.id} index={index + offset}>
          <TestimonialCard testimonial={testimonial} />
        </FadeInStagger>
      ))}
    </div>
  )

  return (
    <div className="grid md:grid-cols-3 gap-4 items-start">
      {renderCol(col1, 0)}
      <div className="md:mt-8">
        {renderCol(col2, 1)}
      </div>
      {renderCol(col3, 2)}
    </div>
  )
}

/* ── Main Export ── */

export default function TestimonialsSlider() {
  const style = useTestimonialsStyle()
  const effects = useVisualEffects()
  const swap = useContentSwap()
  const verticalTestimonials = useVerticalTestimonials()

  // Use vertical override testimonials if available, else deployed data
  const activeData = verticalTestimonials || testimonialsData
  const testimonials: Testimonial[] = (activeData as any).testimonials || []

  const variants: Record<TestimonialsStyle, React.FC<{ testimonials: Testimonial[] }>> = {
    carousel: CarouselVariant,
    grid: GridVariant,
    featured: FeaturedVariant,
    minimal: MinimalVariant,
    wall: WallVariant,
  }

  const Variant = variants[style] || CarouselVariant

  return (
    <section className="py-16 md:py-24 bg-muted relative overflow-hidden">
      {effects.meshBackground && <MeshBackground variant="corner" intensity="subtle" />}
      <Container className="relative z-10">
        <SectionHeader swap={swap} />
        <Variant testimonials={testimonials} />
        <PlatformBadges />
      </Container>
    </section>
  )
}

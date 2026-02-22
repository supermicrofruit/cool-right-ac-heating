'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Star, Shield, Clock, CheckCircle, ArrowRight } from 'lucide-react'

import Container from '@/components/ui/Container'
import FadeIn from '@/components/ui/FadeIn'
import MeshBackground from '@/components/ui/MeshBackground'
import DarkHeroBottomWave from '@/components/ui/DarkHeroBottomWave'
import businessData from '@/data/business.json'
import servicesData from '@/data/services.json'
import themeData from '@/data/theme.json'
import { getHeroContent, type HeroContent } from '@/lib/content'
import { type HeroStyle, type HeaderStyle, shouldBeTransparent } from '@/lib/headerHeroConfig'
import { useVisualEffects } from '@/lib/gradientPresets'
import { useVerticalHeadlines, useVerticalDocumentTitle, useVerticalContentJson } from '@/lib/useVerticalContent'

const { features } = businessData
const defaultHeroContent = getHeroContent()

/** Returns vertical-override hero content or deployed default */
function useHeroContent(): HeroContent {
  useVerticalDocumentTitle()
  const headlines = useVerticalHeadlines()
  const verticalContent = useVerticalContentJson()

  // If vertical content.json has hero data, use it directly
  if (verticalContent?.hero) {
    const h = verticalContent.hero
    return {
      headline: h.headline || defaultHeroContent.headline,
      headlineAccent: h.headlineAccent || defaultHeroContent.headlineAccent,
      subheading: h.subheading || '',
      description: h.description || defaultHeroContent.description,
      imageAlt: h.imageAlt || defaultHeroContent.imageAlt,
      heroImage: h.heroImage || defaultHeroContent.heroImage,
      heroBackgroundImage: h.heroBackgroundImage || defaultHeroContent.heroBackgroundImage,
    }
  }

  if (!headlines) return defaultHeroContent

  // Use first hero variation from the vertical template
  const variation = headlines.hero?.variations?.[0]
  if (!variation) return defaultHeroContent

  // Split headline into main + accent for colored styling
  // With periods: "Cool Comfort. Desert Tough." → main: "Cool Comfort." accent: "Desert Tough."
  // Without periods: "Your Dream Yard Starts Here" → main: "Your Dream Yard" accent: "Starts Here"
  const raw = variation.headline || ''
  const periodParts = raw.split('.').map((s: string) => s.trim()).filter(Boolean)

  let headline: string
  let headlineAccent: string

  if (periodParts.length > 1) {
    headline = periodParts.slice(0, -1).join('. ') + '.'
    headlineAccent = periodParts[periodParts.length - 1] + '.'
  } else {
    const words = raw.split(' ')
    if (words.length > 3) {
      headline = words.slice(0, -2).join(' ')
      headlineAccent = words.slice(-2).join(' ')
    } else {
      headline = raw
      headlineAccent = ''
    }
  }

  return {
    headline: headline || defaultHeroContent.headline,
    headlineAccent: headlineAccent || defaultHeroContent.headlineAccent,
    subheading: '',
    description: variation.subheadline || defaultHeroContent.description,
    imageAlt: defaultHeroContent.imageAlt,
    heroImage: (headlines as any).heroImage || defaultHeroContent.heroImage,
    heroBackgroundImage: (headlines as any).heroBackgroundImage || defaultHeroContent.heroBackgroundImage,
  }
}

const DEFAULT_HERO_IMAGE = '/images/hero-technician.png'

/**
 * Hero Section - Research-backed design
 *
 * Key findings applied:
 * - No carousels (only 1% click them)
 * - Single static image with one clear headline
 * - Phone calls convert 10-15x better than forms
 * - Real photos: +35% conversion vs stock
 * - 3 fields max for forms (25% vs 15% conversion)
 * - Max 3-4 trust badges per section
 * - Single CTA focus (+18% calls vs dual CTAs)
 */

// =============================================================================
// Configuration
// =============================================================================

function getHeroStyle(): HeroStyle {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('foundlio-design')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.heroStyle) return parsed.heroStyle as HeroStyle
      }
    } catch (e) {
      // Ignore
    }
  }
  return ((themeData as Record<string, unknown>).heroStyle as HeroStyle) || 'split'
}

function getHeaderStyle(): HeaderStyle {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('foundlio-design')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.headerStyle && ['standard', 'trust-bar', 'centered', 'floating'].includes(parsed.headerStyle)) {
          return parsed.headerStyle as HeaderStyle
        }
      }
    } catch {
      // Ignore
    }
  }
  return ((themeData as Record<string, unknown>).headerStyle as HeaderStyle) || 'standard'
}

/** Returns true for headers that are taller than standard (need extra hero top padding) */
function isTallHeader(hs: HeaderStyle): boolean {
  return ['floating', 'centered', 'trust-bar'].includes(hs)
}

/** Returns the top padding class to clear the fixed header on homepage */
function getHeroPadding(hs: HeaderStyle): string {
  switch (hs) {
    case 'centered': return 'pt-[264px]'
    case 'trust-bar': return 'pt-[112px]'
    case 'floating': return 'pt-[220px]'
    case 'standard':
    default: return 'pt-[72px]'
  }
}

/** Reactive hook that tracks header style changes (SSR-safe, listens to theme events) */
function useHeaderStyle(): HeaderStyle {
  const [hs, setHs] = useState<HeaderStyle>(getHeaderStyle())
  useEffect(() => {
    setHs(getHeaderStyle())
    const update = () => setHs(getHeaderStyle())
    window.addEventListener('foundlio-theme-change', update)
    return () => window.removeEventListener('foundlio-theme-change', update)
  }, [])
  return hs
}

// =============================================================================
// Shared Components
// =============================================================================

interface RatingBadgeProps {
  variant?: 'light' | 'dark' | 'glass'
}

function RatingBadge({ variant = 'light' }: RatingBadgeProps) {
  const styles = {
    light: 'bg-white shadow-lg text-gray-700',
    dark: 'bg-white/10 backdrop-blur-md text-white',
    glass: 'bg-white/90 backdrop-blur-sm shadow-lg text-gray-700',
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${styles[variant]}`}
    >
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
        ))}
      </div>
      <span className="text-sm font-medium">
        {businessData.rating} from {businessData.reviewCount}+ reviews
      </span>
    </div>
  )
}

interface HeadlineProps {
  variant?: 'dark' | 'light'
  centered?: boolean
  gradientText?: boolean
  content: HeroContent
}

function Headline({ variant = 'dark', centered = false, gradientText = false, content }: HeadlineProps) {
  return (
    <h1
      className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 ${centered ? 'text-center' : ''}`}
    >
      <span className={variant === 'light' ? 'text-white' : 'text-gray-900'}>
        {content.headline}
      </span>{' '}
      <span className={gradientText && variant !== 'light' ? 'text-gradient-theme' : (variant === 'light' ? 'text-primary-light' : 'text-primary')}>
        {content.headlineAccent}
      </span>
    </h1>
  )
}

interface DescriptionProps {
  variant?: 'dark' | 'light'
  centered?: boolean
  compact?: boolean
  content: HeroContent
}

function Description({ variant = 'dark', centered = false, compact = false, content }: DescriptionProps) {
  return (
    <>
      {content.subheading && (
        <p
          className={`${compact ? 'text-base md:text-lg mb-2' : 'text-xl md:text-2xl mb-4'} font-medium leading-snug ${
            centered ? 'text-center max-w-2xl mx-auto' : 'max-w-xl'
          } ${variant === 'light' ? 'text-white/95' : 'text-gray-800'}`}
        >
          {content.subheading}
        </p>
      )}
      <p
        className={`${compact ? 'text-base md:text-lg mb-5' : 'text-lg md:text-xl mb-8'} leading-relaxed ${
          centered ? 'text-center max-w-2xl mx-auto' : 'max-w-xl'
        } ${variant === 'light' ? 'text-white/90' : 'text-gray-600'}`}
      >
        {content.description}
      </p>
    </>
  )
}

interface CTAButtonsProps {
  variant?: 'dark' | 'light'
  centered?: boolean
  singleCTA?: boolean
  useGradient?: boolean
  compact?: boolean
}

function CTAButtons({ variant = 'dark', centered = false, singleCTA = false, useGradient = false, compact = false }: CTAButtonsProps) {
  // Research: single CTA increases calls +18%
  // But we keep secondary for desktop where users might prefer online booking
  const btnPadding = compact ? 'px-6 py-3' : 'px-8 py-4'
  const btnText = compact ? 'text-base' : 'text-lg'
  const primaryBtnClass = variant === 'light'
    ? `inline-flex items-center justify-center whitespace-nowrap ${btnPadding} bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition-all duration-200 ${btnText} shadow-xl hover:shadow-2xl hover:-translate-y-0.5`
    : useGradient
    ? `inline-flex items-center justify-center whitespace-nowrap ${btnPadding} bg-gradient-theme text-white font-bold rounded-lg hover:opacity-90 transition-all duration-300 ${btnText} shadow-xl hover:shadow-2xl hover:-translate-y-0.5 hover:scale-[1.02]`
    : `inline-flex items-center justify-center whitespace-nowrap ${btnPadding} bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all duration-200 ${btnText} shadow-xl hover:shadow-2xl hover:-translate-y-0.5`

  return (
    <div
      className={`flex flex-col sm:flex-row gap-3 ${compact ? 'mb-5' : 'mb-8'} ${centered ? 'justify-center' : ''}`}
    >
      {/* Primary: Phone - converts 10-15x better */}
      <a
        href={`tel:${businessData.phoneRaw}`}
        className={primaryBtnClass}
      >
        <Phone className="h-5 w-5 mr-3" />
        {businessData.phone}
      </a>

      {/* Secondary: Form - only show if not single CTA mode */}
      {!singleCTA && (
        <Link
          href="/contact"
          className={`inline-flex items-center justify-center whitespace-nowrap ${btnPadding} font-semibold rounded-lg transition-all duration-200 ${btnText} ${
            variant === 'light'
              ? 'bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 backdrop-blur-sm'
              : 'bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-50 shadow-lg'
          }`}
        >
          Get Free Estimate
          <ArrowRight className="h-5 w-5 ml-3" />
        </Link>
      )}
    </div>
  )
}

interface TrustBadgesProps {
  variant?: 'dark' | 'light'
  centered?: boolean
}

function TrustBadges({ variant = 'dark', centered = false }: TrustBadgesProps) {
  // Research: max 3-4 badges per section
  const badges = [
    features.emergencyBadge && { icon: Clock, text: '24/7 Emergency' },
    { icon: Shield, text: 'Licensed & Insured' },
    { icon: CheckCircle, text: `${new Date().getFullYear() - (businessData.established || 2010)}+ Years` },
  ].filter(Boolean) as Array<{ icon: typeof Clock; text: string }>

  const badgeStyles = variant === 'light'
    ? 'bg-white/10 backdrop-blur-sm text-white'
    : 'bg-white shadow text-gray-700'

  const iconStyles = variant === 'light'
    ? 'text-primary-light'
    : 'text-primary'

  return (
    <div
      className={`flex flex-wrap gap-3 ${centered ? 'justify-center' : ''}`}
    >
      {badges.map((badge, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${badgeStyles}`}
        >
          <badge.icon className={`h-4 w-4 ${iconStyles}`} />
          <span className="text-sm font-medium">{badge.text}</span>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// Hero Form Component (3 fields max - research backed)
// =============================================================================

function HeroForm() {
  const effects = useVisualEffects()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: 'hero_form' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit')
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please call us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-100 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
        <p className="text-gray-600 text-sm">{businessData.forms?.successMessage || "We'll be in touch shortly."}</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-100"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-2">Get Your Free Estimate</h3>
      <p className="text-gray-600 text-sm mb-6">We&apos;ll respond within {businessData.responseTime || '2 hours'}</p>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            required
          />
        </div>

        {/* Service Dropdown */}
        <div>
          <select
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-700"
            required
          >
            <option value="">Select Service Needed</option>
            {((servicesData as any).services || []).slice(0, 5).map((s: any) => (
              <option key={s.slug} value={s.slug}>{s.name}</option>
            ))}
            <option value="other">Other / Free Estimate</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full px-6 py-4 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-60 ${
            effects.gradientButtons ? 'bg-gradient-theme hover:opacity-90' : 'bg-primary hover:bg-primary/90'
          }`}
        >
          {submitting ? 'Submitting...' : 'Request Free Estimate'}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
      )}

      {/* Trust indicator under form */}
      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
        <Shield className="h-4 w-4" />
        <span>No spam. Your info is secure.</span>
      </div>
    </form>
  )
}

// =============================================================================
// Hero Variant: Split
// Text left, photo right - clean, works everywhere
// Light background, solid header
// =============================================================================

function HeroSplit() {
  const effects = useVisualEffects()
  const heroContent = useHeroContent()
  const headerStyle = useHeaderStyle()
  const isFloating = headerStyle === 'floating'
  const hasGradientBg = effects.gradientStyle !== 'none'
  const bgClass = hasGradientBg
    ? (effects.gradientStyle === 'vibrant' ? 'bg-gradient-theme-vibrant' : 'bg-gradient-theme-subtle')
    : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'

  return (
    <section className={`hero-section relative overflow-hidden ${bgClass}`}>
      {effects.meshBackground && <MeshBackground variant="corner" intensity="subtle" />}
      <Container className="relative z-10">
        <div className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${isFloating ? 'pt-[220px] pb-24 lg:pb-28' : 'pt-8 lg:pt-14 pb-24 lg:pb-28'}`}>
          {/* Left: Content */}
          <FadeIn direction="up" duration={0.4} className="order-2 lg:order-1">
            <RatingBadge variant="glass" />
            <Headline variant="dark" gradientText={effects.gradientText} content={heroContent} />
            <Description variant="dark" content={heroContent} />
            <CTAButtons variant="dark" useGradient={effects.gradientButtons} />
            <TrustBadges variant="dark" />
          </FadeIn>

          {/* Right: Photo */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <Image
                src={heroContent.heroImage || DEFAULT_HERO_IMAGE}
                alt={heroContent.imageAlt}
                width={600}
                height={500}
                className="w-full h-[300px] md:h-[400px] lg:h-[480px] object-cover rounded-2xl shadow-2xl"
                priority
              />
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/10 rounded-2xl -z-10" />
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/5 rounded-full -z-10" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

// =============================================================================
// Hero Variant: Split + Form
// Text + 3-field form left, photo right
// Lead gen focused, light background
// =============================================================================

function HeroSplitForm() {
  const effects = useVisualEffects()
  const heroContent = useHeroContent()
  const headerStyle = useHeaderStyle()
  const isFloating = headerStyle === 'floating'
  const hasGradientBg = effects.gradientStyle !== 'none'
  const bgClass = hasGradientBg
    ? (effects.gradientStyle === 'vibrant' ? 'bg-gradient-theme-vibrant' : 'bg-gradient-theme-subtle')
    : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'

  return (
    <section className={`hero-section relative overflow-hidden ${bgClass} min-h-screen pb-16 lg:pb-24`}>
      {effects.meshBackground && <MeshBackground variant="corner" intensity="subtle" />}
      <Container className="relative z-10">
        <div className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-start ${isFloating ? 'pt-[220px] pb-24 lg:pb-28' : 'pt-6 lg:pt-8 pb-24 lg:pb-28'}`}>
          {/* Left: Content + Form */}
          <FadeIn direction="up" duration={0.4} className="order-2 lg:order-1 lg:pt-8">
            <RatingBadge variant="glass" />
            <Headline variant="dark" gradientText={effects.gradientText} content={heroContent} />
            <Description variant="dark" content={heroContent} />

            {/* Form instead of CTA buttons */}
            <HeroForm />
          </FadeIn>

          {/* Right: Photo - aligned to top */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <Image
                src={heroContent.heroImage || DEFAULT_HERO_IMAGE}
                alt={heroContent.imageAlt}
                width={600}
                height={600}
                className="w-full h-[300px] md:h-[450px] lg:h-[580px] object-cover rounded-2xl shadow-2xl"
                priority
              />
              {/* Trust badges on image */}
              <div className="absolute bottom-4 left-4 right-4">
                <TrustBadges variant="light" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

// =============================================================================
// Hero Variant: Fullwidth
// Dark photo background - full bleed from edge to edge
// Header overlays this with its own rounded container
// =============================================================================

function HeroFullwidth() {
  const effects = useVisualEffects()
  const heroContent = useHeroContent()
  const hasGradientOverlay = effects.gradientStyle !== 'none'
  const overlayClass = hasGradientOverlay
    ? 'absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/75 to-gray-900/30'
    : 'absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-gray-900/40'

  return (
    <section className="hero-section relative overflow-hidden h-[calc(100vh+3rem)] md:h-[calc(100vh+4rem)] lg:h-[calc(100vh+5rem)]">
      {/* Background Image - full bleed */}
      <div className="absolute inset-0">
        <Image
          src={heroContent.heroBackgroundImage || heroContent.heroImage || DEFAULT_HERO_IMAGE}
          alt={heroContent.imageAlt}
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay gradient */}
        <div className={overlayClass} />
        {/* Subtle tinted overlay when gradient effects active */}
        {hasGradientOverlay && (
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--gradient-from)/0.15)] via-transparent to-[hsl(var(--gradient-to)/0.1)]" />
        )}
      </div>
      {effects.meshBackground && <MeshBackground variant="full" intensity="subtle" className="z-[1]" />}

      {/* Content - positioned below header, pb offsets the extra height for wave overlap */}
      <div className="relative z-10 h-full flex flex-col justify-center pt-20 pb-12 md:pb-16 lg:pb-20">
        <Container>
          <FadeIn direction="up" duration={0.4}>
            <div className="max-w-2xl">
              <RatingBadge variant="dark" />
              <HeadlineDark content={heroContent} />
              <Description variant="light" content={heroContent} />
              <CTAButtons variant="light" useGradient={effects.gradientButtons} />
              <TrustBadges variant="light" />
            </div>
          </FadeIn>
        </Container>
      </div>

      <DarkHeroBottomWave />
    </section>
  )
}

// Special headline for dark backgrounds with lighter accent color (uses --primary-light)
function HeadlineDark({ content }: { content: HeroContent }) {
  return (
    <h1
      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white"
    >
      {content.headline}{' '}
      <span className="text-primary-light">{content.headlineAccent}</span>
    </h1>
  )
}

// =============================================================================
// Hero Variant: Compact
// Smaller hero, photo on side - fast, efficient
// Light background, lets content below shine
// =============================================================================

function HeroCompact() {
  const effects = useVisualEffects()
  const heroContent = useHeroContent()
  const headerStyle = useHeaderStyle()
  const isFloating = headerStyle === 'floating'
  const hasGradientBg = effects.gradientStyle !== 'none'

  return (
    <section className={`hero-section relative overflow-hidden ${hasGradientBg ? 'bg-gradient-theme-subtle' : 'bg-white'} border-b border-gray-100`}>
      {effects.meshBackground && <MeshBackground variant="corner" intensity="subtle" />}
      <Container className="relative z-10">
        <div className={`grid lg:grid-cols-2 gap-6 lg:gap-10 items-center ${isFloating ? 'pt-[220px] pb-24 lg:pb-28' : 'pt-8 lg:pt-12 pb-24 lg:pb-28'}`}>
          {/* Left: Content - more condensed */}
          <FadeIn direction="up" duration={0.4} className="order-2 lg:order-1">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 ${hasGradientBg ? 'bg-white/60 backdrop-blur-sm' : 'bg-primary/10'} text-primary rounded-full mb-4 text-sm font-medium`}
            >
              <Star className="h-3.5 w-3.5 fill-current" />
              {businessData.rating} rating · {businessData.reviewCount}+ reviews
            </div>

            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-gray-900"
            >
              {heroContent.headline}{' '}
              <span className={effects.gradientText ? 'text-gradient-theme' : 'text-primary'}>{heroContent.headlineAccent}</span>
            </h1>

            {heroContent.subheading && (
              <p className="text-lg md:text-xl font-medium mb-3 leading-snug text-gray-800 max-w-lg">
                {heroContent.subheading}
              </p>
            )}
            <p
              className="text-base md:text-lg mb-6 text-gray-600 max-w-lg"
            >
              {heroContent.description}
            </p>

            {/* Compact CTA - single button focus */}
            <div
              className="flex flex-wrap items-center gap-4"
            >
              <a
                href={`tel:${businessData.phoneRaw}`}
                className={effects.gradientButtons
                  ? 'inline-flex items-center px-6 py-3 bg-gradient-theme text-white font-bold rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]'
                  : 'inline-flex items-center px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all shadow-lg'
                }
              >
                <Phone className="h-5 w-5 mr-2" />
                {businessData.phone}
              </a>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Shield className="h-4 w-4" />
                <span>Licensed & Insured</span>
              </div>
            </div>
          </FadeIn>

          {/* Right: Compact Photo */}
          <div className="order-1 lg:order-2">
            <div>
              <Image
                src={heroContent.heroImage || DEFAULT_HERO_IMAGE}
                alt={heroContent.imageAlt}
                width={500}
                height={350}
                className="w-full h-[220px] md:h-[280px] lg:h-[320px] object-cover rounded-xl shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

// =============================================================================
// Hero Variant: Branded
// Bold accent panel left + photo right — magazine spread
// Dark background (accent bg), transparent header with white text
// =============================================================================

function HeroBranded() {
  const effects = useVisualEffects()
  const heroContent = useHeroContent()
  const headerStyle = useHeaderStyle()
  const tallHeader = isTallHeader(headerStyle)

  return (
    <section className="hero-section relative overflow-hidden bg-gradient-theme">
      {/* Dot pattern overlay — covers full section including wave area */}
      <div
        className="absolute inset-0 opacity-[0.06] z-[1]"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      {effects.meshBackground && <MeshBackground variant="corner" intensity="medium" className="opacity-30 z-[1]" />}

      {/* Content row — flex on lg, pb creates space for wave overlap */}
      <div className="relative z-[2] lg:flex pb-16 md:pb-20 lg:pb-24">
        {/* Left: Text panel */}
        <div className="relative w-full lg:w-[55%] flex flex-col justify-center">
          <div className={`relative z-10 px-6 sm:px-10 lg:px-10 xl:px-14 pt-28 pb-8 lg:pb-0 ${getHeroPadding(headerStyle)}`}>
            <FadeIn direction="up" duration={0.4}>
              <RatingBadge variant="dark" />

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-4 text-white" style={{ zoom: 1 }}>
                {heroContent.headline}{' '}
                <span className="text-white/80">{heroContent.headlineAccent}</span>
              </h1>

              {/* Thin white rule */}
              <div className="w-16 h-[2px] bg-white/30 mb-4" />

              <Description variant="light" compact content={heroContent} />
              <CTAButtons variant="light" useGradient={false} compact />
              <TrustBadges variant="light" />
            </FadeIn>
          </div>
        </div>

        {/* Right: Photo - starts below header, edge to edge */}
        <div className={`hidden lg:block lg:w-[45%] relative ${getHeroPadding(headerStyle)}`}>
          <div className="absolute inset-0" style={{ top: headerStyle === 'centered' ? 264 : headerStyle === 'trust-bar' ? 112 : headerStyle === 'floating' ? 220 : 72 }}>
            <Image
              src={heroContent.heroImage || DEFAULT_HERO_IMAGE}
              alt={heroContent.imageAlt}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Mobile: Photo below text */}
        <div className="lg:hidden relative w-full h-[200px] sm:h-[250px]">
          <Image
            src={heroContent.heroImage || DEFAULT_HERO_IMAGE}
            alt={heroContent.imageAlt}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <DarkHeroBottomWave />
    </section>
  )
}

// =============================================================================
// Hero Variant: Mosaic
// Multi-image asymmetric grid on right
// Light background, solid header
// =============================================================================

function HeroMosaic() {
  const effects = useVisualEffects()
  const heroContent = useHeroContent()
  const headerStyle = useHeaderStyle()
  const isFloating = headerStyle === 'floating'
  const hasGradientBg = effects.gradientStyle !== 'none'
  const bgClass = hasGradientBg
    ? (effects.gradientStyle === 'vibrant' ? 'bg-gradient-theme-vibrant' : 'bg-gradient-theme-subtle')
    : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'

  return (
    <section className={`hero-section relative overflow-hidden ${bgClass}`}>
      {effects.meshBackground && <MeshBackground variant="corner" intensity="subtle" />}
      <Container className="relative z-10">
        <div className={`grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-10 items-center ${isFloating ? 'pt-[220px] pb-24 lg:pb-28' : 'pt-8 lg:pt-14 pb-24 lg:pb-28'}`}>
          {/* Left: Content */}
          <FadeIn direction="up" duration={0.4} className="order-2 lg:order-1">
            <RatingBadge variant="glass" />
            <Headline variant="dark" gradientText={effects.gradientText} content={heroContent} />
            <Description variant="dark" content={heroContent} />
            <CTAButtons variant="dark" useGradient={effects.gradientButtons} />
            <TrustBadges variant="dark" />
          </FadeIn>

          {/* Right: Single image with mosaic frame — one photo, three panel illusion */}
          <div className="order-1 lg:order-2">
            <div className="relative h-[300px] md:h-[400px] lg:h-[460px]">
              <svg
                className="w-full h-full"
                viewBox="0 0 438 462"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <clipPath id="mosaic-panels">
                    <rect x="10" y="10" width="206" height="442" rx="24" />
                    <rect x="226" y="10" width="202" height="217" rx="24" />
                    <rect x="226" y="237" width="202" height="215" rx="24" />
                  </clipPath>
                  <filter id="mosaic-shadow" x="-5%" y="-5%" width="110%" height="110%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.18" />
                  </filter>
                </defs>
                {/* Panel shadows for depth */}
                <rect x="10" y="10" width="206" height="442" rx="24" fill="white" filter="url(#mosaic-shadow)" />
                <rect x="226" y="10" width="202" height="217" rx="24" fill="white" filter="url(#mosaic-shadow)" />
                <rect x="226" y="237" width="202" height="215" rx="24" fill="white" filter="url(#mosaic-shadow)" />
                {/* Single image clipped to all three panels */}
                <image
                  href={heroContent.heroImage || DEFAULT_HERO_IMAGE}
                  x="0" y="0" width="438" height="462"
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#mosaic-panels)"
                />
                {/* Subtle accent border on each panel */}
                <rect x="10" y="10" width="206" height="442" rx="24" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" opacity="0.15" />
                <rect x="226" y="10" width="202" height="217" rx="24" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" opacity="0.15" />
                <rect x="226" y="237" width="202" height="215" rx="24" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" opacity="0.15" />
              </svg>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

// =============================================================================
// Hero Variant: Diagonal
// Diagonal image split — image clipped at angle on right
// Light background, solid header
// =============================================================================

function HeroDiagonal() {
  const effects = useVisualEffects()
  const heroContent = useHeroContent()
  const headerStyle = useHeaderStyle()
  const isFloating = headerStyle === 'floating'
  const hasGradientBg = effects.gradientStyle !== 'none'
  const bgClass = hasGradientBg
    ? (effects.gradientStyle === 'vibrant' ? 'bg-gradient-theme-vibrant' : 'bg-gradient-theme-subtle')
    : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'

  return (
    <section className={`hero-section relative overflow-hidden ${bgClass}`}>
      {effects.meshBackground && <MeshBackground variant="corner" intensity="subtle" />}

      {/* Mobile: Full-width image on top (no clip) */}
      <div className="lg:hidden">
        <div className="relative w-full h-[250px] sm:h-[300px]">
          <Image
            src={heroContent.heroImage || DEFAULT_HERO_IMAGE}
            alt={heroContent.imageAlt}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Desktop: Diagonal clipped image on right */}
      <div className="hidden lg:block absolute top-0 right-0 w-[48%] h-full">
        <div
          className="absolute inset-0"
          style={{ clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0 100%)' }}
        >
          <Image
            src={heroContent.heroImage || DEFAULT_HERO_IMAGE}
            alt={heroContent.imageAlt}
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* Accent line following the diagonal */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            clipPath: 'polygon(12% 0, 12.3% 0, 0.3% 100%, 0% 100%)',
            backgroundColor: 'hsl(var(--primary))',
          }}
        />
      </div>

      {/* Content */}
      <div className={`relative z-10 lg:min-h-screen flex items-center`} style={isFloating ? { paddingTop: '220px' } : undefined}>
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="lg:w-[48%] pb-24 lg:pb-28">
            <FadeIn direction="up" duration={0.4}>
              <RatingBadge variant="glass" />
              <Headline variant="dark" gradientText={effects.gradientText} content={heroContent} />
              <Description variant="dark" content={heroContent} />
              <CTAButtons variant="dark" useGradient={effects.gradientButtons} />
              <TrustBadges variant="dark" />
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}

// =============================================================================
// Main Export
// =============================================================================

export default function HeroSection() {
  const [heroStyle, setHeroStyle] = useState<HeroStyle>('split')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setHeroStyle(getHeroStyle())

    const handleThemeChange = () => {
      setHeroStyle(getHeroStyle())
    }
    window.addEventListener('foundlio-theme-change', handleThemeChange)

    return () => {
      window.removeEventListener('foundlio-theme-change', handleThemeChange)
    }
  }, [])

  // SSR fallback
  if (!mounted) {
    return <HeroSplit />
  }

  switch (heroStyle) {
    case 'split-form':
      return <HeroSplitForm />
    case 'fullwidth':
      return <HeroFullwidth />
    case 'compact':
      return <HeroCompact />
    case 'diagonal':
      return <HeroDiagonal />
    case 'mosaic':
      return <HeroMosaic />
    case 'branded':
      return <HeroBranded />
    case 'split':
    default:
      return <HeroSplit />
  }
}

'use client'

import { useState, useEffect } from 'react'
import { Shield, Award, Star, Clock, ThumbsUp, Users, Wrench, AirVent, Flame, Home, Wind, Sparkles, AlertCircle, Truck, Building, Hammer, CheckCircle, Zap, type LucideIcon } from 'lucide-react'
import Container from '@/components/ui/Container'
import Card from '@/components/ui/Card'
import FadeIn, { FadeInStagger } from '@/components/ui/FadeIn'
import businessData from '@/data/business.json'
import { getTrustSectionContent } from '@/lib/content'
import { useVisualEffects } from '@/lib/gradientPresets'
import { useVerticalHeadlines, useContentSwap, useVerticalContentJson } from '@/lib/useVerticalContent'
import themeData from '@/data/theme.json'

const trustContent = getTrustSectionContent()

const trustIconMap: Record<string, LucideIcon> = {
  Shield, Award, Star, Clock, ThumbsUp, Users, Wrench, AirVent, Flame, Home,
  Wind, Sparkles, AlertCircle, Truck, Building, Hammer, CheckCircle, Zap,
}

const defaultSignals = [
  {
    icon: Star,
    title: `${businessData.rating} Star Rating`,
    description: `${businessData.reviewCount}+ verified reviews`,
  },
  {
    icon: Shield,
    title: 'Licensed & Insured',
    description: businessData.licenses?.[0] || '',
  },
  {
    icon: Award,
    title: trustContent.factoryAuthorized,
    description: trustContent.factoryDescription,
  },
  {
    icon: Clock,
    title: businessData.emergencyService ? '24/7 Emergency Service' : `${businessData.responseTime} Response`,
    description: businessData.emergencyService ? 'Always here when you need us' : 'Fast, reliable scheduling',
  },
  {
    icon: ThumbsUp,
    title: 'Satisfaction Guaranteed',
    description: '100% workmanship guarantee',
  },
  {
    icon: Users,
    title: `Since ${businessData.established}`,
    description: `${2026 - businessData.established}+ years of experience`,
  },
]

function useSignals() {
  const headlines = useVerticalHeadlines()
  const verticalContent = useVerticalContentJson()

  // Use vertical content.json trustSection items if available
  if (verticalContent?.trustSection?.items?.length) {
    return verticalContent.trustSection.items.map((item: any) => ({
      icon: trustIconMap[item.icon] || Shield,
      title: item.label || item.title,
      description: item.value || item.description,
    }))
  }

  if (headlines?.valueProps?.variations?.length) {
    return headlines.valueProps.variations.map(vp => ({
      icon: trustIconMap[vp.icon] || Shield,
      title: vp.title,
      description: vp.description,
    }))
  }

  return defaultSignals
}

export type TrustStyle = 'grid' | 'cards' | 'banner' | 'compact'

function useTrustStyle(): TrustStyle {
  const [style, setStyle] = useState<TrustStyle>(
    ((themeData as any).trustStyle as TrustStyle) || 'grid'
  )

  useEffect(() => {
    function update() {
      try {
        const saved = localStorage.getItem('foundlio-design')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.trustStyle) {
            setStyle(parsed.trustStyle)
            return
          }
        }
      } catch {}
      setStyle(((themeData as any).trustStyle as TrustStyle) || 'grid')
    }
    update()
    window.addEventListener('foundlio-theme-change', update)
    return () => window.removeEventListener('foundlio-theme-change', update)
  }, [])

  return style
}

interface TrustSignalsProps {
  variant?: 'grid' | 'inline'
  showAll?: boolean
}

/* ── Grid: 6-column icons (original default) ── */

function GridVariant({ displaySignals, effects }: { displaySignals: typeof signals; effects: any }) {
  const hasGlass = effects.glassEffect !== 'none'
  const hasGradient = effects.gradientStyle !== 'none'

  const itemClass = hasGlass
    ? 'text-center p-4 bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl'
    : 'text-center p-4'
  const iconBgClass = hasGradient
    ? 'inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[hsl(var(--gradient-from)/0.1)] to-[hsl(var(--gradient-to)/0.1)] rounded-xl mb-4'
    : 'inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-xl mb-4'

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {displaySignals.map((signal, index) => (
        <FadeInStagger key={signal.title} index={index} className={itemClass}>
          <div className={iconBgClass}>
            <signal.icon className="h-7 w-7 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">{signal.title}</p>
          <p className="text-muted-foreground text-xs">{signal.description}</p>
        </FadeInStagger>
      ))}
    </div>
  )
}

/* ── Cards: 2x3 bordered cards with icon, title, description ── */

function CardsVariant({ displaySignals }: { displaySignals: typeof signals }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displaySignals.map((signal, index) => (
        <FadeInStagger key={signal.title} index={index}>
          <Card padding="lg" className="flex items-start gap-4">
            <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <signal.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">{signal.title}</p>
              <p className="text-sm text-muted-foreground">{signal.description}</p>
            </div>
          </Card>
        </FadeInStagger>
      ))}
    </div>
  )
}

/* ── Banner: Single horizontal row, scrollable on mobile ── */

function BannerVariant({ displaySignals }: { displaySignals: typeof signals }) {
  return (
    <FadeIn delay={0.15}>
      <div className="flex overflow-x-auto gap-8 pb-4 md:pb-0 md:justify-between md:flex-wrap scrollbar-hide">
        {displaySignals.map((signal) => (
          <div key={signal.title} className="flex items-center gap-3 shrink-0">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
              <signal.icon className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground whitespace-nowrap">{signal.title}</p>
              <p className="text-xs text-muted-foreground whitespace-nowrap">{signal.description}</p>
            </div>
          </div>
        ))}
      </div>
    </FadeIn>
  )
}

/* ── Compact: 2 rows x 3 cols, icon + title only ── */

function CompactVariant({ displaySignals }: { displaySignals: typeof signals }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {displaySignals.map((signal, index) => (
        <FadeInStagger key={signal.title} index={index} className="flex items-center gap-3 p-3 rounded-lg">
          <signal.icon className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm font-medium text-foreground">{signal.title}</p>
        </FadeInStagger>
      ))}
    </div>
  )
}

/* ── Main Export ── */

export default function TrustSignals({ variant = 'grid', showAll = true }: TrustSignalsProps) {
  const effects = useVisualEffects()
  const trustStyle = useTrustStyle()
  const signals = useSignals()
  const swap = useContentSwap()
  const displaySignals = showAll ? signals : signals.slice(0, 4)

  const title = swap(trustContent.title)
  const subtitle = swap(trustContent.subtitle)

  // Inline variant is used elsewhere (e.g. hero), doesn't use style switching
  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap justify-center gap-6 md:gap-10">
        {displaySignals.slice(0, 4).map((signal) => (
          <div key={signal.title} className="flex items-center space-x-2 text-muted-foreground">
            <signal.icon className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">{signal.title}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <section className="py-12 md:py-16 bg-background">
      <Container>
        <FadeIn>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-foreground mb-4">
              {title}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
        </FadeIn>
        {trustStyle === 'grid' && <GridVariant displaySignals={displaySignals} effects={effects} />}
        {trustStyle === 'cards' && <CardsVariant displaySignals={displaySignals} />}
        {trustStyle === 'banner' && <BannerVariant displaySignals={displaySignals} />}
        {trustStyle === 'compact' && <CompactVariant displaySignals={displaySignals} />}
      </Container>
    </section>
  )
}

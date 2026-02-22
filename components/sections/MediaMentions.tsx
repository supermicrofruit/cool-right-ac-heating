'use client'

import { useState, useEffect } from 'react'
import { Award, Star, Shield, CheckCircle, Clock, ThumbsUp, Users, Zap, Heart, BadgeCheck } from 'lucide-react'
import Container from '@/components/ui/Container'
import FadeIn from '@/components/ui/FadeIn'
import businessData from '@/data/business.json'
import themeData from '@/data/theme.json'
import { getMediaBarContent } from '@/lib/content'
import { useVisualEffects } from '@/lib/gradientPresets'
import { useVerticalBusinessName, useVerticalContentJson } from '@/lib/useVerticalContent'
import type { HeroStyle } from '@/lib/headerHeroConfig'

const mediaContent = getMediaBarContent()
const city = businessData.address?.city || 'Your City'
const yearsInBusiness = new Date().getFullYear() - (businessData.established || 2010)
const certs = (businessData as any).certifications || []
const bbbCert = certs.find((c: string) => c.includes('BBB'))

type MentionItem = { name: string; description: string; icon: typeof Award }

// ── Variant 1: Certifications (data-driven from business.json) ──
function buildCertifications(): { tagline: string; items: MentionItem[] } {
  const items: MentionItem[] = []

  if (businessData.rating) {
    items.push({ name: `Google ${businessData.rating}★`, description: `${businessData.reviewCount || 0}+ Reviews`, icon: Star })
  }

  const certMap: Record<string, { description: string; icon: typeof Award }> = {
    'BBB': { description: 'Better Business Bureau', icon: Award },
    'ISSA': { description: 'Certified Team', icon: Shield },
    'Green Seal': { description: 'Eco-Friendly', icon: CheckCircle },
    'OSHA': { description: 'Safety Trained', icon: Shield },
    'NATE': { description: 'Certified Technicians', icon: Shield },
    'EPA': { description: 'EPA Certified', icon: Shield },
    'Energy Star': { description: 'Energy Efficient', icon: CheckCircle },
  }

  for (const cert of certs) {
    const match = Object.entries(certMap).find(([key]) => cert.includes(key))
    items.push({
      name: cert,
      description: match ? match[1].description : 'Certified',
      icon: match ? match[1].icon : CheckCircle,
    })
  }

  if (items.length < 5 && businessData.licenses?.[0]) {
    items.push({ name: 'Licensed & Insured', description: businessData.licenses?.[0] || '', icon: Shield })
  }

  return { tagline: mediaContent.tagline || `Trusted By ${city} Families`, items }
}

// ── Variant 2: Stats & Numbers ──
function buildStats(): { tagline: string; items: MentionItem[] } {
  const items: MentionItem[] = []

  if (businessData.reviewCount) {
    items.push({ name: `${businessData.reviewCount}+ Clients`, description: 'Happy customers', icon: Users })
  }
  if (yearsInBusiness > 0) {
    items.push({ name: `${yearsInBusiness}+ Years`, description: `Serving ${city}`, icon: Clock })
  }
  if (businessData.rating) {
    items.push({ name: `${businessData.rating}/5 Rating`, description: 'Customer satisfaction', icon: Star })
  }
  items.push({ name: 'Same Day', description: 'Fast scheduling', icon: Zap })

  return { tagline: `${businessData.name} By The Numbers`, items }
}

// ── Variant 3: Value Propositions ──
function buildValueProps(): { tagline: string; items: MentionItem[] } {
  const items: MentionItem[] = [
    { name: 'Free Estimates', description: 'No obligation', icon: CheckCircle },
    { name: 'Licensed & Insured', description: 'Full coverage', icon: Shield },
    { name: '100% Satisfaction', description: 'Guaranteed', icon: ThumbsUp },
  ]

  if ((businessData as any).emergencyService) {
    items.push({ name: '24/7 Emergency', description: 'Always available', icon: Clock })
  } else {
    items.push({ name: `${businessData.responseTime || 'Fast'} Response`, description: 'Quick scheduling', icon: Zap })
  }

  return { tagline: 'Why Choose Us', items }
}

// ── Variant 4: Social Proof ──
function buildSocialProof(): { tagline: string; items: MentionItem[] } {
  const items: MentionItem[] = []

  if (businessData.rating) {
    items.push({ name: `${businessData.rating}★ on Google`, description: `${businessData.reviewCount}+ reviews`, icon: Star })
  }
  if (bbbCert) {
    items.push({ name: bbbCert, description: 'Accredited', icon: Award })
  }
  items.push({ name: `Since ${businessData.established}`, description: `${yearsInBusiness}+ years trusted`, icon: Heart })
  items.push({ name: 'Background Checked', description: 'Vetted team', icon: BadgeCheck })

  return { tagline: `${city} Homeowners Trust Us`, items }
}

// ── Variant 5: Guarantees ──
function buildGuarantees(): { tagline: string; items: MentionItem[] } {
  const items: MentionItem[] = [
    { name: 'Satisfaction Guarantee', description: "We'll make it right", icon: ThumbsUp },
    { name: 'Transparent Pricing', description: 'No hidden fees', icon: CheckCircle },
    { name: 'Vetted Professionals', description: 'Background checked', icon: BadgeCheck },
  ]

  if (businessData.licenses?.[0]) {
    items.push({ name: 'Fully Licensed', description: businessData.licenses[0], icon: Shield })
  } else {
    items.push({ name: 'Fully Insured', description: 'Complete protection', icon: Shield })
  }

  return { tagline: 'Our Promise To You', items }
}

export type MediaBarStyle = 'certifications' | 'stats' | 'value-props' | 'social-proof' | 'guarantees'

const VARIANT_BUILDERS: Record<MediaBarStyle, () => { tagline: string; items: MentionItem[] }> = {
  'certifications': buildCertifications,
  'stats': buildStats,
  'value-props': buildValueProps,
  'social-proof': buildSocialProof,
  'guarantees': buildGuarantees,
}

function useMediaBarStyle(): MediaBarStyle {
  const [style, setStyle] = useState<MediaBarStyle>(
    ((themeData as any).mediaBarStyle as MediaBarStyle) || 'certifications'
  )

  useEffect(() => {
    function update() {
      try {
        const saved = localStorage.getItem('foundlio-design')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.mediaBarStyle) {
            setStyle(parsed.mediaBarStyle as MediaBarStyle)
            return
          }
        }
      } catch {}
      setStyle(((themeData as any).mediaBarStyle as MediaBarStyle) || 'certifications')
    }
    update()
    window.addEventListener('foundlio-theme-change', update)
    return () => window.removeEventListener('foundlio-theme-change', update)
  }, [])

  return style
}

function useHeroStyle(): HeroStyle {
  const [hero, setHero] = useState<HeroStyle>(
    ((themeData as any).heroStyle || 'split') as HeroStyle
  )

  useEffect(() => {
    function update() {
      let heroStyle = (themeData as any).heroStyle || 'split'
      try {
        const saved = localStorage.getItem('foundlio-design')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.heroStyle) heroStyle = parsed.heroStyle
        }
      } catch {}
      setHero(heroStyle as HeroStyle)
    }
    update()
    window.addEventListener('foundlio-theme-change', update)
    return () => window.removeEventListener('foundlio-theme-change', update)
  }, [])

  return hero
}

export default function MediaMentions() {
  const effects = useVisualEffects()
  const heroStyle = useHeroStyle()
  const mediaBarStyle = useMediaBarStyle()
  const overrideName = useVerticalBusinessName()
  const verticalContent = useVerticalContentJson()

  const builder = VARIANT_BUILDERS[mediaBarStyle] || buildCertifications
  const { tagline: rawTagline, items } = builder()
  // Use vertical content.json mediaBar tagline if available
  const verticalTagline = verticalContent?.mediaBar?.tagline
  const baseTagline = verticalTagline || rawTagline
  const tagline = overrideName ? baseTagline.replace(businessData.name, overrideName) : baseTagline

  if (items.length === 0) return null

  const isLightHero = !['fullwidth', 'branded'].includes(heroStyle)
  const hasGradientBg = effects.gradientStyle !== 'none' && isLightHero
  const bgClass = hasGradientBg
    ? (effects.gradientStyle === 'vibrant' ? 'bg-gradient-theme-vibrant' : 'bg-gradient-theme-subtle')
    : 'bg-muted'

  return (
    <section className={`py-8 ${bgClass} ${hasGradientBg ? '-mt-px' : 'border-y border-slate-100'}`}>
      <Container>
        <FadeIn>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-12">
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">
            {tagline}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {items.map((mention, index) => {
              const Icon = mention.icon
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 text-slate-600"
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-semibold text-slate-900 text-sm leading-tight">
                      {mention.name}
                    </p>
                    <p className="text-xs text-slate-500">{mention.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        </FadeIn>
      </Container>
    </section>
  )
}

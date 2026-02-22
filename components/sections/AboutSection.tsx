'use client'

import { useState, useEffect } from 'react'
import { Heart, Target, Sparkles } from 'lucide-react'
import Container from '@/components/ui/Container'
import Card from '@/components/ui/Card'
import ImageWithFallback from '@/components/ui/ImageWithFallback'
import MeshBackground from '@/components/ui/MeshBackground'
import FadeIn, { FadeInStagger } from '@/components/ui/FadeIn'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import businessData from '@/data/business.json'
import { getAboutSectionContent } from '@/lib/content'
import { useVisualEffects } from '@/lib/gradientPresets'
import { useContentSwap, useVerticalContentJson } from '@/lib/useVerticalContent'
import themeData from '@/data/theme.json'

const aboutContent = getAboutSectionContent()

export type AboutStyle = 'story' | 'stats' | 'values'

function useAboutStyle(): AboutStyle {
  const [style, setStyle] = useState<AboutStyle>(
    ((themeData as any).aboutStyle as AboutStyle) || 'story'
  )

  useEffect(() => {
    function update() {
      try {
        const saved = localStorage.getItem('foundlio-design')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.aboutStyle) {
            setStyle(parsed.aboutStyle)
            return
          }
        }
      } catch {}
      setStyle(((themeData as any).aboutStyle as AboutStyle) || 'story')
    }
    update()
    window.addEventListener('foundlio-theme-change', update)
    return () => window.removeEventListener('foundlio-theme-change', update)
  }, [])

  return style
}

/* ── Story: Image placeholder left, text right ── */

function StoryVariant({ swap }: { swap: (t: string) => string }) {
  return (
    <FadeIn delay={0.15}>
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Team photo with graceful fallback */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
          <ImageWithFallback
            src="/images/team-photo.jpg"
            alt={`${swap(businessData.name)} team`}
            fill
            className="object-cover"
          />
        </div>

        {/* Story text */}
        <div className="space-y-4">
          {aboutContent.description.split('\n').filter(Boolean).map((paragraph, i) => (
            <p key={i} className="text-muted-foreground leading-relaxed">
              {swap(paragraph)}
            </p>
          ))}
        </div>
      </div>
    </FadeIn>
  )
}

/* ── Stats: Story text + 4 animated stat counters ── */

function StatsVariant() {
  const yearsInBusiness = new Date().getFullYear() - businessData.established

  const stats = [
    { value: yearsInBusiness, suffix: '+', label: 'Years Experience' },
    { value: businessData.reviewCount || 500, suffix: '+', label: 'Happy Customers' },
    { value: parseFloat(String(businessData.rating)) || 4.9, suffix: '', label: 'Star Rating', decimals: 1 },
    { value: 100, suffix: '%', label: 'Satisfaction Rate' },
  ]

  return (
    <div className="space-y-10">
      <FadeIn delay={0.15}>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto text-center">
          {aboutContent.description.split('\n')[0] || aboutContent.description}
        </p>
      </FadeIn>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <FadeInStagger key={stat.label} index={index} className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
              <AnimatedCounter
                end={stat.value}
                suffix={stat.suffix}
                decimals={stat.decimals || 0}
              />
            </div>
            <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
          </FadeInStagger>
        ))}
      </div>
    </div>
  )
}

/* ── Values: Mission statement + 3 value cards ── */

function ValuesVariant() {
  const defaultValues = [
    { icon: Heart, title: 'Customer First', description: 'Every decision starts with what\'s best for our customers.' },
    { icon: Target, title: 'Quality Work', description: 'We never cut corners. Every job done right, guaranteed.' },
    { icon: Sparkles, title: 'Integrity', description: 'Honest pricing, transparent communication, and trust you can count on.' },
  ]

  const values = aboutContent.values.length > 0
    ? aboutContent.values.map((v, i) => ({
        icon: [Heart, Target, Sparkles][i % 3],
        title: v.title,
        description: v.description,
      }))
    : defaultValues

  return (
    <div className="space-y-10">
      {aboutContent.mission && (
        <FadeIn delay={0.15}>
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xl text-foreground font-medium italic leading-relaxed">
              &ldquo;{aboutContent.mission}&rdquo;
            </p>
          </div>
        </FadeIn>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {values.map((value, index) => (
          <FadeInStagger key={value.title} index={index}>
            <Card padding="lg" className="text-center h-full">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <value.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </Card>
          </FadeInStagger>
        ))}
      </div>
    </div>
  )
}

/* ── Main Export ── */

export default function AboutSection() {
  const style = useAboutStyle()
  const effects = useVisualEffects()
  const swap = useContentSwap()
  const verticalContent = useVerticalContentJson()

  // Use vertical content.json aboutSection if available, fall back to deployed
  const about = verticalContent?.aboutSection
  const title = about?.title || swap(aboutContent.title)
  const subtitle = about?.subtitle || swap(aboutContent.subtitle)

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {effects.meshBackground && <MeshBackground variant="corner" intensity="subtle" />}
      <Container className="relative z-10">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-foreground mb-4">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
        </FadeIn>

        {style === 'story' && <StoryVariant swap={swap} />}
        {style === 'stats' && <StatsVariant />}
        {style === 'values' && <ValuesVariant />}
      </Container>
    </section>
  )
}

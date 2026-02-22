'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone, ArrowRight, Clock, Shield, Star } from 'lucide-react'
import Container from '@/components/ui/Container'
import FadeIn from '@/components/ui/FadeIn'
import MeshBackground from '@/components/ui/MeshBackground'
import { getColorValue, stampFillPath, stampInverseFillPath } from '@/components/ui/SectionDivider'
import type { DividerColor, DividerStyle } from '@/components/ui/SectionDivider'
import businessData from '@/data/business.json'
import themeData from '@/data/theme.json'
import { getCtaBannerContent } from '@/lib/content'
import { useVisualEffects } from '@/lib/gradientPresets'
import { useContentSwap, useVerticalContentJson } from '@/lib/useVerticalContent'

export type CTAStyle = 'standard' | 'centered' | 'card' | 'minimal'

const ctaContent = getCtaBannerContent()

function useCtaStyle(): CTAStyle {
  const [style, setStyle] = useState<CTAStyle>(
    ((themeData as any).ctaStyle as CTAStyle) || 'standard'
  )

  useEffect(() => {
    function update() {
      try {
        const saved = localStorage.getItem('foundlio-design')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.ctaStyle) {
            setStyle(parsed.ctaStyle)
            return
          }
        }
      } catch {}
      setStyle(((themeData as any).ctaStyle as CTAStyle) || 'standard')
    }
    update()
    window.addEventListener('foundlio-theme-change', update)
    return () => window.removeEventListener('foundlio-theme-change', update)
  }, [])

  return style
}

function useDividerStyle(): DividerStyle {
  const [style, setStyle] = useState<DividerStyle>(
    (themeData as any).sectionDivider || 'none'
  )

  useEffect(() => {
    function update() {
      try {
        const saved = localStorage.getItem('foundlio-design')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.sectionDivider) {
            setStyle(parsed.sectionDivider)
            return
          }
        }
      } catch {}
      setStyle((themeData as any).sectionDivider || 'none')
    }
    update()
    window.addEventListener('foundlio-theme-change', update)
    return () => window.removeEventListener('foundlio-theme-change', update)
  }, [])

  return style
}

interface CTABannerProps {
  title?: string
  description?: string
  variant?: 'blue' | 'dark' | 'gradient' | 'themed-gradient'
  ctaStyle?: CTAStyle
  showPhone?: boolean
  /** Color of the section above the CTA — used to fill the upper portion of the top wave */
  fromColor?: DividerColor
  /** Whether to show integrated wave dividers (top + bottom) */
  showDividers?: boolean
}

/* ── Standard: text left, buttons right ── */
function CTAStandard({ title, description, showPhone, effects }: {
  title: string; description: string; showPhone: boolean; effects: ReturnType<typeof useVisualEffects>
}) {
  return (
    <Container className="relative z-10 py-12 md:py-16">
      <FadeIn>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
              {title}
            </h2>
            <p className="text-white/70 text-lg">
              {description}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            {showPhone && (
              <a
                href={`tel:${businessData.phoneRaw}`}
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors"
              >
                <Phone className="h-5 w-5 mr-2" />
                {businessData.phone}
              </a>
            )}
            <Link
              href="/contact"
              className={`inline-flex items-center justify-center px-6 py-3 bg-transparent text-white font-semibold rounded-lg hover:bg-white/10 transition-colors border-2 border-white/30 ${
                effects.glassEffect !== 'none' ? 'backdrop-blur-sm' : ''
              }`}
            >
              Get Free Estimate
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </FadeIn>
    </Container>
  )
}

/* ── Centered: everything stacked center, decorative line + trust badges ── */
function CTACentered({ title, description, showPhone, effects }: {
  title: string; description: string; showPhone: boolean; effects: ReturnType<typeof useVisualEffects>
}) {
  return (
    <Container className="relative z-10 py-14 md:py-20">
      <FadeIn>
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          {/* Decorative accent line */}
          <div className="w-12 h-1 bg-white/40 rounded-full mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {title}
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-lg">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {showPhone && (
              <a
                href={`tel:${businessData.phoneRaw}`}
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors text-lg"
              >
                <Phone className="h-5 w-5 mr-2" />
                {businessData.phone}
              </a>
            )}
            <Link
              href="/contact"
              className={`inline-flex items-center justify-center px-8 py-3.5 bg-transparent text-white font-semibold rounded-lg hover:bg-white/10 transition-colors border-2 border-white/30 text-lg ${
                effects.glassEffect !== 'none' ? 'backdrop-blur-sm' : ''
              }`}
            >
              Get Free Estimate
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
          {/* Trust row */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-white/60 text-sm">
            <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" />Fast Response</span>
            <span className="inline-flex items-center gap-1.5"><Shield className="h-4 w-4" />Licensed & Insured</span>
            <span className="inline-flex items-center gap-1.5"><Star className="h-4 w-4" />{(businessData as any).rating || '5.0'} Rating</span>
          </div>
        </div>
      </FadeIn>
    </Container>
  )
}

/* ── Card: frosted card floating inside the colored section ── */
function CTACard({ title, description, showPhone, effects }: {
  title: string; description: string; showPhone: boolean; effects: ReturnType<typeof useVisualEffects>
}) {
  return (
    <Container className="relative z-10 py-12 md:py-16">
      <FadeIn>
        <div className={`rounded-2xl border border-white/20 px-8 py-10 md:px-12 md:py-12 ${
          effects.glassEffect !== 'none'
            ? 'bg-white/10 backdrop-blur-md'
            : 'bg-white/[0.07]'
        }`}>
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Left: text */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {title}
              </h2>
              <p className="text-white/70 text-lg max-w-lg">
                {description}
              </p>
            </div>
            {/* Right: phone number big + button */}
            <div className="flex flex-col items-center lg:items-end gap-4">
              {showPhone && (
                <a
                  href={`tel:${businessData.phoneRaw}`}
                  className="group flex flex-col items-center lg:items-end"
                >
                  <span className="text-white/50 text-xs uppercase tracking-wider mb-1">Call Now</span>
                  <span className="text-white text-2xl md:text-3xl font-bold group-hover:text-white/80 transition-colors flex items-center gap-2">
                    <Phone className="h-6 w-6" />
                    {businessData.phone}
                  </span>
                </a>
              )}
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors"
              >
                Get Free Estimate
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>
    </Container>
  )
}

/* ── Minimal: slim single-row strip ── */
function CTAMinimal({ title, showPhone, effects }: {
  title: string; description: string; showPhone: boolean; effects: ReturnType<typeof useVisualEffects>
}) {
  return (
    <Container className="relative z-10 py-6 md:py-8">
      <FadeIn>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <h2 className="text-lg md:text-xl font-semibold text-white whitespace-nowrap">
            {title}
          </h2>
          <div className="hidden sm:block w-px h-6 bg-white/30" />
          <div className="flex items-center gap-3">
            {showPhone && (
              <a
                href={`tel:${businessData.phoneRaw}`}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors text-sm"
              >
                <Phone className="h-4 w-4 mr-1.5" />
                {businessData.phone}
              </a>
            )}
            <Link
              href="/contact"
              className={`inline-flex items-center justify-center px-5 py-2.5 bg-transparent text-white font-semibold rounded-lg hover:bg-white/10 transition-colors border-2 border-white/30 text-sm ${
                effects.glassEffect !== 'none' ? 'backdrop-blur-sm' : ''
              }`}
            >
              Free Estimate
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Link>
          </div>
        </div>
      </FadeIn>
    </Container>
  )
}

export default function CTABanner({
  title: rawTitle = ctaContent.title,
  description: rawDescription = ctaContent.description,
  variant = 'blue',
  ctaStyle,
  showPhone = true,
  fromColor = 'white',
  showDividers = true,
}: CTABannerProps) {
  const effects = useVisualEffects()
  const dividerStyle = useDividerStyle()
  const themeCtaStyle = useCtaStyle()
  const activeCtaStyle = ctaStyle || themeCtaStyle
  const swap = useContentSwap()
  const verticalContent = useVerticalContentJson()

  // Use vertical content.json ctaBanner if available, fall back to props/deployed
  const ctaOverride = verticalContent?.ctaBanner
  const title = ctaOverride?.headline || ctaOverride?.title || swap(rawTitle)
  const description = ctaOverride?.description || swap(rawDescription)

  // Auto-upgrade to themed-gradient when gradient effects are enabled
  const effectiveVariant = (variant === 'blue' || variant === 'gradient') && effects.gradientStyle !== 'none'
    ? 'themed-gradient'
    : variant

  const variants: Record<string, string> = {
    blue: 'bg-primary',
    dark: 'bg-slate-900',
    gradient: 'bg-gradient-to-r from-primary to-[#0f172a]',
    'themed-gradient': 'bg-gradient-theme',
  }

  const bgClass = variants[effectiveVariant]
  const hasWaves = showDividers && dividerStyle !== 'none'
  const footerFill = getColorValue('footer')

  // Fill color for the UPPER portion of the top wave — matches the section above
  const topFill = getColorValue(fromColor)

  // No negative margin — waves sit inside the CTA section without overlapping the section above.
  // The top wave fills the upper portion with the section-above's color, creating a seamless transition.
  const topOverlapClass = ''

  // Wave SVG paths for top divider — inverse wave approach:
  // The UPPER portion is filled with the section-above's color (topFill);
  // the LOWER portion is transparent, letting the CTA's gradient background show through.
  const renderTopWave = () => {
    if (!hasWaves) return null

    if (dividerStyle === 'wave') {
      return (
        <div className="w-full" aria-hidden="true">
          <svg className="w-full h-12 md:h-16 lg:h-20 block" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 L1200,0 L1200,40 C1050,-3 850,80 600,40 C350,-3 150,80 0,40 Z" fill={topFill} />
          </svg>
        </div>
      )
    }
    if (dividerStyle === 'curve') {
      return (
        <div className="w-full" aria-hidden="true">
          <svg className="w-full h-10 md:h-14 lg:h-[4.5rem] block" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path d="M0,0 L1200,0 L1200,50 Q900,103 600,50 Q300,-3 0,50 Z" fill={topFill} />
          </svg>
        </div>
      )
    }
    if (dividerStyle === 'diagonal') {
      return (
        <div className="w-full" aria-hidden="true">
          <svg className="w-full h-4 md:h-6 lg:h-8 block" viewBox="0 0 1200 8" preserveAspectRatio="none">
            <polygon points="0,0 1200,0 1200,8" fill={topFill} />
          </svg>
        </div>
      )
    }
    if (dividerStyle === 'stamp') {
      return (
        <div className="w-full" aria-hidden="true">
          <svg className="w-full h-6 md:h-8 lg:h-10 block" viewBox="0 0 1200 40" preserveAspectRatio="none">
            <path d={stampInverseFillPath} fill={topFill} />
          </svg>
        </div>
      )
    }
    return null
  }

  // Wave SVG paths for bottom divider (footer fills lower portion)
  const renderBottomWave = () => {
    if (!hasWaves) return null

    if (dividerStyle === 'wave') {
      return (
        <div className="w-full" aria-hidden="true">
          <svg className="w-full h-12 md:h-16 lg:h-20 block" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,40 C150,80 350,-3 600,40 C850,80 1050,-3 1200,40 L1200,120 L0,120 Z" fill={footerFill} />
          </svg>
        </div>
      )
    }
    if (dividerStyle === 'curve') {
      return (
        <div className="w-full" aria-hidden="true">
          <svg className="w-full h-10 md:h-14 lg:h-[4.5rem] block" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path d="M0,50 Q300,-3 600,50 T1200,50 L1200,100 L0,100 Z" fill={footerFill} />
          </svg>
        </div>
      )
    }
    if (dividerStyle === 'diagonal') {
      return (
        <div className="w-full" aria-hidden="true">
          <svg className="w-full h-4 md:h-6 lg:h-8 block" viewBox="0 0 1200 8" preserveAspectRatio="none">
            <polygon points="0,0 0,8 1200,8" fill={footerFill} />
          </svg>
        </div>
      )
    }
    if (dividerStyle === 'stamp') {
      return (
        <div className="w-full" aria-hidden="true">
          <svg className="w-full h-6 md:h-8 lg:h-10 block" viewBox="0 0 1200 40" preserveAspectRatio="none">
            <path d={stampFillPath} fill={footerFill} />
          </svg>
        </div>
      )
    }
    return null
  }

  const contentProps = { title, description, showPhone, effects }

  return (
    <section className={`${bgClass} no-auto-padding relative -mb-1 ${topOverlapClass} ${hasWaves ? 'z-10' : ''}`}>
      {effects.meshBackground && effectiveVariant === 'themed-gradient' && (
        <MeshBackground variant="blobs" intensity="medium" />
      )}

      {/* Top wave divider — fills upper portion with section-above's color, transparent bottom shows CTA gradient */}
      {renderTopWave()}

      {/* CTA content — style determines inner layout */}
      {activeCtaStyle === 'centered' && <CTACentered {...contentProps} />}
      {activeCtaStyle === 'card' && <CTACard {...contentProps} />}
      {activeCtaStyle === 'minimal' && <CTAMinimal {...contentProps} />}
      {activeCtaStyle === 'standard' && <CTAStandard {...contentProps} />}

      {/* Bottom wave divider — seamless transition to footer */}
      {renderBottomWave()}
    </section>
  )
}

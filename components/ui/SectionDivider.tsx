'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import themeData from '@/data/theme.json'
import { useVisualEffects } from '@/lib/gradientPresets'
import type { HeroStyle } from '@/lib/headerHeroConfig'

export type DividerColor = 'white' | 'gray' | 'primary' | 'dark' | 'footer'
export type DividerStyle = 'none' | 'wave' | 'diagonal' | 'curve' | 'stamp'

export function getBgClass(color: DividerColor): string {
  switch (color) {
    case 'white': return 'bg-background'
    case 'gray': return 'bg-muted'
    case 'primary': return 'bg-primary'
    case 'dark': return 'bg-slate-950'
    case 'footer': return 'bg-[hsl(var(--footer-bg))]'
  }
}

export function getColorValue(color: DividerColor): string {
  switch (color) {
    case 'white': return 'hsl(var(--background))'
    case 'gray': return 'hsl(var(--muted))'
    case 'primary': return 'hsl(var(--primary))'
    case 'dark': return '#020617'
    case 'footer': return 'hsl(var(--footer-bg))'
  }
}

const colorLabels: Record<DividerColor, string> = {
  white: '#fff',
  gray: '#f1f5f9',
  primary: 'primary',
  dark: '#020617',
  footer: 'footer',
}

function useDividerStyle(styleProp?: DividerStyle): DividerStyle {
  const [style, setStyle] = useState<DividerStyle>(
    styleProp || (themeData as any).sectionDivider || 'none'
  )

  useEffect(() => {
    function update() {
      if (styleProp) {
        setStyle(styleProp) // sync when prop changes
        return
      }
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
  }, [styleProp])

  return style
}

// Stamp perforation edge — uniform small teeth with concave cuts between them
// Each tooth is a convex bump, each gap is a concave cut (like punched-out circles)
// Tooth width ~16px, cut radius ~5px — tightly packed like a real postal stamp
function buildStampPath(fill: boolean): string {
  const width = 1200
  const toothW = 16     // width of each tooth (convex bump)
  const cutR = 5        // radius of concave perforation cut
  const cutW = cutR * 2 // width consumed by each cut
  const step = toothW + cutW // one tooth + one cut
  const toothH = 6      // how tall each tooth sticks up
  const baseline = 20   // y position of the cut bottoms
  const segments: string[] = []
  let x = 0

  segments.push(`M0,${baseline}`)

  while (x < width) {
    // Tooth: smooth bump upward
    const toothEnd = Math.min(x + toothW, width)
    const mid = x + (toothEnd - x) / 2
    segments.push(`C${x + 3},${baseline - toothH} ${toothEnd - 3},${baseline - toothH} ${toothEnd},${baseline}`)
    x = toothEnd

    if (x >= width) break

    // Cut: concave semicircle downward (perforation hole)
    const cutEnd = Math.min(x + cutW, width)
    segments.push(`a${cutR},${cutR} 0 0,0 ${cutEnd - x},0`)
    x = cutEnd
  }

  if (fill) {
    segments.push(`L${width},40 L0,40 Z`)
  }

  return segments.join(' ')
}

export const stampLinePath = buildStampPath(false)
export const stampFillPath = buildStampPath(true)

// Inverse stamp: fills from top edge DOWN to the stamp teeth (for CTA top — section-above color on top)
// Uses the SAME tooth profile as the regular stamp (left-to-right) but fills above instead of below
function buildStampInversePath(): string {
  const width = 1200
  const toothW = 16
  const cutR = 5
  const cutW = cutR * 2
  const toothH = 6
  const baseline = 20
  const segments: string[] = []
  let x = 0

  // Start at baseline, draw identical tooth profile left-to-right
  segments.push(`M0,${baseline}`)

  while (x < width) {
    const toothEnd = Math.min(x + toothW, width)
    segments.push(`C${x + 3},${baseline - toothH} ${toothEnd - 3},${baseline - toothH} ${toothEnd},${baseline}`)
    x = toothEnd

    if (x >= width) break

    const cutEnd = Math.min(x + cutW, width)
    segments.push(`a${cutR},${cutR} 0 0,0 ${cutEnd - x},0`)
    x = cutEnd
  }

  // Close by filling ABOVE the tooth line (up to y=0) instead of below
  segments.push(`L${width},0 L0,0 Z`)

  return segments.join(' ')
}

export const stampInverseFillPath = buildStampInversePath()

interface SectionDividerProps {
  topColor?: DividerColor
  bottomColor?: DividerColor
  style?: DividerStyle
  inverted?: boolean
  label?: string
  /** When true, overrides topColor bg with the hero gradient bg when gradient effects are active */
  gradientTopWhenActive?: boolean
}

export default function SectionDivider({
  topColor = 'white',
  bottomColor = 'gray',
  style: styleProp,
  inverted = false,
  label,
  gradientTopWhenActive = false,
}: SectionDividerProps) {
  const searchParams = useSearchParams()
  const debug = searchParams.get('debug-dividers') !== null
  const dividerStyle = useDividerStyle(styleProp)
  const effects = useVisualEffects()
  const sameColor = topColor === bottomColor

  // Debug overlay
  const debugOverlay = debug ? (
    <div className="relative z-50">
      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono whitespace-nowrap"
        style={{ backgroundColor: 'rgba(239,68,68,0.9)', color: 'white', fontFamily: 'system-ui' }}>
        <span className="inline-block w-3 h-3 rounded-sm border border-white/50" style={{ backgroundColor: getColorValue(topColor) }} />
        <span>{colorLabels[topColor]}</span>
        <span>→</span>
        <span className="inline-block w-3 h-3 rounded-sm border border-white/50" style={{ backgroundColor: getColorValue(bottomColor) }} />
        <span>{colorLabels[bottomColor]}</span>
        <span className="opacity-70">|</span>
        <span>{sameColor ? `${dividerStyle} line` : dividerStyle}{inverted ? ' inv' : ''}</span>
        {label && <><span className="opacity-70">|</span><span className="opacity-70">{label}</span></>}
      </div>
    </div>
  ) : null

  const svgTransform = inverted ? 'scaleX(-1)' : undefined
  // When gradientTopWhenActive is set and gradient is active, override top bg with gradient
  // Only use gradient top when hero is NOT fullwidth (light heroes share gradient bg with media bar)
  const [heroStyle, setHeroStyle] = useState<HeroStyle>(
    ((themeData as any).heroStyle || 'split') as HeroStyle
  )
  useEffect(() => {
    function updateHero() {
      let hs = (themeData as any).heroStyle || 'split'
      try {
        const saved = localStorage.getItem('foundlio-design')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.heroStyle) hs = parsed.heroStyle
        }
      } catch {}
      setHeroStyle(hs as HeroStyle)
    }
    updateHero()
    window.addEventListener('foundlio-theme-change', updateHero)
    return () => window.removeEventListener('foundlio-theme-change', updateHero)
  }, [])

  if (dividerStyle === 'none') {
    if (debug) return debugOverlay
    return null
  }
  const useGradientTop = gradientTopWhenActive && effects.gradientStyle !== 'none' && !['fullwidth', 'branded'].includes(heroStyle)
  const gradientBgClass = effects.gradientStyle === 'vibrant' ? 'bg-gradient-theme-vibrant' : 'bg-gradient-theme-subtle'
  const bgClass = inverted
    ? getBgClass(bottomColor)
    : (useGradientTop ? gradientBgClass : getBgClass(topColor))

  // ─── LINE MODE (same color top & bottom) ───
  // Decorative SVG stroke instead of flat line — matches react-templates
  if (sameColor) {
    if (dividerStyle === 'wave') {
      return (
        <>
          <div className={`w-full ${bgClass}`} aria-hidden="true">
            <svg
              className="w-full h-12 md:h-16 lg:h-20 block"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              style={{ transform: svgTransform }}
            >
              <path
                d="M0,60 C150,90 350,30 600,60 C850,90 1050,30 1200,60"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1"
                fill="none"
                opacity="0.4"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          {debugOverlay}
        </>
      )
    }

    if (dividerStyle === 'curve') {
      return (
        <>
          <div className={`w-full ${bgClass}`} aria-hidden="true">
            <svg
              className="w-full h-10 md:h-14 lg:h-[4.5rem] block"
              viewBox="0 0 1200 100"
              preserveAspectRatio="none"
              style={{ transform: svgTransform }}
            >
              <path
                d="M0,50 Q300,20 600,50 T1200,50"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1"
                fill="none"
                opacity="0.4"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          {debugOverlay}
        </>
      )
    }

    if (dividerStyle === 'diagonal') {
      return (
        <>
          <div className={`w-full ${bgClass}`} aria-hidden="true">
            <svg
              className="w-full h-4 md:h-6 lg:h-8 block"
              viewBox="0 0 1200 8"
              preserveAspectRatio="none"
            >
              <line
                x1="0" y1="0" x2="1200" y2="8"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1"
                opacity="0.4"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          {debugOverlay}
        </>
      )
    }

    if (dividerStyle === 'stamp') {
      return (
        <>
          <div className={`w-full ${bgClass}`} aria-hidden="true">
            <svg
              className="w-full h-6 md:h-8 lg:h-10 block"
              viewBox="0 0 1200 40"
              preserveAspectRatio="none"
              style={{ transform: svgTransform }}
            >
              <path
                d={stampLinePath}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1"
                fill="none"
                opacity="0.4"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          {debugOverlay}
        </>
      )
    }

    return debugOverlay
  }

  // ─── FILL MODE (different colors) ───
  // Overlap approach: negative margin pulls wave up into section above.
  // Transparent top lets the section's actual bg (gradient or flat) show through.
  // Wave fills with bottom color, seamlessly connecting to the section below.
  const bottomFill = getColorValue(bottomColor)

  const topBgClass = useGradientTop ? gradientBgClass : getBgClass(topColor)

  if (dividerStyle === 'wave') {
    return (
      <>
        <div className={`w-full relative z-10 ${topBgClass}`} aria-hidden="true">
          <svg
            className="w-full h-12 md:h-16 lg:h-20 block"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            style={{ transform: svgTransform }}
          >
            <path
              d="M0,40 C150,80 350,-3 600,40 C850,80 1050,-3 1200,40 L1200,120 L0,120 Z"
              fill={bottomFill}
            />
          </svg>
        </div>
        {debugOverlay}
      </>
    )
  }

  if (dividerStyle === 'curve') {
    return (
      <>
        <div className={`w-full relative z-10 ${topBgClass}`} aria-hidden="true">
          <svg
            className="w-full h-10 md:h-14 lg:h-[4.5rem] block"
            viewBox="0 0 1200 100"
            preserveAspectRatio="none"
            style={{ transform: svgTransform }}
          >
            <path
              d="M0,50 Q300,-3 600,50 T1200,50 L1200,100 L0,100 Z"
              fill={bottomFill}
            />
          </svg>
        </div>
        {debugOverlay}
      </>
    )
  }

  if (dividerStyle === 'diagonal') {
    return (
      <>
        <div className={`w-full relative z-10 ${topBgClass}`} aria-hidden="true">
          <svg
            className="w-full h-4 md:h-6 lg:h-8 block"
            viewBox="0 0 1200 8"
            preserveAspectRatio="none"
          >
            <polygon
              points="0,0 0,8 1200,8"
              fill={bottomFill}
            />
          </svg>
        </div>
        {debugOverlay}
      </>
    )
  }

  if (dividerStyle === 'stamp') {
    return (
      <>
        <div className={`w-full relative z-10 ${topBgClass}`} aria-hidden="true">
          <svg
            className="w-full h-6 md:h-8 lg:h-10 block"
            viewBox="0 0 1200 40"
            preserveAspectRatio="none"
            style={{ transform: svgTransform }}
          >
            <path
              d={stampFillPath}
              fill={bottomFill}
            />
          </svg>
        </div>
        {debugOverlay}
      </>
    )
  }

  return debugOverlay
}

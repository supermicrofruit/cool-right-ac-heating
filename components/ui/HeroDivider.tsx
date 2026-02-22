'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { getColorValue, stampFillPath } from './SectionDivider'
import type { DividerStyle } from './SectionDivider'
import themeData from '@/data/theme.json'
import { useVisualEffects } from '@/lib/gradientPresets'

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

function useIsDarkHero(): boolean {
  const [isDark, setIsDark] = useState(() => {
    return ['fullwidth', 'branded'].includes((themeData as any).heroStyle || 'split')
  })

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
      setIsDark(['fullwidth', 'branded'].includes(heroStyle))
    }
    update()
    window.addEventListener('foundlio-theme-change', update)
    return () => window.removeEventListener('foundlio-theme-change', update)
  }, [])

  return isDark
}

export default function HeroDivider() {
  const dividerStyle = useDividerStyle()
  const isDarkHero = useIsDarkHero()
  const effects = useVisualEffects()
  const searchParams = useSearchParams()
  const debug = searchParams.get('debug-dividers') !== null

  // Dark heroes render the wave inside the hero section (DarkHeroBottomWave)
  // so transparent areas show the hero's own dark background
  if (isDarkHero) return null

  if (dividerStyle === 'none') {
    if (debug) return (
      <div className="relative z-50">
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono whitespace-nowrap"
          style={{ backgroundColor: 'rgba(239,68,68,0.9)', color: 'white', fontFamily: 'system-ui' }}>
          <span>hero → gray | none | Hero → Media</span>
        </div>
      </div>
    )
    return null
  }

  // When gradient effects are active, hero and media share the same gradient bg
  const hasGradientBg = effects.gradientStyle !== 'none'
  if (hasGradientBg) {
    if (debug) return (
      <div className="relative z-50">
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono whitespace-nowrap"
          style={{ backgroundColor: 'rgba(239,68,68,0.9)', color: 'white', fontFamily: 'system-ui' }}>
          <span>hero → media | gradient-match | Hero → Media (skipped)</span>
        </div>
      </div>
    )
    return null
  }

  const grayFill = getColorValue('gray')

  // Light heroes — pull wave up into hero bottom with negative margin
  if (dividerStyle === 'diagonal') {
    return (
      <>
        <div className="w-full relative z-10 -mt-4 md:-mt-6 lg:-mt-8" aria-hidden="true">
          <svg className="w-full h-4 md:h-6 lg:h-8 block" viewBox="0 0 1200 8" preserveAspectRatio="none">
            <polygon points="0,0 0,8 1200,8" fill={grayFill} />
          </svg>
        </div>
        {debug && (
          <div className="relative z-50">
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono whitespace-nowrap"
              style={{ backgroundColor: 'rgba(239,68,68,0.9)', color: 'white', fontFamily: 'system-ui' }}>
              <span>hero → gray | diagonal | Hero → Media</span>
            </div>
          </div>
        )}
      </>
    )
  }

  if (dividerStyle === 'stamp') {
    return (
      <>
        <div className="w-full relative z-10 -mt-6 md:-mt-8 lg:-mt-10" aria-hidden="true">
          <svg className="w-full h-6 md:h-8 lg:h-10 block" viewBox="0 0 1200 40" preserveAspectRatio="none">
            <path d={stampFillPath} fill={grayFill} />
          </svg>
        </div>
        {debug && (
          <div className="relative z-50">
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono whitespace-nowrap"
              style={{ backgroundColor: 'rgba(239,68,68,0.9)', color: 'white', fontFamily: 'system-ui' }}>
              <span>hero → gray | stamp | Hero → Media</span>
            </div>
          </div>
        )}
      </>
    )
  }

  const wavePath = dividerStyle === 'wave'
    ? 'M0,40 C150,80 350,-3 600,40 C850,80 1050,-3 1200,40 L1200,120 L0,120 Z'
    : dividerStyle === 'curve'
    ? 'M0,50 Q300,-3 600,50 T1200,50 L1200,100 L0,100 Z'
    : null

  if (!wavePath) return null

  const viewBox = dividerStyle === 'wave' ? '0 0 1200 120' : '0 0 1200 100'
  const heightClass = dividerStyle === 'wave'
    ? 'h-12 md:h-16 lg:h-20'
    : 'h-10 md:h-14 lg:h-[4.5rem]'
  const marginClass = dividerStyle === 'wave'
    ? '-mt-12 md:-mt-16 lg:-mt-20'
    : '-mt-10 md:-mt-14 lg:-mt-[4.5rem]'

  return (
    <>
      <div className={`w-full relative z-10 ${marginClass}`} aria-hidden="true">
        <svg
          className={`w-full ${heightClass} block`}
          viewBox={viewBox}
          preserveAspectRatio="none"
        >
          <path d={wavePath} fill={grayFill} />
        </svg>
      </div>
      {debug && (
        <div className="relative z-50">
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono whitespace-nowrap"
            style={{ backgroundColor: 'rgba(239,68,68,0.9)', color: 'white', fontFamily: 'system-ui' }}>
            <span>hero → gray | {dividerStyle} | Hero → Media</span>
          </div>
        </div>
      )}
    </>
  )
}

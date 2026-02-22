'use client'

import { useState, useEffect } from 'react'
import { getColorValue, stampFillPath } from './SectionDivider'
import type { DividerColor, DividerStyle } from './SectionDivider'
import themeData from '@/data/theme.json'

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

interface DarkHeroBottomWaveProps {
  fillColor?: DividerColor
}

/**
 * Wave/shape divider rendered INSIDE a dark hero section (absolute bottom).
 * Transparent areas show the hero's own background (photo/gradient).
 * Gray fill transitions seamlessly to the next section.
 */
export default function DarkHeroBottomWave({ fillColor = 'gray' }: DarkHeroBottomWaveProps) {
  const dividerStyle = useDividerStyle()

  if (dividerStyle === 'none') return null

  const fill = getColorValue(fillColor)

  if (dividerStyle === 'wave') {
    return (
      <div className="absolute bottom-0 left-0 right-0 z-20" aria-hidden="true">
        <svg className="w-full h-12 md:h-16 lg:h-20 block" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,40 C150,80 350,-3 600,40 C850,80 1050,-3 1200,40 L1200,120 L0,120 Z" fill={fill} />
        </svg>
      </div>
    )
  }

  if (dividerStyle === 'curve') {
    return (
      <div className="absolute bottom-0 left-0 right-0 z-20" aria-hidden="true">
        <svg className="w-full h-10 md:h-14 lg:h-[4.5rem] block" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <path d="M0,50 Q300,-3 600,50 T1200,50 L1200,100 L0,100 Z" fill={fill} />
        </svg>
      </div>
    )
  }

  if (dividerStyle === 'diagonal') {
    return (
      <div className="absolute bottom-0 left-0 right-0 z-20" aria-hidden="true">
        <svg className="w-full h-4 md:h-6 lg:h-8 block" viewBox="0 0 1200 8" preserveAspectRatio="none">
          <polygon points="0,0 0,8 1200,8" fill={fill} />
        </svg>
      </div>
    )
  }

  if (dividerStyle === 'stamp') {
    return (
      <div className="absolute bottom-0 left-0 right-0 z-20" aria-hidden="true">
        <svg className="w-full h-6 md:h-8 lg:h-10 block" viewBox="0 0 1200 40" preserveAspectRatio="none">
          <path d={stampFillPath} fill={fill} />
        </svg>
      </div>
    )
  }

  return null
}

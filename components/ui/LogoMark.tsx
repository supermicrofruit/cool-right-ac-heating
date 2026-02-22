'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import businessData from '@/data/business.json'
import themeData from '@/data/theme.json'
import { useDesignVertical } from '@/lib/useDesignFeatures'
import { useVerticalBusinessName } from '@/lib/useVerticalContent'
import {
  Wrench, Droplets, ShowerHead,
  Wind, Snowflake, Flame, Fan, Thermometer,
  Zap, Lightbulb, Plug,
  Sparkles, SprayCan, Brush, Droplet, Waves,
  Home, HardHat,
  TreePine, Leaf, Flower2,
  Paintbrush, Palette,
  Bug, Shield,
  DoorOpen, Car,
  Bath, Pipette, AirVent,
  type LucideIcon,
} from 'lucide-react'

// Vertical → Lucide icons (first is default, rest give variety via name hash)
const verticalIcons: Record<string, LucideIcon[]> = {
  plumbing:      [Wrench, Droplets, ShowerHead, Pipette, Bath],
  hvac:          [Wind, Snowflake, Flame, Thermometer, AirVent, Fan],
  electrical:    [Zap, Lightbulb, Plug],
  cleaning:      [Sparkles, SprayCan, Brush, Droplet, Waves],
  roofing:       [Home, HardHat],
  landscaping:   [TreePine, Leaf, Flower2],
  painting:      [Paintbrush, Palette],
  pest:          [Bug, Shield],
  'garage-door': [DoorOpen, Car],
}

// Icon name → component map (for localStorage override)
const iconByName: Record<string, LucideIcon> = {
  Wrench, Droplets, ShowerHead, Pipette, Bath,
  Wind, Snowflake, Flame, Fan, Thermometer, AirVent,
  Zap, Lightbulb, Plug,
  Sparkles, SprayCan, Brush, Droplet, Waves,
  Home, HardHat,
  TreePine, Leaf, Flower2,
  Paintbrush, Palette,
  Bug, Shield,
  DoorOpen, Car,
}

// All icon names per vertical (for randomization in DesignPanel)
export const verticalIconNames: Record<string, string[]> = {
  plumbing:      ['Wrench', 'Droplets', 'ShowerHead', 'Pipette', 'Bath'],
  hvac:          ['Wind', 'Snowflake', 'Flame', 'Thermometer', 'AirVent', 'Fan'],
  electrical:    ['Zap', 'Lightbulb', 'Plug'],
  cleaning:      ['Sparkles', 'SprayCan', 'Brush', 'Droplet', 'Waves'],
  roofing:       ['Home', 'HardHat'],
  landscaping:   ['TreePine', 'Leaf', 'Flower2'],
  painting:      ['Paintbrush', 'Palette'],
  pest:          ['Bug', 'Shield'],
  'garage-door': ['DoorOpen', 'Car'],
}

// Deterministic pick based on business name
function pickIcon(vertical: string, name: string): LucideIcon | null {
  const v = vertical.toLowerCase()
  const icons = verticalIcons[v] || Object.entries(verticalIcons).find(([k]) => v.includes(k))?.[1]
  if (!icons?.length) return null
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0
  return icons[Math.abs(hash) % icons.length]
}

// Resolve icon: override by name from localStorage, or hash-based default
function resolveIcon(overrideName?: string, vertical?: string): LucideIcon | null {
  if (overrideName && iconByName[overrideName]) return iconByName[overrideName]
  return pickIcon(vertical || businessData.vertical, businessData.name)
}

// Logo font config
const logoFontMap: Record<string, { cssVar: string; weight: number; uppercase: boolean }> = {
  oswald:             { cssVar: 'var(--font-oswald)', weight: 700, uppercase: true },
  'barlow-condensed': { cssVar: 'var(--font-barlow-condensed)', weight: 700, uppercase: true },
  'archivo-black':    { cssVar: 'var(--font-archivo-black)', weight: 400, uppercase: true },
  'saira-condensed':  { cssVar: 'var(--font-saira-condensed)', weight: 700, uppercase: true },
  'space-grotesk':    { cssVar: 'var(--font-space-grotesk)', weight: 700, uppercase: false },
  'big-shoulders':    { cssVar: 'var(--font-big-shoulders)', weight: 700, uppercase: true },
  outfit:             { cssVar: 'var(--font-outfit)', weight: 600, uppercase: false },
  nunito:             { cssVar: 'var(--font-nunito)', weight: 700, uppercase: false },
  'plus-jakarta':     { cssVar: 'var(--font-jakarta)', weight: 600, uppercase: false },
}
const defaultLogoFont = { cssVar: 'var(--font-oswald)', weight: 700, uppercase: true }

type IconStyle = 'filled-box' | 'naked' | 'outline-box' | 'circle'

// Static values
const rawSrc = (businessData as any).theme?.logomark || (businessData as any).theme?.logo || ''
const logomarkSrc = rawSrc && rawSrc !== '/images/logomark.png' ? rawSrc : ''

interface LogoSettings {
  iconStyle: IconStyle
  logoFont: typeof defaultLogoFont
  icon: LucideIcon | null
}

// Read logo settings from localStorage (DesignPanel) or fall back to theme.json
function getLogoSettings(vertical?: string): LogoSettings {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('foundlio-design')
      if (saved) {
        const parsed = JSON.parse(saved)
        const style = parsed.logoIconStyle || (themeData as any).logoIconStyle || 'naked'
        const fontKey = parsed.logoFont || (themeData as any).logoFont || 'oswald'
        return {
          iconStyle: style as IconStyle,
          logoFont: logoFontMap[fontKey] || defaultLogoFont,
          icon: resolveIcon(parsed.logoIcon, vertical),
        }
      }
    } catch {}
  }
  return {
    iconStyle: ((themeData as any).logoIconStyle || 'naked') as IconStyle,
    logoFont: logoFontMap[(themeData as any).logoFont || ''] || defaultLogoFont,
    icon: resolveIcon((themeData as any).logoIcon, vertical),
  }
}

const sizes = {
  sm: { box: 28, icon: 16, nakedIcon: 22, text: 'text-xs',  gap: 'gap-1.5', stackGap: 'gap-0.5', radius: 6 },
  md: { box: 34, icon: 20, nakedIcon: 28, text: 'text-sm',  gap: 'gap-2',   stackGap: 'gap-0.5', radius: 7 },
  lg: { box: 40, icon: 22, nakedIcon: 32, text: 'text-base', gap: 'gap-2.5', stackGap: 'gap-1', radius: 8 },
  xl: { box: 52, icon: 28, nakedIcon: 42, text: 'text-sm',  gap: 'gap-3',   stackGap: 'gap-1', radius: 10 },
} as const

interface LogoMarkProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'dark' | 'light'
  layout?: 'horizontal' | 'stacked'
  isScrolled?: boolean
}

export default function LogoMark({ size = 'md', variant = 'dark', layout = 'horizontal', isScrolled = false }: LogoMarkProps) {
  const vertical = useDesignVertical()
  const overrideName = useVerticalBusinessName()
  const displayName = overrideName || businessData.name
  const [imgError, setImgError] = useState(false)
  const [logoSettings, setLogoSettings] = useState(() => getLogoSettings(vertical))

  // Re-read settings when localStorage changes (from DesignPanel) or vertical changes
  useEffect(() => {
    const onStorage = () => setLogoSettings(getLogoSettings(vertical))

    // Initial sync with current vertical
    setLogoSettings(getLogoSettings(vertical))

    // Listen for cross-tab storage events
    window.addEventListener('storage', onStorage)

    // Also poll for same-tab changes (localStorage doesn't fire storage event in same tab)
    const interval = setInterval(onStorage, 300)

    return () => {
      window.removeEventListener('storage', onStorage)
      clearInterval(interval)
    }
  }, [vertical])

  const { iconStyle, logoFont, icon: FallbackIcon } = logoSettings
  const s = sizes[size]
  const isStacked = layout === 'stacked'
  const accentColor = 'hsl(var(--primary))'
  const showImage = logomarkSrc && !imgError

  const getIconColor = () => {
    if (variant === 'light') return 'white'
    return iconStyle === 'filled-box' || iconStyle === 'circle' ? 'white' : accentColor
  }

  const getTextColor = () => {
    if (variant === 'light') return 'white'
    if (iconStyle === 'naked') return accentColor
    return undefined
  }

  const renderFallbackIcon = (IconComp: LucideIcon) => {
    const iconColor = getIconColor()

    switch (iconStyle) {
      case 'naked':
        return (
          <div className="flex-shrink-0 flex items-center justify-center" style={{ width: s.box, height: s.box }}>
            <IconComp size={s.nakedIcon} color={iconColor} strokeWidth={1.8} />
          </div>
        )
      case 'outline-box':
        return (
          <div
            className="flex-shrink-0 flex items-center justify-center"
            style={{
              width: s.box,
              height: s.box,
              border: `2px solid ${variant === 'light' ? 'white' : accentColor}`,
              borderRadius: s.radius,
            }}
          >
            <IconComp size={s.icon} color={iconColor} strokeWidth={2} />
          </div>
        )
      case 'circle':
        return (
          <div
            className="flex-shrink-0 flex items-center justify-center"
            style={{
              width: s.box,
              height: s.box,
              backgroundColor: accentColor,
              borderRadius: '50%',
            }}
          >
            <IconComp size={s.icon} color={iconColor} strokeWidth={2} />
          </div>
        )
      case 'filled-box':
      default:
        return (
          <div
            className="flex-shrink-0 flex items-center justify-center"
            style={{
              width: s.box,
              height: s.box,
              backgroundColor: accentColor,
              borderRadius: s.radius,
            }}
          >
            <IconComp size={s.icon} color={iconColor} strokeWidth={2} />
          </div>
        )
    }
  }

  const textColor = getTextColor()

  return (
    <div
      className={`flex ${isStacked ? `flex-col items-center ${s.stackGap}` : `items-center ${s.gap}`} transition-transform duration-300`}
      style={{
        transform: isScrolled ? 'scale(0.9)' : 'scale(1)',
        transformOrigin: isStacked ? 'center center' : 'left center',
      }}
    >
      {/* Icon */}
      {showImage ? (
        <div
          className="flex-shrink-0 flex items-center justify-center"
          style={{ width: s.box, height: s.box }}
        >
          <Image
            src={logomarkSrc}
            alt={`${displayName} logo`}
            width={s.box}
            height={s.box}
            className="object-contain"
            style={{
              width: s.box,
              height: s.box,
              ...(variant === 'light' && { filter: 'brightness(0) invert(1)' }),
            }}
            priority
            onError={() => setImgError(true)}
          />
        </div>
      ) : FallbackIcon ? (
        renderFallbackIcon(FallbackIcon)
      ) : (
        <div
          className="flex-shrink-0 flex items-center justify-center"
          style={{ width: s.box, height: s.box }}
        >
          <span
            className="font-bold leading-none"
            style={{ fontSize: s.box * 0.75, color: variant === 'light' ? 'white' : accentColor }}
          >
            {displayName.charAt(0)}
          </span>
        </div>
      )}

      {/* Company name */}
      <span
        className={`leading-tight ${s.text} ${!textColor ? (variant === 'light' ? 'text-white' : 'text-gray-900') : ''}`}
        style={{
          fontFamily: logoFont.cssVar,
          fontWeight: logoFont.weight,
          textTransform: logoFont.uppercase ? 'uppercase' : 'none',
          letterSpacing: '0.05em',
          ...(textColor ? { color: textColor } : {}),
        }}
      >
        {displayName}
      </span>
    </div>
  )
}

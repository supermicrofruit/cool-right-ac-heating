'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Shuffle,
  Wrench,
  Droplets,
  ShowerHead,
  Pipette,
  Bath,
  Wind,
  Snowflake,
  Flame,
  Thermometer,
  AirVent,
  Sparkles,
  SprayCan,
  Brush,
  Droplet,
  Waves,
  Gem,
  type LucideIcon,
} from 'lucide-react'
import themeData from '@/data/theme.json'
import businessData from '@/data/business.json'

// ─── Vertical Config ───────────────────────────────────────────

type Vertical = 'plumbing' | 'hvac' | 'cleaning'

interface FontOption {
  name: string
  cssVar: string
  weight: number
  uppercase: boolean
}

interface VerticalConfig {
  icons: { name: string; icon: LucideIcon }[]
}

// All 9 logo fonts — shared across all verticals
const allLogoFonts: FontOption[] = [
  { name: 'Oswald', cssVar: 'var(--font-oswald)', weight: 700, uppercase: true },
  { name: 'Barlow Condensed', cssVar: 'var(--font-barlow-condensed)', weight: 700, uppercase: true },
  { name: 'Archivo Black', cssVar: 'var(--font-archivo-black)', weight: 400, uppercase: true },
  { name: 'Saira Condensed', cssVar: 'var(--font-saira-condensed)', weight: 700, uppercase: true },
  { name: 'Space Grotesk', cssVar: 'var(--font-space-grotesk)', weight: 700, uppercase: false },
  { name: 'Big Shoulders', cssVar: 'var(--font-big-shoulders)', weight: 700, uppercase: true },
  { name: 'Outfit', cssVar: 'var(--font-outfit)', weight: 600, uppercase: false },
  { name: 'Nunito', cssVar: 'var(--font-nunito)', weight: 700, uppercase: false },
  { name: 'Plus Jakarta Sans', cssVar: 'var(--font-jakarta)', weight: 600, uppercase: false },
]

const verticalConfigs: Record<Vertical, VerticalConfig> = {
  plumbing: {
    icons: [
      { name: 'Wrench', icon: Wrench },
      { name: 'Droplets', icon: Droplets },
      { name: 'ShowerHead', icon: ShowerHead },
      { name: 'Pipette', icon: Pipette },
      { name: 'Bath', icon: Bath },
    ],
  },
  hvac: {
    icons: [
      { name: 'Wind', icon: Wind },
      { name: 'Snowflake', icon: Snowflake },
      { name: 'Flame', icon: Flame },
      { name: 'Thermometer', icon: Thermometer },
      { name: 'AirVent', icon: AirVent },
    ],
  },
  cleaning: {
    icons: [
      { name: 'Sparkles', icon: Sparkles },
      { name: 'SprayCan', icon: SprayCan },
      { name: 'Brush', icon: Brush },
      { name: 'Droplet', icon: Droplet },
      { name: 'Waves', icon: Waves },
    ],
  },
}

// ─── Icon Styles ───────────────────────────────────────────────

type IconStyle = 'filled-box' | 'naked' | 'outline-box' | 'circle'

const iconStyles: { id: IconStyle; label: string }[] = [
  { id: 'filled-box', label: 'Filled' },
  { id: 'naked', label: 'Naked' },
  { id: 'outline-box', label: 'Outline' },
  { id: 'circle', label: 'Circle' },
]

// ─── Logo Preview Component ────────────────────────────────────

function LogoPreview({
  icon: Icon,
  companyName,
  font,
  accentColor,
  layout,
  size,
  iconStyle,
}: {
  icon: LucideIcon
  companyName: string
  font: FontOption
  accentColor: string
  layout: 'horizontal' | 'stacked'
  size: 'sm' | 'md' | 'lg'
  iconStyle: IconStyle
}) {
  const sizeMap = {
    sm: { box: 28, icon: 16, nakedIcon: 22, text: '0.7rem', gap: 6, tracking: '0.05em' },
    md: { box: 40, icon: 22, nakedIcon: 32, text: '0.875rem', gap: 8, tracking: '0.05em' },
    lg: { box: 64, icon: 36, nakedIcon: 48, text: '1.25rem', gap: 12, tracking: '0.06em' },
  }
  const s = sizeMap[size]

  const renderIcon = () => {
    switch (iconStyle) {
      case 'naked':
        return (
          <div className="flex items-center justify-center shrink-0" style={{ width: s.box, height: s.box }}>
            <Icon size={s.nakedIcon} color={accentColor} strokeWidth={1.8} />
          </div>
        )
      case 'outline-box':
        return (
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: s.box,
              height: s.box,
              border: `2px solid ${accentColor}`,
              borderRadius: s.box * 0.2,
            }}
          >
            <Icon size={s.icon} color={accentColor} strokeWidth={2} />
          </div>
        )
      case 'circle':
        return (
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: s.box,
              height: s.box,
              backgroundColor: accentColor,
              borderRadius: '50%',
            }}
          >
            <Icon size={s.icon} color="white" strokeWidth={2} />
          </div>
        )
      case 'filled-box':
      default:
        return (
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: s.box,
              height: s.box,
              backgroundColor: accentColor,
              borderRadius: s.box * 0.2,
            }}
          >
            <Icon size={s.icon} color="white" strokeWidth={2} />
          </div>
        )
    }
  }

  // For naked style, text matches accent color
  const textColor = iconStyle === 'naked' ? accentColor : undefined

  return (
    <div
      className={`flex items-center ${layout === 'stacked' ? 'flex-col' : ''}`}
      style={{ gap: s.gap }}
    >
      {renderIcon()}
      <span
        style={{
          fontFamily: font.cssVar,
          fontWeight: font.weight,
          fontSize: s.text,
          letterSpacing: s.tracking,
          textTransform: font.uppercase ? 'uppercase' : 'none',
          lineHeight: 1.1,
          textAlign: layout === 'stacked' ? 'center' : 'left',
          color: textColor,
        }}
      >
        {companyName}
      </span>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────

export default function LogoMaker() {
  if (process.env.NODE_ENV === 'production') return null

  const [isOpen, setIsOpen] = useState(false)
  const [vertical, setVertical] = useState<Vertical>('plumbing')
  const [selectedIconIdx, setSelectedIconIdx] = useState(0)
  const [selectedFontIdx, setSelectedFontIdx] = useState(0)
  const [companyName, setCompanyName] = useState(businessData.name || 'Company Name')
  const [accentColor, setAccentColor] = useState(
    (themeData as any).accentColor || '#0d9488'
  )
  const [layout, setLayout] = useState<'horizontal' | 'stacked'>('horizontal')
  const [iconStyle, setIconStyle] = useState<IconStyle>('filled-box')

  const config = verticalConfigs[vertical]
  const selectedIcon = config.icons[selectedIconIdx] || config.icons[0]
  const selectedFont = allLogoFonts[selectedFontIdx] || allLogoFonts[0]

  function randomize() {
    const iconIdx = Math.floor(Math.random() * config.icons.length)
    const fontIdx = Math.floor(Math.random() * allLogoFonts.length)
    const styleIdx = Math.floor(Math.random() * iconStyles.length)
    setSelectedIconIdx(iconIdx)
    setSelectedFontIdx(fontIdx)
    setIconStyle(iconStyles[styleIdx].id)
  }

  function switchVertical(v: Vertical) {
    setVertical(v)
    setSelectedIconIdx(0)
    setSelectedFontIdx(0)
  }

  return (
    <>
      {/* Toggle Button - positioned above DesignPanel */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 left-4 z-[9999] w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-2xl shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        title="Logo Maker"
      >
        {isOpen ? <X size={20} /> : <Gem size={20} />}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-[136px] left-4 z-[9998] w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col"
            style={{ maxHeight: 'calc(100vh - 160px)' }}
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-2xl shrink-0">
              <div className="flex items-center justify-between" style={{ fontFamily: 'system-ui' }}>
                <div className="text-sm font-semibold">Logo Maker</div>
                <button
                  onClick={randomize}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  title="Randomize"
                >
                  <Shuffle size={15} />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-4 space-y-4" style={{ fontFamily: 'system-ui' }}>
              {/* Vertical Tabs */}
              <div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Vertical</div>
                <div className="flex gap-1">
                  {(['plumbing', 'hvac', 'cleaning'] as Vertical[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => switchVertical(v)}
                      className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        vertical === v
                          ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon Picker */}
              <div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Icon</div>
                <div className="flex gap-2">
                  {config.icons.map((item, idx) => {
                    const IconComp = item.icon
                    return (
                      <button
                        key={item.name}
                        onClick={() => setSelectedIconIdx(idx)}
                        className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
                          selectedIconIdx === idx
                            ? 'ring-2 ring-emerald-500 bg-emerald-50 scale-105'
                            : 'bg-slate-100 hover:bg-slate-200'
                        }`}
                        title={item.name}
                      >
                        <IconComp size={22} className="text-slate-700" />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Font Picker */}
              <div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Font</div>
                <div className="space-y-1.5">
                  {allLogoFonts.map((font, idx) => (
                    <button
                      key={font.name}
                      onClick={() => setSelectedFontIdx(idx)}
                      className={`w-full px-3 py-2 text-left rounded-lg transition-all ${
                        selectedFontIdx === idx
                          ? 'ring-2 ring-emerald-500 bg-emerald-50'
                          : 'bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      <span
                        style={{
                          fontFamily: font.cssVar,
                          fontWeight: font.weight,
                          textTransform: font.uppercase ? 'uppercase' : 'none',
                          letterSpacing: '0.05em',
                          fontSize: '0.875rem',
                        }}
                      >
                        {font.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Company Name */}
              <div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Company Name</div>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Icon Style */}
              <div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Icon Style</div>
                <div className="flex gap-1">
                  {iconStyles.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setIconStyle(s.id)}
                      className={`flex-1 px-2 py-1.5 text-[11px] font-medium rounded-lg transition-colors ${
                        iconStyle === s.id
                          ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color + Layout Row */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Accent Color</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer"
                    />
                    <span className="text-xs text-slate-500 font-mono">{accentColor}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Layout</div>
                  <div className="flex gap-1">
                    {(['horizontal', 'stacked'] as const).map((l) => (
                      <button
                        key={l}
                        onClick={() => setLayout(l)}
                        className={`flex-1 px-2 py-1.5 text-[11px] font-medium rounded-lg transition-colors ${
                          layout === l
                            ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {l === 'horizontal' ? 'Horiz' : 'Stack'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Preview</div>

                {/* Light background */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4 mb-2">
                  <div className="text-[10px] text-slate-400 mb-2">Light</div>
                  <LogoPreview
                    icon={selectedIcon.icon}
                    companyName={companyName}
                    font={selectedFont}
                    accentColor={accentColor}
                    layout={layout}
                    size="lg"
                    iconStyle={iconStyle}
                  />
                  <LogoPreview
                    icon={selectedIcon.icon}
                    companyName={companyName}
                    font={selectedFont}
                    accentColor={accentColor}
                    layout={layout}
                    size="md"
                    iconStyle={iconStyle}
                  />
                  <LogoPreview
                    icon={selectedIcon.icon}
                    companyName={companyName}
                    font={selectedFont}
                    accentColor={accentColor}
                    layout={layout}
                    size="sm"
                    iconStyle={iconStyle}
                  />
                </div>

                {/* Dark background */}
                <div className="bg-slate-900 rounded-xl p-4 space-y-4">
                  <div className="text-[10px] text-slate-500 mb-2">Dark</div>
                  <div className="text-white">
                    <LogoPreview
                      icon={selectedIcon.icon}
                      companyName={companyName}
                      font={selectedFont}
                      accentColor={accentColor}
                      layout={layout}
                      size="lg"
                    />
                  </div>
                  <div className="text-white">
                    <LogoPreview
                      icon={selectedIcon.icon}
                      companyName={companyName}
                      font={selectedFont}
                      accentColor={accentColor}
                      layout={layout}
                      size="md"
                    />
                  </div>
                  <div className="text-white">
                    <LogoPreview
                      icon={selectedIcon.icon}
                      companyName={companyName}
                      font={selectedFont}
                      accentColor={accentColor}
                      layout={layout}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

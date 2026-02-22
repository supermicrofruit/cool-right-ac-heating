'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Palette,
  LayoutTemplate,
  Square,
  Copy,
  Check,
  RefreshCw,
  X,
  Layers,
  LayoutList,
  PanelsTopLeft,
  FolderTree,
  Footprints,
  Type,
  Menu,
  Shuffle,
  Waves,
  Sparkles,
  Image,
  SlidersHorizontal,
  Home,
  Settings,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  BookOpen,
  Shield,
  Users,
  Undo2,
  Award,
} from 'lucide-react'
import themeDefaults from '@/data/theme.json'
import businessData from '@/data/business.json'
import hvacTheme from '@/content/verticals/hvac/theme.json'
import plumbingTheme from '@/content/verticals/plumbing/theme.json'
import electricalTheme from '@/content/verticals/electrical/theme.json'
import cleaningTheme from '@/content/verticals/cleaning/theme.json'
import roofingTheme from '@/content/verticals/roofing/theme.json'
import landscapingTheme from '@/content/verticals/landscaping/theme.json'
import { type VisualEffectsConfig, defaultVisualEffects } from '@/lib/gradientPresets'
import { verticalIconNames } from '@/components/ui/LogoMark'
import { type DesignFeatures, getDefaultFeatures } from '@/lib/useDesignFeatures'

const verticalThemes: Record<string, any> = {
  hvac: hvacTheme,
  plumbing: plumbingTheme,
  electrical: electricalTheme,
  cleaning: cleaningTheme,
  roofing: roofingTheme,
  landscaping: landscapingTheme,
}

// ─── Option Data ───────────────────────────────────────────────

const originalColorOptions = [
  { id: 'fresh-teal', name: 'Fresh Teal', preview: '#0d9488' },
  { id: 'ocean-blue', name: 'Ocean Blue', preview: '#0284c7' },
  { id: 'forest-green', name: 'Forest Green', preview: '#16a34a' },
  { id: 'sunset-orange', name: 'Sunset Orange', preview: '#ea580c' },
  { id: 'royal-purple', name: 'Royal Purple', preview: '#7c3aed' },
  { id: 'slate-professional', name: 'Slate Pro', preview: '#475569' },
  { id: 'warm-terracotta', name: 'Terracotta', preview: '#c2410c' },
  { id: 'midnight-navy', name: 'Navy', preview: '#1e3a5f' },
]

const reactTemplateColorOptions = [
  { id: 'blue-classic', name: 'Blue Classic', preview: '#1e3a8a' },
  { id: 'orange-classic', name: 'Orange Classic', preview: '#f54a00' },
  { id: 'teal-classic', name: 'Teal Classic', preview: '#006666' },
  { id: 'green-classic', name: 'Green Classic', preview: '#2e7d32' },
  { id: 'red-classic', name: 'Red Classic', preview: '#b91c1c' },
  { id: 'yellow-classic', name: 'Yellow Classic', preview: '#eab308' },
  { id: 'amber-minimal', name: 'Amber Minimal', preview: '#f59e0b' },
  { id: 'green-fall', name: 'Green Fall', preview: '#8b5a2b' },
]

const heroOptions = [
  { id: 'split', name: 'Split', desc: 'Text left, photo right' },
  { id: 'split-form', name: 'Split + Form', desc: 'Text + form, photo right' },
  { id: 'fullwidth', name: 'Fullwidth', desc: 'Dark photo background' },
  { id: 'compact', name: 'Compact', desc: 'Smaller, photo on side' },
  { id: 'diagonal', name: 'Diagonal', desc: 'Angled image split' },
  { id: 'mosaic', name: 'Mosaic', desc: 'Multi-image grid' },
  { id: 'branded', name: 'Branded', desc: 'Accent panel + photo' },
]

const cardOptions = [
  { id: 'elevated', name: 'Elevated', desc: 'Shadow, no border' },
  { id: 'bordered', name: 'Bordered', desc: 'Border, no shadow' },
  { id: 'flat', name: 'Flat', desc: 'Gray background' },
  { id: 'glass', name: 'Glass', desc: 'Glassmorphism' },
]

const radiusOptions = [
  { id: 'sharp', name: 'Sharp', preview: '0' },
  { id: 'subtle', name: 'Subtle', preview: '4px' },
  { id: 'rounded', name: 'Rounded', preview: '12px' },
  { id: 'pill', name: 'Pill', preview: '9999px' },
]

const serviceStyleOptions = [
  { id: 'cards', name: 'Cards', desc: 'Standard card grid' },
  { id: 'list', name: 'List', desc: 'Horizontal list items' },
  { id: 'compact', name: 'Compact', desc: 'Smaller, more items' },
  { id: 'minimal', name: 'Minimal', desc: 'Icons only' },
  { id: 'image-cards', name: 'Image Cards', desc: 'Photo + content below' },
  { id: 'image-overlap', name: 'Image Overlap', desc: 'Overlapping card on photo' },
  { id: 'image-hover', name: 'Image Hover', desc: 'Photo with hover reveal' },
]

const pageStyleOptions = [
  { id: 'standard', name: 'Standard', desc: 'Default spacing' },
  { id: 'compact', name: 'Compact', desc: 'Denser content' },
  { id: 'spacious', name: 'Spacious', desc: 'More breathing room' },
]

const serviceGroupingOptions = [
  { id: 'flat', name: 'Flat', desc: 'All in one list' },
  { id: 'grouped', name: 'By Category', desc: 'Grouped with headers' },
]

const galleryStyleOptions = [
  { id: 'cards', name: 'Cards', desc: 'Equal-size card grid' },
  { id: 'masonry', name: 'Masonry', desc: 'Featured + mixed grid' },
  { id: 'showcase', name: 'Showcase', desc: 'Hero card + grid' },
  { id: 'minimal', name: 'Minimal', desc: 'Horizontal list rows' },
]

const footerStyleOptions = [
  { id: 'standard', name: 'Standard', desc: 'Full multi-column' },
  { id: 'minimal', name: 'Minimal', desc: 'Compact single row' },
  { id: 'centered', name: 'Centered', desc: 'Logo & links centered' },
  { id: 'simple', name: 'Simple', desc: 'Just essentials' },
]

const processStyleOptions = [
  { id: 'cards', name: 'Cards', desc: 'Icon boxes with connectors' },
  { id: 'timeline', name: 'Timeline', desc: 'Vertical alternating' },
  { id: 'numbered', name: 'Numbered', desc: 'Large numbers in cards' },
]

const ctaStyleOptions = [
  { id: 'standard', name: 'Standard', desc: 'Text left, buttons right' },
  { id: 'centered', name: 'Centered', desc: 'Stacked center, trust row' },
  { id: 'card', name: 'Card', desc: 'Frosted card, big phone' },
  { id: 'minimal', name: 'Minimal', desc: 'Slim single-row strip' },
]

const faqStyleOptions = [
  { id: 'accordion', name: 'Accordion', desc: 'Expandable Q&A' },
  { id: 'two-column', name: 'Two Column', desc: 'Side-by-side layout' },
  { id: 'cards', name: 'Cards', desc: 'Card per question' },
  { id: 'minimal', name: 'Minimal', desc: 'Simple text list' },
]

const testimonialsStyleOptions = [
  { id: 'carousel', name: 'Carousel', desc: '3-card slider with dots' },
  { id: 'grid', name: 'Grid', desc: 'Static 3-column grid' },
  { id: 'featured', name: 'Featured', desc: '1 large + 2 stacked' },
  { id: 'minimal', name: 'Minimal', desc: 'Quotes with dividers' },
  { id: 'wall', name: 'Wall', desc: 'Masonry card wall' },
]

const trustStyleOptions = [
  { id: 'grid', name: 'Grid', desc: '6-column icon grid' },
  { id: 'cards', name: 'Cards', desc: 'Bordered icon cards' },
  { id: 'banner', name: 'Banner', desc: 'Horizontal row' },
  { id: 'compact', name: 'Compact', desc: 'Icon + title only' },
]

const aboutStyleOptions = [
  { id: 'story', name: 'Story', desc: 'Image + story text' },
  { id: 'stats', name: 'Stats', desc: 'Story + stat counters' },
  { id: 'values', name: 'Values', desc: 'Mission + value cards' },
]

const blogStyleOptions = [
  { id: 'cards', name: 'Cards', desc: '3-column post cards' },
  { id: 'list', name: 'List', desc: 'Compact horizontal rows' },
  { id: 'featured', name: 'Featured', desc: '1 large + 2 small' },
]

const mediaBarStyleOptions = [
  { id: 'certifications', name: 'Certifications', desc: 'BBB, licenses, ratings' },
  { id: 'stats', name: 'Stats', desc: 'Numbers & metrics' },
  { id: 'value-props', name: 'Value Props', desc: 'Free estimates, guarantees' },
  { id: 'social-proof', name: 'Social Proof', desc: 'Reviews & trust signals' },
  { id: 'guarantees', name: 'Guarantees', desc: 'Promises & commitments' },
]

const servicePageStyleOptions = [
  { id: 'standard', name: 'Standard', desc: 'Two-column with sidebar card' },
  { id: 'sidebar', name: 'Sidebar', desc: 'Full hero + sticky sidebar' },
  { id: 'fullwidth', name: 'Fullwidth', desc: 'Bold full-width sections' },
]

const areaPageStyleOptions = [
  { id: 'standard', name: 'Standard', desc: 'Two-column hero layout' },
  { id: 'mapfocus', name: 'Map Focus', desc: 'Neighborhood grid emphasis' },
  { id: 'localhero', name: 'Local Hero', desc: 'Large hero, local focus' },
]

const contactFormStyleOptions = [
  { id: 'simple', name: 'Simple', desc: 'Name, phone, message' },
  { id: 'detailed', name: 'Detailed', desc: 'Full form with service' },
  { id: 'zip-funnel', name: 'Zip Funnel', desc: '3-step zip → service → info' },
  { id: 'booking', name: 'Booking', desc: 'Date picker + time slots' },
]

const headerStyleOptions = [
  { id: 'standard', name: 'Standard', desc: 'Logo → Nav → Phone + CTA' },
  { id: 'trust-bar', name: 'Trust Bar', desc: 'Utility bar + header' },
  { id: 'centered', name: 'Centered', desc: 'Logo centered, nav below' },
  { id: 'floating', name: 'Floating', desc: 'Rounded floating header' },
]

const sectionDividerOptions = [
  { id: 'none', name: 'None', desc: 'Flat edges (standard)' },
  { id: 'wave', name: 'Wave', desc: 'Smooth wave shape' },
  { id: 'curve', name: 'Curve', desc: 'Single smooth arch' },
  { id: 'diagonal', name: 'Diagonal', desc: 'Angled cut' },
  { id: 'stamp', name: 'Stamp', desc: 'Postal stamp edge' },
]

const fontOptions = [
  { id: 'modern', name: 'Modern', desc: 'Inter / Inter', use: 'Tech, SaaS' },
  { id: 'classic', name: 'Classic', desc: 'Playfair / Source Sans', use: 'Elegant' },
  { id: 'bold', name: 'Bold', desc: 'Oswald / Roboto', use: 'Contractors' },
  { id: 'friendly', name: 'Friendly', desc: 'Nunito / Open Sans', use: 'Family biz' },
  { id: 'geometric', name: 'Geometric', desc: 'Onest / DM Sans', use: 'Default' },
  { id: 'professional', name: 'Professional', desc: 'Montserrat / Lato', use: 'Corporate' },
  { id: 'elegant', name: 'Elegant', desc: 'Cormorant / Franklin', use: 'Premium' },
  { id: 'tech', name: 'Tech', desc: 'Space Grotesk / IBM', use: 'Technical' },
  { id: 'readable', name: 'Readable', desc: 'Merriweather / Source', use: 'Content' },
  { id: 'minimal', name: 'Minimal', desc: 'Outfit / Jakarta', use: 'Clean' },
  { id: 'editorial', name: 'Editorial', desc: 'Instrument Serif / Sans', use: 'Editorial' },
  { id: 'refined', name: 'Refined', desc: 'DM Serif / DM Sans', use: 'Luxury' },
  { id: 'artisan', name: 'Artisan', desc: 'Fraunces / Epilogue', use: 'Craft' },
  { id: 'magazine', name: 'Magazine', desc: 'Bodoni Moda / Outfit', use: 'Fashion' },
  { id: 'dignified', name: 'Dignified', desc: 'Marcellus / Figtree', use: 'Established' },
  { id: 'utility', name: 'Utility', desc: 'Barlow Cond / Barlow', use: 'Trades' },
  { id: 'impact', name: 'Impact', desc: 'Bebas Neue / Open Sans', use: 'Bold' },
  { id: 'industrial', name: 'Industrial', desc: 'Big Shoulders / Lexend', use: 'Construction' },
  { id: 'heritage', name: 'Heritage', desc: 'Archivo Black / Archivo', use: 'Heavy duty' },
  { id: 'precision', name: 'Precision', desc: 'Saira Cond / Saira', use: 'Engineering' },
  { id: 'billboard', name: 'Billboard', desc: 'Anton / Roboto Slab', use: 'Max impact' },
  { id: 'expressive', name: 'Expressive', desc: 'Bricolage / Public Sans', use: 'Creative' },
  { id: 'avant-garde', name: 'Avant-Garde', desc: 'Syne / Geist', use: 'Cutting edge' },
  { id: 'dynamic', name: 'Dynamic', desc: 'Anybody / Figtree', use: 'Playful' },
  { id: 'polished', name: 'Polished', desc: 'Hanken / DM Sans', use: 'Refined SaaS' },
  { id: 'design-forward', name: 'Design Fwd', desc: 'Clash / Satoshi', use: 'Premium' },
  { id: 'studio', name: 'Studio', desc: 'Cabinet / General Sans', use: 'Agency' },
]

const verticalOptions = [
  { id: 'hvac', name: 'HVAC' },
  { id: 'plumbing', name: 'Plumbing' },
  { id: 'electrical', name: 'Electrical' },
  { id: 'cleaning', name: 'Cleaning' },
  { id: 'roofing', name: 'Roofing' },
  { id: 'landscaping', name: 'Landscaping' },
]

const featureToggleItems: { key: keyof DesignFeatures; label: string }[] = [
  { key: 'showBlog', label: 'Blog' },
  { key: 'showWorks', label: 'Our Work' },
  { key: 'showFinancing', label: 'Financing' },
  { key: 'emergencyBadge', label: 'Emergency Badge' },
  { key: 'callbackWidget', label: 'Callback Widget' },
  { key: 'stickyPhone', label: 'Sticky Phone' },
]

// ─── Types ─────────────────────────────────────────────────────

interface ThemeState {
  colors: string
  heroStyle: string
  cardStyle: string
  radius: string
  serviceStyle: string
  serviceGrouping: string
  galleryStyle: string
  pageStyle: string
  footerStyle: string
  fonts: string
  processStyle: string
  headerStyle: string
  servicePageStyle: string
  areaPageStyle: string
  sectionDivider: string
  ctaStyle: string
  faqStyle: string
  testimonialsStyle: string
  trustStyle: string
  aboutStyle: string
  blogStyle: string
  mediaBarStyle: string
  contactFormStyle: string
  logoIconStyle: string
  logoFont: string
  logoIcon: string
  visualEffects: VisualEffectsConfig
  vertical: string
  features: DesignFeatures
}

type TabId = 'page' | 'style' | 'layout'

// ─── Helpers ───────────────────────────────────────────────────

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

const RELOAD_KEYS = new Set(['heroStyle', 'headerStyle'])

// ─── Component ─────────────────────────────────────────────────

export default function DesignPanel() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>('page')
  const [activeColorTab, setActiveColorTab] = useState<'original' | 'react-templates'>('original')
  const [needsReload, setNeedsReload] = useState(false)
  const [fontTuning, setFontTuning] = useState({ h1Scale: 100, h2Scale: 100, h3Scale: 100, h1Tracking: 0, h2Tracking: 0, h3Tracking: 0, bodyScale: 100, bodyTracking: 0 })
  const [tuningCopied, setTuningCopied] = useState(false)
  const [theme, setTheme] = useState<ThemeState>({
    colors: (themeDefaults as any).colors || 'fresh-teal',
    heroStyle: (themeDefaults as any).heroStyle || 'split',
    cardStyle: (themeDefaults as any).cardStyle || 'elevated',
    radius: (themeDefaults as any).radius || 'rounded',
    serviceStyle: (themeDefaults as any).serviceStyle || 'cards',
    serviceGrouping: (themeDefaults as any).serviceGrouping || 'flat',
    galleryStyle: (themeDefaults as any).galleryStyle || 'cards',
    pageStyle: (themeDefaults as any).pageStyle || 'standard',
    footerStyle: (themeDefaults as any).footerStyle || 'standard',
    fonts: (themeDefaults as any).fonts || 'geometric',
    processStyle: (themeDefaults as any).processStyle || 'cards',
    headerStyle: (themeDefaults as any).headerStyle || 'standard',
    servicePageStyle: (themeDefaults as any).servicePageStyle || 'standard',
    areaPageStyle: (themeDefaults as any).areaPageStyle || 'standard',
    sectionDivider: (themeDefaults as any).sectionDivider || 'none',
    ctaStyle: (themeDefaults as any).ctaStyle || 'standard',
    faqStyle: (themeDefaults as any).faqStyle || 'accordion',
    testimonialsStyle: (themeDefaults as any).testimonialsStyle || 'carousel',
    trustStyle: (themeDefaults as any).trustStyle || 'grid',
    aboutStyle: (themeDefaults as any).aboutStyle || 'story',
    blogStyle: (themeDefaults as any).blogStyle || 'cards',
    mediaBarStyle: (themeDefaults as any).mediaBarStyle || 'certifications',
    contactFormStyle: (themeDefaults as any).contactFormStyle || 'detailed',
    logoIconStyle: (themeDefaults as any).logoIconStyle || 'naked',
    logoFont: (themeDefaults as any).logoFont || 'oswald',
    logoIcon: (themeDefaults as any).logoIcon || '',
    visualEffects: { ...defaultVisualEffects, ...((themeDefaults as any).visualEffects || {}) },
    vertical: businessData.vertical || 'cleaning',
    features: getDefaultFeatures(),
  })
  const [prevTheme, setPrevTheme] = useState<ThemeState | null>(null)

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem('foundlio-design')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setTheme(prev => ({ ...prev, ...parsed }))
        if (reactTemplateColorOptions.some(c => c.id === parsed.colors)) {
          setActiveColorTab('react-templates')
        }
      } catch (e) {
        console.error('Failed to parse saved design:', e)
      }
    }
    setLoaded(true)
  }, [])

  // Apply theme to DOM
  useEffect(() => {
    if (!loaded) return
    const body = document.body
    const root = document.documentElement

    const removeClasses = Array.from(body.classList).filter(
      cls => cls.startsWith('theme-') || cls.startsWith('radius-') || cls.startsWith('page-style-') || cls.startsWith('fonts-')
    )
    removeClasses.forEach(cls => body.classList.remove(cls))

    body.classList.add(`theme-${theme.colors}`)
    body.classList.add(`radius-${theme.radius}`)
    body.classList.add(`page-style-${theme.pageStyle}`)
    body.classList.add(`fonts-${theme.fonts}`)

    root.dataset.cardStyle = theme.cardStyle
    root.dataset.heroStyle = theme.heroStyle
    root.dataset.pageStyle = theme.pageStyle
    root.dataset.footerStyle = theme.footerStyle

    localStorage.setItem('foundlio-design', JSON.stringify(theme))
    window.dispatchEvent(new CustomEvent('foundlio-theme-change'))
  }, [theme, loaded])

  // Font tuning debug
  useEffect(() => {
    let style = document.getElementById('debug-font-tuning') as HTMLStyleElement | null
    if (!style) {
      style = document.createElement('style')
      style.id = 'debug-font-tuning'
      document.head.appendChild(style)
    }
    const h1s = fontTuning.h1Scale / 100
    const h2s = fontTuning.h2Scale / 100
    const h3s = fontTuning.h3Scale / 100
    const bs = fontTuning.bodyScale / 100
    const h1t = fontTuning.h1Tracking / 1000
    const h2t = fontTuning.h2Tracking / 1000
    const h3t = fontTuning.h3Tracking / 1000
    const bt = fontTuning.bodyTracking / 1000
    if (h1s === 1 && h2s === 1 && h3s === 1 && bs === 1 && h1t === 0 && h2t === 0 && h3t === 0 && bt === 0) {
      style.textContent = ''
      return
    }
    const scope = `.fonts-${theme.fonts}`
    const rules: string[] = []
    const h1Props: string[] = []
    if (h1s !== 1) h1Props.push(`zoom: ${h1s} !important`)
    if (h1t !== 0) h1Props.push(`letter-spacing: ${h1t}em !important`)
    if (h1Props.length) rules.push(`${scope} h1 { ${h1Props.join('; ')}; }`)
    const h2Props: string[] = []
    if (h2s !== 1) h2Props.push(`zoom: ${h2s} !important`)
    if (h2t !== 0) h2Props.push(`letter-spacing: ${h2t}em !important`)
    if (h2Props.length) rules.push(`${scope} h2 { ${h2Props.join('; ')}; }`)
    const h3Props: string[] = []
    if (h3s !== 1) h3Props.push(`zoom: ${h3s} !important`)
    if (h3t !== 0) h3Props.push(`letter-spacing: ${h3t}em !important`)
    if (h3Props.length) rules.push(`${scope} h3 { ${h3Props.join('; ')}; }`)
    const bd: string[] = []
    if (bs !== 1) bd.push(`zoom: ${bs} !important`)
    if (bt !== 0) bd.push(`letter-spacing: ${bt}em !important`)
    if (bd.length) rules.push(`${scope} :is(p,li,td,th,dd,blockquote,figcaption) { ${bd.join('; ')}; }`)
    style.textContent = rules.join('\n')
  }, [fontTuning, theme.fonts])

  const [prevFont, setPrevFont] = useState(theme.fonts)
  useEffect(() => {
    if (theme.fonts !== prevFont) {
      setFontTuning({ h1Scale: 100, h2Scale: 100, h3Scale: 100, h1Tracking: 0, h2Tracking: 0, h3Tracking: 0, bodyScale: 100, bodyTracking: 0 })
      setPrevFont(theme.fonts)
    }
  }, [theme.fonts, prevFont])

  useEffect(() => {
    return () => {
      const s = document.getElementById('debug-font-tuning')
      if (s) s.remove()
    }
  }, [])

  const updateTheme = (key: keyof ThemeState, value: string) => {
    setTheme(prev => ({ ...prev, [key]: value }))
    if (RELOAD_KEYS.has(key)) setNeedsReload(true)
  }

  const updateVisualEffect = <K extends keyof VisualEffectsConfig>(key: K, value: VisualEffectsConfig[K]) => {
    setTheme(prev => ({
      ...prev,
      visualEffects: { ...prev.visualEffects, [key]: value },
    }))
  }

  const updateFeature = (key: keyof DesignFeatures, value: boolean) => {
    setTheme(prev => ({
      ...prev,
      features: { ...prev.features, [key]: value },
    }))
  }

  const copyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(theme, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyTuning = () => {
    const bt = (fontTuning.bodyTracking / 1000).toFixed(3)
    const s = theme.fonts
    const lines = [
      `Font: ${s}`,
      `H1: ${fontTuning.h1Scale}% trk ${(fontTuning.h1Tracking/1000).toFixed(3)}em`,
      `H2: ${fontTuning.h2Scale}% trk ${(fontTuning.h2Tracking/1000).toFixed(3)}em`,
      `H3: ${fontTuning.h3Scale}% trk ${(fontTuning.h3Tracking/1000).toFixed(3)}em`,
      `Body: ${fontTuning.bodyScale}% trk ${bt}em`,
    ].join('\n')
    navigator.clipboard.writeText(lines)
    setTuningCopied(true)
    setTimeout(() => setTuningCopied(false), 2000)
  }

  const resetToDefaults = () => {
    setTheme({
      colors: 'fresh-teal',
      heroStyle: 'split',
      cardStyle: 'elevated',
      radius: 'rounded',
      serviceStyle: 'cards',
      serviceGrouping: 'flat',
      galleryStyle: 'cards',
      pageStyle: 'standard',
      footerStyle: 'standard',
      fonts: 'geometric',
      processStyle: 'cards',
      headerStyle: 'standard',
      servicePageStyle: 'standard',
      areaPageStyle: 'standard',
      sectionDivider: 'wave',
      ctaStyle: 'standard',
      faqStyle: 'accordion',
      testimonialsStyle: 'carousel',
      trustStyle: 'grid',
      aboutStyle: 'story',
      blogStyle: 'cards',
      mediaBarStyle: 'certifications',
      contactFormStyle: 'detailed',
      visualEffects: { ...defaultVisualEffects },
      vertical: businessData.vertical || 'cleaning',
      features: getDefaultFeatures(),
    })
    setActiveColorTab('original')
    setNeedsReload(true)
  }

  const undoRandomize = () => {
    if (!prevTheme) return
    setTheme(prevTheme)
    setPrevTheme(null)
    setNeedsReload(true)
  }

  const randomizeAll = () => {
    setPrevTheme({ ...theme })
    const allColors = [...originalColorOptions, ...reactTemplateColorOptions]
    const dividerChoices = sectionDividerOptions.filter(d => d.id !== 'none')
    const gradientStyles = ['none', 'subtle', 'vibrant'] as const
    const glassStyles = ['none', 'light', 'frosted'] as const

    const newTheme: ThemeState = {
      colors: pickRandom(allColors).id,
      heroStyle: pickRandom(heroOptions).id,
      cardStyle: pickRandom(cardOptions).id,
      radius: pickRandom(radiusOptions).id,
      serviceStyle: pickRandom(serviceStyleOptions).id,
      serviceGrouping: pickRandom(serviceGroupingOptions).id,
      galleryStyle: pickRandom(galleryStyleOptions).id,
      pageStyle: pickRandom(pageStyleOptions).id,
      footerStyle: pickRandom(footerStyleOptions).id,
      fonts: pickRandom(fontOptions).id,
      processStyle: pickRandom(processStyleOptions).id,
      headerStyle: pickRandom(headerStyleOptions).id,
      servicePageStyle: pickRandom(servicePageStyleOptions).id,
      areaPageStyle: pickRandom(areaPageStyleOptions).id,
      sectionDivider: pickRandom(dividerChoices).id,
      ctaStyle: pickRandom(ctaStyleOptions).id,
      faqStyle: pickRandom(faqStyleOptions).id,
      testimonialsStyle: pickRandom(testimonialsStyleOptions).id,
      trustStyle: pickRandom(trustStyleOptions).id,
      aboutStyle: pickRandom(aboutStyleOptions).id,
      blogStyle: pickRandom(blogStyleOptions).id,
      mediaBarStyle: pickRandom(mediaBarStyleOptions).id,
      contactFormStyle: pickRandom(contactFormStyleOptions).id,
      logoIconStyle: pickRandom(['filled-box', 'naked', 'outline-box', 'circle']),
      logoFont: pickRandom(['oswald', 'barlow-condensed', 'archivo-black', 'saira-condensed', 'space-grotesk', 'big-shoulders', 'outfit', 'nunito', 'plus-jakarta']),
      logoIcon: pickRandom(verticalIconNames[theme.vertical] || verticalIconNames[businessData.vertical] || verticalIconNames.cleaning || ['Sparkles']),
      vertical: theme.vertical,
      features: theme.features,
      visualEffects: {
        gradientStyle: pickRandom([...gradientStyles]),
        glassEffect: pickRandom([...glassStyles]),
        meshBackground: Math.random() > 0.5,
        gradientButtons: Math.random() > 0.5,
        gradientText: Math.random() > 0.5,
      },
    }

    if (reactTemplateColorOptions.some(c => c.id === newTheme.colors)) {
      setActiveColorTab('react-templates')
    } else {
      setActiveColorTab('original')
    }

    setTheme(newTheme)
    setNeedsReload(true)
  }

  // Keyboard shortcut: R to randomize when panel is open
  const isOpenRef = useRef(isOpen)
  isOpenRef.current = isOpen
  const randomizeRef = useRef(randomizeAll)
  randomizeRef.current = randomizeAll

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpenRef.current) return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault()
        randomizeRef.current()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (process.env.NODE_ENV === 'production') return null

  // ─── Page detection ──────────────────────────────────────────
  const isHome = pathname === '/'
  const isServicePage = pathname.startsWith('/services/') && pathname !== '/services'
  const isServicesIndex = pathname === '/services'
  const isAreaPage = pathname.startsWith('/areas/') && pathname !== '/areas'
  const isWorksPage = pathname === '/works' || pathname.startsWith('/works/')
  const isContactPage = pathname === '/contact'

  const currentColorOptions = activeColorTab === 'original' ? originalColorOptions : reactTemplateColorOptions

  // ─── Shared UI helpers ───────────────────────────────────────

  const SectionLabel = ({ icon: Icon, label }: { icon: any; label: string }) => (
    <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2" style={{ fontFamily: 'system-ui' }}>
      <Icon size={13} />
      {label}
    </label>
  )

  const GridPicker = ({ options, value, onChange, cols = 2 }: {
    options: { id: string; name: string; desc?: string }[]
    value: string
    onChange: (id: string) => void
    cols?: number
  }) => (
    <div className={`grid gap-1.5 ${cols === 3 ? 'grid-cols-3' : cols === 4 ? 'grid-cols-4' : 'grid-cols-2'}`}>
      {options.map(opt => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`p-2 rounded-lg border-2 text-left transition-all ${
            value === opt.id
              ? 'border-violet-500 bg-violet-50'
              : 'border-slate-200 hover:border-slate-300'
          }`}
          style={{ fontFamily: 'system-ui' }}
        >
          <div className="text-[12px] font-medium text-slate-900 leading-tight">{opt.name}</div>
          {opt.desc && <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{opt.desc}</div>}
        </button>
      ))}
    </div>
  )

  // ─── Tab: Page ───────────────────────────────────────────────

  const renderPageTab = () => {
    if (isHome) return (
      <div className="space-y-4">
        <div>
          <SectionLabel icon={LayoutTemplate} label="Hero" />
          <GridPicker options={heroOptions} value={theme.heroStyle} onChange={v => updateTheme('heroStyle', v)} />
        </div>
        <div>
          <SectionLabel icon={Award} label="Media Bar" />
          <GridPicker options={mediaBarStyleOptions} value={theme.mediaBarStyle} onChange={v => updateTheme('mediaBarStyle', v)} cols={3} />
        </div>
        <div>
          <SectionLabel icon={Shield} label="Trust Signals" />
          <GridPicker options={trustStyleOptions} value={theme.trustStyle} onChange={v => updateTheme('trustStyle', v)} />
        </div>
        <div>
          <SectionLabel icon={LayoutList} label="Services" />
          <GridPicker options={serviceStyleOptions} value={theme.serviceStyle} onChange={v => updateTheme('serviceStyle', v)} />
          <div className="mt-2">
            <GridPicker options={serviceGroupingOptions} value={theme.serviceGrouping} onChange={v => updateTheme('serviceGrouping', v)} />
          </div>
        </div>
        <div>
          <SectionLabel icon={Layers} label="How We Work" />
          <GridPicker options={processStyleOptions} value={theme.processStyle} onChange={v => updateTheme('processStyle', v)} cols={3} />
        </div>
        <div>
          <SectionLabel icon={Users} label="About" />
          <GridPicker options={aboutStyleOptions} value={theme.aboutStyle} onChange={v => updateTheme('aboutStyle', v)} cols={3} />
        </div>
        <div>
          <SectionLabel icon={Image} label="Gallery" />
          <GridPicker options={galleryStyleOptions} value={theme.galleryStyle} onChange={v => updateTheme('galleryStyle', v)} />
        </div>
        <div>
          <SectionLabel icon={MessageSquare} label="Testimonials" />
          <GridPicker options={testimonialsStyleOptions} value={theme.testimonialsStyle} onChange={v => updateTheme('testimonialsStyle', v)} cols={3} />
        </div>
        <div>
          <SectionLabel icon={HelpCircle} label="FAQ" />
          <GridPicker options={faqStyleOptions} value={theme.faqStyle} onChange={v => updateTheme('faqStyle', v)} />
        </div>
        <div>
          <SectionLabel icon={BookOpen} label="Blog" />
          <GridPicker options={blogStyleOptions} value={theme.blogStyle} onChange={v => updateTheme('blogStyle', v)} cols={3} />
        </div>
        <div>
          <SectionLabel icon={Layers} label="CTA Banner" />
          <GridPicker options={ctaStyleOptions} value={theme.ctaStyle} onChange={v => updateTheme('ctaStyle', v)} />
        </div>
      </div>
    )

    if (isServicePage) return (
      <div className="space-y-4">
        <div>
          <SectionLabel icon={LayoutList} label="Service Page Layout" />
          <GridPicker options={servicePageStyleOptions} value={theme.servicePageStyle} onChange={v => updateTheme('servicePageStyle', v)} cols={3} />
        </div>
        <div>
          <SectionLabel icon={HelpCircle} label="FAQ" />
          <GridPicker options={faqStyleOptions} value={theme.faqStyle} onChange={v => updateTheme('faqStyle', v)} />
        </div>
      </div>
    )

    if (isServicesIndex) return (
      <div className="space-y-4">
        <div>
          <SectionLabel icon={LayoutList} label="Services" />
          <GridPicker options={serviceStyleOptions} value={theme.serviceStyle} onChange={v => updateTheme('serviceStyle', v)} />
          <div className="mt-2">
            <GridPicker options={serviceGroupingOptions} value={theme.serviceGrouping} onChange={v => updateTheme('serviceGrouping', v)} />
          </div>
        </div>
      </div>
    )

    if (isAreaPage) return (
      <div className="space-y-4">
        <div>
          <SectionLabel icon={LayoutList} label="Area Page Layout" />
          <GridPicker options={areaPageStyleOptions} value={theme.areaPageStyle} onChange={v => updateTheme('areaPageStyle', v)} cols={3} />
        </div>
      </div>
    )

    if (isWorksPage) return (
      <div className="space-y-4">
        <div>
          <SectionLabel icon={Image} label="Gallery Style" />
          <GridPicker options={galleryStyleOptions} value={theme.galleryStyle} onChange={v => updateTheme('galleryStyle', v)} />
        </div>
      </div>
    )

    if (isContactPage) return (
      <div className="space-y-4">
        <div>
          <SectionLabel icon={MessageSquare} label="Contact Form" />
          <GridPicker options={contactFormStyleOptions} value={theme.contactFormStyle} onChange={v => updateTheme('contactFormStyle', v)} />
        </div>
      </div>
    )

    return (
      <div className="text-center py-8" style={{ fontFamily: 'system-ui' }}>
        <div className="text-slate-400 text-sm">No page-specific controls</div>
        <div className="text-slate-400 text-xs mt-1">Try Style or Layout tabs</div>
      </div>
    )
  }

  // ─── Tab: Style ──────────────────────────────────────────────

  const renderStyleTab = () => (
    <div className="space-y-4">
      {/* Colors */}
      <div>
        <SectionLabel icon={Palette} label="Color Theme" />
        <div className="flex gap-1 mb-2 p-1 bg-slate-100 rounded-lg">
          {(['original', 'react-templates'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveColorTab(tab)}
              className={`flex-1 px-3 py-1 text-[11px] font-medium rounded-md transition-all ${
                activeColorTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
              style={{ fontFamily: 'system-ui' }}
            >
              {tab === 'original' ? 'Original' : 'Classic'}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-8 gap-1.5">
          {currentColorOptions.map(color => (
            <button
              key={color.id}
              onClick={() => updateTheme('colors', color.id)}
              className={`group relative aspect-square rounded-md transition-all ${
                theme.colors === color.id ? 'ring-2 ring-violet-500 ring-offset-1' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: color.preview }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Effects */}
      <div>
        <SectionLabel icon={Sparkles} label="Effects" />
        <div className="space-y-2">
          <div>
            <div className="text-[10px] text-slate-500 mb-1" style={{ fontFamily: 'system-ui' }}>Gradient</div>
            <div className="flex gap-1">
              {(['none', 'subtle', 'vibrant'] as const).map(opt => (
                <button
                  key={opt}
                  onClick={() => updateVisualEffect('gradientStyle', opt)}
                  className={`flex-1 px-2 py-1 text-[11px] font-medium rounded-md transition-all ${
                    theme.visualEffects.gradientStyle === opt
                      ? 'bg-violet-100 text-violet-700 ring-1 ring-violet-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  style={{ fontFamily: 'system-ui' }}
                >
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 mb-1" style={{ fontFamily: 'system-ui' }}>Glass</div>
            <div className="flex gap-1">
              {(['none', 'light', 'frosted'] as const).map(opt => (
                <button
                  key={opt}
                  onClick={() => updateVisualEffect('glassEffect', opt)}
                  className={`flex-1 px-2 py-1 text-[11px] font-medium rounded-md transition-all ${
                    theme.visualEffects.glassEffect === opt
                      ? 'bg-violet-100 text-violet-700 ring-1 ring-violet-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  style={{ fontFamily: 'system-ui' }}
                >
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            {([
              { key: 'meshBackground' as const, label: 'Mesh' },
              { key: 'gradientButtons' as const, label: 'Grad Btns' },
              { key: 'gradientText' as const, label: 'Grad Text' },
            ]).map(({ key, label }) => (
              <label key={key} className="flex items-center gap-1.5 cursor-pointer">
                <button
                  onClick={() => updateVisualEffect(key, !theme.visualEffects[key])}
                  className={`w-8 h-[18px] rounded-full transition-colors relative ${
                    theme.visualEffects[key] ? 'bg-violet-500' : 'bg-slate-300'
                  }`}
                >
                  <div className={`absolute top-[2px] w-[14px] h-[14px] bg-white rounded-full shadow transition-transform ${
                    theme.visualEffects[key] ? 'translate-x-[14px]' : 'translate-x-[2px]'
                  }`} />
                </button>
                <span className="text-[10px] text-slate-600" style={{ fontFamily: 'system-ui' }}>{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Fonts */}
      <div>
        <SectionLabel icon={Type} label="Font Pair" />
        <div className="grid grid-cols-3 gap-1 max-h-56 overflow-y-auto pr-1">
          {fontOptions.map(font => (
            <button
              key={font.id}
              onClick={() => updateTheme('fonts', font.id)}
              className={`p-1.5 rounded-lg border-2 text-left transition-all ${
                theme.fonts === font.id ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:border-slate-300'
              }`}
              style={{ fontFamily: 'system-ui' }}
            >
              <div className="text-[11px] font-medium text-slate-900 leading-tight">{font.name}</div>
              <div className="text-[9px] text-slate-500 leading-tight">{font.use}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Font Tuning */}
      <div>
        <SectionLabel icon={SlidersHorizontal} label="Font Tuning" />
        <div className="space-y-1.5">
          {([
            { key: 'h1Scale', label: 'H1', min: 70, max: 140, step: 5, fmt: (v: number) => `${v}%` },
            { key: 'h2Scale', label: 'H2', min: 70, max: 140, step: 5, fmt: (v: number) => `${v}%` },
            { key: 'h3Scale', label: 'H3', min: 70, max: 140, step: 5, fmt: (v: number) => `${v}%` },
            { key: 'h1Tracking', label: 'H1 Trk', min: -40, max: 120, step: 5, fmt: (v: number) => `${(v/1000).toFixed(3)}em` },
            { key: 'h2Tracking', label: 'H2 Trk', min: -40, max: 120, step: 5, fmt: (v: number) => `${(v/1000).toFixed(3)}em` },
            { key: 'h3Tracking', label: 'H3 Trk', min: -40, max: 120, step: 5, fmt: (v: number) => `${(v/1000).toFixed(3)}em` },
            { key: 'bodyScale', label: 'Body', min: 70, max: 140, step: 5, fmt: (v: number) => `${v}%` },
            { key: 'bodyTracking', label: 'Body Trk', min: -20, max: 80, step: 5, fmt: (v: number) => `${(v/1000).toFixed(3)}em` },
          ] as const).map(({ key, label, min, max, step, fmt }) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 w-12 shrink-0" style={{ fontFamily: 'system-ui' }}>{label}</span>
              <input
                type="range" min={min} max={max} step={step}
                value={fontTuning[key]}
                onChange={e => setFontTuning(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                className="flex-1 h-1 bg-slate-200 rounded-full appearance-none cursor-pointer accent-violet-500"
              />
              <span className="text-[9px] font-mono text-slate-500 w-12 text-right shrink-0">{fmt(fontTuning[key])}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={copyTuning}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-[11px] font-medium bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors"
            style={{ fontFamily: 'system-ui' }}
          >
            {tuningCopied ? <Check size={11} /> : <Copy size={11} />}
            {tuningCopied ? 'Copied!' : 'Copy CSS'}
          </button>
          <button
            onClick={() => setFontTuning({ h1Scale: 100, h2Scale: 100, h3Scale: 100, h1Tracking: 0, h2Tracking: 0, h3Tracking: 0, bodyScale: 100, bodyTracking: 0 })}
            className="px-2 py-1 text-[11px] font-medium bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            style={{ fontFamily: 'system-ui' }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Cards + Radius */}
      <div>
        <SectionLabel icon={Layers} label="Cards" />
        <GridPicker options={cardOptions} value={theme.cardStyle} onChange={v => updateTheme('cardStyle', v)} />
      </div>
      <div>
        <SectionLabel icon={Square} label="Border Radius" />
        <div className="flex gap-1.5">
          {radiusOptions.map(r => (
            <button
              key={r.id}
              onClick={() => updateTheme('radius', r.id)}
              className={`flex-1 p-2 rounded-lg border-2 text-center transition-all ${
                theme.radius === r.id ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="w-7 h-7 bg-slate-300 mx-auto mb-1" style={{ borderRadius: r.preview }} />
              <div className="text-[10px] font-medium text-slate-700" style={{ fontFamily: 'system-ui' }}>{r.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  // ─── Tab: Layout ─────────────────────────────────────────────

  const renderLayoutTab = () => (
    <div className="space-y-4">
      {/* Vertical */}
      <div>
        <SectionLabel icon={FolderTree} label="Vertical" />
        <div className="grid grid-cols-3 gap-1">
          {verticalOptions.map(v => (
            <button
              key={v.id}
              onClick={() => {
                const preset = verticalThemes[v.id]
                if (preset) {
                  setTheme(prev => ({ ...prev, ...preset, vertical: v.id }))
                } else {
                  updateTheme('vertical', v.id)
                }
                setNeedsReload(true)
              }}
              className={`p-1.5 rounded-lg border-2 text-center transition-all ${
                theme.vertical === v.id ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:border-slate-300'
              }`}
              style={{ fontFamily: 'system-ui' }}
            >
              <div className="text-[11px] font-medium text-slate-900 leading-tight">{v.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Feature Toggles */}
      <div>
        <SectionLabel icon={Settings} label="Features" />
        <div className="space-y-1.5">
          {featureToggleItems.map(({ key, label }) => (
            <label key={key} className="flex items-center justify-between cursor-pointer py-1 px-1">
              <span className="text-[12px] text-slate-700" style={{ fontFamily: 'system-ui' }}>{label}</span>
              <button
                onClick={() => updateFeature(key, !theme.features[key])}
                className={`w-8 h-[18px] rounded-full transition-colors relative ${
                  theme.features[key] ? 'bg-violet-500' : 'bg-slate-300'
                }`}
              >
                <div className={`absolute top-[2px] w-[14px] h-[14px] bg-white rounded-full shadow transition-transform ${
                  theme.features[key] ? 'translate-x-[14px]' : 'translate-x-[2px]'
                }`} />
              </button>
            </label>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel icon={Menu} label="Header" />
        <GridPicker options={headerStyleOptions} value={theme.headerStyle} onChange={v => updateTheme('headerStyle', v)} />
      </div>
      <div>
        <SectionLabel icon={Waves} label="Section Divider" />
        <GridPicker options={sectionDividerOptions} value={theme.sectionDivider} onChange={v => updateTheme('sectionDivider', v)} cols={3} />
      </div>
      <div>
        <SectionLabel icon={PanelsTopLeft} label="Page Density" />
        <GridPicker options={pageStyleOptions} value={theme.pageStyle} onChange={v => updateTheme('pageStyle', v)} cols={3} />
      </div>
      <div>
        <SectionLabel icon={Footprints} label="Footer" />
        <GridPicker options={footerStyleOptions} value={theme.footerStyle} onChange={v => updateTheme('footerStyle', v)} />
      </div>
      <div>
        <SectionLabel icon={LayoutList} label="Service Page" />
        <GridPicker options={servicePageStyleOptions} value={theme.servicePageStyle} onChange={v => updateTheme('servicePageStyle', v)} cols={3} />
      </div>
      <div>
        <SectionLabel icon={LayoutList} label="Area Page" />
        <GridPicker options={areaPageStyleOptions} value={theme.areaPageStyle} onChange={v => updateTheme('areaPageStyle', v)} cols={3} />
      </div>
    </div>
  )

  // ─── Render ──────────────────────────────────────────────────

  const pageName = isHome ? 'Home' : isServicePage ? 'Service' : isServicesIndex ? 'Services' : isAreaPage ? 'Area' : isWorksPage ? 'Gallery' : isContactPage ? 'Contact' : 'Page'

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: 'page', label: pageName, icon: Home },
    { id: 'style', label: 'Style', icon: Palette },
    { id: 'layout', label: 'Layout', icon: Settings },
  ]

  return (
    <>
      {/* Toggle + Randomize Buttons */}
      <div className="fixed bottom-4 left-4 z-[9999] flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-2xl shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          title="Design Controls"
        >
          {isOpen ? <X size={20} /> : <Palette size={20} />}
        </button>
        <button
          onClick={randomizeAll}
          className="w-9 h-9 bg-white text-violet-600 border border-violet-200 rounded-xl shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-transform hover:bg-violet-50"
          title="Randomize Theme"
        >
          <Shuffle size={16} />
        </button>
        {prevTheme && (
          <button
            onClick={undoRandomize}
            className="w-9 h-9 bg-white text-amber-600 border border-amber-200 rounded-xl shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-transform hover:bg-amber-50"
            title="Undo Randomize"
          >
            <Undo2 size={16} />
          </button>
        )}
      </div>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-[72px] left-4 z-[9998] w-[340px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col"
            style={{ maxHeight: 'calc(100vh - 100px)' }}
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-t-2xl shrink-0">
              <div className="flex items-center justify-between">
                <div style={{ fontFamily: 'system-ui' }}>
                  <div className="text-sm font-semibold">Design Controls</div>
                </div>
                <div className="flex gap-0.5">
                  <button onClick={randomizeAll} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" title="Randomize (R)">
                    <Shuffle size={15} />
                  </button>
                  <button onClick={resetToDefaults} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" title="Reset defaults">
                    <RefreshCw size={15} />
                  </button>
                  <button onClick={copyConfig} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" title="Copy theme.json">
                    {copied ? <Check size={15} /> : <Copy size={15} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Reload banner */}
            {needsReload && (
              <button
                onClick={() => { setNeedsReload(false); window.location.reload() }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 text-xs font-medium border-b border-amber-200 hover:bg-amber-100 transition-colors shrink-0"
                style={{ fontFamily: 'system-ui' }}
              >
                <AlertCircle size={13} />
                Hero/Header changed — click to reload
              </button>
            )}

            {/* Tabs */}
            <div className="flex border-b border-slate-200 shrink-0">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                    activeTab === tab.id
                      ? 'text-violet-600 border-b-2 border-violet-500 bg-violet-50/50'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  style={{ fontFamily: 'system-ui' }}
                >
                  <tab.icon size={13} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto flex-1 min-h-0">
              {activeTab === 'page' && renderPageTab()}
              {activeTab === 'style' && renderStyleTab()}
              {activeTab === 'layout' && renderLayoutTab()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings,
  Palette,
  Type,
  Layout,
  Eye,
  EyeOff,
  X,
  Copy,
  Check,
  RefreshCw,
  Smartphone,
  Monitor,
} from 'lucide-react'
import businessData from '@/data/business.json'
import importedThemesData from '@/data/themes.json'

// Types
interface ThemePreset {
  id: string
  name: string
  category: string
  colors: {
    primary: string // HSL values without hsl() wrapper e.g. "210 100% 31%"
    primaryForeground: string
    background: string
    foreground: string
    muted: string
    mutedForeground: string
    card: string
    border: string
    ring: string
    footerBg: string // Dark version of primary for footer
  }
  preview: string // hex color for preview swatch
}

interface HeadlineVariation {
  headline: string
  subheadline: string
}

interface DevPanelProps {
  initialTheme?: string
  onThemeChange?: (themeId: string) => void
  onHeadlineChange?: (index: number) => void
  onConfigExport?: () => void
}

// Theme presets with HSL values (shadcn/ui pattern) - using neutral grayscale
const themePresets: ThemePreset[] = [
  {
    id: 'professional-blue',
    name: 'Professional Blue',
    category: 'professional',
    preview: '#00509d',
    colors: {
      primary: '210 100% 31%',
      primaryForeground: '0 0% 100%',
      background: '0 0% 98%',
      foreground: '0 0% 9%',
      muted: '0 0% 94%',
      mutedForeground: '0 0% 40%',
      card: '0 0% 100%',
      border: '0 0% 88%',
      ring: '210 100% 31%',
      footerBg: '210 80% 12%',
    },
  },
  {
    id: 'bold-orange',
    name: 'Bold Orange',
    category: 'bold',
    preview: '#ea580c',
    colors: {
      primary: '21 90% 48%',
      primaryForeground: '0 0% 100%',
      background: '0 0% 98%',
      foreground: '0 0% 9%',
      muted: '0 0% 94%',
      mutedForeground: '0 0% 40%',
      card: '0 0% 100%',
      border: '0 0% 88%',
      ring: '21 90% 48%',
      footerBg: '21 70% 12%',
    },
  },
  {
    id: 'modern-teal',
    name: 'Modern Teal',
    category: 'modern',
    preview: '#0d9488',
    colors: {
      primary: '175 84% 32%',
      primaryForeground: '0 0% 100%',
      background: '0 0% 98%',
      foreground: '0 0% 9%',
      muted: '0 0% 94%',
      mutedForeground: '0 0% 40%',
      card: '0 0% 100%',
      border: '0 0% 88%',
      ring: '175 84% 32%',
      footerBg: '175 60% 12%',
    },
  },
  {
    id: 'classic-navy',
    name: 'Classic Navy',
    category: 'classic',
    preview: '#1e3a5f',
    colors: {
      primary: '213 54% 24%',
      primaryForeground: '0 0% 100%',
      background: '0 0% 98%',
      foreground: '0 0% 9%',
      muted: '0 0% 94%',
      mutedForeground: '0 0% 40%',
      card: '0 0% 100%',
      border: '0 0% 88%',
      ring: '213 54% 24%',
      footerBg: '213 50% 10%',
    },
  },
  {
    id: 'minimal-slate',
    name: 'Minimal Slate',
    category: 'minimal',
    preview: '#525252',
    colors: {
      primary: '0 0% 32%',
      primaryForeground: '0 0% 100%',
      background: '0 0% 98%',
      foreground: '0 0% 9%',
      muted: '0 0% 94%',
      mutedForeground: '0 0% 40%',
      card: '0 0% 100%',
      border: '0 0% 88%',
      ring: '0 0% 32%',
      footerBg: '0 0% 12%',
    },
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Gold',
    category: 'luxury',
    preview: '#d97706',
    colors: {
      primary: '38 92% 44%',
      primaryForeground: '0 0% 100%',
      background: '0 0% 7%',
      foreground: '0 0% 98%',
      muted: '0 0% 15%',
      mutedForeground: '0 0% 60%',
      card: '0 0% 10%',
      border: '0 0% 18%',
      ring: '38 92% 44%',
      footerBg: '38 70% 8%',
    },
  },
  {
    id: 'desert-red',
    name: 'Desert Red',
    category: 'bold',
    preview: '#b91c1c',
    colors: {
      primary: '0 72% 42%',
      primaryForeground: '0 0% 100%',
      background: '0 0% 98%',
      foreground: '0 0% 9%',
      muted: '0 0% 94%',
      mutedForeground: '0 0% 40%',
      card: '0 0% 100%',
      border: '0 0% 88%',
      ring: '0 72% 42%',
      footerBg: '0 60% 12%',
    },
  },
  {
    id: 'fresh-green',
    name: 'Fresh Green',
    category: 'modern',
    preview: '#16a34a',
    colors: {
      primary: '142 71% 36%',
      primaryForeground: '0 0% 100%',
      background: '0 0% 98%',
      foreground: '0 0% 9%',
      muted: '0 0% 94%',
      mutedForeground: '0 0% 40%',
      card: '0 0% 100%',
      border: '0 0% 88%',
      ring: '142 71% 36%',
      footerBg: '142 50% 12%',
    },
  },
  {
    id: 'electric-purple',
    name: 'Electric Purple',
    category: 'modern',
    preview: '#7c3aed',
    colors: {
      primary: '263 70% 58%',
      primaryForeground: '0 0% 100%',
      background: '0 0% 98%',
      foreground: '0 0% 9%',
      muted: '0 0% 94%',
      mutedForeground: '0 0% 40%',
      card: '0 0% 100%',
      border: '0 0% 88%',
      ring: '263 70% 58%',
      footerBg: '263 50% 15%',
    },
  },
  {
    id: 'trust-blue-light',
    name: 'Trust Blue Light',
    category: 'professional',
    preview: '#2563eb',
    colors: {
      primary: '221 83% 53%',
      primaryForeground: '0 0% 100%',
      background: '0 0% 98%',
      foreground: '0 0% 9%',
      muted: '0 0% 94%',
      mutedForeground: '0 0% 40%',
      card: '0 0% 100%',
      border: '0 0% 88%',
      ring: '221 83% 53%',
      footerBg: '221 60% 12%',
    },
  },
  {
    id: 'contractor-dark',
    name: 'Contractor Dark',
    category: 'bold',
    preview: '#f59e0b',
    colors: {
      primary: '38 92% 50%',
      primaryForeground: '0 0% 0%',
      background: '0 0% 7%',
      foreground: '0 0% 98%',
      muted: '0 0% 15%',
      mutedForeground: '0 0% 60%',
      card: '0 0% 10%',
      border: '0 0% 18%',
      ring: '38 92% 50%',
      footerBg: '38 70% 6%',
    },
  },
  {
    id: 'soft-coral',
    name: 'Soft Coral',
    category: 'modern',
    preview: '#f43f5e',
    colors: {
      primary: '350 89% 60%',
      primaryForeground: '0 0% 100%',
      background: '0 0% 98%',
      foreground: '0 0% 9%',
      muted: '0 0% 94%',
      mutedForeground: '0 0% 40%',
      card: '0 0% 100%',
      border: '0 0% 88%',
      ring: '350 89% 60%',
      footerBg: '350 60% 12%',
    },
  },
]

// Merge built-in presets with imported themes from react-templates
const importedThemes: ThemePreset[] = importedThemesData.themes.map(t => ({
  ...t,
  category: 'imported',
}))
const allThemePresets = [...themePresets, ...importedThemes]

// Get theme preset from business.json, fallback to professional-blue
const configuredTheme = businessData.theme?.preset || 'professional-blue'
console.log('[DevPanel] Theme from business.json:', configuredTheme)

export default function DevPanel({
  initialTheme = configuredTheme,
  onThemeChange,
  onHeadlineChange,
}: DevPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'theme' | 'content' | 'layout' | 'settings'>('theme')
  const [selectedTheme, setSelectedTheme] = useState(initialTheme)
  const [selectedHeadline, setSelectedHeadline] = useState(0)
  const [copied, setCopied] = useState(false)
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop')

  // Section toggles
  const [sections, setSections] = useState({
    hero: true,
    trustSignals: true,
    services: true,
    process: true,
    testimonials: true,
    faq: true,
    cta: true,
  })

  // Settings
  const [settings, setSettings] = useState({
    callbackWidget: true,
    stickyCall: true,
    urgencyIndicator: true,
    darkMode: false,
  })

  // Headlines (would come from config in real implementation)
  const headlines: HeadlineVariation[] = [
    { headline: 'Cool Comfort. Desert Tough.', subheadline: 'Built to handle the extremes of Arizona living.' },
    { headline: 'Phoenix Trusts Desert Aire', subheadline: '847+ five-star reviews. 16+ years serving the Valley.' },
    { headline: "AC Broken? We're On Our Way.", subheadline: 'Emergency HVAC service available 24/7.' },
  ]

  // Apply CSS variables for a theme
  const applyTheme = useCallback((themeId: string) => {
    const theme = allThemePresets.find(t => t.id === themeId)
    if (!theme) return

    const root = document.documentElement
    const { colors } = theme

    // Set all theme CSS variables (HSL values)
    root.style.setProperty('--primary', colors.primary)
    root.style.setProperty('--primary-foreground', colors.primaryForeground)
    root.style.setProperty('--background', colors.background)
    root.style.setProperty('--foreground', colors.foreground)
    root.style.setProperty('--muted', colors.muted)
    root.style.setProperty('--muted-foreground', colors.mutedForeground)
    root.style.setProperty('--card', colors.card)
    root.style.setProperty('--card-foreground', colors.foreground)
    root.style.setProperty('--popover', colors.card)
    root.style.setProperty('--popover-foreground', colors.foreground)
    root.style.setProperty('--border', colors.border)
    root.style.setProperty('--input', colors.border)
    root.style.setProperty('--ring', colors.ring)
    root.style.setProperty('--secondary', colors.muted)
    root.style.setProperty('--secondary-foreground', colors.foreground)
    root.style.setProperty('--accent', colors.muted)
    root.style.setProperty('--accent-foreground', colors.foreground)
    root.style.setProperty('--footer-bg', colors.footerBg)

    console.log('[DevPanel] Applied theme:', themeId, colors.primary)
  }, [])

  // Handle theme selection
  const handleThemeSelect = useCallback((themeId: string) => {
    console.log('[DevPanel] Theme selected:', themeId)
    applyTheme(themeId)
    setSelectedTheme(themeId)
    onThemeChange?.(themeId)
  }, [applyTheme, onThemeChange])

  // Copy config to clipboard
  const copyConfig = () => {
    const config = {
      theme: { preset: selectedTheme },
      headline: selectedHeadline,
      sections,
      settings,
    }
    navigator.clipboard.writeText(JSON.stringify(config, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Toggle section
  const toggleSection = (key: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Track if component is mounted (for hydration)
  const [isMounted, setIsMounted] = useState(false)

  // Apply initial theme on mount
  useEffect(() => {
    setIsMounted(true)
    applyTheme(selectedTheme)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Toggle handler
  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  // Don't render in production or before hydration
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  if (!isMounted) {
    return null
  }

  return (
    <>
      {/* Floating Toggle Button - Bottom Left */}
      <button
        type="button"
        onClick={handleToggle}
        className="fixed bottom-4 left-4 z-[9999] w-12 h-12 bg-slate-900 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        style={{ pointerEvents: 'auto' }}
        aria-label={isOpen ? 'Close dev panel' : 'Open dev panel'}
      >
        {isOpen ? <X size={20} /> : <Settings size={20} />}
      </button>

      {/* Panel - Slides from Left */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed top-0 left-0 z-[9998] w-80 h-full bg-white shadow-2xl border-r border-slate-200 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">Dev Panel</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyConfig}
                    className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                    title="Copy config"
                  >
                    {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                    title="Refresh"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mt-3">
                {[
                  { id: 'theme', icon: Palette, label: 'Theme' },
                  { id: 'content', icon: Type, label: 'Content' },
                  { id: 'layout', icon: Layout, label: 'Layout' },
                  { id: 'settings', icon: Settings, label: 'Settings' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex-1 py-1.5 px-2 text-xs font-medium rounded transition-colors ${
                      activeTab === tab.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <tab.icon size={14} className="mx-auto mb-0.5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Theme Tab */}
              {activeTab === 'theme' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Theme Preset
                    </label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {allThemePresets.map(theme => (
                        <button
                          key={theme.id}
                          onClick={() => handleThemeSelect(theme.id)}
                          className={`p-2 rounded-lg border-2 transition-all text-left ${
                            selectedTheme === theme.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div
                              className="w-4 h-4 rounded-full border border-slate-300"
                              style={{ backgroundColor: theme.preview }}
                            />
                            <span className="text-xs font-medium truncate">{theme.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">{theme.category}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Content Tab */}
              {activeTab === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Hero Headline (A/B)
                    </label>
                    <div className="mt-2 space-y-2">
                      {headlines.map((h, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSelectedHeadline(i)
                            onHeadlineChange?.(i)
                          }}
                          className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                            selectedHeadline === i
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="text-sm font-medium text-slate-900 line-clamp-1">
                            {h.headline}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                            {h.subheadline}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            Variation {i + 1}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content Stats */}
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Content Overview
                    </label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {[
                        { label: 'Services', count: 6 },
                        { label: 'Testimonials', count: 7 },
                        { label: 'Areas', count: 3 },
                        { label: 'FAQs', count: 10 },
                        { label: 'Posts', count: 3 },
                      ].map(item => (
                        <div key={item.label} className="p-2 bg-slate-50 rounded-lg">
                          <div className="text-lg font-semibold text-slate-900">{item.count}</div>
                          <div className="text-xs text-slate-500">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Layout Tab */}
              {activeTab === 'layout' && (
                <div className="space-y-4">
                  {/* Viewport Toggle */}
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Preview Viewport
                    </label>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => setViewportMode('desktop')}
                        className={`flex-1 py-2 px-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${
                          viewportMode === 'desktop'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200'
                        }`}
                      >
                        <Monitor size={16} />
                        <span className="text-sm">Desktop</span>
                      </button>
                      <button
                        onClick={() => setViewportMode('mobile')}
                        className={`flex-1 py-2 px-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${
                          viewportMode === 'mobile'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200'
                        }`}
                      >
                        <Smartphone size={16} />
                        <span className="text-sm">Mobile</span>
                      </button>
                    </div>
                  </div>

                  {/* Section Toggles */}
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Homepage Sections
                    </label>
                    <div className="mt-2 space-y-1">
                      {Object.entries(sections).map(([key, enabled]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg"
                        >
                          <span className="text-sm text-slate-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <button
                            onClick={() => toggleSection(key as keyof typeof sections)}
                            className={`p-1.5 rounded transition-colors ${
                              enabled
                                ? 'bg-green-100 text-green-600'
                                : 'bg-slate-200 text-slate-400'
                            }`}
                          >
                            {enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Lead Capture Widgets
                    </label>
                    <div className="mt-2 space-y-2">
                      {[
                        { key: 'callbackWidget', label: 'Callback Widget' },
                        { key: 'stickyCall', label: 'Sticky Call Button' },
                        { key: 'urgencyIndicator', label: 'Urgency Indicator' },
                      ].map(item => (
                        <div
                          key={item.key}
                          className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg"
                        >
                          <span className="text-sm text-slate-700">{item.label}</span>
                          <button
                            onClick={() =>
                              setSettings(s => ({
                                ...s,
                                [item.key]: !s[item.key as keyof typeof settings],
                              }))
                            }
                            className={`w-10 h-6 rounded-full transition-colors ${
                              settings[item.key as keyof typeof settings]
                                ? 'bg-green-500'
                                : 'bg-slate-200'
                            }`}
                          >
                            <motion.div
                              className="w-4 h-4 bg-white rounded-full shadow m-1"
                              animate={{
                                x: settings[item.key as keyof typeof settings] ? 16 : 0,
                              }}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Form Type */}
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Form Type
                    </label>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {['Simple', 'Multi-step', 'Photo'].map(type => (
                        <button
                          key={type}
                          className="py-2 px-3 text-xs font-medium border-2 border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Export */}
                  <div className="pt-4 border-t border-slate-200">
                    <button
                      onClick={copyConfig}
                      className="w-full py-2 px-4 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? 'Copied!' : 'Copy Current Config'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-200 bg-slate-50">
              <div className="text-[10px] text-slate-400 text-center">
                Dev Panel • Only visible in development
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

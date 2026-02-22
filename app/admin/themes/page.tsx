'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, ExternalLink, Shuffle, Palette, Layout, Type, Square, FileText, Sparkles } from 'lucide-react'

// =============================================================================
// STYLE OPTIONS
// =============================================================================

// Color Themes
const colorThemes = [
  { id: 'fresh-teal', name: 'Fresh Teal', color: '#0d9488' },
  { id: 'ocean-blue', name: 'Ocean Blue', color: '#0284c7' },
  { id: 'forest-green', name: 'Forest', color: '#16a34a' },
  { id: 'sunset-orange', name: 'Sunset', color: '#ea580c' },
  { id: 'royal-purple', name: 'Purple', color: '#7c3aed' },
  { id: 'slate-professional', name: 'Slate', color: '#475569' },
  { id: 'warm-terracotta', name: 'Terra', color: '#c2410c' },
  { id: 'midnight-navy', name: 'Navy', color: '#1e3a5f' },
]

// Font Pairings
const fontPairs = [
  { id: 'geometric', name: 'Geometric', desc: 'Onest / DM Sans', use: 'Modern, clean' },
  { id: 'modern', name: 'Modern', desc: 'Inter / Inter', use: 'Tech, SaaS' },
  { id: 'professional', name: 'Professional', desc: 'Montserrat / Lato', use: 'Corporate' },
  { id: 'friendly', name: 'Friendly', desc: 'Nunito / Open Sans', use: 'Approachable' },
  { id: 'bold', name: 'Bold', desc: 'Oswald / Roboto', use: 'Contractors' },
  { id: 'classic', name: 'Classic', desc: 'Playfair / Source Sans', use: 'Elegant' },
]

// Border Radius
const radiusStyles = [
  { id: 'sharp', name: 'Sharp', radius: '0' },
  { id: 'subtle', name: 'Subtle', radius: '6px' },
  { id: 'rounded', name: 'Rounded', radius: '12px' },
  { id: 'pill', name: 'Pill', radius: '9999px' },
]

// =============================================================================
// LAYOUT COMPONENTS
// =============================================================================

// Header Styles - All show nav on desktop, all support transparent on dark heroes
const headerStyles = [
  { id: 'standard', name: 'Standard', desc: 'Logo → Nav → Phone + CTA' },
  { id: 'trust-bar', name: 'Trust Bar', desc: 'Utility bar + header below' },
  { id: 'centered', name: 'Centered', desc: 'Trust bar + centered logo + nav below' },
  { id: 'floating', name: 'Floating', desc: 'Rounded floating header with margins' },
]

// Hero Styles - Fullwidth triggers transparent header with white text
const heroStyles = [
  { id: 'split', name: 'Split', desc: 'Text left, photo right (light bg)' },
  { id: 'split-form', name: 'Split + Form', desc: 'Text + 3-field form, photo right' },
  { id: 'fullwidth', name: 'Fullwidth', desc: 'Dark photo bg → transparent header' },
  { id: 'compact', name: 'Compact', desc: 'Smaller hero, fast load' },
{ id: 'diagonal', name: 'Diagonal', desc: 'Angled image split, text left' },
  { id: 'mosaic', name: 'Mosaic', desc: 'Multi-image grid, text left' },
  { id: 'branded', name: 'Branded', desc: 'Accent panel + photo split' },
]

// Footer Styles
const footerStyles = [
  { id: 'standard', name: 'Standard', desc: '4-column with all links' },
  { id: 'minimal', name: 'Minimal', desc: 'Simple centered footer' },
  { id: 'centered', name: 'Centered', desc: 'Logo center, links below' },
  { id: 'simple', name: 'Simple', desc: 'Just copyright & essentials' },
]

// =============================================================================
// PAGE LAYOUTS
// =============================================================================

// Service Page Styles
const servicePageStyles = [
  { id: 'standard', name: 'Standard', desc: 'Two-column with sidebar card' },
  { id: 'sidebar', name: 'Sidebar', desc: 'Sticky sidebar, scrolling content' },
  { id: 'fullwidth', name: 'Fullwidth', desc: 'Bold full-width sections' },
]

// Area Page Styles
const areaPageStyles = [
  { id: 'standard', name: 'Standard', desc: 'Two-column hero layout' },
  { id: 'mapfocus', name: 'Map Focus', desc: 'Large map section' },
  { id: 'localhero', name: 'Local Hero', desc: 'Big local-focused hero' },
]

// Contact Page Styles
const contactPageStyles = [
  { id: 'standard', name: 'Standard', desc: 'Form left, info right' },
  { id: 'centered', name: 'Centered', desc: 'Centered form with map below' },
  { id: 'split', name: 'Split', desc: '50/50 form and map' },
]

// =============================================================================
// UI ELEMENTS
// =============================================================================

// Card Styles
const cardStyles = [
  { id: 'elevated', name: 'Elevated', desc: 'Shadow, no border' },
  { id: 'bordered', name: 'Bordered', desc: 'Border, subtle shadow' },
  { id: 'flat', name: 'Flat', desc: 'Gray background, no shadow' },
  { id: 'glass', name: 'Glass', desc: 'Glassmorphism blur effect' },
]

// Button Styles
const buttonStyles = [
  { id: 'solid', name: 'Solid', desc: 'Filled background' },
  { id: 'outline', name: 'Outline', desc: 'Border only' },
  { id: 'soft', name: 'Soft', desc: 'Light background tint' },
  { id: 'gradient', name: 'Gradient', desc: 'Gradient background' },
]

// =============================================================================
// COMPONENTS
// =============================================================================

interface StyleCardProps {
  id: string
  name: string
  desc?: string
  use?: string
  isSelected: boolean
  onClick: () => void
  preview?: React.ReactNode
  compact?: boolean
}

function StyleCard({ name, desc, use, isSelected, onClick, preview, compact }: StyleCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
        isSelected
          ? 'border-violet-500 bg-violet-50 shadow-md'
          : 'border-slate-200 bg-white hover:border-slate-300'
      } ${compact ? 'p-3' : ''}`}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
          <Check className="h-3 w-3 text-white" />
        </div>
      )}
      {preview && <div className="mb-3">{preview}</div>}
      <div className={`font-sans font-medium text-slate-900 ${compact ? 'text-sm' : ''}`}>{name}</div>
      {desc && <div className="font-sans text-xs text-slate-500 mt-0.5">{desc}</div>}
      {use && <div className="font-sans text-xs text-violet-600 mt-1">{use}</div>}
    </button>
  )
}

function SectionHeader({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
        <Icon className="h-5 w-5 text-violet-600" />
      </div>
      <div>
        <h2 className="font-sans text-lg font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  )
}

function Divider() {
  return <div className="border-t border-slate-200 my-8" />
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function ThemesPage() {
  const [theme, setTheme] = useState({
    // Global
    colors: 'ocean-blue',
    fonts: 'geometric',
    radius: 'subtle',
    // Layout
    headerStyle: 'standard',
    heroStyle: 'split',
    footerStyle: 'standard',
    // Pages
    servicePageStyle: 'standard',
    areaPageStyle: 'standard',
    contactPageStyle: 'standard',
    // UI
    cardStyle: 'bordered',
    buttonStyle: 'solid',
  })
  const [applied, setApplied] = useState(false)

  const updateTheme = (key: string, value: string) => {
    setTheme((prev) => ({ ...prev, [key]: value }))
  }

  const applyTheme = () => {
    localStorage.setItem('foundlio-design', JSON.stringify(theme))

    // Broadcast to other tabs using BroadcastChannel
    try {
      const channel = new BroadcastChannel('foundlio-theme')
      channel.postMessage({ type: 'theme-update', theme })
      channel.close()
    } catch (e) {
      // BroadcastChannel not supported
    }

    // Dispatch custom event for components that listen
    window.dispatchEvent(new CustomEvent('foundlio-theme-change', { detail: theme }))

    // Show success feedback (no redirect)
    setApplied(true)
    setTimeout(() => setApplied(false), 2000)
  }

  const randomizeTheme = () => {
    setTheme({
      colors: colorThemes[Math.floor(Math.random() * colorThemes.length)].id,
      fonts: fontPairs[Math.floor(Math.random() * fontPairs.length)].id,
      radius: radiusStyles[Math.floor(Math.random() * radiusStyles.length)].id,
      headerStyle: headerStyles[Math.floor(Math.random() * headerStyles.length)].id,
      heroStyle: heroStyles[Math.floor(Math.random() * heroStyles.length)].id,
      footerStyle: footerStyles[Math.floor(Math.random() * footerStyles.length)].id,
      servicePageStyle: servicePageStyles[Math.floor(Math.random() * servicePageStyles.length)].id,
      areaPageStyle: areaPageStyles[Math.floor(Math.random() * areaPageStyles.length)].id,
      contactPageStyle: contactPageStyles[Math.floor(Math.random() * contactPageStyles.length)].id,
      cardStyle: cardStyles[Math.floor(Math.random() * cardStyles.length)].id,
      buttonStyle: buttonStyles[Math.floor(Math.random() * buttonStyles.length)].id,
    })
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="font-sans text-xl font-bold text-slate-900">Design Controls</h1>
              <p className="text-sm text-slate-500">Customize your website appearance</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={randomizeTheme}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
            >
              <Shuffle className="h-4 w-4" />
              <span className="hidden sm:inline">Randomize</span>
            </button>
            <button
              onClick={applyTheme}
              className={`flex items-center gap-2 px-5 py-2 font-medium rounded-lg transition-colors shadow-lg ${
                applied
                  ? 'bg-green-600 text-white shadow-green-600/25'
                  : 'bg-violet-600 text-white hover:bg-violet-700 shadow-violet-600/25'
              }`}
            >
              {applied ? (
                <>
                  <Check className="h-4 w-4" />
                  Applied!
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4" />
                  Apply
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* ================================================================= */}
        {/* GLOBAL STYLES */}
        {/* ================================================================= */}
        <SectionHeader
          icon={Palette}
          title="Global Styles"
          description="Colors, fonts, and base styling that apply everywhere"
        />

        {/* Colors */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h3 className="font-sans font-semibold text-slate-900 mb-4 text-base">Color Theme</h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {colorThemes.map((color) => (
              <button
                key={color.id}
                onClick={() => updateTheme('colors', color.id)}
                className={`relative aspect-square rounded-xl transition-all hover:scale-105 group ${
                  theme.colors === color.id ? 'ring-4 ring-violet-500 ring-offset-2' : ''
                }`}
                style={{ backgroundColor: color.color }}
                title={color.name}
              >
                {theme.colors === color.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="h-6 w-6 text-white drop-shadow-lg" />
                  </div>
                )}
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {color.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Fonts & Radius */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Fonts */}
          <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-sans font-semibold text-slate-900 mb-4 text-base">Font Pairing</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {fontPairs.map((font) => (
                <StyleCard
                  key={font.id}
                  id={font.id}
                  name={font.name}
                  desc={font.desc}
                  use={font.use}
                  isSelected={theme.fonts === font.id}
                  onClick={() => updateTheme('fonts', font.id)}
                  compact
                />
              ))}
            </div>
          </div>

          {/* Radius */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-sans font-semibold text-slate-900 mb-4 text-base">Border Radius</h3>
            <div className="grid grid-cols-2 gap-3">
              {radiusStyles.map((style) => (
                <StyleCard
                  key={style.id}
                  id={style.id}
                  name={style.name}
                  isSelected={theme.radius === style.id}
                  onClick={() => updateTheme('radius', style.id)}
                  compact
                  preview={
                    <div
                      className="w-10 h-10 bg-slate-200 mx-auto"
                      style={{ borderRadius: style.radius }}
                    />
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <Divider />

        {/* ================================================================= */}
        {/* LAYOUT COMPONENTS */}
        {/* ================================================================= */}
        <SectionHeader
          icon={Layout}
          title="Layout Components"
          description="Header, hero, and footer styles"
        />

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Header */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-sans font-semibold text-slate-900 mb-4 text-base">Header Style</h3>
            <div className="space-y-3">
              {headerStyles.map((style) => (
                <StyleCard
                  key={style.id}
                  id={style.id}
                  name={style.name}
                  desc={style.desc}
                  isSelected={theme.headerStyle === style.id}
                  onClick={() => updateTheme('headerStyle', style.id)}
                  compact
                />
              ))}
            </div>
          </div>

          {/* Hero */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-sans font-semibold text-slate-900 mb-4 text-base">Hero Style</h3>
            <div className="space-y-3">
              {heroStyles.map((style) => (
                <StyleCard
                  key={style.id}
                  id={style.id}
                  name={style.name}
                  desc={style.desc}
                  isSelected={theme.heroStyle === style.id}
                  onClick={() => updateTheme('heroStyle', style.id)}
                  compact
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h3 className="font-sans font-semibold text-slate-900 mb-4 text-base">Footer Style</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {footerStyles.map((style) => (
              <StyleCard
                key={style.id}
                id={style.id}
                name={style.name}
                desc={style.desc}
                isSelected={theme.footerStyle === style.id}
                onClick={() => updateTheme('footerStyle', style.id)}
                compact
              />
            ))}
          </div>
        </div>

        <Divider />

        {/* ================================================================= */}
        {/* PAGE LAYOUTS */}
        {/* ================================================================= */}
        <SectionHeader
          icon={FileText}
          title="Page Layouts"
          description="Individual page layout options"
        />

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Service Pages */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-sans font-semibold text-slate-900 mb-4 text-base">Service Pages</h3>
            <div className="space-y-3">
              {servicePageStyles.map((style) => (
                <StyleCard
                  key={style.id}
                  id={style.id}
                  name={style.name}
                  desc={style.desc}
                  isSelected={theme.servicePageStyle === style.id}
                  onClick={() => updateTheme('servicePageStyle', style.id)}
                  compact
                />
              ))}
            </div>
          </div>

          {/* Area Pages */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-sans font-semibold text-slate-900 mb-4 text-base">Area Pages</h3>
            <div className="space-y-3">
              {areaPageStyles.map((style) => (
                <StyleCard
                  key={style.id}
                  id={style.id}
                  name={style.name}
                  desc={style.desc}
                  isSelected={theme.areaPageStyle === style.id}
                  onClick={() => updateTheme('areaPageStyle', style.id)}
                  compact
                />
              ))}
            </div>
          </div>

          {/* Contact Page */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-sans font-semibold text-slate-900 mb-4 text-base">Contact Page</h3>
            <div className="space-y-3">
              {contactPageStyles.map((style) => (
                <StyleCard
                  key={style.id}
                  id={style.id}
                  name={style.name}
                  desc={style.desc}
                  isSelected={theme.contactPageStyle === style.id}
                  onClick={() => updateTheme('contactPageStyle', style.id)}
                  compact
                />
              ))}
            </div>
          </div>
        </div>

        <Divider />

        {/* ================================================================= */}
        {/* UI ELEMENTS */}
        {/* ================================================================= */}
        <SectionHeader
          icon={Square}
          title="UI Elements"
          description="Cards, buttons, and component styling"
        />

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Card Style */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-sans font-semibold text-slate-900 mb-4 text-base">Card Style</h3>
            <div className="grid grid-cols-2 gap-3">
              {cardStyles.map((style) => (
                <StyleCard
                  key={style.id}
                  id={style.id}
                  name={style.name}
                  desc={style.desc}
                  isSelected={theme.cardStyle === style.id}
                  onClick={() => updateTheme('cardStyle', style.id)}
                  compact
                />
              ))}
            </div>
          </div>

          {/* Button Style */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-sans font-semibold text-slate-900 mb-4 text-base">Button Style</h3>
            <div className="grid grid-cols-2 gap-3">
              {buttonStyles.map((style) => (
                <StyleCard
                  key={style.id}
                  id={style.id}
                  name={style.name}
                  desc={style.desc}
                  isSelected={theme.buttonStyle === style.id}
                  onClick={() => updateTheme('buttonStyle', style.id)}
                  compact
                />
              ))}
            </div>
          </div>
        </div>

        <Divider />

        {/* ================================================================= */}
        {/* CONFIGURATION PREVIEW */}
        {/* ================================================================= */}
        <SectionHeader
          icon={Sparkles}
          title="Configuration"
          description="Current theme settings as JSON"
        />

        <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm">
          <pre className="text-sm text-slate-300 overflow-x-auto">
            {JSON.stringify(theme, null, 2)}
          </pre>
        </div>

        {/* Spacer */}
        <div className="h-8" />
      </main>
    </div>
  )
}

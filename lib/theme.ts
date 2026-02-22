/**
 * Theme Configuration System
 * Loads theme settings from theme.json and provides typed access
 */

import themeData from '@/data/theme.json'

// Theme Types
export type ColorTheme =
  | 'fresh-teal'
  | 'ocean-blue'
  | 'forest-green'
  | 'sunset-orange'
  | 'royal-purple'
  | 'slate-professional'
  | 'warm-terracotta'
  | 'midnight-navy'

export type HeroStyle = 'split' | 'centered' | 'fullwidth' | 'minimal'
export type CardStyle = 'elevated' | 'bordered' | 'flat' | 'glass'
export type RadiusStyle = 'sharp' | 'subtle' | 'rounded' | 'pill'
export type NavStyle = 'standard' | 'centered' | 'minimal' | 'transparent'
export type FontStyle = 'modern' | 'classic' | 'bold' | 'friendly'

export interface ThemeConfig {
  colors: ColorTheme
  heroStyle: HeroStyle
  cardStyle: CardStyle
  radius: RadiusStyle
  navStyle: NavStyle
  fonts: FontStyle
}

// Load theme from JSON
export const theme: ThemeConfig = {
  colors: (themeData.colors as ColorTheme) || 'fresh-teal',
  heroStyle: (themeData.heroStyle as HeroStyle) || 'split',
  cardStyle: (themeData.cardStyle as CardStyle) || 'elevated',
  radius: (themeData.radius as RadiusStyle) || 'rounded',
  navStyle: (themeData.navStyle as NavStyle) || 'standard',
  fonts: (themeData.fonts as FontStyle) || 'modern',
}

// Helper to get CSS classes for current theme
export function getThemeClasses() {
  return {
    color: `theme-${theme.colors}`,
    hero: `hero-${theme.heroStyle}`,
    card: `card-${theme.cardStyle}`,
    radius: `radius-${theme.radius}`,
    nav: `nav-${theme.navStyle}`,
    font: `font-${theme.fonts}`,
  }
}

// Get all theme classes as a single string for body/html
export function getBodyThemeClasses(): string {
  const classes = getThemeClasses()
  return Object.values(classes).join(' ')
}

// Radius values for Tailwind
export const radiusValues: Record<RadiusStyle, string> = {
  sharp: 'rounded-none',
  subtle: 'rounded',
  rounded: 'rounded-xl',
  pill: 'rounded-full',
}

// Card style classes
export const cardStyles: Record<CardStyle, string> = {
  elevated: 'bg-white shadow-md border-0',
  bordered: 'bg-white border-2 border-slate-200 shadow-none',
  flat: 'bg-slate-50 border-0 shadow-none',
  glass: 'bg-white/70 backdrop-blur-md border border-white/20 shadow-lg',
}

// Get card classes based on theme
export function getCardClasses(hover: boolean = false): string {
  const base = cardStyles[theme.cardStyle]
  const radius = radiusValues[theme.radius]
  const hoverEffect = hover ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300' : ''
  return `${base} ${radius} ${hoverEffect}`.trim()
}

// Font family mappings
export const fontFamilies: Record<FontStyle, { heading: string; body: string }> = {
  modern: {
    heading: "'Inter', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
  },
  classic: {
    heading: "'Playfair Display', Georgia, serif",
    body: "'Source Sans 3', system-ui, sans-serif",
  },
  bold: {
    heading: "'Oswald', system-ui, sans-serif",
    body: "'Roboto', system-ui, sans-serif",
  },
  friendly: {
    heading: "'Nunito', system-ui, sans-serif",
    body: "'Open Sans', system-ui, sans-serif",
  },
}

export default theme

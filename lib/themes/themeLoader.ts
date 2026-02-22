/**
 * Theme Loader - Load and apply themes from presets
 *
 * Features:
 * - Load theme presets by ID
 * - Generate CSS custom properties
 * - Generate Tailwind config overrides
 * - Support theme customization
 */

import presetsData from '@/data/themes/presets.json'
import type { ThemePreset, Theme, ColorPalette } from './theme.schema'

// Type the imported data
const presets = presetsData.presets as ThemePreset[]
const fontPairings = presetsData.fontPairings
const colorPalettes = presetsData.colorPalettes

// ============================================
// PRESET LOADERS
// ============================================

/**
 * Get all available theme presets
 */
export function getThemePresets(): ThemePreset[] {
  return presets
}

/**
 * Get theme preset by ID
 */
export function getThemePreset(id: string): ThemePreset | undefined {
  return presets.find(p => p.id === id)
}

/**
 * Get presets by category
 */
export function getPresetsByCategory(category: ThemePreset['category']): ThemePreset[] {
  return presets.filter(p => p.category === category)
}

/**
 * Get presets for specific industry
 */
export function getPresetsForIndustry(industry: string): ThemePreset[] {
  return presets.filter(p =>
    p.industries?.includes(industry) || p.industries?.includes('all')
  )
}

/**
 * Get all font pairings
 */
export function getFontPairings() {
  return fontPairings
}

/**
 * Get all color palettes
 */
export function getColorPalettes() {
  return colorPalettes
}

// ============================================
// CSS GENERATION
// ============================================

/**
 * Generate CSS custom properties from theme preset
 */
export function generateCSSVariables(preset: ThemePreset): Record<string, string> {
  const { colors, fonts, style } = preset

  // Border radius values
  const radiusMap: Record<string, string> = {
    none: '0',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  }

  // Shadow values
  const shadowMap: Record<string, string> = {
    none: 'none',
    subtle: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    medium: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    bold: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  }

  return {
    // Colors
    '--color-primary': colors.primary,
    '--color-primary-hover': colors.primaryHover || adjustColor(colors.primary, -15),
    '--color-primary-light': colors.primaryLight || adjustColor(colors.primary, 90),
    '--color-secondary': colors.secondary || colors.primary,
    '--color-background': colors.background,
    '--color-surface': colors.surface || colors.background,
    '--color-text': colors.text,
    '--color-text-muted': colors.muted,
    '--color-border': colors.border || adjustColor(colors.text, 85),

    // Typography
    '--font-heading': fonts?.heading ? `"${fonts.heading}", sans-serif` : 'system-ui, sans-serif',
    '--font-body': fonts?.body ? `"${fonts.body}", sans-serif` : 'system-ui, sans-serif',

    // Style
    '--radius': radiusMap[style.borderRadius] || radiusMap.lg,
    '--shadow': shadowMap[style.shadows] || shadowMap.subtle,
  }
}

/**
 * Generate CSS string from variables
 */
export function generateCSSString(preset: ThemePreset): string {
  const vars = generateCSSVariables(preset)

  const cssLines = Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')

  return `:root {\n${cssLines}\n}`
}

/**
 * Generate Google Fonts import URL
 */
export function generateGoogleFontsUrl(preset: ThemePreset): string | null {
  const fonts = preset.fonts
  if (!fonts) return null

  const fontFamilies: string[] = []

  if (fonts.heading && fonts.heading !== 'system') {
    fontFamilies.push(`family=${fonts.heading.replace(/ /g, '+')}:wght@400;500;600;700`)
  }

  if (fonts.body && fonts.body !== 'system' && fonts.body !== fonts.heading) {
    fontFamilies.push(`family=${fonts.body.replace(/ /g, '+')}:wght@400;500;600;700`)
  }

  if (fontFamilies.length === 0) return null

  return `https://fonts.googleapis.com/css2?${fontFamilies.join('&')}&display=swap`
}

// ============================================
// TAILWIND CONFIG GENERATION
// ============================================

/**
 * Generate Tailwind theme extension from preset
 */
export function generateTailwindConfig(preset: ThemePreset) {
  const { colors, fonts, style } = preset

  // Border radius for Tailwind
  const radiusMap: Record<string, Record<string, string>> = {
    none: { DEFAULT: '0', sm: '0', md: '0', lg: '0' },
    sm: { DEFAULT: '0.25rem', sm: '0.125rem', md: '0.25rem', lg: '0.375rem' },
    md: { DEFAULT: '0.375rem', sm: '0.25rem', md: '0.375rem', lg: '0.5rem' },
    lg: { DEFAULT: '0.5rem', sm: '0.375rem', md: '0.5rem', lg: '0.75rem' },
    xl: { DEFAULT: '0.75rem', sm: '0.5rem', md: '0.75rem', lg: '1rem' },
    full: { DEFAULT: '9999px', sm: '9999px', md: '9999px', lg: '9999px' },
  }

  return {
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: colors.primary,
            hover: colors.primaryHover || adjustColor(colors.primary, -15),
            light: colors.primaryLight || adjustColor(colors.primary, 90),
          },
          secondary: {
            DEFAULT: colors.secondary || colors.primary,
          },
          background: colors.background,
          surface: colors.surface || colors.background,
          foreground: colors.text,
          muted: {
            DEFAULT: colors.muted,
            foreground: colors.muted,
          },
          border: colors.border || adjustColor(colors.text, 85),
        },
        fontFamily: {
          heading: fonts?.heading ? [fonts.heading, 'sans-serif'] : ['system-ui', 'sans-serif'],
          body: fonts?.body ? [fonts.body, 'sans-serif'] : ['system-ui', 'sans-serif'],
        },
        borderRadius: radiusMap[style.borderRadius] || radiusMap.lg,
      },
    },
  }
}

// ============================================
// THEME MERGING & CUSTOMIZATION
// ============================================

/**
 * Merge preset with custom overrides
 */
export function customizePreset(
  presetId: string,
  overrides: Partial<ThemePreset>
): ThemePreset {
  const base = getThemePreset(presetId)
  if (!base) {
    throw new Error(`Theme preset "${presetId}" not found`)
  }

  return {
    ...base,
    ...overrides,
    id: overrides.id || `${base.id}-custom`,
    colors: {
      ...base.colors,
      ...overrides.colors,
    },
    fonts: {
      ...base.fonts,
      ...overrides.fonts,
    },
    style: {
      ...base.style,
      ...overrides.style,
    },
  }
}

/**
 * Create theme from site config theme section
 */
export function themeFromConfig(config: {
  colors: {
    primary: string
    secondary?: string
    background: string
    text: string
    muted: string
  }
  style?: string
  borderRadius?: string
}): ThemePreset {
  return {
    id: 'from-config',
    name: 'Custom',
    category: 'professional',
    colors: {
      primary: config.colors.primary,
      primaryHover: adjustColor(config.colors.primary, -15),
      primaryLight: adjustColor(config.colors.primary, 90),
      secondary: config.colors.secondary,
      background: config.colors.background,
      surface: config.colors.background,
      text: config.colors.text,
      muted: config.colors.muted,
      border: adjustColor(config.colors.text, 85),
    },
    style: {
      borderRadius: (config.borderRadius as ThemePreset['style']['borderRadius']) || 'lg',
      shadows: 'subtle',
      spacing: 'normal',
    },
  }
}

// ============================================
// UTILITIES
// ============================================

/**
 * Adjust color lightness (simple implementation)
 * Positive amount = lighter, negative = darker
 */
function adjustColor(hex: string, amount: number): string {
  // Remove # if present
  hex = hex.replace(/^#/, '')

  // Parse RGB
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)

  // Adjust
  const adjust = (c: number) => Math.max(0, Math.min(255, c + Math.round(amount * 2.55)))

  // Convert back to hex
  const toHex = (c: number) => c.toString(16).padStart(2, '0')

  return `#${toHex(adjust(r))}${toHex(adjust(g))}${toHex(adjust(b))}`
}

/**
 * Check if color is dark (for text contrast)
 */
export function isColorDark(hex: string): boolean {
  hex = hex.replace(/^#/, '')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance < 0.5
}

/**
 * Get contrasting text color
 */
export function getContrastColor(hex: string): string {
  return isColorDark(hex) ? '#ffffff' : '#000000'
}

// ============================================
// REACT HOOK (for client components)
// ============================================

/**
 * Apply theme to document (client-side)
 */
export function applyTheme(preset: ThemePreset): void {
  if (typeof window === 'undefined') return

  const vars = generateCSSVariables(preset)

  Object.entries(vars).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value)
  })

  // Add Google Fonts if needed
  const fontsUrl = generateGoogleFontsUrl(preset)
  if (fontsUrl) {
    const existingLink = document.querySelector('link[data-theme-fonts]')
    if (existingLink) {
      existingLink.setAttribute('href', fontsUrl)
    } else {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = fontsUrl
      link.setAttribute('data-theme-fonts', 'true')
      document.head.appendChild(link)
    }
  }
}

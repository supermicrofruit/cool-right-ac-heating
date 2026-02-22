/**
 * Theme Schema - Multi-theme system for Foundlio
 *
 * Supports:
 * - Color palettes (with semantic naming)
 * - Typography (Google Fonts + system stacks)
 * - Spacing & sizing
 * - Component styles
 * - Dark mode variants
 *
 * Shared between: hvac-01, react-templates, client-portal
 */

// ============================================
// COLOR SYSTEM
// ============================================

export interface ColorPalette {
  // Brand colors
  primary: string           // Main accent (buttons, links)
  primaryHover: string      // Primary hover state
  primaryLight: string      // Light variant (backgrounds)
  primaryDark: string       // Dark variant (text on light)

  secondary?: string        // Optional second accent
  secondaryHover?: string
  secondaryLight?: string

  // Semantic colors
  success: string           // Green - success states
  warning: string           // Yellow/Orange - warnings
  error: string             // Red - errors
  info: string              // Blue - informational

  // Neutrals
  background: string        // Page background
  surface: string           // Card/section background
  surfaceHover: string      // Hover state for surfaces
  border: string            // Default borders
  borderLight: string       // Subtle borders

  // Text
  text: string              // Primary text
  textSecondary: string     // Secondary/muted text
  textInverse: string       // Text on dark backgrounds
  textOnPrimary: string     // Text on primary color

  // Special
  overlay: string           // Modal overlays (with opacity)
  shadow: string            // Box shadow color
}

export interface ColorMode {
  light: ColorPalette
  dark?: ColorPalette       // Optional dark mode
}

// ============================================
// TYPOGRAPHY
// ============================================

export interface FontFamily {
  name: string              // Display name
  stack: string             // CSS font-family value
  google?: string           // Google Fonts import name (if different)
  weights: number[]         // Available weights
}

export interface Typography {
  // Font families
  heading: FontFamily
  body: FontFamily
  mono?: FontFamily         // Code/technical text

  // Base sizing
  baseFontSize: number      // Usually 16
  baseLineHeight: number    // Usually 1.5-1.6

  // Scale (relative to base)
  scale: {
    xs: string              // 0.75rem
    sm: string              // 0.875rem
    base: string            // 1rem
    lg: string              // 1.125rem
    xl: string              // 1.25rem
    '2xl': string           // 1.5rem
    '3xl': string           // 1.875rem
    '4xl': string           // 2.25rem
    '5xl': string           // 3rem
    '6xl': string           // 3.75rem
  }

  // Heading styles
  headings: {
    h1: TypographyStyle
    h2: TypographyStyle
    h3: TypographyStyle
    h4: TypographyStyle
    h5: TypographyStyle
    h6: TypographyStyle
  }

  // Body styles
  bodyStyles: {
    default: TypographyStyle
    small: TypographyStyle
    large: TypographyStyle
  }
}

export interface TypographyStyle {
  fontSize: string
  fontWeight: number
  lineHeight: number
  letterSpacing?: string
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
}

// ============================================
// SPACING & LAYOUT
// ============================================

export interface Spacing {
  // Base unit (usually 4px or 0.25rem)
  unit: number

  // Scale
  scale: {
    0: string               // 0
    1: string               // 0.25rem
    2: string               // 0.5rem
    3: string               // 0.75rem
    4: string               // 1rem
    5: string               // 1.25rem
    6: string               // 1.5rem
    8: string               // 2rem
    10: string              // 2.5rem
    12: string              // 3rem
    16: string              // 4rem
    20: string              // 5rem
    24: string              // 6rem
    32: string              // 8rem
  }

  // Section padding
  section: {
    sm: string              // Compact sections
    md: string              // Default
    lg: string              // Spacious
    xl: string              // Very spacious
  }

  // Container max-widths
  container: {
    sm: string              // 640px
    md: string              // 768px
    lg: string              // 1024px
    xl: string              // 1280px
    '2xl': string           // 1536px
  }
}

// ============================================
// COMPONENTS
// ============================================

export interface BorderRadius {
  none: string              // 0
  sm: string                // 0.125rem
  md: string                // 0.375rem
  lg: string                // 0.5rem
  xl: string                // 0.75rem
  '2xl': string             // 1rem
  '3xl': string             // 1.5rem
  full: string              // 9999px
}

export interface Shadows {
  none: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  inner: string
}

export interface ComponentStyles {
  // Buttons
  button: {
    borderRadius: keyof BorderRadius
    fontWeight: number
    textTransform?: 'none' | 'uppercase'
    padding: {
      sm: string
      md: string
      lg: string
    }
  }

  // Cards
  card: {
    borderRadius: keyof BorderRadius
    shadow: keyof Shadows
    border: boolean
    padding: string
  }

  // Inputs
  input: {
    borderRadius: keyof BorderRadius
    borderWidth: string
    padding: string
    focusRing: boolean
  }

  // Badges
  badge: {
    borderRadius: keyof BorderRadius
    fontWeight: number
    textTransform?: 'none' | 'uppercase'
  }
}

// ============================================
// EFFECTS & ANIMATIONS
// ============================================

export interface Effects {
  // Transitions
  transition: {
    fast: string            // 150ms
    normal: string          // 200ms
    slow: string            // 300ms
  }

  // Animations
  animation: {
    enabled: boolean
    duration: string
    easing: string
  }

  // Blur
  blur: {
    sm: string
    md: string
    lg: string
  }
}

// ============================================
// COMPLETE THEME
// ============================================

export interface Theme {
  // Metadata
  id: string                // Unique identifier
  name: string              // Display name
  description?: string
  version: string
  author?: string

  // Categories for filtering
  category: 'professional' | 'modern' | 'classic' | 'bold' | 'minimal' | 'luxury'
  industries?: string[]     // ['hvac', 'plumbing', 'all']

  // Theme data
  colors: ColorMode
  typography: Typography
  spacing: Spacing
  borderRadius: BorderRadius
  shadows: Shadows
  components: ComponentStyles
  effects: Effects

  // CSS custom properties output
  cssVariables?: Record<string, string>
}

// ============================================
// THEME PRESET (Simplified)
// ============================================

/**
 * Simplified theme preset for quick use
 * Full themes extend from this
 */
export interface ThemePreset {
  id: string
  name: string
  category: Theme['category']
  description?: string
  industries?: string[]     // ['hvac', 'plumbing', 'all']

  // Quick settings
  colors: {
    primary: string
    primaryHover?: string
    primaryLight?: string
    secondary?: string
    background: string
    surface?: string
    text: string
    muted: string
    border?: string
  }

  fonts?: {
    heading?: string        // Google Font name or 'system'
    body?: string
  }

  style: {
    borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full'
    shadows: 'none' | 'subtle' | 'medium' | 'bold'
    spacing: 'compact' | 'normal' | 'spacious'
  }
}

// ============================================
// EXPORTS
// ============================================

export type ThemeCategory = Theme['category']
export type BorderRadiusKey = keyof BorderRadius
export type ShadowKey = keyof Shadows

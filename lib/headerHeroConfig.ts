/**
 * Header + Hero Configuration
 *
 * Key principle: Header transparency is controlled by HERO style, not header style.
 * - Dark hero (fullwidth) → header becomes transparent with white text
 * - Light hero → header stays solid with dark text
 *
 * All headers show navigation on desktop (no hamburger-only headers).
 */

export type HeaderStyle = 'standard' | 'trust-bar' | 'centered' | 'floating'
export type HeroStyle = 'split' | 'split-form' | 'fullwidth' | 'compact' | 'diagonal' | 'mosaic' | 'branded'

export interface HeaderConfig {
  id: HeaderStyle
  name: string
  description: string
  /** Whether this header has a utility/top bar */
  hasUtilityBar: boolean
  /** Layout type */
  layout: 'horizontal' | 'stacked'
}

export interface HeroConfig {
  id: HeroStyle
  name: string
  description: string
  /** Whether hero has dark background (needs transparent header with white text) */
  hasDarkBackground: boolean
  /** Whether hero includes an embedded form */
  hasForm: boolean
  /** Photo placement type */
  photoPlacement: 'side' | 'background' | 'grid' | 'split'
}

/**
 * Header Configurations
 *
 * All headers:
 * - Show navigation on desktop (lg+ breakpoint)
 * - Support transparent mode when paired with dark heroes
 * - Include phone number and CTA
 */
export const HEADER_CONFIGS: Record<HeaderStyle, HeaderConfig> = {
  'standard': {
    id: 'standard',
    name: 'Standard',
    description: 'Logo left → Nav → Phone + CTA. Classic horizontal layout.',
    hasUtilityBar: false,
    layout: 'horizontal',
  },
  'trust-bar': {
    id: 'trust-bar',
    name: 'Trust Bar',
    description: 'Utility bar (hours, area, license) + standard header. Professional, high-trust.',
    hasUtilityBar: true,
    layout: 'horizontal',
  },
  'centered': {
    id: 'centered',
    name: 'Centered',
    description: 'Trust bar + centered logo + nav below + phone. Elegant, balanced.',
    hasUtilityBar: true,
    layout: 'stacked',
  },
  'floating': {
    id: 'floating',
    name: 'Floating',
    description: 'Utility bar on top + floating rounded header with margin on all sides. Modern, premium.',
    hasUtilityBar: true,
    layout: 'horizontal',
  },
}

/**
 * Hero Configurations
 *
 * Research-backed design decisions:
 * - No carousels (only 1% click them)
 * - Single static image with clear headline
 * - Forms: 3 fields max (25% conversion vs 15% for 6+)
 * - Real photos: +35% conversion vs stock
 */
export const HERO_CONFIGS: Record<HeroStyle, HeroConfig> = {
  'split': {
    id: 'split',
    name: 'Split',
    description: 'Text left, photo right. Clean and effective. Light background.',
    hasDarkBackground: false,
    hasForm: false,
    photoPlacement: 'side',
  },
  'split-form': {
    id: 'split-form',
    name: 'Split + Form',
    description: 'Text + 3-field form left, photo right. Lead gen focused.',
    hasDarkBackground: false,
    hasForm: true,
    photoPlacement: 'side',
  },
  'fullwidth': {
    id: 'fullwidth',
    name: 'Fullwidth',
    description: 'Dark photo background with overlay. Dramatic. Header becomes transparent.',
    hasDarkBackground: true,
    hasForm: false,
    photoPlacement: 'background',
  },
  'compact': {
    id: 'compact',
    name: 'Compact',
    description: 'Smaller hero, photo on side. Fast load, lets content shine.',
    hasDarkBackground: false,
    hasForm: false,
    photoPlacement: 'side',
  },
  'diagonal': {
    id: 'diagonal',
    name: 'Diagonal',
    description: 'Diagonal image split — image clipped at angle on right, text on light left.',
    hasDarkBackground: false,
    hasForm: false,
    photoPlacement: 'side',
  },
  'mosaic': {
    id: 'mosaic',
    name: 'Mosaic',
    description: 'Multi-image asymmetric grid on right. Communicates service breadth.',
    hasDarkBackground: false,
    hasForm: false,
    photoPlacement: 'grid',
  },
  'branded': {
    id: 'branded',
    name: 'Branded',
    description: 'Bold accent panel + photo split. Magazine spread feel, strongest brand identity.',
    hasDarkBackground: true,
    hasForm: false,
    photoPlacement: 'split',
  },
}

/** Headers that support light text on dark hero backgrounds */
const LIGHT_TEXT_CAPABLE_HEADERS: HeaderStyle[] = ['floating', 'centered']

/**
 * Determine if header should use light text (for dark hero backgrounds)
 * Light text is used when: hero has dark background AND header supports it AND user hasn't scrolled
 */
export function shouldUseLightText(header: HeaderStyle, hero: HeroStyle, isScrolled: boolean): boolean {
  const heroConfig = HERO_CONFIGS[hero] || HERO_CONFIGS['split']
  return heroConfig.hasDarkBackground && LIGHT_TEXT_CAPABLE_HEADERS.includes(header) && !isScrolled
}

/**
 * Header is transparent on homepage when:
 * - Floating header: ALWAYS (has its own white container, floats over hero bg)
 * - Centered header: only on dark heroes (switches to light text)
 * - Standard/trust-bar: never (don't support light text)
 */
export function shouldBeTransparent(header: HeaderStyle, hero: HeroStyle): boolean {
  if (header === 'floating') return true
  const heroConfig = HERO_CONFIGS[hero] || HERO_CONFIGS['split']
  return heroConfig.hasDarkBackground && LIGHT_TEXT_CAPABLE_HEADERS.includes(header)
}

/**
 * Get recommended header for a hero style
 */
export function getRecommendedHeader(hero: HeroStyle): HeaderStyle {
  const heroConfig = HERO_CONFIGS[hero] || HERO_CONFIGS['split']

  // For forms, recommend trust-bar (builds credibility)
  if (heroConfig.hasForm) {
    return 'trust-bar'
  }

  // Default to standard
  return 'standard'
}

/**
 * Get recommended hero for a header style
 */
export function getRecommendedHero(header: HeaderStyle): HeroStyle {
  const headerConfig = HEADER_CONFIGS[header] || HEADER_CONFIGS['standard']

  // For trust-bar or centered, split-form builds on the professional feel
  if (headerConfig.hasUtilityBar) {
    return 'split-form'
  }

  // Default to split
  return 'split'
}

/**
 * Theme Schema
 * Defines the structure of theme.json (custom themes)
 *
 * Themes control the visual appearance of the website.
 * The template supports theme presets and custom themes.
 */

export interface ThemeColors {
  /**
   * Primary brand color
   * HSL format without hsl(): "268 95% 40%"
   * Used for buttons, links, accents
   */
  primary: string;

  /**
   * Text color on primary backgrounds
   * Usually "0 0% 100%" (white) or dark for light primaries
   */
  primaryForeground: string;

  /**
   * Page background color
   * Usually "0 0% 100%" (white) or "0 0% 99%"
   */
  background: string;

  /**
   * Main text color
   * Usually "0 0% 0%" (black) or "0 0% 4%" (near black)
   */
  foreground: string;

  /**
   * Muted background (sections, cards)
   * Usually "0 0% 96%" (light gray)
   */
  muted: string;

  /**
   * Text on muted backgrounds
   * Usually "0 0% 45%" (medium gray)
   */
  mutedForeground: string;

  /**
   * Card background
   * Usually same as background
   */
  card: string;

  /**
   * Border color
   * Usually "0 0% 90%" or with primary hue
   */
  border: string;

  /**
   * Focus ring color
   * Usually same as primary
   */
  ring: string;

  /**
   * Footer background
   * Usually darkened primary: "268 95% 20%"
   */
  footerBg: string;
}

export interface Theme {
  /** Unique identifier */
  id: string;

  /** Display name */
  name: string;

  /**
   * Category
   * "preset" for built-in, "custom" for user-created
   */
  category: "preset" | "custom";

  /**
   * Preview color (for theme picker)
   * Full HSL: "hsl(268 95% 40%)"
   */
  preview: string;

  /** Color definitions */
  colors: ThemeColors;
}

export interface ThemeFile {
  /** Array of custom themes */
  themes: Theme[];
}

/**
 * Example theme.json (custom themes):
 *
 * {
 *   "themes": [
 *     {
 *       "id": "purple-haze",
 *       "name": "Purple Haze",
 *       "category": "custom",
 *       "preview": "hsl(268 95% 40%)",
 *       "colors": {
 *         "primary": "268 95% 40%",
 *         "primaryForeground": "0 0% 100%",
 *         "background": "0 0% 99%",
 *         "foreground": "0 0% 0%",
 *         "muted": "0 0% 96%",
 *         "mutedForeground": "0 0% 32%",
 *         "card": "0 0% 99%",
 *         "border": "240 13% 91%",
 *         "ring": "0 0% 0%",
 *         "footerBg": "268 95% 20%"
 *       }
 *     }
 *   ]
 * }
 */

/**
 * Available Theme Presets (built into template):
 *
 * - professional-blue: Classic, trustworthy (service businesses)
 * - bold-orange: High-energy, urgent (HVAC, emergency services)
 * - modern-teal: Contemporary, fresh
 * - classic-navy: Traditional, premium
 * - minimal-slate: Clean, understated
 * - luxury-gold: Premium services
 * - desert-red: Southwest feel
 * - fresh-green: Eco-friendly, landscaping
 * - electric-purple: Modern, tech
 * - trust-blue-light: Soft, approachable
 * - contractor-dark: Bold, construction
 * - soft-coral: Warm, friendly
 *
 * Theme Selection Guidelines by Vertical:
 *
 * HVAC:
 * - bold-orange (emergency, heat)
 * - professional-blue (trustworthy)
 * - trust-blue-light (friendly)
 *
 * Plumbing:
 * - professional-blue (water association)
 * - trust-blue-light (clean, water)
 * - modern-teal (fresh, clean)
 *
 * Electrical:
 * - electric-purple (energy, modern)
 * - bold-orange (power, energy)
 * - professional-blue (safe, reliable)
 *
 * Roofing:
 * - contractor-dark (bold, strong)
 * - classic-navy (trustworthy)
 * - desert-red (regional, strong)
 *
 * Landscaping:
 * - fresh-green (nature, growth)
 * - modern-teal (fresh)
 * - minimal-slate (clean design focus)
 *
 * Creating Custom Colors:
 *
 * 1. Pick primary hue (0-360)
 * 2. Set saturation (70-95% for vibrant)
 * 3. Set lightness (35-55% for primary)
 * 4. Footer lightness = primary lightness - 20
 * 5. Ensure contrast ratio 4.5:1 minimum
 */

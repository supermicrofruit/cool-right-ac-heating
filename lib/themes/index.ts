/**
 * Theme System - Main exports
 */

// Schema types
export type {
  Theme,
  ThemePreset,
  ColorPalette,
  ColorMode,
  Typography,
  FontFamily,
  Spacing,
  BorderRadius,
  Shadows,
  ComponentStyles,
  Effects,
  ThemeCategory,
} from './theme.schema'

// Loader functions
export {
  // Preset access
  getThemePresets,
  getThemePreset,
  getPresetsByCategory,
  getPresetsForIndustry,
  getFontPairings,
  getColorPalettes,

  // CSS generation
  generateCSSVariables,
  generateCSSString,
  generateGoogleFontsUrl,
  generateTailwindConfig,

  // Customization
  customizePreset,
  themeFromConfig,

  // Utilities
  isColorDark,
  getContrastColor,
  applyTheme,
} from './themeLoader'

'use client'

import { useState, useEffect } from 'react'
import themeData from '@/data/theme.json'

// =============================================================================
// Types
// =============================================================================

export interface VisualEffectsConfig {
  gradientStyle: 'none' | 'subtle' | 'vibrant'
  glassEffect: 'none' | 'light' | 'frosted'
  meshBackground: boolean
  gradientButtons: boolean
  gradientText: boolean
}

export const defaultVisualEffects: VisualEffectsConfig = {
  gradientStyle: 'none',
  glassEffect: 'none',
  meshBackground: false,
  gradientButtons: false,
  gradientText: false,
}

// =============================================================================
// Vertical-to-gradient mood mapping (reference for n8n pipeline)
// =============================================================================

export const verticalGradientMoods: Record<string, { mood: string; description: string }> = {
  hvac: { mood: 'Cool/technical', description: 'Frost blue, cooler hue shifts' },
  plumbing: { mood: 'Warm/reliable', description: 'Copper hint, warmer hue shifts' },
  electrical: { mood: 'Energetic', description: 'Amber to orange, electric yellow accent' },
  cleaning: { mood: 'Fresh/pure', description: 'Mint to spring teal, fresh lime accent' },
  roofing: { mood: 'Earthy/solid', description: 'Terracotta to warm brown, sandy accent' },
  landscaping: { mood: 'Organic', description: 'Leaf green to forest, olive accent' },
  painting: { mood: 'Creative', description: 'Violet to magenta, lavender accent' },
  'garage-door': { mood: 'Industrial', description: 'Steel gray to dark slate, metallic blue accent' },
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Read visual effects config. SSR-safe — returns defaults on server.
 * Priority: localStorage → theme.json → defaults
 */
export function getVisualEffects(): VisualEffectsConfig {
  if (typeof window === 'undefined') return defaultVisualEffects

  try {
    const saved = localStorage.getItem('foundlio-design')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.visualEffects) {
        return { ...defaultVisualEffects, ...parsed.visualEffects }
      }
    }
  } catch {
    // Ignore parse errors
  }

  // Fall back to theme.json values
  const themeEffects = (themeData as any).visualEffects
  if (themeEffects) {
    return { ...defaultVisualEffects, ...themeEffects }
  }

  return defaultVisualEffects
}

// =============================================================================
// React Hook
// =============================================================================

/**
 * React hook that provides reactive visual effects config.
 * Listens for `foundlio-theme-change` events.
 */
export function useVisualEffects(): VisualEffectsConfig {
  const [effects, setEffects] = useState<VisualEffectsConfig>(defaultVisualEffects)

  useEffect(() => {
    setEffects(getVisualEffects())

    const handleChange = () => {
      setEffects(getVisualEffects())
    }

    window.addEventListener('foundlio-theme-change', handleChange)
    window.addEventListener('storage', handleChange)
    return () => {
      window.removeEventListener('foundlio-theme-change', handleChange)
      window.removeEventListener('storage', handleChange)
    }
  }, [])

  return effects
}

/**
 * Check if any visual effect is active (useful for conditional rendering)
 */
export function isAnyEffectActive(effects: VisualEffectsConfig): boolean {
  return (
    effects.gradientStyle !== 'none' ||
    effects.glassEffect !== 'none' ||
    effects.meshBackground ||
    effects.gradientButtons ||
    effects.gradientText
  )
}

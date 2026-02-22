'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
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

export interface ThemeState {
  colors: ColorTheme
  heroStyle: HeroStyle
  cardStyle: CardStyle
  radius: RadiusStyle
}

interface ThemeContextType {
  theme: ThemeState
  setColors: (color: ColorTheme) => void
  setHeroStyle: (style: HeroStyle) => void
  setCardStyle: (style: CardStyle) => void
  setRadius: (radius: RadiusStyle) => void
  applyThemeToDOM: () => void
}

const defaultTheme: ThemeState = {
  colors: (themeData.colors as ColorTheme) || 'fresh-teal',
  heroStyle: (themeData.heroStyle as HeroStyle) || 'split',
  cardStyle: (themeData.cardStyle as CardStyle) || 'elevated',
  radius: (themeData.radius as RadiusStyle) || 'rounded',
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeState>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('foundlio-theme')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setTheme(prev => ({ ...prev, ...parsed }))
      } catch (e) {
        console.error('Failed to parse saved theme:', e)
      }
    }
  }, [])

  // Apply theme to DOM whenever it changes
  useEffect(() => {
    if (!mounted) return
    applyThemeToDOM()
    // Save to localStorage
    localStorage.setItem('foundlio-theme', JSON.stringify(theme))
  }, [theme, mounted])

  const applyThemeToDOM = () => {
    const root = document.documentElement
    const body = document.body

    // Remove old theme classes
    const themeClasses = [
      'theme-fresh-teal', 'theme-ocean-blue', 'theme-forest-green',
      'theme-sunset-orange', 'theme-royal-purple', 'theme-slate-professional',
      'theme-warm-terracotta', 'theme-midnight-navy',
      'radius-sharp', 'radius-subtle', 'radius-rounded', 'radius-pill',
    ]
    themeClasses.forEach(cls => body.classList.remove(cls))

    // Add new theme classes
    body.classList.add(`theme-${theme.colors}`)
    body.classList.add(`radius-${theme.radius}`)

    // Apply card style as data attribute (for components to read)
    root.dataset.cardStyle = theme.cardStyle
    root.dataset.heroStyle = theme.heroStyle
  }

  const setColors = (color: ColorTheme) => setTheme(prev => ({ ...prev, colors: color }))
  const setHeroStyle = (style: HeroStyle) => setTheme(prev => ({ ...prev, heroStyle: style }))
  const setCardStyle = (style: CardStyle) => setTheme(prev => ({ ...prev, cardStyle: style }))
  const setRadius = (radius: RadiusStyle) => setTheme(prev => ({ ...prev, radius: radius }))

  return (
    <ThemeContext.Provider value={{
      theme,
      setColors,
      setHeroStyle,
      setCardStyle,
      setRadius,
      applyThemeToDOM,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Hook that also returns the default theme for SSR
export function useThemeWithDefaults() {
  try {
    return useTheme()
  } catch {
    // Return defaults if outside provider (SSR)
    return {
      theme: defaultTheme,
      setColors: () => {},
      setHeroStyle: () => {},
      setCardStyle: () => {},
      setRadius: () => {},
      applyThemeToDOM: () => {},
    }
  }
}

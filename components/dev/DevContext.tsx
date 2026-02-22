'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import type { ThemePreset } from '@/lib/themes/theme.schema'

// ============================================
// TYPES
// ============================================

interface DevConfig {
  // Theme
  themePreset: string
  customColors: {
    primary?: string
    background?: string
    text?: string
  }

  // Content
  headlineVariation: number

  // Sections visibility
  sections: {
    hero: boolean
    trustSignals: boolean
    services: boolean
    process: boolean
    testimonials: boolean
    faq: boolean
    cta: boolean
  }

  // Widgets
  widgets: {
    callbackWidget: boolean
    stickyCall: boolean
    urgencyIndicator: boolean
  }

  // Display
  viewportMode: 'desktop' | 'tablet' | 'mobile'
  showGrid: boolean
  darkMode: boolean
}

interface DevContextType {
  // State
  config: DevConfig
  isDevMode: boolean

  // Theme actions
  setThemePreset: (presetId: string) => void
  setCustomColor: (key: 'primary' | 'background' | 'text', value: string) => void

  // Content actions
  setHeadlineVariation: (index: number) => void

  // Section actions
  toggleSection: (key: keyof DevConfig['sections']) => void
  setSectionVisible: (key: keyof DevConfig['sections'], visible: boolean) => void

  // Widget actions
  toggleWidget: (key: keyof DevConfig['widgets']) => void

  // Display actions
  setViewportMode: (mode: DevConfig['viewportMode']) => void
  toggleGrid: () => void
  toggleDarkMode: () => void

  // Utility
  resetConfig: () => void
  exportConfig: () => string
  importConfig: (json: string) => void
}

// ============================================
// DEFAULT CONFIG
// ============================================

const defaultConfig: DevConfig = {
  themePreset: 'professional-blue',
  customColors: {},
  headlineVariation: 0,
  sections: {
    hero: true,
    trustSignals: true,
    services: true,
    process: true,
    testimonials: true,
    faq: true,
    cta: true,
  },
  widgets: {
    callbackWidget: true,
    stickyCall: true,
    urgencyIndicator: true,
  },
  viewportMode: 'desktop',
  showGrid: false,
  darkMode: false,
}

// ============================================
// CONTEXT
// ============================================

const DevContext = createContext<DevContextType | null>(null)

// ============================================
// PROVIDER
// ============================================

interface DevProviderProps {
  children: ReactNode
  enabled?: boolean
}

export function DevProvider({ children, enabled = true }: DevProviderProps) {
  const [config, setConfig] = useState<DevConfig>(defaultConfig)
  const isDevMode = enabled && process.env.NODE_ENV === 'development'

  // Load saved config from localStorage
  useEffect(() => {
    if (!isDevMode) return

    const saved = localStorage.getItem('foundlio-dev-config')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setConfig(prev => ({ ...prev, ...parsed }))
      } catch (e) {
        console.warn('Failed to parse saved dev config')
      }
    }
  }, [isDevMode])

  // Save config to localStorage on change
  useEffect(() => {
    if (!isDevMode) return
    localStorage.setItem('foundlio-dev-config', JSON.stringify(config))
  }, [config, isDevMode])

  // Apply theme changes to CSS
  useEffect(() => {
    if (!isDevMode) return

    const root = document.documentElement

    // Apply custom colors
    if (config.customColors.primary) {
      root.style.setProperty('--color-primary', config.customColors.primary)
    }
    if (config.customColors.background) {
      root.style.setProperty('--color-background', config.customColors.background)
    }
    if (config.customColors.text) {
      root.style.setProperty('--color-text', config.customColors.text)
    }

    // Apply dark mode
    if (config.darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [config.customColors, config.darkMode, isDevMode])

  // Listen for cross-tab theme updates (from admin/themes page)
  useEffect(() => {
    // Function to apply theme classes to body
    const applyThemeClasses = (theme: Record<string, string>) => {
      const body = document.body
      if (theme.colors) {
        body.className = body.className.replace(/theme-[a-z-]+/g, 'theme-' + theme.colors)
      }
      if (theme.radius) {
        body.className = body.className.replace(/radius-[a-z-]+/g, 'radius-' + theme.radius)
      }
      if (theme.fonts) {
        body.className = body.className.replace(/fonts-[a-z-]+/g, 'fonts-' + theme.fonts)
      }
      // Dispatch event for components that need to re-render (like Header, HeroSection)
      window.dispatchEvent(new CustomEvent('foundlio-theme-change', { detail: theme }))
    }

    // Listen for BroadcastChannel messages
    let channel: BroadcastChannel | null = null
    try {
      channel = new BroadcastChannel('foundlio-theme')
      channel.onmessage = (event) => {
        if (event.data?.type === 'theme-update' && event.data?.theme) {
          applyThemeClasses(event.data.theme)
        }
      }
    } catch (e) {
      // BroadcastChannel not supported
    }

    // Listen for storage events (cross-tab)
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'foundlio-design' && event.newValue) {
        try {
          const theme = JSON.parse(event.newValue)
          applyThemeClasses(theme)
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
    window.addEventListener('storage', handleStorage)

    // Also listen for same-tab custom events
    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent
      if (customEvent.detail) {
        applyThemeClasses(customEvent.detail)
      }
    }
    window.addEventListener('foundlio-theme-change', handleThemeChange)

    return () => {
      channel?.close()
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('foundlio-theme-change', handleThemeChange)
    }
  }, [])

  // ============================================
  // ACTIONS
  // ============================================

  const setThemePreset = useCallback((presetId: string) => {
    setConfig(prev => ({
      ...prev,
      themePreset: presetId,
      customColors: {}, // Reset custom colors when changing preset
    }))
  }, [])

  const setCustomColor = useCallback((key: 'primary' | 'background' | 'text', value: string) => {
    setConfig(prev => ({
      ...prev,
      customColors: { ...prev.customColors, [key]: value },
    }))
  }, [])

  const setHeadlineVariation = useCallback((index: number) => {
    setConfig(prev => ({ ...prev, headlineVariation: index }))
  }, [])

  const toggleSection = useCallback((key: keyof DevConfig['sections']) => {
    setConfig(prev => ({
      ...prev,
      sections: { ...prev.sections, [key]: !prev.sections[key] },
    }))
  }, [])

  const setSectionVisible = useCallback((key: keyof DevConfig['sections'], visible: boolean) => {
    setConfig(prev => ({
      ...prev,
      sections: { ...prev.sections, [key]: visible },
    }))
  }, [])

  const toggleWidget = useCallback((key: keyof DevConfig['widgets']) => {
    setConfig(prev => ({
      ...prev,
      widgets: { ...prev.widgets, [key]: !prev.widgets[key] },
    }))
  }, [])

  const setViewportMode = useCallback((mode: DevConfig['viewportMode']) => {
    setConfig(prev => ({ ...prev, viewportMode: mode }))
  }, [])

  const toggleGrid = useCallback(() => {
    setConfig(prev => ({ ...prev, showGrid: !prev.showGrid }))
  }, [])

  const toggleDarkMode = useCallback(() => {
    setConfig(prev => ({ ...prev, darkMode: !prev.darkMode }))
  }, [])

  const resetConfig = useCallback(() => {
    setConfig(defaultConfig)
    localStorage.removeItem('foundlio-dev-config')
  }, [])

  const exportConfig = useCallback(() => {
    return JSON.stringify(config, null, 2)
  }, [config])

  const importConfig = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json)
      setConfig(prev => ({ ...prev, ...parsed }))
    } catch (e) {
      console.error('Failed to import config:', e)
    }
  }, [])

  // ============================================
  // RENDER
  // ============================================

  const value: DevContextType = {
    config,
    isDevMode,
    setThemePreset,
    setCustomColor,
    setHeadlineVariation,
    toggleSection,
    setSectionVisible,
    toggleWidget,
    setViewportMode,
    toggleGrid,
    toggleDarkMode,
    resetConfig,
    exportConfig,
    importConfig,
  }

  return <DevContext.Provider value={value}>{children}</DevContext.Provider>
}

// ============================================
// HOOK
// ============================================

export function useDevConfig() {
  const context = useContext(DevContext)
  if (!context) {
    throw new Error('useDevConfig must be used within a DevProvider')
  }
  return context
}

// ============================================
// HELPER HOOKS
// ============================================

/**
 * Check if a section should be visible
 */
export function useSectionVisible(key: keyof DevConfig['sections']) {
  const { config, isDevMode } = useDevConfig()
  // In production, always show. In dev, respect the toggle.
  return isDevMode ? config.sections[key] : true
}

/**
 * Check if a widget should be visible
 */
export function useWidgetVisible(key: keyof DevConfig['widgets']) {
  const { config, isDevMode } = useDevConfig()
  return isDevMode ? config.widgets[key] : true
}

/**
 * Get current headline variation index
 */
export function useHeadlineVariation() {
  const { config } = useDevConfig()
  return config.headlineVariation
}

/**
 * Get current theme preset ID
 */
export function useThemePreset() {
  const { config } = useDevConfig()
  return config.themePreset
}

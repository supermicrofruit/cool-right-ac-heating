'use client'

import { useState, useEffect } from 'react'
import businessData from '@/data/business.json'

// ─── Types ───────────────────────────────────────────────────

export interface DesignFeatures {
  showBlog: boolean
  showWorks: boolean
  showFinancing: boolean
  emergencyBadge: boolean
  callbackWidget: boolean
  stickyPhone: boolean
}

const defaultFeatures: DesignFeatures = {
  showBlog: businessData.features?.showBlog ?? true,
  showWorks: businessData.features?.showWorks ?? true,
  showFinancing: businessData.features?.showFinancing ?? false,
  emergencyBadge: businessData.features?.emergencyBadge ?? false,
  callbackWidget: businessData.features?.callbackWidget ?? true,
  stickyPhone: businessData.features?.stickyPhone ?? true,
}

// ─── Helpers ─────────────────────────────────────────────────

function readFeaturesFromStorage(): DesignFeatures {
  if (typeof window === 'undefined') return defaultFeatures
  try {
    const saved = localStorage.getItem('foundlio-design')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.features) {
        return { ...defaultFeatures, ...parsed.features }
      }
    }
  } catch {}
  return defaultFeatures
}

function readVerticalFromStorage(): string {
  if (typeof window === 'undefined') return businessData.vertical
  try {
    const saved = localStorage.getItem('foundlio-design')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.vertical) return parsed.vertical
    }
  } catch {}
  return businessData.vertical
}

// ─── Hooks ───────────────────────────────────────────────────

/**
 * Returns live feature flags from DesignPanel (dev) or business.json (prod).
 * Listens to `foundlio-theme-change` events for live updates.
 */
export function useDesignFeatures(): DesignFeatures {
  const [features, setFeatures] = useState<DesignFeatures>(defaultFeatures)

  useEffect(() => {
    // Initial read
    setFeatures(readFeaturesFromStorage())

    const handleChange = () => setFeatures(readFeaturesFromStorage())
    window.addEventListener('foundlio-theme-change', handleChange)
    return () => window.removeEventListener('foundlio-theme-change', handleChange)
  }, [])

  return features
}

/**
 * Returns live vertical from DesignPanel (dev) or business.json (prod).
 * Listens to `foundlio-theme-change` events for live updates.
 */
export function useDesignVertical(): string {
  const [vertical, setVertical] = useState<string>(businessData.vertical)

  useEffect(() => {
    setVertical(readVerticalFromStorage())

    const handleChange = () => setVertical(readVerticalFromStorage())
    window.addEventListener('foundlio-theme-change', handleChange)
    return () => window.removeEventListener('foundlio-theme-change', handleChange)
  }, [])

  return vertical
}

/**
 * Static getter for SSR contexts — reads from business.json only.
 */
export function getDefaultFeatures(): DesignFeatures {
  return defaultFeatures
}

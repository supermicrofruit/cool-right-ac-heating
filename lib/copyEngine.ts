/**
 * Copy Engine - Variable replacement and content management
 *
 * This utility handles:
 * 1. Variable replacement ({{businessName}} → "Desert Aire Comfort")
 * 2. Loading copy from content files
 * 3. Merging base copy with vertical-specific copy
 */

import businessData from '@/data/business.json'

// Types
export interface CopyVariables {
  // Business info
  businessName: string
  phone: string
  phoneRaw: string
  email: string
  city: string
  state: string
  region: string
  address: string
  fullAddress: string

  // Stats
  rating: string
  reviewCount: string
  yearsInBusiness: string
  establishedYear: string

  // Service details
  responseTime: string
  warrantyYears: string
  licenseNumber: string
  maintenancePointCount: string
  callbackTime: string

  // Dynamic
  year: string
  count?: string
}

// Default variables from business.json
export function getDefaultVariables(): CopyVariables {
  const currentYear = new Date().getFullYear()
  const yearsInBusiness = currentYear - businessData.established

  return {
    businessName: businessData.name,
    phone: businessData.phone,
    phoneRaw: businessData.phoneRaw,
    email: businessData.email,
    city: businessData.address.city,
    state: businessData.address.state,
    region: businessData.region || 'Arizona',
    address: businessData.address.street,
    fullAddress: `${businessData.address.street}, ${businessData.address.city}, ${businessData.address.state} ${businessData.address.zip}`,

    rating: businessData.rating.toString(),
    reviewCount: businessData.reviewCount.toString(),
    yearsInBusiness: yearsInBusiness.toString(),
    establishedYear: businessData.established.toString(),

    responseTime: businessData.responseTime || '2 hours',
    warrantyYears: businessData.warrantyYears?.toString() || '2',
    licenseNumber: businessData.licenses?.[0] || 'ROC #298847',
    maintenancePointCount: businessData.maintenancePointCount?.toString() || '21',
    callbackTime: '15',

    year: currentYear.toString(),
  }
}

/**
 * Replace all {{variable}} placeholders in a string
 */
export function replaceCopyVariables(
  text: string,
  customVariables?: Partial<CopyVariables>
): string {
  const variables = { ...getDefaultVariables(), ...customVariables }

  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = variables[key as keyof CopyVariables]
    if (value !== undefined) return value
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[copyEngine] Unmatched variable: ${match} in "${text.slice(0, 80)}"`)
    }
    return match
  })
}

/**
 * Deep replace variables in an object (recursively)
 */
export function replaceVariablesDeep<T>(
  obj: T,
  customVariables?: Partial<CopyVariables>
): T {
  if (typeof obj === 'string') {
    return replaceCopyVariables(obj, customVariables) as T
  }

  if (Array.isArray(obj)) {
    return obj.map(item => replaceVariablesDeep(item, customVariables)) as T
  }

  if (obj !== null && typeof obj === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      result[key] = replaceVariablesDeep(value, customVariables)
    }
    return result as T
  }

  return obj
}

/**
 * Get copy with variables replaced
 *
 * Usage:
 *   const headline = getCopy(headlines.hero.variations[0].headline)
 *   // Returns: "Cool Comfort. Desert Tough."
 *
 *   const meta = getCopy(service.meta, { city: "Scottsdale" })
 *   // Overrides city variable for this call
 */
export function getCopy(
  text: string,
  customVariables?: Partial<CopyVariables>
): string {
  return replaceCopyVariables(text, customVariables)
}

/**
 * Process an entire content object (service, FAQ, etc.)
 *
 * Usage:
 *   const service = processContent(rawService)
 *   // All {{variables}} in all fields are replaced
 */
export function processContent<T>(
  content: T,
  customVariables?: Partial<CopyVariables>
): T {
  return replaceVariablesDeep(content, customVariables)
}

/**
 * Pick a random headline variation
 */
export function pickHeadlineVariation<T extends { id: string }>(
  variations: T[],
  preferredTone?: string
): T {
  if (preferredTone) {
    const matching = variations.filter(
      (v: T & { tone?: string }) => v.tone === preferredTone
    )
    if (matching.length > 0) {
      return matching[Math.floor(Math.random() * matching.length)]
    }
  }
  return variations[Math.floor(Math.random() * variations.length)]
}

/**
 * Get headline by ID
 */
export function getHeadlineById<T extends { id: string }>(
  variations: T[],
  id: string
): T | undefined {
  return variations.find(v => v.id === id)
}

// Re-export types for convenience
export type { CopyVariables as Variables }

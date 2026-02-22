/**
 * Content Loader - Load and process content from vertical templates
 *
 * This utility:
 * 1. Loads content based on the current vertical (hvac, plumbing, electrical, cleaning, roofing, landscaping)
 * 2. Processes all variables automatically
 * 3. Provides typed access to content
 */

import { processContent, getDefaultVariables, type CopyVariables } from './copyEngine'
import businessData from '@/data/business.json'

// Get vertical from business data
export const currentVertical = businessData.vertical || 'hvac'

// All supported verticals
const VERTICALS = ['hvac', 'plumbing', 'electrical', 'cleaning', 'roofing', 'landscaping'] as const
export type Vertical = (typeof VERTICALS)[number]

// Types for content structures
export interface HeadlineVariation {
  id: string
  headline: string
  subheadline: string
  tone?: string
  region?: string
}

export interface ValueProp {
  title: string
  description: string
  icon: string
}

export interface ServiceContent {
  slug: string
  name: string
  shortDescription: string
  longDescription: string
  icon: string
  category: string
  emergency: boolean
  features: string[]
  benefits: string[]
  commonIssues?: string[]
  brands?: string[]
  meta: {
    title: string
    description: string
  }
}

export interface FAQ {
  question: string
  answer: string
}

export interface Headlines {
  vertical: string
  displayName: string
  hero: {
    variations: HeadlineVariation[]
  }
  servicePages: Record<string, { headline: string; subheadline: string }>
  valueProps: {
    variations: ValueProp[]
  }
}

export interface Services {
  vertical: string
  services: ServiceContent[]
  categories: Array<{
    slug: string
    name: string
    description: string
  }>
}

export interface FAQs {
  vertical: string
  general: FAQ[]
  [key: string]: FAQ[] | string
}

// Dynamic import maps — avoids giant switch statements
const headlineImports: Record<string, () => Promise<{ default: Headlines }>> = {
  hvac: () => import('@/content/verticals/hvac/headlines.json') as any,
  plumbing: () => import('@/content/verticals/plumbing/headlines.json') as any,
  electrical: () => import('@/content/verticals/electrical/headlines.json') as any,
  cleaning: () => import('@/content/verticals/cleaning/headlines.json') as any,
  roofing: () => import('@/content/verticals/roofing/headlines.json') as any,
  landscaping: () => import('@/content/verticals/landscaping/headlines.json') as any,
}

const serviceImports: Record<string, () => Promise<{ default: Services }>> = {
  hvac: () => import('@/content/verticals/hvac/services.json') as any,
  plumbing: () => import('@/content/verticals/plumbing/services.json') as any,
  electrical: () => import('@/content/verticals/electrical/services.json') as any,
  cleaning: () => import('@/content/verticals/cleaning/services.json') as any,
  roofing: () => import('@/content/verticals/roofing/services.json') as any,
  landscaping: () => import('@/content/verticals/landscaping/services.json') as any,
}

const faqImports: Record<string, () => Promise<{ default: FAQs }>> = {
  hvac: () => import('@/content/verticals/hvac/faqs.json') as any,
  plumbing: () => import('@/content/verticals/plumbing/faqs.json') as any,
  electrical: () => import('@/content/verticals/electrical/faqs.json') as any,
  cleaning: () => import('@/content/verticals/cleaning/faqs.json') as any,
  roofing: () => import('@/content/verticals/roofing/faqs.json') as any,
  landscaping: () => import('@/content/verticals/landscaping/faqs.json') as any,
}

/**
 * Load headlines for a vertical
 */
export async function loadHeadlines(
  vertical?: string,
  customVariables?: Partial<CopyVariables>
): Promise<Headlines> {
  const v = vertical || currentVertical
  const loader = headlineImports[v] || headlineImports.hvac
  const raw = (await loader()).default as Headlines
  return processContent(raw, customVariables)
}

/**
 * Load services for a vertical
 */
export async function loadServices(
  vertical?: string,
  customVariables?: Partial<CopyVariables>
): Promise<Services> {
  const v = vertical || currentVertical
  const loader = serviceImports[v] || serviceImports.hvac
  const raw = (await loader()).default as Services
  return processContent(raw, customVariables)
}

/**
 * Load FAQs for a vertical
 */
export async function loadFAQs(
  vertical?: string,
  customVariables?: Partial<CopyVariables>
): Promise<FAQs> {
  const v = vertical || currentVertical
  const loader = faqImports[v] || faqImports.hvac
  const raw = (await loader()).default as FAQs
  return processContent(raw, customVariables)
}

/**
 * Load base copy (CTAs, form labels, etc.)
 */
export async function loadBaseCopy(customVariables?: Partial<CopyVariables>) {
  const raw = (await import('@/content/copy/base.json')).default
  return processContent(raw, customVariables)
}

/**
 * Get a specific service by slug
 */
export async function getService(
  slug: string,
  vertical?: string,
  customVariables?: Partial<CopyVariables>
): Promise<ServiceContent | undefined> {
  const services = await loadServices(vertical, customVariables)
  return services.services.find(s => s.slug === slug)
}

/**
 * Get hero headline - either by ID or random
 */
export async function getHeroHeadline(
  options?: {
    id?: string
    tone?: string
    vertical?: string
    customVariables?: Partial<CopyVariables>
  }
): Promise<HeadlineVariation> {
  const headlines = await loadHeadlines(options?.vertical, options?.customVariables)
  const variations = headlines.hero.variations

  // If specific ID requested
  if (options?.id) {
    const found = variations.find(v => v.id === options.id)
    if (found) return found
  }

  // If specific tone requested
  if (options?.tone) {
    const matching = variations.filter(v => v.tone === options.tone)
    if (matching.length > 0) {
      return matching[Math.floor(Math.random() * matching.length)]
    }
  }

  // Random
  return variations[Math.floor(Math.random() * variations.length)]
}

/**
 * Get all available verticals
 */
export function getAvailableVerticals() {
  return [
    { slug: 'hvac', name: 'HVAC', description: 'Heating, Ventilation, Air Conditioning' },
    { slug: 'plumbing', name: 'Plumbing', description: 'Plumbing & Drain Services' },
    { slug: 'electrical', name: 'Electrical', description: 'Electrical Services' },
    { slug: 'cleaning', name: 'Cleaning', description: 'House & Commercial Cleaning' },
    { slug: 'roofing', name: 'Roofing', description: 'Roof Repair & Replacement' },
    { slug: 'landscaping', name: 'Landscaping', description: 'Lawn Care & Landscape Design' },
  ]
}

/**
 * Check if a vertical exists
 */
export function isValidVertical(vertical: string): boolean {
  return VERTICALS.includes(vertical as Vertical)
}

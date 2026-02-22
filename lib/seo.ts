import { Metadata } from 'next'
import businessData from '@/data/business.json'

/**
 * SEO Helper Functions
 *
 * These utilities use the SEO config from business.json to generate
 * consistent metadata across all pages. When you change the business name,
 * all page titles update automatically.
 */

const { seo, name: businessName, description: businessDescription, address, phone } = businessData

/**
 * Generate page metadata using the SEO config from business.json
 *
 * @param title - Page title (will be combined with titleTemplate)
 * @param description - Page description (falls back to defaultDescription)
 * @param options - Additional metadata options
 * @returns Metadata object for Next.js
 *
 * @example
 * // In a page file:
 * export const metadata = generateMetadata({
 *   title: 'About Us',
 *   description: 'Learn more about our company'
 * })
 */
export function generateMetadata({
  title,
  description,
  openGraph,
  ...rest
}: {
  title: string
  description?: string
  openGraph?: Partial<Metadata['openGraph']>
} & Partial<Omit<Metadata, 'title' | 'description' | 'openGraph'>>): Metadata {
  const pageDescription = description || seo.defaultDescription

  return {
    title,
    description: pageDescription,
    openGraph: {
      title: formatTitle(title),
      description: pageDescription,
      type: 'website',
      locale: 'en_US',
      siteName: businessName,
      ...openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      title: formatTitle(title),
      description: pageDescription,
    },
    ...rest,
  }
}

/**
 * Format a page title using the titleTemplate from business.json
 *
 * @param pageTitle - The page-specific title
 * @returns Formatted title with business name
 *
 * @example
 * formatTitle('About Us')
 * // Returns: "About Us | Desert Aire Comfort"
 */
export function formatTitle(pageTitle: string): string {
  return seo.titleTemplate.replace('%s', pageTitle)
}

/**
 * Get the root layout metadata configuration
 * Uses the SEO config from business.json for consistent branding
 *
 * @returns Metadata object for the root layout
 */
export function getRootMetadata(): Metadata {
  const defaultTitle = `${businessName} | ${getVerticalLabel()} Services in ${address.city}, ${address.state}`

  return {
    title: {
      default: defaultTitle,
      template: seo.titleTemplate,
    },
    description: seo.defaultDescription,
    keywords: getDefaultKeywords(),
    authors: [{ name: businessName }],
    creator: businessName,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: businessName,
      title: defaultTitle,
      description: seo.defaultDescription,
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description: seo.defaultDescription,
    },
    // Favicon and apple-touch-icon are generated dynamically by app/icon.tsx and app/apple-icon.tsx
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    ...(process.env.GOOGLE_SITE_VERIFICATION ? {
      verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION,
      },
    } : {}),
  }
}

/**
 * Get a human-readable label for the business vertical
 */
function getVerticalLabel(): string {
  const verticalLabels: Record<string, string> = {
    hvac: 'HVAC',
    plumbing: 'Plumbing',
    electrical: 'Electrical',
    roofing: 'Roofing',
    landscaping: 'Landscaping',
    cleaning: 'Cleaning',
  }
  return verticalLabels[businessData.vertical] || businessData.vertical.toUpperCase()
}

/**
 * Get default keywords based on vertical and location
 */
function getDefaultKeywords(): string[] {
  const vertical = businessData.vertical
  const city = address.city
  const state = address.state

  const keywordMap: Record<string, string[]> = {
    hvac: ['HVAC', 'air conditioning', 'AC repair', 'heating', 'AC installation', 'furnace repair'],
    plumbing: ['plumbing', 'plumber', 'drain cleaning', 'water heater', 'leak repair', 'pipe repair'],
    electrical: ['electrician', 'electrical repair', 'wiring', 'panel upgrade', 'lighting', 'electrical installation'],
  }

  const baseKeywords = keywordMap[vertical] || [vertical]
  return [...baseKeywords, city, state]
}

/**
 * Generate metadata for a dynamic page (service, area, blog post, etc.)
 *
 * @param params - Object containing title, description, and optional path
 * @returns Metadata object
 *
 * @example
 * // In a dynamic route:
 * export async function generateMetadata({ params }) {
 *   const service = getService(params.slug)
 *   return generateDynamicMetadata({
 *     title: service.metaTitle,
 *     description: service.metaDescription,
 *   })
 * }
 */
export function generateDynamicMetadata({
  title,
  description,
  path,
  openGraph,
}: {
  title: string
  description: string
  path?: string
  openGraph?: Partial<Metadata['openGraph']>
}): Metadata {
  const fullTitle = title
  const url = path ? `${businessData.website}${path}` : undefined

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: formatTitle(fullTitle),
      description,
      type: 'website',
      locale: 'en_US',
      siteName: businessName,
      ...(url && { url }),
      ...openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      title: formatTitle(fullTitle),
      description,
    },
  }
}

// Export SEO config for direct access if needed
export const seoConfig = {
  titleTemplate: seo.titleTemplate,
  defaultDescription: seo.defaultDescription,
  businessName,
  city: address.city,
  state: address.state,
  phone,
}

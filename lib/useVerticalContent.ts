'use client'

import { useMemo, useEffect } from 'react'
import { processContent } from '@/lib/copyEngine'
import { useDesignVertical } from '@/lib/useDesignFeatures'
import businessData from '@/data/business.json'
import type { Headlines, Services, FAQs } from '@/lib/contentLoader'

// Static imports for all 6 verticals (dynamic import() doesn't work client-side)
import hvacHeadlines from '@/content/verticals/hvac/headlines.json'
import hvacServices from '@/content/verticals/hvac/services.json'
import hvacFaqs from '@/content/verticals/hvac/faqs.json'
import plumbingHeadlines from '@/content/verticals/plumbing/headlines.json'
import plumbingServices from '@/content/verticals/plumbing/services.json'
import plumbingFaqs from '@/content/verticals/plumbing/faqs.json'
import electricalHeadlines from '@/content/verticals/electrical/headlines.json'
import electricalServices from '@/content/verticals/electrical/services.json'
import electricalFaqs from '@/content/verticals/electrical/faqs.json'
import cleaningHeadlines from '@/content/verticals/cleaning/headlines.json'
import cleaningServices from '@/content/verticals/cleaning/services.json'
import cleaningFaqs from '@/content/verticals/cleaning/faqs.json'
import roofingHeadlines from '@/content/verticals/roofing/headlines.json'
import roofingServices from '@/content/verticals/roofing/services.json'
import roofingFaqs from '@/content/verticals/roofing/faqs.json'
import landscapingHeadlines from '@/content/verticals/landscaping/headlines.json'
import landscapingServices from '@/content/verticals/landscaping/services.json'
import landscapingFaqs from '@/content/verticals/landscaping/faqs.json'
// Testimonials
import hvacTestimonials from '@/content/verticals/hvac/testimonials.json'
import plumbingTestimonials from '@/content/verticals/plumbing/testimonials.json'
import electricalTestimonials from '@/content/verticals/electrical/testimonials.json'
import cleaningTestimonials from '@/content/verticals/cleaning/testimonials.json'
import roofingTestimonials from '@/content/verticals/roofing/testimonials.json'
import landscapingTestimonials from '@/content/verticals/landscaping/testimonials.json'
// Works / Portfolio
import hvacWorks from '@/content/verticals/hvac/works.json'
import plumbingWorks from '@/content/verticals/plumbing/works.json'
import electricalWorks from '@/content/verticals/electrical/works.json'
import cleaningWorks from '@/content/verticals/cleaning/works.json'
import roofingWorks from '@/content/verticals/roofing/works.json'
import landscapingWorks from '@/content/verticals/landscaping/works.json'
// Blog Posts
import hvacPosts from '@/content/verticals/hvac/posts.json'
import plumbingPosts from '@/content/verticals/plumbing/posts.json'
import electricalPosts from '@/content/verticals/electrical/posts.json'
import cleaningPosts from '@/content/verticals/cleaning/posts.json'
import roofingPosts from '@/content/verticals/roofing/posts.json'
import landscapingPosts from '@/content/verticals/landscaping/posts.json'
// Areas
import hvacAreas from '@/content/verticals/hvac/areas.json'
import plumbingAreas from '@/content/verticals/plumbing/areas.json'
import electricalAreas from '@/content/verticals/electrical/areas.json'
import cleaningAreas from '@/content/verticals/cleaning/areas.json'
import roofingAreas from '@/content/verticals/roofing/areas.json'
import landscapingAreas from '@/content/verticals/landscaping/areas.json'
// Content (hero, trust, about, CTA, process, pages)
import hvacContent from '@/content/verticals/hvac/content.json'
import plumbingContent from '@/content/verticals/plumbing/content.json'
import electricalContent from '@/content/verticals/electrical/content.json'
import cleaningContent from '@/content/verticals/cleaning/content.json'
import roofingContent from '@/content/verticals/roofing/content.json'
import landscapingContent from '@/content/verticals/landscaping/content.json'

const allContent: Record<string, { headlines: any; services: any; faqs: any; testimonials: any; works: any; posts: any; areas: any; content: any }> = {
  hvac: { headlines: hvacHeadlines, services: hvacServices, faqs: hvacFaqs, testimonials: hvacTestimonials, works: hvacWorks, posts: hvacPosts, areas: hvacAreas, content: hvacContent },
  plumbing: { headlines: plumbingHeadlines, services: plumbingServices, faqs: plumbingFaqs, testimonials: plumbingTestimonials, works: plumbingWorks, posts: plumbingPosts, areas: plumbingAreas, content: plumbingContent },
  electrical: { headlines: electricalHeadlines, services: electricalServices, faqs: electricalFaqs, testimonials: electricalTestimonials, works: electricalWorks, posts: electricalPosts, areas: electricalAreas, content: electricalContent },
  cleaning: { headlines: cleaningHeadlines, services: cleaningServices, faqs: cleaningFaqs, testimonials: cleaningTestimonials, works: cleaningWorks, posts: cleaningPosts, areas: cleaningAreas, content: cleaningContent },
  roofing: { headlines: roofingHeadlines, services: roofingServices, faqs: roofingFaqs, testimonials: roofingTestimonials, works: roofingWorks, posts: roofingPosts, areas: roofingAreas, content: roofingContent },
  landscaping: { headlines: landscapingHeadlines, services: landscapingServices, faqs: landscapingFaqs, testimonials: landscapingTestimonials, works: landscapingWorks, posts: landscapingPosts, areas: landscapingAreas, content: landscapingContent },
}

// Sample business data shown when previewing a different vertical
const sampleBusiness: Record<string, { businessName: string; city: string; state: string }> = {
  hvac: { businessName: 'Desert Aire Comfort', city: 'Phoenix', state: 'AZ' },
  plumbing: { businessName: 'Valley Plumbing Pros', city: 'Austin', state: 'TX' },
  electrical: { businessName: 'Bright Spark Electric', city: 'Denver', state: 'CO' },
  cleaning: { businessName: 'Sparkle Home Cleaning', city: 'San Diego', state: 'CA' },
  roofing: { businessName: 'Summit Roofing Co', city: 'Dallas', state: 'TX' },
  landscaping: { businessName: 'Green Valley Landscapes', city: 'Tampa', state: 'FL' },
}

import { getVerticalConfig, type Vertical } from '@/lib/verticalConfig'

const deployedVertical = businessData.vertical || 'hvac'

/**
 * Returns the sample business name for the active vertical preview,
 * or null if using deployed data (no override needed).
 */
export function useVerticalBusinessName(): string | null {
  const vertical = useDesignVertical()
  if (vertical === deployedVertical) return null
  return sampleBusiness[vertical]?.businessName || null
}

/**
 * Returns the vertical config for the active preview vertical.
 * Useful for getting serviceName, serviceNamePlural, tagline, etc.
 */
export function useVerticalConfig() {
  const vertical = useDesignVertical()
  return useMemo(() => getVerticalConfig(vertical as Vertical), [vertical])
}

/**
 * Returns the sample business state for the active vertical preview, or the deployed state.
 */
export function useVerticalState(): string {
  const vertical = useDesignVertical()
  if (vertical === deployedVertical) return businessData.address?.state || ''
  return sampleBusiness[vertical]?.state || businessData.address?.state || ''
}

/**
 * Returns a function that swaps the deployed business name and city with the preview
 * values in any string. Returns identity function when not in preview mode.
 */
export function useContentSwap(): (text: string) => string {
  const vertical = useDesignVertical()
  if (vertical === deployedVertical) return (t: string) => t
  const sample = sampleBusiness[vertical]
  if (!sample) return (t: string) => t
  const realName = businessData.name
  const realCity = businessData.address?.city || ''
  const realState = businessData.address?.state || ''
  return (text: string) => {
    if (!text) return text
    let result = text.replace(new RegExp(realName, 'g'), sample.businessName)
    if (realCity) result = result.replace(new RegExp(realCity, 'g'), sample.city)
    if (realState) result = result.replace(new RegExp(`\\b${realState}\\b`, 'g'), sample.state)
    return result
  }
}

/**
 * Updates document.title when previewing a different vertical.
 */
export function useVerticalDocumentTitle() {
  const vertical = useDesignVertical()
  useEffect(() => {
    if (vertical === deployedVertical) {
      document.title = `${businessData.name} | Professional Services in ${businessData.address.city}, ${businessData.address.state}`
      return
    }
    const sample = sampleBusiness[vertical]
    const name = sample?.businessName || businessData.name
    const city = sample?.city || businessData.address.city
    const verticalLabel = vertical.charAt(0).toUpperCase() + vertical.slice(1)
    document.title = `${name} | ${verticalLabel} Services in ${city}`
  }, [vertical])
}

/**
 * Returns processed headlines for the active vertical, or null if using deployed data.
 */
export function useVerticalHeadlines(): Headlines | null {
  const vertical = useDesignVertical()

  return useMemo(() => {
    if (vertical === deployedVertical) return null
    const raw = allContent[vertical]
    if (!raw) return null
    const vars = sampleBusiness[vertical]
    return processContent(raw.headlines, vars) as Headlines
  }, [vertical])
}

/**
 * Returns processed services for the active vertical, or null if using deployed data.
 */
export function useVerticalServices(): Services | null {
  const vertical = useDesignVertical()

  return useMemo(() => {
    if (vertical === deployedVertical) return null
    const raw = allContent[vertical]
    if (!raw) return null
    const vars = sampleBusiness[vertical]
    return processContent(raw.services, vars) as Services
  }, [vertical])
}

/**
 * Returns processed FAQs for the active vertical, or null if using deployed data.
 */
export function useVerticalFaqs(): FAQs | null {
  const vertical = useDesignVertical()

  return useMemo(() => {
    if (vertical === deployedVertical) return null
    const raw = allContent[vertical]
    if (!raw) return null
    const vars = sampleBusiness[vertical]
    return processContent(raw.faqs, vars) as FAQs
  }, [vertical])
}

/**
 * Returns processed testimonials for the active vertical, or null if using deployed data.
 */
export function useVerticalTestimonials(): any | null {
  const vertical = useDesignVertical()

  return useMemo(() => {
    if (vertical === deployedVertical) return null
    const raw = allContent[vertical]
    if (!raw?.testimonials) return null
    const vars = sampleBusiness[vertical]
    return processContent(raw.testimonials, vars)
  }, [vertical])
}

/**
 * Returns processed works/portfolio for the active vertical, or null if using deployed data.
 */
export function useVerticalWorks(): any | null {
  const vertical = useDesignVertical()

  return useMemo(() => {
    if (vertical === deployedVertical) return null
    const raw = allContent[vertical]
    if (!raw?.works) return null
    const vars = sampleBusiness[vertical]
    return processContent(raw.works, vars)
  }, [vertical])
}

/**
 * Returns processed blog posts for the active vertical, or null if using deployed data.
 */
export function useVerticalPosts(): any | null {
  const vertical = useDesignVertical()

  return useMemo(() => {
    if (vertical === deployedVertical) return null
    const raw = allContent[vertical]
    if (!raw?.posts) return null
    const vars = sampleBusiness[vertical]
    return processContent(raw.posts, vars)
  }, [vertical])
}

/**
 * Returns processed areas for the active vertical, or null if using deployed data.
 */
export function useVerticalAreas(): any | null {
  const vertical = useDesignVertical()

  return useMemo(() => {
    if (vertical === deployedVertical) return null
    const raw = allContent[vertical]
    if (!raw?.areas) return null
    const vars = sampleBusiness[vertical]
    return processContent(raw.areas, vars)
  }, [vertical])
}

/**
 * Returns processed content.json for the active vertical, or null if using deployed data.
 * Used by components that read hero, trust, about, CTA, process, mediaBar, pages content.
 */
export function useVerticalContentJson(): any | null {
  const vertical = useDesignVertical()

  return useMemo(() => {
    if (vertical === deployedVertical) return null
    const raw = allContent[vertical]
    if (!raw?.content) return null
    const vars = sampleBusiness[vertical]
    return processContent(raw.content, vars)
  }, [vertical])
}

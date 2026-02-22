/**
 * Content loader for data-driven pages
 * All text content comes from /data/content.json
 * Variables like {{businessName}} are replaced via copyEngine
 */

import contentData from '@/data/content.json'
import { processContent } from '@/lib/copyEngine'

// Type definitions
export interface HeroContent {
  headline: string
  headlineAccent: string
  subheading: string
  description: string
  imageAlt: string
  heroImage?: string
  heroBackgroundImage?: string
}

export interface TrustSectionContent {
  title: string
  subtitle: string
  factoryAuthorized: string
  factoryDescription: string
}

export interface ProcessStep {
  title: string
  description: string
}

export interface ProcessSectionContent {
  title: string
  subtitle: string
  steps: ProcessStep[]
}

export interface PageContent {
  heroTitle?: string
  heroSubtitle?: string
  ctaTitle?: string
  ctaDescription?: string
  [key: string]: string | string[] | undefined
}

export interface AboutSectionContent {
  title: string
  subtitle: string
  description: string
  mission: string
  values: { title: string; description: string }[]
}

export interface BlogSectionContent {
  title: string
  subtitle: string
}

interface ContentData {
  hero?: {
    headline?: string
    headlineAccent?: string
    subheading?: string
    description?: string
    imageAlt?: string
  }
  trustSection?: {
    title?: string
    subtitle?: string
    factoryAuthorized?: string
    factoryDescription?: string
  }
  mediaBar?: Record<string, string>
  servicesSection?: {
    title?: string
    subtitle?: string
  }
  processSection?: {
    title?: string
    subtitle?: string
    steps?: ProcessStep[]
  }
  worksSection?: Record<string, string>
  testimonialsSection?: {
    title?: string
    subtitle?: string
  }
  faqSection?: {
    title?: string
    subtitle?: string
  }
  aboutSection?: {
    title?: string
    subtitle?: string
    description?: string
    mission?: string
    values?: { title: string; description: string }[]
  }
  blogSection?: {
    title?: string
    subtitle?: string
  }
  ctaBanner?: {
    title?: string
    description?: string
  }
  pages?: Record<string, PageContent>
}

const data = processContent(contentData) as ContentData

// Content getters with meaningful defaults
export function getHeroContent(): HeroContent {
  const hero = data.hero
  return {
    headline: hero?.headline || 'Professional Service You Can Trust',
    headlineAccent: hero?.headlineAccent || 'You Can Trust',
    subheading: hero?.subheading || '',
    description: hero?.description || 'Licensed, insured, and committed to quality workmanship on every job.',
    imageAlt: hero?.imageAlt || 'Professional service team',
    heroImage: hero?.heroImage,
    heroBackgroundImage: hero?.heroBackgroundImage,
  }
}

export function getTrustSectionContent(): TrustSectionContent {
  const trust = data.trustSection
  return {
    title: trust?.title || 'Why Choose Us',
    subtitle: trust?.subtitle || 'Trusted by homeowners across the area',
    factoryAuthorized: trust?.factoryAuthorized || 'Certified Professionals',
    factoryDescription: trust?.factoryDescription || 'Trained and certified technicians',
  }
}

export function getMediaBarContent() {
  return data.mediaBar || {}
}

export function getServicesSectionContent() {
  const services = data.servicesSection
  return {
    title: services?.title || 'Our Services',
    subtitle: services?.subtitle || 'Comprehensive solutions for your home and business',
    ...services,
  }
}

export function getProcessSectionContent(): ProcessSectionContent {
  const process = data.processSection
  return {
    title: process?.title || 'How It Works',
    subtitle: process?.subtitle || 'Simple, transparent process from start to finish',
    steps: process?.steps || [
      { title: 'Contact Us', description: 'Call or fill out our form for a free estimate.' },
      { title: 'Get a Quote', description: 'We assess the job and provide transparent pricing.' },
      { title: 'We Do the Work', description: 'Our certified team completes the job right.' },
      { title: 'Your Satisfaction', description: 'We ensure you are 100% happy with the results.' },
    ],
  }
}

export function getWorksSectionContent() {
  return data.worksSection || {}
}

export function getTestimonialsSectionContent() {
  const testimonials = data.testimonialsSection
  return {
    title: testimonials?.title || 'What Our Customers Say',
    subtitle: testimonials?.subtitle || 'Real reviews from real customers',
    ...testimonials,
  }
}

export function getFaqSectionContent() {
  const faq = data.faqSection
  return {
    title: faq?.title || 'Common Questions',
    subtitle: faq?.subtitle || 'Find answers to frequently asked questions about our services',
  }
}

export function getAboutSectionContent(): AboutSectionContent {
  const about = data.aboutSection
  return {
    title: about?.title || 'About Us',
    subtitle: about?.subtitle || 'Learn more about our story and values',
    description: about?.description || 'We are a dedicated team of professionals committed to delivering exceptional service to our community.',
    mission: about?.mission || '',
    values: about?.values || [],
  }
}

export function getBlogSectionContent(): BlogSectionContent {
  const blog = data.blogSection
  return {
    title: blog?.title || 'Latest Articles',
    subtitle: blog?.subtitle || 'Tips and insights from our team',
  }
}

export function getCtaBannerContent() {
  const cta = data.ctaBanner
  return {
    title: cta?.title || 'Ready to Get Started?',
    description: cta?.description || 'Contact us today for a free estimate. Our team is ready to help.',
    ...cta,
  }
}

export function getPageContent(page: string): PageContent {
  const pages = data.pages
  if (!pages || !pages[page]) {
    return { heroTitle: '', heroSubtitle: '', ctaTitle: '', ctaDescription: '' }
  }
  return pages[page] as PageContent
}

// Export full content for direct access
export { contentData }

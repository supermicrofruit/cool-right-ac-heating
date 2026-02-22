/**
 * Vertical-specific configuration
 * Maps business vertical to display text throughout the site
 */

import businessData from '@/data/business.json'

export type Vertical = 'hvac' | 'plumbing' | 'electrical' | 'roofing' | 'landscaping' | 'cleaning' | 'painting' | 'garage-door' | string

interface VerticalConfig {
  name: string
  serviceName: string
  serviceNamePlural: string
  tagline: string
  ctaTitle: string
  ctaDescription: string
  emergencyText: string
  tipsTitle: string
}

const verticalConfigs: Record<string, VerticalConfig> = {
  hvac: {
    name: 'HVAC',
    serviceName: 'HVAC Service',
    serviceNamePlural: 'HVAC Services',
    tagline: 'heating and cooling',
    ctaTitle: 'Need HVAC Service?',
    ctaDescription: 'Contact us today for fast, reliable heating and cooling service from certified professionals.',
    emergencyText: 'For urgent HVAC issues, please call us directly for the fastest response.',
    tipsTitle: 'HVAC Tips & Insights',
  },
  plumbing: {
    name: 'Plumbing',
    serviceName: 'Plumbing Service',
    serviceNamePlural: 'Plumbing Services',
    tagline: 'plumbing',
    ctaTitle: 'Need Plumbing Service?',
    ctaDescription: 'Contact us today for fast, reliable plumbing service from licensed professionals.',
    emergencyText: 'For urgent plumbing issues, please call us directly for the fastest response.',
    tipsTitle: 'Plumbing Tips & Insights',
  },
  electrical: {
    name: 'Electrical',
    serviceName: 'Electrical Service',
    serviceNamePlural: 'Electrical Services',
    tagline: 'electrical',
    ctaTitle: 'Need Electrical Service?',
    ctaDescription: 'Contact us today for safe, reliable electrical service from licensed professionals.',
    emergencyText: 'For urgent electrical issues, please call us directly for the fastest response.',
    tipsTitle: 'Electrical Tips & Insights',
  },
  roofing: {
    name: 'Roofing',
    serviceName: 'Roofing Service',
    serviceNamePlural: 'Roofing Services',
    tagline: 'roofing',
    ctaTitle: 'Need Roofing Service?',
    ctaDescription: 'Contact us today for quality roofing service from experienced professionals.',
    emergencyText: 'For urgent roofing issues, please call us directly for the fastest response.',
    tipsTitle: 'Roofing Tips & Insights',
  },
  landscaping: {
    name: 'Landscaping',
    serviceName: 'Landscaping Service',
    serviceNamePlural: 'Landscaping Services',
    tagline: 'landscaping',
    ctaTitle: 'Need Landscaping Service?',
    ctaDescription: 'Contact us today to transform your outdoor space with professional landscaping.',
    emergencyText: 'For urgent landscaping needs, please call us directly.',
    tipsTitle: 'Landscaping Tips & Insights',
  },
  cleaning: {
    name: 'Cleaning',
    serviceName: 'Cleaning Service',
    serviceNamePlural: 'Cleaning Services',
    tagline: 'cleaning',
    ctaTitle: 'Need Cleaning Service?',
    ctaDescription: 'Contact us today for professional cleaning services that make your space sparkle.',
    emergencyText: 'For urgent cleaning needs, please call us directly.',
    tipsTitle: 'Cleaning Tips & Insights',
  },
  painting: {
    name: 'Painting',
    serviceName: 'Painting Service',
    serviceNamePlural: 'Painting Services',
    tagline: 'painting',
    ctaTitle: 'Need Painting Service?',
    ctaDescription: 'Contact us today for professional painting services that transform your space.',
    emergencyText: 'For urgent painting needs, please call us directly.',
    tipsTitle: 'Painting Tips & Insights',
  },
  'garage-door': {
    name: 'Garage Door',
    serviceName: 'Garage Door Service',
    serviceNamePlural: 'Garage Door Services',
    tagline: 'garage door',
    ctaTitle: 'Need Garage Door Service?',
    ctaDescription: 'Contact us today for professional garage door repair and installation.',
    emergencyText: 'For urgent garage door issues, please call us directly.',
    tipsTitle: 'Garage Door Tips & Insights',
  },
}

// Generate fallback config from vertical name
function makeFallbackConfig(vertical: string): VerticalConfig {
  const name = vertical.charAt(0).toUpperCase() + vertical.slice(1).replace(/-/g, ' ')
  return {
    name,
    serviceName: `${name} Service`,
    serviceNamePlural: `${name} Services`,
    tagline: vertical.replace(/-/g, ' '),
    ctaTitle: `Need ${name} Service?`,
    ctaDescription: `Contact us today for professional ${vertical.replace(/-/g, ' ')} services.`,
    emergencyText: `For urgent ${vertical.replace(/-/g, ' ')} needs, please call us directly.`,
    tipsTitle: `${name} Tips & Insights`,
  }
}

// Get current vertical from business data
export const currentVertical: Vertical = (businessData.vertical as Vertical) || 'hvac'

// Get config for current vertical (with fallback for unknown verticals)
export const verticalConfig = verticalConfigs[currentVertical] || makeFallbackConfig(currentVertical)

// Helper function to get config
export function getVerticalConfig(vertical?: Vertical): VerticalConfig {
  const v = vertical || currentVertical
  return verticalConfigs[v] || makeFallbackConfig(v)
}

// Common replacements
export const siteConfig = {
  businessName: businessData.name,
  city: businessData.address.city,
  state: businessData.address.state,
  phone: businessData.phone,
  vertical: verticalConfig.name,
  serviceName: verticalConfig.serviceName,
  serviceNamePlural: verticalConfig.serviceNamePlural,
}

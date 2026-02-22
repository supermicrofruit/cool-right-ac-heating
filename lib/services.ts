import servicesData from '@/data/services.json'

export interface Service {
  slug: string
  name: string
  shortDescription: string
  longDescription: string
  features: string[]
  benefits: string[]
  icon: string
  image?: string
  category: string
  emergency: boolean
  metaTitle: string
  metaDescription: string
}

export interface Category {
  slug: string
  name: string
  shortName?: string
  icon: string
  description?: string
  image?: string
  features?: string[]
}

interface ServicesData {
  services: Service[]
  categories: Category[]
}

const data = servicesData as ServicesData

// Get all services
export function getAllServices(): Service[] {
  return data.services || []
}

// Get all categories
export function getAllCategories(): Category[] {
  return data.categories || []
}

// Get a single service by slug
export function getServiceBySlug(slug: string): Service | undefined {
  return (data.services || []).find((s) => s.slug === slug)
}

// Get a single category by slug
export function getCategoryBySlug(slug: string): Category | undefined {
  return (data.categories || []).find((c) => c.slug === slug)
}

// Get services by category slug
export function getServicesByCategory(categorySlug: string): Service[] {
  return (data.services || []).filter((s) => s.category === categorySlug)
}

// Get services grouped by category
export function getServicesGroupedByCategory(): { category: Category; services: Service[] }[] {
  return (data.categories || []).map((category) => ({
    category,
    services: (data.services || []).filter((s) => s.category === category.slug)
  })).filter((group) => group.services.length > 0)
}

// Get the category for a service
export function getCategoryForService(service: Service): Category | undefined {
  return (data.categories || []).find((c) => c.slug === service.category)
}

// Get all service slugs (for static generation)
export function getAllServiceSlugs(): string[] {
  return (data.services || []).map((s) => s.slug)
}

// Get all category slugs (for static generation)
export function getAllCategorySlugs(): string[] {
  return (data.categories || []).map((c) => c.slug)
}

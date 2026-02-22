import businessData from '@/data/business.json'
import servicesData from '@/data/services.json'
import { currentVertical } from '@/lib/verticalConfig'

function parseTime(timeStr: string): string | null {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return null
  let hours = parseInt(match[1])
  const minutes = match[2]
  const period = match[3].toUpperCase()
  if (period === 'PM' && hours !== 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0
  return `${hours.toString().padStart(2, '0')}:${minutes}`
}

function parseHoursRange(range: string): { opens: string; closes: string } | null {
  if (!range || range.toLowerCase() === 'closed') return null
  const parts = range.split('-').map(s => s.trim())
  if (parts.length !== 2) return null
  const opens = parseTime(parts[0])
  const closes = parseTime(parts[1])
  if (!opens || !closes) return null
  return { opens, closes }
}

function buildOpeningHoursSpec() {
  const structured = (businessData as any).hours?.structured
  if (!structured || !Array.isArray(structured)) {
    return [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '18:00' }]
  }
  const dayMap: Record<string, string[]> = {
    'monday - friday': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    'monday-friday': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    'mon - fri': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    'monday': ['Monday'], 'tuesday': ['Tuesday'], 'wednesday': ['Wednesday'],
    'thursday': ['Thursday'], 'friday': ['Friday'], 'saturday': ['Saturday'], 'sunday': ['Sunday'],
  }
  return structured
    .map((entry: any) => {
      const parsed = parseHoursRange(entry.hours)
      if (!parsed) return null
      const days = dayMap[entry.days.toLowerCase()] || [entry.days]
      return { '@type': 'OpeningHoursSpecification', dayOfWeek: days, ...parsed }
    })
    .filter(Boolean)
}

// Map vertical to schema.org business type
const verticalSchemaType: Record<string, string> = {
  hvac: 'HVACBusiness',
  plumbing: 'Plumber',
  electrical: 'Electrician',
  roofing: 'RoofingContractor',
  landscaping: 'LandscapingBusiness',
  cleaning: 'HousekeepingService',
  painting: 'HousePainter',
  'garage-door': 'LocalBusiness',
}

function getSchemaType(): string {
  return verticalSchemaType[currentVertical] || 'LocalBusiness'
}

function getServiceCatalogName(): string {
  const names: Record<string, string> = {
    hvac: 'HVAC Services',
    plumbing: 'Plumbing Services',
    electrical: 'Electrical Services',
    roofing: 'Roofing Services',
    landscaping: 'Landscaping Services',
    cleaning: 'Cleaning Services',
  }
  return names[currentVertical] || 'Professional Services'
}

// Filter out empty/undefined social media links
function getSameAs(): string[] {
  const social = (businessData as any).socialMedia || {}
  return [social.facebook, social.instagram, social.google, social.yelp, social.twitter]
    .filter((url): url is string => !!url && url !== 'undefined' && url.startsWith('http'))
}

export function generateLocalBusinessSchema() {
  const services = ((servicesData as any).services || []).slice(0, 6)

  return {
    "@context": "https://schema.org",
    "@type": getSchemaType(),
    "name": businessData.name,
    "legalName": (businessData as any).legalName || businessData.name,
    "description": (businessData as any).description || '',
    "url": (businessData as any).website || '',
    "telephone": businessData.phone,
    "email": (businessData as any).email || '',
    "address": {
      "@type": "PostalAddress",
      "streetAddress": businessData.address.street,
      "addressLocality": businessData.address.city,
      "addressRegion": businessData.address.state,
      "postalCode": businessData.address.zip,
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": (businessData as any).coordinates?.lat || 0,
      "longitude": (businessData as any).coordinates?.lng || 0
    },
    "openingHoursSpecification": buildOpeningHoursSpec(),
    "priceRange": "$$",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": businessData.rating,
      "reviewCount": businessData.reviewCount,
      "bestRating": 5,
      "worstRating": 1
    },
    ...(getSameAs().length > 0 ? { "sameAs": getSameAs() } : {}),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": getServiceCatalogName(),
      "itemListElement": services.map((s: any) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": s.name
        }
      }))
    }
  }
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": businessData.name,
    "legalName": (businessData as any).legalName || businessData.name,
    "url": (businessData as any).website || '',
    "logo": `${(businessData as any).website || ''}/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": businessData.phone,
      "contactType": "customer service",
      "availableLanguage": ["English", "Spanish"],
      "areaServed": {
        "@type": "State",
        "name": businessData.address.state
      }
    },
    ...(getSameAs().length > 0 ? { "sameAs": getSameAs() } : {}),
    "foundingDate": businessData.established.toString(),
    "slogan": (businessData as any).tagline || ''
  }
}

interface Service {
  slug: string
  name: string
  shortDescription: string
  longDescription: string
  metaTitle?: string
  metaDescription?: string
  [key: string]: unknown
}

export function generateServiceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": service.name,
    "name": service.name,
    "description": service.longDescription,
    "provider": {
      "@type": getSchemaType(),
      "name": businessData.name,
      "telephone": businessData.phone,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": businessData.address.street,
        "addressLocality": businessData.address.city,
        "addressRegion": businessData.address.state,
        "postalCode": businessData.address.zip,
        "addressCountry": "US"
      }
    },
    "areaServed": {
      "@type": "City",
      "name": businessData.address.city,
      "containedIn": {
        "@type": "State",
        "name": businessData.address.state
      }
    },
    "offers": {
      "@type": "Offer",
      "priceSpecification": {
        "@type": "PriceSpecification",
        "priceCurrency": "USD"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": businessData.rating,
      "reviewCount": businessData.reviewCount
    }
  }
}

interface Area {
  slug: string
  name: string
  state: string
  description: string
  coordinates?: { lat: number; lng: number }
  neighborhoods?: string[]
  population?: string | number
  [key: string]: unknown
}

export function generateAreaSchema(area: Area) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${(businessData as any).website || ''}/areas/${area.slug}`,
    "name": `${businessData.name} - ${area.name}`,
    "description": `Professional ${getServiceCatalogName().toLowerCase()} in ${area.name}, ${area.state}. ${area.description}`,
    "url": `${(businessData as any).website || ''}/areas/${area.slug}`,
    "telephone": businessData.phone,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": area.name,
      "addressRegion": area.state,
      "addressCountry": "US"
    },
    ...(area.coordinates ? {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": area.coordinates.lat,
        "longitude": area.coordinates.lng
      }
    } : {}),
    "areaServed": {
      "@type": "City",
      "name": area.name,
      "containedIn": {
        "@type": "State",
        "name": area.state
      }
    },
    "parentOrganization": {
      "@type": "Organization",
      "name": businessData.name,
      "url": (businessData as any).website || ''
    }
  }
}

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  authorId: string
  date: string
  category: string
  readTime: string
  metaTitle: string
  metaDescription: string
}

export function generateBlogPostSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "author": {
      "@type": "Organization",
      "name": businessData.name
    },
    "publisher": {
      "@type": "Organization",
      "name": businessData.name,
      "url": (businessData as any).website || '',
      "logo": {
        "@type": "ImageObject",
        "url": `${(businessData as any).website || ''}/logo.png`
      }
    },
    "datePublished": post.date,
    "dateModified": post.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${(businessData as any).website || ''}/blog/${post.slug}`
    },
    "articleSection": post.category,
    "wordCount": post.content.split(' ').length
  }
}

interface Review {
  name: string
  text: string
  rating: number
  date: string
  location?: string
  [key: string]: unknown
}

export function generateReviewSchema(reviews: Review[]) {
  return {
    "@context": "https://schema.org",
    "@type": getSchemaType(),
    "name": businessData.name,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": businessData.rating,
      "reviewCount": businessData.reviewCount,
      "bestRating": 5,
      "worstRating": 1
    },
    "review": reviews.map((review) => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.name
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": 5,
        "worstRating": 1
      },
      "reviewBody": review.text,
      "datePublished": review.date
    }))
  }
}

interface BreadcrumbItem {
  label: string
  href?: string
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[], baseUrl: string) {
  const itemListElement = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: baseUrl,
    },
    ...items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 2,
      name: item.label,
      ...(item.href ? { item: `${baseUrl}${item.href}` } : {}),
    })),
  ]

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  }
}

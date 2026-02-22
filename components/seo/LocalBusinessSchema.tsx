import businessData from '@/data/business.json'
import servicesData from '@/data/services.json'
import { verticalConfig } from '@/lib/verticalConfig'

// Parse "7:00 AM" → "07:00", "6:00 PM" → "18:00"
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

// Parse "7:00 AM - 6:00 PM" → { opens: "07:00", closes: "18:00" }
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
  const structured = businessData.hours?.structured
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

// Map vertical to Schema.org business type
const businessTypeMap: Record<string, string> = {
  hvac: 'HVACBusiness',
  plumbing: 'Plumber',
  electrical: 'Electrician',
  cleaning: 'HousekeepingService',
  roofing: 'RoofingContractor',
  landscaping: 'LandscapingService',
  painting: 'HousePainter',
  pest: 'PestControlService',
  default: 'HomeAndConstructionBusiness',
}

export default function LocalBusinessSchema() {
  const businessType = businessTypeMap[businessData.vertical] || businessTypeMap.default

  // Build services from actual services data
  const serviceOffers = servicesData.services.map((service) => ({
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name: service.name,
      description: service.shortDescription,
    },
  }))

  const schema = {
    '@context': 'https://schema.org',
    '@type': businessType,
    name: businessData.name,
    legalName: businessData.legalName,
    description: businessData.description,
    url: businessData.website,
    telephone: businessData.phone,
    email: businessData.email,
    foundingDate: businessData.established.toString(),
    image: (() => { const l = (businessData as any).theme?.logomark || (businessData as any).theme?.logo || '/images/logomark.png'; return l.startsWith('http') ? l : `${businessData.website}${l}` })(),
    logo: (() => { const l = (businessData as any).theme?.logomark || (businessData as any).theme?.logo || '/images/logomark.png'; return l.startsWith('http') ? l : `${businessData.website}${l}` })(),
    address: {
      '@type': 'PostalAddress',
      streetAddress: businessData.address.street,
      addressLocality: businessData.address.city,
      addressRegion: businessData.address.state,
      postalCode: businessData.address.zip,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: businessData.coordinates.lat,
      longitude: businessData.coordinates.lng,
    },
    openingHoursSpecification: buildOpeningHoursSpec(),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: businessData.rating.toString(),
      reviewCount: businessData.reviewCount.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    sameAs: [
      businessData.socialMedia?.facebook,
      businessData.socialMedia?.instagram,
      businessData.socialMedia?.google,
    ].filter(Boolean),
    priceRange: '$$',
    paymentAccepted: 'Cash, Credit Card, Check',
    areaServed: {
      '@type': 'City',
      name: businessData.address.city,
      containedInPlace: {
        '@type': 'State',
        name: businessData.address.state,
      },
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${verticalConfig.serviceNamePlural}`,
      itemListElement: serviceOffers,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

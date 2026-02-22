import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Phone, Check, Wrench, AirVent, Settings, Flame, Home, Wind, Sparkles, AlertCircle, Truck, Building, Star, Hammer } from 'lucide-react'
import Container from '@/components/ui/Container'
import Badge from '@/components/ui/Badge'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import ServiceGrid from '@/components/sections/ServiceGrid'
import CTABanner from '@/components/sections/CTABanner'
import SectionDivider from '@/components/ui/SectionDivider'
import ServicePageContent from '@/components/pages/ServicePageContent'
import { generateServiceSchema, generateBreadcrumbSchema } from '@/lib/schema'
import {
  getServiceBySlug,
  getCategoryBySlug,
  getServicesByCategory,
  getCategoryForService,
  getAllServiceSlugs,
  getAllCategorySlugs,
  type Service,
  type Category
} from '@/lib/services'
import businessData from '@/data/business.json'
import { generateDynamicMetadata } from '@/lib/seo'
import { processContent } from '@/lib/copyEngine'

// Import all vertical services for preview fallback
import hvacServices from '@/content/verticals/hvac/services.json'
import plumbingServices from '@/content/verticals/plumbing/services.json'
import electricalServices from '@/content/verticals/electrical/services.json'
import cleaningServices from '@/content/verticals/cleaning/services.json'
import roofingServices from '@/content/verticals/roofing/services.json'
import landscapingServices from '@/content/verticals/landscaping/services.json'

const allVerticalServices = [hvacServices, plumbingServices, electricalServices, cleaningServices, roofingServices, landscapingServices]

function findVerticalService(slug: string): Service | null {
  for (const vs of allVerticalServices) {
    const svc = (vs as any).services?.find((s: any) => s.slug === slug)
    if (svc) return processContent(svc) as Service
  }
  return null
}

function findVerticalCategory(slug: string): Category | null {
  for (const vs of allVerticalServices) {
    const cat = (vs as any).categories?.find((c: any) => c.slug === slug)
    if (cat) return processContent(cat) as Category
  }
  return null
}

function findVerticalServicesByCategory(categorySlug: string): Service[] {
  for (const vs of allVerticalServices) {
    const cat = (vs as any).categories?.find((c: any) => c.slug === categorySlug)
    if (cat) {
      return processContent(((vs as any).services || []).filter((s: any) => s.category === categorySlug)) as Service[]
    }
  }
  return []
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench,
  AirVent,
  Settings,
  Flame,
  Home,
  Wind,
  Sparkles,
  AlertCircle,
  Truck,
  Building,
  Star,
  Hammer,
}

interface PageProps {
  params: Promise<{ slug: string }>
}

// Generate static params for both services and categories
export async function generateStaticParams() {
  const serviceSlugs = getAllServiceSlugs().map(slug => ({ slug }))
  const categorySlugs = getAllCategorySlugs().map(slug => ({ slug }))
  return [...serviceSlugs, ...categorySlugs]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  // Check if it's a category
  const category = getCategoryBySlug(slug)
  if (category) {
    return generateDynamicMetadata({
      title: `${category.name} | ${businessData.name}`,
      description: category.description,
      path: `/services/${slug}`,
    })
  }

  // Check if it's a service
  const service = getServiceBySlug(slug)
  if (service) {
    return generateDynamicMetadata({
      title: (service as any).metaTitle || `${service.name} | ${businessData.name}`,
      description: (service as any).metaDescription || service.shortDescription,
      path: `/services/${slug}`,
    })
  }

  return {
    title: 'Not Found',
  }
}

// Category Landing Page Component
function CategoryPage({ category }: { category: Category }) {
  let services = getServicesByCategory(category.slug)
  if (services.length === 0) services = findVerticalServicesByCategory(category.slug)
  const Icon = iconMap[category.icon] || Wrench

  const breadcrumbItems = [
    { label: 'Services', href: '/services' },
    { label: category.name }
  ]

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-background to-muted py-16 md:py-24">
        <Container>
          <Breadcrumbs items={breadcrumbItems} />
          <div className="max-w-3xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <Badge variant="blue">{services.length} Services</Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              {category.name}
            </h1>

            <p className="text-lg text-slate-600 mb-8">
              {category.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`tel:${businessData.phoneRaw}`}
                className="inline-flex items-center justify-center px-6 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Phone className="h-5 w-5 mr-2" />
                {businessData.phone}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-4 bg-white text-slate-900 font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Get Free Estimate
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <SectionDivider topColor="gray" bottomColor="white" />

      {/* Category Features */}
      {category.features && category.features.length > 0 && (
        <section className="py-12 bg-white">
          <Container>
            <div className="flex flex-wrap justify-center gap-8">
              {category.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center space-x-2 text-slate-700">
                  <Check className="h-5 w-5 text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      <SectionDivider topColor="white" bottomColor="gray" />

      {/* Services in this Category */}
      <ServiceGrid categorySlug={category.slug} showTitle={false} />

      <SectionDivider topColor="gray" bottomColor="white" />

      <CTABanner
        title={`Need ${(category as any).shortName || category.name}?`}
        description="Contact us today for fast, reliable service from certified professionals."
      />
    </>
  )
}

// Service Detail Page Component
function ServicePage({ service }: { service: Service }) {
  const category = getCategoryForService(service) || (service as any).category ? findVerticalCategory((service as any).category) : null

  // Breadcrumb items - include category
  const breadcrumbItems = category
    ? [
        { label: 'Services', href: '/services' },
        { label: (category as any).shortName || category.name, href: `/services/${category.slug}` },
        { label: service.name }
      ]
    : [
        { label: 'Services', href: '/services' },
        { label: service.name }
      ]

  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateServiceSchema(service as any))
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbItems, businessData.website || `https://${businessData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.vercel.app`))
        }}
      />

      <ServicePageContent service={service} />
    </>
  )
}

// Main Page Component - Routes to Category or Service
export default async function Page({ params }: PageProps) {
  const { slug } = await params

  // First check deployed data
  const category = getCategoryBySlug(slug)
  if (category) {
    return <CategoryPage category={category} />
  }

  const service = getServiceBySlug(slug)
  if (service) {
    return <ServicePage service={service} />
  }

  // Fallback: check all vertical content (for preview mode)
  const verticalCategory = findVerticalCategory(slug)
  if (verticalCategory) {
    return <CategoryPage category={verticalCategory} />
  }

  const verticalService = findVerticalService(slug)
  if (verticalService) {
    return <ServicePage service={verticalService} />
  }

  // Neither - show 404
  notFound()
}

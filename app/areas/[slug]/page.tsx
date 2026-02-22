import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateAreaSchema, generateBreadcrumbSchema } from '@/lib/schema'
import AreaPageContent from '@/components/pages/AreaPageContent'
import businessData from '@/data/business.json'
import areasData from '@/data/areas.json'
import { generateDynamicMetadata } from '@/lib/seo'
import { processContent } from '@/lib/copyEngine'

// Import all vertical areas for preview fallback
import hvacAreas from '@/content/verticals/hvac/areas.json'
import plumbingAreas from '@/content/verticals/plumbing/areas.json'
import electricalAreas from '@/content/verticals/electrical/areas.json'
import cleaningAreas from '@/content/verticals/cleaning/areas.json'
import roofingAreas from '@/content/verticals/roofing/areas.json'
import landscapingAreas from '@/content/verticals/landscaping/areas.json'

const allVerticalAreas = [hvacAreas, plumbingAreas, electricalAreas, cleaningAreas, roofingAreas, landscapingAreas]

function findVerticalArea(slug: string): any | null {
  for (const va of allVerticalAreas) {
    const area = (va as any).areas?.find((a: any) => a.slug === slug)
    if (area) return processContent(area)
  }
  return null
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return areasData.areas.map((area) => ({
    slug: area.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const area = areasData.areas.find((a) => a.slug === slug) || findVerticalArea(slug)

  if (!area) {
    return {
      title: 'Area Not Found',
    }
  }

  return generateDynamicMetadata({
    title: `Services in ${area.name}, ${area.state}`,
    description: `Professional services in ${area.name}, ${area.state}. Serving ${(area as any).neighborhoods?.slice(0, 3)?.join(', ') || area.name} and nearby neighborhoods from ${businessData.name}.`,
    path: `/areas/${slug}`,
  })
}

export default async function AreaPage({ params }: PageProps) {
  const { slug } = await params
  const area = areasData.areas.find((a) => a.slug === slug) || findVerticalArea(slug)

  if (!area) {
    notFound()
  }

  // Breadcrumb items for schema
  const breadcrumbItems = [
    { label: 'Service Areas', href: '/areas' },
    { label: `${area.name}, ${area.state}` }
  ]

  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateAreaSchema(area as any))
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbItems, businessData.website || `https://${businessData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.vercel.app`))
        }}
      />

      <AreaPageContent area={area as any} />
    </>
  )
}

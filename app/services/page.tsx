'use client'

import Link from 'next/link'
import { ArrowRight, Wrench, AirVent, Settings, Flame, Home, Wind, Sparkles, AlertCircle, Phone } from 'lucide-react'
import Container from '@/components/ui/Container'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import SectionDivider from '@/components/ui/SectionDivider'
import FadeIn, { FadeInStagger } from '@/components/ui/FadeIn'
import CTABanner from '@/components/sections/CTABanner'
import businessData from '@/data/business.json'
import servicesData from '@/data/services.json'
import { getPageContent } from '@/lib/content'
import { useVerticalServices, useContentSwap } from '@/lib/useVerticalContent'
import { useDesignVertical } from '@/lib/useDesignFeatures'

const pageContent = getPageContent('services')

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench,
  AirVent,
  Settings,
  Flame,
  Home,
  Wind,
  Sparkles,
  AlertCircle,
}

const verticalLabels: Record<string, { title: string; description: string }> = {
  hvac: {
    title: 'Professional HVAC Services',
    description: 'From emergency repairs to new installations, we provide comprehensive heating and cooling solutions.',
  },
  plumbing: {
    title: 'Professional Plumbing Services',
    description: 'From emergency repairs to new installations, we provide comprehensive plumbing solutions.',
  },
  electrical: {
    title: 'Professional Electrical Services',
    description: 'From emergency repairs to new installations, we provide comprehensive electrical solutions.',
  },
  cleaning: {
    title: 'Professional Cleaning Services',
    description: 'From regular maintenance to deep cleaning, we provide comprehensive cleaning solutions.',
  },
  roofing: {
    title: 'Professional Roofing Services',
    description: 'From repairs to complete replacements, we provide comprehensive roofing solutions.',
  },
  landscaping: {
    title: 'Professional Landscaping Services',
    description: 'From lawn care to full landscape design, we provide comprehensive landscaping solutions.',
  },
}

export default function ServicesPage() {
  const verticalServicesData = useVerticalServices()
  const swap = useContentSwap()
  const vertical = useDesignVertical()

  const activeData = verticalServicesData || servicesData
  const services = (activeData as any).services || []
  const categories = (activeData as any).categories || []
  const labels = verticalLabels[vertical] || verticalLabels.hvac

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-background to-muted py-16 md:py-24">
        <Container>
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="blue" className="mb-4">Our Services</Badge>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6">
                {labels.title}
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                {labels.description} {swap(businessData.address.city)} homeowners trust {swap(businessData.name)}.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`tel:${businessData.phoneRaw}`}
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  {businessData.phone}
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-slate-900 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Get Free Estimate
                </Link>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      <SectionDivider topColor="gray" bottomColor="white" />

      {/* Services by Category */}
      <section className="py-16 md:py-24">
        <Container>
          {categories.map((category: any) => {
            const categoryServices = services.filter((s: any) => s.category === category.slug)
            if (categoryServices.length === 0) return null

            return (
              <div key={category.slug} className="mb-16 last:mb-0">
                <h2 className="text-2xl md:text-3xl font-heading font-semibold text-slate-900 mb-8">
                  {category.name}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryServices.map((service: any, index: number) => {
                    const Icon = iconMap[service.icon] || Wrench
                    return (
                      <FadeInStagger key={service.slug} index={index}>
                        <Link href={`/services/${service.slug}`}>
                          <Card hover className="h-full group">
                            <div className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl group-hover:bg-primary transition-colors">
                                  <Icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                                </div>
                                {service.emergency && (
                                  <Badge variant="orange" size="sm">24/7</Badge>
                                )}
                              </div>
                              <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                                {service.name}
                              </h3>
                              <p className="text-slate-600 mb-4">
                                {service.shortDescription}
                              </p>
                              <span className="flex items-center text-primary text-sm font-medium">
                                Learn More
                                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                              </span>
                            </div>
                          </Card>
                        </Link>
                      </FadeInStagger>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </Container>
      </section>

      <CTABanner
        title={pageContent.ctaTitle}
        description={pageContent.ctaDescription}
      />
    </>
  )
}

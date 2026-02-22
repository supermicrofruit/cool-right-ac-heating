'use client'

import { Star, Users, Clock } from 'lucide-react'
import Container from '@/components/ui/Container'
import Badge from '@/components/ui/Badge'
import FadeIn from '@/components/ui/FadeIn'
import SectionDivider from '@/components/ui/SectionDivider'
import WorksGallery from '@/components/sections/WorksGallery'
import CTABanner from '@/components/sections/CTABanner'
import businessData from '@/data/business.json'
import { getPageContent } from '@/lib/content'
import { useContentSwap, useVerticalConfig } from '@/lib/useVerticalContent'

const pageContent = getPageContent('works')

export default function WorksPageClient() {
  const swap = useContentSwap()
  const vConfig = useVerticalConfig()

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-background to-muted py-16 md:py-24">
        <Container>
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="blue" className="mb-4">Portfolio</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                {swap(pageContent.heroTitle?.replace('<br />', '').replace('\\n', ' ') || `Our ${vConfig.name} Work`)}
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                {swap(pageContent.heroSubtitle || `Browse examples of our installations, repairs, and maintenance work throughout the ${businessData.address.city} metro area.`)}
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">{businessData.rating} Star Rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-medium">{businessData.reviewCount}+ Projects Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <span className="font-medium">{new Date().getFullYear() - businessData.established}+ Years Experience</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>
      <SectionDivider topColor="gray" bottomColor="white" />

      {/* Gallery with Filters */}
      <WorksGallery showFilters={true} showTitle={false} />

      <CTABanner
        title={swap(pageContent.ctaTitle)}
        description={swap(pageContent.ctaDescription)}
      />
    </>
  )
}

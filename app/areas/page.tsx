'use client'

import Link from 'next/link'
import { MapPin, Phone, ArrowRight, CheckCircle } from 'lucide-react'
import Container from '@/components/ui/Container'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import SectionDivider from '@/components/ui/SectionDivider'
import FadeIn, { FadeInStagger } from '@/components/ui/FadeIn'
import CTABanner from '@/components/sections/CTABanner'
import businessData from '@/data/business.json'
import areasData from '@/data/areas.json'
import { useVerticalAreas, useContentSwap, useVerticalConfig } from '@/lib/useVerticalContent'

export default function AreasPage() {
  const verticalAreas = useVerticalAreas()
  const swap = useContentSwap()
  const vConfig = useVerticalConfig()

  const activeData = verticalAreas || areasData
  const areas = (activeData as any).areas || []
  const primaryServiceArea = swap((activeData as any).primaryServiceArea || areasData.primaryServiceArea)
  const serviceRadius = swap((activeData as any).serviceRadius || areasData.serviceRadius)
  const city = swap(businessData.address.city)

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-background to-muted py-16 md:py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="blue" className="mb-4">Service Areas</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Serving the {primaryServiceArea}
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Professional {vConfig.tagline} services throughout the area. We proudly serve {city} and surrounding communities with fast, reliable service.
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
        </Container>
      </section>

      <SectionDivider topColor="gray" bottomColor="white" />

      {/* Areas Grid */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {areas.map((area: any, index: number) => (
              <FadeInStagger key={area.slug} index={index}>
                <Link href={`/areas/${area.slug}`}>
                  <Card hover className="h-full group">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl group-hover:bg-primary transition-colors">
                        <MapPin className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <Badge variant="slate" size="sm">
                        {area.population}
                      </Badge>
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                      {area.name}, {area.state}
                    </h2>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {area.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      {(area.serviceHighlights || []).slice(0, 2).map((highlight: string, idx: number) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-600">{highlight}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center text-primary text-sm font-medium">
                      View Area Details
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                    </div>
                  </Card>
                </Link>
              </FadeInStagger>
            ))}
          </div>
        </Container>
      </section>

      <SectionDivider topColor="white" bottomColor="gray" />

      {/* Service Radius Info */}
      <section className="py-16 md:py-24 bg-muted">
        <Container size="md">
          <FadeIn>
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4">
                {serviceRadius}
              </h2>
            <p className="text-lg text-slate-600 mb-8">
              Don&apos;t see your city listed? We likely serve your area too! Give us a call to confirm service availability at your location.
            </p>
            <a
              href={`tel:${businessData.phoneRaw}`}
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Phone className="h-5 w-5 mr-2" />
              Call to Confirm: {businessData.phone}
            </a>
            </div>
          </FadeIn>
        </Container>
      </section>

      <CTABanner
        title={`Need ${vConfig.name} Service in Your Area?`}
        description={`Contact us today for fast, reliable service throughout the ${primaryServiceArea}.`}
        fromColor="gray"
      />
    </>
  )
}

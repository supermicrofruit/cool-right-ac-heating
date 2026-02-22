'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone, MapPin, Check, ArrowRight, Building, Users, AlertTriangle, Star, Shield, Clock } from 'lucide-react'
import Container from '@/components/ui/Container'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import ServiceGrid from '@/components/sections/ServiceGrid'
import CTABanner from '@/components/sections/CTABanner'
import SectionDivider from '@/components/ui/SectionDivider'
import FadeIn, { FadeInStagger } from '@/components/ui/FadeIn'
import businessData from '@/data/business.json'
import areasData from '@/data/areas.json'
import themeData from '@/data/theme.json'
import { verticalConfig } from '@/lib/verticalConfig'
import { useVisualEffects } from '@/lib/gradientPresets'
import { useVerticalAreas, useVerticalConfig, useContentSwap } from '@/lib/useVerticalContent'

interface Area {
  slug: string
  name: string
  state: string
  description: string
  population: string | number
  neighborhoods: string[]
  landmarks: string[]
  serviceHighlights: string[]
  localChallenges: string
  coordinates?: { lat: number; lng: number }
  [key: string]: unknown
}

function getAreaPageStyle(): string {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('foundlio-design')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.areaPageStyle) return parsed.areaPageStyle
      }
    } catch (e) {
      // Ignore
    }
  }
  return (themeData as Record<string, unknown>).areaPageStyle as string || 'standard'
}

interface AreaPageContentProps {
  area: Area
}

// Standard Layout - Two-column hero with info card
function AreaStandard({ area }: AreaPageContentProps) {
  const effects = useVisualEffects()
  const vConfig = useVerticalConfig()
  const swap = useContentSwap()
  const verticalAreasData = useVerticalAreas()
  const allAreas = verticalAreasData ? (verticalAreasData as any).areas || [] : areasData.areas
  const otherAreas = allAreas.filter((a: any) => a.slug !== area.slug).slice(0, 6)

  const breadcrumbItems = [
    { label: 'Service Areas', href: '/areas' },
    { label: `${area.name}, ${area.state}` }
  ]

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-background to-muted pt-16 pb-28 md:pt-24 md:pb-40">
        <Container>
          <Breadcrumbs items={breadcrumbItems} />
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="up" duration={0.4}>
              <div className="flex items-center space-x-3 mb-4">
                <Badge variant="blue">
                  <MapPin className="h-3 w-3 mr-1" />
                  Service Area
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                {vConfig.serviceNamePlural} in {area.name}, {area.state}
              </h1>

              <p className="text-lg text-slate-600 mb-8">
                {area.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a
                  href={`tel:${businessData.phoneRaw}`}
                  className={`inline-flex items-center justify-center px-6 py-4 text-white font-semibold rounded-lg transition-colors ${
                    effects.gradientButtons ? 'bg-gradient-theme hover:opacity-90' : 'bg-primary hover:bg-primary/90'
                  }`}
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

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Population: {area.population}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-primary" />
                  <span>{area.neighborhoods.length} Neighborhoods Served</span>
                </div>
              </div>
            </FadeIn>

            {/* Area Info Card */}
            <FadeIn direction="right" delay={0.1} className="lg:pl-8">
              <Card className="p-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">
                  Why Choose Us in {area.name}
                </h2>

                <ul className="space-y-4 mb-6">
                  {area.serviceHighlights.map((highlight, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">{highlight}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={`tel:${businessData.phoneRaw}`}
                  className={`block w-full text-center px-6 py-4 text-white font-semibold rounded-lg transition-colors ${
                    effects.gradientButtons ? 'bg-gradient-theme hover:opacity-90' : 'bg-primary hover:bg-primary/90'
                  }`}
                >
                  Call Now: {businessData.phone}
                </a>
              </Card>
            </FadeIn>
          </div>
        </Container>
      </section>

      <SectionDivider topColor="gray" bottomColor="white" />

      {/* Local Challenges */}
      <section className="pt-16 pb-28 md:pt-24 md:pb-40 bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="up">
              <Badge variant="orange" className="mb-4">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Local {vConfig.name} Challenges
              </Badge>
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-6">
                {vConfig.name} Considerations for {area.name} Homes
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                {area.localChallenges}
              </p>
              <p className="text-slate-600">
                Our technicians understand the unique demands placed on {vConfig.tagline} systems in {area.name}. We&apos;re equipped to handle the specific challenges of this area.
              </p>
            </FadeIn>
            <FadeIn direction="right" delay={0.1}>
              <Card className="p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Local Landmarks We Serve Near:</h3>
                <div className="flex flex-wrap gap-2">
                  {area.landmarks.map((landmark, index) => (
                    <Badge key={index} variant="slate">
                      {landmark}
                    </Badge>
                  ))}
                </div>
              </Card>
            </FadeIn>
          </div>
        </Container>
      </section>

      <SectionDivider topColor="white" bottomColor="gray" />

      {/* Neighborhoods */}
      <section className="py-16 md:py-24 bg-muted">
        <Container>
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-8 text-center">
              Neighborhoods We Serve in {area.name}
            </h2>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {area.neighborhoods.map((neighborhood, index) => (
              <FadeInStagger key={index} index={index}>
                <div className="bg-white rounded-lg p-4 text-center border border-slate-100">
                  <span className="text-slate-700 font-medium">{neighborhood}</span>
                </div>
              </FadeInStagger>
            ))}
          </div>
        </Container>
      </section>

      <SectionDivider topColor="gray" bottomColor="gray" />

      {/* Services */}
      <ServiceGrid showTitle={true} />

      <SectionDivider topColor="gray" bottomColor="white" />

      {/* Other Areas */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-8">
              Other Areas We Serve
            </h2>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {otherAreas.map((otherArea, index) => (
              <FadeInStagger key={otherArea.slug} index={index}>
                <Link
                  href={`/areas/${otherArea.slug}`}
                  className="block bg-slate-50 rounded-lg p-4 text-center hover:bg-slate-100 transition-colors"
                >
                  <span className="text-slate-700 font-medium">{otherArea.name}, {otherArea.state || area.state}</span>
                </Link>
              </FadeInStagger>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/areas"
              className="inline-flex items-center text-primary font-medium hover:text-primary/80"
            >
              View All Service Areas
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </Container>
      </section>

      <CTABanner
        title={`Need ${vConfig.serviceName} in ${area.name}?`}
        description={swap("Contact us today for fast, reliable service from local experts.")}
      />
    </>
  )
}

// Map Focus Layout - Emphasis on map and neighborhoods
function AreaMapFocus({ area }: AreaPageContentProps) {
  const effects = useVisualEffects()
  const vConfig = useVerticalConfig()
  const swap = useContentSwap()
  const verticalAreasData = useVerticalAreas()
  const allAreas = verticalAreasData ? (verticalAreasData as any).areas || [] : areasData.areas
  const otherAreas = allAreas.filter((a: any) => a.slug !== area.slug).slice(0, 8)

  // Create Google Maps embed URL (no API key needed)
  const mapQuery = encodeURIComponent(`${area.name}, ${area.state}`)
  const mapEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`

  const breadcrumbItems = [
    { label: 'Service Areas', href: '/areas' },
    { label: `${area.name}, ${area.state}` }
  ]

  return (
    <>
      {/* Compact Hero */}
      <section className="bg-slate-900 text-white py-8 md:py-10">
        <Container>
          <Breadcrumbs items={breadcrumbItems} className="mb-3 [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white/50 [&>nav>ol>li:last-child_span]:text-white" />

          <FadeIn direction="up" duration={0.4}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <Badge variant="blue" className="bg-primary text-white">
                  <MapPin className="h-3 w-3 mr-1" />
                  Service Area
                </Badge>
                <span className="text-white/60 text-sm">Population: {area.population}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {vConfig.serviceNamePlural} in {area.name}, {area.state}
              </h1>
              <p className="text-white/70 text-sm md:text-base max-w-2xl">
                {area.description}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href={`tel:${businessData.phoneRaw}`}
                className={`inline-flex items-center justify-center px-5 py-2.5 text-white font-semibold rounded-lg transition-colors text-sm ${
                  effects.gradientButtons ? 'bg-gradient-theme hover:opacity-90' : 'bg-primary hover:bg-primary/90'
                }`}
              >
                <Phone className="h-4 w-4 mr-2" />
                {businessData.phone}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors text-sm"
              >
                Get Estimate
              </Link>
            </div>
          </div>
          </FadeIn>
        </Container>
      </section>

      {/* Full-width Map - oversized iframe to hide controls */}
      <div className="w-full h-64 relative overflow-hidden">
        <iframe
          src={mapEmbedUrl}
          className="absolute border-0 pointer-events-none"
          style={{
            width: '150%',
            height: '400px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map of ${area.name}, ${area.state}`}
        />
      </div>

      <SectionDivider topColor="white" bottomColor="white" />

      {/* Neighborhoods Grid - Primary Focus */}
      <section className="pt-12 pb-24 md:pt-20 md:pb-36 bg-white">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              {area.neighborhoods.length} Neighborhoods We Serve
            </h2>
            <p className="text-slate-600">Fast service throughout {area.name}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {area.neighborhoods.map((neighborhood, index) => (
              <FadeInStagger key={index} index={index}>
                <div className="group relative bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border border-slate-200 hover:border-primary/30 hover:shadow-md transition-all cursor-default">
                  <MapPin className="h-4 w-4 text-primary mb-2" />
                  <span className="text-sm font-medium text-slate-700 block">{neighborhood}</span>
                </div>
              </FadeInStagger>
            ))}
          </div>
        </Container>
      </section>

      <SectionDivider topColor="white" bottomColor="gray" />

      {/* Why Choose Us + Landmarks Row */}
      <section className="pt-12 pb-24 md:pt-16 md:pb-32 bg-slate-50">
        <Container>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Service Highlights */}
            <FadeIn direction="up">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Why {area.name} Chooses Us</h3>
              <div className="space-y-3">
                {area.serviceHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">{highlight}</span>
                  </div>
                ))}
              </div>
            </Card>
            </FadeIn>

            {/* Landmarks */}
            <FadeIn direction="up" delay={0.1}>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Serving Near</h3>
              <div className="flex flex-wrap gap-2">
                {area.landmarks.map((landmark, index) => (
                  <Badge key={index} variant="slate" className="text-sm">
                    {landmark}
                  </Badge>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="text-sm font-medium text-slate-900 mb-2">Local Considerations</h4>
                <p className="text-sm text-slate-600">{area.localChallenges}</p>
              </div>
            </Card>
            </FadeIn>
          </div>
        </Container>
      </section>

      <SectionDivider topColor="gray" bottomColor="white" />

      {/* Other Areas - Horizontal Scroll */}
      <section className="pt-12 pb-24 md:pt-16 md:pb-32 bg-white">
        <Container>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Other Service Areas</h2>
            <Link href="/areas" className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all text-sm">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 lg:grid-cols-8">
            {otherAreas.map((otherArea) => (
              <Link
                key={otherArea.slug}
                href={`/areas/${otherArea.slug}`}
                className="flex-shrink-0 bg-slate-50 rounded-lg px-4 py-3 hover:bg-slate-100 transition-colors whitespace-nowrap"
              >
                <span className="text-sm font-medium text-slate-700">{otherArea.name}</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <SectionDivider topColor="white" bottomColor="gray" />

      {/* Services */}
      <ServiceGrid showTitle={true} />

      <CTABanner
        title={`Need ${vConfig.serviceName} in ${area.name}?`}
        description={swap("Contact us today for fast, reliable service from local experts.")}
      />
    </>
  )
}

// Local Hero Layout - Large hero with local focus
function AreaLocalHero({ area }: AreaPageContentProps) {
  const effects = useVisualEffects()
  const vConfig = useVerticalConfig()
  const swap = useContentSwap()
  const verticalAreasData = useVerticalAreas()
  const allAreas = verticalAreasData ? (verticalAreasData as any).areas || [] : areasData.areas
  const otherAreas = allAreas.filter((a: any) => a.slug !== area.slug).slice(0, 6)

  const breadcrumbItems = [
    { label: 'Service Areas', href: '/areas' },
    { label: `${area.name}, ${area.state}` }
  ]

  return (
    <>
      {/* Large Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-primary/90 text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-technician.png')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />

        <Container className="relative z-10">
          <Breadcrumbs items={breadcrumbItems} className="mb-8 [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white/50 [&>nav>ol>li:last-child_span]:text-white" />

          <FadeIn direction="up" duration={0.4}>
            <div className="max-w-3xl">
              <Badge variant="blue" className="bg-white/20 text-white border-white/30 mb-6">
                <MapPin className="h-3 w-3 mr-1" />
                Proudly Serving {area.name}
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                Your Trusted {vConfig.name} Experts in {area.name}, {area.state}
              </h1>

              <p className="text-xl text-white/80 mb-8">
                {area.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <a
                  href={`tel:${businessData.phoneRaw}`}
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-bold rounded-lg hover:bg-slate-100 transition-colors text-lg"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  {businessData.phone}
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-lg border-2 border-white/30 hover:bg-white/20 transition-colors text-lg"
                >
                  Get Free Estimate
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-6 text-white/90">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span>{businessData.rating} Star Rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Licensed & Insured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Same-Day Service</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>{area.population} Residents</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* Service Highlights Bar */}
      <section className="bg-slate-900 text-white pt-8 pb-20 md:pb-24">
        <Container>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
            {area.serviceHighlights.slice(0, 4).map((highlight, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-400" />
                <span className="font-medium">{highlight}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <SectionDivider topColor="dark" bottomColor="white" />

      {/* Neighborhoods Carousel Style */}
      <section className="pt-16 pb-28 md:pt-24 md:pb-40 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Neighborhoods We Serve in {area.name}
            </h2>
            <p className="text-lg text-slate-600">
              Fast, reliable service throughout the {area.name} area
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {area.neighborhoods.map((neighborhood, index) => (
              <FadeInStagger key={index} index={index}>
                <Card className="p-4 text-center hover:shadow-lg transition-shadow">
                  <MapPin className="h-5 w-5 text-primary mx-auto mb-2" />
                  <span className="text-sm font-medium text-slate-700">{neighborhood}</span>
                </Card>
              </FadeInStagger>
            ))}
          </div>
        </Container>
      </section>

      <SectionDivider topColor="white" bottomColor="gray" />

      {/* Local Challenges + Landmarks */}
      <section className="py-16 md:py-24 bg-slate-50">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12">
            <FadeIn direction="up">
              <Badge variant="orange" className="mb-4">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Local Expertise
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                We Understand {area.name}
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                {area.localChallenges}
              </p>
              <p className="text-slate-600">
                Our technicians are specially trained to handle the unique {vConfig.tagline.toLowerCase()} challenges faced by {area.name} homeowners. Trust local experts who know your area.
              </p>
            </FadeIn>
            <FadeIn direction="right" delay={0.1}>
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Serving Near Local Landmarks</h3>
                <div className="flex flex-wrap gap-2">
                  {area.landmarks.map((landmark, index) => (
                    <Badge key={index} variant="slate" className="text-sm">
                      {landmark}
                    </Badge>
                  ))}
                </div>
              </Card>
              <div className="p-6 bg-primary text-white rounded-xl shadow-lg">
                <h3 className="font-semibold mb-2">Ready to Help {area.name}</h3>
                <p className="text-white/80 text-sm mb-4">
                  Our team is standing by to serve your neighborhood
                </p>
                <a
                  href={`tel:${businessData.phoneRaw}`}
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </a>
              </div>
            </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      <SectionDivider topColor="gray" bottomColor="gray" />

      {/* Services */}
      <ServiceGrid showTitle={true} />

      <SectionDivider topColor="gray" bottomColor="white" />

      {/* Other Areas */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
              Also Serving Nearby Areas
            </h2>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {otherAreas.map((otherArea, index) => (
              <FadeInStagger key={otherArea.slug} index={index}>
                <Link
                  href={`/areas/${otherArea.slug}`}
                  className="group block bg-slate-50 rounded-xl p-5 text-center hover:bg-primary hover:text-white transition-colors"
                >
                  <MapPin className="h-5 w-5 mx-auto mb-2 text-primary group-hover:text-white transition-colors" />
                  <span className="font-medium">{otherArea.name}</span>
                </Link>
              </FadeInStagger>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/areas"
              className="inline-flex items-center text-primary font-medium hover:text-primary/80"
            >
              View All Service Areas
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </Container>
      </section>

      <CTABanner
        title={`Need ${vConfig.serviceName} in ${area.name}?`}
        description={swap("Contact us today for fast, reliable service from local experts.")}
      />
    </>
  )
}

export default function AreaPageContent({ area }: AreaPageContentProps) {
  const [pageStyle, setPageStyle] = useState('standard')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setPageStyle(getAreaPageStyle())

    const handleThemeChange = () => {
      setPageStyle(getAreaPageStyle())
    }
    window.addEventListener('foundlio-theme-change', handleThemeChange)
    return () => window.removeEventListener('foundlio-theme-change', handleThemeChange)
  }, [])

  if (!mounted) return <AreaStandard area={area} />

  switch (pageStyle) {
    case 'mapfocus':
      return <AreaMapFocus area={area} />
    case 'localhero':
      return <AreaLocalHero area={area} />
    case 'standard':
    default:
      return <AreaStandard area={area} />
  }
}

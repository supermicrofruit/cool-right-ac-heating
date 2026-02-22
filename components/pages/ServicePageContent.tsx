'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Check, ArrowRight, Clock, Shield, Star, Wrench, AirVent, Settings, Flame, Home, Wind, Sparkles, AlertCircle, Truck, Building, Hammer, ChevronDown, Zap, Heart, ThumbsUp, Calendar, Users, Leaf, Award, Timer, BadgeCheck, Recycle, Brush, Droplets, Layers } from 'lucide-react'
import Container from '@/components/ui/Container'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import ServiceGrid from '@/components/sections/ServiceGrid'
import FAQAccordion from '@/components/sections/FAQAccordion'
import CTABanner from '@/components/sections/CTABanner'
import SectionDivider, { getColorValue, stampFillPath, type DividerStyle } from '@/components/ui/SectionDivider'
import FadeIn, { FadeInStagger } from '@/components/ui/FadeIn'
import {
  getServicesByCategory,
  getCategoryForService,
  type Service,
} from '@/lib/services'
import businessData from '@/data/business.json'
import faqsData from '@/data/faqs.json'
import themeData from '@/data/theme.json'
import { useVisualEffects } from '@/lib/gradientPresets'
import { type HeaderStyle } from '@/lib/headerHeroConfig'

function getHeaderStyle(): HeaderStyle {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('foundlio-design')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.headerStyle && ['standard', 'trust-bar', 'centered', 'floating'].includes(parsed.headerStyle)) {
          return parsed.headerStyle as HeaderStyle
        }
      }
    } catch {
      // Ignore
    }
  }
  return ((themeData as Record<string, unknown>).headerStyle as HeaderStyle) || 'standard'
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench, AirVent, Settings, Flame, Home, Wind, Sparkles, AlertCircle, Truck, Building, Star, Hammer,
}

import { getSmartIcon } from '@/lib/smartIcons'

// Get icon for feature based on text content (smart matching)
function getFeatureIcon(text: string, index: number) {
  return getSmartIcon(text, index)
}

// Inline accordion component for sidebar (same UI as FAQAccordion)
function SidebarFAQAccordion({ faqs, title }: { faqs: Array<{ question: string; answer: string }>; title: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-6">{title}</h2>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex items-center justify-between w-full px-6 py-4 text-left"
            >
              <span className="font-medium text-foreground pr-4">
                {faq.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-6 pb-4 text-muted-foreground">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}

function useDividerStyle(): DividerStyle {
  const [style, setStyle] = useState<DividerStyle>(
    (themeData as any).sectionDivider || 'none'
  )
  useEffect(() => {
    function update() {
      try {
        const saved = localStorage.getItem('foundlio-design')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.sectionDivider) { setStyle(parsed.sectionDivider); return }
        }
      } catch {}
      setStyle((themeData as any).sectionDivider || 'none')
    }
    update()
    window.addEventListener('foundlio-theme-change', update)
    return () => window.removeEventListener('foundlio-theme-change', update)
  }, [])
  return style
}

function getServicePageStyle(): string {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('foundlio-design')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.servicePageStyle) return parsed.servicePageStyle
      }
    } catch (e) {
      // Ignore
    }
  }
  return (themeData as Record<string, unknown>).servicePageStyle as string || 'standard'
}

interface ServicePageContentProps {
  service: Service
}

// Standard Layout - Two-column hero with service card
function ServiceStandard({ service }: ServicePageContentProps) {
  const Icon = iconMap[service.icon] || Wrench
  const category = getCategoryForService(service)
  const effects = useVisualEffects()

  const breadcrumbItems = category
    ? [
        { label: 'Services', href: '/services' },
        { label: category.shortName || category.name, href: `/services/${category.slug}` },
        { label: service.name }
      ]
    : [
        { label: 'Services', href: '/services' },
        { label: service.name }
      ]

  const relatedServices = category
    ? getServicesByCategory(category.slug).filter(s => s.slug !== service.slug).slice(0, 3)
    : []

  const faqCats = (faqsData as any).categories || []
  const categoryFaqs = faqCats.find(
    (cat: any) => cat.slug === service.slug || cat.slug === (service as any).category
  )?.faqs || faqCats.find((cat: any) => cat.slug === 'general')?.faqs || []

  return (
    <>
      {/* Hero */}
      <section className="hero-section bg-muted pt-24 pb-16 md:pt-28 md:pb-20">
        <Container>
          <Breadcrumbs items={breadcrumbItems} />
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <FadeIn direction="up" duration={0.4}>
              <div className="flex items-center space-x-3 mb-4">
                {category && (
                  <Link href={`/services/${category.slug}`}>
                    <Badge variant="blue" className="hover:bg-primary/20 cursor-pointer">
                      {category.shortName || category.name}
                    </Badge>
                  </Link>
                )}
                {service.emergency && <Badge variant="orange">24/7 Available</Badge>}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                {service.name} in {businessData.address.city}
              </h1>

              <p className="text-lg text-slate-600 mb-8">
                {service.longDescription}
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
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>{businessData.rating} Star Rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Licensed & Insured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <span>Same-Day Service</span>
                </div>
              </div>
            </FadeIn>

            {/* Service Image + Card */}
            <FadeIn direction="right" delay={0.1} className="lg:pl-8">
              <div className="space-y-6">
                {/* Service Image */}
                {service.image && (
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted-foreground/10 relative">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none' }}
                    />
                  </div>
                )}

                <Card className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">{service.name}</h2>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <h3 className="font-semibold text-slate-900">What&apos;s Included:</h3>
                    <ul className="space-y-3">
                      {(service.features || []).map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={`tel:${businessData.phoneRaw}`}
                    className={`block w-full text-center px-6 py-4 text-white font-semibold rounded-lg transition-colors ${
                      effects.gradientButtons ? 'bg-gradient-theme hover:opacity-90' : 'bg-primary hover:bg-primary/90'
                    }`}
                  >
                    Call Now: {businessData.phone}
                  </a>
                </Card>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      <SectionDivider topColor="gray" bottomColor="white" />

      {/* Benefits */}
      {(service.benefits || []).length > 0 && (
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-8 text-center">
              Benefits of Our {service.name} Service
            </h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(service.benefits || []).map((benefit, index) => {
              const BenefitIcon = getFeatureIcon(benefit, index + (service.features || []).length)
              return (
                <FadeInStagger key={index} index={index}>
                  <Card className="text-center p-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4">
                      <BenefitIcon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-slate-900">{benefit}</p>
                  </Card>
                </FadeInStagger>
              )
            })}
          </div>
        </Container>
      </section>
      )}

      {/* FAQs */}
      {categoryFaqs.length > 0 && (
        <FAQAccordion
          faqs={categoryFaqs}
          title={`${service.name} FAQs`}
          description={`Common questions about our ${service.name.toLowerCase()} service`}
        />
      )}

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <>
          <SectionDivider topColor="white" bottomColor="gray" />
          <section className="py-16 md:py-24 bg-muted">
            <Container>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
                  More {category?.shortName || category?.name} Services
                </h2>
                {category && (
                  <Link
                    href={`/services/${category.slug}`}
                    className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    View All <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedServices.map((relatedService, index) => {
                  const RelatedIcon = iconMap[relatedService.icon] || Wrench
                  return (
                    <FadeInStagger key={relatedService.slug} index={index}>
                      <Link href={`/services/${relatedService.slug}`}>
                        <Card hover className="h-full group p-6">
                          <div className="flex items-start space-x-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl group-hover:bg-primary transition-colors flex-shrink-0">
                              <RelatedIcon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                            </div>
                            <div>
                              <p className="text-base font-medium text-slate-900 group-hover:text-primary transition-colors">
                                {relatedService.name}
                              </p>
                              <p className="text-sm text-slate-600 mt-1">
                                {relatedService.shortDescription}
                              </p>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </FadeInStagger>
                  )
                })}
              </div>
            </Container>
          </section>
        </>
      )}

      <CTABanner
        title={`Need ${service.name}?`}
        description="Contact us today for fast, reliable service from certified professionals."
        fromColor={relatedServices.length > 0 ? 'gray' : 'white'}
      />
    </>
  )
}

// Sidebar Layout - Full-width hero with sticky sidebar
function ServiceSidebar({ service }: ServicePageContentProps) {
  const Icon = iconMap[service.icon] || Wrench
  const category = getCategoryForService(service)
  const dividerStyle = useDividerStyle()
  const effects = useVisualEffects()
  const headerStyle = getHeaderStyle()
  const isFloating = headerStyle === 'floating'

  const breadcrumbItems = category
    ? [
        { label: 'Services', href: '/services' },
        { label: category.shortName || category.name, href: `/services/${category.slug}` },
        { label: service.name }
      ]
    : [
        { label: 'Services', href: '/services' },
        { label: service.name }
      ]

  const relatedServices = category
    ? getServicesByCategory(category.slug).filter(s => s.slug !== service.slug).slice(0, 3)
    : []

  const faqCats = (faqsData as any).categories || []
  const categoryFaqs = faqCats.find(
    (cat: any) => cat.slug === service.slug || cat.slug === (service as any).category
  )?.faqs || faqCats.find((cat: any) => cat.slug === 'general')?.faqs || []

  return (
    <>
      {/* Full-width Hero */}
      <section className={`hero-section relative bg-slate-900 text-white pb-24 md:pb-32 ${isFloating ? '-mt-[120px] pt-[calc(120px+64px)] md:pt-[calc(120px+96px)]' : 'pt-16 md:pt-24'}`}>
        <div className="absolute inset-0">
          {service.image ? (
            <img
              src={service.image}
              alt={`${service.name} service`}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          ) : (
            <Image
              src="/images/hero-technician.png"
              alt={`${service.name} service`}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-gray-900/40" />
        </div>
        <Container className="relative z-10">
          <Breadcrumbs items={breadcrumbItems} className="mb-6 [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white/50 [&>nav>ol>li:last-child_span]:text-white" />

          <FadeIn direction="up" duration={0.4}>
            <div className="flex items-center space-x-3 mb-6">
              {category && (
                <Badge variant="blue" className="bg-white/20 text-white border-white/30">
                  {category.shortName || category.name}
                </Badge>
              )}
              {service.emergency && <Badge variant="orange">24/7 Available</Badge>}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-3xl text-white">
              {service.name} in {businessData.address.city}
            </h1>

            <p className="text-xl text-white/80 mb-8 max-w-2xl">
              {service.longDescription}
            </p>

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
            </div>
          </FadeIn>
        </Container>

        {/* Divider inside hero — transparent top shows photo, fill transitions to white */}
        {dividerStyle !== 'none' && (
          <div className="absolute bottom-0 left-0 right-0 z-20" aria-hidden="true">
            {dividerStyle === 'wave' && (
              <svg className="w-full h-12 md:h-16 lg:h-20 block" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,40 C150,80 350,-3 600,40 C850,80 1050,-3 1200,40 L1200,120 L0,120 Z" fill={getColorValue('white')} />
              </svg>
            )}
            {dividerStyle === 'curve' && (
              <svg className="w-full h-10 md:h-14 lg:h-[4.5rem] block" viewBox="0 0 1200 100" preserveAspectRatio="none">
                <path d="M0,50 Q300,-3 600,50 T1200,50 L1200,100 L0,100 Z" fill={getColorValue('white')} />
              </svg>
            )}
            {dividerStyle === 'diagonal' && (
              <svg className="w-full h-4 md:h-6 lg:h-8 block" viewBox="0 0 1200 8" preserveAspectRatio="none">
                <polygon points="0,0 0,8 1200,8" fill={getColorValue('white')} />
              </svg>
            )}
            {dividerStyle === 'stamp' && (
              <svg className="w-full h-6 md:h-8 lg:h-10 block" viewBox="0 0 1200 40" preserveAspectRatio="none">
                <path d={stampFillPath} fill={getColorValue('white')} />
              </svg>
            )}
          </div>
        )}
      </section>

      {/* Content with Sticky Sidebar */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Features */}
              <div>
                <FadeIn>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-6">What&apos;s Included</h2>
                </FadeIn>
                <div className="grid sm:grid-cols-2 gap-4">
                  {(service.features || []).map((feature, index) => {
                    const FeatureIcon = getFeatureIcon(feature, index)
                    return (
                      <FadeInStagger key={index} index={index}>
                        <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-xl">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FeatureIcon className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-slate-700">{feature}</span>
                        </div>
                      </FadeInStagger>
                    )
                  })}
                </div>
              </div>

              {/* Benefits */}
              {(service.benefits || []).length > 0 && (
              <div>
                <FadeIn>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-6">Benefits</h2>
                </FadeIn>
                <div className="grid sm:grid-cols-2 gap-4">
                  {(service.benefits || []).map((benefit, index) => {
                    const BenefitIcon = getFeatureIcon(benefit, index + (service.features || []).length)
                    return (
                      <FadeInStagger key={index} index={index}>
                        <Card className="p-5">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <BenefitIcon className="h-4 w-4 text-primary" />
                            </div>
                            <p className="text-slate-700">{benefit}</p>
                          </div>
                        </Card>
                      </FadeInStagger>
                    )
                  })}
                </div>
              </div>
              )}

              {/* FAQs - Using accordion UI */}
              {categoryFaqs.length > 0 && (
                <SidebarFAQAccordion
                  faqs={categoryFaqs.slice(0, 5)}
                  title="Frequently Asked Questions"
                />
              )}
            </div>

            {/* Sticky Sidebar */}
            <div className="lg:col-span-1">
              <FadeIn direction="right" delay={0.15}>
              <div className="sticky top-24">
                <Card className="p-5 mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{service.name}</h3>
                      <p className="text-xs text-slate-500">Professional Service</p>
                    </div>
                  </div>

                  <a
                    href={`tel:${businessData.phoneRaw}`}
                    className={`block w-full text-center px-4 py-3 text-white text-sm font-semibold rounded-lg transition-colors mb-2 ${
                      effects.gradientButtons ? 'bg-gradient-theme hover:opacity-90' : 'bg-primary hover:bg-primary/90'
                    }`}
                  >
                    <Phone className="h-4 w-4 inline mr-2" />
                    {businessData.phone}
                  </a>
                  <Link
                    href="/contact"
                    className="block w-full text-center px-4 py-3 bg-slate-100 text-slate-900 text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Get Free Estimate
                  </Link>
                </Card>

                {/* Related Services */}
                {relatedServices.length > 0 && (
                  <Card className="p-5">
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Related Services</h3>
                    <div className="space-y-3">
                      {relatedServices.map((rs) => (
                        <Link
                          key={rs.slug}
                          href={`/services/${rs.slug}`}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <span className="text-sm font-medium text-slate-700">{rs.name}</span>
                          <ArrowRight className="h-4 w-4 text-slate-400" />
                        </Link>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
              </FadeIn>
            </div>
          </div>
        </Container>
      </section>

      <CTABanner
        title={`Need ${service.name}?`}
        description="Contact us today for fast, reliable service from certified professionals."
      />
    </>
  )
}

// Fullwidth Layout - Bold, full-width sections
function ServiceFullwidth({ service }: ServicePageContentProps) {
  const Icon = iconMap[service.icon] || Wrench
  const category = getCategoryForService(service)
  const effects = useVisualEffects()

  const breadcrumbItems = category
    ? [
        { label: 'Services', href: '/services' },
        { label: category.shortName || category.name, href: `/services/${category.slug}` },
        { label: service.name }
      ]
    : [
        { label: 'Services', href: '/services' },
        { label: service.name }
      ]

  const relatedServices = category
    ? getServicesByCategory(category.slug).filter(s => s.slug !== service.slug).slice(0, 4)
    : []

  const faqCats = (faqsData as any).categories || []
  const categoryFaqs = faqCats.find(
    (cat: any) => cat.slug === service.slug || cat.slug === (service as any).category
  )?.faqs || faqCats.find((cat: any) => cat.slug === 'general')?.faqs || []

  return (
    <>
      {/* Hero */}
      <section className="hero-section bg-background pt-24 pb-28 md:pt-32 md:pb-40">
        <Container>
          <FadeIn direction="up" duration={0.4}>
            <div className="max-w-4xl mx-auto text-center">
              <Breadcrumbs items={breadcrumbItems} className="justify-center mb-8" />

              <div className="flex items-center justify-center space-x-3 mb-6">
                {category && (
                  <Link href={`/services/${category.slug}`}>
                    <Badge variant="blue" className="hover:bg-primary/20 cursor-pointer">
                      {category.shortName || category.name}
                    </Badge>
                  </Link>
                )}
                {service.emergency && <Badge variant="orange">24/7 Available</Badge>}
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                {service.name}
              </h1>

              <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                {service.longDescription}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <a
                  href={`tel:${businessData.phoneRaw}`}
                  className={`inline-flex items-center justify-center px-8 py-4 text-white font-semibold rounded-lg transition-colors text-lg ${
                    effects.gradientButtons ? 'bg-gradient-theme hover:opacity-90' : 'bg-primary hover:bg-primary/90'
                  }`}
                >
                  <Phone className="h-5 w-5 mr-2" />
                  {businessData.phone}
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors text-lg"
                >
                  Get Free Estimate
                </Link>
              </div>

              {/* Service Image */}
              {service.image ? (
                <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl bg-muted-foreground/10 relative max-w-3xl mx-auto">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none' }}
                  />
                </div>
              ) : (
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-2xl">
                  <Icon className="h-10 w-10 text-primary" />
                </div>
              )}
            </div>
          </FadeIn>
        </Container>
      </section>

      <SectionDivider topColor="white" bottomColor="dark" />

      {/* Trust Bar */}
      <section className="bg-slate-950 text-white pt-6 pb-16 md:pb-20">
        <Container>
          <FadeIn>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="font-medium">{businessData.rating} Star Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Licensed & Insured</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span className="font-medium">Same-Day Service</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-400" />
                <span className="font-medium">Satisfaction Guaranteed</span>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      <SectionDivider topColor="dark" bottomColor="white" />

      {/* Features - Full Width Cards */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
              What&apos;s Included
            </h2>
          </FadeIn>
          <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
            {(service.features || []).map((feature, index) => {
              const FeatureIcon = getFeatureIcon(feature, index)
              return (
                <FadeInStagger key={index} index={index} className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      <FeatureIcon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-lg text-slate-700 font-medium">{feature}</p>
                  </div>
                </FadeInStagger>
              )
            })}
          </div>
        </Container>
      </section>

      <SectionDivider topColor="white" bottomColor="gray" />

      {/* Benefits - Alternating Background */}
      {(service.benefits || []).length > 0 && (
      <>
      <section className="py-16 md:py-24 bg-muted">
        <Container>
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
              Benefits of Our {service.name}
            </h2>
          </FadeIn>
          <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
            {(service.benefits || []).map((benefit, index) => {
              const BenefitIcon = getFeatureIcon(benefit, index + (service.features || []).length)
              return (
                <FadeInStagger key={index} index={index} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]">
                  <Card className="text-center p-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl mb-4">
                      <BenefitIcon className="h-7 w-7 text-white" />
                    </div>
                    <p className="text-lg font-medium text-slate-900">{benefit}</p>
                  </Card>
                </FadeInStagger>
              )
            })}
          </div>
        </Container>
      </section>

      <SectionDivider topColor="gray" bottomColor="white" />
      </>
      )}

      {/* FAQs */}
      {categoryFaqs.length > 0 && (
        <FAQAccordion
          faqs={categoryFaqs}
          title={`${service.name} FAQs`}
          description={`Common questions about our ${service.name.toLowerCase()} service`}
        />
      )}

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-16 md:py-24 bg-background">
          <Container>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
              Related Services
            </h2>
            <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
              {relatedServices.map((rs, index) => {
                const RelatedIcon = iconMap[rs.icon] || Wrench
                return (
                  <FadeInStagger key={rs.slug} index={index} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]">
                    <Link href={`/services/${rs.slug}`}>
                      <Card hover className="h-full group p-6 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl group-hover:bg-primary transition-colors mb-4">
                          <RelatedIcon className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
                        </div>
                        <p className="text-lg font-medium text-slate-900 group-hover:text-primary transition-colors">
                          {rs.name}
                        </p>
                      </Card>
                    </Link>
                  </FadeInStagger>
                )
              })}
            </div>
          </Container>
        </section>
      )}

      <CTABanner
        title={`Need ${service.name}?`}
        description="Contact us today for fast, reliable service from certified professionals."
      />
    </>
  )
}

export default function ServicePageContent({ service }: ServicePageContentProps) {
  const [pageStyle, setPageStyle] = useState('standard')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setPageStyle(getServicePageStyle())

    const handleThemeChange = () => {
      setPageStyle(getServicePageStyle())
    }
    window.addEventListener('foundlio-theme-change', handleThemeChange)
    return () => window.removeEventListener('foundlio-theme-change', handleThemeChange)
  }, [])

  if (!mounted) return <ServiceStandard service={service} />

  switch (pageStyle) {
    case 'sidebar':
      return <ServiceSidebar service={service} />
    case 'fullwidth':
      return <ServiceFullwidth service={service} />
    case 'standard':
    default:
      return <ServiceStandard service={service} />
  }
}

'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight, Wrench, AirVent, Settings, Flame, Home, Wind, Sparkles, AlertCircle, Truck, Building, Star, Hammer, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { getAllServices, getServicesGroupedByCategory, type Service, type Category } from '@/lib/services'
import { getServicesSectionContent } from '@/lib/content'
import { useVisualEffects } from '@/lib/gradientPresets'
import { useVerticalServices } from '@/lib/useVerticalContent'

const servicesContent = getServicesSectionContent()

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

type ServiceStyle = 'cards' | 'list' | 'compact' | 'minimal' | 'image-cards' | 'image-overlap' | 'image-hover'
type ServiceGrouping = 'flat' | 'grouped'

// Get service style from localStorage
function getServiceStyle(): ServiceStyle {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('foundlio-design')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.serviceStyle) return parsed.serviceStyle
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
  return 'cards'
}

// Get service grouping from localStorage
function getServiceGrouping(): ServiceGrouping {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('foundlio-design')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.serviceGrouping) return parsed.serviceGrouping
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
  return 'flat'
}

interface ServiceGridProps {
  limit?: number
  showTitle?: boolean
  categorySlug?: string // Filter to specific category
  forceGrouped?: boolean // Force grouped display regardless of setting
}

export default function ServiceGrid({ limit, showTitle = true, categorySlug, forceGrouped }: ServiceGridProps) {
  const verticalServices = useVerticalServices()

  const allServices = useMemo(() => {
    if (verticalServices?.services) {
      // Map vertical template services to the Service shape used by ServiceGrid
      return verticalServices.services.map((s: any) => ({
        slug: s.slug,
        name: s.name,
        shortDescription: s.shortDescription,
        longDescription: s.longDescription || '',
        features: s.features || [],
        benefits: s.benefits || [],
        icon: s.icon || 'Wrench',
        image: s.image,
        category: s.category || '',
        emergency: s.emergency || false,
        metaTitle: s.meta?.title || s.name,
        metaDescription: s.meta?.description || s.shortDescription,
      })) as Service[]
    }
    return getAllServices()
  }, [verticalServices])

  const groupedServices = useMemo(() => {
    if (verticalServices?.categories) {
      return (verticalServices.categories as any[]).map((cat: any) => ({
        category: { slug: cat.slug, name: cat.name, icon: cat.icon || 'Wrench', description: cat.description } as Category,
        services: allServices.filter(s => s.category === cat.slug),
      })).filter(g => g.services.length > 0)
    }
    return getServicesGroupedByCategory()
  }, [verticalServices, allServices])

  const [serviceStyle, setServiceStyle] = useState<ServiceStyle>('cards')
  const [serviceGrouping, setServiceGrouping] = useState<ServiceGrouping>('flat')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setServiceStyle(getServiceStyle())
    setServiceGrouping(getServiceGrouping())

    const handleThemeChange = () => {
      setServiceStyle(getServiceStyle())
      setServiceGrouping(getServiceGrouping())
    }
    window.addEventListener('foundlio-theme-change', handleThemeChange)
    return () => window.removeEventListener('foundlio-theme-change', handleThemeChange)
  }, [])

  // Filter services if category specified
  const services = categorySlug
    ? allServices.filter(s => s.category === categorySlug)
    : limit
      ? allServices.slice(0, limit)
      : allServices

  // Determine optimal grid columns based on service count (minimize empty space)
  const getGridCols = (count: number, style: ServiceStyle) => {
    if (style === 'list') return 'lg:grid-cols-1'
    if (style === 'compact') return 'lg:grid-cols-4 xl:grid-cols-5'
    if (style === 'minimal') return 'lg:grid-cols-4 xl:grid-cols-6'
    if (style === 'image-cards' || style === 'image-overlap' || style === 'image-hover') return 'lg:grid-cols-3'

    // Cards style - adaptive
    if (count === 1) return 'lg:grid-cols-1'
    if (count === 2) return 'lg:grid-cols-2'
    if (count === 3) return 'lg:grid-cols-3'
    if (count === 4) return 'lg:grid-cols-4'
    if (count === 5) return 'lg:grid-cols-3'
    if (count === 6) return 'lg:grid-cols-3'
    if (count === 7) return 'lg:grid-cols-4'
    if (count === 8) return 'lg:grid-cols-4'
    if (count === 9) return 'lg:grid-cols-3'
    if (count === 10) return 'lg:grid-cols-5'
    if (count === 12) return 'lg:grid-cols-4'
    return 'lg:grid-cols-3'
  }

  const effects = useVisualEffects()
  const hasGradientIcons = effects.gradientStyle !== 'none'

  // Auto-detect: if services have images, upgrade to image variant; if not, downgrade
  const hasImages = allServices.some(s => s.image)
  const resolveStyle = (style: ServiceStyle): ServiceStyle => {
    if (hasImages) {
      // Upgrade icon styles to image equivalents
      if (style === 'cards') return 'image-cards'
    } else {
      // Downgrade image styles to icon equivalents
      if (style === 'image-cards' || style === 'image-overlap' || style === 'image-hover') return 'cards'
    }
    return style
  }

  // Use 'cards' during SSR to avoid hydration mismatch
  const currentStyle = mounted ? resolveStyle(serviceStyle) : 'cards'
  const currentGrouping = mounted ? (forceGrouped ? 'grouped' : serviceGrouping) : 'flat'

  // Icon background class based on gradient effects
  const iconBgClass = hasGradientIcons
    ? 'bg-gradient-to-br from-[hsl(var(--gradient-from)/0.1)] to-[hsl(var(--gradient-to)/0.1)] group-hover:from-[hsl(var(--gradient-from)/0.2)] group-hover:to-[hsl(var(--gradient-to)/0.2)]'
    : 'bg-primary/10 group-hover:bg-primary'
  const iconColorClass = hasGradientIcons
    ? 'text-primary group-hover:text-primary'
    : 'text-primary group-hover:text-white'

  // Render service item based on style
  const renderService = (service: Service, index: number) => {
    const Icon = iconMap[service.icon] || Wrench

    // List style - horizontal layout
    if (currentStyle === 'list') {
      return (
        <motion.div
          key={service.slug}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <Link href={`/services/${service.slug}`}>
            <Card hover className="group">
              <div className="flex items-center gap-6 p-4">
                <div className="flex-shrink-0 inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl group-hover:bg-primary transition-colors">
                  <Icon className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    {service.emergency && (
                      <Badge variant="orange" size="sm">Same Day</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {service.shortDescription}
                  </p>
                </div>
                <ArrowRight className="flex-shrink-0 h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Card>
          </Link>
        </motion.div>
      )
    }

    // Compact style - smaller cards
    if (currentStyle === 'compact') {
      return (
        <motion.div
          key={service.slug}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Link href={`/services/${service.slug}`}>
            <Card hover className="h-full group" padding="sm">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg group-hover:bg-primary transition-colors mb-3">
                  <Icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                  {service.name}
                </h3>
              </div>
            </Card>
          </Link>
        </motion.div>
      )
    }

    // Minimal style - icons only with hover
    if (currentStyle === 'minimal') {
      return (
        <motion.div
          key={service.slug}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: index * 0.03 }}
        >
          <Link href={`/services/${service.slug}`} className="group block text-center p-4 rounded-xl hover:bg-card hover:shadow-md transition-all">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full group-hover:bg-primary transition-colors mb-2">
              <Icon className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
              {service.name}
            </h3>
          </Link>
        </motion.div>
      )
    }

    // Image Cards - card with image on top, content below
    if (currentStyle === 'image-cards') {
      return (
        <motion.div
          key={service.slug}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Link href={`/services/${service.slug}`}>
            <Card hover className="h-full group overflow-hidden">
              <div className="aspect-[16/10] bg-muted-foreground/10 relative">
                <div className="w-full h-full flex items-center justify-center">
                  <Icon className="h-12 w-12 text-muted-foreground/30" />
                </div>
                {service.image && (
                  <img src={service.image} alt={service.name} className="absolute inset-0 w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                )}
                {service.emergency && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="orange" size="sm">Same Day</Badge>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {service.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {service.shortDescription}
                </p>
                <div className="flex items-center text-primary font-medium text-sm">
                  Learn More
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>
      )
    }

    // Image Overlap - image with overlapping content card
    if (currentStyle === 'image-overlap') {
      return (
        <motion.div
          key={service.slug}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Link href={`/services/${service.slug}`} className="group block">
            <div className="relative">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted-foreground/10 relative">
                <div className="w-full h-full flex items-center justify-center">
                  <Icon className="h-14 w-14 text-muted-foreground/30" />
                </div>
                {service.image && (
                  <img src={service.image} alt={service.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                )}
              </div>
              <div className="mx-4 -mt-8 relative z-10">
                <Card className="p-4 shadow-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-lg font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                        {service.shortDescription}
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                      <ArrowRight className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  {service.emergency && (
                    <div className="mt-3">
                      <Badge variant="orange" size="sm">Same Day</Badge>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </Link>
        </motion.div>
      )
    }

    // Image Hover - image revealed on hover, icon default
    if (currentStyle === 'image-hover') {
      return (
        <motion.div
          key={service.slug}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Link href={`/services/${service.slug}`}>
            <Card hover className="h-full group overflow-hidden relative">
              <div className="aspect-[4/3] bg-muted-foreground/10 relative overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <Icon className="h-14 w-14 text-muted-foreground/30" />
                </div>
                {service.image && (
                  <img src={service.image} alt={service.name} className="absolute inset-0 w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white/90 text-sm line-clamp-2">
                    {service.shortDescription}
                  </p>
                  <div className="flex items-center text-white font-medium text-sm mt-2">
                    Learn More
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  {service.emergency && (
                    <Badge variant="orange" size="sm">Same Day</Badge>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>
      )
    }

    // Default: Cards style
    return (
      <motion.div
        key={service.slug}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
      >
        <Link href={`/services/${service.slug}`}>
          <Card hover className="h-full group">
            <div className="p-4 pb-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl transition-colors ${iconBgClass}`}>
                  <Icon className={`h-7 w-7 transition-colors ${iconColorClass}`} />
                </div>
                {service.emergency && (
                  <Badge variant="orange" size="sm">Same Day</Badge>
                )}
              </div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {service.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {service.shortDescription}
              </p>
              <div className="flex items-center text-primary font-medium">
                Learn More
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Card>
        </Link>
      </motion.div>
    )
  }

  // Render category header
  const renderCategoryHeader = (category: Category, index: number) => {
    const Icon = iconMap[category.icon] || Wrench

    return (
      <motion.div
        key={`header-${category.slug}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="col-span-full"
      >
        <Link
          href={`/services/${category.slug}`}
          className="group flex items-center gap-4 mb-6 mt-8 first:mt-0"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl group-hover:bg-primary transition-colors">
            <Icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
          </div>
          <div>
            <h3 className="text-2xl font-heading font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
              {category.name}
              <ChevronRight className="h-5 w-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </h3>
            {category.description && (
              <p className="text-muted-foreground text-sm mt-1">{category.description}</p>
            )}
          </div>
        </Link>
      </motion.div>
    )
  }

  // Grouped rendering
  const renderGroupedServices = () => {
    return (
      <div className="space-y-8">
        {groupedServices.map((group, groupIndex) => (
          <div key={group.category.slug}>
            {renderCategoryHeader(group.category, groupIndex)}
            <div className={`grid ${currentStyle === 'list' ? '' : 'sm:grid-cols-2'} ${getGridCols(group.services.length, currentStyle)} gap-6`}>
              {group.services.map((service, index) => renderService(service, index))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Flat rendering
  const renderFlatServices = () => {
    return (
      <>
        <div className={`grid ${currentStyle === 'list' ? '' : 'sm:grid-cols-2'} ${getGridCols(services.length, currentStyle)} gap-6`}>
          {services.map((service, index) => renderService(service, index))}
        </div>

        {limit && limit < allServices.length && (
          <div className="text-center mt-10">
            <Link
              href="/services"
              className="inline-flex items-center px-6 py-3 bg-card text-foreground font-medium rounded-lg border border-border hover:bg-muted transition-colors"
            >
              View All Services
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        )}
      </>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-muted">
      <Container>
        {showTitle && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-foreground mb-4">
              {servicesContent.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {servicesContent.subtitle}
            </p>
          </div>
        )}

        {currentGrouping === 'grouped' && !categorySlug ? renderGroupedServices() : renderFlatServices()}
      </Container>
    </section>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, MapPin, ArrowUpRight, Eye } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Container from '@/components/ui/Container'
import Badge from '@/components/ui/Badge'
import worksData from '@/data/works.json'
import businessData from '@/data/business.json'
import themeData from '@/data/theme.json'
import { getWorksSectionContent } from '@/lib/content'
import { useContentSwap, useVerticalWorks } from '@/lib/useVerticalContent'

const worksContent = getWorksSectionContent()

type GalleryStyle = 'cards' | 'masonry' | 'showcase' | 'minimal'

// Check if works data is the default template data with no real images
function isDefaultWorksData(): boolean {
  const projects = (worksData as any).projects || []
  if (projects.length === 0) return true
  // If any project has a real image URL (external or non-placeholder), show the section
  const hasRealImages = projects.some((p: any) => {
    const img = p.featuredImage || ''
    return img.startsWith('http') || (img && !img.includes('/works/'))
  })
  if (hasRealImages) return false
  return true
}

function useGalleryStyle(): GalleryStyle {
  const [style, setStyle] = useState<GalleryStyle>(
    ((themeData as any).galleryStyle as GalleryStyle) || 'cards'
  )

  useEffect(() => {
    const readStyle = () => {
      try {
        const saved = localStorage.getItem('foundlio-design')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.galleryStyle) {
            setStyle(parsed.galleryStyle as GalleryStyle)
            return
          }
        }
      } catch {}
      setStyle(((themeData as any).galleryStyle as GalleryStyle) || 'cards')
    }
    readStyle()
    window.addEventListener('foundlio-theme-change', readStyle)
    return () => window.removeEventListener('foundlio-theme-change', readStyle)
  }, [])

  return style
}

// Category-based hue offsets for placeholder variety
function getCategoryHue(category: string): number {
  let hash = 0
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 360
}

interface PlaceholderCardProps {
  title: string
  category: string
  aspectClass?: string
  imageSrc?: string
}

function PlaceholderImage({ title, category, aspectClass = 'aspect-[4/3]', imageSrc }: PlaceholderCardProps) {
  const hue = getCategoryHue(category)
  const isExternal = imageSrc && (imageSrc.startsWith('http://') || imageSrc.startsWith('https://'))
  const hasImage = imageSrc && (isExternal || !imageSrc.includes('/works/'))

  return (
    <div
      className={`relative ${aspectClass} overflow-hidden`}
      style={{
        background: `linear-gradient(135deg, hsl(${hue}, 40%, 88%) 0%, hsl(${(hue + 30) % 360}, 35%, 82%) 50%, hsl(${(hue + 60) % 360}, 30%, 78%) 100%)`
      }}
    >
      {hasImage ? (
        <Image
          src={imageSrc!}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-7xl font-heading font-bold"
            style={{ color: `hsl(${hue}, 25%, 70%)` }}
          >
            {title.charAt(0)}
          </span>
        </div>
      )}
    </div>
  )
}

interface WorksGalleryProps {
  limit?: number
  showFilters?: boolean
  showTitle?: boolean
}

export default function WorksGallery({ limit, showFilters = false, showTitle = true }: WorksGalleryProps) {
  const [activeCategory, setActiveCategory] = useState('All')
  const galleryStyle = useGalleryStyle()
  const swap = useContentSwap()
  const verticalWorks = useVerticalWorks()

  // Use vertical override works if available, else deployed data
  const activeWorksData = verticalWorks || worksData
  const projects: typeof worksData.projects = (activeWorksData as any).projects || []
  const categories: string[] = (activeWorksData as any).categories || []

  // On the dedicated /works page (showFilters=true), always render even with default data.
  // On homepage (showFilters=false), hide if no vertical override and data is default.
  if (!showFilters && !verticalWorks && isDefaultWorksData()) return null

  const filteredProjects = projects.filter(project =>
    activeCategory === 'All' || project.category === activeCategory
  )

  const displayProjects = limit ? filteredProjects.slice(0, limit) : filteredProjects

  // Shared category filter bar
  const FilterBar = () => (
    <div className="flex flex-wrap justify-center gap-2 mb-10">
      {categories.map((category: string) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            activeCategory === category
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )

  // Shared "View All" link
  const ViewAllLink = () => {
    if (!limit || limit >= projects.length) return null
    return (
      <div className="text-center mt-12">
        <Link
          href="/works"
          className="inline-flex items-center px-6 py-3 bg-slate-900 text-white font-medium rounded-full hover:bg-slate-800 transition-colors"
        >
          View All Projects
          <ArrowRight className="h-5 w-5 ml-2" />
        </Link>
      </div>
    )
  }

  // --- VARIANT: Cards (default) ---
  const getGridCols = (count: number) => {
    if (count === 1) return 'lg:grid-cols-1'
    if (count === 2) return 'lg:grid-cols-2'
    if (count <= 3) return 'lg:grid-cols-3'
    if (count === 4) return 'lg:grid-cols-2'
    if (count <= 6) return 'lg:grid-cols-3'
    if (count <= 8) return 'lg:grid-cols-4'
    if (count === 9) return 'lg:grid-cols-3'
    return 'lg:grid-cols-4'
  }

  const renderCards = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`grid md:grid-cols-2 ${getGridCols(displayProjects.length)} gap-6`}
      >
        {displayProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link href={`/works/${project.slug}`} className="group block">
              <div className="relative overflow-hidden rounded-2xl">
                <PlaceholderImage title={project.title} category={project.category} imageSrc={project.featuredImage} />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <Badge
                    variant="white"
                    size="sm"
                    className="self-start mb-3 bg-white/90 backdrop-blur-sm"
                  >
                    {project.category}
                  </Badge>
                  <h3 className="text-xl font-heading font-semibold text-white mb-2 group-hover:text-primary-foreground/80 transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center text-white/80 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    {project.location}
                  </div>
                </div>

                {/* Hover arrow */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <ArrowUpRight className="h-5 w-5 text-slate-900" />
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 flex flex-wrap gap-4">
                {Object.entries(project.stats).slice(0, 3).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-lg font-heading font-semibold text-slate-900">{value}</div>
                    <div className="text-xs text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                  </div>
                ))}
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  )

  // --- VARIANT: Masonry ---
  // First featured project spans 2 cols + full height, rest fill grid
  const renderMasonry = () => {
    const featured = displayProjects.find((p: any) => p.featured) || displayProjects[0]
    const rest = displayProjects.filter(p => p.id !== featured?.id)

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Featured large card */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="md:col-span-2 md:row-span-2"
            >
              <Link href={`/works/${featured.slug}`} className="group block h-full">
                <div className="relative overflow-hidden rounded-2xl h-full min-h-[300px] md:min-h-[400px] ring-2 ring-primary/20 md:ring-0">
                  {featured.featuredImage && (featured.featuredImage.startsWith('http') || !featured.featuredImage.includes('/works/')) ? (
                    <Image
                      src={featured.featuredImage}
                      alt={featured.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 66vw"
                    />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, hsl(${getCategoryHue(featured.category)}, 40%, 88%) 0%, hsl(${(getCategoryHue(featured.category) + 40) % 360}, 35%, 80%) 100%)`
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className="text-[80px] md:text-[120px] font-heading font-bold"
                          style={{ color: `hsl(${getCategoryHue(featured.category)}, 25%, 72%)` }}
                        >
                          {featured.title.charAt(0)}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  <div className="absolute top-4 left-4 md:hidden">
                    <Badge variant="white" size="sm" className="bg-white/90 backdrop-blur-sm">
                      <Eye className="h-3 w-3 mr-1 inline" />Featured
                    </Badge>
                  </div>
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                    <Badge variant="white" size="sm" className="self-start mb-3 bg-white/90 backdrop-blur-sm">
                      {featured.category}
                    </Badge>
                    <h3 className="text-2xl lg:text-3xl font-heading font-semibold text-white mb-2">
                      {featured.title}
                    </h3>
                    <p className="text-white/70 text-sm mb-3 line-clamp-2 max-w-lg">
                      {featured.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center text-white/80 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {featured.location}
                      </div>
                      {Object.entries(featured.stats).slice(0, 2).map(([key, value]) => (
                        <div key={key} className="text-white/80 text-sm">
                          <span className="font-semibold text-white">{value}</span>{' '}
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <ArrowUpRight className="h-5 w-5 text-slate-900" />
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Remaining smaller cards */}
          {rest.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: (index + 1) * 0.1 }}
            >
              <Link href={`/works/${project.slug}`} className="group block">
                <div className="relative overflow-hidden rounded-2xl">
                  <PlaceholderImage title={project.title} category={project.category} imageSrc={project.featuredImage} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <Badge variant="white" size="sm" className="self-start mb-2 bg-white/90 backdrop-blur-sm">
                      {project.category}
                    </Badge>
                    <h3 className="text-lg font-heading font-semibold text-white mb-1">
                      {project.title}
                    </h3>
                    <div className="flex items-center text-white/80 text-sm">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      {project.location}
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <ArrowUpRight className="h-4 w-4 text-slate-900" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    )
  }

  // --- VARIANT: Showcase ---
  // Full-width hero card (horizontal), then 3-col grid below
  const renderShowcase = () => {
    const featured = displayProjects.find((p: any) => p.featured) || displayProjects[0]
    const rest = displayProjects.filter(p => p.id !== featured?.id)

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Featured hero card - horizontal */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={`/works/${featured.slug}`} className="group block">
                <div className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-slate-300 transition-colors">
                  {/* Image */}
                  <div className="relative">
                    <PlaceholderImage title={featured.title} category={featured.category} aspectClass="aspect-[4/3] md:aspect-auto md:h-full md:min-h-[320px]" imageSrc={featured.featuredImage} />
                    <div className="absolute top-4 left-4">
                      <Badge variant="white" size="sm" className="bg-white/90 backdrop-blur-sm">
                        Featured
                      </Badge>
                    </div>
                  </div>
                  {/* Details */}
                  <div className="p-8 flex flex-col justify-center">
                    <Badge variant="blue" size="sm" className="self-start mb-4">
                      {featured.category}
                    </Badge>
                    <h3 className="text-2xl lg:text-3xl font-heading font-semibold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                      {featured.title}
                    </h3>
                    <p className="text-slate-600 mb-4 line-clamp-3">
                      {featured.description}
                    </p>
                    <div className="flex items-center text-slate-500 text-sm mb-6">
                      <MapPin className="h-4 w-4 mr-1" />
                      {featured.location}
                    </div>
                    {/* Stats row */}
                    <div className="flex flex-wrap gap-6 pt-4 border-t border-slate-100">
                      {Object.entries(featured.stats).slice(0, 3).map(([key, value]) => (
                        <div key={key}>
                          <div className="text-lg font-heading font-semibold text-slate-900">{value}</div>
                          <div className="text-xs text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Remaining in 3-col grid */}
          {rest.length > 0 && (
            <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6`}>
              {rest.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: (index + 1) * 0.1 }}
                >
                  <Link href={`/works/${project.slug}`} className="group block">
                    <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-slate-300 transition-colors">
                      <div className="relative">
                        <PlaceholderImage title={project.title} category={project.category} imageSrc={project.featuredImage} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          <ArrowUpRight className="h-4 w-4 text-slate-900" />
                        </div>
                      </div>
                      <div className="p-5">
                        <Badge variant="blue" size="sm" className="mb-3">
                          {project.category}
                        </Badge>
                        <h3 className="text-lg font-heading font-semibold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <div className="flex items-center text-slate-500 text-sm mb-3">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {project.location}
                        </div>
                        <div className="flex flex-wrap gap-4 pt-3 border-t border-slate-100">
                          {Object.entries(project.stats).slice(0, 3).map(([key, value]) => (
                            <div key={key} className="text-center">
                              <div className="text-sm font-heading font-semibold text-slate-900">{value}</div>
                              <div className="text-[10px] text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    )
  }

  // --- VARIANT: Minimal ---
  // Horizontal list rows: thumbnail left, details right
  const renderMinimal = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {displayProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Link href={`/works/${project.slug}`} className="group block">
              <div className="flex gap-5 p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50 transition-all">
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-20 h-20 sm:w-28 sm:h-28 rounded-lg overflow-hidden">
                  <PlaceholderImage title={project.title} category={project.category} aspectClass="h-full" imageSrc={project.featuredImage} />
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="blue" size="sm">
                      {project.category}
                    </Badge>
                    <span className="text-xs text-slate-400 flex items-center">
                      <MapPin className="h-3 w-3 mr-0.5" />
                      {project.location}
                    </span>
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-slate-900 mb-1 group-hover:text-primary transition-colors truncate">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-1 mb-2 hidden sm:block">
                    {project.description}
                  </p>
                  {/* Stats inline */}
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(project.stats).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">{value}</span>{' '}
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Arrow */}
                <div className="flex-shrink-0 flex items-center">
                  <div className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:border-slate-900 transition-colors">
                    <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  )

  const renderGallery = () => {
    switch (galleryStyle) {
      case 'masonry': return renderMasonry()
      case 'showcase': return renderShowcase()
      case 'minimal': return renderMinimal()
      case 'cards':
      default: return renderCards()
    }
  }

  return (
    <section className={`${showTitle ? 'py-16 md:py-24' : 'no-auto-padding pt-2 md:pt-4 pb-16 md:pb-24'} bg-background`}>
      <Container>
        {showTitle && (
          <div className="text-center mb-12">
            <Badge variant="blue" className="mb-4">{worksContent.badgeText}</Badge>
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-foreground mb-4">
              {swap(worksContent.title)}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {swap(worksContent.subtitle)}
            </p>
          </div>
        )}

        {showFilters && <FilterBar />}

        {renderGallery()}

        <ViewAllLink />
      </Container>
    </section>
  )
}

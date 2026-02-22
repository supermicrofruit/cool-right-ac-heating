'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Phone, Menu, X, ChevronDown, Clock, MapPin, Award, ArrowRight,
  Wrench, AirVent, Settings, Flame, Home, Wind, Sparkles, AlertCircle,
  Truck, Building, Star, Hammer,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import businessData from '@/data/business.json'
import servicesData from '@/data/services.json'
import themeData from '@/data/theme.json'
import LogoMark from '@/components/ui/LogoMark'
import DarkModeToggle from '@/components/ui/DarkModeToggle'
import { getServicesGroupedByCategory } from '@/lib/services'
import {
  type HeaderStyle,
  type HeroStyle,
  shouldUseLightText,
  shouldBeTransparent,
} from '@/lib/headerHeroConfig'
import { getVisualEffects, type VisualEffectsConfig } from '@/lib/gradientPresets'
import { useDesignFeatures, type DesignFeatures } from '@/lib/useDesignFeatures'
import { useVerticalServices } from '@/lib/useVerticalContent'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench, AirVent, Settings, Flame, Home, Wind, Sparkles, AlertCircle,
  Truck, Building, Star, Hammer,
}

const defaultServiceGroups = getServicesGroupedByCategory()
// Mutable reference updated by Header component when vertical changes
let serviceGroups = defaultServiceGroups

// Format business hours for display in header
function getFormattedHours(): string {
  const hours = (businessData as any).hours
  if (!hours) return 'Mon-Sat 7am-7pm'
  const weekdays = hours.weekdays || '7:00 AM - 7:00 PM'
  const saturday = hours.saturday || ''
  const sunday = hours.sunday || ''
  // If Saturday is closed or same as weekdays, show Mon-Fri + hours
  if (!saturday || saturday === 'Closed') {
    return `Mon-Fri ${weekdays}`
  }
  if (sunday && sunday !== 'Closed' && sunday !== 'Emergency Only') {
    return `Mon-Sun ${weekdays}`
  }
  return `Mon-Sat ${weekdays}`
}

const formattedHours = getFormattedHours()

// =============================================================================
// Configuration & Navigation Building
// =============================================================================

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

function getHeroStyle(): HeroStyle {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('foundlio-design')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.heroStyle && ['split', 'split-form', 'fullwidth', 'compact', 'diagonal', 'mosaic', 'branded'].includes(parsed.heroStyle)) {
          return parsed.heroStyle as HeroStyle
        }
      }
    } catch {
      // Ignore
    }
  }
  return ((themeData as Record<string, unknown>).heroStyle as HeroStyle) || 'split'
}

// Build navigation dynamically based on feature flags
function buildNavigation(features: DesignFeatures) {
  const moreSubmenu = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]
  if (features.showBlog) moreSubmenu.push({ name: 'Blog', href: '/blog' })
  if (features.showFinancing) moreSubmenu.splice(1, 0, { name: 'Financing', href: '/financing' })

  const nav: { name: string; href: string; submenu?: { name: string; href: string }[]; megaMenu?: boolean }[] = [
    { name: 'Services', href: '/services', megaMenu: true },
    { name: 'Service Areas', href: '/areas' },
  ]

  if (features.showWorks) nav.push({ name: 'Our Work', href: '/works' })
  nav.push({ name: 'More', href: '#', submenu: moreSubmenu })

  return nav
}

// Build mobile navigation (flattened)
function buildMobileNavigation(features: DesignFeatures) {
  const nav: { name: string; href: string; megaMenu?: boolean }[] = [
    { name: 'Services', href: '/services', megaMenu: true },
    { name: 'Service Areas', href: '/areas' },
    { name: 'About', href: '/about' },
  ]

  if (features.showWorks) nav.push({ name: 'Our Work', href: '/works' })
  if (features.showFinancing) nav.push({ name: 'Financing', href: '/financing' })
  if (features.showBlog) nav.push({ name: 'Blog', href: '/blog' })
  nav.push({ name: 'Contact', href: '/contact' })

  return nav
}

// =============================================================================
// Shared Components
// =============================================================================

interface NavLinksProps {
  isLightText: boolean
  centered?: boolean
  navigation: ReturnType<typeof buildNavigation>
}

function NavLinks({ isLightText, centered = false, navigation }: NavLinksProps) {
  const textColor = isLightText ? 'rgba(255,255,255,0.9)' : '#374151'
  const hoverBg = isLightText ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'

  return (
    <nav className={`hidden lg:flex items-center gap-1 ${centered ? 'justify-center' : ''}`}>
      {navigation.map((item) => {
        const isClickItem = item.href === '#'
        const hasMegaMenu = item.megaMenu
        const hasSubmenu = item.submenu

        return (
          <div key={item.name} className="relative group">
            {(hasMegaMenu || hasSubmenu) ? (
              <>
                {isClickItem ? (
                  <button
                    className="inline-flex items-center px-4 py-2 text-base font-medium rounded-lg transition-colors"
                    style={{ color: textColor }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverBg}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {item.name}
                    <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="inline-flex items-center px-4 py-2 text-base font-medium rounded-lg transition-colors"
                    style={{ color: textColor }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverBg}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {item.name}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Link>
                )}

                {/* Services Mega Menu */}
                {hasMegaMenu && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 transition-all duration-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                    <div className="bg-popover rounded-xl shadow-md border border-border p-3 min-w-[720px]">
                      <div className={`grid gap-6`} style={{ gridTemplateColumns: `repeat(${serviceGroups.length}, minmax(0, 1fr))` }}>
                        {serviceGroups.map((group) => {
                          const CatIcon = iconMap[group.category.icon] || Sparkles
                          return (
                            <div key={group.category.slug}>
                              <div className="flex items-center gap-2 mb-2 px-3 pb-2 border-b border-border">
                                <CatIcon className="h-4 w-4 text-primary" />
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                  {group.category.shortName || group.category.name}
                                </span>
                              </div>
                              <div className="space-y-0.5">
                                {group.services.map((service) => {
                                  const SvcIcon = iconMap[service.icon] || Sparkles
                                  return (
                                    <Link
                                      key={service.slug}
                                      href={`/services/${service.slug}`}
                                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-base text-popover-foreground hover:bg-gray-200 transition-colors group/item cursor-pointer"
                                    >
                                      <SvcIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover/item:text-primary transition-colors" />
                                      <span>{service.name}</span>
                                    </Link>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <div className="mt-3 pt-3 border-t border-border px-3">
                        <Link
                          href="/services"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                        >
                          View All Services
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Regular dropdown (More menu) */}
                {hasSubmenu && !hasMegaMenu && (
                  <div className="absolute left-0 top-full pt-1 transition-all duration-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                    <div className="bg-popover rounded-xl shadow-md border border-border p-2 min-w-[200px]">
                      {item.submenu!.map((subitem) => (
                        <Link
                          key={subitem.name}
                          href={subitem.href}
                          className="block px-4 py-2.5 text-base text-popover-foreground rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                className="inline-flex items-center px-4 py-2 text-base font-medium rounded-lg transition-colors"
                style={{ color: textColor }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverBg}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {item.name}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}

interface PhoneCTAProps {
  isLightText: boolean
  showCTA?: boolean
  size?: 'normal' | 'large'
  useGradient?: boolean
}

function PhoneCTA({ isLightText, showCTA = true, size = 'normal', useGradient = false }: PhoneCTAProps) {
  const isLarge = size === 'large'
  const showGradient = useGradient && !isLightText

  return (
    <div className="flex items-center gap-3 md:gap-4">
      <DarkModeToggle className="hidden md:flex" />
      <a
        href={`tel:${businessData.phoneRaw}`}
        className="flex items-center gap-2 transition-colors"
        style={{ color: isLightText ? 'rgba(255,255,255,0.95)' : '#374151' }}
      >
        <div
          className={`${isLarge ? 'w-11 h-11' : 'w-9 h-9'} rounded-full flex items-center justify-center transition-all`}
          style={{
            backgroundColor: isLightText ? 'rgba(255,255,255,0.15)' : 'hsl(var(--primary) / 0.1)',
            backdropFilter: isLightText ? 'blur(8px)' : 'none',
          }}
        >
          <Phone
            className={isLarge ? 'h-5 w-5' : 'h-4 w-4'}
            style={{ color: isLightText ? 'white' : 'hsl(var(--primary))' }}
          />
        </div>
        <span className={`font-bold ${isLarge ? 'text-lg' : 'text-base'}`}>
          {businessData.phone}
        </span>
      </a>

      {showCTA && (
        <Link
          href="/contact"
          className={`hidden md:inline-flex items-center font-semibold rounded-lg transition-all shadow-lg px-5 py-2.5 text-sm ${
            showGradient ? 'bg-gradient-theme text-white hover:opacity-90' : ''
          }`}
          style={showGradient ? {} : {
            backgroundColor: isLightText ? 'rgba(255,255,255,0.95)' : 'hsl(var(--primary))',
            color: isLightText ? 'hsl(var(--primary))' : 'white',
            boxShadow: isLightText ? '0 4px 16px rgba(0,0,0,0.2)' : 'hsl(var(--primary) / 0.25) 0 4px 12px',
          }}
        >
          Get Free Estimate
        </Link>
      )}
    </div>
  )
}

interface MobileMenuProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  mobileNavigation: ReturnType<typeof buildMobileNavigation>
}

function MobileMenu({ isOpen, setIsOpen, mobileNavigation }: MobileMenuProps) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const useGradient = getVisualEffects().gradientButtons

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden border-t border-gray-100 bg-white"
        >
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {mobileNavigation.map((item) => {
              const hasMegaMenu = item.megaMenu

              if (hasMegaMenu) {
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => setOpenSubmenu(openSubmenu === item.name ? null : item.name)}
                      className="flex items-center justify-between w-full px-4 py-3 text-gray-800 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                    >
                      {item.name}
                      <ChevronDown className={`h-4 w-4 transition-transform ${openSubmenu === item.name ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {openSubmenu === item.name && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-2 overflow-hidden"
                        >
                          {serviceGroups.map((group) => {
                            const CatIcon = iconMap[group.category.icon] || Sparkles
                            return (
                              <div key={group.category.slug} className="mb-2">
                                <div className="flex items-center gap-2 px-3 py-1.5">
                                  <CatIcon className="h-3.5 w-3.5 text-primary" />
                                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {group.category.shortName || group.category.name}
                                  </span>
                                </div>
                                {group.services.map((service) => {
                                  const SvcIcon = iconMap[service.icon] || Sparkles
                                  return (
                                    <Link
                                      key={service.slug}
                                      href={`/services/${service.slug}`}
                                      className="flex items-center gap-2 mx-1 px-3 py-1.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground rounded transition-colors"
                                      onClick={() => setIsOpen(false)}
                                    >
                                      <SvcIcon className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                                      <span>{service.name}</span>
                                    </Link>
                                  )
                                })}
                              </div>
                            )
                          })}
                          <Link
                            href="/services"
                            className="flex items-center gap-1.5 px-6 py-2 text-sm font-semibold text-primary"
                            onClick={() => setIsOpen(false)}
                          >
                            View All Services
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              }

              return (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-gray-800 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                </div>
              )
            })}

            <div className="pt-4 border-t border-gray-100">
              <a
                href={`tel:${businessData.phoneRaw}`}
                className={`flex items-center justify-center gap-2 w-full px-5 py-3.5 text-white font-semibold rounded-lg transition-colors ${
                  useGradient ? 'bg-gradient-theme hover:opacity-90' : 'bg-primary hover:bg-primary/90'
                }`}
              >
                <Phone className="h-5 w-5" />
                <span>{businessData.phone}</span>
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface HamburgerButtonProps {
  isOpen: boolean
  onClick: () => void
  isLightText: boolean
}

function HamburgerButton({ isOpen, onClick, isLightText }: HamburgerButtonProps) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
      style={{
        color: isLightText ? 'rgba(255,255,255,0.9)' : '#374151',
        backgroundColor: isLightText ? 'rgba(255,255,255,0.1)' : 'transparent',
      }}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </button>
  )
}

// Utility Bar component (used by trust-bar and centered)
interface UtilityBarProps {
  isScrolled: boolean
  isLightText: boolean
  isTransparent: boolean
  features: DesignFeatures
}

function UtilityBar({ isScrolled, isLightText, isTransparent, features }: UtilityBarProps) {
  const useLightText = isLightText && isTransparent && !isScrolled

  return (
    <div
      className="overflow-hidden transition-all duration-300"
      style={{
        height: isScrolled ? '0px' : '40px',
        opacity: isScrolled ? 0 : 1,
        backgroundColor: useLightText ? 'rgba(0,0,0,0.3)' : '#111827',
        backdropFilter: useLightText ? 'blur(8px)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full text-sm">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden sm:flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" style={{ color: 'hsl(var(--primary) / 0.5)' }} />
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>{formattedHours}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" style={{ color: 'hsl(var(--primary) / 0.5)' }} />
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>Serving {businessData.address.city} Metro</span>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden md:flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5" style={{ color: 'hsl(var(--primary) / 0.5)' }} />
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>{businessData.licenses?.[0] || 'Licensed & Insured'}</span>
            </div>
            {features.emergencyBadge && (
              <span className="text-yellow-400 font-medium">24/7 Emergency</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Header Variant: Standard
// Logo left → Nav → Phone + CTA
// =============================================================================

interface HeaderVariantProps {
  isScrolled: boolean
  isLightText: boolean
  isTransparent: boolean
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
  hasGradientHeader: boolean
  gradientStyle: VisualEffectsConfig['gradientStyle']
  gradientButtons: boolean
  navigation: ReturnType<typeof buildNavigation>
  mobileNavigation: ReturnType<typeof buildMobileNavigation>
  features: DesignFeatures
}

function HeaderStandard({
  isScrolled,
  isLightText,
  isTransparent,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  hasGradientHeader,
  gradientStyle,
  gradientButtons,
  navigation,
  mobileNavigation,
}: HeaderVariantProps) {
  // On dark hero (transparent mode), header has white container with rounded bottom corners
  const showRoundedContainer = isTransparent && !isScrolled
  // Gradient header: match hero bg at rest on homepage
  const gradientRest = hasGradientHeader && !isScrolled
  const gradientBg = gradientStyle === 'vibrant'
    ? 'linear-gradient(135deg, hsl(var(--gradient-from) / 0.1), hsl(var(--gradient-to) / 0.15))'
    : 'linear-gradient(135deg, hsl(var(--gradient-from) / 0.05), hsl(var(--gradient-to) / 0.08))'

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: 'transparent',
        padding: showRoundedContainer ? '0 12px 0 12px' : '0',
      }}
    >
      <div
        className="transition-all duration-300"
        style={{
          backgroundColor: showRoundedContainer ? 'transparent' : 'white',
          backgroundImage: gradientRest && !showRoundedContainer ? gradientBg : 'none',
          borderRadius: showRoundedContainer ? '0 0 1.5rem 1.5rem' : '0',
          boxShadow: showRoundedContainer
            ? '0 4px 20px rgba(0,0,0,0.15)'
            : isScrolled ? '0 1px 3px rgb(0 0 0 / 0.1)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex items-center justify-between transition-all duration-300"
            style={{ height: isScrolled ? '64px' : '72px' }}
          >
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <LogoMark isScrolled={isScrolled} />
            </Link>

            {/* Desktop Nav */}
            <NavLinks isLightText={false} navigation={navigation} />

            {/* Phone + CTA (desktop) */}
            <div className="hidden lg:flex">
              <PhoneCTA isLightText={false} useGradient={gradientButtons} />
            </div>

            {/* Mobile: Phone + Hamburger */}
            <div className="flex lg:hidden items-center gap-2">
              <a
                href={`tel:${businessData.phoneRaw}`}
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: 'hsl(var(--primary) / 0.1)',
                  color: 'hsl(var(--primary))',
                }}
              >
                <Phone className="h-5 w-5" />
              </a>
              <HamburgerButton isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} isLightText={false} />
            </div>
          </div>
        </div>
      </div>

      <MobileMenu isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} mobileNavigation={mobileNavigation} />
    </header>
  )
}

// =============================================================================
// Header Variant: Trust Bar
// Utility bar + Standard header
// =============================================================================

function HeaderTrustBar({
  isScrolled,
  isLightText,
  isTransparent,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  hasGradientHeader,
  gradientStyle,
  gradientButtons,
  navigation,
  mobileNavigation,
  features,
}: HeaderVariantProps) {
  // On dark hero (transparent mode), header has white container with rounded bottom corners
  const showRoundedContainer = isTransparent && !isScrolled
  // Gradient header: match hero bg at rest on homepage
  const gradientRest = hasGradientHeader && !isScrolled
  const gradientBg = gradientStyle === 'vibrant'
    ? 'linear-gradient(135deg, hsl(var(--gradient-from) / 0.1), hsl(var(--gradient-to) / 0.15))'
    : 'linear-gradient(135deg, hsl(var(--gradient-from) / 0.05), hsl(var(--gradient-to) / 0.08))'

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: 'transparent',
        padding: showRoundedContainer ? '0 12px 0 12px' : '0',
      }}
    >
      <div
        className="transition-all duration-300"
        style={{
          backgroundColor: showRoundedContainer ? 'transparent' : 'white',
          backgroundImage: gradientRest && !showRoundedContainer ? gradientBg : 'none',
          borderRadius: showRoundedContainer ? '0 0 1.5rem 1.5rem' : '0',
          boxShadow: showRoundedContainer
            ? '0 4px 20px rgba(0,0,0,0.15)'
            : isScrolled ? '0 1px 3px rgb(0 0 0 / 0.1)' : 'none',
        }}
      >
        {/* Utility Bar - inside the rounded container */}
        <div
          className="overflow-hidden transition-all duration-300"
          style={{
            height: isScrolled ? '0px' : '40px',
            opacity: isScrolled ? 0 : 1,
            backgroundColor: '#111827',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="flex items-center justify-between h-full text-sm">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="hidden sm:flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" style={{ color: 'hsl(var(--primary) / 0.5)' }} />
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{formattedHours}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" style={{ color: 'hsl(var(--primary) / 0.5)' }} />
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>Serving {businessData.address.city} Metro</span>
                </div>
              </div>
              <div className="flex items-center gap-4 md:gap-6">
                <div className="hidden md:flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5" style={{ color: 'hsl(var(--primary) / 0.5)' }} />
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{businessData.licenses?.[0] || 'Licensed & Insured'}</span>
                </div>
                {features.emergencyBadge && (
                  <span className="text-yellow-400 font-medium">24/7 Emergency</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex items-center justify-between transition-all duration-300"
            style={{ height: isScrolled ? '64px' : '72px' }}
          >
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <LogoMark isScrolled={isScrolled} />
            </Link>

            {/* Desktop Nav */}
            <NavLinks isLightText={false} navigation={navigation} />

            {/* Phone + CTA (desktop) */}
            <div className="hidden lg:flex">
              <PhoneCTA isLightText={false} useGradient={gradientButtons} />
            </div>

            {/* Mobile: Phone + Hamburger */}
            <div className="flex lg:hidden items-center gap-2">
              <a
                href={`tel:${businessData.phoneRaw}`}
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: 'hsl(var(--primary) / 0.1)',
                  color: 'hsl(var(--primary))',
                }}
              >
                <Phone className="h-5 w-5" />
              </a>
              <HamburgerButton isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} isLightText={false} />
            </div>
          </div>
        </div>
      </div>

      <MobileMenu isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} mobileNavigation={mobileNavigation} />
    </header>
  )
}

// =============================================================================
// Header Variant: Centered
// Trust bar + Centered logo + Nav below + Phone prominent
// =============================================================================

function HeaderCentered({
  isScrolled,
  isLightText,
  isTransparent,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  hasGradientHeader,
  gradientStyle,
  gradientButtons,
  navigation,
  mobileNavigation,
  features,
}: HeaderVariantProps) {
  // On dark hero (transparent mode), header is transparent with white text
  const isOverDarkHero = isTransparent && !isScrolled
  // Gradient header: match hero bg at rest on homepage
  const gradientRest = hasGradientHeader && !isScrolled
  const gradientBg = gradientStyle === 'vibrant'
    ? 'linear-gradient(135deg, hsl(var(--gradient-from) / 0.1), hsl(var(--gradient-to) / 0.15))'
    : 'linear-gradient(135deg, hsl(var(--gradient-from) / 0.05), hsl(var(--gradient-to) / 0.08))'

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: 'transparent',
        padding: '0',
      }}
    >
      <div
        className="transition-all duration-300"
        style={{
          backgroundColor: isOverDarkHero ? 'transparent' : 'white',
          backgroundImage: gradientRest && !isOverDarkHero ? gradientBg : 'none',
          borderRadius: '0',
          boxShadow: isOverDarkHero ? 'none'
            : isScrolled ? '0 1px 3px rgb(0 0 0 / 0.1)' : 'none',
        }}
      >
        {/* Utility Bar with Phone - inside the rounded container */}
        <div
          className="overflow-hidden transition-all duration-300"
          style={{
            height: isScrolled ? '0px' : '44px',
            opacity: isScrolled ? 0 : 1,
            backgroundColor: isOverDarkHero ? 'rgba(0,0,0,0.2)' : '#111827',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="flex items-center justify-between h-full text-sm">
              {/* Left: Hours + Area */}
              <div className="flex items-center gap-4 md:gap-6">
                <div className="hidden sm:flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" style={{ color: 'hsl(var(--primary) / 0.5)' }} />
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{formattedHours}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" style={{ color: 'hsl(var(--primary) / 0.5)' }} />
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>Serving {businessData.address.city} Metro</span>
                </div>
              </div>

              {/* Center/Right: Phone */}
              <a
                href={`tel:${businessData.phoneRaw}`}
                className="flex items-center gap-2 text-white font-bold hover:text-yellow-400 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>{businessData.phone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Header - Centered Logo */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logo Row */}
          <div
            className="flex items-center justify-between lg:justify-center transition-all duration-300 relative"
            style={{ height: isScrolled ? '56px' : '120px' }}
          >
            {/* Logo - left on mobile, centered on desktop */}
            <Link href="/" className="flex-shrink-0">
              <LogoMark isScrolled={isScrolled} size={isScrolled ? 'lg' : 'xl'} layout={isScrolled ? 'horizontal' : 'stacked'} variant={isOverDarkHero ? 'light' : 'dark'} />
            </Link>

            {/* Mobile: Phone + Hamburger - Right */}
            <div className="flex lg:hidden items-center gap-2">
              <a
                href={`tel:${businessData.phoneRaw}`}
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: isOverDarkHero ? 'rgba(255,255,255,0.15)' : 'hsl(var(--primary) / 0.1)',
                  color: isOverDarkHero ? 'white' : 'hsl(var(--primary))',
                }}
              >
                <Phone className="h-5 w-5" />
              </a>
              <HamburgerButton isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} isLightText={isOverDarkHero} />
            </div>
          </div>

          {/* Desktop Nav Row - Below Logo */}
          <div
            className="hidden lg:flex items-center justify-center border-t transition-all duration-300"
            style={{
              height: isScrolled ? '48px' : '56px',
              borderColor: isOverDarkHero ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)',
            }}
          >
            <div className="flex items-center gap-8">
              {/* Nav Links */}
              <NavLinks isLightText={isOverDarkHero} centered navigation={navigation} />

              {/* CTA Button */}
              <Link
                href="/contact"
                className={`inline-flex items-center font-semibold rounded-lg transition-all shadow-lg px-5 py-2 text-sm ${
                  isOverDarkHero
                    ? 'bg-white text-primary hover:bg-gray-100'
                    : gradientButtons ? 'bg-gradient-theme text-white hover:opacity-90' : 'bg-primary text-white'
                }`}
                style={{
                  boxShadow: isOverDarkHero
                    ? '0 4px 12px rgba(255,255,255,0.2)'
                    : 'hsl(var(--primary) / 0.25) 0 4px 12px',
                }}
              >
                Get Free Estimate
              </Link>
            </div>
          </div>
        </div>
      </div>

      <MobileMenu isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} mobileNavigation={mobileNavigation} />
    </header>
  )
}

// =============================================================================
// Header Variant: Floating
// Utility bar on top + floating rounded header with margin on all sides
// =============================================================================

function HeaderFloating({
  isScrolled,
  isLightText,
  isTransparent,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  hasGradientHeader,
  gradientStyle,
  gradientButtons,
  navigation,
  mobileNavigation,
  features,
}: HeaderVariantProps) {
  const useLightOnDark = isLightText && isTransparent && !isScrolled
  const gradientRest = hasGradientHeader && !isScrolled

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Utility Bar - full width at top */}
      <div
        className="overflow-hidden transition-all duration-300"
        style={{
          height: isScrolled ? '0px' : '40px',
          opacity: isScrolled ? 0 : 1,
          backgroundColor: useLightOnDark ? 'rgba(0,0,0,0.3)' : '#111827',
          backdropFilter: useLightOnDark ? 'blur(8px)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full text-sm">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="hidden sm:flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" style={{ color: 'hsl(var(--primary) / 0.5)' }} />
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>{formattedHours}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" style={{ color: 'hsl(var(--primary) / 0.5)' }} />
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Serving {businessData.address.city} Metro</span>
              </div>
            </div>
            <div className="flex items-center gap-4 md:gap-6">
              <div className="hidden md:flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5" style={{ color: 'hsl(var(--primary) / 0.5)' }} />
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>{businessData.licenses?.[0] || 'Licensed & Insured'}</span>
              </div>
              {features.emergencyBadge && (
                <span className="text-yellow-400 font-medium">24/7 Emergency</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating header container with margin */}
      <div
        className="transition-all duration-300"
        style={{
          padding: isScrolled ? '0 0' : '8px 16px',
        }}
      >
        <div
          className="transition-all duration-300 max-w-7xl mx-auto"
          style={{
            backgroundColor: useLightOnDark ? 'rgba(255,255,255,0.12)' : gradientRest ? 'rgba(255,255,255,0.7)' : 'white',
            backdropFilter: (useLightOnDark || gradientRest) ? 'blur(16px)' : 'none',
            borderRadius: isScrolled ? '0' : '1rem',
            boxShadow: useLightOnDark
              ? '0 4px 24px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.1)'
              : isScrolled
              ? '0 1px 3px rgb(0 0 0 / 0.1)'
              : '0 4px 24px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
            border: useLightOnDark ? '1px solid rgba(255,255,255,0.15)' : isScrolled ? 'none' : '1px solid rgba(0,0,0,0.04)',
          }}
        >
          <div className="px-4 sm:px-6 lg:px-8">
            <div
              className="flex items-center justify-between transition-all duration-300"
              style={{ height: isScrolled ? '64px' : '64px' }}
            >
              {/* Logo */}
              <Link href="/" className="flex-shrink-0">
                <LogoMark
                  isScrolled={isScrolled}
                  variant={useLightOnDark ? 'light' : 'dark'}
                />
              </Link>

              {/* Desktop Nav */}
              <NavLinks isLightText={useLightOnDark} navigation={navigation} />

              {/* Phone + CTA (desktop) */}
              <div className="hidden lg:flex">
                <PhoneCTA isLightText={useLightOnDark} useGradient={gradientButtons} />
              </div>

              {/* Mobile: Phone + Hamburger */}
              <div className="flex lg:hidden items-center gap-2">
                <a
                  href={`tel:${businessData.phoneRaw}`}
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: useLightOnDark ? 'rgba(255,255,255,0.15)' : 'hsl(var(--primary) / 0.1)',
                    color: useLightOnDark ? 'white' : 'hsl(var(--primary))',
                  }}
                >
                  <Phone className="h-5 w-5" />
                </a>
                <HamburgerButton isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} isLightText={useLightOnDark} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <MobileMenu isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} mobileNavigation={mobileNavigation} />
    </header>
  )
}

// =============================================================================
// Main Header Export
// =============================================================================

export default function Header() {
  const pathname = usePathname()
  const features = useDesignFeatures()
  const verticalServices = useVerticalServices()

  // Update module-level serviceGroups when vertical changes
  if (verticalServices) {
    const vs = verticalServices as any
    const cats = vs.categories || []
    const svcs = vs.services || []
    serviceGroups = cats.map((cat: any) => ({
      category: cat,
      services: svcs.filter((s: any) => s.category === cat.slug),
    })).filter((g: any) => g.services.length > 0)
  } else {
    serviceGroups = defaultServiceGroups
  }

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [headerStyle, setHeaderStyle] = useState<HeaderStyle>('standard')
  const [heroStyle, setHeroStyle] = useState<HeroStyle>('split')
  const [gradientStyle, setGradientStyle] = useState<VisualEffectsConfig['gradientStyle']>('none')
  const [gradientButtons, setGradientButtons] = useState(false)
  const [mounted, setMounted] = useState(false)

  const rafRef = useRef<number>(0)

  useEffect(() => {
    setMounted(true)
    setHeaderStyle(getHeaderStyle())
    setHeroStyle(getHeroStyle())
    const effects = getVisualEffects()
    setGradientStyle(effects.gradientStyle)
    setGradientButtons(effects.gradientButtons)

    const handleScroll = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 10)
        rafRef.current = 0
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    const handleThemeChange = () => {
      setHeaderStyle(getHeaderStyle())
      setHeroStyle(getHeroStyle())
      const eff = getVisualEffects()
      setGradientStyle(eff.gradientStyle)
      setGradientButtons(eff.gradientButtons)
    }
    window.addEventListener('foundlio-theme-change', handleThemeChange)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('foundlio-theme-change', handleThemeChange)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Escape key closes mobile menu
  useEffect(() => {
    if (!isMobileMenuOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMobileMenuOpen])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  // Only apply transparent/light text on homepage
  const isHomepage = pathname === '/'
  const isTransparent = mounted && isHomepage && shouldBeTransparent(headerStyle, heroStyle)
  const isLightText = mounted && isHomepage && shouldUseLightText(headerStyle, heroStyle, isScrolled)

  // Spacer height matches initial header height per variant
  // When transparent (homepage fullwidth hero), no spacer — hero goes behind header
  function getSpacerHeight(style: HeaderStyle): string {
    switch (style) {
      case 'trust-bar': return '112px'   // 40px utility + 72px header
      case 'centered': return '220px'    // 44px utility + 120px logo + 56px nav
      case 'floating': return '120px'    // 40px utility + 8px pad + 64px header + 8px pad
      case 'standard':
      default: return '72px'
    }
  }

  // SSR fallback — render correct variant based on theme.json default
  if (!mounted) {
    const ssrStyle = ((themeData as Record<string, unknown>).headerStyle as HeaderStyle) || 'standard'
    const ssrFeatures = features
    const ssrProps = {
      isScrolled: false,
      isLightText: false,
      isTransparent: false,
      isMobileMenuOpen: false,
      setIsMobileMenuOpen: () => {},
      hasGradientHeader: false,
      gradientStyle: 'none' as const,
      gradientButtons: false,
      navigation: buildNavigation(ssrFeatures),
      mobileNavigation: buildMobileNavigation(ssrFeatures),
      features: ssrFeatures,
    }
    let headerEl: React.ReactNode
    switch (ssrStyle) {
      case 'trust-bar':
        headerEl = <HeaderTrustBar {...ssrProps} />; break
      case 'centered':
        headerEl = <HeaderCentered {...ssrProps} />; break
      case 'floating':
        headerEl = <HeaderFloating {...ssrProps} />; break
      case 'standard':
      default:
        headerEl = <HeaderStandard {...ssrProps} />
    }
    // Skip spacer when header is transparent on homepage
    // Floating header always transparent; others only on dark heroes
    const ssrHeroStyle = ((themeData as Record<string, unknown>).heroStyle as string) || 'split'
    const isDarkHero = ['fullwidth', 'branded'].includes(ssrHeroStyle)
    const ssrSkipSpacer = isHomepage && (ssrStyle === 'floating' || isDarkHero)
    return (
      <>
        {headerEl}
        {!ssrSkipSpacer && <div style={{ height: getSpacerHeight(ssrStyle) }} />}
      </>
    )
  }

  const navigation = buildNavigation(features)
  const mobileNav = buildMobileNavigation(features)

  const props = {
    isScrolled,
    isLightText,
    isTransparent,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    hasGradientHeader: isHomepage && gradientStyle !== 'none' && heroStyle !== 'fullwidth',
    gradientStyle,
    gradientButtons,
    navigation,
    mobileNavigation: mobileNav,
    features,
  }

  let headerEl: React.ReactNode
  switch (headerStyle) {
    case 'trust-bar':
      headerEl = <HeaderTrustBar {...props} />; break
    case 'centered':
      headerEl = <HeaderCentered {...props} />; break
    case 'floating':
      headerEl = <HeaderFloating {...props} />; break
    case 'standard':
    default:
      headerEl = <HeaderStandard {...props} />
  }

  // Transparent header overlays the hero — skip spacer. Solid header needs spacer.
  const skipSpacer = isTransparent

  return (
    <>
      {headerEl}
      {!skipSpacer && <div style={{ height: getSpacerHeight(headerStyle) }} />}
    </>
  )
}

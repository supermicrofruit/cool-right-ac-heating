'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react'
import businessData from '@/data/business.json'
import servicesData from '@/data/services.json'
import areasData from '@/data/areas.json'
import LogoMark from '@/components/ui/LogoMark'
import { useVisualEffects } from '@/lib/gradientPresets'
import { useDesignFeatures, type DesignFeatures } from '@/lib/useDesignFeatures'
import { useVerticalBusinessName, useVerticalAreas, useVerticalServices, useContentSwap } from '@/lib/useVerticalContent'

type FooterVariant = 'standard' | 'minimal' | 'centered' | 'simple'

// Build company links based on feature flags
function buildCompanyLinks(features: DesignFeatures) {
  const links = [
    { name: 'About Us', href: '/about' },
  ]
  if (features.showWorks) links.push({ name: 'Our Work', href: '/works' })
  if (features.showFinancing) links.push({ name: 'Financing', href: '/financing' })
  links.push({ name: 'Emergency Tips', href: '/emergency-tips' })
  links.push({ name: 'Contact', href: '/contact' })
  if (features.showBlog) links.push({ name: 'Blog', href: '/blog' })
  return links
}

const staticFooterLinks = {
  services: servicesData.services.slice(0, 6).map(s => ({ name: s.name, href: `/services/${s.slug}` })),
  areas: areasData.areas.slice(0, 6).map(a => ({ name: a.name, href: `/areas/${a.slug}` })),
}

// Get footer variant from localStorage
function getFooterVariant(): FooterVariant {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('foundlio-design')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.footerStyle) return parsed.footerStyle
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
  return 'standard'
}

// Social media icon map
const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
}

function SocialLinks({ rounded }: { rounded?: boolean }) {
  const social = businessData.socialMedia || {}
  const entries = Object.entries(social).filter(([, url]) => url && url !== 'undefined' && String(url).startsWith('http'))
  if (entries.length === 0) return null
  return (
    <div className="flex items-center gap-3">
      {entries.map(([key, url]) => {
        const Icon = socialIcons[key]
        if (!Icon) return null
        return (
          <a
            key={key}
            href={String(url)}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 bg-white/10 ${rounded ? 'rounded-full' : 'rounded-lg'} text-white/70 hover:text-white hover:bg-white/20 transition-colors`}
            aria-label={key.charAt(0).toUpperCase() + key.slice(1)}
          >
            <Icon className={rounded ? 'h-5 w-5' : 'h-4 w-4'} />
          </a>
        )
      })}
    </div>
  )
}

type FooterLink = { name: string; href: string }

interface FooterVariantComponentProps {
  features: DesignFeatures
  companyName: string
  serviceLinks: FooterLink[]
  areaLinks: FooterLink[]
  swap: (text: string) => string
}

// Standard Footer - Full multi-column layout
function StandardFooter({ features, companyName, serviceLinks, areaLinks, swap }: FooterVariantComponentProps) {
  const footerLinks = { services: serviceLinks, areas: areaLinks, company: buildCompanyLinks(features) }
  return (
    <footer className="bg-[hsl(var(--footer-bg))] text-neutral-300 text-sm footer-standard">
      {/* Main Footer */}
      <div className="footer-main max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="footer-links-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Company Info */}
          <div className="footer-logo-section lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <LogoMark variant="light" />
            </Link>
            <p className="text-neutral-400 mb-5 max-w-md text-sm">
              {swap(businessData.description)}
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              <a
                href={`tel:${businessData.phoneRaw}`}
                className="flex items-center space-x-2 text-neutral-300 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 text-[hsl(var(--primary-light))]" />
                <span className="font-medium">{businessData.phone}</span>
              </a>
              <a
                href={`mailto:${businessData.email}`}
                className="flex items-center space-x-2 text-neutral-300 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 text-[hsl(var(--primary-light))]" />
                <span>{businessData.email}</span>
              </a>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-[hsl(var(--primary-light))] flex-shrink-0 mt-0.5" />
                <span>{swap(businessData.address.full)}</span>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="h-4 w-4 text-[hsl(var(--primary-light))] flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="block">Mon-Sat: {businessData.hours.weekdays}</span>
                  <span className="block">Sun: {businessData.hours.sunday}</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-5">
              <SocialLinks />
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Services</h4>
            <ul className="space-y-1.5">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="text-[hsl(var(--primary-light))] hover:text-white transition-colors"
                >
                  View All Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Areas Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Service Areas</h4>
            <ul className="space-y-1.5">
              {footerLinks.areas.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/areas"
                  className="text-[hsl(var(--primary-light))] hover:text-white transition-colors"
                >
                  View All Areas
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Company</h4>
            <ul className="space-y-1.5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Certifications */}
            <div className="mt-5">
              <h4 className="text-white font-semibold mb-2 text-sm">Certifications</h4>
              <ul className="space-y-1 text-neutral-400">
                {(businessData.licenses || []).map((license) => (
                  <li key={license}>{license}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <p className="text-white/50 text-xs">
              &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
            </p>
            <div className="flex space-x-6 text-xs">
              <Link href="/privacy" className="text-white/50 hover:text-white/80 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/50 hover:text-white/80 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Minimal Footer - Compact single row
function MinimalFooter({ features, companyName, serviceLinks, areaLinks, swap }: FooterVariantComponentProps) {
  return (
    <footer className="bg-[hsl(var(--footer-bg))] text-neutral-300 text-sm footer-minimal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <LogoMark variant="light" size="sm" />
          </Link>

          {/* Quick Contact */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <a
              href={`tel:${businessData.phoneRaw}`}
              className="flex items-center gap-2 text-white hover:text-[hsl(var(--primary-light))] transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="font-medium">{businessData.phone}</span>
            </a>
            <a
              href={`mailto:${businessData.email}`}
              className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>{businessData.email}</span>
            </a>
            <div className="flex items-center gap-2 text-neutral-400">
              <MapPin className="h-4 w-4" />
              <span>{swap(`${businessData.address.city}, ${businessData.address.state}`)}</span>
            </div>
          </div>

          {/* Social */}
          <SocialLinks />
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-xs text-white/50">&copy; {new Date().getFullYear()} {companyName}</span>
            <div className="flex gap-4">
              <Link href="/privacy" className="text-xs text-white/50 hover:text-white/80 transition-colors">Privacy</Link>
              <Link href="/terms" className="text-xs text-white/50 hover:text-white/80 transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Centered Footer - Logo and links centered
function CenteredFooter({ features, companyName, serviceLinks, areaLinks, swap }: FooterVariantComponentProps) {
  return (
    <footer className="bg-[hsl(var(--footer-bg))] text-neutral-300 text-sm footer-centered">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <LogoMark variant="light" />
          </Link>
          <p className="text-neutral-400 max-w-md mx-auto text-sm">
            {swap(businessData.description)}
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-8 text-sm">
          <Link href="/services" className="text-neutral-300 hover:text-white transition-colors">Services</Link>
          <Link href="/areas" className="text-neutral-300 hover:text-white transition-colors">Areas</Link>
          <Link href="/about" className="text-neutral-300 hover:text-white transition-colors">About</Link>
          <Link href="/contact" className="text-neutral-300 hover:text-white transition-colors">Contact</Link>
          {features.showBlog && (
            <Link href="/blog" className="text-neutral-300 hover:text-white transition-colors">Blog</Link>
          )}
        </div>

        {/* Contact */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
          <a
            href={`tel:${businessData.phoneRaw}`}
            className="flex items-center gap-2 text-white hover:text-[hsl(var(--primary-light))] transition-colors"
          >
            <Phone className="h-4 w-4 text-[hsl(var(--primary-light))]" />
            <span className="font-medium">{businessData.phone}</span>
          </a>
          <a
            href={`mailto:${businessData.email}`}
            className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
          >
            <Mail className="h-4 w-4 text-[hsl(var(--primary-light))]" />
            <span>{businessData.email}</span>
          </a>
          <div className="flex items-center gap-2 text-neutral-400">
            <MapPin className="h-4 w-4 text-[hsl(var(--primary-light))]" />
            <span>{swap(`${businessData.address.city}, ${businessData.address.state}`)}</span>
          </div>
        </div>

        {/* Social */}
        <div className="flex justify-center mb-8">
          <SocialLinks rounded />
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
          <p className="text-white/50 text-xs">
            &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-2 text-xs">
            <Link href="/privacy" className="text-white/50 hover:text-white/80 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-white/50 hover:text-white/80 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Simple Footer - Just copyright and essentials
function SimpleFooter({ features, companyName, serviceLinks, areaLinks, swap }: FooterVariantComponentProps) {
  return (
    <footer className="bg-[hsl(var(--footer-bg))] text-neutral-300 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex-shrink-0">
              <LogoMark variant="light" size="sm" />
            </Link>
            <span className="text-white/50 text-xs">
              &copy; {new Date().getFullYear()} {companyName}
            </span>
          </div>

          {/* Essential Links */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm">
            <a
              href={`tel:${businessData.phoneRaw}`}
              className="flex items-center gap-2 text-white hover:text-[hsl(var(--primary-light))] transition-colors font-medium"
            >
              <Phone className="h-4 w-4" />
              {businessData.phone}
            </a>
            <span className="text-neutral-400 text-xs hidden sm:inline">
              {swap(`${businessData.address.city}, ${businessData.address.state}`)}
            </span>
            <Link href="/contact" className="text-neutral-400 hover:text-white transition-colors text-xs">
              Contact
            </Link>
            <Link href="/privacy" className="text-neutral-400 hover:text-white transition-colors text-xs">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function GradientAccentBar() {
  const effects = useVisualEffects()
  if (effects.gradientStyle === 'none') return null
  return <div className="h-[3px] bg-gradient-theme" />
}

export default function Footer() {
  const features = useDesignFeatures()
  const overrideName = useVerticalBusinessName()
  const companyName = overrideName || businessData.name
  const verticalAreas = useVerticalAreas()
  const verticalServices = useVerticalServices()
  const swap = useContentSwap()
  const [variant, setVariant] = useState<FooterVariant>('standard')
  const [mounted, setMounted] = useState(false)

  // Dynamic links: use vertical override if available, else deployed data
  const serviceLinks: FooterLink[] = verticalServices
    ? ((verticalServices as any).services || []).slice(0, 6).map((s: any) => ({ name: s.name, href: `/services/${s.slug}` }))
    : staticFooterLinks.services
  const areaLinks: FooterLink[] = verticalAreas
    ? ((verticalAreas as any).areas || []).slice(0, 6).map((a: any) => ({ name: a.name, href: `/areas/${a.slug}` }))
    : staticFooterLinks.areas

  useEffect(() => {
    setMounted(true)
    setVariant(getFooterVariant())

    const handleThemeChange = () => {
      setVariant(getFooterVariant())
    }
    window.addEventListener('foundlio-theme-change', handleThemeChange)
    return () => window.removeEventListener('foundlio-theme-change', handleThemeChange)
  }, [])

  // Use standard during SSR
  const currentVariant = mounted ? variant : 'standard'

  const props = { features, companyName, serviceLinks, areaLinks, swap }

  const renderFooter = () => {
    switch (currentVariant) {
      case 'minimal':
        return <MinimalFooter {...props} />
      case 'centered':
        return <CenteredFooter {...props} />
      case 'simple':
        return <SimpleFooter {...props} />
      default:
        return <StandardFooter {...props} />
    }
  }

  return (
    <>
      <GradientAccentBar />
      {renderFooter()}
    </>
  )
}

'use client'

import Link from 'next/link'
import { Phone } from 'lucide-react'
import Card from '@/components/ui/Card'
import businessData from '@/data/business.json'
import servicesData from '@/data/services.json'
import { useVerticalServices, useContentSwap, useVerticalConfig } from '@/lib/useVerticalContent'

export default function BlogSidebar() {
  const verticalServices = useVerticalServices()
  const swap = useContentSwap()
  const vConfig = useVerticalConfig()

  const services = verticalServices
    ? ((verticalServices as any).services || []).slice(0, 4)
    : servicesData.services.slice(0, 4)

  return (
    <div className="sticky top-24 space-y-6">
      {/* CTA Card */}
      <Card className="p-6 bg-primary/10 border-primary/20">
        <h3 className="text-base font-semibold text-slate-900 mb-3">
          {swap(vConfig.ctaTitle)}
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Contact our team for expert {swap(vConfig.tagline)} service in {swap(businessData.address.city)}.
        </p>
        <a
          href={`tel:${businessData.phoneRaw}`}
          className="flex items-center justify-center w-full px-4 py-3 bg-primary bg-gradient-theme text-white font-medium rounded-lg hover:opacity-90 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
        >
          <Phone className="h-4 w-4 mr-2" />
          {businessData.phone}
        </a>
      </Card>

      {/* Quick Links */}
      <Card className="p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-4">
          Popular Services
        </h3>
        <div className="space-y-2">
          {services.map((service: any) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="block text-sm text-slate-600 hover:text-primary transition-colors"
            >
              {service.name}
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}

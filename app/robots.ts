import { MetadataRoute } from 'next'
import businessData from '@/data/business.json'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: `${businessData.website}/sitemap.xml`,
  }
}

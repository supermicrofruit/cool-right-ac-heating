import { MetadataRoute } from 'next'
import businessData from '@/data/business.json'

export default function robots(): MetadataRoute.Robots {
  const noindex = process.env.NEXT_PUBLIC_NOINDEX !== 'false'

  if (noindex) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: `${businessData.website || process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')}/sitemap.xml`,
  }
}

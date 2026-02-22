import businessData from '@/data/business.json'
import { generateMetadata as genMeta } from '@/lib/seo'
import BlogPageClient from '@/components/sections/BlogPageClient'

export const metadata = genMeta({
  title: 'Blog',
  description: `Expert tips, maintenance guides, and industry news from ${businessData.name}. Learn how to keep your ${businessData.address.city} home comfortable year-round.`,
})

export default function BlogPage() {
  return <BlogPageClient />
}

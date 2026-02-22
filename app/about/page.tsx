import businessData from '@/data/business.json'
import { generateMetadata as genMeta } from '@/lib/seo'
import AboutPageClient from '@/components/pages/AboutPageClient'

export const metadata = genMeta({
  title: 'About Us',
  description: `Learn about ${businessData.name}, serving ${businessData.address.city} since ${businessData.established}. Licensed, insured, and committed to quality service.`,
})

export default function AboutPage() {
  return <AboutPageClient />
}

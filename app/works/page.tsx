import businessData from '@/data/business.json'
import { generateMetadata as genMeta } from '@/lib/seo'
import WorksPageClient from '@/components/pages/WorksPageClient'

export const metadata = genMeta({
  title: 'Our Work',
  description: `See examples of our installations, repairs, and maintenance work throughout the ${businessData.address.city} metro area. Quality craftsmanship from ${businessData.name}.`,
})

export default function WorksPage() {
  return <WorksPageClient />
}

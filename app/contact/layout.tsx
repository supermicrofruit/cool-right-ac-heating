import { generateMetadata as genMeta } from '@/lib/seo'
import businessData from '@/data/business.json'

export const metadata = genMeta({
  title: 'Contact Us',
  description: `Contact ${businessData.name} for service in ${businessData.address.city}. Call ${businessData.phone} or fill out our contact form for a free estimate.`,
})

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

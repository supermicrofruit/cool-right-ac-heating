'use client'

import FAQAccordion from '@/components/sections/FAQAccordion'
import { useVerticalFaqs } from '@/lib/useVerticalContent'

interface HomepageFAQProps {
  defaultFaqs: { question: string; answer: string }[]
  defaultTitle: string
  defaultDescription: string
}

export default function HomepageFAQ({ defaultFaqs, defaultTitle, defaultDescription }: HomepageFAQProps) {
  const verticalFaqs = useVerticalFaqs()

  const faqs = verticalFaqs?.general || defaultFaqs
  const title = verticalFaqs ? 'Common Questions' : defaultTitle
  const description = verticalFaqs ? 'Find answers to frequently asked questions about our services' : defaultDescription

  return (
    <FAQAccordion
      faqs={faqs}
      title={title}
      description={description}
    />
  )
}

import Link from 'next/link'
import { Phone, CreditCard, Check, Calculator, Clock, Shield, ArrowRight } from 'lucide-react'
import Container from '@/components/ui/Container'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import SectionDivider from '@/components/ui/SectionDivider'
import CTABanner from '@/components/sections/CTABanner'
import FadeIn, { FadeInStagger } from '@/components/ui/FadeIn'
import businessData from '@/data/business.json'
import { generateMetadata as genMeta } from '@/lib/seo'
import { getPageContent } from '@/lib/content'

const pageContent = getPageContent('financing')

export const metadata = genMeta({
  title: 'Financing Options',
  description: `Flexible financing options for repairs and installations. Get the comfort you need today with affordable monthly payments. Call ${businessData.phone}.`,
})

const financingOptions = [
  {
    name: '0% APR for 12 Months',
    description: 'No interest if paid in full within 12 months',
    minPurchase: '$500',
    highlight: true,
    features: [
      'No interest charges if paid in full',
      'Equal monthly payments',
      'Quick approval process',
      'No prepayment penalty',
    ],
  },
  {
    name: '60-Month Fixed Rate',
    description: 'Low monthly payments spread over 5 years',
    minPurchase: '$2,000',
    highlight: false,
    features: [
      'Fixed interest rate',
      'Predictable monthly payments',
      'Ideal for major installations',
      'Build credit while staying cool',
    ],
  },
  {
    name: 'Same-Day Approval',
    description: 'Fast financing for emergency repairs',
    minPurchase: '$300',
    highlight: false,
    features: [
      'Quick credit decision',
      'Available for repairs and replacements',
      'Flexible terms',
      'Get service today, pay over time',
    ],
  },
]

const qualifySteps = [
  {
    step: 1,
    title: 'Contact Us',
    description: 'Call or fill out our contact form to schedule a consultation.',
  },
  {
    step: 2,
    title: 'Get Your Quote',
    description: 'We provide a detailed estimate for your project.',
  },
  {
    step: 3,
    title: 'Apply Online',
    description: 'Quick online application with instant decision in most cases.',
  },
  {
    step: 4,
    title: 'Get Service',
    description: 'Once approved, we schedule your installation or repair.',
  },
]

export default function FinancingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-background to-muted py-16 md:py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="blue" className="mb-4">
              <CreditCard className="h-3 w-3 mr-1" />
              Financing Available
            </Badge>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6">
              {pageContent.heroTitle}
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              {pageContent.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={`tel:${businessData.phoneRaw}`}
                className="inline-flex items-center justify-center px-6 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Phone className="h-5 w-5 mr-2" />
                {businessData.phone}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-4 bg-white text-slate-900 font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Get Free Estimate
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <SectionDivider topColor="gray" bottomColor="white" />

      {/* Financing Options */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-semibold text-slate-900 mb-4">
              Financing Options
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Choose the payment plan that works best for your budget. All options feature quick approval and competitive rates.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {financingOptions.map((option, index) => (
              <FadeInStagger key={index} index={index}>
                <Card
                  className={`p-6 relative h-full ${option.highlight ? 'border-2 border-primary' : ''}`}
                >
                  {option.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="blue">Most Popular</Badge>
                    </div>
                  )}
                  <h3 className="text-xl font-heading font-semibold text-slate-900 mb-2">
                    {option.name}
                  </h3>
                  <p className="text-slate-600 mb-4">{option.description}</p>
                  <p className="text-sm text-slate-500 mb-6">
                    Minimum purchase: {option.minPurchase}
                  </p>
                  <ul className="space-y-3">
                    {option.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </FadeInStagger>
            ))}
          </div>
        </Container>
      </section>

      <SectionDivider topColor="white" bottomColor="gray" />

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-muted">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-semibold text-slate-900 mb-4">
              How to Qualify
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Getting approved is quick and easy. Most customers receive a decision within minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {qualifySteps.map((item) => (
              <FadeInStagger key={item.step} index={item.step - 1}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.description}</p>
                </div>
              </FadeInStagger>
            ))}
          </div>
        </Container>
      </section>

      <SectionDivider topColor="gray" bottomColor="white" />

      {/* Benefits */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <h2 className="text-3xl font-heading font-semibold text-slate-900 mb-6">
                {pageContent.whyFinanceTitle}
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Get Comfort Now</h3>
                    <p className="text-slate-600">
                      Don&apos;t wait months to save up. Get the cooling or heating you need today and pay over time.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calculator className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Preserve Cash Flow</h3>
                    <p className="text-slate-600">
                      Keep your savings intact for emergencies while still getting quality service.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Invest in Efficiency</h3>
                    <p className="text-slate-600">
                      A new, efficient system can pay for itself in energy savings. Financing makes the upgrade accessible.
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <Card className="p-8 bg-slate-50">
                <h3 className="text-xl font-heading font-semibold text-slate-900 mb-6">
                  Financing Requirements
                </h3>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Valid government-issued ID</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Social Security Number</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Proof of income or employment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Property ownership or landlord approval</span>
                  </li>
                </ul>
                <p className="text-sm text-slate-500 mb-6">
                  *Approval and terms based on creditworthiness. All financing is subject to credit approval.
                </p>
                <a
                  href={`tel:${businessData.phoneRaw}`}
                  className="flex items-center justify-center w-full px-6 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Call to Learn More
                </a>
              </Card>
            </FadeIn>
          </div>
        </Container>
      </section>

      <SectionDivider topColor="white" bottomColor="gray" />

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-muted">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-heading font-semibold text-slate-900 mb-8 text-center">
              Financing FAQs
            </h2>
            <div className="space-y-6">
              {[
                {
                  question: 'Will applying hurt my credit score?',
                  answer: "Initial pre-qualification typically uses a soft credit check that won\u2019t affect your score. A hard inquiry occurs only if you proceed with the application.",
                },
                {
                  question: 'What if I have less-than-perfect credit?',
                  answer: 'We work with multiple financing partners to offer options for various credit situations. Contact us to discuss your options.',
                },
                {
                  question: 'Can I pay off my balance early?',
                  answer: 'Yes! There are no prepayment penalties. You can pay off your balance anytime without additional fees.',
                },
                {
                  question: 'Is financing available for repairs?',
                  answer: 'Yes, financing is available for both repairs and new installations. Minimum purchase amounts may apply.',
                },
              ].map((faq, index) => (
                <FadeInStagger key={index} index={index}>
                  <Card className="p-6">
                    <h3 className="font-semibold text-slate-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-slate-600">
                      {faq.answer}
                    </p>
                  </Card>
                </FadeInStagger>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <CTABanner
        title={pageContent.ctaTitle}
        description={pageContent.ctaDescription}
        fromColor="gray"
      />
    </>
  )
}

'use client'

import Link from 'next/link'
import { Phone, Award, Shield, Users, Clock, Star, CheckCircle, Target, Heart } from 'lucide-react'
import Container from '@/components/ui/Container'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import SectionDivider from '@/components/ui/SectionDivider'
import FadeIn, { FadeInStagger } from '@/components/ui/FadeIn'
import TrustSignals from '@/components/sections/TrustSignals'
import CTABanner from '@/components/sections/CTABanner'
import businessData from '@/data/business.json'
import { useContentSwap, useVerticalConfig } from '@/lib/useVerticalContent'

const { features } = businessData

const values = [
  {
    icon: Target,
    title: 'Excellence',
    description: 'We strive for excellence in every job, no matter how big or small.',
  },
  {
    icon: Heart,
    title: 'Integrity',
    description: 'Honest assessments and fair pricing guide everything we do.',
  },
  {
    icon: Users,
    title: 'Customer First',
    description: 'Your comfort and satisfaction are our top priorities.',
  },
  {
    icon: Shield,
    title: 'Reliability',
    description: 'Count on us to show up on time and get the job done right.',
  },
]

const currentYear = new Date().getFullYear()

export default function AboutPageClient() {
  const swap = useContentSwap()
  const vConfig = useVerticalConfig()
  const yearsInBusiness = new Date().getFullYear() - businessData.established

  const milestones = [
    { year: businessData.established, event: swap(`${businessData.name} founded in ${businessData.address.city}`) },
    { year: businessData.established + 2, event: 'Expanded our service team' },
    { year: businessData.established + 5, event: swap(`Expanded service to entire ${businessData.address.city} metro area`) },
    { year: businessData.established + 8, event: 'Launched 24/7 emergency service program' },
    { year: businessData.established + 10, event: 'Added additional service offerings' },
    { year: Math.min(businessData.established + 13, currentYear), event: `Served our ${Math.floor(businessData.reviewCount / 100) * 100}+ customers` },
  ].filter(m => m.year <= currentYear)

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-background to-muted py-16 md:py-24">
        <Container>
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="blue" className="mb-4">About Us</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Your Trusted {vConfig.name} Partner Since {businessData.established}
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                For {yearsInBusiness} years, {swap(businessData.name)} has been serving {swap(businessData.address.city)} homes with quality {vConfig.tagline} services. We&apos;re proud to be your neighbors and your go-to {vConfig.tagline} professionals.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">{businessData.rating} Star Rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-medium">{businessData.reviewCount}+ Happy Customers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <span className="font-medium">{yearsInBusiness}+ Years Experience</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>
      <SectionDivider topColor="gray" bottomColor="white" />

      {/* Story */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <FadeIn>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-semibold text-slate-900 mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-slate-600">
                  <p>
                    {swap(businessData.name)} was founded in {businessData.established} with a simple mission: provide honest, reliable {vConfig.tagline} service to {swap(businessData.address.city)} homeowners at fair prices.
                  </p>
                  <p>
                    What started as a small family operation has grown into one of the most trusted {vConfig.tagline} companies in the area. But even as we&apos;ve grown, we&apos;ve never lost sight of what matters most—treating every customer like family.
                  </p>
                  <p>
                    Today, our team of certified technicians brings the same dedication to every service call. We&apos;re proud to have earned the trust of thousands of {swap(businessData.address.city)} families.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{yearsInBusiness}+</div>
                  <div className="text-slate-600">Years in Business</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{businessData.reviewCount}+</div>
                  <div className="text-slate-600">Happy Customers</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{businessData.rating}</div>
                  <div className="text-slate-600">Star Rating</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-slate-600">Emergency Service</div>
                </Card>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      <SectionDivider topColor="white" bottomColor="gray" />

      {/* Values */}
      <section className="py-16 md:py-24 bg-muted">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-slate-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              These values guide everything we do, from how we treat customers to how we train our team.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <FadeInStagger key={value.title} index={index}>
                <Card className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-2xl mb-4">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {value.description}
                  </p>
                </Card>
              </FadeInStagger>
            ))}
          </div>
        </Container>
      </section>

      <SectionDivider topColor="gray" bottomColor="white" />

      {/* Certifications */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <FadeIn>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-semibold text-slate-900 mb-6">
                  Certifications & Credentials
                </h2>
                <p className="text-slate-600 mb-8">
                  Our technicians are among the best trained in the industry. We invest in ongoing education and certification to ensure we can handle any {vConfig.tagline} challenge.
                </p>
                <div className="space-y-4">
                  {(businessData.licenses || []).map((license, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-slate-700">{license}</span>
                    </div>
                  ))}
                  {(businessData.certifications || []).map((cert, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Award className="h-5 w-5 text-primary" />
                      <span className="text-slate-700">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Card className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-6">
                  What Our Certifications Mean for You
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Factory-trained on the latest equipment</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Access to extended manufacturer warranties</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Expertise in high-efficiency systems</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Up to code on all safety standards</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Continuous education on best practices</span>
                  </li>
                </ul>
              </Card>
            </div>
          </FadeIn>
        </Container>
      </section>

      <SectionDivider topColor="white" bottomColor="gray" />

      {/* Timeline */}
      <section className="py-16 md:py-24 bg-muted">
        <Container size="md">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-slate-900 mb-4">
              Our Journey
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20" />
            {milestones.map((milestone, index) => (
              <FadeInStagger key={milestone.year} index={index}>
                <div
                  className={`relative flex items-center mb-8 last:mb-0 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'} pl-12 md:pl-0`}>
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100">
                      <div className="font-bold text-primary">{milestone.year}</div>
                      <div className="text-slate-600">{milestone.event}</div>
                    </div>
                  </div>
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary rounded-full -translate-x-1/2 border-4 border-white" />
                  <div className="flex-1 hidden md:block" />
                </div>
              </FadeInStagger>
            ))}
          </div>
        </Container>
      </section>

      <SectionDivider topColor="gray" bottomColor="white" />
      <TrustSignals />
      <CTABanner
        title="Ready to Experience the Difference?"
        description={swap(`Join thousands of satisfied customers who trust ${businessData.name}.`)}
      />
    </>
  )
}

'use client'

import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react'
import Container from '@/components/ui/Container'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import SectionDivider from '@/components/ui/SectionDivider'
import FadeIn from '@/components/ui/FadeIn'
import ContactForm from '@/components/sections/ContactForm'
import CallbackForm from '@/components/sections/CallbackForm'
import AppointmentScheduler from '@/components/sections/AppointmentScheduler'
import businessData from '@/data/business.json'
import { useContentSwap, useVerticalConfig } from '@/lib/useVerticalContent'

export default function ContactPage() {
  const swap = useContentSwap()
  const vConfig = useVerticalConfig()
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-background to-muted py-16 md:py-24">
        <Container>
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="blue" className="mb-4">Contact Us</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Get in Touch
              </h1>
              <p className="text-lg text-slate-600">
                Ready to schedule service or have questions? We&apos;re here to help. Reach out by phone for immediate assistance or fill out the form below.
              </p>
            </div>
          </FadeIn>
        </Container>
      </section>

      <SectionDivider topColor="gray" bottomColor="white" />

      {/* Contact Info + Form */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <FadeIn delay={0.1}>
            <div className="lg:col-span-1 space-y-6">
              {/* Phone */}
              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Phone</h3>
                    <a
                      href={`tel:${businessData.phoneRaw}`}
                      className="text-primary font-medium hover:text-primary/80"
                    >
                      {businessData.phone}
                    </a>
                    <p className="text-sm text-slate-500 mt-1">
                      {businessData.emergencyService
                        ? 'Available 24/7 for emergencies'
                        : `${businessData.responseTime || 'Same day'} response time`}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Email */}
              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Email</h3>
                    <a
                      href={`mailto:${businessData.email}`}
                      className="text-primary font-medium hover:text-primary/80"
                    >
                      {businessData.email}
                    </a>
                    <p className="text-sm text-slate-500 mt-1">
                      We respond within {businessData.responseTime || '24 hours'}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Address */}
              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Address</h3>
                    <p className="text-slate-600">
                      {swap(businessData.address.street)}<br />
                      {swap(`${businessData.address.city}, ${businessData.address.state}`)} {businessData.address.zip}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Hours */}
              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Business Hours</h3>
                    <div className="space-y-1 text-sm">
                      {businessData.hours.structured.map((schedule, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-slate-600">{schedule.days}</span>
                          <span className="text-slate-900 font-medium">{schedule.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Emergency Notice */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <MessageSquare className="h-6 w-6 text-orange-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-orange-900 mb-1">
                      Need Emergency Service?
                    </h3>
                    <p className="text-sm text-orange-700 mb-3">
                      {vConfig.emergencyText}
                    </p>
                    <a
                      href={`tel:${businessData.phoneRaw}`}
                      className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
            </FadeIn>

            {/* Contact Form */}
            <FadeIn delay={0.2}>
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                  Send Us a Message
                </h2>
                <p className="text-slate-600">
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                </p>
              </div>
              <ContactForm />
            </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      <SectionDivider topColor="white" bottomColor="gray" />

      {/* Additional Tools */}
      <section className="py-16 md:py-24 bg-muted">
        <Container>
          <FadeIn>
            <div className="text-center mb-12">
              <Badge variant="blue" className="mb-4">More Ways to Connect</Badge>
              <h2 className="text-3xl font-heading font-semibold text-slate-900 mb-4">
                Helpful Tools
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Schedule a service appointment or request a callback at your convenience.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <AppointmentScheduler />
            <CallbackForm />
          </div>
        </Container>
      </section>

      {/* Map */}
      <section className="bg-slate-100">
        <Container className="py-0">
          <div className="h-64 md:h-96 rounded-t-xl overflow-hidden">
            <iframe
              title={`${businessData.name} location`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ''}&q=${encodeURIComponent(swap(businessData.address.full))}`}
              allowFullScreen
            />
            {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY && (
              <div className="bg-slate-200 h-full flex items-center justify-center -mt-[100%]">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">
                    {swap(businessData.address.full)}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(swap(businessData.address.full))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm mt-2 inline-block hover:underline"
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  )
}

'use client'

import { useState } from 'react'
import Container from '@/components/ui/Container'
import {
  SimpleForm,
  MultiStepForm,
  PhotoUploadForm,
  CallbackWidget,
  StickyCallButton,
  AvailabilityBadge,
  UrgencyIndicator,
  ReviewsNearForm,
} from '@/components/lead-capture'

const accentColors = [
  { name: 'Blue', value: '#00509d' },
  { name: 'Green', value: '#059669' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Purple', value: '#7c3aed' },
  { name: 'Red', value: '#dc2626' },
]

export default function ShowcasePage() {
  const [accentColor, setAccentColor] = useState('#00509d')
  const [showCallback, setShowCallback] = useState(false)
  const [showSticky, setShowSticky] = useState(false)

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <Container>
          <div className="py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Lead Capture Components</h1>
              <p className="text-sm text-slate-500">A/B testing showcase for Foundlio</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Accent:</span>
                <div className="flex gap-1">
                  {accentColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setAccentColor(color.value)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        accentColor === color.value ? 'border-slate-900 scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showCallback}
                    onChange={(e) => setShowCallback(e.target.checked)}
                    className="rounded"
                  />
                  Callback Widget
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showSticky}
                    onChange={(e) => setShowSticky(e.target.checked)}
                    className="rounded"
                  />
                  Sticky Button
                </label>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        {/* Forms Section */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-sm">1</span>
            Form Variations
          </h2>
          <div className="grid lg:grid-cols-3 gap-6">
            <div>
              <div className="text-sm font-medium text-slate-600 mb-3">Simple Form</div>
              <SimpleForm accentColor={accentColor} />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600 mb-3">Multi-Step Form</div>
              <MultiStepForm accentColor={accentColor} />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600 mb-3">Photo Upload Form</div>
              <PhotoUploadForm accentColor={accentColor} />
            </div>
          </div>
        </section>

        {/* Trust Elements Section */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-sm">2</span>
            Trust & Urgency Indicators
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="text-sm font-medium text-slate-600 mb-4">Availability Badges</div>
              <div className="space-y-3">
                <AvailabilityBadge variant="technicians" accentColor={accentColor} />
                <AvailabilityBadge variant="response" accentColor={accentColor} />
                <AvailabilityBadge variant="slots" accentColor={accentColor} />
                <AvailabilityBadge variant="live" accentColor={accentColor} />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="text-sm font-medium text-slate-600 mb-4">Urgency Indicators</div>
              <div className="space-y-4">
                <UrgencyIndicator variant="demand" accentColor={accentColor} />
                <UrgencyIndicator variant="seasonal" accentColor={accentColor} />
                <UrgencyIndicator variant="limited" accentColor={accentColor} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="text-sm font-medium text-slate-600 mb-4">Countdown Timer (Full Width)</div>
            <UrgencyIndicator variant="countdown" accentColor={accentColor} />
          </div>
        </section>

        {/* Reviews Section */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-sm">3</span>
            Reviews Near Form
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="text-sm font-medium text-slate-600 mb-4">Mini</div>
              <ReviewsNearForm variant="mini" accentColor={accentColor} />
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="text-sm font-medium text-slate-600 mb-4">Single (Rotating)</div>
              <ReviewsNearForm variant="single" accentColor={accentColor} />
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="text-sm font-medium text-slate-600 mb-4">Stack</div>
              <ReviewsNearForm variant="stack" accentColor={accentColor} />
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="text-sm font-medium text-slate-600 mb-4">Carousel</div>
              <ReviewsNearForm variant="carousel" accentColor={accentColor} />
            </div>
          </div>
        </section>

        {/* Combined Examples */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-sm">4</span>
            Combined Examples
          </h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Example 1: Form + Trust badges + Reviews */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="text-sm font-medium text-slate-600 mb-4">High-Trust Layout</div>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <AvailabilityBadge variant="technicians" accentColor={accentColor} />
                  <AvailabilityBadge variant="response" accentColor={accentColor} />
                </div>
                <SimpleForm accentColor={accentColor} />
                <ReviewsNearForm variant="mini" accentColor={accentColor} />
              </div>
            </div>

            {/* Example 2: Urgency-focused */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="text-sm font-medium text-slate-600 mb-4">Urgency-Focused Layout</div>
              <div className="space-y-4">
                <UrgencyIndicator variant="limited" accentColor={accentColor} />
                <SimpleForm
                  accentColor={accentColor}
                  title="Book Now - Limited Availability"
                  buttonText="Reserve My Spot"
                />
                <ReviewsNearForm variant="single" accentColor={accentColor} />
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Notes */}
        <section className="bg-slate-800 text-white rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Implementation Notes</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-medium mb-2">URL-based A/B Testing</h3>
              <code className="block bg-slate-900 rounded p-3 text-slate-300">
                /contact?v=simple<br />
                /contact?v=multistep<br />
                /contact?v=photo
              </code>
            </div>
            <div>
              <h3 className="font-medium mb-2">Component Import</h3>
              <code className="block bg-slate-900 rounded p-3 text-slate-300">
                {`import { SimpleForm, MultiStepForm } from '@/components/lead-capture'`}
              </code>
            </div>
          </div>
        </section>
      </Container>

      {/* Floating Widgets */}
      {showCallback && (
        <CallbackWidget accentColor={accentColor} delayShow={0} />
      )}
      {showSticky && (
        <StickyCallButton accentColor={accentColor} showAfterScroll={0} />
      )}
    </div>
  )
}

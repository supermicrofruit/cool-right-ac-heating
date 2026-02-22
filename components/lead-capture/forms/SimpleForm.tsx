'use client'

import { useState } from 'react'
import { Phone, Send, CheckCircle } from 'lucide-react'

interface SimpleFormProps {
  title?: string
  subtitle?: string
  buttonText?: string
  showPhone?: boolean
  accentColor?: string
  onSubmit?: (data: FormData) => void
}

interface FormData {
  name: string
  phone: string
  email: string
  service: string
  message: string
}

const services = [
  'AC Repair',
  'AC Installation',
  'Heating Repair',
  'Heating Installation',
  'Maintenance',
  'Emergency Service',
  'Other',
]

export default function SimpleForm({
  title = 'Get a Free Estimate',
  subtitle = 'Fill out the form and we\'ll get back to you within 15 minutes.',
  buttonText = 'Request Service',
  showPhone = true,
  accentColor = '#00509d',
  onSubmit,
}: SimpleFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (onSubmit) {
      onSubmit(formData)
    }

    setIsSubmitted(true)
    setIsLoading(false)
  }

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <CheckCircle className="h-8 w-8" style={{ color: accentColor }} />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Thank You!</h3>
        <p className="text-slate-600">
          We've received your request and will call you within 15 minutes.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-600">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="simple-form-name" className="sr-only">Your Name</label>
          <input
            id="simple-form-name"
            type="text"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
          />
        </div>

        <div>
          <label htmlFor="simple-form-phone" className="sr-only">Phone Number</label>
          <input
            id="simple-form-phone"
            type="tel"
            placeholder="Phone Number"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label htmlFor="simple-form-email" className="sr-only">Email Address</label>
          <input
            id="simple-form-email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label htmlFor="simple-form-service" className="sr-only">Select a Service</label>
          <select
            id="simple-form-service"
            required
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all text-slate-600"
          >
            <option value="">Select a Service</option>
            {services.map((service) => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="simple-form-message" className="sr-only">Describe your issue</label>
          <textarea
            id="simple-form-message"
            placeholder="Describe your issue (optional)"
            rows={3}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 text-white font-semibold rounded-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          style={{ backgroundColor: accentColor }}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send className="h-5 w-5" />
              {buttonText}
            </>
          )}
        </button>

        {showPhone && (
          <div className="text-center pt-2">
            <p className="text-sm text-slate-500">
              Or call us directly:{' '}
              <a
                href="tel:+16025552665"
                className="font-semibold hover:underline"
                style={{ color: accentColor }}
              >
                (602) 555-2665
              </a>
            </p>
          </div>
        )}
      </form>
    </div>
  )
}

'use client'

import { useState, useEffect, FormEvent, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, CheckCircle, AlertCircle, ArrowRight, ArrowLeft,
  MapPin, Calendar, Clock, ChevronLeft, ChevronRight,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Turnstile from '@/components/ui/Turnstile'
import servicesData from '@/data/services.json'
import areasData from '@/data/areas.json'
import businessData from '@/data/business.json'
import themeData from '@/data/theme.json'

// ─── Types ──────────────────────────────────────────────────────

export type ContactFormStyle = 'simple' | 'detailed' | 'zip-funnel' | 'booking'

interface FormData {
  name: string
  email: string
  phone: string
  service: string
  message: string
  zip: string
  date: string
  time: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  message?: string
  zip?: string
}

// ─── Hook ───────────────────────────────────────────────────────

export function useContactFormStyle(): ContactFormStyle {
  const [style, setStyle] = useState<ContactFormStyle>(
    ((themeData as any).contactFormStyle as ContactFormStyle) || 'detailed'
  )

  useEffect(() => {
    function update() {
      try {
        const saved = localStorage.getItem('foundlio-design')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.contactFormStyle) {
            setStyle(parsed.contactFormStyle)
            return
          }
        }
      } catch {}
      setStyle(((themeData as any).contactFormStyle as ContactFormStyle) || 'detailed')
    }
    update()
    window.addEventListener('foundlio-theme-change', update)
    return () => window.removeEventListener('foundlio-theme-change', update)
  }, [])

  return style
}

// ─── Shared Helpers ─────────────────────────────────────────────

const initialFormData: FormData = {
  name: '', email: '', phone: '', service: '', message: '', zip: '', date: '', time: '',
}

function useFormSubmission(source: string) {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token)
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const submit = async (overrides?: Partial<{ source: string; message: string }>) => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const body: Record<string, string | undefined> = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        service: formData.service || undefined,
        message: overrides?.message || formData.message.trim() || undefined,
        source: overrides?.source || source,
        turnstileToken: turnstileToken || undefined,
      }
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to submit')
      setSuccessMessage(data.message || (businessData as any).forms?.successMessage || 'Thank you!')
      setIsSubmitted(true)
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : (businessData as any).forms?.errorMessage || 'Something went wrong. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const reset = () => {
    setIsSubmitted(false)
    setFormData(initialFormData)
    setSubmitError(null)
    setErrors({})
  }

  return {
    formData, setFormData, errors, setErrors,
    isSubmitting, isSubmitted, submitError, successMessage,
    turnstileToken, handleTurnstileVerify, handleChange,
    submit, reset,
  }
}

function validateRequired(fields: { value: string; key: keyof FormErrors; label: string }[]) {
  const errs: FormErrors = {}
  for (const f of fields) {
    if (!f.value.trim()) errs[f.key] = `${f.label} is required`
  }
  return errs
}

function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email'
  return undefined
}

function validatePhone(phone: string): string | undefined {
  if (!phone.trim()) return 'Phone number is required'
  if (!/^[\d\s\-\(\)\+]+$/.test(phone)) return 'Please enter a valid phone number'
  return undefined
}

// ─── Success State (shared) ─────────────────────────────────────

function SuccessState({ message, onReset }: { message: string; onReset: () => void }) {
  return (
    <Card className="text-center py-12">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h3 className="text-2xl font-semibold text-slate-900 mb-2">Thank You!</h3>
      <p className="text-slate-600 mb-6">
        {message || "We've received your message and will get back to you shortly."}
      </p>
      <Button variant="secondary" onClick={onReset}>
        Send Another Message
      </Button>
    </Card>
  )
}

// ─── FormSimple ─────────────────────────────────────────────────

function FormSimple() {
  const form = useFormSubmission('Quick Contact')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const errs: FormErrors = {
      ...validateRequired([
        { value: form.formData.name, key: 'name', label: 'Name' },
      ]),
    }
    const phoneErr = validatePhone(form.formData.phone)
    if (phoneErr) errs.phone = phoneErr
    form.setErrors(errs)
    if (Object.keys(errs).length > 0) return
    await form.submit()
  }

  if (form.isSubmitted) return <SuccessState message={form.successMessage} onReset={form.reset} />

  return (
    <Card padding="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="simple-name" className="block text-sm font-medium text-slate-700 mb-1">
            Full Name *
          </label>
          <input
            type="text" id="simple-name" name="name"
            value={form.formData.name} onChange={form.handleChange}
            className={`input-field ${form.errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="John Smith"
          />
          {form.errors.name && <p className="mt-1 text-sm text-red-500">{form.errors.name}</p>}
        </div>

        <div>
          <label htmlFor="simple-phone" className="block text-sm font-medium text-slate-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel" id="simple-phone" name="phone"
            value={form.formData.phone} onChange={form.handleChange}
            className={`input-field ${form.errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="(602) 555-1234"
          />
          {form.errors.phone && <p className="mt-1 text-sm text-red-500">{form.errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="simple-message" className="block text-sm font-medium text-slate-700 mb-1">
            How can we help?
          </label>
          <textarea
            id="simple-message" name="message"
            value={form.formData.message} onChange={form.handleChange}
            rows={3} className="input-field resize-none"
            placeholder="Tell us about your needs..."
          />
        </div>

        <Turnstile onVerify={form.handleTurnstileVerify} />

        {form.submitError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {form.submitError}
          </div>
        )}

        <Button type="submit" className="w-full" isLoading={form.isSubmitting}>
          <Send className="h-4 w-4 mr-2" />
          Request Service
        </Button>

        <p className="text-xs text-slate-500 text-center">
          By submitting this form, you agree to be contacted regarding your service request.
        </p>
      </form>
    </Card>
  )
}

// ─── FormDetailed (original) ────────────────────────────────────

function FormDetailed() {
  const form = useFormSubmission('Contact Form')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const errs: FormErrors = {
      ...validateRequired([
        { value: form.formData.name, key: 'name', label: 'Name' },
      ]),
    }
    const emailErr = validateEmail(form.formData.email)
    if (emailErr) errs.email = emailErr
    const phoneErr = validatePhone(form.formData.phone)
    if (phoneErr) errs.phone = phoneErr
    if (!form.formData.message.trim()) errs.message = 'Message is required'
    form.setErrors(errs)
    if (Object.keys(errs).length > 0) return
    await form.submit()
  }

  if (form.isSubmitted) return <SuccessState message={form.successMessage} onReset={form.reset} />

  return (
    <Card padding="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
            Full Name *
          </label>
          <input
            type="text" id="name" name="name"
            value={form.formData.name} onChange={form.handleChange}
            className={`input-field ${form.errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="John Smith"
          />
          {form.errors.name && <p className="mt-1 text-sm text-red-500">{form.errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email Address *
            </label>
            <input
              type="email" id="email" name="email"
              value={form.formData.email} onChange={form.handleChange}
              className={`input-field ${form.errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="john@example.com"
            />
            {form.errors.email && <p className="mt-1 text-sm text-red-500">{form.errors.email}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel" id="phone" name="phone"
              value={form.formData.phone} onChange={form.handleChange}
              className={`input-field ${form.errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="(602) 555-1234"
            />
            {form.errors.phone && <p className="mt-1 text-sm text-red-500">{form.errors.phone}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="service" className="block text-sm font-medium text-slate-700 mb-1">
            Service Needed
          </label>
          <select
            id="service" name="service"
            value={form.formData.service} onChange={form.handleChange}
            className="input-field"
          >
            <option value="">Select a service (optional)</option>
            {((servicesData as any).services || []).map((service: any) => (
              <option key={service.slug} value={service.name}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
            Message *
          </label>
          <textarea
            id="message" name="message"
            value={form.formData.message} onChange={form.handleChange}
            rows={4}
            className={`input-field resize-none ${form.errors.message ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Tell us about your needs..."
          />
          {form.errors.message && <p className="mt-1 text-sm text-red-500">{form.errors.message}</p>}
        </div>

        <Turnstile onVerify={form.handleTurnstileVerify} />

        {form.submitError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {form.submitError}
          </div>
        )}

        <Button type="submit" className="w-full" isLoading={form.isSubmitting}>
          <Send className="h-4 w-4 mr-2" />
          Send Message
        </Button>

        <p className="text-xs text-slate-500 text-center">
          By submitting this form, you agree to be contacted regarding your service request.
        </p>
      </form>
    </Card>
  )
}

// ─── FormZipFunnel ──────────────────────────────────────────────

const areaZips = ((areasData as any).areas || []).flatMap((a: any) =>
  (a.zipCodes || []).map((z: string) => z)
)

function FormZipFunnel() {
  const form = useFormSubmission('Zip Funnel')
  const [step, setStep] = useState(1)
  const [zipWarning, setZipWarning] = useState('')
  const services = (servicesData as any).services || []

  const handleZipNext = () => {
    if (!form.formData.zip.trim()) {
      form.setErrors({ zip: 'Please enter your zip code' })
      return
    }
    if (!/^\d{5}$/.test(form.formData.zip.trim())) {
      form.setErrors({ zip: 'Please enter a valid 5-digit zip code' })
      return
    }
    form.setErrors({})
    // Check if zip is in service area
    if (areaZips.length > 0 && !areaZips.includes(form.formData.zip.trim())) {
      setZipWarning('We may serve your area — submit your request and we\'ll confirm.')
    } else {
      setZipWarning('')
    }
    setStep(2)
  }

  const handleServiceSelect = (serviceName: string) => {
    form.setFormData(prev => ({ ...prev, service: serviceName }))
    setStep(3)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const errs: FormErrors = {}
    if (!form.formData.name.trim()) errs.name = 'Name is required'
    const phoneErr = validatePhone(form.formData.phone)
    if (phoneErr) errs.phone = phoneErr
    form.setErrors(errs)
    if (Object.keys(errs).length > 0) return
    await form.submit({
      message: `Zip: ${form.formData.zip} | Service: ${form.formData.service}${form.formData.message ? ` | ${form.formData.message}` : ''}`,
    })
  }

  if (form.isSubmitted) return <SuccessState message={form.successMessage} onReset={() => { form.reset(); setStep(1); setZipWarning('') }} />

  return (
    <Card padding="lg">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
              s <= step ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {s < step ? <CheckCircle className="h-4 w-4" /> : s}
            </div>
            {s < 3 && <div className={`flex-1 h-0.5 ${s < step ? 'bg-primary' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Zip Code */}
        {step === 1 && (
          <motion.div
            key="zip-step1"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Where are you located?</h3>
            <p className="text-sm text-slate-500 mb-4">Enter your zip code so we can check service availability</p>
            <div className="flex gap-3">
              <div className="flex-1">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text" name="zip" inputMode="numeric" maxLength={5}
                    value={form.formData.zip}
                    onChange={form.handleChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleZipNext()}
                    className={`input-field pl-10 ${form.errors.zip ? 'border-red-500' : ''}`}
                    placeholder="Enter zip code"
                    autoFocus
                  />
                </div>
                {form.errors.zip && <p className="mt-1 text-sm text-red-500">{form.errors.zip}</p>}
              </div>
              <Button onClick={handleZipNext} className="shrink-0">
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Service Selection */}
        {step === 2 && (
          <motion.div
            key="zip-step2"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <button onClick={() => setStep(1)} className="flex items-center text-sm text-slate-500 mb-3 hover:text-slate-700">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </button>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">What service do you need?</h3>
            <p className="text-sm text-slate-500 mb-4">Select the service that best describes your needs</p>
            {zipWarning && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm mb-4">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {zipWarning}
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              {services.slice(0, 8).map((s: any) => (
                <button
                  key={s.slug}
                  onClick={() => handleServiceSelect(s.name)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    form.formData.service === s.name
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-sm font-medium text-slate-900 leading-tight">{s.name}</p>
                  {s.shortDescription && (
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{s.shortDescription}</p>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Contact Info */}
        {step === 3 && (
          <motion.div
            key="zip-step3"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <button onClick={() => setStep(2)} className="flex items-center text-sm text-slate-500 mb-3 hover:text-slate-700">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </button>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">How can we reach you?</h3>
            <div className="bg-slate-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-slate-600">
                <span className="font-medium">{form.formData.service}</span> in <span className="font-medium">{form.formData.zip}</span>
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                <input
                  type="text" name="name"
                  value={form.formData.name} onChange={form.handleChange}
                  className={`input-field ${form.errors.name ? 'border-red-500' : ''}`}
                  placeholder="John Smith"
                />
                {form.errors.name && <p className="mt-1 text-sm text-red-500">{form.errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                <input
                  type="tel" name="phone"
                  value={form.formData.phone} onChange={form.handleChange}
                  className={`input-field ${form.errors.phone ? 'border-red-500' : ''}`}
                  placeholder="(602) 555-1234"
                />
                {form.errors.phone && <p className="mt-1 text-sm text-red-500">{form.errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Additional details</label>
                <textarea
                  name="message" rows={2}
                  value={form.formData.message} onChange={form.handleChange}
                  className="input-field resize-none"
                  placeholder="Anything else we should know?"
                />
              </div>

              <Turnstile onVerify={form.handleTurnstileVerify} />

              {form.submitError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {form.submitError}
                </div>
              )}

              <Button type="submit" className="w-full" isLoading={form.isSubmitting}>
                <Send className="h-4 w-4 mr-2" />
                Get My Free Estimate
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

// ─── FormBooking ────────────────────────────────────────────────

const bookingTimeSlots = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
]

function FormBooking() {
  const form = useFormSubmission('Booking Request')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const services = (servicesData as any).services || []

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: (number | null)[] = []
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null)
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(i)
    return days
  }

  const isDateAvailable = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date >= today && date.getDay() !== 0
  }

  const handleDateSelect = (day: number) => {
    if (!isDateAvailable(day)) return
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    form.setFormData(prev => ({
      ...prev,
      date: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const errs: FormErrors = {}
    if (!form.formData.name.trim()) errs.name = 'Name is required'
    const phoneErr = validatePhone(form.formData.phone)
    if (phoneErr) errs.phone = phoneErr
    form.setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const parts = []
    if (form.formData.service) parts.push(`Service: ${form.formData.service}`)
    if (form.formData.date) parts.push(`Date: ${form.formData.date}`)
    if (form.formData.time) parts.push(`Time: ${form.formData.time}`)
    if (form.formData.message) parts.push(`Notes: ${form.formData.message}`)

    await form.submit({ message: parts.join(' | ') || undefined })
  }

  if (form.isSubmitted) {
    return <SuccessState message={form.successMessage} onReset={() => { form.reset(); setCurrentMonth(new Date()) }} />
  }

  return (
    <Card padding="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Service */}
        <div>
          <label htmlFor="booking-service" className="block text-sm font-medium text-slate-700 mb-1">
            Service Needed
          </label>
          <select
            id="booking-service" name="service"
            value={form.formData.service} onChange={form.handleChange}
            className="input-field"
          >
            <option value="">Select a service (optional)</option>
            {services.map((s: any) => (
              <option key={s.slug} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Calendar */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Calendar className="h-4 w-4 inline mr-1.5 -mt-0.5" />
            Pick a Date
          </label>
          <div className="border border-slate-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="p-1.5 hover:bg-slate-100 rounded-lg"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-semibold text-slate-900">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button
                type="button"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="p-1.5 hover:bg-slate-100 rounded-lg"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                <div key={d} className="text-center text-[10px] font-medium text-slate-400 py-1">{d}</div>
              ))}
              {getDaysInMonth(currentMonth).map((day, i) => {
                const dateStr = day
                  ? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                      .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                  : ''
                const isSelected = dateStr === form.formData.date
                return (
                  <button
                    key={i} type="button"
                    onClick={() => day && handleDateSelect(day)}
                    disabled={!day || !isDateAvailable(day)}
                    className={`aspect-square flex items-center justify-center text-xs rounded-md transition-colors ${
                      !day ? ''
                      : isSelected ? 'bg-primary text-white font-semibold'
                      : !isDateAvailable(day) ? 'text-slate-300 cursor-not-allowed'
                      : 'hover:bg-primary/10 text-slate-700'
                    }`}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Clock className="h-4 w-4 inline mr-1.5 -mt-0.5" />
            Pick a Time
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
            {bookingTimeSlots.map(t => (
              <button
                key={t} type="button"
                onClick={() => form.setFormData(prev => ({ ...prev, time: t }))}
                className={`px-2 py-2 text-xs font-medium rounded-lg border transition-colors ${
                  form.formData.time === t
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Contact Fields */}
        <div className="border-t border-slate-200 pt-5 space-y-4">
          <div>
            <label htmlFor="booking-name" className="block text-sm font-medium text-slate-700 mb-1">
              Name *
            </label>
            <input
              type="text" id="booking-name" name="name"
              value={form.formData.name} onChange={form.handleChange}
              className={`input-field ${form.errors.name ? 'border-red-500' : ''}`}
              placeholder="John Smith"
            />
            {form.errors.name && <p className="mt-1 text-sm text-red-500">{form.errors.name}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="booking-phone" className="block text-sm font-medium text-slate-700 mb-1">
                Phone *
              </label>
              <input
                type="tel" id="booking-phone" name="phone"
                value={form.formData.phone} onChange={form.handleChange}
                className={`input-field ${form.errors.phone ? 'border-red-500' : ''}`}
                placeholder="(602) 555-1234"
              />
              {form.errors.phone && <p className="mt-1 text-sm text-red-500">{form.errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="booking-email" className="block text-sm font-medium text-slate-700 mb-1">
                Email <span className="text-slate-400">(optional)</span>
              </label>
              <input
                type="email" id="booking-email" name="email"
                value={form.formData.email} onChange={form.handleChange}
                className="input-field"
                placeholder="john@example.com"
              />
            </div>
          </div>
        </div>

        <Turnstile onVerify={form.handleTurnstileVerify} />

        {form.submitError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {form.submitError}
          </div>
        )}

        <Button type="submit" className="w-full" isLoading={form.isSubmitting}>
          <Calendar className="h-4 w-4 mr-2" />
          Book Appointment
        </Button>

        <p className="text-xs text-slate-500 text-center">
          By submitting this form, you agree to be contacted regarding your service request.
        </p>
      </form>
    </Card>
  )
}

// ─── Main Export ─────────────────────────────────────────────────

interface ContactFormProps {
  style?: ContactFormStyle
}

export default function ContactForm({ style }: ContactFormProps) {
  const themeStyle = useContactFormStyle()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // SSR: always render the default (detailed) to avoid hydration mismatch
  const activeStyle = mounted ? (style || themeStyle) : ((themeData as any).contactFormStyle || 'detailed')

  switch (activeStyle) {
    case 'simple': return <FormSimple />
    case 'zip-funnel': return <FormZipFunnel />
    case 'booking': return <FormBooking />
    case 'detailed':
    default: return <FormDetailed />
  }
}

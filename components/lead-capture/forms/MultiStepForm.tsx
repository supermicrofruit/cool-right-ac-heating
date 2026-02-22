'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wrench, Snowflake, Flame, Wind, AlertTriangle, Settings,
  ArrowRight, ArrowLeft, CheckCircle, Phone, Calendar, Clock
} from 'lucide-react'

interface MultiStepFormProps {
  accentColor?: string
  onSubmit?: (data: FormData) => void
}

interface FormData {
  serviceType: string
  urgency: string
  propertyType: string
  issue: string
  name: string
  phone: string
  email: string
  preferredTime: string
  address: string
}

const serviceTypes = [
  { id: 'ac-repair', label: 'AC Repair', icon: Snowflake, description: 'Not cooling, strange noises, leaks' },
  { id: 'heating-repair', label: 'Heating Repair', icon: Flame, description: 'Not heating, pilot issues' },
  { id: 'installation', label: 'New Installation', icon: Settings, description: 'Replace or install new system' },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench, description: 'Tune-up, filter change, inspection' },
  { id: 'air-quality', label: 'Air Quality', icon: Wind, description: 'Duct cleaning, filtration' },
  { id: 'emergency', label: 'Emergency', icon: AlertTriangle, description: 'Urgent - need help now' },
]

const urgencyOptions = [
  { id: 'emergency', label: 'Emergency', sublabel: 'Need help within hours', color: '#ef4444' },
  { id: 'soon', label: 'As Soon As Possible', sublabel: 'Within 24-48 hours', color: '#f97316' },
  { id: 'scheduled', label: 'Schedule Visit', sublabel: 'Pick a convenient time', color: '#22c55e' },
  { id: 'quote', label: 'Just a Quote', sublabel: 'Planning ahead', color: '#3b82f6' },
]

const propertyTypes = [
  { id: 'house', label: 'House' },
  { id: 'apartment', label: 'Apartment/Condo' },
  { id: 'townhouse', label: 'Townhouse' },
  { id: 'commercial', label: 'Commercial' },
]

const timeSlots = [
  'Morning (8am - 12pm)',
  'Afternoon (12pm - 5pm)',
  'Evening (5pm - 8pm)',
  'Flexible / Any time',
]

export default function MultiStepForm({
  accentColor = '#00509d',
  onSubmit,
}: MultiStepFormProps) {
  const [step, setStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    serviceType: '',
    urgency: '',
    propertyType: '',
    issue: '',
    name: '',
    phone: '',
    email: '',
    preferredTime: '',
    address: '',
  })

  const totalSteps = 3

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.serviceType !== ''
      case 2:
        return formData.urgency !== ''
      case 3:
        return formData.name !== '' && formData.phone !== ''
      default:
        return false
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    if (onSubmit) {
      onSubmit(formData)
    }
    setIsSubmitted(true)
    setIsLoading(false)
  }

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <CheckCircle className="h-10 w-10" style={{ color: accentColor }} />
        </motion.div>
        <h3 className="text-2xl font-semibold text-slate-900 mb-2">Request Submitted!</h3>
        <p className="text-slate-600 mb-6">
          {formData.urgency === 'emergency'
            ? 'A technician will call you within 10 minutes.'
            : 'We\'ll contact you within 15 minutes to confirm your appointment.'}
        </p>
        <div className="bg-slate-50 rounded-lg p-4 text-left">
          <p className="text-sm text-slate-500 mb-1">Your confirmation:</p>
          <p className="font-medium text-slate-900">{formData.serviceType}</p>
          <p className="text-sm text-slate-600">{formData.name} • {formData.phone}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-slate-50 px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">Step {step} of {totalSteps}</span>
          <span className="text-sm text-slate-500">
            {step === 1 && 'Select Service'}
            {step === 2 && 'Timing & Details'}
            {step === 3 && 'Your Information'}
          </span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: accentColor }}
            initial={{ width: 0 }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Service Type */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-1">What do you need help with?</h3>
              <p className="text-sm text-slate-500 mb-4">Select the service that best matches your needs</p>

              <div className="grid grid-cols-2 gap-3">
                {serviceTypes.map((service) => {
                  const Icon = service.icon
                  const isSelected = formData.serviceType === service.label
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, serviceType: service.label })}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        isSelected
                          ? 'border-current bg-opacity-5'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      style={isSelected ? { borderColor: accentColor, backgroundColor: `${accentColor}08` } : {}}
                    >
                      <Icon
                        className={`h-6 w-6 mb-2 ${isSelected ? '' : 'text-slate-400'}`}
                        style={isSelected ? { color: accentColor } : {}}
                      />
                      <p className={`font-medium ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                        {service.label}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{service.description}</p>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Urgency & Details */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-1">How urgent is this?</h3>
              <p className="text-sm text-slate-500 mb-4">This helps us prioritize your request</p>

              <div className="space-y-3 mb-6">
                {urgencyOptions.map((option) => {
                  const isSelected = formData.urgency === option.id
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, urgency: option.id })}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all flex items-center gap-4 ${
                        isSelected
                          ? 'border-current'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      style={isSelected ? { borderColor: option.color, backgroundColor: `${option.color}08` } : {}}
                    >
                      <div
                        className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                        style={{ borderColor: isSelected ? option.color : '#cbd5e1' }}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: option.color }} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{option.label}</p>
                        <p className="text-xs text-slate-500">{option.sublabel}</p>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Property Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {propertyTypes.map((type) => {
                    const isSelected = formData.propertyType === type.id
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, propertyType: type.id })}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                          isSelected
                            ? 'text-white'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                        style={isSelected ? { backgroundColor: accentColor, borderColor: accentColor } : {}}
                      >
                        {type.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Describe the issue (optional)
                </label>
                <textarea
                  value={formData.issue}
                  onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                  placeholder="E.g., AC stopped cooling yesterday, makes a clicking sound..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none text-sm"
                />
              </div>
            </motion.div>
          )}

          {/* Step 3: Contact Info */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Almost done! How can we reach you?</h3>
              <p className="text-sm text-slate-500 mb-4">We'll confirm your appointment by phone</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Service Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Main St, Phoenix, AZ"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  />
                </div>

                {formData.urgency === 'scheduled' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Time</label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                    >
                      <option value="">Select a time slot</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: accentColor }}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canProceed() || isLoading}
              className="flex items-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-all disabled:opacity-50"
              style={{ backgroundColor: accentColor }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Submit Request
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

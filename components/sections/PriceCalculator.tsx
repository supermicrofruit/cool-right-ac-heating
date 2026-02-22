'use client'

import { useState } from 'react'
import { Calculator, Home, Thermometer, Clock, Phone } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import businessData from '@/data/business.json'

const serviceTypes = [
  { id: 'repair', name: 'AC Repair', basePrice: 89, icon: '🔧' },
  { id: 'maintenance', name: 'AC Tune-Up', basePrice: 89, icon: '⚙️' },
  { id: 'installation', name: 'New AC Installation', basePrice: 4500, icon: '❄️' },
  { id: 'heating-repair', name: 'Heating Repair', basePrice: 89, icon: '🔥' },
  { id: 'duct-cleaning', name: 'Duct Cleaning', basePrice: 299, icon: '💨' },
]

const homeSizes = [
  { id: 'small', name: 'Small (< 1,500 sq ft)', multiplier: 1 },
  { id: 'medium', name: 'Medium (1,500 - 2,500 sq ft)', multiplier: 1.2 },
  { id: 'large', name: 'Large (2,500 - 3,500 sq ft)', multiplier: 1.4 },
  { id: 'xlarge', name: 'Extra Large (> 3,500 sq ft)', multiplier: 1.6 },
]

const systemAges = [
  { id: 'new', name: '0-5 years', multiplier: 1 },
  { id: 'mid', name: '6-10 years', multiplier: 1.1 },
  { id: 'old', name: '11-15 years', multiplier: 1.2 },
  { id: 'veryold', name: '15+ years', multiplier: 1.3 },
]

export default function PriceCalculator() {
  const [serviceType, setServiceType] = useState('')
  const [homeSize, setHomeSize] = useState('')
  const [systemAge, setSystemAge] = useState('')
  const [showEstimate, setShowEstimate] = useState(false)

  const calculateEstimate = () => {
    if (!serviceType || !homeSize || !systemAge) return null

    const service = serviceTypes.find((s) => s.id === serviceType)
    const size = homeSizes.find((s) => s.id === homeSize)
    const age = systemAges.find((s) => s.id === systemAge)

    if (!service || !size || !age) return null

    const baseEstimate = service.basePrice * size.multiplier * age.multiplier
    const lowEstimate = Math.round(baseEstimate * 0.85)
    const highEstimate = Math.round(baseEstimate * 1.25)

    return { low: lowEstimate, high: highEstimate, service: service.name }
  }

  const estimate = calculateEstimate()

  const handleCalculate = () => {
    if (serviceType && homeSize && systemAge) {
      setShowEstimate(true)
    }
  }

  return (
    <Card className="p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <Calculator className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-slate-900">Price Estimator</h3>
          <p className="text-sm text-slate-600">Get a quick estimate for your project</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Service Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Thermometer className="h-4 w-4 inline mr-1" />
            What service do you need?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {serviceTypes.map((service) => (
              <button
                key={service.id}
                onClick={() => { setServiceType(service.id); setShowEstimate(false); }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  serviceType === service.id
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="mr-2">{service.icon}</span>
                {service.name}
              </button>
            ))}
          </div>
        </div>

        {/* Home Size */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Home className="h-4 w-4 inline mr-1" />
            What&apos;s your home size?
          </label>
          <select
            value={homeSize}
            onChange={(e) => { setHomeSize(e.target.value); setShowEstimate(false); }}
            className="input-field"
          >
            <option value="">Select home size...</option>
            {homeSizes.map((size) => (
              <option key={size.id} value={size.id}>
                {size.name}
              </option>
            ))}
          </select>
        </div>

        {/* System Age */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Clock className="h-4 w-4 inline mr-1" />
            How old is your current system?
          </label>
          <select
            value={systemAge}
            onChange={(e) => { setSystemAge(e.target.value); setShowEstimate(false); }}
            className="input-field"
          >
            <option value="">Select system age...</option>
            {systemAges.map((age) => (
              <option key={age.id} value={age.id}>
                {age.name}
              </option>
            ))}
          </select>
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          disabled={!serviceType || !homeSize || !systemAge}
          className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Calculate Estimate
        </button>

        {/* Estimate Display */}
        {showEstimate && estimate && (
          <div className="mt-6 p-6 bg-gradient-to-br from-primary to-primary/90 rounded-xl text-white">
            <Badge variant="white" className="mb-3">Estimated Price Range</Badge>
            <div className="text-4xl font-heading font-bold mb-2">
              ${estimate.low.toLocaleString()} - ${estimate.high.toLocaleString()}
            </div>
            <p className="text-white/80 text-sm mb-4">
              for {estimate.service}
            </p>
            <p className="text-white/60 text-xs mb-4">
              * This is a rough estimate. Final price depends on specific conditions and requirements.
            </p>
            <a
              href={`tel:${businessData.phoneRaw}`}
              className="inline-flex items-center justify-center w-full py-3 bg-white text-primary font-semibold rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Phone className="h-5 w-5 mr-2" />
              Get Exact Quote: {businessData.phone}
            </a>
          </div>
        )}
      </div>
    </Card>
  )
}

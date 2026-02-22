'use client'

import { useState, FormEvent } from 'react'
import { Phone, CheckCircle } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function CallbackForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    preferredTime: 'anytime',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Please fill in all required fields')
      return
    }

    if (!/^[\d\s\-\(\)\+]+$/.test(formData.phone)) {
      setError('Please enter a valid phone number')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          source: 'Callback Request',
          message: `Preferred callback time: ${formData.preferredTime}`,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to submit')
      }
      setIsSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-heading font-semibold text-slate-900 mb-2">
          We&apos;ll Call You Back!
        </h3>
        <p className="text-slate-600">
          Expect a call from our team within 30 minutes during business hours.
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <Phone className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-slate-900">Request a Callback</h3>
          <p className="text-sm text-slate-600">We&apos;ll call you back within 30 minutes</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="callback-name" className="block text-sm font-medium text-slate-700 mb-1">
            Your Name *
          </label>
          <input
            type="text"
            id="callback-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-field"
            placeholder="John Smith"
          />
        </div>

        <div>
          <label htmlFor="callback-phone" className="block text-sm font-medium text-slate-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            id="callback-phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="input-field"
            placeholder="(602) 555-1234"
          />
        </div>

        <div>
          <label htmlFor="callback-time" className="block text-sm font-medium text-slate-700 mb-1">
            Best Time to Call
          </label>
          <select
            id="callback-time"
            value={formData.preferredTime}
            onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
            className="input-field"
          >
            <option value="anytime">Anytime</option>
            <option value="morning">Morning (8am - 12pm)</option>
            <option value="afternoon">Afternoon (12pm - 5pm)</option>
            <option value="evening">Evening (5pm - 8pm)</option>
          </select>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Request Callback
        </Button>
      </form>
    </Card>
  )
}

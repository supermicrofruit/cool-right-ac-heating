'use client'

import { useState } from 'react'
import { Calendar, Clock, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

const timeSlots = [
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
]

export default function AppointmentScheduler() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState('')
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', notes: '' })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days: (number | null)[] = []
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }

  const isDateAvailable = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dayOfWeek = date.getDay()
    return date >= today && dayOfWeek !== 0 // Not in past, not Sunday
  }

  const handleDateSelect = (day: number) => {
    if (isDateAvailable(day)) {
      setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))
      setStep(2)
    }
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone) return
    setError('')
    setIsSubmitting(true)
    try {
      const dateStr = selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || undefined,
          source: 'Appointment Request',
          message: `${dateStr} at ${selectedTime}. Notes: ${formData.notes || 'None'}`,
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
          Appointment Requested!
        </h3>
        <p className="text-slate-600 mb-4">
          {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
        </p>
        <p className="text-sm text-slate-500">
          We&apos;ll call you to confirm your appointment within 1 business hour.
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <Calendar className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-slate-900">Schedule Service</h3>
          <p className="text-sm text-slate-600">Pick a date and time that works for you</p>
        </div>
      </div>

      {/* Step 1: Select Date */}
      {step === 1 && (
        <div>
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="font-semibold">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">
                {day}
              </div>
            ))}
            {getDaysInMonth(currentMonth).map((day, index) => (
              <button
                key={index}
                onClick={() => day && handleDateSelect(day)}
                disabled={!day || !isDateAvailable(day)}
                className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors ${
                  !day
                    ? ''
                    : !isDateAvailable(day)
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'hover:bg-primary hover:text-white'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Select Time */}
      {step === 2 && (
        <div>
          <button onClick={() => setStep(1)} className="flex items-center text-sm text-slate-600 mb-4 hover:text-slate-900">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to calendar
          </button>
          <p className="font-medium mb-4">
            {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => { setSelectedTime(time); setStep(3); }}
                className={`p-3 rounded-lg border text-sm transition-all ${
                  selectedTime === time
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Clock className="h-4 w-4 inline mr-2" />
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Contact Info */}
      {step === 3 && (
        <div>
          <button onClick={() => setStep(2)} className="flex items-center text-sm text-slate-600 mb-4 hover:text-slate-900">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to time selection
          </button>
          <div className="bg-slate-50 rounded-lg p-3 mb-4">
            <p className="text-sm font-medium">
              {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="John Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-field"
                placeholder="(602) 555-1234"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="input-field resize-none"
                rows={2}
                placeholder="Describe your issue..."
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button
              onClick={handleSubmit}
              disabled={!formData.name || !formData.phone}
              className="w-full"
              isLoading={isSubmitting}
            >
              Request Appointment
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

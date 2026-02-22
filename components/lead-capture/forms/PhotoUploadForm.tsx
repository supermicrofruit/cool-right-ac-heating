'use client'

import { useState, useRef } from 'react'
import { Camera, Upload, X, Send, CheckCircle, Image as ImageIcon } from 'lucide-react'

interface PhotoUploadFormProps {
  title?: string
  subtitle?: string
  accentColor?: string
  maxPhotos?: number
  onSubmit?: (data: FormData) => void
}

interface FormData {
  name: string
  phone: string
  service: string
  description: string
  photos: File[]
}

const services = [
  'AC Repair',
  'Heating Repair',
  'Installation Quote',
  'Strange Noise/Smell',
  'Water Leak',
  'Not Sure - Need Diagnosis',
]

export default function PhotoUploadForm({
  title = 'Send Us a Photo',
  subtitle = 'Upload a picture of the issue for faster diagnosis',
  accentColor = '#00509d',
  maxPhotos = 3,
  onSubmit,
}: PhotoUploadFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    service: '',
    description: '',
    photos: [],
  })
  const [previews, setPreviews] = useState<string[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newFiles = Array.from(files).slice(0, maxPhotos - formData.photos.length)
    const newPreviews = newFiles.map(file => URL.createObjectURL(file))

    setFormData({ ...formData, photos: [...formData.photos, ...newFiles] })
    setPreviews([...previews, ...newPreviews])
  }

  const removePhoto = (index: number) => {
    const newPhotos = [...formData.photos]
    const newPreviews = [...previews]

    URL.revokeObjectURL(previews[index])
    newPhotos.splice(index, 1)
    newPreviews.splice(index, 1)

    setFormData({ ...formData, photos: newPhotos })
    setPreviews(newPreviews)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <CheckCircle className="h-8 w-8" style={{ color: accentColor }} />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Photos Received!</h3>
        <p className="text-slate-600">
          Our technician will review your photos and call you within 15 minutes with a preliminary assessment.
        </p>
        {formData.photos.length > 0 && (
          <p className="text-sm text-slate-500 mt-2">
            {formData.photos.length} photo{formData.photos.length > 1 ? 's' : ''} uploaded
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Camera className="h-6 w-6" style={{ color: accentColor }} />
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        </div>
        <p className="text-sm text-slate-600">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Photo Upload Area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
            isDragging
              ? 'border-current bg-opacity-5'
              : 'border-slate-200 hover:border-slate-300'
          }`}
          style={isDragging ? { borderColor: accentColor, backgroundColor: `${accentColor}08` } : {}}
        >
          {previews.length > 0 ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 justify-center">
                {previews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Upload ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              {previews.length < maxPhotos && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm font-medium hover:underline"
                  style={{ color: accentColor }}
                >
                  + Add more photos ({maxPhotos - previews.length} remaining)
                </button>
              )}
            </div>
          ) : (
            <div>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: `${accentColor}15` }}
              >
                <ImageIcon className="h-6 w-6" style={{ color: accentColor }} />
              </div>
              <p className="text-slate-600 mb-2">Drag photos here or</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg"
                style={{ backgroundColor: accentColor }}
              >
                <Upload className="h-4 w-4" />
                Choose Files
              </button>
              <p className="text-xs text-slate-400 mt-2">Up to {maxPhotos} photos • JPG, PNG</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="tel"
              placeholder="Phone Number"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <select
            required
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-slate-600"
          >
            <option value="">What's the issue?</option>
            {services.map((service) => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>

        <div>
          <textarea
            placeholder="Describe what you see..."
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none"
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
              Send for Quick Diagnosis
            </>
          )}
        </button>
      </form>
    </div>
  )
}

import { Star, Quote } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

interface Testimonial {
  id: number
  name: string
  location: string
  rating: number
  text: string
  service: string
  date: string
  verified: boolean
}

interface TestimonialCardProps {
  testimonial: Testimonial
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="h-full flex flex-col" padding="lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < testimonial.rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-slate-200'
              }`}
            />
          ))}
        </div>
        <Quote className="h-8 w-8 text-primary/20" />
      </div>

      <p className="text-slate-600 flex-grow mb-4">
        &ldquo;{testimonial.text}&rdquo;
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div>
          <p className="font-medium text-slate-900">{testimonial.name}</p>
          <p className="text-sm text-slate-500">{testimonial.location}</p>
        </div>
        <Badge variant="blue" size="sm">
          {testimonial.service}
        </Badge>
      </div>

      {testimonial.verified && (
        <p className="text-xs text-slate-400 mt-2">Verified Customer</p>
      )}
    </Card>
  )
}

import { Check, Info } from 'lucide-react'
import Container from '@/components/ui/Container'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

const services = [
  {
    name: 'Diagnostic Service Call',
    price: '$89',
    note: 'Waived with repair',
    includes: ['Full system inspection', 'Problem diagnosis', 'Repair recommendations'],
  },
  {
    name: 'AC Tune-Up',
    price: '$89',
    note: 'Per system',
    includes: ['21-point inspection', 'Coil cleaning', 'Filter check', 'Performance test'],
  },
  {
    name: 'Duct Cleaning',
    price: 'Starting at $299',
    note: 'Based on system size',
    includes: ['All supply vents', 'Return vents', 'Main trunk lines', 'Before/after photos'],
  },
  {
    name: 'AC Installation',
    price: 'Starting at $4,500',
    note: 'Includes equipment & labor',
    includes: ['New AC unit', 'Professional installation', '10-year warranty', 'Permit & inspection'],
  },
]

export default function PriceTransparency() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <Container>
        <div className="text-center mb-12">
          <Badge variant="blue" className="mb-4">Transparent Pricing</Badge>
          <h2 className="text-3xl font-heading font-semibold text-slate-900 mb-4">
            Honest, Upfront Pricing
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            We believe you should know what to expect before we arrive. Here are our standard service prices.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {services.map((service, index) => (
            <Card key={index} className="p-6">
              <h3 className="font-heading font-semibold text-slate-900 mb-2">
                {service.name}
              </h3>
              <div className="text-2xl font-bold text-primary mb-1">
                {service.price}
              </div>
              <p className="text-sm text-slate-500 mb-4">{service.note}</p>
              <ul className="space-y-2">
                {service.includes.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <div className="bg-slate-50 rounded-xl p-6 flex items-start gap-4">
          <Info className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Our Price Promise</h4>
            <p className="text-slate-600 text-sm">
              We provide written estimates before any work begins. No hidden fees, no surprise charges.
              If the final cost exceeds the estimate, we&apos;ll explain why before proceeding.
              Your approval is always required for additional work.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}

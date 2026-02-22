import Link from 'next/link'
import { Phone, AlertTriangle, Thermometer, Wind, Droplets, Flame, CheckCircle, XCircle, Clock } from 'lucide-react'
import Container from '@/components/ui/Container'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import SectionDivider from '@/components/ui/SectionDivider'
import CTABanner from '@/components/sections/CTABanner'
import FadeIn, { FadeInStagger } from '@/components/ui/FadeIn'
import businessData from '@/data/business.json'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata = genMeta({
  title: 'Emergency Tips',
  description: `Learn what to do in an emergency. Quick troubleshooting tips and safety guidance for ${businessData.address.city} homeowners when systems fail.`,
})

const emergencyScenarios = [
  {
    icon: Thermometer,
    title: 'AC Not Cooling',
    severity: 'High in Summer',
    immediateSteps: [
      'Check thermostat is set to "cool" and below room temperature',
      'Verify air filter isn\'t severely clogged',
      'Check if outdoor unit is running',
      'Look for ice on refrigerant lines (indicates serious issue)',
      'Close blinds and curtains to reduce heat gain',
    ],
    doNot: [
      'Keep lowering the thermostat—it won\'t help',
      'Pour water on the outdoor unit',
      'Try to add refrigerant yourself',
    ],
    callIf: 'System won\'t start, makes unusual noises, or ice is visible',
  },
  {
    icon: Wind,
    title: 'No Airflow from Vents',
    severity: 'Medium',
    immediateSteps: [
      'Check if fan is set to "auto" or "on"',
      'Replace air filter if clogged',
      'Check if vents are open and unobstructed',
      'Listen for the indoor blower motor running',
      'Check circuit breaker for the air handler',
    ],
    doNot: [
      'Block return air vents trying to increase pressure',
      'Ignore the issue—it can cause system damage',
    ],
    callIf: 'Blower doesn\'t start or makes grinding/squealing sounds',
  },
  {
    icon: Droplets,
    title: 'Water Leak from AC',
    severity: 'High',
    immediateSteps: [
      'Turn off the system immediately',
      'Place towels or buckets to catch water',
      'Check if drain line is clogged (if accessible)',
      'Move furniture away from the leak area',
      'Take photos for insurance if significant damage',
    ],
    doNot: [
      'Ignore small leaks—they grow quickly',
      'Use the vacuum on standing water near electrical',
      'Continue running the system',
    ],
    callIf: 'Any visible water leak from the unit or ceiling',
  },
  {
    icon: Flame,
    title: 'Burning Smell from HVAC',
    severity: 'Critical',
    immediateSteps: [
      'Turn off the system immediately',
      'If smell is strong, leave the house',
      'Do NOT turn the system back on',
      'Check for visible smoke or flames',
      'Call for service before using the system again',
    ],
    doNot: [
      'Ignore a burning smell—ever',
      'Try to restart the system',
      'Open the unit to investigate yourself',
    ],
    callIf: 'Any burning smell requires immediate professional inspection',
  },
]

const safetyTips = [
  {
    title: 'Know Your System\'s Location',
    description: 'Locate your thermostat, indoor unit, outdoor unit, and electrical panel before an emergency.',
  },
  {
    title: 'Keep Emergency Numbers Handy',
    description: 'Save your HVAC contractor\'s number in your phone before you need it.',
  },
  {
    title: 'Maintain a Backup Plan',
    description: 'Have a portable fan or space heater for temporary use during system failures.',
  },
  {
    title: 'Schedule Regular Maintenance',
    description: 'Annual tune-ups catch problems before they become emergencies.',
  },
]

const heatSafetyTips = [
  'Move to the coolest room in the house (usually lower floors)',
  'Close blinds and curtains, especially on south and west-facing windows',
  'Use fans to create air circulation',
  'Stay hydrated—drink water even if you don\'t feel thirsty',
  'Take cool showers or use wet towels on pulse points',
  'Avoid using the oven or stove, which adds heat',
  'Check on elderly neighbors and family members',
  'Go to a public cooling center if your home becomes dangerously hot',
]

export default function EmergencyTipsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-16 md:py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="orange" className="mb-4">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Emergency Guide
            </Badge>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6">
              HVAC Emergency? Here&apos;s What to Do
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              In Phoenix&apos;s extreme climate, HVAC failures can be more than an inconvenience—they can be dangerous.
              Use this guide to troubleshoot safely and know when to call for help.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={`tel:${businessData.phoneRaw}`}
                className="inline-flex items-center justify-center px-6 py-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Phone className="h-5 w-5 mr-2" />
                Emergency Service: {businessData.phone}
              </a>
            </div>
            <p className="text-sm text-slate-500 mt-4">
              <Clock className="h-4 w-4 inline mr-1" />
              24/7 Emergency Service Available
            </p>
          </div>
        </Container>
      </section>

      {/* Emergency Scenarios */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-semibold text-slate-900 mb-4">
              Common HVAC Emergencies
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Quick reference for the most common emergency situations.
            </p>
          </div>

          <div className="space-y-8">
            {emergencyScenarios.map((scenario, index) => {
              const Icon = scenario.icon
              return (
                <FadeInStagger key={index} index={index}>
                  <Card className="p-6 md:p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-heading font-semibold text-slate-900">
                            {scenario.title}
                          </h3>
                          <Badge variant="orange" size="sm">{scenario.severity}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          Do This First
                        </h4>
                        <ul className="space-y-2">
                          {scenario.immediateSteps.map((step, i) => (
                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                              <span className="text-slate-400">•</span>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                          <XCircle className="h-5 w-5 text-red-500" />
                          Don&apos;t Do This
                        </h4>
                        <ul className="space-y-2">
                          {scenario.doNot.map((item, i) => (
                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                              <span className="text-red-400">✕</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-orange-50 rounded-lg p-4">
                        <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                          <Phone className="h-5 w-5" />
                          Call Us If:
                        </h4>
                        <p className="text-sm text-orange-800">{scenario.callIf}</p>
                      </div>
                    </div>
                  </Card>
                </FadeInStagger>
              )
            })}
          </div>
        </Container>
      </section>

      <SectionDivider topColor="white" bottomColor="gray" />

      {/* Heat Safety */}
      <section className="py-16 md:py-24 bg-muted">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <FadeIn>
              <div>
                <Badge variant="orange" className="mb-4">
                  <Thermometer className="h-3 w-3 mr-1" />
                  Heat Safety
                </Badge>
                <h2 className="text-3xl font-heading font-semibold text-slate-900 mb-6">
                  Staying Safe While You Wait
                </h2>
                <p className="text-slate-600 mb-6">
                  In Phoenix summer temperatures, a broken AC can create dangerous conditions quickly.
                  Follow these tips to stay safe while waiting for emergency service.
                </p>
                <ul className="space-y-3">
                  {heatSafetyTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
            <Card className="p-6 bg-red-50 border-red-200">
              <AlertTriangle className="h-8 w-8 text-red-600 mb-4" />
              <h3 className="text-xl font-heading font-semibold text-red-900 mb-4">
                Heat Emergency Warning Signs
              </h3>
              <p className="text-red-800 mb-4">
                Call 911 immediately if anyone shows these symptoms:
              </p>
              <ul className="space-y-2 text-red-800">
                <li>• High body temperature (103°F or higher)</li>
                <li>• Hot, red, dry, or damp skin</li>
                <li>• Fast, strong pulse</li>
                <li>• Confusion or altered mental state</li>
                <li>• Slurred speech</li>
                <li>• Loss of consciousness</li>
              </ul>
              <p className="text-sm text-red-700 mt-4">
                Heat stroke is a medical emergency. Don&apos;t wait.
              </p>
            </Card>
            </FadeIn>
          </div>
        </Container>
      </section>

      <SectionDivider topColor="gray" bottomColor="white" />

      {/* Prevention */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-semibold text-slate-900 mb-4">
              Prevent Emergencies Before They Happen
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              The best emergency is one that never happens. These simple steps can help prevent HVAC failures.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {safetyTips.map((tip, index) => (
              <FadeInStagger key={index} index={index}>
                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{tip.title}</h3>
                  <p className="text-sm text-slate-600">{tip.description}</p>
                </Card>
              </FadeInStagger>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/services/ac-maintenance"
              className="inline-flex items-center text-primary font-medium hover:text-primary/80"
            >
              Learn About Our Maintenance Plans
              <span className="ml-2">→</span>
            </Link>
          </div>
        </Container>
      </section>

      <SectionDivider topColor="white" bottomColor="primary" />

      {/* Emergency Contact */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary/90">
        <Container>
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl font-heading font-semibold mb-6">
              Need Emergency Service Right Now?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Our emergency technicians are available 24/7 to help Phoenix homeowners in crisis.
              We prioritize emergencies and aim to respond as quickly as possible.
            </p>
            <a
              href={`tel:${businessData.phoneRaw}`}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-slate-100 transition-colors text-lg"
            >
              <Phone className="h-6 w-6 mr-3" />
              Call {businessData.phone}
            </a>
            <p className="text-sm text-white/60 mt-4">
              Available 24 hours a day, 7 days a week
            </p>
          </div>
        </Container>
      </section>

      <CTABanner
        title="Schedule Maintenance to Prevent Emergencies"
        description="Regular tune-ups catch problems before they become emergencies."
        fromColor="primary"
      />
    </>
  )
}

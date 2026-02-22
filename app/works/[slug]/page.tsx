import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, MapPin, Clock, Zap, Phone, Check } from 'lucide-react'
import Container from '@/components/ui/Container'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import CTABanner from '@/components/sections/CTABanner'
import businessData from '@/data/business.json'
import worksData from '@/data/works.json'
import { verticalConfig } from '@/lib/verticalConfig'
import { processContent } from '@/lib/copyEngine'

// Import all vertical works for preview fallback
import hvacWorks from '@/content/verticals/hvac/works.json'
import plumbingWorks from '@/content/verticals/plumbing/works.json'
import electricalWorks from '@/content/verticals/electrical/works.json'
import cleaningWorks from '@/content/verticals/cleaning/works.json'
import roofingWorks from '@/content/verticals/roofing/works.json'
import landscapingWorks from '@/content/verticals/landscaping/works.json'

const allVerticalWorks = [hvacWorks, plumbingWorks, electricalWorks, cleaningWorks, roofingWorks, landscapingWorks]

function findVerticalProject(slug: string): any | null {
  for (const vw of allVerticalWorks) {
    const project = (vw as any).projects?.find((p: any) => p.slug === slug)
    if (project) return processContent(project)
  }
  return null
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return worksData.projects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = worksData.projects.find((p) => p.slug === slug) || findVerticalProject(slug)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: `${project.title} | ${project.location} ${verticalConfig.name} Project`,
    description: project.description,
    openGraph: {
      title: `${project.title} | ${businessData.name}`,
      description: project.description,
      type: 'article',
    },
  }
}

export default async function WorkDetailPage({ params }: PageProps) {
  const { slug } = await params
  const project = worksData.projects.find((p) => p.slug === slug) || findVerticalProject(slug)

  if (!project) {
    notFound()
  }

  // Get adjacent projects for navigation
  const currentIndex = worksData.projects.findIndex((p) => p.slug === slug)
  const prevProject = currentIndex > 0 ? worksData.projects[currentIndex - 1] : null
  const nextProject = currentIndex < worksData.projects.length - 1 ? worksData.projects[currentIndex + 1] : null

  // Get related projects (same category, excluding current)
  const relatedProjects = worksData.projects
    .filter((p) => p.category === project.category && p.slug !== slug)
    .slice(0, 2)

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 md:py-20 relative overflow-hidden">
        <Container className="relative">
          <Link
            href="/works"
            className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="blue">{project.category}</Badge>
            <div className="flex items-center text-slate-400 text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              {project.location}
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-6">
            {project.title}
          </h1>

          <p className="text-lg text-slate-300 max-w-3xl">
            {project.description}
          </p>
        </Container>
      </section>

      {/* Before/After */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <span className="text-6xl font-heading font-bold text-red-200">Before</span>
                </div>
              </div>
              <Badge variant="white" className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm">
                Before
              </Badge>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <span className="text-6xl font-heading font-bold text-green-200">After</span>
                </div>
              </div>
              <Badge variant="green" className="absolute top-4 left-4">
                After
              </Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {Object.entries(project.stats).map(([key, value]) => (
              <Card key={key} className="p-6 text-center">
                <div className="text-2xl md:text-3xl font-heading font-bold text-slate-900 mb-1">
                  {value}
                </div>
                <div className="text-sm text-slate-500 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </Card>
            ))}
          </div>

          {/* Services Used */}
          <Card className="p-8">
            <h2 className="text-xl font-heading font-semibold text-slate-900 mb-4">
              Services Provided
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.services.map((service) => (
                <div
                  key={service}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-100 rounded-full"
                >
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">{service}</span>
                </div>
              ))}
            </div>
          </Card>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-12 bg-slate-50">
        <Container>
          <Card className="p-8 md:p-12 bg-gradient-to-br from-primary to-primary/90 border-0">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-heading font-semibold text-white mb-2">
                  Need Similar Work Done?
                </h2>
                <p className="text-white/70">
                  Contact us for a free estimate on your {verticalConfig.tagline} project.
                </p>
              </div>
              <a
                href={`tel:${businessData.phoneRaw}`}
                className="inline-flex items-center px-6 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                <Phone className="h-5 w-5 mr-2" />
                {businessData.phone}
              </a>
            </div>
          </Card>
        </Container>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="py-16 md:py-24">
          <Container>
            <h2 className="text-2xl font-heading font-semibold text-slate-900 mb-8">
              Similar Projects
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedProjects.map((relatedProject) => (
                <Link
                  key={relatedProject.id}
                  href={`/works/${relatedProject.slug}`}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 aspect-[16/9]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl font-heading font-bold text-slate-300/50">
                        {relatedProject.title.charAt(0)}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <Badge variant="white" size="sm" className="self-start mb-2 bg-white/90">
                        {relatedProject.category}
                      </Badge>
                      <h3 className="text-xl font-heading font-semibold text-white group-hover:text-primary/50 transition-colors">
                        {relatedProject.title}
                      </h3>
                      <p className="text-white/80 text-sm">{relatedProject.location}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Project Navigation */}
      <section className="border-t border-slate-200">
        <Container>
          <div className="grid md:grid-cols-2">
            {prevProject ? (
              <Link
                href={`/works/${prevProject.slug}`}
                className="flex items-center py-8 pr-6 border-b md:border-b-0 md:border-r border-slate-200 group"
              >
                <ArrowLeft className="h-5 w-5 text-slate-400 mr-4 group-hover:-translate-x-1 transition-transform" />
                <div>
                  <p className="text-sm text-slate-500 mb-1">Previous Project</p>
                  <p className="font-heading font-semibold text-slate-900 group-hover:text-primary transition-colors">
                    {prevProject.title}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="hidden md:block" />
            )}
            {nextProject ? (
              <Link
                href={`/works/${nextProject.slug}`}
                className="flex items-center justify-end py-8 pl-6 group text-right"
              >
                <div>
                  <p className="text-sm text-slate-500 mb-1">Next Project</p>
                  <p className="font-heading font-semibold text-slate-900 group-hover:text-primary transition-colors">
                    {nextProject.title}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400 ml-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <div className="hidden md:block" />
            )}
          </div>
        </Container>
      </section>
    </>
  )
}

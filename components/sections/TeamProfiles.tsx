import ImageWithFallback from '@/components/ui/ImageWithFallback'
import { Award, Clock } from 'lucide-react'
import Container from '@/components/ui/Container'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import teamData from '@/data/team.json'

export default function TeamProfiles() {
  return (
    <section className="py-16 md:py-24 bg-muted">
      <Container>
        <div className="text-center mb-12">
          <Badge variant="blue" className="mb-4">Our Team</Badge>
          <h2 className="text-3xl font-heading font-semibold text-slate-900 mb-4">
            Meet the Experts
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our team of certified professionals is dedicated to keeping Phoenix homes comfortable year-round.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamData.team.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <div className="relative h-48 bg-slate-200">
                <ImageWithFallback
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading font-semibold text-slate-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-primary font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                  {member.bio}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{member.experience}</span>
                  </div>
                  {member.certifications.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      <span>{member.certifications.length} Certifications</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}

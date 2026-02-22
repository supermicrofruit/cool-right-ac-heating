import ImageWithFallback from '@/components/ui/ImageWithFallback'
import { Linkedin, Award } from 'lucide-react'
import Card from '@/components/ui/Card'

interface Author {
  id: string
  name: string
  role: string
  bio: string
  image: string
  certifications: string[]
  social: {
    linkedin?: string
  }
}

interface AuthorBioProps {
  author: Author
}

export default function AuthorBio({ author }: AuthorBioProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-slate-100">
          <ImageWithFallback
            src={author.image}
            alt={author.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900">{author.name}</h3>
            {author.social?.linkedin && (
              <a
                href={author.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-primary/80 transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
          </div>
          <p className="text-sm text-primary font-medium mb-2">{author.role}</p>
          <p className="text-sm text-slate-600 mb-3">{author.bio}</p>
          {(author.certifications || []).length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Award className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <div className="flex flex-wrap gap-1">
                {(author.certifications || []).map((cert, index) => (
                  <span
                    key={index}
                    className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

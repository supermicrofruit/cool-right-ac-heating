import Link from 'next/link'
import ImageWithFallback from '@/components/ui/ImageWithFallback'
import { ArrowRight, Calendar } from 'lucide-react'
import Card from '@/components/ui/Card'

interface Post {
  slug: string
  title: string
  excerpt: string
  image: string
  date: string
  category: string
}

interface RelatedPostsProps {
  posts: Post[]
  currentSlug: string
}

export default function RelatedPosts({ posts, currentSlug }: RelatedPostsProps) {
  const relatedPosts = posts
    .filter((post) => post.slug !== currentSlug)
    .slice(0, 3)

  if (relatedPosts.length === 0) return null

  return (
    <div className="mt-16 pt-12 border-t border-slate-200">
      <h2 className="text-2xl font-heading font-semibold text-slate-900 mb-8">
        Related Articles
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Card key={post.slug} className="overflow-hidden group">
            <Link href={`/blog/${post.slug}`}>
              <div className="relative h-40 bg-slate-100">
                <ImageWithFallback
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-white/90 text-xs font-medium text-slate-700 rounded">
                    {typeof post.category === 'string' ? post.category : (post.category as any)?.name || 'General'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center text-xs text-slate-500 mb-2">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <span className="inline-flex items-center text-sm text-primary font-medium">
                  Read More
                  <ArrowRight className="h-3 w-3 ml-1" />
                </span>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}

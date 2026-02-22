'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import Container from '@/components/ui/Container'
import Card from '@/components/ui/Card'
import MeshBackground from '@/components/ui/MeshBackground'
import FadeIn, { FadeInStagger } from '@/components/ui/FadeIn'
import ImageWithFallback from '@/components/ui/ImageWithFallback'
import { getBlogSectionContent } from '@/lib/content'
import { useVisualEffects } from '@/lib/gradientPresets'
import { useContentSwap, useVerticalPosts } from '@/lib/useVerticalContent'
import themeData from '@/data/theme.json'
import postsData from '@/data/posts.json'

const blogContent = getBlogSectionContent()

export type BlogStyle = 'cards' | 'list' | 'featured'

function useBlogStyle(): BlogStyle {
  const [style, setStyle] = useState<BlogStyle>(
    ((themeData as any).blogStyle as BlogStyle) || 'cards'
  )

  useEffect(() => {
    function update() {
      try {
        const saved = localStorage.getItem('foundlio-design')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.blogStyle) {
            setStyle(parsed.blogStyle)
            return
          }
        }
      } catch {}
      setStyle(((themeData as any).blogStyle as BlogStyle) || 'cards')
    }
    update()
    window.addEventListener('foundlio-theme-change', update)
    return () => window.removeEventListener('foundlio-theme-change', update)
  }, [])

  return style
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

/* ── Cards: 3-column post cards ── */

function CardsVariant({ posts }: { posts: any[] }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {posts.map((post, index) => (
        <FadeInStagger key={post.slug} index={index}>
          <Link href={`/blog/${post.slug}`} className="block group h-full">
            <Card className="h-full flex flex-col overflow-hidden" padding="none">
              <div className="aspect-[16/9] bg-primary/5 relative overflow-hidden">
                <ImageWithFallback
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(post.date)}</span>
                  {post.readTime && (
                    <>
                      <span>&middot;</span>
                      <span>{post.readTime}</span>
                    </>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground flex-grow line-clamp-2">
                  {post.excerpt}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary mt-4 group-hover:gap-2 transition-all">
                  Read more <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Card>
          </Link>
        </FadeInStagger>
      ))}
    </div>
  )
}

/* ── List: Compact horizontal rows ── */

function ListVariant({ posts }: { posts: any[] }) {
  return (
    <FadeIn delay={0.15}>
      <div className="divide-y divide-border max-w-4xl mx-auto">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="flex gap-5 py-6 first:pt-0 last:pb-0 group"
          >
            <div className="w-24 h-24 md:w-32 md:h-24 bg-primary/5 rounded-lg relative overflow-hidden shrink-0">
              <ImageWithFallback
                src={post.image}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <span>{formatDate(post.date)}</span>
                {post.readTime && (
                  <>
                    <span>&middot;</span>
                    <span>{post.readTime}</span>
                  </>
                )}
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </FadeIn>
  )
}

/* ── Featured: 1 large + 2 smaller ── */

function FeaturedVariant({ posts }: { posts: any[] }) {
  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <FadeIn delay={0.15}>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Large featured card */}
        <Link href={`/blog/${featured.slug}`} className="block group">
          <Card className="h-full overflow-hidden" padding="none">
            <div className="aspect-[16/10] bg-primary/5 relative overflow-hidden">
              <ImageWithFallback
                src={featured.image}
                alt={featured.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(featured.date)}</span>
                {featured.readTime && (
                  <>
                    <span>&middot;</span>
                    <span>{featured.readTime}</span>
                  </>
                )}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {featured.title}
              </h3>
              <p className="text-muted-foreground">{featured.excerpt}</p>
            </div>
          </Card>
        </Link>

        {/* Stacked smaller cards */}
        <div className="flex flex-col gap-6">
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group flex-1">
              <Card className="h-full flex gap-4 items-start" padding="lg">
                <div className="w-20 h-20 bg-primary/5 rounded-lg relative overflow-hidden shrink-0">
                  <ImageWithFallback
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <span>{formatDate(post.date)}</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </FadeIn>
  )
}

/* ── Main Export ── */

export default function BlogSection() {
  const style = useBlogStyle()
  const effects = useVisualEffects()
  const swap = useContentSwap()
  const verticalPosts = useVerticalPosts()

  // Use vertical override posts if available, else deployed data
  const activePostsData = verticalPosts || postsData
  const posts = (activePostsData as any).posts || []
  if (posts.length === 0) return null

  const displayPosts = posts.slice(0, 3)

  return (
    <section className="py-16 md:py-24 bg-muted relative overflow-hidden">
      {effects.meshBackground && <MeshBackground variant="corner" intensity="subtle" />}
      <Container className="relative z-10">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-semibold text-foreground mb-4">
                {swap(blogContent.title)}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {swap(blogContent.subtitle)}
              </p>
            </div>
            <Link
              href="/blog"
              className="mt-6 md:mt-0 inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
            >
              View all posts <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeIn>

        {style === 'cards' && <CardsVariant posts={displayPosts} />}
        {style === 'list' && <ListVariant posts={displayPosts} />}
        {style === 'featured' && <FeaturedVariant posts={displayPosts} />}
      </Container>
    </section>
  )
}

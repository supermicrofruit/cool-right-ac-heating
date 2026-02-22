import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react'
import Container from '@/components/ui/Container'
import Badge from '@/components/ui/Badge'
import FadeIn from '@/components/ui/FadeIn'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import ImageWithFallback from '@/components/ui/ImageWithFallback'
import AuthorBio from '@/components/sections/AuthorBio'
import RelatedPosts from '@/components/sections/RelatedPosts'
import CTABanner from '@/components/sections/CTABanner'
import ShareButtons from '@/components/sections/ShareButtons'
import { generateBlogPostSchema, generateBreadcrumbSchema } from '@/lib/schema'
import businessData from '@/data/business.json'
import postsData from '@/data/posts.json'
import authorsData from '@/data/authors.json'
import { generateDynamicMetadata } from '@/lib/seo'
import { verticalConfig } from '@/lib/verticalConfig'
import BlogSidebar from '@/components/sections/BlogSidebar'
import { processContent } from '@/lib/copyEngine'

// Import all vertical posts for preview fallback
import hvacPosts from '@/content/verticals/hvac/posts.json'
import plumbingPosts from '@/content/verticals/plumbing/posts.json'
import electricalPosts from '@/content/verticals/electrical/posts.json'
import cleaningPosts from '@/content/verticals/cleaning/posts.json'
import roofingPosts from '@/content/verticals/roofing/posts.json'
import landscapingPosts from '@/content/verticals/landscaping/posts.json'

const allVerticalPosts = [hvacPosts, plumbingPosts, electricalPosts, cleaningPosts, roofingPosts, landscapingPosts]

function findVerticalPost(slug: string): any | null {
  for (const vp of allVerticalPosts) {
    const post = (vp as any).posts?.find((p: any) => p.slug === slug)
    if (post) return processContent(post)
  }
  return null
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return postsData.posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = postsData.posts.find((p) => p.slug === slug) || findVerticalPost(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const author = authorsData.authors.find((a) => a.id === post.authorId)
  const metadata = generateDynamicMetadata({
    title: post.metaTitle,
    description: post.metaDescription,
    path: `/blog/${slug}`,
    openGraph: {
      type: 'article',
      publishedTime: post.date,
      authors: author ? [author.name] : [],
    },
  })

  return metadata
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = postsData.posts.find((p) => p.slug === slug) || findVerticalPost(slug)

  if (!post) {
    notFound()
  }

  const author = authorsData.authors.find((a) => a.id === post.authorId)

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Blog', href: '/blog' },
    { label: post.title }
  ]

  // Parse markdown-like content into sections
  const contentSections: { type: string; content: string | string[] }[] = []
  const rawBlocks = post.content.split('\n\n')

  for (const block of rawBlocks) {
    // A block may contain an h2 followed by list items on subsequent lines
    const lines = block.split('\n')
    let i = 0

    while (i < lines.length) {
      const line = lines[i]

      if (line.startsWith('## ')) {
        contentSections.push({ type: 'h2', content: line.replace('## ', '') })
        i++
      } else if (line.startsWith('- ')) {
        // Collect consecutive list items
        const items: string[] = []
        while (i < lines.length && lines[i].startsWith('- ')) {
          items.push(lines[i].replace(/^- /, ''))
          i++
        }
        contentSections.push({ type: 'list', content: items })
      } else if (line.match(/^\d+\.\s/)) {
        const items: string[] = []
        while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
          items.push(lines[i].replace(/^\d+\.\s*/, ''))
          i++
        }
        contentSections.push({ type: 'ordered-list', content: items })
      } else if (line.startsWith('**') && line.endsWith('**')) {
        contentSections.push({ type: 'bold', content: line.replace(/\*\*/g, '') })
        i++
      } else if (line.trim()) {
        contentSections.push({ type: 'paragraph', content: line })
        i++
      } else {
        i++
      }
    }
  }

  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBlogPostSchema(post))
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbItems, 'https://desertairecomfort.com'))
        }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-background to-muted py-12 md:py-20">
        <Container size="md">
          <Breadcrumbs items={breadcrumbItems} />

          <FadeIn direction="up" duration={0.4}>
            <Badge variant="blue" className="mb-4">
              {typeof post.category === 'string' ? post.category : (post.category as any)?.name || 'General'}
            </Badge>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-slate-900 mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
              {author && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{author.name}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>

            <div className="mt-4">
              <ShareButtons title={post.title} slug={slug} />
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* Featured Image */}
      <section className="pt-8">
        <Container size="md">
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden">
            <ImageWithFallback
              src={(post as any).image || `/images/blog/${post.slug}.jpg`}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <Container size="md">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <article className="lg:col-span-2 max-w-none">
              {contentSections.map((section, index) => {
                switch (section.type) {
                  case 'h2':
                    return (
                      <h2 key={index} className="text-xl font-heading font-semibold text-slate-900 mt-10 mb-4">
                        {section.content as string}
                      </h2>
                    )
                  case 'bold':
                    return (
                      <p key={index} className="text-slate-600 mb-5 leading-relaxed">
                        {section.content as string}
                      </p>
                    )
                  case 'list':
                    return (
                      <ul key={index} className="list-disc pl-6 space-y-1.5 mb-5 text-slate-600 leading-relaxed">
                        {(section.content as string[]).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    )
                  case 'ordered-list':
                    return (
                      <ol key={index} className="list-decimal pl-6 space-y-1.5 mb-5 text-slate-600 leading-relaxed">
                        {(section.content as string[]).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ol>
                    )
                  default:
                    return (
                      <p key={index} className="text-slate-600 mb-5 leading-relaxed">
                        {section.content as string}
                      </p>
                    )
                }
              })}

              {/* Author Bio */}
              {author && (
                <div className="mt-12 pt-8 border-t border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">About the Author</h3>
                  <AuthorBio author={author} />
                </div>
              )}

            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <FadeIn direction="right" delay={0.15}>
                <BlogSidebar />
              </FadeIn>
            </aside>
          </div>

          {/* Related Posts — full width */}
          <RelatedPosts posts={postsData.posts} currentSlug={slug} />
        </Container>
      </section>

      <CTABanner
        title={`Ready for Expert ${verticalConfig.serviceName}?`}
        description={`Contact ${businessData.name} for reliable ${verticalConfig.tagline} solutions.`}
      />
    </>
  )
}

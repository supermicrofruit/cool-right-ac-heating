'use client'

import Badge from '@/components/ui/Badge'
import Container from '@/components/ui/Container'
import SectionDivider from '@/components/ui/SectionDivider'
import CTABanner from '@/components/sections/CTABanner'
import BlogPostsGrid from '@/components/sections/BlogPostsGrid'
import postsData from '@/data/posts.json'
import { getPageContent } from '@/lib/content'
import { useVerticalPosts, useContentSwap } from '@/lib/useVerticalContent'

const pageContent = getPageContent('blog')

export default function BlogPageClient() {
  const verticalPosts = useVerticalPosts()
  const swap = useContentSwap()

  const activeData = verticalPosts || postsData
  const posts = (activeData as any).posts || []
  const categories = (activeData as any).categories || []

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-background to-muted py-16 md:py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="blue" className="mb-4">Our Blog</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              {swap(pageContent.heroTitle)}
            </h1>
            <p className="text-lg text-slate-600">
              {swap(pageContent.heroSubtitle)}
            </p>
          </div>
        </Container>
      </section>

      <SectionDivider topColor="gray" bottomColor="white" />

      <BlogPostsGrid posts={posts} categories={categories} />

      <CTABanner
        title={swap(pageContent.ctaTitle)}
        description={swap(pageContent.ctaDescription)}
      />
    </>
  )
}

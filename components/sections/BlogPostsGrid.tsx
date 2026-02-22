'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import Container from '@/components/ui/Container'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import ImageWithFallback from '@/components/ui/ImageWithFallback'
import { FadeInStagger } from '@/components/ui/FadeIn'

function getCategoryName(category: any): string {
  return typeof category === 'string' ? category : category?.name || 'General'
}

function getCategoryKey(category: any): string {
  return typeof category === 'string' ? category : category?.slug || category?.name || 'general'
}

interface BlogPostsGridProps {
  posts: any[]
  categories: any[]
}

export default function BlogPostsGrid({ posts, categories }: BlogPostsGridProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredPosts = activeCategory
    ? posts.filter((post) => getCategoryName(post.category) === activeCategory)
    : posts

  return (
    <>
      {/* Categories */}
      <section className="py-8 border-b border-slate-100">
        <Container>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => setActiveCategory(null)}>
              <Badge variant={activeCategory === null ? 'blue' : 'white'} className="cursor-pointer">
                All Posts
              </Badge>
            </button>
            {categories.map((category: any) => {
              const name = getCategoryName(category)
              return (
                <button key={getCategoryKey(category)} onClick={() => setActiveCategory(name)}>
                  <Badge
                    variant={activeCategory === name ? 'blue' : 'white'}
                    className="cursor-pointer"
                  >
                    {name}
                  </Badge>
                </button>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Blog Posts */}
      <section className="py-16 md:py-24">
        <Container>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">No posts in this category yet.</p>
              <button
                onClick={() => setActiveCategory(null)}
                className="text-primary hover:underline mt-2 text-sm"
              >
                View all posts
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <FadeInStagger key={post.slug} index={index}>
                  <Link href={`/blog/${post.slug}`}>
                    <Card hover className="h-full group overflow-hidden">
                      {/* Featured Image */}
                      <div className="relative h-48 overflow-hidden">
                        <ImageWithFallback
                          src={post.image || `/images/blog/${post.slug}.jpg`}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="p-6">
                        <Badge variant="slate" size="sm" className="mb-3">
                          {getCategoryName(post.category)}
                        </Badge>

                        <h2 className="!text-base !leading-snug font-semibold text-slate-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h2>

                        <p className="text-slate-600 text-xs mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{new Date(post.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center text-primary text-xs font-medium mt-3">
                          Read More
                          <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </FadeInStagger>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  )
}

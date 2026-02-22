'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, X, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import servicesData from '@/data/services.json'
import areasData from '@/data/areas.json'
import postsData from '@/data/posts.json'

interface SearchResult {
  type: 'service' | 'area' | 'blog'
  title: string
  description: string
  href: string
}

export default function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchTerm = query.toLowerCase()
    const newResults: SearchResult[] = []

    // Search services
    servicesData.services.forEach((service) => {
      if (
        service.name.toLowerCase().includes(searchTerm) ||
        service.shortDescription.toLowerCase().includes(searchTerm)
      ) {
        newResults.push({
          type: 'service',
          title: service.name,
          description: service.shortDescription,
          href: `/services/${service.slug}`,
        })
      }
    })

    // Search areas
    areasData.areas.forEach((area) => {
      if (
        area.name.toLowerCase().includes(searchTerm) ||
        area.description.toLowerCase().includes(searchTerm)
      ) {
        newResults.push({
          type: 'area',
          title: `${area.name}, AZ`,
          description: area.description.slice(0, 100) + '...',
          href: `/areas/${area.slug}`,
        })
      }
    })

    // Search blog posts
    postsData.posts.forEach((post) => {
      if (
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm)
      ) {
        newResults.push({
          type: 'blog',
          title: post.title,
          description: post.excerpt,
          href: `/blog/${post.slug}`,
        })
      }
    })

    setResults(newResults.slice(0, 8))
  }, [query])

  const typeLabels = {
    service: 'Service',
    area: 'Area',
    blog: 'Blog',
  }

  const typeColors = {
    service: 'bg-primary/10 text-primary',
    area: 'bg-green-100 text-green-700',
    blog: 'bg-purple-100 text-purple-700',
  }

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-white rounded border border-slate-200">
          ⌘K
        </kbd>
      </button>

      {/* Search Dialog */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50 p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
                  <Search className="h-5 w-5 text-slate-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search services, areas, blog posts..."
                    className="flex-1 text-lg outline-none placeholder:text-slate-400"
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-slate-100 rounded-lg"
                  >
                    <X className="h-5 w-5 text-slate-400" />
                  </button>
                </div>

                {/* Results */}
                <div className="max-h-80 overflow-y-auto">
                  {query && results.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                      No results found for &quot;{query}&quot;
                    </div>
                  )}

                  {results.length > 0 && (
                    <ul className="py-2">
                      {results.map((result, index) => (
                        <li key={index}>
                          <Link
                            href={result.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                          >
                            <span className={`px-2 py-0.5 text-xs font-medium rounded ${typeColors[result.type]}`}>
                              {typeLabels[result.type]}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-slate-900 truncate">
                                {result.title}
                              </div>
                              <div className="text-sm text-slate-500 truncate">
                                {result.description}
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-slate-400 flex-shrink-0 mt-1" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}

                  {!query && (
                    <div className="p-4 text-sm text-slate-500">
                      <p className="mb-2">Quick links:</p>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href="/services"
                          onClick={() => setIsOpen(false)}
                          className="px-3 py-1 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                        >
                          Services
                        </Link>
                        <Link
                          href="/areas"
                          onClick={() => setIsOpen(false)}
                          className="px-3 py-1 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                        >
                          Service Areas
                        </Link>
                        <Link
                          href="/contact"
                          onClick={() => setIsOpen(false)}
                          className="px-3 py-1 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                        >
                          Contact
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

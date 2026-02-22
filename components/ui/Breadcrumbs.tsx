'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const isCentered = className.includes('justify-center')
  return (
    <nav aria-label="Breadcrumb" className={`mb-6 ${className}`}>
      <ol className={`flex items-center flex-wrap gap-1 text-sm ${isCentered ? 'justify-center' : ''}`}>
        <li>
          <Link
            href="/"
            className="flex items-center text-slate-500 hover:text-slate-700 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-slate-300 mx-1" />
            {item.href && index < items.length - 1 ? (
              <Link
                href={item.href}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-900 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

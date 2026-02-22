import Link from 'next/link'
import { Home, Phone, ArrowLeft } from 'lucide-react'
import Container from '@/components/ui/Container'
import businessData from '@/data/business.json'

export default function NotFound() {
  return (
    <section className="min-h-[80vh] flex items-center bg-gradient-to-b from-background to-muted">
      <Container size="sm">
        <div className="text-center py-16">
          <div className="text-8xl font-bold text-primary/20 mb-4">404</div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved or no longer exists.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
            >
              <Home className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <a
              href={`tel:${businessData.phoneRaw}`}
              className="inline-flex items-center px-6 py-3 bg-white text-slate-900 font-semibold rounded-lg border-2 border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <Phone className="h-5 w-5 mr-2" />
              {businessData.phone}
            </a>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500 mb-3">Looking for something specific?</p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <Link href="/services" className="text-primary hover:underline">Our Services</Link>
              <span className="text-slate-300">|</span>
              <Link href="/about" className="text-primary hover:underline">About Us</Link>
              <span className="text-slate-300">|</span>
              <Link href="/contact" className="text-primary hover:underline">Contact</Link>
              <span className="text-slate-300">|</span>
              <Link href="/blog" className="text-primary hover:underline">Blog</Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema'
import themeData from '@/data/theme.json'
import { fontClasses } from '@/lib/fonts'
import { DevProvider, DesignPanel, LogoMaker } from '@/components/dev'
import { getRootMetadata } from '@/lib/seo'
import FeatureWidgets from '@/components/layout/FeatureWidgets'

// Build theme class string from theme.json
const themeClasses = [
  `theme-${themeData.colors}`,
  `radius-${themeData.radius}`,
  `fonts-${themeData.fonts}`,
  themeData.pageStyle ? `page-style-${themeData.pageStyle}` : '',
].filter(Boolean).join(' ')

// Use SEO config from business.json for consistent branding across all pages
export const metadata: Metadata = getRootMetadata()

// Blocking script to apply theme from localStorage before React hydrates
// This prevents the "flash of wrong color" on page load
// Script runs immediately when body is available
const themeScript = `
(function() {
  try {
    var saved = localStorage.getItem('foundlio-design');
    if (saved) {
      var theme = JSON.parse(saved);
      var body = document.body;
      if (theme.colors) {
        body.className = body.className.replace(/theme-[a-z-]+/g, 'theme-' + theme.colors);
      }
      if (theme.radius) {
        body.className = body.className.replace(/radius-[a-z-]+/g, 'radius-' + theme.radius);
      }
      if (theme.fonts) {
        body.className = body.className.replace(/fonts-[a-z-]+/g, 'fonts-' + theme.fonts);
      }
      if (theme.pageStyle) {
        body.className = body.className.replace(/page-style-[a-z-]+/g, 'page-style-' + theme.pageStyle);
      }
    }
    var darkMode = localStorage.getItem('foundlio-dark-mode');
    if (darkMode === 'true' || (darkMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.body.classList.add('dark');
    }
  } catch (e) {}
})();
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={fontClasses} suppressHydrationWarning>
      <head>
        <LocalBusinessSchema />
      </head>
      <body className={`min-h-screen flex flex-col font-body ${themeClasses}`} suppressHydrationWarning>
        {/* Blocking script - runs before React hydrates to prevent color flash */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <DevProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <FeatureWidgets />
          <DesignPanel />
          <LogoMaker />
        </DevProvider>
      </body>
    </html>
  )
}

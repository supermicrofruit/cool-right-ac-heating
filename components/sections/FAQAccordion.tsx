'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Plus, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Container from '@/components/ui/Container'
import FadeIn from '@/components/ui/FadeIn'
import themeData from '@/data/theme.json'

interface FAQ {
  question: string
  answer: string
}

export type FAQStyle = 'accordion' | 'two-column' | 'cards' | 'minimal'

interface FAQAccordionProps {
  faqs: FAQ[]
  title?: string
  description?: string
  showSchema?: boolean
  faqStyle?: FAQStyle
}

function useFaqStyle(): FAQStyle {
  const [style, setStyle] = useState<FAQStyle>(
    ((themeData as any).faqStyle as FAQStyle) || 'accordion'
  )

  useEffect(() => {
    function update() {
      try {
        const saved = localStorage.getItem('foundlio-design')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.faqStyle) {
            setStyle(parsed.faqStyle)
            return
          }
        }
      } catch {}
      setStyle(((themeData as any).faqStyle as FAQStyle) || 'accordion')
    }
    update()
    window.addEventListener('foundlio-theme-change', update)
    return () => window.removeEventListener('foundlio-theme-change', update)
  }, [])

  return style
}

/* ── Accordion: classic stacked expand/collapse ── */
function FAQAccordionVariant({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <FadeIn delay={0.15}>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <button
              id={`faq-trigger-${index}`}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex items-center justify-between w-full px-6 py-4 text-left"
              aria-expanded={openIndex === index}
              aria-controls={`faq-panel-${index}`}
            >
              <span className="font-medium text-foreground pr-4">
                {faq.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${index}`}
                >
                  <div className="px-6 pb-4 text-muted-foreground">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </FadeIn>
  )
}

/* ── Two-Column: questions left, selected answer right ── */
function FAQTwoColumn({ faqs }: { faqs: FAQ[] }) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <FadeIn delay={0.15}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: question list */}
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-200 ${
                activeIndex === index
                  ? 'bg-primary/10 border-l-4 border-primary'
                  : 'hover:bg-muted/50 border-l-4 border-transparent'
              }`}
            >
              <span
                className={`font-medium ${
                  activeIndex === index
                    ? 'text-primary'
                    : 'text-foreground'
                }`}
              >
                {faq.question}
              </span>
            </button>
          ))}
        </div>

        {/* Right: answer panel */}
        <div className="bg-card rounded-2xl border border-border p-8 lg:sticky lg:top-32 lg:self-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {faqs[activeIndex]?.question}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {faqs[activeIndex]?.answer}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </FadeIn>
  )
}

/* ── Cards: grid of expandable cards ── */
function FAQCards({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <FadeIn delay={0.15}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index
          return (
            <div
              key={index}
              className={`bg-card rounded-2xl border transition-all duration-200 ${
                isOpen
                  ? 'border-primary/30 shadow-lg shadow-primary/5'
                  : 'border-border hover:border-primary/20'
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex items-start justify-between w-full p-6 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-medium text-foreground pr-4 text-[15px]">
                  {faq.question}
                </span>
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 ${
                    isOpen
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isOpen ? (
                    <Minus className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6 text-muted-foreground text-[15px] leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </FadeIn>
  )
}

/* ── Minimal: clean divider lines, no cards ── */
function FAQMinimal({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <FadeIn delay={0.15}>
      <div className="divide-y divide-border">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index
          return (
            <div key={index} className="py-5 first:pt-0 last:pb-0">
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex items-center justify-between w-full text-left group"
                aria-expanded={isOpen}
              >
                <span className="font-medium text-foreground pr-6 group-hover:text-primary transition-colors">
                  {faq.question}
                </span>
                <span
                  className={`text-muted-foreground transition-transform duration-200 ${
                    isOpen ? 'rotate-45' : ''
                  }`}
                >
                  <Plus className="h-5 w-5" />
                </span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="mt-3 text-muted-foreground leading-relaxed max-w-3xl">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </FadeIn>
  )
}

export default function FAQAccordion({
  faqs,
  title = "Frequently Asked Questions",
  description,
  showSchema = true,
  faqStyle,
}: FAQAccordionProps) {
  const themeFaqStyle = useFaqStyle()
  const activeStyle = faqStyle || themeFaqStyle

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  // Two-column uses wider container
  const containerSize = activeStyle === 'two-column' || activeStyle === 'cards' ? 'lg' : 'md'

  return (
    <section className="py-12 md:py-16 bg-background">
      <Container size={containerSize}>
        {showSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}

        {title && (
          <FadeIn>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
                {title}
              </h2>
              {description && (
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {description}
                </p>
              )}
            </div>
          </FadeIn>
        )}

        {activeStyle === 'accordion' && <FAQAccordionVariant faqs={faqs} />}
        {activeStyle === 'two-column' && <FAQTwoColumn faqs={faqs} />}
        {activeStyle === 'cards' && <FAQCards faqs={faqs} />}
        {activeStyle === 'minimal' && <FAQMinimal faqs={faqs} />}
      </Container>
    </section>
  )
}

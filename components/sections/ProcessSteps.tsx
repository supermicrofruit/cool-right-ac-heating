'use client'

import { useState, useEffect } from 'react'
import { Phone, Calendar, Wrench, ThumbsUp, ClipboardCheck, PhoneCall, type LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import { getProcessSectionContent } from '@/lib/content'
import { useVisualEffects } from '@/lib/gradientPresets'
import { useVerticalContentJson } from '@/lib/useVerticalContent'
import themeData from '@/data/theme.json'

const processContent = getProcessSectionContent()
const defaultStepIcons = [Phone, Calendar, Wrench, ThumbsUp]

const stepIconMap: Record<string, LucideIcon> = {
  Phone, PhoneCall, Calendar, Wrench, ThumbsUp, ClipboardCheck,
}

const defaultSteps = processContent.steps.map((step, index) => ({
  icon: defaultStepIcons[index] || ThumbsUp,
  title: step.title,
  description: step.description,
}))

// Get process style from localStorage or theme.json
function getProcessStyle(): string {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('foundlio-design')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.processStyle) return parsed.processStyle
      }
    } catch (e) {
      // Ignore
    }
  }
  return (themeData as Record<string, unknown>).processStyle as string || 'cards'
}

type StepItem = { icon: LucideIcon; title: string; description: string }

// Variant 1: Cards (default) - Icon boxes in a grid
function ProcessCards({ steps, hasGradient = false }: { steps: StepItem[]; hasGradient?: boolean }) {
  return (
    <div className="grid md:grid-cols-4 gap-8">
      {steps.map((step, index) => (
        <motion.div
          key={step.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="relative text-center"
        >
          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div className={`hidden md:block absolute top-10 left-[calc(66%-1px)] w-[80%] h-0.5 ${
              hasGradient ? 'bg-gradient-theme' : 'bg-border'
            }`} />
          )}

          {/* Step Number */}
          <div className="relative inline-flex">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 ${
              hasGradient
                ? 'bg-gradient-to-br from-[hsl(var(--gradient-from)/0.1)] to-[hsl(var(--gradient-to)/0.1)]'
                : 'bg-primary/10'
            }`}>
              <step.icon className="h-8 w-8 text-primary" />
            </div>
            <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
              hasGradient ? 'bg-gradient-theme' : 'bg-primary'
            }`}>
              {index + 1}
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-2">
            {step.title}
          </h3>
          <p className="text-muted-foreground text-sm">
            {step.description}
          </p>
        </motion.div>
      ))}
    </div>
  )
}

// Variant 2: Timeline - Vertical timeline with alternating sides
function ProcessTimeline({ steps }: { steps: StepItem[] }) {
  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Center line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block" />

      {steps.map((step, index) => (
        <motion.div
          key={step.title}
          initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className={`relative flex items-center gap-8 mb-12 last:mb-0 ${
            index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
          }`}
        >
          {/* Content */}
          <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {step.title}
            </h3>
            <p className="text-muted-foreground">
              {step.description}
            </p>
          </div>

          {/* Center icon */}
          <div className="relative z-10 flex-shrink-0">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <step.icon className="h-7 w-7 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-background border-2 border-primary rounded-full flex items-center justify-center text-primary font-bold text-xs">
              {index + 1}
            </div>
          </div>

          {/* Spacer for alternating layout */}
          <div className="flex-1 hidden md:block" />
        </motion.div>
      ))}
    </div>
  )
}

// Variant 3: Numbered - Large numbers with horizontal layout
function ProcessNumbered({ steps }: { steps: StepItem[] }) {
  return (
    <div className="space-y-8">
      {steps.map((step, index) => (
        <motion.div
          key={step.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="flex items-start gap-6 p-6 bg-card rounded-xl border border-border"
        >
          {/* Large number */}
          <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
            <span className="text-3xl font-bold text-primary">{index + 1}</span>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <step.icon className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">
                {step.title}
              </h3>
            </div>
            <p className="text-muted-foreground">
              {step.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function useProcessData() {
  const verticalContent = useVerticalContentJson()

  if (verticalContent?.processSection?.steps?.length) {
    const ps = verticalContent.processSection
    return {
      title: ps.headline || ps.title || processContent.title,
      subtitle: ps.description || ps.subtitle || processContent.subtitle,
      steps: ps.steps.map((step: any, index: number) => ({
        icon: stepIconMap[step.icon] || defaultStepIcons[index] || ThumbsUp,
        title: step.title,
        description: step.description,
      })),
    }
  }

  return {
    title: processContent.title,
    subtitle: processContent.subtitle,
    steps: defaultSteps,
  }
}

export default function ProcessSteps() {
  const [processStyle, setProcessStyle] = useState('cards')
  const [mounted, setMounted] = useState(false)
  const effects = useVisualEffects()
  const hasGradient = effects.gradientStyle !== 'none'
  const { title, subtitle, steps } = useProcessData()

  useEffect(() => {
    setMounted(true)
    setProcessStyle(getProcessStyle())

    // Listen for theme changes
    const handleThemeChange = () => {
      setProcessStyle(getProcessStyle())
    }
    window.addEventListener('foundlio-theme-change', handleThemeChange)
    return () => window.removeEventListener('foundlio-theme-change', handleThemeChange)
  }, [])

  const renderProcess = () => {
    if (!mounted) return <ProcessCards steps={steps} hasGradient={hasGradient} />

    switch (processStyle) {
      case 'timeline':
        return <ProcessTimeline steps={steps} />
      case 'numbered':
        return <ProcessNumbered steps={steps} />
      case 'cards':
      default:
        return <ProcessCards steps={steps} hasGradient={hasGradient} />
    }
  }

  return (
    <section className="py-16 md:py-24 bg-background">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {renderProcess()}
      </Container>
    </section>
  )
}

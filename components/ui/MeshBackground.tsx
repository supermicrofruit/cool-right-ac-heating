'use client'

import { cn } from '@/lib/utils'

interface MeshBackgroundProps {
  intensity?: 'subtle' | 'medium' | 'strong'
  variant?: 'blobs' | 'corner' | 'full'
  className?: string
}

/**
 * Pure CSS mesh gradient background using positioned blurred blobs.
 * No JS animation — just radial gradient fills with blur.
 * Uses --gradient-from, --gradient-to, --gradient-accent CSS variables.
 */
export default function MeshBackground({
  intensity = 'subtle',
  variant = 'blobs',
  className,
}: MeshBackgroundProps) {
  const opacityMap = {
    subtle: { blob1: 'opacity-[0.07]', blob2: 'opacity-[0.05]', blob3: 'opacity-[0.04]' },
    medium: { blob1: 'opacity-[0.12]', blob2: 'opacity-[0.09]', blob3: 'opacity-[0.07]' },
    strong: { blob1: 'opacity-[0.18]', blob2: 'opacity-[0.14]', blob3: 'opacity-[0.10]' },
  }

  const o = opacityMap[intensity]

  // Position configs per variant
  const positions = {
    blobs: {
      blob1: '-top-32 -left-32 w-[500px] h-[500px]',
      blob2: '-bottom-24 -right-24 w-[400px] h-[400px]',
      blob3: 'top-1/3 right-1/4 w-[300px] h-[300px] hidden sm:block',
    },
    corner: {
      blob1: '-top-40 -right-40 w-[600px] h-[600px]',
      blob2: 'bottom-0 -left-20 w-[350px] h-[350px]',
      blob3: 'top-1/2 left-1/3 w-[250px] h-[250px] hidden sm:block',
    },
    full: {
      blob1: 'top-0 left-1/4 w-[600px] h-[600px]',
      blob2: 'bottom-0 right-0 w-[500px] h-[500px]',
      blob3: 'top-1/2 -left-20 w-[400px] h-[400px] hidden sm:block',
    },
  }

  const pos = positions[variant]

  return (
    <div
      className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}
      aria-hidden="true"
    >
      {/* Blob 1 — gradient-from color */}
      <div
        className={cn(
          'absolute rounded-full will-change-transform',
          pos.blob1,
          o.blob1
        )}
        style={{
          background: 'radial-gradient(circle, hsl(var(--gradient-from)) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      {/* Blob 2 — gradient-to color */}
      <div
        className={cn(
          'absolute rounded-full will-change-transform',
          pos.blob2,
          o.blob2
        )}
        style={{
          background: 'radial-gradient(circle, hsl(var(--gradient-to)) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      {/* Blob 3 — gradient-accent color (hidden on mobile) */}
      <div
        className={cn(
          'absolute rounded-full will-change-transform',
          pos.blob3,
          o.blob3
        )}
        style={{
          background: 'radial-gradient(circle, hsl(var(--gradient-accent)) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
    </div>
  )
}

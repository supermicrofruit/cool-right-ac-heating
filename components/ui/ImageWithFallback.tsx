'use client'

import { useState } from 'react'
import Image, { ImageProps } from 'next/image'

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError'> {
  fallbackClassName?: string
}

export default function ImageWithFallback({
  alt,
  fallbackClassName,
  className,
  ...props
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 ${fallbackClassName || className || ''}`}
        style={props.fill ? { position: 'absolute', inset: 0 } : { width: props.width, height: props.height }}
      >
        <span className="text-primary/30 text-5xl font-bold">
          {alt?.charAt(0)?.toUpperCase() || '?'}
        </span>
      </div>
    )
  }

  return (
    <Image
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  )
}

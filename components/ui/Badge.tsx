import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'blue' | 'green' | 'orange' | 'slate' | 'white'
  size?: 'sm' | 'md'
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'blue', size = 'md', children, ...props }, ref) => {
    const variants = {
      blue: 'bg-primary/10 text-primary',
      green: 'bg-green-100 text-green-700',
      orange: 'bg-orange-100 text-orange-700',
      slate: 'bg-slate-100 text-slate-700',
      white: 'bg-white text-slate-700 border border-slate-200',
    }

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full font-medium',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge

import * as React from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '#/shared/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-[var(--radius-full)] border px-2.5 py-0.5 text-badge whitespace-nowrap transition-colors [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0',
  {
    variants: {
      tone: {
        neutral: 'border-frost bg-surface-2 text-muted-text',
        orange:
          'border-accent-orange-border bg-accent-orange-dim text-accent-orange',
        blue: 'border-accent-blue/20 bg-accent-blue-dim text-accent-blue',
        green:
          'border-accent-green-border bg-accent-green-dim text-accent-green',
        yellow:
          'border-accent-yellow/20 bg-accent-yellow/10 text-accent-yellow',
        red: 'border-accent-red/20 bg-accent-red/10 text-accent-red',
        purple:
          'border-accent-purple-border bg-accent-purple-dim text-accent-purple',
      },
      variant: {
        soft: '',
        solid: 'border-transparent',
        outline: 'bg-transparent',
      },
      size: {
        sm: 'h-5 px-2 text-[11px]',
        md: 'h-6 px-2.5 text-xs',
      },
    },
    compoundVariants: [
      {
        variant: 'solid',
        tone: 'orange',
        className: 'bg-accent-orange text-accent-on',
      },
      {
        variant: 'solid',
        tone: 'blue',
        className: 'bg-accent-blue text-near-white',
      },
      {
        variant: 'solid',
        tone: 'green',
        className: 'bg-accent-green text-accent-on',
      },
      {
        variant: 'solid',
        tone: 'red',
        className: 'bg-accent-red text-near-white',
      },
      {
        variant: 'solid',
        tone: 'neutral',
        className: 'bg-surface-2 text-near-white',
      },
    ],
    defaultVariants: {
      tone: 'neutral',
      variant: 'soft',
      size: 'md',
    },
  },
)

export type BadgeTone = NonNullable<VariantProps<typeof badgeVariants>['tone']>

export interface BadgeProps
  extends React.ComponentProps<'span'>, VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

function Badge({
  className,
  tone,
  variant,
  size,
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot.Root : 'span'
  return (
    <Comp
      data-slot="badge"
      data-tone={tone ?? 'neutral'}
      data-variant={variant ?? 'soft'}
      className={cn(badgeVariants({ tone, variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

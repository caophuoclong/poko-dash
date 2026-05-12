import * as React from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '#/shared/utils'

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap transition-all outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          'bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-primary-active)] rounded-[var(--radius-sm)] h-12',
        destructive:
          'bg-[var(--color-primary-error)] text-[var(--color-on-primary)] hover:bg-[var(--color-primary-error)]/90 rounded-[var(--radius-sm)]',
        outline:
          'border border-[var(--color-ink)] bg-[var(--color-canvas)] text-[var(--color-ink)] hover:bg-[var(--color-surface-soft)] rounded-[var(--radius-sm)]',
        secondary:
          'bg-[var(--color-surface-soft)] text-[var(--color-ink)] hover:bg-[var(--color-surface-strong)] rounded-[var(--radius-sm)]',
        ghost:
          'hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-ink)] rounded-[var(--radius-sm)] hover:underline',
        link: 'text-[var(--color-primary)] underline-offset-4 hover:underline rounded-[var(--radius-sm)]',
        pill: 'bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-primary-active)] rounded-[var(--radius-full)] px-[20px] py-[10px]',
      },
      size: {
        default: 'h-12 px-4 text-button-md has-[>svg]:px-3',
        xs: "h-6 gap-1 px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3 rounded-[var(--radius-sm)]",
        sm: 'h-9 gap-1.5 px-3 text-button-sm has-[>svg]:px-2.5 rounded-[var(--radius-sm)]',
        lg: 'h-12 px-6 text-button-md has-[>svg]:px-4 rounded-[var(--radius-sm)]',
        icon: 'size-12 rounded-[var(--radius-sm)]',
        'icon-xs':
          "size-6 rounded-[var(--radius-sm)] [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8 rounded-[var(--radius-sm)]',
        'icon-lg': 'size-10 rounded-[var(--radius-sm)]',
      },
      color: {
        blue: 'bg-accent-blue text-near-white hover:bg-accent-blue/90',
        'blue-dim':
          'bg-accent-blue-dim text-accent-blue hover:bg-accent-blue-dim/80 border border-accent-blue/20',
        red: 'bg-accent-red text-near-white hover:bg-accent-red/90',
        green: 'bg-accent-green text-near-white hover:bg-accent-green/90',
        'green-dim':
          'bg-accent-green-dim text-accent-green hover:bg-accent-green-dim/80 border border-accent-green-border',
        yellow: 'bg-accent-yellow text-near-white hover:bg-accent-yellow/90',
        orange: 'bg-accent-orange text-near-white hover:bg-accent-orange/90',
        'orange-light':
          'bg-accent-orange-light text-near-white hover:bg-accent-orange-light/90',
        'orange-dim':
          'bg-accent-orange-dim text-accent-orange hover:bg-accent-orange-dim/80 border border-accent-orange-border',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  color,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-color={color}
      className={cn(buttonVariants({ variant, size, color, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

import { cn } from '#/shared/utils'
import * as React from 'react'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex field-sizing-content min-h-16 w-full rounded-[var(--radius-sm)] border border-[var(--color-hairline)] bg-transparent px-3 py-2 text-base transition-[color,border] outline-none placeholder:text-[var(--color-muted-soft)] focus-visible:border-[var(--color-ink)] focus-visible:border-2 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:text-[var(--color-primary-error)]',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }

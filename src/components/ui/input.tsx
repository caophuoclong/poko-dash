import * as React from 'react'

import { cn } from '#/shared/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-14 w-full min-w-0 rounded-[var(--radius-sm)] border border-[var(--color-hairline)] bg-transparent px-3 py-1 text-base transition-[color,border] outline-none selection:bg-[var(--color-primary)] selection:text-[var(--color-on-primary)] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--color-ink)] placeholder:text-[var(--color-muted-soft)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-[var(--color-ink)] focus-visible:border-2',
        'aria-invalid:text-[var(--color-primary-error)]',
        className,
      )}
      {...props}
    />
  )
}

export { Input }

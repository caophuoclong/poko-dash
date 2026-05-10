import { cn } from '#/shared/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'animate-pulse rounded-[var(--radius-sm)] bg-[var(--color-surface-strong)]',
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }

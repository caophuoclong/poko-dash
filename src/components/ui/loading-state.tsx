import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '#/shared/utils'

interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode
  variant?: 'card' | 'inline' | 'block'
}

function LoadingState({
  label = 'Đang tải...',
  variant = 'card',
  className,
  ...props
}: LoadingStateProps) {
  return (
    <div
      data-slot="loading-state"
      data-variant={variant}
      className={cn(
        'flex items-center justify-center gap-2 text-sm text-muted-text',
        variant === 'card' &&
          'rounded-2xl border border-frost bg-surface/30 px-6 py-12',
        variant === 'block' && 'py-12',
        variant === 'inline' && 'py-2',
        className,
      )}
      {...props}
    >
      <Loader2 className="size-4 animate-spin" />
      {label ? <span>{label}</span> : null}
    </div>
  )
}

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn('animate-pulse rounded-md bg-surface-2', className)}
      {...props}
    />
  )
}

export { LoadingState, Skeleton }

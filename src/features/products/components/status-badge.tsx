import { cn } from '#/shared/utils'

type BadgeVariant = 'green' | 'red' | 'yellow' | 'blue' | 'gray'

const variantStyles: Record<BadgeVariant, string> = {
  green: 'bg-accent-green-dim text-accent-green',
  red: 'bg-accent-red/10 text-accent-red',
  yellow: 'bg-accent-yellow/10 text-accent-yellow',
  blue: 'bg-accent-blue-dim text-accent-blue',
  gray: 'bg-surface-2 text-muted-text',
}

interface StatusBadgeProps {
  label: string
  variant: BadgeVariant
  className?: string
}

export default function StatusBadge({
  label,
  variant,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-xs font-medium',
        variantStyles[variant],
        className,
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          variant === 'green' && 'bg-accent-green',
          variant === 'red' && 'bg-accent-red',
          variant === 'yellow' && 'bg-accent-yellow',
          variant === 'blue' && 'bg-accent-blue',
          variant === 'gray' && 'bg-muted-text',
        )}
      />
      {label}
    </span>
  )
}

export function productStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case 'active':
      return 'green'
    case 'processing':
      return 'yellow'
    case 'done':
      return 'blue'
    case 'failed':
      return 'red'
    default:
      return 'gray'
  }
}

export function deeplinkStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case 'valid':
      return 'green'
    case 'broken':
      return 'red'
    case 'pending':
      return 'yellow'
    case 'expired':
      return 'gray'
    default:
      return 'gray'
  }
}

import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { cn } from '#/shared/utils'

interface VariableBadgeProps {
  valid: boolean
  count: number
  hasMixed: boolean
}

export function VariableBadge({ valid, count, hasMixed }: VariableBadgeProps) {
  if (count === 0) return null
  const Icon = valid ? CheckCircle2 : AlertTriangle
  const tone = valid
    ? 'bg-accent-green-dim text-accent-green'
    : 'bg-accent-yellow/10 text-accent-yellow'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium',
        tone,
      )}
    >
      <Icon size={11} />
      {count} variable{count !== 1 ? 's' : ''}
      {hasMixed && ' (mixed)'}
    </span>
  )
}

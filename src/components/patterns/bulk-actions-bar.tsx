import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BulkActionsBarProps {
  selectedCount: number
  onClear: () => void
  children?: React.ReactNode
}

export function BulkActionsBar({
  selectedCount,
  onClear,
  children,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-accent-blue-dim border border-accent-blue/20 rounded-[var(--radius-sm)] animate-fade-up">
      <span className="text-sm font-medium text-accent-blue">
        {selectedCount} selected
      </span>
      <div className="flex items-center gap-2">{children}</div>
      <Button
        variant="ghost"
        size="icon"
        className="ml-auto size-7 text-[var(--color-muted)] hover:text-[var(--color-ink)]"
        onClick={onClear}
      >
        <X size={14} />
      </Button>
    </div>
  )
}

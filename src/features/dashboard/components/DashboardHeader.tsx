import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import type { DashboardRange } from '#/dtos/dashboard'
import { cn } from '#/shared/utils'

interface DashboardHeaderProps {
  selectedRange: DashboardRange
  onRangeChange: (range: DashboardRange) => void
  onRefresh?: () => void
  isRefreshing?: boolean
}

const RANGE_OPTIONS: { value: DashboardRange; label: string }[] = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
]

export function DashboardHeader({
  selectedRange,
  onRangeChange,
  onRefresh,
  isRefreshing,
}: DashboardHeaderProps) {
  return (
    <PageHeader
      title="Dashboard"
      subtitle="Content pipeline overview and operational metrics"
      actions={
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center rounded-lg border border-frost bg-surface p-0.5">
            {RANGE_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant="ghost"
                size="sm"
                onClick={() => onRangeChange(option.value)}
                className={cn(
                  'h-7 px-3 text-xs font-medium',
                  selectedRange === option.value
                    ? 'bg-accent-orange text-accent-on'
                    : 'text-muted-text hover:text-near-white',
                )}
              >
                {option.label}
              </Button>
            ))}
          </div>
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="h-8 px-2"
            >
              <RefreshCw
                size={16}
                className={cn(isRefreshing && 'animate-spin')}
              />
            </Button>
          )}
        </div>
      }
    />
  )
}

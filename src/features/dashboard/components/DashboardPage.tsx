import { useState } from 'react'
import { useDashboardOverview } from '../hooks/use-dashboard'
import { usePageHeader } from '@/components/ui/page-header-context'
import { SummaryCardGrid } from './SummaryCardGrid'
import { PipelineSnapshot } from './PipelineSnapshot'
import { TrendChartsSection } from './TrendChartsSection'
import { AttentionList } from './AttentionList'
import { UpcomingScheduleList } from './UpcomingScheduleList'
import { TopBreakdownsSection } from './TopBreakdownsSection'
import { DashboardSkeleton } from './DashboardSkeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { useNavigate } from '@tanstack/react-router'
import { Plus, RefreshCw } from 'lucide-react'
import { cn } from '#/shared/utils'
import type { DashboardOverviewResponseDtoRange } from '#/api/model'

const RANGE_OPTIONS: {
  value: DashboardOverviewResponseDtoRange
  label: string
}[] = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
]

export default function DashboardPage() {
  const [selectedRange, setSelectedRange] =
    useState<DashboardOverviewResponseDtoRange>('7d')
  const navigate = useNavigate()

  const { data, isLoading, isError, refetch, isRefetching } =
    useDashboardOverview(selectedRange)

  const handleRefresh = () => {
    refetch()
  }

  usePageHeader({
    title: 'Dashboard',
    subtitle: 'Content pipeline overview and operational metrics',
    actions: (
      <div className="flex items-center gap-2">
        <div className="inline-flex items-center rounded-lg border border-frost bg-surface p-0.5">
          {RANGE_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRange(option.value)}
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
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefetching}
          className="h-8 px-2"
        >
          <RefreshCw size={16} className={cn(isRefetching && 'animate-spin')} />
        </Button>
      </div>
    ),
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <DashboardSkeleton />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <EmptyState
          variant="page"
          icon="alert"
          title="Failed to load dashboard"
          description="Unable to fetch dashboard data. Please try again."
          primaryAction={<Button onClick={handleRefresh}>Retry</Button>}
        />
      </div>
    )
  }

  // Check if this is a completely empty state (no data at all)
  const isEmpty =
    (data.summaryCards || []).every((card) => card.value === 0) &&
    (Object.keys(data.pipelineSnapshot) || []).every(() => Boolean) &&
    (data.attentionItems || []).length === 0 &&
    (data.upcomingSchedule || []).length === 0

  if (isEmpty) {
    return (
      <div className="space-y-6">
        <EmptyState
          variant="page"
          icon="rocket"
          title="Welcome to your dashboard"
          description="Start by creating content seeds, adding products, and generating posts to see your pipeline metrics here."
          primaryAction={
            <Button onClick={() => navigate({ to: '/dash/content/new' })}>
              <Plus size={16} className="mr-1.5" />
              Create first seed
            </Button>
          }
          secondaryAction={
            <Button
              variant="ghost"
              onClick={() => navigate({ to: '/dash/products' })}
            >
              Add products
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <SummaryCardGrid cards={data.summaryCards} />

      {/* Pipeline snapshot */}
      <PipelineSnapshot statuses={data.pipelineSnapshot || []} />

      {/* Trend charts */}
      <TrendChartsSection
        postsGenerated={data.trendSeries.postsGenerated}
        postsPublished={data.trendSeries.postsPublished}
        seedsApproved={data.trendSeries.seedsApproved}
      />

      {/* Two-column layout for attention and schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <AttentionList items={data.attentionItems} />
        <UpcomingScheduleList items={data.upcomingSchedule} />
      </div>

      {/* Top breakdowns */}
      <TopBreakdownsSection
        categories={data.topBreakdowns.categories}
        platforms={data.topBreakdowns.platforms}
        topSeeds={data.topBreakdowns.topSeeds}
      />
    </div>
  )
}

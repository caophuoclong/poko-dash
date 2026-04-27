import { useState } from 'react'
import type { DashboardRange } from '#/dtos/dashboard'
import { useDashboardOverview } from '../hooks/use-dashboard'
import { DashboardHeader } from './DashboardHeader'
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
import { Plus } from 'lucide-react'

export default function DashboardPage() {
  const [selectedRange, setSelectedRange] = useState<DashboardRange>('7d')
  const navigate = useNavigate()

  const { data, isLoading, isError, refetch, isRefetching } =
    useDashboardOverview(selectedRange)
  console.log('🚀 ~ DashboardPage ~ data:', data)

  const handleRefresh = () => {
    refetch()
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <DashboardHeader
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
          onRefresh={handleRefresh}
          isRefreshing={isRefetching}
        />
        <DashboardSkeleton />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <DashboardHeader
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
          onRefresh={handleRefresh}
          isRefreshing={isRefetching}
        />
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
    (data.pipelineSnapshot || []).every((status) => status.count === 0) &&
    (data.attentionItems || []).length === 0 &&
    (data.upcomingSchedule || []).length === 0

  if (isEmpty) {
    return (
      <div className="space-y-6">
        <DashboardHeader
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
          onRefresh={handleRefresh}
          isRefreshing={isRefetching}
        />
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
      <DashboardHeader
        selectedRange={selectedRange}
        onRangeChange={setSelectedRange}
        onRefresh={handleRefresh}
        isRefreshing={isRefetching}
      />

      {/* Summary cards */}
      <SummaryCardGrid cards={data.summaryCards} />

      {/* Pipeline snapshot */}
      <PipelineSnapshot statuses={data.pipelineSnapshot} />

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

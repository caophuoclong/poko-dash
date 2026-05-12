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
import {
  ArrowRight,
  Bot,
  CalendarClock,
  CheckCircle2,
  Link2,
  Package,
  PenLine,
  Plus,
  RefreshCw,
  Rocket,
  Sparkles,
} from 'lucide-react'
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
    return <DashboardEmptyState navigate={navigate} />
  }
  const [] = data.trendSeries.map((series) => {})
  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <SummaryCardGrid cards={data.summaryCards} />

      {/* Pipeline snapshot */}
      {/* <PipelineSnapshot statuses={data.pipelineSnapshot} /> */}

      {/* Trend charts */}
      <TrendChartsSection trendSeries={data.trendSeries} />

      {/* Two-column layout for attention and schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <AttentionList items={data.attentionItems} />
        <UpcomingScheduleList items={data.upcomingSchedule} />
      </div>

      {/* Top breakdowns */}
      <TopBreakdownsSection categories={data.topBreakdowns} />
    </div>
  )
}

const pipelineSteps = [
  {
    label: 'Seed',
    detail: 'Capture hook',
    icon: <Sparkles size={16} />,
  },
  {
    label: 'Draft',
    detail: 'Generate post',
    icon: <PenLine size={16} />,
  },
  {
    label: 'Schedule',
    detail: 'Pick channel',
    icon: <CalendarClock size={16} />,
  },
  {
    label: 'Track',
    detail: 'Measure links',
    icon: <Link2 size={16} />,
  },
]

const starterCards = [
  {
    title: 'Content seeds',
    value: '0',
    detail: 'Start with a hook, product, and target platform.',
  },
  {
    title: 'Scheduled posts',
    value: '0',
    detail: 'Generated posts will queue here before publishing.',
  },
  {
    title: 'Tracked products',
    value: '0',
    detail: 'Products power reviews, deals, and comparisons.',
  },
]

function DashboardEmptyState({
  navigate,
}: {
  navigate: ReturnType<typeof useNavigate>
}) {
  return (
    <div className="grid min-h-[calc(100vh-7rem)] items-start gap-6 pt-6 md:pt-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(520px,1.1fr)] lg:pt-24">
      <section className="max-w-xl space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent-orange-border bg-accent-orange-dim px-3 py-1 text-xs font-semibold text-accent-orange">
          <Rocket size={14} />
          Affiliate pipeline cockpit
        </div>
        <div className="space-y-3">
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-[var(--color-ink)] md:text-5xl">
            Build the first content pipeline.
          </h1>
          <p className="max-w-lg text-sm leading-6 text-[var(--color-muted)] md:text-base">
            Create a seed, attach products, generate channel-ready posts, and
            watch publishing metrics appear here as the pipeline starts moving.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={() => navigate({ to: '/dash/content/new' })}
            className="h-11 px-4"
          >
            <Plus size={16} />
            Create first seed
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate({ to: '/dash/products/manual-import' })}
            className="h-11 px-4"
          >
            <Package size={16} />
            Import products
          </Button>
        </div>
      </section>

      <section className="rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-[color-mix(in_srgb,var(--color-surface)_88%,var(--color-accent-orange)_4%)] p-4 shadow-[0_24px_70px_color-mix(in_srgb,var(--color-void)_18%,transparent)]">
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-[var(--color-hairline)] pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Launch plan
            </p>
            <h2 className="mt-1 font-display text-xl font-semibold text-[var(--color-ink)]">
              Today&apos;s pipeline
            </h2>
          </div>
          <div className="rounded-full border border-accent-green-border bg-accent-green-dim px-3 py-1 text-xs font-semibold text-accent-green">
            Ready
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          {pipelineSteps.map((step, index) => (
            <div
              key={step.label}
              className="relative rounded-[var(--radius-sm)] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-3"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex size-8 items-center justify-center rounded-[var(--radius-xs)] bg-accent-orange-dim text-accent-orange">
                  {step.icon}
                </div>
                {index < pipelineSteps.length - 1 ? (
                  <ArrowRight
                    size={15}
                    className="hidden text-[var(--color-muted)] md:block"
                  />
                ) : (
                  <CheckCircle2 size={15} className="text-accent-green" />
                )}
              </div>
              <p className="text-sm font-semibold text-[var(--color-ink)]">
                {step.label}
              </p>
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                {step.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {starterCards.map((card) => (
            <div
              key={card.title}
              className="rounded-[var(--radius-sm)] border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                  {card.title}
                </p>
                <Bot size={15} className="text-[var(--color-muted-soft)]" />
              </div>
              <p className="mt-5 font-body text-3xl font-semibold tabular-nums text-[var(--color-ink)]">
                {card.value}
              </p>
              <p className="mt-2 text-xs leading-5 text-[var(--color-muted)]">
                {card.detail}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

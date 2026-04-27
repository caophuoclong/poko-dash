import { TrendingUp, TrendingDown } from 'lucide-react'
import type { DashboardSummaryCard } from '#/dtos/dashboard'
import { cn } from '#/shared/utils'

interface SummaryCardGridProps {
  cards: DashboardSummaryCard[]
}

export function SummaryCardGrid({ cards }: SummaryCardGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card, index) => (
        <SummaryCard key={index} card={card} />
      ))}
    </div>
  )
}

interface SummaryCardProps {
  card: DashboardSummaryCard
}

function SummaryCard({ card }: SummaryCardProps) {
  return (
    <div className="rounded-lg border border-frost bg-surface p-4 space-y-2">
      <p className="text-xs font-medium text-muted-text">{card.label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-near-white tabular-nums">
          {card.value.toLocaleString()}
        </p>
        {card.delta && (
          <div
            className={cn(
              'inline-flex items-center gap-0.5 text-xs font-medium',
              card.delta.isPositive ? 'text-accent-green' : 'text-accent-red',
            )}
          >
            {card.delta.isPositive ? (
              <TrendingUp size={12} strokeWidth={2.5} />
            ) : (
              <TrendingDown size={12} strokeWidth={2.5} />
            )}
            <span>{Math.abs(card.delta.value)}%</span>
          </div>
        )}
      </div>
      {card.helper && (
        <p className="text-[11px] text-muted-text/70">{card.helper}</p>
      )}
    </div>
  )
}

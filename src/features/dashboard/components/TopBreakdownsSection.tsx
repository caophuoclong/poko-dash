import type { DashboardBreakdownItem } from '#/dtos/dashboard'
import { cn } from '#/shared/utils'

interface TopBreakdownsSectionProps {
  categories: DashboardBreakdownItem[]
  platforms: DashboardBreakdownItem[]
  topSeeds: DashboardBreakdownItem[]
}

export function TopBreakdownsSection({
  categories,
  platforms,
  topSeeds,
}: TopBreakdownsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <BreakdownCard title="Top categories" items={categories} />
      <BreakdownCard title="Top platforms" items={platforms} />
      <BreakdownCard title="Top seeds" items={topSeeds} />
    </div>
  )
}

interface BreakdownCardProps {
  title: string
  items: DashboardBreakdownItem[]
}

function BreakdownCard({ title, items }: BreakdownCardProps) {
  const maxValue = Math.max(...items.map((i) => i.value), 1)

  return (
    <div className="rounded-lg border border-frost bg-surface p-4">
      <h4 className="text-xs font-medium text-muted-text mb-3">{title}</h4>
      {items.length === 0 ? (
        <div className="py-4 text-center text-xs text-muted-text/50">
          No data available
        </div>
      ) : (
        <div className="space-y-2">
          {items.slice(0, 5).map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-near-white font-medium truncate">
                  {item.label}
                </span>
                <span className="text-muted-text tabular-nums ml-2">
                  {item.value}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    index === 0
                      ? 'bg-accent-orange'
                      : index === 1
                        ? 'bg-accent-blue'
                        : index === 2
                          ? 'bg-accent-green'
                          : 'bg-frost',
                  )}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

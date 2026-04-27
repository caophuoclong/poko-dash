import type { DashboardTrendSeries } from '#/dtos/dashboard'
import { format, parseISO } from 'date-fns'

interface TrendChartsSectionProps {
  postsGenerated: DashboardTrendSeries
  postsPublished: DashboardTrendSeries
  seedsApproved: DashboardTrendSeries
}

export function TrendChartsSection({
  postsGenerated,
  postsPublished,
  seedsApproved,
}: TrendChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <TrendChart
        title="Posts generated"
        data={postsGenerated.data}
        color="#F97316"
      />
      <TrendChart
        title="Posts published"
        data={postsPublished.data}
        color="#3B82F6"
      />
      <TrendChart
        title="Seeds approved"
        data={seedsApproved.data}
        color="#10B981"
      />
    </div>
  )
}

interface TrendChartProps {
  title: string
  data: DashboardTrendSeries['data']
  color: string
}

function TrendChart({ title, data, color }: TrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-frost bg-surface p-4">
        <h4 className="text-xs font-medium text-muted-text mb-3">{title}</h4>
        <div className="h-24 flex items-center justify-center text-xs text-muted-text/50">
          No data available
        </div>
      </div>
    )
  }

  const values = data.map((d) => d.value)
  const max = Math.max(...values, 1)
  const total = values.reduce((sum, v) => sum + v, 0)
  const avg = values.length > 0 ? total / values.length : 0

  // Simple sparkline with SVG
  const width = 300
  const height = 60
  const padding = 4

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1 || 1)) * (width - padding * 2) + padding
    const y = height - (point.value / max) * (height - padding * 2) - padding
    return { x, y, value: point.value, date: point.date }
  })

  const pathData = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  const areaPath = `${pathData} L ${width - padding} ${height} L ${padding} ${height} Z`

  return (
    <div className="rounded-lg border border-frost bg-surface p-4">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-xs font-medium text-muted-text">{title}</h4>
        <div className="text-right">
          <p className="text-lg font-bold text-near-white tabular-nums">
            {total}
          </p>
          <p className="text-[11px] text-muted-text/70">avg {avg.toFixed(1)}</p>
        </div>
      </div>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full"
      >
        {/* Area fill */}
        <path d={areaPath} fill={color} fillOpacity="0.1" />
        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Points */}
        {points.map((point, i) => (
          <g key={i}>
            <circle cx={point.x} cy={point.y} r="3" fill={color} opacity="0.8">
              <title>
                {format(parseISO(point.date), 'MMM d')}: {point.value}
              </title>
            </circle>
          </g>
        ))}
      </svg>
    </div>
  )
}

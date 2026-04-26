import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dash/analytics')({
  component: AnalyticsPage,
})

function AnalyticsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-near-white">Thống kê</h1>
    </div>
  )
}

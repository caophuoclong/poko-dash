import { createFileRoute } from '@tanstack/react-router'
import { SimplePage } from '#/components/ui/simple-page'
import { BarChart } from 'lucide-react'

export const Route = createFileRoute('/dash/analytics')({
  component: AnalyticsPage,
})

function AnalyticsPage() {
  return <SimplePage title="Thống kê" subtitle="Xem báo cáo và phân tích dữ liệu" icon={BarChart} />
}

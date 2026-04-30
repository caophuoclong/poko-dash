import { createFileRoute } from '@tanstack/react-router'
import { usePageHeader } from '#/components/ui/page-header-context'

export const Route = createFileRoute('/dash/analytics')({
  component: AnalyticsPage,
})

function AnalyticsPage() {
  usePageHeader({
    title: 'Thống kê',
    subtitle: 'Xem báo cáo và phân tích dữ liệu',
  })

  return (
    <div className="p-6 text-center text-muted-text">
      Analytics coming soon...
    </div>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { usePageHeader } from '#/components/ui/page-header-context'

export const Route = createFileRoute('/dash/pages')({
  component: PagesPage,
})

function PagesPage() {
  usePageHeader({
    title: 'Facebook Pages',
    subtitle: 'Quản lý các trang Facebook đã kết nối',
  })

  return (
    <div className="p-6 text-center text-muted-text">
      Pages coming soon...
    </div>
  )
}

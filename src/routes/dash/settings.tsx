import { createFileRoute } from '@tanstack/react-router'
import { usePageHeader } from '#/components/ui/page-header-context'

export const Route = createFileRoute('/dash/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  usePageHeader({
    title: 'Cài đặt',
    subtitle: 'Quản lý cấu hình hệ thống',
  })

  return (
    <div className="p-6 text-center text-muted-text">
      Settings coming soon...
    </div>
  )
}

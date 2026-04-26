import { createFileRoute } from '@tanstack/react-router'
import { SimplePage } from '#/components/ui/simple-page'
import { Settings } from 'lucide-react'

export const Route = createFileRoute('/dash/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return <SimplePage title="Cài đặt" subtitle="Quản lý cấu hình hệ thống" icon={Settings} />
}

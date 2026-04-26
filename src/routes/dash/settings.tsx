import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dash/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-near-white">Cài đặt</h1>
    </div>
  )
}

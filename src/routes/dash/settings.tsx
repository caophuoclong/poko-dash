import { createFileRoute } from '@tanstack/react-router'
import { SettingsPage } from '#/features/settings/components/SettingsPage'

export const Route = createFileRoute('/dash/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SettingsPage />
}

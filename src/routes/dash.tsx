import { Outlet, createFileRoute } from '@tanstack/react-router'
import Sidebar from '#/components/layout/sidebar'
import { PageHeaderSlot } from '#/components/ui/page-header-context'

export const Route = createFileRoute('/dash')({
  component: DashLayout,
})

function DashLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 pt-0">
        <PageHeaderSlot />
        <Outlet />
      </main>
    </div>
  )
}

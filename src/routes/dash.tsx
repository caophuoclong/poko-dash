import { Outlet, createFileRoute } from '@tanstack/react-router'
import Sidebar from '#/layout/sidebar'

export const Route = createFileRoute('/dash')({
  component: DashLayout,
})

function DashLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}

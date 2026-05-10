import { Outlet, createFileRoute } from '@tanstack/react-router'
import Sidebar from '#/components/layout/sidebar'
import { PageHeaderSlot } from '#/components/ui/page-header-context'
import { SidebarInset, SidebarProvider } from '#/components/ui/sidebar'

export const Route = createFileRoute('/dash')({
  component: DashLayout,
})

function DashLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen overflow-hidden w-full">
        <Sidebar />
        <SidebarInset className="overflow-y-auto p-4 pt-0">
          <PageHeaderSlot />
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

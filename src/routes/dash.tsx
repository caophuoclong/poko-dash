import { Outlet, createFileRoute } from '@tanstack/react-router'
import Sidebar from '#/components/layout/sidebar'
import { Topbar } from '#/components/layout/topbar'
import { SidebarInset, SidebarProvider } from '#/components/ui/sidebar'
import { CommandPalette } from '#/components/patterns/command-palette'

export const Route = createFileRoute('/dash')({
  component: DashLayout,
})

function DashLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen overflow-hidden w-full">
        <Sidebar />
        <SidebarInset className="flex flex-col overflow-hidden">
          <Topbar />
          <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
      <CommandPalette />
    </SidebarProvider>
  )
}

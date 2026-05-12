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
      <div className="flex h-screen w-full overflow-hidden bg-[var(--color-void)]">
        <Sidebar />
        <SidebarInset className="flex flex-col overflow-hidden bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-surface-soft)_32%,transparent)_0%,transparent_26rem),var(--color-void)]">
          <Topbar />
          <div className="flex-1 overflow-y-auto px-4 py-4 lg:px-6">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
      <CommandPalette />
    </SidebarProvider>
  )
}

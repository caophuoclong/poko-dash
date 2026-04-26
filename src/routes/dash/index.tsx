import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dash/')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-near-white">Dashboard</h1>
      <p className="mt-2 text-muted-text">Welcome to Poko Dashboard</p>
    </div>
  )
}

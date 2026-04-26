import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dash/pages')({
  component: PagesPage,
})

function PagesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-near-white">Facebook Pages</h1>
    </div>
  )
}

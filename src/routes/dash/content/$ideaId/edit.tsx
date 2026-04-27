import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dash/content/$ideaId/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dash/content/$ieadId/edit"!</div>
}

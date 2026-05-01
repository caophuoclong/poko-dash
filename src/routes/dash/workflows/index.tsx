import { createFileRoute } from '@tanstack/react-router'
import { WorkflowIndexPage } from '#/features/workflow/components/workflow-index-page'

interface WorkflowsSearch {
  search?: string
  status?: string
}

export const Route = createFileRoute('/dash/workflows/')({
  validateSearch: (search: Record<string, unknown>): WorkflowsSearch => ({
    search: typeof search.search === 'string' ? search.search : undefined,
    status: typeof search.status === 'string' ? search.status : undefined,
  }),
  component: WorkflowIndexPage,
})

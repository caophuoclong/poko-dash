import { createFileRoute } from '@tanstack/react-router'
import { WorkflowDetailPage } from '#/features/workflow/components/workflow-detail-page'
import { mockWorkflowDetails } from '#/features/workflow/data/mock-workflows'

function WorkflowEditorRoute() {
  const { workflowId } = Route.useParams()
  const workflow = mockWorkflowDetails[workflowId]

  if (!workflow) {
    return (
      <div className="h-screen flex items-center justify-center bg-void">
        <div className="text-center">
          <p className="text-lg font-semibold text-near-white mb-1">
            Workflow not found
          </p>
          <p className="text-sm text-muted-text mb-4">
            The workflow &ldquo;{workflowId}&rdquo; does not exist.
          </p>
          <a
            href="/dash/workflows"
            className="text-sm text-accent-blue hover:underline"
          >
            Back to workflows
          </a>
        </div>
      </div>
    )
  }

  return <WorkflowDetailPage workflow={workflow} />
}

export const Route = createFileRoute('/workflow/$workflowId')({
  component: WorkflowEditorRoute,
})

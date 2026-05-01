import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Loader2, ArrowLeft } from 'lucide-react'
import { WorkflowDetailPage } from '#/features/workflow/components/workflow-detail-page'
import { useWorkflow } from '#/features/workflow/hooks/use-workflows'
import { Button } from '#/components/ui/button'

function WorkflowEditorRoute() {
  const { workflowId } = Route.useParams()
  const navigate = useNavigate()
  const { data: workflow, isLoading, isError } = useWorkflow(workflowId)

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-void">
        <Loader2 size={24} className="animate-spin text-muted-text" />
      </div>
    )
  }

  if (isError || !workflow) {
    return (
      <div className="h-screen flex items-center justify-center bg-void">
        <div className="text-center">
          <p className="text-lg font-semibold text-near-white mb-1">
            Workflow not found
          </p>
          <p className="text-sm text-muted-text mb-4">
            The workflow &ldquo;{workflowId}&rdquo; does not exist.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: '/dash/workflows' })}
          >
            <ArrowLeft size={14} />
            Back to workflows
          </Button>
        </div>
      </div>
    )
  }

  return <WorkflowDetailPage workflow={workflow} />
}

export const Route = createFileRoute('/workflow/$workflowId')({
  component: WorkflowEditorRoute,
})

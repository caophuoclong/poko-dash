import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useWorkflows, useCreateWorkflow, useDeleteWorkflow } from './use-workflows'

export function useWorkflowIndexPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const { data: workflows = [], isLoading, isError, refetch } = useWorkflows()
  const createWorkflow = useCreateWorkflow()
  const deleteWorkflow = useDeleteWorkflow()

  const filtered = workflows.filter((wf) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      wf.name.toLowerCase().includes(q) ||
      wf.description.toLowerCase().includes(q)
    )
  })

  const handleCreate = () => {
    createWorkflow.mutate(
      { data: { name: 'New Workflow' } },
      {
        onSuccess: (res: any) => {
          const data = res?.data
          if (data?.id) {
            navigate({
              to: '/workflow/$workflowId',
              params: { workflowId: data.id },
            })
          }
        },
      },
    )
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    deleteWorkflow.mutate(id)
  }

  return {
    search,
    setSearch,
    workflows,
    filtered,
    isLoading,
    isError,
    refetch,
    createWorkflow,
    deleteWorkflow,
    handleCreate,
    handleDelete,
  }
}

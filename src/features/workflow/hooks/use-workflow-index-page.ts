import { useState, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  useWorkflows,
  useCreateWorkflow,
  useDeleteWorkflow,
} from './use-workflows'

type SortOption = 'updated' | 'name' | 'runs' | 'successRate'

export function useWorkflowIndexPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [sortOption, setSortOption] = useState<SortOption>('updated')
  const { data: workflows = [], isLoading, isError, refetch } = useWorkflows()
  const createWorkflow = useCreateWorkflow()
  const deleteWorkflow = useDeleteWorkflow()

  const filtered = useMemo(() => {
    let result = workflows.filter((wf) => {
      if (statusFilter && wf.status !== statusFilter) return false
      if (!search) return true
      const q = search.toLowerCase()
      return (
        wf.name.toLowerCase().includes(q) ||
        wf.description.toLowerCase().includes(q)
      )
    })

    result = [...result].sort((a, b) => {
      switch (sortOption) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'runs':
          return (
            (b.executionStats?.totalRuns ?? 0) -
            (a.executionStats?.totalRuns ?? 0)
          )
        case 'successRate':
          return (
            (b.executionStats?.successRate ?? 0) -
            (a.executionStats?.successRate ?? 0)
          )
        case 'updated':
        default:
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
      }
    })

    return result
  }, [workflows, search, statusFilter, sortOption])

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
    statusFilter,
    setStatusFilter,
    sortOption,
    setSortOption,
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

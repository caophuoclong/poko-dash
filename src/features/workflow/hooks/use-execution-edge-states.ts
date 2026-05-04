import { useQueryClient } from '@tanstack/react-query'
import { getExecutionControllerGetExecutionQueryKey } from '#/api/client'
import { useExecutionStore } from '../stores/execution-store'
import type { ExecutionCacheData } from '../types'

function useExecutionEdgeStates() {
  const queryClient = useQueryClient()
  const executionId = useExecutionStore((s) => s.executionId)
  const running = useExecutionStore((s) => s.running)

  if (!running || !executionId) return null

  const queryKey = getExecutionControllerGetExecutionQueryKey(executionId)
  const data = queryClient.getQueryData(queryKey) as
    | ExecutionCacheData
    | undefined

  return data?.nodes ?? null
}

export { useExecutionEdgeStates }

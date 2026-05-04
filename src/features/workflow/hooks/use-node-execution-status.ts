import { useQueryClient } from '@tanstack/react-query'
import { useSyncExternalStore, useCallback } from 'react'
import { getExecutionControllerGetExecutionQueryKey } from '#/api/client'
import { useExecutionStore } from '../stores/execution-store'
import type { NodeExecutionStatus } from '../utils/execution-engine'
import type { ExecutionCacheData } from '../types'

function mapCacheStatusToExecutionStatus(
  cacheStatus: string | undefined,
): NodeExecutionStatus {
  switch (cacheStatus) {
    case 'running':
      return 'running'
    case 'completed':
      return 'success'
    case 'failed':
      return 'error'
    case 'pending':
      return 'pending'
    default:
      return 'idle'
  }
}

export function useNodeExecutionStatus(nodeId: string): NodeExecutionStatus {
  const queryClient = useQueryClient()
  const executionId = useExecutionStore((s) => s.executionId)
  const running = useExecutionStore((s) => s.running)

  const queryKey = executionId
    ? getExecutionControllerGetExecutionQueryKey(executionId)
    : null

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!queryKey) return () => {}
      const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
        if (
          event.type === 'updated' &&
          event.query.queryHash === JSON.stringify(queryKey)
        ) {
          onStoreChange()
        }
      })
      return unsubscribe
    },
    [queryKey],
  )

  const getSnapshot = useCallback((): NodeExecutionStatus => {
    if (!running || !queryKey) return 'idle'
    const data = queryClient.getQueryData(queryKey) as
      | ExecutionCacheData
      | undefined
    const nodeExec = data?.nodes?.find((n) => n.nodeId === nodeId)
    return mapCacheStatusToExecutionStatus(nodeExec?.status)
  }, [running, queryKey, nodeId])

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

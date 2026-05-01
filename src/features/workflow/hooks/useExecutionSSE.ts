import { useEffect, useRef, useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  getExecutionControllerGetExecutionQueryKey,
} from '#/api/client'
import { useExecutionStore } from '../stores/execution-store'

type SseEventType =
  | 'node.started'
  | 'node.completed'
  | 'node.failed'
  | 'execution.completed'
  | 'execution.failed'

interface SseEventPayload {
  type: SseEventType
  executionId: string
  nodeId?: string
  nodeTitle?: string
  status?: string
  outputSummary?: Record<string, unknown>
  error?: string
  durationMs?: number
}

interface NodeExecutionData {
  nodeId: string
  title?: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  outputSummary?: Record<string, unknown>
  error?: string
  durationMs?: number
}

interface ExecutionCacheData {
  id: string
  workflowId?: string
  status: 'running' | 'completed' | 'failed' | 'cancelled' | 'pending'
  startedAt?: string
  completedAt?: string
  nodes?: NodeExecutionData[]
}

const MAX_RETRIES = 5
const BASE_DELAY_MS = 1000

function getAuthToken(): string | null {
  try {
    const stored = localStorage.getItem('token')
    if (stored) return stored

    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/)
      if (match) return decodeURIComponent(match[1])
    }

    return null
  } catch {
    return null
  }
}

export function useExecutionSSE(executionId: string | null) {
  const queryClient = useQueryClient()
  const store = useExecutionStore()
  const [isConnected, setIsConnected] = useState(false)
  const [lastEvent, setLastEvent] = useState<SseEventPayload | null>(null)
  const esRef = useRef<EventSource | null>(null)
  const retryCountRef = useRef(0)
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const queryKey = executionId
    ? getExecutionControllerGetExecutionQueryKey(executionId)
    : null

  const closeEventSource = useCallback(() => {
    if (esRef.current) {
      esRef.current.close()
      esRef.current = null
    }
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current)
      retryTimerRef.current = null
    }
    setIsConnected(false)
  }, [])

  const connect = useCallback(() => {
    if (!executionId) return

    closeEventSource()

    const token = getAuthToken()
    const url = `/api/workflows/${executionId}/events`
    const urlWithToken = token ? `${url}?token=${encodeURIComponent(token)}` : url

    const es = new EventSource(urlWithToken)
    esRef.current = es

    es.onopen = () => {
      setIsConnected(true)
      retryCountRef.current = 0
    }

    es.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as SseEventPayload
        setLastEvent(payload)

        patchQueryCache(payload)

        store.addLog({
          nodeId: payload.nodeId ?? '',
          nodeTitle: payload.nodeTitle ?? '',
          level:
            payload.type === 'node.failed' || payload.type === 'execution.failed'
              ? 'error'
              : payload.type === 'execution.completed'
                ? 'success'
                : 'info',
          message: formatLogMessage(payload),
          duration: payload.durationMs,
        })

        if (
          payload.type === 'execution.completed' ||
          payload.type === 'execution.failed'
        ) {
          const terminalStatus =
            payload.type === 'execution.completed' ? 'completed' : 'failed'
          patchQueryCache(payload, terminalStatus)

          if (payload.type === 'execution.completed') {
            store.completeExecution()
          } else {
            store.failExecution(payload.error ?? 'Execution failed')
          }

          closeEventSource()
        }
      } catch {
        // malformed event data, ignore
      }
    }

    es.onerror = () => {
      setIsConnected(false)
      es.close()

      if (retryCountRef.current < MAX_RETRIES) {
        const delay = BASE_DELAY_MS * Math.pow(2, retryCountRef.current)
        retryCountRef.current++
        retryTimerRef.current = setTimeout(connect, delay)
      }
    }
  }, [executionId])

  const patchQueryCache = useCallback(
    (payload: SseEventPayload, terminalStatus?: string) => {
      if (!queryKey) return

      const cached = queryClient.getQueryData(queryKey) as
        | ExecutionCacheData
        | undefined

      const current: ExecutionCacheData = cached ?? {
        id: payload.executionId,
        status: 'running',
        nodes: [],
      }

      if (terminalStatus) {
        queryClient.setQueryData(queryKey, {
          ...current,
          status: terminalStatus as ExecutionCacheData['status'],
          completedAt: new Date().toISOString(),
        } as ExecutionCacheData)
        return
      }

      if (payload.nodeId) {
        const nodes = current.nodes ? [...current.nodes] : []
        const nodeIndex = nodes.findIndex((n) => n.nodeId === payload.nodeId)

        if (nodeIndex >= 0) {
          nodes[nodeIndex] = {
            ...nodes[nodeIndex],
            nodeId: payload.nodeId,
            title: payload.nodeTitle ?? nodes[nodeIndex].title,
            status:
              payload.type === 'node.started'
                ? 'running'
                : payload.type === 'node.completed'
                  ? 'completed'
                  : payload.type === 'node.failed'
                    ? 'failed'
                    : nodes[nodeIndex].status,
            outputSummary:
              payload.outputSummary ?? nodes[nodeIndex].outputSummary,
            error: payload.error ?? nodes[nodeIndex].error,
            durationMs: payload.durationMs ?? nodes[nodeIndex].durationMs,
          }
        } else {
          nodes.push({
            nodeId: payload.nodeId,
            title: payload.nodeTitle,
            status:
              payload.type === 'node.started'
                ? 'running'
                : payload.type === 'node.completed'
                  ? 'completed'
                  : 'failed',
            outputSummary: payload.outputSummary,
            error: payload.error,
            durationMs: payload.durationMs,
          })
        }

        queryClient.setQueryData(queryKey, {
          ...current,
          status:
            current.status === 'pending' ? 'running' : current.status,
          nodes,
        } as ExecutionCacheData)
      }
    },
    [queryKey],
  )

  useEffect(() => {
    connect()
    return () => {
      closeEventSource()
    }
  }, [connect])

  return { isConnected, lastEvent }
}

function formatLogMessage(payload: SseEventPayload): string {
  const nodeLabel = payload.nodeTitle ?? payload.nodeId ?? ''

  switch (payload.type) {
    case 'node.started':
      return nodeLabel ? `${nodeLabel}: Started` : 'Node started'
    case 'node.completed':
      return nodeLabel
        ? `${nodeLabel}: Completed${payload.durationMs != null ? ` (${payload.durationMs}ms)` : ''}`
        : 'Node completed'
    case 'node.failed':
      return nodeLabel
        ? `${nodeLabel}: Failed — ${payload.error ?? 'unknown error'}`
        : `Node failed — ${payload.error ?? 'unknown error'}`
    case 'execution.completed':
      return 'Execution completed successfully'
    case 'execution.failed':
      return `Execution failed: ${payload.error ?? 'unknown error'}`
  }
}

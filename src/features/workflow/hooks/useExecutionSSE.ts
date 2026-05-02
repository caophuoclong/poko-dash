import { useEffect, useRef, useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  getExecutionControllerGetExecutionQueryKey,
} from '#/api/client'
import { useExecutionStore } from '../stores/execution-store'

interface SseEventData {
  runId: string
  workflowId: string
  nodeId: string
  nodeTypeId: string
  status: string
  output?: { items?: unknown[]; count?: number; [key: string]: unknown }
  timestamp: string
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

export function useExecutionSSE(workflowId: string | null) {
  const queryClient = useQueryClient()
  const store = useExecutionStore()
  const [isConnected, setIsConnected] = useState(false)
  const esRef = useRef<EventSource | null>(null)
  const retryCountRef = useRef(0)
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const nodeStartTimesRef = useRef<Map<string, number>>(new Map())

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
    retryCountRef.current = 0
    nodeStartTimesRef.current.clear()
  }, [])

  const addNodeToCache = useCallback(
    (queryKey: readonly string[], runId: string, nodeId: string, status: 'running' | 'completed' | 'failed', outputSummary?: Record<string, unknown>) => {
      const cached = queryClient.getQueryData(queryKey) as
        | ExecutionCacheData
        | undefined

      const current: ExecutionCacheData = cached ?? {
        id: runId,
        status: 'running',
        nodes: [],
      }

      const nodes = current.nodes ? [...current.nodes] : []
      const nodeIndex = nodes.findIndex((n) => n.nodeId === nodeId)

      const nodeEntry: NodeExecutionData = {
        nodeId,
        status,
        outputSummary: outputSummary ?? (nodeIndex >= 0 ? nodes[nodeIndex].outputSummary : undefined),
      }

      if (nodeIndex >= 0) {
        nodes[nodeIndex] = { ...nodes[nodeIndex], ...nodeEntry }
      } else {
        nodes.push(nodeEntry)
      }

      queryClient.setQueryData(queryKey, {
        ...current,
        status: current.status === 'pending' ? 'running' : current.status,
        nodes,
      } as ExecutionCacheData)
    },
    [queryClient],
  )

  const connect = useCallback(() => {
    if (!workflowId) return

    closeEventSource()

    const token = getAuthToken()
    const url = `/api/workflows/${workflowId}/events`
    const urlWithToken = token ? `${url}?token=${encodeURIComponent(token)}` : url

    const es = new EventSource(urlWithToken)
    esRef.current = es

    es.onopen = () => {
      setIsConnected(true)
      retryCountRef.current = 0
    }

    es.addEventListener('connected', () => {
      setIsConnected(true)
    })

    es.addEventListener('run_started', (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data) as SseEventData
        store.setExecutionId(data.runId)
        store.addLog({
          nodeId: '',
          nodeTitle: '',
          level: 'info',
          message: `Execution started (${data.runId.slice(0, 8)})`,
        })
      } catch {
        // ignore
      }
    })

    es.addEventListener('node_started', (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data) as SseEventData
        if (!data.nodeId) return

        nodeStartTimesRef.current.set(data.nodeId, Date.now())

        const queryKey = getExecutionControllerGetExecutionQueryKey(data.runId)
        addNodeToCache(queryKey, data.runId, data.nodeId, 'running')

        store.addLog({
          nodeId: data.nodeId,
          nodeTitle: '',
          level: 'info',
          message: `Started${data.nodeTypeId ? ` (${data.nodeTypeId})` : ''}`,
        })
      } catch {
        // ignore
      }
    })

    es.addEventListener('node_completed', (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data) as SseEventData
        if (!data.nodeId) return

        const startTime = nodeStartTimesRef.current.get(data.nodeId)
        const duration = startTime ? Date.now() - startTime : undefined
        nodeStartTimesRef.current.delete(data.nodeId)

        const outputSummary = data.output
          ? { count: data.output.count, items: data.output.items }
          : undefined

        const queryKey = getExecutionControllerGetExecutionQueryKey(data.runId)
        addNodeToCache(queryKey, data.runId, data.nodeId, 'completed', outputSummary ?? undefined)

        const outputMsg = data.output?.count != null
          ? ` — ${data.output.count} item(s)`
          : ''

        store.addLog({
          nodeId: data.nodeId,
          nodeTitle: '',
          level: 'success',
          message: `Completed${outputMsg}`,
          duration,
        })
      } catch {
        // ignore
      }
    })

    es.addEventListener('run_completed', (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data) as SseEventData

        const queryKey = getExecutionControllerGetExecutionQueryKey(data.runId)
        const cached = queryClient.getQueryData(queryKey) as
          | ExecutionCacheData
          | undefined
        queryClient.setQueryData(queryKey, {
          ...cached,
          id: data.runId,
          status: 'completed' as const,
          completedAt: data.timestamp,
        } as ExecutionCacheData)

        store.completeExecution()
        closeEventSource()
      } catch {
        // ignore
      }
    })

    es.onerror = () => {
      setIsConnected(false)
      es.close()

      if (retryCountRef.current < MAX_RETRIES) {
        const delay = BASE_DELAY_MS * Math.pow(2, retryCountRef.current)
        retryCountRef.current++
        retryTimerRef.current = setTimeout(connect, delay)
      }
    }
  }, [workflowId, closeEventSource, addNodeToCache, store])

  useEffect(() => {
    return () => {
      closeEventSource()
    }
  }, [closeEventSource])

  return { connect, isConnected }
}

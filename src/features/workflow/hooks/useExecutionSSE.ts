import { useEffect, useRef, useState, useCallback } from 'react'
import { useExecutionStore } from '../stores/execution-store/useExecutionStore'
import { useWorkflow } from './use-workflows'
import { useParams, useRouter } from '@tanstack/react-router'

interface SseEventData {
  type: string
  executionId: string
  nodeId?: string
  nodeTitle?: string
  status?: string
  outputSummary?: Record<string, unknown>
  outputData?: Record<string, unknown>
  error?: string
  durationMs?: number
  nodeTypeId?: string
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

export function useExecutionSSE() {
  const store = useExecutionStore()

  const [isConnected, setIsConnected] = useState(false)
  const esRef = useRef<EventSource | null>(null)
  const executionIdRef = useRef<string | null>(null)
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

  const setupEventListeners = useCallback(
    (es: EventSource) => {
      es.addEventListener('connected', () => {
        setIsConnected(true)
      })

      es.addEventListener('execution.started', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data) as SseEventData
          store.setExecutionId(data.executionId)
          store.addLog({
            nodeId: '',
            nodeTitle: '',
            level: 'info',
            message: `Execution started (${data.executionId.slice(0, 8)})`,
          })
        } catch {
          // ignore
        }
      })

      es.addEventListener('node.started', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data) as SseEventData
          if (!data.nodeId) return

          nodeStartTimesRef.current.set(data.nodeId, Date.now())

          store.upsertNodeExecution({
            nodeId: data.nodeId,
            title: data.nodeTitle,
            status: 'running',
          })

          store.addLog({
            nodeId: data.nodeId,
            nodeTitle: data.nodeTitle ?? '',
            level: 'info',
            message: `Started${data.nodeTypeId ? ` (${data.nodeTypeId})` : ''}${data.nodeTitle ? ` — ${data.nodeTitle}` : ''}`,
          })
        } catch {
          // ignore
        }
      })

      es.addEventListener('node.completed', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data) as SseEventData
          if (!data.nodeId) return

          const startTime = nodeStartTimesRef.current.get(data.nodeId)
          const duration = startTime ? Date.now() - startTime : data.durationMs
          nodeStartTimesRef.current.delete(data.nodeId)

          store.upsertNodeExecution({
            nodeId: data.nodeId,
            title: data.nodeTitle,
            status: 'completed',
            outputSummary: data.outputSummary ?? undefined,
            outputData: data.outputData ?? undefined,
          })

          const outputMsg =
            data.outputSummary?.count != null
              ? ` — ${data.outputSummary.count} item(s)`
              : ''

          store.addLog({
            nodeId: data.nodeId,
            nodeTitle: data.nodeTitle ?? '',
            level: 'success',
            message: `Completed${outputMsg}`,
            duration,
          })
        } catch {
          // ignore
        }
      })

      es.addEventListener('node.failed', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data) as SseEventData
          if (!data.nodeId) return

          const startTime = nodeStartTimesRef.current.get(data.nodeId)
          const duration = startTime ? Date.now() - startTime : data.durationMs
          nodeStartTimesRef.current.delete(data.nodeId)

          store.upsertNodeExecution({
            nodeId: data.nodeId,
            title: data.nodeTitle,
            status: 'failed',
            outputSummary: data.outputSummary ?? undefined,
            outputData: data.outputData ?? undefined,
            error: data.error,
          })

          store.addLog({
            nodeId: data.nodeId,
            nodeTitle: data.nodeTitle ?? '',
            level: 'error',
            message: data.error ?? 'Node execution failed',
            duration,
          })
        } catch {
          // ignore
        }
      })

      es.addEventListener('execution.completed', (event: MessageEvent) => {
        try {
          store.completeExecution()
          closeEventSource()
        } catch {
          // ignore
        }
      })

      es.addEventListener('execution.failed', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data) as SseEventData

          store.failExecution(data.error ?? 'Execution failed')
          closeEventSource()
        } catch {
          // ignore
        }
      })
    },
    [store, closeEventSource],
  )

  const createConnection = useCallback(
    (executionId: string) => {
      const token = getAuthToken()
      const url = `/api/executions/${executionId}/events`
      const urlWithToken = token
        ? `${url}?token=${encodeURIComponent(token)}`
        : url

      const es = new EventSource(urlWithToken)
      esRef.current = es
      executionIdRef.current = executionId

      es.onopen = () => {
        setIsConnected(true)
        retryCountRef.current = 0
      }

      setupEventListeners(es)

      es.onerror = () => {
        setIsConnected(false)
        es.close()

        if (retryCountRef.current < MAX_RETRIES) {
          const delay = BASE_DELAY_MS * Math.pow(2, retryCountRef.current)
          retryCountRef.current++
          retryTimerRef.current = setTimeout(
            () => createConnection(executionId),
            delay,
          )
        }
      }
    },
    [setupEventListeners],
  )

  const connect = useCallback(
    (executionId: string) => {
      closeEventSource()
      createConnection(executionId)
    },
    [closeEventSource, createConnection],
  )

  useEffect(() => {
    return () => {
      closeEventSource()
    }
  }, [closeEventSource])

  return { connect, isConnected }
}

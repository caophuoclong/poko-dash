import { useEffect, useRef, useState, useCallback } from 'react'
import { useExecutionStore } from '../stores/execution-store/useExecutionStore'
import type { NodeExecutionData } from '../stores/execution-store/useExecutionStore'
import type { ExecutionLog } from '../stores/execution-store/utils/types'

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

  const storeRef = useRef(store)
  storeRef.current = store

  const bufferRef = useRef<{
    logs: Omit<ExecutionLog, 'timestamp'>[]
    nodeUpdates: NodeExecutionData[]
    rafId: ReturnType<typeof requestAnimationFrame> | null
  }>({ logs: [], nodeUpdates: [], rafId: null })

  const scheduleFlush = useCallback(() => {
    if (bufferRef.current.rafId !== null) return
    bufferRef.current.rafId = requestAnimationFrame(() => {
      bufferRef.current.rafId = null
      const buf = bufferRef.current
      if (buf.logs.length > 0 || buf.nodeUpdates.length > 0) {
        storeRef.current.flushBatch({ logs: buf.logs, nodeUpdates: buf.nodeUpdates })
        buf.logs = []
        buf.nodeUpdates = []
      }
    })
  }, [])

  const flushImmediate = useCallback(() => {
    const buf = bufferRef.current
    if (buf.rafId !== null) {
      cancelAnimationFrame(buf.rafId)
      buf.rafId = null
    }
    if (buf.logs.length > 0 || buf.nodeUpdates.length > 0) {
      storeRef.current.flushBatch({ logs: buf.logs, nodeUpdates: buf.nodeUpdates })
      buf.logs = []
      buf.nodeUpdates = []
    }
  }, [])

  const closeEventSource = useCallback(() => {
    flushImmediate()
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
  }, [flushImmediate])

  const setupEventListeners = useCallback(
    (es: EventSource) => {
      es.addEventListener('connected', () => {
        setIsConnected(true)
      })

      es.addEventListener('execution.started', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data) as SseEventData
          store.setExecutionId(data.executionId)
          bufferRef.current.logs.push({
            nodeId: '',
            nodeTitle: '',
            level: 'info',
            message: `Execution started (${data.executionId.slice(0, 8)})`,
          })
          scheduleFlush()
        } catch {
          // ignore
        }
      })

      es.addEventListener('node.started', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data) as SseEventData
          if (!data.nodeId) return

          nodeStartTimesRef.current.set(data.nodeId, Date.now())

          bufferRef.current.nodeUpdates.push({
            nodeId: data.nodeId,
            title: data.nodeTitle,
            status: 'running',
          })

          bufferRef.current.logs.push({
            nodeId: data.nodeId,
            nodeTitle: data.nodeTitle ?? '',
            level: 'info',
            message: `Started${data.nodeTypeId ? ` (${data.nodeTypeId})` : ''}${data.nodeTitle ? ` — ${data.nodeTitle}` : ''}`,
          })

          scheduleFlush()
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

          bufferRef.current.nodeUpdates.push({
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

          bufferRef.current.logs.push({
            nodeId: data.nodeId,
            nodeTitle: data.nodeTitle ?? '',
            level: 'success',
            message: `Completed${outputMsg}`,
            duration,
          })

          scheduleFlush()
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

          bufferRef.current.nodeUpdates.push({
            nodeId: data.nodeId,
            title: data.nodeTitle,
            status: 'failed',
            outputSummary: data.outputSummary ?? undefined,
            outputData: data.outputData ?? undefined,
            error: data.error,
          })

          bufferRef.current.logs.push({
            nodeId: data.nodeId,
            nodeTitle: data.nodeTitle ?? '',
            level: 'error',
            message: data.error ?? 'Node execution failed',
            duration,
          })

          scheduleFlush()
        } catch {
          // ignore
        }
      })

      es.addEventListener('execution.completed', () => {
        try {
          flushImmediate()
          store.completeExecution()
          closeEventSource()
        } catch {
          // ignore
        }
      })

      es.addEventListener('execution.failed', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data) as SseEventData
          flushImmediate()
          store.failExecution(data.error ?? 'Execution failed')
          closeEventSource()
        } catch {
          // ignore
        }
      })
    },
    [store, closeEventSource, scheduleFlush, flushImmediate],
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

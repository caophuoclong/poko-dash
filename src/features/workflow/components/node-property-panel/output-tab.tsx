import { useState } from 'react'
import type { NodeOutputResult } from '../../types'

export function OutputTab({ result }: { result: NodeOutputResult }) {
  const [showStack, setShowStack] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {result.status === 'success' && (
          <span className="flex items-center gap-1.5 text-accent-green">
            <span className="w-2 h-2 rounded-full bg-accent-green" />
            Success
          </span>
        )}
        {result.status === 'error' && (
          <span className="flex items-center gap-1.5 text-accent-red">
            <span className="w-2 h-2 rounded-full bg-accent-red" />
            Error
          </span>
        )}
        {result.status === 'skipped' && (
          <span className="flex items-center gap-1.5 text-muted-text">
            <span className="w-2 h-2 rounded-full bg-muted-text" />
            Skipped
          </span>
        )}
        <span className="text-[11px] text-muted-text">
          · {result.durationMs}ms
        </span>
      </div>

      <div className="space-y-1 text-[11px]">
        <div className="flex gap-2">
          <span className="text-muted-text shrink-0">Started</span>
          <span className="text-near-white">
            {new Date(result.startedAt).toLocaleString()}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="text-muted-text shrink-0">Finished</span>
          <span className="text-near-white">
            {new Date(result.finishedAt).toLocaleString()}
          </span>
        </div>
      </div>

      {result.inputData != null && (
        <div>
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-text mb-1.5">
            Input
          </h4>
          <pre className="p-3 rounded-lg bg-void border border-frost text-[11px] text-near-white overflow-auto max-h-[300px] font-mono">
            {typeof result.inputData === 'string'
              ? result.inputData
              : JSON.stringify(result.inputData, null, 2)}
          </pre>
        </div>
      )}

      {result.outputData != null && (
        <div>
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-text mb-1.5">
            Output
          </h4>
          <pre className="p-3 rounded-lg bg-void border border-frost text-[11px] text-near-white overflow-auto max-h-[300px] font-mono">
            {typeof result.outputData === 'string'
              ? result.outputData
              : JSON.stringify(result.outputData, null, 2)}
          </pre>
        </div>
      )}

      {result.status === 'error' && result.error && (
        <div>
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-accent-red mb-1.5">
            Error
          </h4>
          <div className="p-3 rounded-lg bg-accent-red/5 border border-accent-red/20">
            <p className="text-[12px] text-accent-red">
              {result.error.message}
            </p>
            {result.error.stack && (
              <>
                <button
                  onClick={() => setShowStack((v) => !v)}
                  className="text-[10px] text-accent-red/70 hover:text-accent-red mt-2 underline"
                >
                  {showStack ? 'Hide' : 'Show'} stack trace
                </button>
                {showStack && (
                  <pre className="mt-2 text-[10px] text-accent-red/60 overflow-auto max-h-[200px] font-mono whitespace-pre-wrap">
                    {result.error.stack}
                  </pre>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

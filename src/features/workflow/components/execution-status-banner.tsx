import { X, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { cn } from '#/shared/utils'
import { Button } from '#/components/ui/button'

interface ExecutionStatusBannerProps {
  status: 'running' | 'completed' | 'failed'
  message: string
  durationMs?: number
  onCancel?: () => void
  onDismiss: () => void
}

export function ExecutionStatusBanner({
  status,
  message,
  durationMs,
  onCancel,
  onDismiss,
}: ExecutionStatusBannerProps) {
  const isRunning = status === 'running'
  const isSuccess = status === 'completed'
  const isError = status === 'failed'

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 px-4 py-2.5 border-b shrink-0',
        isRunning && 'bg-accent-blue/10 border-accent-blue/20',
        isSuccess && 'bg-accent-green/10 border-accent-green/20',
        isError && 'bg-accent-red/10 border-accent-red/20',
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        {isRunning && <Loader2 size={14} className="text-accent-blue animate-spin shrink-0" />}
        {isSuccess && <CheckCircle2 size={14} className="text-accent-green shrink-0" />}
        {isError && <XCircle size={14} className="text-accent-red shrink-0" />}
        <span
          className={cn(
            'text-[12px] font-medium truncate',
            isRunning && 'text-accent-blue',
            isSuccess && 'text-accent-green',
            isError && 'text-accent-red',
          )}
        >
          {message}
        </span>
        {durationMs != null && (
          <span className="text-[11px] text-muted-text shrink-0">
            {(durationMs / 1000).toFixed(1)}s
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {isRunning && onCancel && (
          <Button size="xs" variant="ghost" onClick={onCancel} className="text-accent-blue">
            Cancel
          </Button>
        )}
        {!isRunning && (
          <button
            onClick={onDismiss}
            className="w-5 h-5 flex items-center justify-center rounded text-muted-text hover:text-near-white hover:bg-surface-2 transition-colors"
          >
            <X size={13} />
          </button>
        )}
      </div>
    </div>
  )
}
